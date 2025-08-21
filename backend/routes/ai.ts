import { Router } from "express";
import { CreateChatSchema, Role } from "../types";
import { createCompletion, generateTitleFromUserMessage } from "../openrouter";
import { InMemoryStore } from "../InMemoryStore";
import { authMiddleware } from "../auth-middleware";
import { PrismaClient } from "../generated/prisma";

const prismaClient = new PrismaClient();

const router = Router();

router.get("/conversations", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const conversations = await prismaClient.conversation.findMany({
        where: {
            userId
        }
    })

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

router.post("/chat", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const {success, data} = CreateChatSchema.safeParse(req.body);

    const conversationId = data?.conversationId ?? Bun.randomUUIDv7();

    if (!success) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
        return
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

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    let message = "";
    // EventEmitters
    await createCompletion([...existingMessages, {
        role: Role.User,
        content: data.message
    }], data.model, (chunk: string) => {
        message += chunk;
        res.write(chunk);
    });


    console.log("message");
    console.log(message);

    InMemoryStore.getInstance().add(conversationId, {
        role: Role.User,
        content: data.message
    })

    InMemoryStore.getInstance().add(conversationId, {
        role: Role.Agent,
        content: message
    })

    if (!data.conversationId) {
        const title = await generateTitleFromUserMessage(data.message);
        await prismaClient.conversation.create({
            data: {
                title,
                id: conversationId,
                userId,
            }
        })
    }
    await prismaClient.message.createMany({
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
    })
});

export default router;
