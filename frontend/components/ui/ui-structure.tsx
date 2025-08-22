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
import { Badge } from "@/components/ui/badge";
import { Button } from "./button";
import { api } from "@/trpc/react";
import { useState, useEffect, useMemo, useCallback } from "react";
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

interface Message {
  content: string;
}

interface Chat {
  id: string;
  updatedAt: Date;
  isSaved: boolean;
  userId: string;
  messages: Message[];
}

interface ChatActionButtonsProps {
  chat: Chat;
  isVisible: boolean;
  onSave: (chatId: string) => void;
  onRemoveFromSaved: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

// extracted component
const ChatActionButtons: React.FC<ChatActionButtonsProps> = ({
  chat,
  isVisible,
  onSave,
  onRemoveFromSaved,
  onDelete,
}) => {
  const handleShare = useCallback((e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/chat/share/${chatId}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Share link copied to clipboard");
  }, []);

  const handleBookmark = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (chat.isSaved) {
      onRemoveFromSaved(chat.id);
    } else {
      onSave(chat.id);
    }
  }, [chat.id, chat.isSaved, onRemoveFromSaved, onSave]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(chat.id);
  }, [chat.id, onDelete]);

  return (
    <>
      <div
        className={`absolute top-0 right-0 z-[5] h-full w-12 rounded-r-md blur-[2em] transition-all duration-200 ${
          isVisible ? "bg-primary" : ""
        }`}
      />
      <div
        className={`absolute top-1/2 z-[10] flex h-full -translate-y-1/2 items-center justify-center gap-1.5 rounded-r-md bg-transparent px-1 backdrop-blur-xl transition-all duration-200 ease-in-out ${
          isVisible ? "right-0" : "-right-16"
        }`}
      >
        <button
          className="flex items-center justify-center rounded-md p-1 hover:bg-accent"
          onClick={handleBookmark}
          aria-label={chat.isSaved ? "Remove from saved" : "Save chat"}
        >
          <BookmarkIcon
            weight={chat.isSaved ? "fill" : "bold"}
            className="size-4 hover:text-foreground"
          />
        </button>
        <button
          className="flex items-center justify-center rounded-md p-1 hover:bg-accent"
          onClick={(e) => handleShare(e, chat.id)}
          aria-label="Share chat"
        >
          <ShareFatIcon
            weight="fill"
            className="size-4 hover:text-foreground"
          />
        </button>
        <button
          className="flex items-center justify-center rounded-md p-1 hover:bg-accent"
          onClick={handleDelete}
          aria-label="Delete chat"
        >
          <TrashIcon
            weight="bold"
            className="size-4 hover:text-foreground"
          />
        </button>
      </div>
    </>
  );
};

// loading skeeleton
const ChatItemSkeleton: React.FC = () => (
  <div className="mb-2 h-7 w-full animate-pulse rounded-md bg-primary/15" />
);

interface ChatItemProps {
  chat: Chat;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSave: (chatId: string) => void;
  onRemoveFromSaved: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

// chat item component (extracted)
const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onSave,
  onRemoveFromSaved,
  onDelete,
}) => {
  const chatPreview = useMemo(() => {
    const content = chat.messages[0]?.content || "Empty chat";
    return content.length > 30 ? `${content.slice(0, 30)}...` : content;
  }, [chat.messages]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="group relative hover:bg-primary/20"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        asChild
      >
        <div className="flex w-full items-center justify-between">
          <Link href={`/ask/${chat.id}`} className="flex-1">
            <span className="z-[-1]">{chatPreview}</span>
            <ChatActionButtons
              chat={chat}
              isVisible={isHovered}
              onSave={onSave}
              onRemoveFromSaved={onRemoveFromSaved}
              onDelete={onDelete}
            />
          </Link>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function UIStructure() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverChatId, setHoverChatId] = useState<string>("");
  
  const { data: chatsData, isLoading } = api.chat.getAllChats.useQuery();
  const saveChat = api.chat.saveChat.useMutation();
  const removeFromSaved = api.chat.removeFromSaved.useMutation();
  const deleteChat = api.chat.deleteChat.useMutation();
  const router = useRouter();
  const { data: session } = useSession();

  // filtered chats
  const { savedChats, unsavedChats } = useMemo(() => {
    if (!chatsData) return { savedChats: [], unsavedChats: [] };

    const filteredChats = (chatsData as Chat[]).filter((chat) =>
      chat.messages[0]?.content
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) || false
    );

    return {
      savedChats: filteredChats.filter((chat) => chat.isSaved),
      unsavedChats: filteredChats.filter((chat) => !chat.isSaved),
    };
  }, [chatsData, searchTerm]);

  // updates for error handling
  const handleSaveChat = useCallback(async (chatId: string) => {
    try {
      await saveChat.mutateAsync({ chatId });
      toast.success("Chat saved successfully");
    } catch (error) {
      console.error("Error saving chat:", error);
      toast.error("Failed to save chat. Please try again.");
    }
  }, [saveChat]);

  const handleRemoveFromSaved = useCallback(async (chatId: string) => {
    try {
      await removeFromSaved.mutateAsync({ chatId });
      toast.success("Chat removed from saved successfully");
    } catch (error) {
      console.error("Error removing chat from saved:", error);
      toast.error("Failed to remove chat from saved. Please try again.");
    }
  }, [removeFromSaved]);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    try {
      await deleteChat.mutateAsync({ chatId });
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat. Please try again.");
    }
  }, [deleteChat]);

  const handleNewChat = useCallback(() => {
    router.push("/ask");
  }, [router]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const renderChatList = (chats: Chat[]) => {
    if (isLoading) {
      return Array.from({ length: 4 }, (_, i) => <ChatItemSkeleton key={i} />);
    }

    if (chats.length === 0) {
      return (
        <div className="py-4 text-center text-sm text-muted-foreground">
          {searchTerm ? "No chats found" : "No chats yet"}
        </div>
      );
    }

    return chats.map((chat) => (
      <ChatItem
        key={chat.id}
        chat={chat}
        isHovered={hoverChatId === chat.id}
        onMouseEnter={() => setHoverChatId(chat.id)}
        onMouseLeave={() => setHoverChatId("")}
        onSave={handleSaveChat}
        onRemoveFromSaved={handleRemoveFromSaved}
        onDelete={handleDeleteChat}
      />
    ));
  };

  return (
    <Sidebar className="border py-2 pl-2">
      <SidebarContent className="rounded-2xl">
        <SidebarGroup className="flex flex-col gap-8 pt-3">
          <SidebarGroupLabel className="h-fit p-0">
            <div className="flex h-12 w-full flex-col items-center gap-2 rounded-lg">
              <div className="flex w-full items-center gap-2 rounded-lg p-1 text-lg">
                <SidebarTrigger className="shrink-0" />
                <div className="flex size-4 w-full flex-1 items-center justify-center rounded-lg dark:text-primary-foreground">
                  <Logo />
                </div>
                <span className="size-6" />
              </div>
              <Button
                onClick={handleNewChat}
                variant="accent"
                className="w-full"
              >
                New Chat
              </Button>
            </div>
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="mt-4">
            {/* Search Input */}
            <div className="mb-4 flex items-center gap-2 border-b">
              <MagnifyingGlassIcon className="text-foreground" weight="bold" />
              <Input
                placeholder="Search for chats"
                value={searchTerm}
                onChange={handleSearchChange}
                className="rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
                aria-label="Search chats"
              />
            </div>

            {/* Saved Chats Section */}
            {savedChats.length > 0 && (
              <>
                <SidebarGroupLabel className="p-0">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 rounded-lg text-foreground"
                  >
                    <span className="font-semibold">Saved Chats</span>
                    <span className="text-xs">({savedChats.length})</span>
                  </Badge>
                </SidebarGroupLabel>
                <SidebarMenu className="mt-2 p-0">
                  {renderChatList(savedChats)}
                </SidebarMenu>
                <Separator className="my-2" />
              </>
            )}

            {/* All Chats Section */}
            <SidebarMenu className="mt-2 w-full p-0">
              {renderChatList(unsavedChats)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Footer */}
        <SidebarFooter className="absolute bottom-0 z-[70] h-20 w-full bg-background px-4 py-3">
          {session?.user && (
            <div className="flex items-center space-x-3">
              <img
                src={session.user.image ?? "/default-avatar.png"}
                alt={session.user.name ?? "User"}
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
              />
              <div className="flex flex-col text-sm">
                <span className="font-medium">
                  {session.user.name ?? "Anonymous"}
                </span>
                {session.user.email && (
                  <span className="w-36 truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                )}
              </div>
            </div>
          )}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}