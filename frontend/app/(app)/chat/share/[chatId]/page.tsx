"use client";
import SharedChat from "@/app/_components/SharedChat";
import { useParams } from "next/navigation";

export default function SingleChatPage() {
  const { chatId } = useParams();
  console.log(chatId)
  return (
    <>
      <SharedChat chatId={chatId as string} />
    </>
  );
}
