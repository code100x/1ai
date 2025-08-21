"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type FontContextType = {
  selectedFont: string;
  setSelectedFont: (font: string) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

const FONT_STORAGE_KEY = "t3-chat-font-preference";

export const FontProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFont, setSelectedFontState] = useState<string>("proxima");
  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
    // Get font from localStorage after component mounts
    const savedFont = localStorage.getItem(FONT_STORAGE_KEY) || "proxima";
    setSelectedFontState(savedFont);

    // Apply font to document root immediately
    applyFontToDocument(savedFont);
  }, []);

  // Function to apply font to document
  const applyFontToDocument = (font: string) => {
    if (typeof document !== "undefined") {
      // Remove all existing font classes from html element
      const htmlElement = document.documentElement;
      htmlElement.classList.remove(
        "font-proxima",
        "font-inter",
        "font-geist",
        "font-playfair",
        "font-roboto",
      );

      // Add the new font class
      htmlElement.classList.add(`font-${font}`);

      // Also apply to body as fallback
      document.body.classList.remove(
        "font-proxima",
        "font-inter",
        "font-geist",
        "font-playfair",
        "font-roboto",
      );
      document.body.classList.add(`font-${font}`);
    }
  };

  // Handle localStorage changes and cross-tab synchronization
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FONT_STORAGE_KEY && e.newValue) {
        setSelectedFontState(e.newValue);
        applyFontToDocument(e.newValue);
      }
    };

    // Listen for storage changes from other tabs
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isClient]);

  // Update localStorage and apply font when selectedFont changes
  useEffect(() => {
    if (!isClient) return;

    localStorage.setItem(FONT_STORAGE_KEY, selectedFont);
    applyFontToDocument(selectedFont);
  }, [selectedFont, isClient]);

  const setSelectedFont = (font: string) => {
    setSelectedFontState(font);
  };

  return (
    <FontContext.Provider value={{ selectedFont, setSelectedFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};
