import { Router, type Request, type Response } from "express";
import { CreateChatSchema, Role } from "../types";
import { createCompletion } from "../openrouter";
import { InMemoryStore } from "../InMemoryStore";
import { authMiddleware } from "../auth-middleware";
import { PrismaClient } from "../generated/prisma";
import {
  perDayLimiter,
  perHourLimiter,
  perMinuteLimiter,
} from "../rate-limiter";

const prismaClient = new PrismaClient();

const router = Router();

router.get("/conversations", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const conversations = await prismaClient.conversation.findMany({
      where: {
        userId,
      },
    });
    return res.status(201).json({
      conversations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get(
  "/conversations/:conversationId",
  authMiddleware,
  async (req, res) => {
    const userId = req.userId;
    const { conversationId } = req.params;
    try {
      const conversation = await prismaClient.conversation.findFirst({
        where: {
          id: conversationId,
          userId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!conversation) {
        return res.status(400).json({ message: "conversation not found" });
      }
      return res.json({
        conversation,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

// added ratelimiter here...
router.post(
  "/chat",
  authMiddleware,
  [perMinuteLimiter, perHourLimiter, perDayLimiter],
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const { success, data } = CreateChatSchema.safeParse(req.body);

    const conversationId = data?.conversationId ?? Bun.randomUUIDv7();

    if (!success) {
      res.status(411).json({
        message: "Incorrect inputs",
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
        message: "User not found",
      });
      return;
    }

    //   if (false) {
    if (user.credits <= 0) {
      res.status(403).json({
        message: "Insufficient credits. Please subscribe to continue.",
        credits: user.credits,
      });
      return;
    }

    let existingMessages = InMemoryStore.getInstance().get(conversationId);

    // this is doing nothing
    //   if (!existingMessages.length) {
    if (existingMessages.length !== 0) {
      const messages = await prismaClient.message.findMany({
        where: {
          conversationId,
        },
      });
      messages.map((message) => {
        InMemoryStore.getInstance().add(conversationId, {
          role: message.role as Role,
          content: message.content,
        });
      });
      existingMessages = InMemoryStore.getInstance().get(conversationId);
    }

    // Set proper SSE headers
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let message = "";

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
      console.error("Error in completion:", error);
      res.write(
        `data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`
      );
    } finally {
      res.end(); // Always end the response
    }

    InMemoryStore.getInstance().add(conversationId, {
      role: Role.User,
      content: data.message,
    });

    InMemoryStore.getInstance().add(conversationId, {
      role: Role.Agent,
      content: message,
    });

    if (!data.conversationId) {
      await prismaClient.conversation.create({
        data: {
          title: data.message.slice(0, 20) + "...",
          id: conversationId,
          userId,
        },
      });
    }

    // Save messages and deduct credits in a transaction
    await prismaClient.$transaction([
      prismaClient.message.createMany({
        data: [
          {
            conversationId,
            content: data.message,
            role: Role.User,
          },
          {
            conversationId,
            content: message,
            role: Role.Agent,
          },
        ],
      }),
      // Deduct 1 credit for the message
      prismaClient.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: 1,
          },
        },
      }),
    ]);
  }
);

// Get user credits endpoint
router.get("/credits", authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { credits: true, isPremium: true },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      credits: user.credits,
      isPremium: user.isPremium,
    });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
