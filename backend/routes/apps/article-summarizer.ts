import { z } from "zod";
import { App, AppType } from "./app";
import { createCompletion } from "../../openrouter";
import { Role } from "../../types";
import { PrismaClient } from "../../generated/prisma";
import { PrismaClientInitializationError } from "../../generated/prisma/runtime/edge";

const ArticleSummarizerSchema = z.object({
    article: z.string(),
    userId: z.string()
});

const MODEL = "gpt-4o-mini";
const prismaClient = new PrismaClient();

const SYSTEM_PROMPT = `
    You are a helpful assistant that summarizes articles. Summarize the article in a way that is easy to understand and concise.
    You will be given a text from an article. You will need to summarize the article in a way that is easy to understand and concise.
`;

export class ArticleSummarizer extends App {
    constructor() {
        super(
            {
                name: "Article Summarizer",
                route: "/article-summarizer",
                description: "Summarize an article",
                icon: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                per_execution_credit: 2,
                zodSchema: ArticleSummarizerSchema,
                appType: AppType.StreamableLLM
            }
        );
    }

    async runStreamable(data: z.infer<typeof ArticleSummarizerSchema>, callback: (chunk: string) => void) {
        const { article } = data;
        let response = "";
        await createCompletion(
            [
                {
                    role: Role.User,
                    content: article
                },
            ],
            MODEL,
            (chunk) => {
                callback(chunk);
                response += chunk;
            },
            SYSTEM_PROMPT
        );

        // Save the article and summary to the database
        try {
            await prismaClient.$transaction(async (tx) => {
                await tx.articleSummarizer.create({
                    data: {
                    article: article,
                    summary: response
                    }

                });
                await tx.execution.create({
                    data: {
                        title: "Article Summarizer",
                        type: "ARTICLE_SUMMARIZER",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        user: {
                            connect: {
                                id: data.userId
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Error saving article summary to database:", error);
        }

        return response;
    }
}