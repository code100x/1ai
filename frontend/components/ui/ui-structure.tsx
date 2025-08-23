/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./button";
import { useState } from "react";
import { useEffect } from "react";
import { Input } from "./input";
import {
  MagnifyingGlassIcon,
  ShareFatIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Conversation } from "@/hooks/useConversation";
import { useUser } from "@/hooks/useUser";
import { useConversationContext } from "@/contexts/conversation-context";
import Link from "next/link";

export function UIStructure() {
  const [chats, setChats] = useState<Conversation[]>([]);
  const [hoverChatId, setHoverChatId] = useState<string>("");
  const { conversations, loading, error, createNewConversation } =
    useConversationContext();
  const router = useRouter();

  useEffect(() => {
    if (conversations) {
      setChats(conversations);
    }
  }, [conversations]);

  const handleDeleteChat = (chatId: string) => {
    try {
      toast.success("Chat deleted successfully");
      setChats(chats.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const { user, isLoading: isUserLoading } = useUser();

  return (
    <Sidebar className={`border py-2 pl-2`}>
      <SidebarContent className="h-full justify-between">
        <SidebarGroup className="flex flex-col gap-8">
          <SidebarHeader className="sticky top-0 !p-0">
            <div className="flex w-full flex-col items-center gap-2 rounded-lg">
              <div className="flex w-full items-center gap-2 rounded-lg p-1 text-lg justify-between">
                <SidebarTrigger className="shrink-0" />
                <h1 className="text-2xl font-bold text-foreground">
                  1<span className="text-yellow-500">ai</span>
                </h1>
                <span className="size-6"></span>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  const id = createNewConversation();
                  router.push(`/ask/${id}`);
                }}
                variant="accent"
                className="w-full"
              >
                New Chat
              </Button>
            </div>

            <div className="flex items-center gap-2 pb-2 border-b">
              <MagnifyingGlassIcon className="text-foreground" weight="bold" />
              <Input
                placeholder="Search for chats"
                className="rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
          </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu className="w-full p-0">
              {loading
                ? // Skeleton loader while loading saved chats
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-primary/15 mb-2 h-7 w-full animate-pulse rounded-md"
                    />
                  ))
                : chats.map((chat: Conversation) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        className="group hover:bg-primary/20 relative"
                        onMouseEnter={() => setHoverChatId(chat.id)}
                        onMouseLeave={() => setHoverChatId("")}
                        onClick={() => router.push(`/ask/${chat.id}`)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="z-[-1] cursor-pointer truncate">
                            {chat.title}
                          </span>
                          <div
                            className={`absolute top-0 right-0 z-[5] h-full w-12 rounded-r-md blur-[2em] ${chat.id === hoverChatId ? "bg-primary" : ""}`}
                          />
                          <div
                            className={`absolute top-1/2 -right-16 z-[10] flex h-full -translate-y-1/2 items-center justify-center gap-1.5 rounded-r-md bg-transparent px-1 backdrop-blur-xl transition-all duration-200 ease-in-out ${chat.id === hoverChatId ? "group-hover:right-0" : ""}`}
                          >
                            <div
                              className="flex items-center justify-center rounded-md"
                              onClick={(e) => {
                                e.preventDefault();
                                const shareLink =
                                  process.env.NEXT_PUBLIC_APP_URL +
                                  `/chat/share/${chat.id}`;
                                navigator.clipboard.writeText(shareLink);
                                toast.success("Share link copied to clipboard");
                              }}
                            >
                              <ShareFatIcon
                                weight="fill"
                                className="hover:text-foreground size-4"
                              />
                            </div>

                            <div
                              className="flex items-center justify-center rounded-md"
                              onClick={() => handleDeleteChat(chat.id)}
                            >
                              <TrashIcon
                                weight={"bold"}
                                className="hover:text-foreground size-4"
                              />
                            </div>
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="sticky bottom-0 flex flex-col gap-2 w-full p-3 bg-background">
          {!isUserLoading && !user && (
            <Link href="/auth">
              <Button variant="secondary" className="w-full" size="lg">
                Login
              </Button>
            </Link>
          )}
          {user && (
            <Button
              variant="destructive"
              className="w-full"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </Button>
          )}

          <div className="flex items-center gap-2 justify-center">
            <Link href="/terms" target="_target" className="text-xs">
              Terms
            </Link>
            <Link href="/privacy" target="_target" className="text-xs">
              Privacy
            </Link>
            <Link href="/refund" target="_target" className="text-xs">
              Refund
            </Link>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
