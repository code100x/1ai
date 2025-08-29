"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
interface Chat {
  id: string;
  updatedAt: Date;
  userId: string;
  messages: {
    content: string;
  }[];
}

export const SidebarToggle = () => {
  const { open } = useSidebar();
  const [chats, setChats] = useState<Chat[]>([]);

  return (
    <div
      className={`${open ? "bg-transparent" : "bg-background"} flex items-center gap-1 rounded-lg p-1`}
    >
      <SidebarTrigger className={open ? "lg:invisible" : "lg:flex"} />

      <Dialog>
        <DialogTrigger className="hover:bg-muted flex size-7 items-center justify-center rounded-lg">
          <MagnifyingGlassIcon
            weight="bold"
            className={cn(open ? "lg:invisible" : "flex", "size-4")}
          />
        </DialogTrigger>
        <DialogContent className="border-none p-0">
          <DialogTitle className="hidden">Search bar</DialogTitle>
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="no-scrollbar" heading="Recent Chats">
                {chats?.map((chat: Chat) => (
                  <CommandItem key={chat.id}>
                    <span>{chat.messages[0]?.content}...</span>
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
        <PlusIcon weight="bold" className={open ? "lg:invisible" : "flex"} />
      </Link>
    </div>
  );
};
