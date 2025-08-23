import { BACKEND_URL } from "@/lib/utils";
import { useEffect, useState } from "react";

interface UserCredits {
  credits: number;
  isPremium: boolean;
}

export const useCredits = () => {
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/ai/credits`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch credits");
        }

        const data = await response.json();
        setUserCredits(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch credits");
        setUserCredits(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const refetchCredits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/ai/credits`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }

      const data = await response.json();
      setUserCredits(data);
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
