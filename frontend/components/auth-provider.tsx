"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setToken, token } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    if (!token) {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [token, setToken]);

  return <>{children}</>;
}
