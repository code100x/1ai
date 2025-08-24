"use client";

import { createContext, useContext, useRef } from "react";

type ContentTypes = {
  textRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const ChatContext = createContext<ContentTypes | null>(null);

export function ChatWrapper({ children }: { children: React.ReactNode }) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <ChatContext.Provider value={{ textRef: textAreaRef }}>
      <div
        tabIndex={-1}
        onKeyDown={(e) => {
          if (
            e.altKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.key === "Tab" ||
            e.key === "Escape"
          ) {
            return;
          }

          textAreaRef.current?.focus();
        }}
        className="bg-muted/50 relative h-full max-h-svh w-full rounded-xl p-4"
      >
        {children}
      </div>
    </ChatContext.Provider>
  );
}

export const useChatContextHook = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("context not defined");
  }
  return context;
};
