import { BACKEND_URL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";

interface UserCredits {
  credits: number;
  isPremium: boolean;
}

const fetchCredits = async () => {
    const response = await fetch(`${BACKEND_URL}/ai/credits`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch credits");
    }

    return await response.json() as UserCredits;
};

export const useCredits = () => {
  const {
    data: userCredits,
    isLoading,
    isPending,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.CREDITS],
    queryFn: () => fetchCredits(),
  });

  return {
    userCredits,
    isLoading,
    isPending,
    error,
  };
};
