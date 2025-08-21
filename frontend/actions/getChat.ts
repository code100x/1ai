"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

type MessageRole = "user" | "system" | "assistant" | "data";

export async function getChat(chatId: string) {
  try {
    const authResult = await auth();
    if (!authResult?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = authResult.user.id;


    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return { success: false, error: "Chat not found" };
    }

    
    const formattedMessages = chat.messages.map((message) => ({
      id: message.id,
      role: message.role as MessageRole,
      content: message.content,
    }));

    return {
      success: true,
      chat: {
        id: chat.id,
        messages: formattedMessages,
      },
    };
  } catch (error) {
    console.error("Failed to get chat:", error);
    return { success: false, error: "Failed to get chat" };
  }
}
