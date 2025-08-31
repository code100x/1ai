import { z } from "zod";
import { PrismaClient } from "../../../generated/prisma";
import { App, AppType } from "../app";
import { createCompletion } from "../../../openrouter";
import { Role } from "../../../types";
import { extractVideoId } from "./helper";

const YoutubeSummarizerSchema = z.object({
  videoLink: z.string(),
  userId: z.string(),
});

const MODEL = "openai/gpt-4o:online";
const prismaClient = new PrismaClient();

const SYSTEM_PROMPT = `
   You are a helpful assistant that summarizes YouTube videos. Your task is to create clear, concise, and well-structured summaries.
    Instructions:
    - You will receive a YouTube video ID
    - Extract and analyze the video's content, including title, description, and transcript if available
    - Create a comprehensive summary that captures the main points, key insights, and important details
    - Structure your summary with clear sections: overview, main points, and key takeaways
    - Use bullet points or numbered lists when appropriate for better readability
    - Keep the language accessible and avoid unnecessary jargon
    - Aim for a summary that's informative yet concise 
`;

export class YoutubeSummarizer extends App {
  constructor() {
    super({
      name: "youtube Summarizer",
      route: "/youtube-summarizer",
      description: "Summarize a youtube video",
      icon: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      per_execution_credit: 2,
      zodSchema: YoutubeSummarizerSchema,
      appType: AppType.StreamableLLM,
    });
  }

  private async createExecutionRecord(
    db: { execution: { create: (args: any) => Promise<any> } },
    userId: string,
  ) {
    await db.execution.create({
      data: {
        title: "Youtube Summarizer",
        type: "YOUTUBE_SUMMARIZER",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async runStreamable(
    data: z.infer<typeof YoutubeSummarizerSchema>,
    callback: (chunk: string) => void,
  ) {
    const { videoLink } = data;
    const videoId = extractVideoId(videoLink);
    let response = "";
    await createCompletion(
      [
        {
          role: Role.User,
          content: videoLink,
        },
      ],
      MODEL,
      (chunk) => {
        callback(chunk);
        response += chunk;
      },
      SYSTEM_PROMPT,
      { plugins: [{ id: "web" }] },
    );

    try {
      await prismaClient.$transaction(async (tx) => {
        await tx.youtubeSummarizer.create({
          data: {
            videoId: videoId,
            summary: response,
          },
        });
        await this.createExecutionRecord(tx as any, data.userId);
      });
    } catch (error) {
      console.error("Error saving article summary to database:", error);
    }

    return response;
  }
}
