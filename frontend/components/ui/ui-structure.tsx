/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  BookmarkIcon,
  MagnifyingGlassIcon,
  ShareFatIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Separator } from "./separator";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "../svgs/logo";
import { useSession } from "next-auth/react";
import { Conversation, useConversation } from "@/hooks/useConversation";
import { useUser } from "@/hooks/useUser";

interface Chat {
  id: string;
  updatedAt: Date;
  isSaved: boolean;
  userId: string;
  messages: {
    content: string;
  }[];
}

export function UIStructure() {
  const [chats, setChats] = useState<Conversation[]>([]);
  const [hoverChatId, setHoverChatId] = useState<string>("");
  const { conversations, loading, error } = useConversation();
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
      <SidebarContent className="rounded-2xl">
        <SidebarGroup className="flex flex-col gap-8 pt-3">
          <SidebarGroupLabel className="h-fit p-0">
            <div className="flex h-12 w-full flex-col items-center gap-2 rounded-lg">
              <div className="flex w-full items-center gap-2 rounded-lg p-1 text-lg">
                <SidebarTrigger className="shrink-0" />
                <div className="dark:text-primary-foreground flex size-4 w-full flex-1 items-center justify-center rounded-lg">
                  <Logo />
                </div>
                <span className="size-6"></span>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/ask");
                }}
                variant="accent"
                className="w-full"
              >
                New Chat
              </Button>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <div className="mb-4 flex items-center gap-2 border-b">
              <MagnifyingGlassIcon className="text-foreground" weight="bold" />
              <Input
                placeholder="Search for chats"
                className="rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
              />
            </div>

            <SidebarMenu className="mt-2 w-full p-0">
              {loading
                ? // Skeleton loader while loading saved chats
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-primary/15 mb-2 h-7 w-full animate-pulse rounded-md"
                    />
                  ))
                : chats
                    .map((chat: Conversation) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          className="group hover:bg-primary/20 relative"
                          onMouseEnter={() => setHoverChatId(chat.id)}
                          onMouseLeave={() => setHoverChatId("")}
                          asChild
                        >
                          <div className="flex w-full items-center justify-between">
                              <span className="z-[-1]">
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
                                    toast.success(
                                      "Share link copied to clipboard"
                                    );
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
        <SidebarFooter className="bg-background absolute bottom-0 z-[70] h-20 w-full px-4 py-3">
          {/* {user && (
            <div className="flex items-center space-x-3">
              <img
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXXckRlC33zt7zHBLpEEEeqY_MGIn89LOdGw&s"}
                alt={user.name ?? "User"}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex flex-col text-sm">
                <span className="font-medium">{user.name ?? "Anonymous"}</span>
                {user.email && (
                  <span className="w-36 truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          )} */}
          {user && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </Button>
          )}
          {!isUserLoading && !user && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push("/auth");
              }}
            >
            Login
          </Button>
          )}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
