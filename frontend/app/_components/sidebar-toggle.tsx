"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore, useConversationStore } from "@/store";
import { ApiService } from "@/lib/api";

export const SidebarToggle = () => {
  const { open } = useSidebar();
  const { token } = useAuthStore();
  const { conversations, setConversations } = useConversationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && conversations.length === 0) {
      loadConversations();
    }
  }, [token]);

  const loadConversations = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const fetchedConversations = await ApiService.getConversations(token);
      setConversations(fetchedConversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        updatedAt: conv.updatedAt,
      })));
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${open ? "bg-transparent" : "bg-background"} flex items-center gap-1 rounded-lg p-1`}
    >
      <SidebarTrigger className={open ? "invisible" : "flex"} />

      <Dialog>
        <DialogTrigger className="hover:bg-muted flex size-7 items-center justify-center rounded-lg">
          <MagnifyingGlassIcon
            weight="bold"
            className={cn(open ? "invisible" : "flex", "size-4")}
          />
        </DialogTrigger>
        <DialogContent className="border-none p-0">
          <DialogTitle className="hidden">Search bar</DialogTitle>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading conversations..." : "No conversations found."}
              </CommandEmpty>
              <CommandGroup className="no-scrollbar" heading="Recent Chats">
                {conversations?.map((conversation) => (
                  <CommandItem key={conversation.id} asChild>
                    <Link href={`/ask/${conversation.id}`} className="cursor-pointer">
                      <span className="truncate">
                        {conversation.title || "Untitled"}
                      </span>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      <Link
        href={"/ask"}
        className="hover:bg-muted flex size-7 items-center justify-center rounded-lg"
      >
        <PlusIcon weight="bold" className={open ? "invisible" : "flex"} />
      </Link>
    </div>
  );
};
