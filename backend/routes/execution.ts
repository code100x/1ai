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

router.patch("/:executionId", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const executionId = req.params.executionId;
        const { title } = req.body;

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            res.status(400).json({
                error: "Title is required and must be a non-empty string"
            });
            return;
        }

        const execution = await prismaClient.execution.findFirst({
            where: {
                id: executionId,
                userId
            }
        });

        if (!execution) {
            res.status(404).json({
                error: "Execution not found"
            });
            return;
        }

        const updatedExecution = await prismaClient.execution.update({
            where: {
                id: executionId
            },
            data: {
                title: title.trim()
            }
        });

        res.json({
            success: true,
            execution: updatedExecution
        });
    } catch (error) {
        console.error("Error updating execution:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

router.delete("/:executionId", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const executionId = req.params.executionId;

        const execution = await prismaClient.execution.findFirst({
            where: {
                id: executionId,
                userId
            }
        });

        if (!execution) {
            res.status(404).json({
                error: "Execution not found"
            });
            return;
        }

        switch (execution.type) {
            case "CONVERSATION":
                if (execution.externalId) {
                    await prismaClient.message.deleteMany({
                        where: {
                            conversationId: execution.externalId
                        }
                    });
                    await prismaClient.conversation.delete({
                        where: {
                            id: execution.externalId
                        }
                    });
                }
                break;
            case "ARTICLE_SUMMARIZER":
                if (execution.externalId) {
                    await prismaClient.articleSummarizer.delete({
                        where: {
                            id: execution.externalId
                        }
                    });
                }
                break;
        }

        await prismaClient.execution.delete({
            where: {
                id: executionId
            }
        });

        res.json({
            success: true,
            message: "Execution deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting execution:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

export default router;