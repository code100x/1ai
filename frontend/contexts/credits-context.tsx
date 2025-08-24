"use client";
import { BACKEND_URL } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserCredits {
  credits: number;
  isPremium: boolean;
}

interface CreditsContextType {
  userCredits: UserCredits | null;
  isLoading: boolean;
  error: string | null;
  refetchCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const useCreditsContext = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCreditsContext must be used within a CreditsProvider");
  }
  return context;
};

interface CreditsProviderProps {
  children: ReactNode;
}

export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserCredits(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_URL}/ai/credits`, {
        headers: {
          "Authorization": `Bearer ${token}`
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

  const refetchCredits = async () => {
    setIsLoading(true);
    await fetchCredits();
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const value: CreditsContextType = {
    userCredits,
    isLoading,
    error,
    refetchCredits
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};
