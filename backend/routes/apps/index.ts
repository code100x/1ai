import { Router } from "express";
import { ArticleSummarizer } from "./article-summarizer";
import { authMiddleware } from "../../auth-middleware";
import { PrismaClient } from "../../generated/prisma";

const router = Router();

router.get("/", (req, res) => {
    res.json(["article-summarizer"]);
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

export default router;