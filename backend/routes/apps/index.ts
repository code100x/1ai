import { Router } from "express";
import { ArticleSummarizer } from "./article-summarizer";
import { YouTubeSummarizer } from "./youtube-summarizer";
import { authMiddleware } from "../../auth-middleware";
import { PrismaClient } from "../../generated/prisma";

const router = Router();

router.get("/", (req, res) => {
    res.json(["article-summarizer", "youtube-summarizer"]);
});

const prismaClient = new PrismaClient();

router.get("/article-summarizer/:executionId", authMiddleware, async (req, res) => {
    const execution = await prismaClient.execution.findFirst({
        where: {
            id: req.params.executionId,
            userId: req.userId
        }
    });

    if (!execution) {
        res.status(404).json({ error: "Execution not found" });
        return;
    }

    const articleSummarizer = await prismaClient.articleSummarizer.findFirst({
        where: {
            id: req.params.executionId
        }
    });

    if (!articleSummarizer) {
        res.status(404).json({ error: "Article summarizer not found" });
        return;
    }

    res.json({
        id: articleSummarizer.id,
        article: articleSummarizer.article,
        summary: articleSummarizer.summary,
        createdAt: articleSummarizer.createdAt,
        updatedAt: articleSummarizer.updatedAt
    });
});

router.post("/article-summarizer", authMiddleware, (req, res) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
    
    const articleSummarizer = new ArticleSummarizer();
    
    // Validate the input using the app's schema
    const result = articleSummarizer.zodSchema.safeParse({
        ...req.body,
        userId: req.userId
    });
    
    if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
    }
    
    articleSummarizer.runStreamable(result.data as any, (chunk: string) => {
        // Send data in SSE format
        res.write(`data: ${chunk}\n\n`);
    }).then(() => {
        // Close the connection when streaming is complete
        res.end();
    }).catch((error) => {
        // Handle errors properly
        res.write(`data: {"error": "${error.message}"}\n\n`);
        res.end();
    });
});

// YouTube Summarizer routes
router.get("/youtube-summarizer/:executionId", authMiddleware, async (req, res) => {
    const execution = await prismaClient.execution.findFirst({
        where: {
            id: req.params.executionId,
            userId: req.userId
        }
    });

    if (!execution) {
        res.status(404).json({ error: "Execution not found" });
        return;
    }

    const youtubeSummarizer = await prismaClient.youTubeSummarizer.findFirst({
        where: {
            executionId: req.params.executionId
        }
    });

    if (!youtubeSummarizer) {
        res.status(404).json({ error: "YouTube summarizer not found" });
        return;
    }

    res.json({
        id: youtubeSummarizer.id,
        youtubeUrl: youtubeSummarizer.youtubeUrl,
        summary: youtubeSummarizer.summary,
        createdAt: youtubeSummarizer.createdAt,
        updatedAt: youtubeSummarizer.updatedAt
    });
});

router.post("/youtube-summarizer/create-execution", authMiddleware, async (req, res) => {
    try {
        const { youtubeUrl } = req.body as { youtubeUrl?: string };

        if (!youtubeUrl) {
            res.status(400).json({ error: "YouTube URL is required" });
            return;
        }
        const user = await prismaClient.user.findUnique({
            where: { id: req.userId },
            select: { credits: true, isPremium: true }
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        if (!user.isPremium && user.credits < 2) {
            res.status(400).json({ error: "Insufficient credits. You need 2 credits to use YouTube Summarizer." });
            return;
        }

        // Create execution immediately
        const execution = await prismaClient.execution.create({
            data: {
                title: "YouTube Summarizer",
                type: "YOUTUBE_SUMMARIZER",
                userId: req.userId
            }
        });

        // Create placeholder YouTube summarizer record
        await prismaClient.youTubeSummarizer.create({
            data: {
                youtubeUrl,
                summary: "", // will be updated after processing
                execution: {
                    connect: {
                        id: execution.id
                    }
                }
            }
        });

        res.json({ executionId: execution.id });
    } catch (error) {
        console.error("Error creating execution:", error);
        res.status(500).json({ error: "Failed to create execution" });
    }
});

// Process YouTube summarizer for a specific execution and stream
router.post("/youtube-summarizer/:executionId/process", authMiddleware, async (req, res) => {
    try {
        // Verify execution belongs to user
        const execution = await prismaClient.execution.findFirst({
            where: {
                id: req.params.executionId,
                userId: req.userId,
                type: "YOUTUBE_SUMMARIZER"
            }
        });

        if (!execution) {
            res.status(404).json({ error: "Execution not found" });
            return;
        }

        // Get the YouTube URL from the existing record
        const youtubeSummarizer = await prismaClient.youTubeSummarizer.findFirst({
            where: {
                executionId: execution.id
            }
        });

        if (!youtubeSummarizer) {
            res.status(404).json({ error: "YouTube summarizer record not found" });
            return;
        }

        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

        const youtubeSummarizerApp = new YouTubeSummarizer();

        await youtubeSummarizerApp.runStreamable(
            {
                youtubeUrl: youtubeSummarizer.youtubeUrl,
                userId: req.userId,
                executionId: execution.id
            } as any,
            (chunk: string) => {
                res.write(`data: ${chunk}\n\n`);
            }
        );

        res.end();
    } catch (error) {
        console.error("Error processing YouTube summary:", error);
        res.write(`data: {"error": "${error instanceof Error ? error.message : 'Unknown error'}"}\n\n`);
        res.end();
    }
});

router.post("/youtube-summarizer", authMiddleware, (req, res) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
    
    const youtubeSummarizer = new YouTubeSummarizer();
    
    // Validate the input using the app's schema
    const result = youtubeSummarizer.zodSchema.safeParse({
        ...req.body,
        userId: req.userId
    });
    
    if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
    }
    
    youtubeSummarizer.runStreamable(result.data as any, (chunk: string) => {
        res.write(`data: ${chunk}\n\n`);
    }).then(() => {
        res.end();
    }).catch((error) => {
        res.write(`data: {"error": "${error.message}"}\n\n`);
        res.end();
    });
});

export default router;