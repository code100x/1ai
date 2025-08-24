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

  // removed the code repetation
  return <UIInput conversationId={chatId} />;
};

export default ChatPage;
