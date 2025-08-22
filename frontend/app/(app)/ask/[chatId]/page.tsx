"use client";
import Chat from "@/app/_components/Chat";
import { useParams } from "next/navigation";

export default function SingleChatPage() {
  const { chatId } = useParams();
  return (
    <>
      <Chat chatId={chatId as string} />
    </>
  );
}
