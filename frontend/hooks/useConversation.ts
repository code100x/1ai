import { BACKEND_URL } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
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