"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function getChats() {
  try {
    const authResult = await auth();
    if (!authResult?.user?.id) {
      return { success: false, error: "Unauthorized", chats: [] };
    }

    const userId = authResult.user.id;


    const chats = await db.chat.findMany({
      where: {
        userId,
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      success: true,
      chats: chats.map((chat) => ({
        id: chat.id,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        lastMessage: chat.messages[0]?.content ?? "",
      })),
    };
  } catch (error) {
    console.error("Failed to get chats:", error);
    return { success: false, error: "Failed to get chats", chats: [] };
  }
}
