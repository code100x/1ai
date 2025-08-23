import { Router } from "express";
import { ArticleSummarizer } from "./article-summarizer";

const router = Router();

router.get("/", (req, res) => {
    res.json(["article-summarizer"]);
});

router.post("/article-summarizer", (req, res) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
    
    const articleSummarizer = new ArticleSummarizer();
    
    // Validate the input using the app's schema
    const result = articleSummarizer.zodSchema.safeParse(req.body);
    
    if (!result.success) {
        res.status(400).json({ error: result.error.message });
        return;
    }
    
    articleSummarizer.runStreamable(result.data as { article: string }, (chunk: string) => {
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