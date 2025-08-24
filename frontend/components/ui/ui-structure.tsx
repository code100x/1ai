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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MagnifyingGlassIcon,
  ShareFatIcon,
  TrashIcon,
  DotsThreeIcon,
  PencilIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Logo } from "../svgs/logo";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useExecutionContext } from "@/contexts/execution-context";
import { Execution } from "@/hooks/useExecution";
import { BACKEND_URL } from "@/lib/utils";

export function UIStructure() {
  const [uiExecutions, setUiExecutions] = useState<Execution[]>([]);
  const [hoverChatId, setHoverChatId] = useState<string>("");
  const [isAppsDialogOpen, setIsAppsDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameExecutionId, setRenameExecutionId] = useState<string>("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { executions, loading, createNewExecution } = useExecutionContext();
  const router = useRouter();

  useEffect(() => {
    if (executions) {
      setUiExecutions(executions);
    }
  }, [executions]);

  const handleRenameExecution = async (executionId: string, title: string) => {
    try {
      setIsRenaming(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to rename chats");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/execution/${executionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rename chat");
      }

      const data = await response.json();
      
      setUiExecutions(prev => 
        prev.map(exec => 
          exec.id === executionId 
            ? { ...exec, title: data.execution.title }
            : exec
        )
      );
      
      toast.success("Chat renamed successfully");
      setIsRenameDialogOpen(false);
      setNewTitle("");
      setRenameExecutionId("");
    } catch (error: any) {
      console.error("Error renaming chat:", error);
      toast.error(error.message || "Failed to rename chat");
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDeleteExecution = async (executionId: string) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to delete chats");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/execution/${executionId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete chat");
      }

      setUiExecutions(prev => prev.filter(exec => exec.id !== executionId));
      toast.success("Chat deleted successfully");
    } catch (error: any) {
      console.error("Error deleting chat:", error);
      toast.error(error.message || "Failed to delete chat");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyShareLink = (executionId: string) => {
    const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/chat/share/${executionId}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Share link copied to clipboard");
  };

  const openRenameDialog = (executionId: string, currentTitle: string) => {
    setRenameExecutionId(executionId);
    setNewTitle(currentTitle);
    setIsRenameDialogOpen(true);
  };

  const { user, isLoading: isUserLoading } = useUser();

  // Available AI Apps
  const availableApps = [
    {
      id: "article-summarizer",
      name: "Article Summarizer",
      description: "Summarize long articles into concise, easy-to-read summaries",
      icon: "📄",
      credits: 2
    }
  ];

  const handleAppNavigation = (appId: string) => {
    router.push(`/apps/${appId}/`);
    setIsAppsDialogOpen(false);
  };

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
                  const id = createNewExecution();
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
                : uiExecutions.map((execution: Execution) => (
                    <SidebarMenuItem key={execution.id}>
                      <SidebarMenuButton
                        className="group hover:bg-primary/20 relative pr-8"
                        onClick={() => router.push(`/ask/${execution.id}`)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="cursor-pointer truncate flex-1 text-left">
                            {execution.title}
                          </span>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger 
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DotsThreeIcon 
                                className="size-4 text-muted-foreground hover:text-foreground" 
                                weight="bold" 
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openRenameDialog(execution.id, execution.title);
                                }}
                                className="cursor-pointer"
                              >
                                <PencilIcon className="size-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyShareLink(execution.id);
                                }}
                                className="cursor-pointer"
                              >
                                <ShareFatIcon className="size-4 mr-2" weight="fill" />
                                Copy Link
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteExecution(execution.id);
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                                variant="destructive"
                                disabled={isDeleting}
                              >
                                <TrashIcon className="size-4 mr-2" weight="bold" />
                                {isDeleting ? "Deleting..." : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              <Button
                variant="secondary"
                className="w-full"
                size="lg"
              >
                AI Apps
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>AI Apps</DialogTitle>
                <DialogDescription>
                  Choose from our collection of AI-powered applications to enhance your productivity.
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
                      <p className="text-sm text-muted-foreground">{app.description}</p>
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

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new name for this chat conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new chat name"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTitle.trim() && !isRenaming) {
                  handleRenameExecution(renameExecutionId, newTitle);
                }
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isRenaming}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={() => handleRenameExecution(renameExecutionId, newTitle)}
              disabled={!newTitle.trim() || isRenaming}
              className="min-w-[80px]"
            >
              {isRenaming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Saving...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
