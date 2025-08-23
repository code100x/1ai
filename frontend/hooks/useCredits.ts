import { BACKEND_URL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuthStore, useUserStore } from "@/store";

interface UserCredits {
  credits: number;
  isPremium: boolean;
}

export const useCredits = () => {
  const { token } = useAuthStore();
  const { credits, isPremium, setCredits, setIsPremium } = useUserStore();
  const [isLoading, setIsLoading] = useState(credits === 0 && !isPremium);
  const [error, setError] = useState<string | null>(null);

  const userCredits: UserCredits | null = credits !== 0 || isPremium ? { credits, isPremium } : null;

  useEffect(() => {
    if (userCredits && !isLoading) return;

    const fetchCredits = async () => {
      const currentToken = token || localStorage.getItem("token");
      if (!currentToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/ai/credits`, {
          headers: {
            "Authorization": `Bearer ${currentToken}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch credits");
        }

        const data = await response.json();
        setCredits(data.credits);
        setIsPremium(data.isPremium);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch credits");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [token, userCredits, isLoading, setCredits, setIsPremium]);

  const refetchCredits = async () => {
    setIsLoading(true);
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/ai/credits`, {
        headers: {
          "Authorization": `Bearer ${currentToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }

      const data = await response.json();
      setCredits(data.credits);
      setIsPremium(data.isPremium);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch credits");
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    userCredits, 
    isLoading, 
    error, 
    refetchCredits 
  };
};
