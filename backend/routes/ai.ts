import { Router } from "express";
import { CreateChatSchema, MODELS, Role } from "../types";
import { createCompletion } from "../openrouter";
import { InMemoryStore } from "../InMemoryStore";
import { authMiddleware } from "../auth-middleware";
import { PrismaClient } from "../generated/prisma";

const prismaClient = new PrismaClient();

const router = Router();

/**
 * @swagger
 * /ai/conversations/{conversationId}:
 *   get:
 *     tags: [AI Chat]
 *     summary: Get conversation by ID
 *     description: Retrieve a specific conversation with all messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversation:
 *                   $ref: '#/components/schemas/Conversation'
 *       404:
 *         description: Conversation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/conversations/:conversationId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const conversationId = req.params.conversationId;

    const execution = await prismaClient.execution.findFirst({
        where: {
            id: conversationId,
            userId
        }
    });

    if (!execution) {
        res.status(404).json({
            message: "Execution not found"
        });
        return;
    }

    if (execution.type !== "CONVERSATION") {
        res.status(400).json({
            message: "Execution is not a conversation"
        });
        return;
    }

    const conversation = await prismaClient.conversation.findFirst({
        where: {
            id: execution?.externalId!
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })

    res.json({
        conversation
    });
})

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     tags: [AI Chat]
 *     summary: Send message to AI
 *     description: Send a message to an AI model and receive a streaming response
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - model
 *             properties:
 *               conversationId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional conversation ID (creates new if not provided)
 *               message:
 *                 type: string
 *                 maxLength: 1000
 *                 description: User message to send to AI
 *                 example: "Hello, how are you?"
 *               model:
 *                 type: string
 *                 description: AI model to use
 *                 example: "google/gemini-2.5-flash"
 *                 enum: [
 *                   "google/gemini-2.5-pro",
 *                   "google/gemini-2.5-flash",
 *                   "agentica-org/deepcoder-14b-preview:free",
 *                   "deepseek/deepseek-r1:free"
 *                 ]
 *     responses:
 *       200:
 *         description: Streaming AI response
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               description: Server-sent events with AI response chunks
 *       403:
 *         description: Insufficient credits or premium required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insufficient credits. Please subscribe to continue."
 *                 credits:
 *                   type: integer
 *       404:
 *         description: Model or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       411:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/chat", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const {success, data} = CreateChatSchema.safeParse(req.body);

    const conversationId = data?.conversationId;

    if (!success || !conversationId) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
        return
    }

    const model = MODELS.find((model) => model.id === data.model);
    if (!model) {
        res.status(404).json({
            message: "Model not found"
        });
        return;
    }

    // Check user credits before processing
    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { credits: true, isPremium: true }
    });

    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }

    if (model.isPremium && !user?.isPremium) {
        res.status(403).json({
            message: "Insufficient credits. Please subscribe to continue.",
            credits: user?.credits
        });
        return;
    }

    const execution = await prismaClient.execution.findFirst({
        where: {
            id: conversationId,
            userId
        }
    });
    
    if (execution && execution.type !== "CONVERSATION") {
        res.status(400).json({
            message: "Conversation already exists and you are not the owner"
        });
        return;
    }

    if (!execution) {
        await prismaClient.$transaction([
            prismaClient.execution.create({
                data: {
                    id: conversationId,
                    userId,
                    title: data.message.slice(0, 20) + "...",
                    type: "CONVERSATION",
                    externalId: conversationId
                }
            }),
            prismaClient.conversation.create({
                data: {
                    id: conversationId,
                }
            })
        ]);
    }

    if (user.credits <= 0) {
        res.status(403).json({
            message: "Insufficient credits. Please subscribe to continue.",
            credits: user.credits
        });
        return;
    }

    let existingMessages = InMemoryStore.getInstance().get(conversationId);

    if (!existingMessages.length) {
        const messages = await prismaClient.message.findMany({
            where: {
                conversationId
            }
        })
        messages.map((message) => {
            InMemoryStore.getInstance().add(conversationId, {
                role: message.role as Role,
                content: message.content
            })
        })
        existingMessages = InMemoryStore.getInstance().get(conversationId);
    }

    // Set proper SSE headers
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    let message = "";
    
    try {
        await createCompletion([...existingMessages, {
            role: Role.User,
            content: data.message
        }], data.model, (chunk: string) => {
            message += chunk;
            // Format as proper SSE data
            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        });
        
        // Send completion signal
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        
    } catch (error) {
        console.error("Error in completion:", error);
        res.write(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`);
    } finally {
        res.end(); // Always end the response
    }

    InMemoryStore.getInstance().add(conversationId, {
        role: Role.User,
        content: data.message
    })

    InMemoryStore.getInstance().add(conversationId, {
        role: Role.Agent,
        content: message
    })

    // Save messages and deduct credits in a transaction
    await prismaClient.$transaction([
        prismaClient.message.createMany({
            data: [
                {
                    conversationId,
                    content: data.message,
                    role: Role.User
                },
                {
                    conversationId,
                    content: message,
                    role: Role.Agent,
                },
            ]
        }),
        // Deduct 1 credit for the message
        prismaClient.user.update({
            where: { id: userId },
            data: {
                credits: {
                    decrement: 1
                }
            }
        })
    ])
});

/**
 * @swagger
 * /ai/credits:
 *   get:
 *     tags: [AI Chat]
 *     summary: Get user credits
 *     description: Retrieve current user's available credits and premium status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 credits:
 *                   type: integer
 *                   description: Available credits
 *                   example: 100
 *                 isPremium:
 *                   type: boolean
 *                   description: Premium subscription status
 *                   example: true
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/credits", authMiddleware, async (req, res) => {
    const userId = req.userId;
    
    try {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { credits: true, isPremium: true }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            credits: user.credits,
            isPremium: user.isPremium
        });
    } catch (error) {
        console.error("Error fetching user credits:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

/**
 * @swagger
 * /ai/models:
 *   get:
 *     tags: [AI Chat]
 *     summary: Get available AI models
 *     description: Retrieve list of all available AI models with their details
 *     responses:
 *       200:
 *         description: Models retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 models:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Model'
 */
router.get("/models", (req, res) => {
    res.json({
        models: MODELS
    });
});

export default router;
