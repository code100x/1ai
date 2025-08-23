import type { Message, MODEL, SUPPORTER_MODELS } from "./types";
const OPENROUTER_KEY = process.env.OPENROUTER_KEY!;
const MAX_TOKEN_ITERATIONS = 1000;

export const createCompletion = async (messages: Message[], 
    model: MODEL,
    cb: (chunk: string) => void,
    images?: string[]
) => {
    return new Promise<void>(async (resolve, reject) => {
        // Convert messages to OpenRouter format
        const openRouterMessages = messages.map(msg => {
            if (msg.images && msg.images.length > 0) {
                // Create multimodal message
                const content: any[] = [
                    { type: 'text', text: msg.content }
                ];
                
                // Add images
                msg.images.forEach(image => {
                    content.push({
                        type: 'image_url',
                        image_url: { url: image }
                    });
                });
                
                return {
                    role: msg.role,
                    content: content
                };
            } else {
                // Regular text message
                return {
                    role: msg.role,
                    content: msg.content
                };
            }
        });

        // If there are images in the current request, add them to the last user message
        if (images && images.length > 0) {
            const lastMessage = openRouterMessages[openRouterMessages.length - 1];
            if (lastMessage && lastMessage.role === 'user') {
                if (typeof lastMessage.content === 'string') {
                    // Convert string content to multimodal format
                    const content: any[] = [
                        { type: 'text', text: lastMessage.content }
                    ];
                    
                    images.forEach(image => {
                        content.push({
                            type: 'image_url',
                            image_url: { url: image }
                        });
                    });
                    
                    lastMessage.content = content;
                } else if (Array.isArray(lastMessage.content)) {
                    // Already multimodal, just add images
                    images.forEach(image => {
                        (lastMessage.content as any[]).push({
                            type: 'image_url',
                            image_url: { url: image }
                        });
                    });
                }
            }
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${OPENROUTER_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              messages: openRouterMessages,
              stream: true,
            }),
        });
          
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('Response body is not readable');
          }
          
          const decoder = new TextDecoder();
          let buffer = '';
          
          try {
            let tokenIterations = 0;
            while (true) {

              tokenIterations++;
              if (tokenIterations > MAX_TOKEN_ITERATIONS) {
                console.log("max token iterations");
                resolve()
                return;
              }
              const { done, value } = await reader.read();
              if (done) break;
          
              // Append new chunk to buffer
              buffer += decoder.decode(value, { stream: true });
          
              // Process complete lines from buffer
              while (true) {
                const lineEnd = buffer.indexOf('\n');
                if (lineEnd === -1) { 
                  console.log("max token iterations 2");
                    break
                };
          
                const line = buffer.slice(0, lineEnd).trim();
                buffer = buffer.slice(lineEnd + 1);
          
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') break;
          
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      cb(content);
                    }
                  } catch (e) {
                    // Ignore invalid JSON - this is common in SSE streams
                    console.warn("Failed to parse SSE data:", data, e);
                  }
                }
              }
            }
          } finally {
            resolve()
            reader.cancel();
          }
    })
}

