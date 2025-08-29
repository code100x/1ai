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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MagnifyingGlassIcon,
  ShareFatIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../svgs/logo";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useExecutionContext } from "@/contexts/execution-context";
import { Execution } from "@/hooks/useExecution";
import { BACKEND_URL, cn } from "@/lib/utils";

export function UIStructure() {
  const [uiExecutions, setUiExecutions] = useState<Execution[]>([]);
  const [hoverChatId, setHoverChatId] = useState<string>("");
  const [isAppsDialogOpen, setIsAppsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { executions, loading, createNewExecution } = useExecutionContext();
  const router = useRouter();
  
  const pathname = usePathname();
  const currentConversationId = pathname.split("/").pop();

  useEffect(() => {
    if (executions) {
      const term = searchTerm.trim().toLowerCase();
      if (!term) {
        setUiExecutions(executions);
      } else {
        setUiExecutions(
          executions.filter((execution) =>
            (execution.title ?? "").toLowerCase().includes(term)
          )
        );
      }
    }
  }, [executions, searchTerm]);

  const handleDeleteExecution = async (executionId: string) => {
    try {
      await fetch(`${BACKEND_URL}/ai/chat/${executionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUiExecutions(executions.filter((execution) => execution.id !== executionId));
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const { user, isLoading: isUserLoading } = useUser();

  // Available AI Apps
  const availableApps = [
    {
      id: "article-summarizer",
      name: "Article Summarizer",
      description:
        "Summarize long articles into concise, easy-to-read summaries",
      icon: "📄",
      credits: 2,
    },
  ];

  const handleAppNavigation = (appId: string) => {
    router.push(`/apps/${appId}/`);
    setIsAppsDialogOpen(false);
  };

  return (
    <Sidebar className={`border py-2 pl-2`}>
      <SidebarContent className="h-full justify-between">
        <SidebarGroup className="flex flex-col gap-4">
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
                  router.push(`/ask`);
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                : uiExecutions.map((execution: Execution) => (
                    <SidebarMenuItem key={execution.id}>
                      <SidebarMenuButton
                        className={`group relative w-full text-left hover:bg-primary/20 transition ${execution.id === currentConversationId ? "bg-primary/20" : ""}`}
                        onMouseEnter={() => setHoverChatId(execution.id)}
                        onMouseLeave={() => setHoverChatId("")}
                        onClick={() => router.push(`/ask/${execution.id}`)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="z-[-1] cursor-pointer truncate">
                            {execution.title}
                          </span>
                          <div
                            className={cn(
                              "absolute top-0 right-0 z-[5] h-full w-12 rounded-r-md blur-[2em]", 
                              execution.id === hoverChatId && "bg-primary"
                            )}
                          />
                          <div
                            className={cn(
                              "absolute top-1/2 -right-16 z-[10] flex h-full -translate-y-1/2 items-center justify-center gap-1.5 rounded-r-md bg-transparent px-1 backdrop-blur-xl transition-all duration-200 ease-in-out",
                              execution.id === hoverChatId && "group-hover:right-0"
                            )}
                          >
                            <div
                              className="flex items-center justify-center rounded-md"
                              onClick={(e) => {
                                e.preventDefault();
                                const shareLink =
                                  process.env.NEXT_PUBLIC_APP_URL +
                                  `/ask/${execution.id}`;
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
                              onClick={() =>
                                handleDeleteExecution(execution.id)
                              }
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
          <Dialog open={isAppsDialogOpen} onOpenChange={setIsAppsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full" size="lg">
                AI Apps
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>AI Apps</DialogTitle>
                <DialogDescription>
                  Choose from our collection of AI-powered applications to
                  enhance your productivity.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {availableApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => handleAppNavigation(app.id)}
                  >
                    <div className="text-2xl">{app.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {app.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {app.credits} credits per use
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
