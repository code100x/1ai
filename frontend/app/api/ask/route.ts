import { env } from "@/env";
import { auth } from "@/server/auth";
import { fetchChatCompletion } from "@/models/service";
import { DEFAULT_MODEL_ID, getModelById } from "@/models/constants";
import { db } from "@/server/db";
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface TypeGPTPayload {
  messages: ChatMessage[];
  model?: string;
  chatId: string;
}

interface TypeGPTErrorResponse {
  error?: {
    message: string;
    type: string;
    code?: string;
  };
  status?: number;
  message?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const authResult = await auth();
    if (!authResult?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, model = DEFAULT_MODEL_ID, chatId } =
      (await req.json()) as TypeGPTPayload;

    // Save user message
    await db.message.create({
      data: {
        chatId,
        content: messages[messages.length - 1]?.content ?? "",
        role: "USER",
      },
    });

    const modelInfo = getModelById(model);
    if (!modelInfo) {
      return new Response(
        JSON.stringify({ error: `Model ${model} not supported` }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", "text/event-stream");
    headers.set("Cache-Control", "no-cache");
    headers.set("Connection", "keep-alive");

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    void (async () => {
      let accumulatedContent = "";
      
      try {
        const response = await fetchChatCompletion({
          modelId: model,
          messages,
          stream: true,
          fallbackToDefaultModel: true,
        });

        if (!response.ok) {
          const errorData = (await response.json()) as TypeGPTErrorResponse;
          const errorMessage = `API error: ${response.status} ${JSON.stringify(errorData)}`;
          const encoder = new TextEncoder();
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMessage })}\n\n`,
            ),
          );
          await writer.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          const encoder = new TextEncoder();
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ error: "No reader available from API" })}\n\n`,
            ),
          );
          await writer.close();
          return;
        }

        const encoder = new TextEncoder();
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Save AI message to database after stream completes
              if (accumulatedContent.trim()) {
                await db.message.create({
                  data: {
                    chatId,
                    content: accumulatedContent,
                    role: "ASSISTANT",
                  },
                });
              }
              
              await writer.write(encoder.encode("data: [DONE]\n\n"));
              await writer.close();
              break;
            }

            // Accumulate content for database storage
            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\n");
            
            for (const line of lines) {
              if (line.trim() === "") continue;
              
              if (line.startsWith("data: ")) {
                const data = line.substring(6);
                
                if (data === "[DONE]") continue;
                
                try {
                  const parsedData = JSON.parse(data) as {
                    choices?: Array<{
                      delta?: {
                        content?: string;
                      };
                    }>;
                  };
                  
                  const content = parsedData.choices?.[0]?.delta?.content;
                  if (content) {
                    accumulatedContent += content;
                  }
                } catch (e) {
                  // Ignore parsing errors for non-JSON lines
                }
              }
            }

            await writer.write(value);
          }
        } catch (error) {
          console.error("Error processing stream:", error);
          await writer.abort(error as Error);
        }
      } catch (error) {
        console.error("Error in chat API:", error);
        const encoder = new TextEncoder();
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Failed to communicate with API" })}\n\n`,
          ),
        );
        await writer.close();
      }
    })();

    return new Response(readable, { headers });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
