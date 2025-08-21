"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BlurContextType {
  isBlurred: boolean;
  setIsBlurred: (value: boolean) => void;
}

const BlurContext = createContext<BlurContextType | undefined>(undefined);

export const BlurProvider = ({ children }: { children: React.ReactNode }) => {
  const [isBlurred, setIsBlurred] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isBlurred");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("isBlurred", isBlurred.toString());
  }, [isBlurred]);

  return (
    <BlurContext.Provider value={{ isBlurred, setIsBlurred }}>
      {children}
    </BlurContext.Provider>
  );
};

export const useBlur = () => {
  const context = useContext(BlurContext);
  if (context === undefined) {
    throw new Error("useBlur must be used within a BlurProvider");
  }
  return context;
};
