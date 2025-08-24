import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../auth-middleware";

const prismaClient = new PrismaClient();

const router = Router();

/**
 * @swagger
 * /execution:
 *   get:
 *     tags: [Executions]
 *     summary: Get user executions
 *     description: Retrieve all executions (conversations and apps) for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Executions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 executions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Execution'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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