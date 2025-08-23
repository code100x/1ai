"use client";
import React, { useEffect, useState } from "react";
import UIInput from "@/components/ui/ui-input";
import { useParams } from "next/navigation";

const ChatPage = () => {
  const params = useParams();
  const chatId = params.chatId as string;
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const savedToken = localStorage.getItem("turnstileToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <div className="flex w-full max-w-screen flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center gap-4">
        <UIInput conversationId={chatId} />
      </div>
    </div>
  );
};

export default ChatPage; 