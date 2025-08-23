import { BACKEND_URL } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { useAuthStore, useConversationStore } from "@/store";

enum Role  {
  USER = "user",
  ASSISTANT = "assistant"
}

export interface Messages  { 
  id : string,
  content : string,
  converstionId : string,
  createdAt : string,
  role : Role,

}
export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  messages : Messages[]
  updatedAt: string;
}

export function useConversation() {
  const { token } = useAuthStore();
  const { conversations: storeConversations, setConversations } = useConversationStore();
  const [loading, setLoading] = useState(storeConversations.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Memoize the converted conversations to prevent infinite re-renders
  const conversations: Conversation[] = useMemo(() => 
    storeConversations.map(conv => ({
      id: conv.id,
      title: conv.title || "Untitled",
      createdAt: conv.updatedAt || new Date().toISOString(),
      updatedAt: conv.updatedAt || new Date().toISOString(),
      messages: [] // Messages are fetched separately by useConversationById
    })), [storeConversations]
  );

  useEffect(() => {
    if (storeConversations.length > 0) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      const currentToken = token || localStorage.getItem("token");
      if (!currentToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/ai/conversations`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        
        const data = await response.json();
        setConversations(data.conversations.map((conv: any) => ({
          id: conv.id,
          title: conv.title,
          updatedAt: conv.updatedAt,
        })));
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch conversations");
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [token, storeConversations.length, setConversations]);

  return { conversations, loading, error };
}


export function useConversationById(id: string | undefined) {
  const { token } = useAuthStore();
  const { setCurrentConversationId } = useConversationStore();
  const [conversation, setConversation] = useState<Conversation | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMessage = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      setCurrentConversationId(id);
      
      const currentToken = token || localStorage.getItem("token");
      if (!currentToken) {
        setError("No authentication token");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${BACKEND_URL}/ai/conversations/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setConversation(data.conversation);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        setError("Failed to fetch the conversation");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id, token, setCurrentConversationId]);

  return { conversation, loading, error };
}