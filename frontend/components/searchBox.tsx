"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Execution } from "@/hooks/useExecution";
import { useState } from "react";

interface SearchBoxProps {
  executions: Execution[];
}

export const SearchBox = ({ executions }: SearchBoxProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleExecutionSelect = (executionId: string) => {
    router.push(`/ask/${executionId}`);
  };

  // Filter executions based on search term - add safety check
  const filteredExecutions = (executions || []).filter((execution) =>
    (execution.title ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger className="hover:bg-muted flex size-7 items-center justify-center rounded-lg">
        <MagnifyingGlassIcon weight="bold" className={cn("size-4")} />
      </DialogTrigger>
      <DialogContent className="border-none p-0">
        <DialogTitle className="hidden">Search chats</DialogTitle>
        <Command>
          <CommandInput
            placeholder="Search for chats..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No chats found.</CommandEmpty>
            <CommandGroup heading="Recent Chats">
              {filteredExecutions.map((execution) => (
                <CommandItem
                  key={execution.id}
                  onSelect={() => handleExecutionSelect(execution.id)}
                  className="cursor-pointer"
                >
                  <span className="truncate">
                    {execution.title || "Untitled Chat"}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
