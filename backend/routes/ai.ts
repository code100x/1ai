import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { CreateChatSchema, MODELS, Role } from "../types";
import { createCompletion } from "../openrouter";
import { InMemoryStore } from "../InMemoryStore";
import { authMiddleware } from "../auth-middleware";
import { PrismaClient } from "../generated/prisma";
import { perMinuteLimiterRelaxed } from "../ratelimitter";
import CacheManager from "../redis";

const prismaClient = new PrismaClient();

const router = Router();

router.get("/conversations", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const cacheKey = `conversations:${userId}`;
    
    const cached = await CacheManager.get(cacheKey);
    if (cached) {
        return res.json(JSON.parse(cached));
    }

    const conversations = await prismaClient.conversation.findMany({
        where: {
            userId
        },
        orderBy: {
            updatedAt: "desc"
        }
    })

    await CacheManager.set(cacheKey, JSON.stringify({ conversations }), 300);
    res.json({
        conversations
    });
});

router.get("/conversations/:conversationId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const conversationId = req.params.conversationId;
    const conversation = await prismaClient.conversation.findFirst({
        where: {
            id: conversationId,
            userId
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

router.post("/chat", authMiddleware, perMinuteLimiterRelaxed, async (req, res) => {
    const userId = req.userId;
    const {success, data} = CreateChatSchema.safeParse(req.body);

    const conversationId = data?.conversationId ?? uuidv4();

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

    const conversation = await prismaClient.conversation.findUnique({
        where: {
            id: conversationId
        }
    })
    
    if (conversation && conversation.userId !== userId) {
        res.status(400).json({
            message: "Conversation already exists and you are not the owner"
        });
        return;
    }

    if (!conversation) {
        await prismaClient.conversation.create({
            data: {
                id: conversationId,
                userId,
                title: data.message.slice(0, 20) + "..."
            }
        })
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

    await CacheManager.del(`conversations:${userId}`);
    await CacheManager.del(`conversation:${conversationId}`);

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

// Get user credits endpoint
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

export default router;
