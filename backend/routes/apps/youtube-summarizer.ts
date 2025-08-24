import { z } from "zod";
import { App, AppType } from "./app";
import { createCompletion } from "../../openrouter";
import { Role } from "../../types";
import { PrismaClient } from "../../generated/prisma";
import { 
    fetchTranscript, 
    InMemoryCache,
} from "youtube-transcript-plus";
import ytdl from "ytdl-core";

const YouTubeSummarizerSchema = z.object({
    youtubeUrl: z.string().url(),
    userId: z.string()
});

const MODEL = "gpt-4o-mini";
const prismaClient = new PrismaClient();

const SYSTEM_PROMPT = `
    You are a helpful assistant that summarizes YouTube videos. You will be given a YouTube URL and you need to provide a comprehensive summary of the video content.
    
    Please provide a summary that includes:
    1. Main topic and key points discussed
    2. Important insights or takeaways
    3. Key timestamps if mentioned in the transcript
    4. Overall conclusion or main message
    5. Any notable language patterns or multilingual content
    
    Make the summary concise but informative, easy to understand, and well-structured.
    
    Note: This system uses youtube-transcript-plus for enhanced transcript fetching with better error handling and caching.
`;

export class YouTubeSummarizer extends App {
    constructor() {
        super(
            {
                name: "YouTube Summarizer",
                route: "/youtube-summarizer",
                description: "Summarize YouTube videos",
                icon: "https://www.youtube.com/favicon.ico",
                per_execution_credit: 2,
                zodSchema: YouTubeSummarizerSchema,
                appType: AppType.StreamableLLM
            }
        );
    }

    private async checkAndDeductCredits(userId: string) {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { credits: true, isPremium: true }
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.isPremium && user.credits < 2) {
            throw new Error("Insufficient credits. You need 2 credits to use YouTube Summarizer.");
        }

        // Deduct credits for unpaid users
        if (!user.isPremium) {
            await prismaClient.user.update({
                where: { id: userId },
                data: { credits: user.credits - 2 }
            });
            console.log(`💰 Credits deducted for user ${userId}. Remaining credits: ${user.credits - 2}`);
        }

        return user;
    }

    private async fetchTranscriptWithFallback(videoId: string) {
        const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];
        const cache = new InMemoryCache(1800000); // 30 minutes TTL
        for (const lang of languages) {
            try {
                const transcript = await fetchTranscript(videoId, {
                    lang,
                    cache,
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                });
                return transcript;
            } catch (langError) {
                console.log(`No transcript available in ${lang}`);
                continue;
            }
        }
        try {
            const transcript = await fetchTranscript(videoId, {
                cache,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });
            return transcript;
        } catch (fallbackError) {
            return null;
        }
    }

    private async generateFallbackSummary(youtubeUrl: string) {
        let videoInfo: any = null;
        try {
            videoInfo = await ytdl.getInfo(youtubeUrl);
        } catch (metadataError) {
            console.log("Could not fetch video metadata");
        }

        let fallbackPrompt = `I cannot access the transcript for this YouTube video: ${youtubeUrl}`;
        
        if (videoInfo) {
            const title = videoInfo.videoDetails.title;
            const description = videoInfo.videoDetails.description?.substring(0, 1000) || "";
            const duration = parseInt(videoInfo.videoDetails.lengthSeconds) || 0;
            const viewCount = videoInfo.videoDetails.viewCount;
            const author = videoInfo.videoDetails.author.name;
            
            fallbackPrompt += `\n\nAvailable video information:\n- Title: ${title}\n- Author: ${author}\n- Duration: ${Math.floor(duration/60)}:${(duration%60).toString().padStart(2,'0')} minutes\n- Views: ${viewCount}\n- Description: ${description}\n\nBased on this information, please provide: 1) a brief analysis, 2) key insights, 3) what the user might learn, 4) alternatives.`;
        } else {
            fallbackPrompt += `\n\nPlease provide a helpful response that:\n1. Explains that this video doesn't have available captions/transcripts\n2. Suggests that the user could:\n   - Try a different video with captions enabled\n   - Provide a brief description of what they're looking for\n   - Use the article summarizer for text-based content instead\n3. Offers to help with other summarization tasks\n\nBe helpful and guide the user to alternative solutions.`;
        }

        return { fallbackPrompt, videoInfo };
    }

    private async processTranscript(youtubeUrl: string, transcript: any[]) {
        const transcriptText = transcript.map((item: any) => item.text).join(' ');
        const transcriptInfo = {
            segments: transcript.length,
            totalDuration: transcript.reduce((sum: number, item: any) => sum + (item.duration || 0), 0),
            languages: [...new Set(transcript.map((item: any) => item.lang).filter(Boolean))]
        };
        
        console.log("Full transcript length:", transcriptText.length, "characters");
        console.log("Transcript info:", transcriptInfo);
        console.log("Transcript preview (first 500 chars):", transcriptText.substring(0, 500) + "...");
        
        if (!transcriptText || transcriptText.trim().length === 0) {
            throw new Error("No transcript available for this video. The video might not have captions or they might be disabled.");
        }

        const prompt = `Please provide a comprehensive summary of this YouTube video based on its transcript:

Video URL: ${youtubeUrl}
Transcript Information:
- Number of segments: ${transcriptInfo.segments}
- Total duration: ${Math.floor(transcriptInfo.totalDuration / 60)}:${(transcriptInfo.totalDuration % 60).toString().padStart(2, '0')} minutes
- Languages detected: ${transcriptInfo.languages.join(', ') || 'Not specified'}

Transcript: ${transcriptText}

Please provide a summary that includes:
1. Main topic and key points discussed
2. Important insights or takeaways
3. Key timestamps if mentioned in the transcript
4. Overall conclusion or main message
5. Any notable language patterns or multilingual content

Make the summary concise but informative, easy to understand, and well-structured.`;
        return prompt;
    }

    async runStreamable(
        data: z.infer<typeof YouTubeSummarizerSchema> & { executionId?: string }, 
        callback: (chunk: string) => void
    ) {
        const { youtubeUrl, executionId } = data;
        let response = "";
        
        try {
            console.log("🎬 YouTube Summarizer - Starting processing...");
            console.log("📺 Video URL:", youtubeUrl);
            if (executionId) {
                console.log("🔄 Processing for existing execution:", executionId);
            }
            
            // Check credits first
            await this.checkAndDeductCredits(data.userId);
            const videoId = this.extractVideoId(youtubeUrl);
            if (!videoId) {
                throw new Error("Invalid YouTube URL. Please provide a valid YouTube video URL.");
            }
            console.log("Extracted Video ID:", videoId);

            const transcript = await this.fetchTranscriptWithFallback(videoId);
            
            if (!transcript) {
                // Generate fallback summary
                const { fallbackPrompt, videoInfo } = await this.generateFallbackSummary(youtubeUrl);
                
                await createCompletion(
                    [{ role: Role.User, content: fallbackPrompt }],
                    MODEL,
                    (chunk) => {
                        callback(chunk);
                        response += chunk;
                    },
                    SYSTEM_PROMPT
                );
                
                console.log("✅ Fallback response generated!");
                console.log("📄 Fallback response length:", response.length, "characters");
                
                // Save or update the fallback response to database
                await prismaClient.$transaction(async (tx) => {
                    if (executionId) {
                        // Update existing record
                        await tx.youTubeSummarizer.update({
                            where: { executionId },
                            data: { summary: response }
                        });
                        await tx.execution.update({
                            where: { id: executionId },
                            data: {
                                title: videoInfo ? "YouTube Summarizer (Metadata Analysis)" : "YouTube Summarizer (No Transcript)",
                                updatedAt: new Date()
                            }
                        });
                    } else {
                        // Create new record
                        const execution = await tx.execution.create({
                            data: {
                                title: videoInfo ? "YouTube Summarizer (Metadata Analysis)" : "YouTube Summarizer (No Transcript)",
                                type: "YOUTUBE_SUMMARIZER",
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                user: { connect: { id: data.userId } }
                            }
                        });

                        await tx.youTubeSummarizer.create({
                            data: {
                                youtubeUrl: youtubeUrl,
                                summary: response,
                                executionId: execution.id
                            }
                        });
                    }
                });
                
                return response;
            }
            
            // Process transcript using the optimized method
            const prompt = await this.processTranscript(youtubeUrl, transcript);
            
            await createCompletion(
                [{ role: Role.User, content: prompt }],
                MODEL,
                (chunk) => {
                    callback(chunk);
                    response += chunk;
                },
                SYSTEM_PROMPT
            );

            console.log("AI summarization completed!");
            console.log("Generated summary length:", response.length, "characters");
            console.log("Summary preview (first 300 chars):", response.substring(0, 300) + "...");

            await prismaClient.$transaction(async (tx) => {
                if (executionId) {
                    await tx.youTubeSummarizer.update({
                        where: { executionId },
                        data: { summary: response }
                    });
                    await tx.execution.update({
                        where: { id: executionId },
                        data: { title: "YouTube Summarizer", updatedAt: new Date() }
                    });
                } else {
                    // Create new record
                    const execution = await tx.execution.create({
                        data: {
                            title: "YouTube Summarizer",
                            type: "YOUTUBE_SUMMARIZER",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            user: { connect: { id: data.userId } }
                        }
                    });

                    await tx.youTubeSummarizer.create({
                        data: {
                            youtubeUrl: youtubeUrl,
                            summary: response,
                            executionId: execution.id
                        }
                    });
                }
            });

        } catch (error) {
            console.error("Error processing YouTube video:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            console.error("Error details:", errorMessage);
            callback(`Error: ${errorMessage}`);
            response = `Error: ${errorMessage}`;
        }

        return response;
    }

    private extractVideoId(url: string): string | null {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
            /youtu\.be\/([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        
        return null;
    }
}
