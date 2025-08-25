import { Router } from 'express';
import { CreateChatSchema, EditMessageSchema, MODELS, Role } from '../types';
import { createCompletion } from '../openrouter';
import { InMemoryStore } from '../InMemoryStore';
import { authMiddleware } from '../auth-middleware';
import { PrismaClient } from '../generated/prisma';

const prismaClient = new PrismaClient();

const router = Router();

router.get('/conversations/:conversationId', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const conversationId = req.params.conversationId;

    const execution = await prismaClient.execution.findFirst({
        where: {
            id: conversationId,
            userId,
        },
    });

    if (!execution) {
        res.status(404).json({
            message: 'Execution not found',
        });
        return;
    }

    if (execution.type !== 'CONVERSATION') {
        res.status(400).json({
            message: 'Execution is not a conversation',
        });
        return;
    }

    const conversation = await prismaClient.conversation.findFirst({
        where: {
            id: execution?.externalId || '',
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    res.json({
        conversation,
    });
});

// Simplified backend approach - create message first, then stream
router.post('/chat', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { success, data } = CreateChatSchema.safeParse(req.body);

    const conversationId = data?.conversationId;

    if (!success || !conversationId) {
        res.status(411).json({
            message: 'Incorrect inputs',
        });
        return;
    }

    const model = MODELS.find(model => model.id === data.model);
    if (!model) {
        res.status(404).json({
            message: 'Model not found',
        });
        return;
    }

    // Check user credits before processing
    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { credits: true, isPremium: true },
    });

    if (!user) {
        res.status(404).json({
            message: 'User not found',
        });
        return;
    }

    if (model.isPremium && !user?.isPremium) {
        res.status(403).json({
            message: 'Insufficient credits. Please subscribe to continue.',
            credits: user?.credits,
        });
        return;
    }

    const execution = await prismaClient.execution.findFirst({
        where: {
            id: conversationId,
            userId,
        },
    });

    if (execution && execution.type !== 'CONVERSATION') {
        res.status(400).json({
            message: 'Conversation already exists and you are not the owner',
        });
        return;
    }

    if (!execution) {
        await prismaClient.$transaction([
            prismaClient.execution.create({
                data: {
                    id: conversationId,
                    userId,
                    title: data.message.slice(0, 20) + '...',
                    type: 'CONVERSATION',
                    externalId: conversationId,
                },
            }),
            prismaClient.conversation.create({
                data: {
                    id: conversationId,
                },
            }),
        ]);
    }

    if (user.credits <= 0) {
        res.status(403).json({
            message: 'Insufficient credits. Please subscribe to continue.',
            credits: user.credits,
        });
        return;
    }

    let existingMessages = InMemoryStore.getInstance().get(conversationId);

    if (!existingMessages.length) {
        const messages = await prismaClient.message.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        messages.map(message => {
            InMemoryStore.getInstance().add(conversationId, {
                role: message.role as Role,
                content: message.content,
            });
        });
        existingMessages = InMemoryStore.getInstance().get(conversationId);
    }

    // CREATE THE USER MESSAGE FIRST and get its real ID
    const userMessage = await prismaClient.message.create({
        data: {
            conversationId,
            content: data.message,
            role: Role.User,
            isEditable: true,
        },
    });

    // CREATE THE ASSISTANT MESSAGE with empty content and get its real ID
    const assistantMessage = await prismaClient.message.create({
        data: {
            conversationId,
            content: '', // Start with empty content
            role: Role.Agent,
            isEditable: false,
        },
    });

    // SEND THE MESSAGE IDs IMMEDIATELY
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send the message IDs first
    res.write(
        `data: ${JSON.stringify({
            messageIds: {
                userMessageId: userMessage.id,
                assistantMessageId: assistantMessage.id,
            },
        })}\n\n`
    );

    let message = '';

    try {
        await createCompletion(
            [
                ...existingMessages,
                {
                    role: Role.User,
                    content: data.message,
                },
            ],
            data.model,
            (chunk: string) => {
                message += chunk;
                // Format as proper SSE data
                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
            }
        );

        // Send completion signal
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch (error) {
        console.error('Error in completion:', error);
        res.write(`data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`);
    } finally {
        res.end();
    }

    InMemoryStore.getInstance().add(conversationId, {
        role: Role.User,
        content: data.message,
    });

    InMemoryStore.getInstance().add(conversationId, {
        role: Role.Agent,
        content: message,
    });

    // Update the assistant message with the final content and deduct credits
    await prismaClient.$transaction(async tx => {
        await tx.message.update({
            where: { id: assistantMessage.id },
            data: { content: message },
        });

        // Deduct 1 credit for the message
        await tx.user.update({
            where: { id: userId },
            data: {
                credits: {
                    decrement: 1,
                },
            },
        });
    });
});

// Edit message endpoint
router.put('/edit-message', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { success, data } = EditMessageSchema.safeParse(req.body);

    if (!success) {
        res.status(411).json({
            message: 'Incorrect inputs',
        });
        return;
    }

    const { messageId, conversationId, content, model } = data;

    // Verify the conversation belongs to the user
    const execution = await prismaClient.execution.findFirst({
        where: {
            id: conversationId,
            userId,
        },
    });

    if (!execution || execution.type !== 'CONVERSATION') {
        res.status(404).json({
            message: 'Conversation not found',
        });
        return;
    }

    // Find the message to edit with all conditions
    const messageToEdit = await prismaClient.message.findFirst({
        where: {
            id: messageId,
            conversationId: conversationId,
            isEditable: true,
            role: Role.User,
        },
    });

    if (!messageToEdit) {
        res.status(404).json({
            message: 'Message not found or not editable',
        });
        return;
    }

    // Rest of the code remains the same...
    // Check user credits
    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { credits: true, isPremium: true },
    });

    if (!user) {
        res.status(404).json({
            message: 'User not found',
        });
        return;
    }

    const modelConfig = MODELS.find(m => m.id === model);
    if (!modelConfig) {
        res.status(404).json({
            message: 'Model not found',
        });
        return;
    }

    if (modelConfig.isPremium && !user.isPremium) {
        res.status(403).json({
            message: 'Insufficient credits. Please subscribe to continue.',
            credits: user.credits,
        });
        return;
    }

    if (user.credits <= 0) {
        res.status(403).json({
            message: 'Insufficient credits. Please subscribe to continue.',
            credits: user.credits,
        });
        return;
    }

    // Get all messages up to the edited message
    const messages = await prismaClient.message.findMany({
        where: {
            conversationId: conversationId,
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    // Find the index of the message to edit
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) {
        res.status(404).json({
            message: 'Message not found',
        });
        return;
    }

    // Get messages up to the edited message (excluding the edited message and all subsequent messages)
    const messagesUpToEdit = messages.slice(0, messageIndex).map(m => ({
        role: m.role as Role,
        content: m.content,
    }));

    // Add the edited message
    messagesUpToEdit.push({
        role: Role.User,
        content: content,
    });

    // Set proper SSE headers
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let newResponse = '';

    try {
        await createCompletion(messagesUpToEdit, model, (chunk: string) => {
            newResponse += chunk;
            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        });

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch (error) {
        console.error('Error in completion:', error);
        res.write(`data: ${JSON.stringify({ error: 'Failed to generate response' })}\n\n`);
    } finally {
        res.end();
    }

    // Update the edited message and remove all subsequent messages, then add the new response
    await prismaClient.$transaction(async tx => {
        // Update the edited message
        await tx.message.update({
            where: { id: messageId },
            data: { content: content },
        });

        // Delete all messages after the edited message
        await tx.message.deleteMany({
            where: {
                conversationId: conversationId,
                createdAt: {
                    gt: messageToEdit.createdAt,
                },
            },
        });

        // Add the new assistant response
        await tx.message.create({
            data: {
                conversationId: conversationId,
                content: newResponse,
                role: Role.Agent,
                isEditable: false,
            },
        });

        // Deduct 1 credit for the edit
        await tx.user.update({
            where: { id: userId },
            data: {
                credits: {
                    decrement: 1,
                },
            },
        });
    });

    // Update in-memory store
    InMemoryStore.getInstance().clearConversation(conversationId);
});

// Get user credits endpoint
router.get('/credits', authMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { credits: true, isPremium: true },
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.json({
            credits: user.credits,
            isPremium: user.isPremium,
        });
    } catch (error) {
        console.error('Error fetching user credits:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
});

export default router;
