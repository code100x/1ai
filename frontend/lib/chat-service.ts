import { BACKEND_URL } from "./utils";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  model: string;
  conversationId?: string;
}

export interface ChatStreamResponse {
  content?: string;
  done?: boolean;
  error?: string;
}

export class ChatService {
  private static getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  /**
   * Send a chat message and receive streaming response
   * @param request Chat request with message, model, and optional conversationId
   * @param onChunk Callback for each streaming chunk received
   * @param onDone Callback when streaming is complete
   * @param onError Callback for errors
   * @param signal AbortSignal for cancelling the request
   */
  static async streamChat(
    request: ChatRequest,
    onChunk: (content: string) => void,
    onDone?: () => void,
    onError?: (error: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const token = this.getAuthToken();
    
    if (!token) {
      onError?.("Authentication token not found. Please login again.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(request),
        signal
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        
        // Try to parse error response
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        onError?.(errorMessage);
        return;
      }

      if (!response.body) {
        onError?.("No response body received");
        return;
      }

      // Create a reader for the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            onDone?.();
            break;
          }

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });
          
          // Parse Server-Sent Events
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // Remove 'data: ' prefix
              
              if (data.trim() === '') continue;
              
              try {
                const parsed: ChatStreamResponse = JSON.parse(data);
                
                if (parsed.error) {
                  onError?.(parsed.error);
                  return;
                }
                
                if (parsed.done) {
                  onDone?.();
                  return;
                }
                
                if (parsed.content) {
                  onChunk(parsed.content);
                }
              } catch (parseError) {
                console.warn("Failed to parse SSE data:", data, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (signal?.aborted) {
        // Request was cancelled
        return;
      }
      
      if (error instanceof Error) {
        onError?.(error.message);
      } else {
        onError?.("An unknown error occurred");
      }
    }
  }

  /**
   * Fetch user credits
   */
  static async getUserCredits(): Promise<{ credits: number; isPremium: boolean } | null> {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    try {
      const response = await fetch(`${BACKEND_URL}/credits`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user credits:", error);
      return null;
    }
  }

  /**
   * Fetch conversations list
   */
  static async getConversations(): Promise<any[] | null> {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    try {
      const response = await fetch(`${BACKEND_URL}/conversations`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.conversations;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return null;
    }
  }

  /**
   * Fetch a specific conversation with messages
   */
  static async getConversation(conversationId: string): Promise<any | null> {
    const token = this.getAuthToken();
    
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    try {
      const response = await fetch(`${BACKEND_URL}/conversations/${conversationId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.conversation;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      return null;
    }
  }
}
