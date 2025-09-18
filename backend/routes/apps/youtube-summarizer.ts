import { z } from "zod";
import { App, AppType } from "./app";
import { PrismaClient } from "../../generated/prisma";
import { GoogleGenAI } from "@google/genai";

const YoutubeSummarizerSchema = z.object({
    url: z.string().url(),
    userId: z.string()
});

const MODEL = "gemini-2.5-flash";
const prismaClient = new PrismaClient();

const SYSTEM_PROMPT = `
    You are a helpful assistant that summarizes YouTube videos.
    You will be given a YouTube URL. Extract the video's transcript (if available) and summarize the key points in a concise, easy-to-understand way with bullet points. If transcript is unavailable, ask the user to provide a brief description.
`;

export class YoutubeSummarizer extends App {
    constructor() {
        super({
            name: "YouTube Summarizer",
            route: "/youtube-summarizer",
            description: "Summarize a YouTube video",
            icon: "https://static.vecteezy.com/system/resources/thumbnails/018/930/575/small_2x/youtube-logo-youtube-icon-transparent-free-png.png",
            per_execution_credit: 4,
            zodSchema: YoutubeSummarizerSchema,
            appType: AppType.StreamableLLM
        });
    }

    async runStreamable(data: z.infer<typeof YoutubeSummarizerSchema>, callback: (chunk: string) => void) {
        const { url } = data;

        let response = "";

        console.log("Starting AI")
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const config = {
            thinkingConfig: {
                thinkingBudget: -1,
            },
        } as any;

        const contents = [
            {
                role: "user",
                parts: [
                    {
                        fileData: {
                            fileUri: url,
                            mimeType: "video/*",
                        }
                    },
                    {
                        text: "Summarize the video keep the summary small yet informative , do not miss any key points in plain english without the jargons respond in plain text with out any formatting variables or new line variables or ** or * please",
                    },
                ],
            },
        ];

        console.log("Starting AI Stream")
        const stream = await ai.models.generateContentStream({
            model: MODEL,
            config,
            contents,
        });

        for await (const chunk of stream as any) {
            if (chunk?.text) {
                callback(chunk.text);
                response += chunk.text;
            }
        }
        console.log("AI stream end")

        try {
            await prismaClient.execution.create({
                data: {
                    title: "YouTube Summarizer",
                    type: "YOUTUBE_SUMMARIZER",
                    user: { connect: { id: data.userId } }
                }
            });
        } catch (error) {
            console.error("Error saving youtube summary execution:", error);
        }

        return response;
    }
}

