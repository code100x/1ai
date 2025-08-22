"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

type MessageRole = "user" | "system" | "assistant" | "data";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

export async function saveChat(messages: Message[]) {
  try {
    const authResult = await auth();
    if (!authResult?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = authResult.user.id;


    let chat = await db.chat.findFirst({
      where: {
        userId,
        messages: {
          some: {
            id: messages[0]?.id,
          },
        },
      },
    });

    if (!chat) {

      chat ??= await db.chat.create({
        data: {
          userId,
        },
      });
    }


    for (const message of messages) {

      const existingMessage = await db.message.findFirst({
        where: {
          id: message.id,
          chatId: chat.id,
        },
      });

      if (!existingMessage) {
        await db.message.create({
          data: {
            id: message.id,
            chatId: chat.id,
            content: message.content,
            role: message.role === "user" ? "USER" : "ASSISTANT",
          },
        });
      }
    }

    return { success: true, chatId: chat.id };
  } catch (error) {
    console.error("Failed to save chat:", error);
    return { success: false, error: "Failed to save chat" };
  }
}
