import { BACKEND_URL } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`${BACKEND_URL}/ai/conversations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      try {
        const data = await response.json();
        setConversations(data.conversations);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch conversations");
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return { conversations, loading, error };
}


export function useConversationById(id: string | undefined) {
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
      
      try {
        const response = await fetch(`${BACKEND_URL}/ai/conversations/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
  }, [id]);

  return { conversation, loading, error };
}