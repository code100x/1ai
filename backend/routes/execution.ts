import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../auth-middleware";

const prismaClient = new PrismaClient();

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const executions = await prismaClient.execution.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    res.json({
        executions
    });
});

router.get("/:executionId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const executionId = req.params.executionId;
    const execution = await prismaClient.execution.findFirst({
        where: {
            id: executionId,
            userId
        }
    });

    switch (execution?.type) {
        case "CONVERSATION":
            const conversation = await prismaClient.conversation.findFirst({
                where: {
                    id: execution.externalId!
                }
            });
            res.json({
                response: conversation
            });
            break;
        case "ARTICLE_SUMMARIZER":
            const articleSummarizer = await prismaClient.articleSummarizer.findFirst({
                where: {
                    id: execution.externalId!
                }
            });

            res.json({
                response: articleSummarizer
            });
            break;
        default:
            res.status(400).json({
                error: "Invalid execution type"
            });
            return;
    }
});

export default router;