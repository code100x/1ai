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
} from "@/components/ui/sidebar";
import { Button } from "./button";
import { useState } from "react";
import { useEffect } from "react";
import { NavSetting } from "@/components/nav-setting";
import {
  MagnifyingGlassIcon,
  ShareFatIcon,
  TrashIcon,
  DotsThreeIcon,
} from "@phosphor-icons/react";
import { EllipsisIcon } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../svgs/logo";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useExecutionContext } from "@/contexts/execution-context";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Execution } from "@/hooks/useExecution";
import { BACKEND_URL, cn } from "@/lib/utils";

export function UIStructure() {
  const [uiExecutions, setUiExecutions] = useState<Execution[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [hoverChatId, setHoverChatId] = useState<string>("");
  const [isAppsDialogOpen, setIsAppsDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
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
            (execution.title ?? "").toLowerCase().includes(term),
          ),
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUiExecutions(
        executions.filter((execution) => execution.id !== executionId),
      );
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

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
        <SidebarGroup className="flex flex-col gap-8">
          <SidebarHeader className="sticky top-0 !p-0">
            <div className="flex w-full flex-col items-center gap-2 rounded-lg">
              <div className="flex w-full items-center gap-2 rounded-lg p-1 text-lg justify-between">
                <h1 className="text-3xl font-serif text-foreground">
                  1<span className="text-orange-400">ai</span>
                </h1>
                <span className="size-6"></span>
              </div>
              <Button
                className="w-full text-sm text-white bg-[#fa7319] hover:bg-[#fa7319]/90 h-10 px-3.5 rounded-xl inset-shadow-sm inset-shadow-white/60 font-medium border border-black/4 outline-0"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/ask`);
                }}
                variant="accent"
              >
                New Chat
              </Button>
            </div>

            <Dialog
              open={isSearchDialogOpen}
              onOpenChange={setIsSearchDialogOpen}
            >
              <DialogTrigger className="relative flex items-center p-2 gap-2 bg-zinc-400/10 px-2 rounded-xl border border-black/10 dark:border-zinc-400/8 inset-shadow-sm cursor-pointer hover:bg-orange-200/10 dark:hover:bg-orange-100/10 dark:hover:[&>*]:text-orange-100 hover:[&>*]:text-orange-400">
                <MagnifyingGlassIcon className="text-foreground" size={18} />
                <p className="rounded-none text-sm border-none bg-transparent px-0 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent">
                  Search for chats
                </p>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[35rem] rounded-xl p-0 overflow-auto gap-0 border-none">
                <DialogHeader className="bg-transparent border-b dark:border-b-orange-100/5">
                  <Input
                    placeholder="Search for chats"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-none rounded-none text-sm rounded-tl-xl rounded-tr-xl shadow-none focus-visible:ring-0 bg-transparent dark:bg-transparent px-4 py-6"
                  />
                </DialogHeader>
                <div className="grid min-h-[8rem] max-h-[15rem] overflow-auto pb-3">
                  <div className="flex flex-col px-2 justify-center">
                    {uiExecutions.length === 0 ? (
                      <div className="flex items-center justify-center">
                        <p className="text-xs">No chat found!</p>
                      </div>
                    ) : (
                      <div>
                        <DialogTitle className="font-normal tracking-wider text-xs text-orange-100/50 p-2">
                          Chats
                        </DialogTitle>
                        {uiExecutions.map((execution: Execution) => (
                          <div key={execution.id} className="">
                            <div
                              className={`p-2 rounded-lg hover:bg-orange-100/10 hover:text-orange-100`}
                              onMouseEnter={() => setHoverChatId(execution.id)}
                              onMouseLeave={() => setHoverChatId("")}
                              onClick={() => {
                                router.push(`/ask/${execution.id}`);
                                setIsSearchDialogOpen(false);
                              }}
                            >
                              <div className="flex w-full items-center justify-between text-sm">
                                <span className="">{execution.title}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                        className={`group relative font-normal cursor-pointer rounded-xl w-full active:bg-transparent active:text-inherit hover:bg-orange-300/20 hover:text-orange-400 dark:hover:text-orange-100 dark:hover:bg-orange-100/10 ${execution.id === currentConversationId ? "bg-orange-300/20 text-orange-400 dark:text-orange-100 dark:bg-orange-100/10" : ""}`}
                        onMouseEnter={() => setHoverChatId(execution.id)}
                        onMouseLeave={() => setHoverChatId("")}
                        onClick={() => router.push(`/ask/${execution.id}`)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="cursor-pointer truncate">
                            {execution.title}
                          </span>

                          <div className="realtive group flex items-center">
                            <DropdownMenu
                              open={openMenuId === execution.id}
                              onOpenChange={(isOpen: boolean) =>
                                setOpenMenuId(isOpen ? execution.id : null)
                              }
                            >
                              <DropdownMenuTrigger asChild>
                                <button
                                  className={cn(
                                    "opacity-0 transition-opacity",
                                    {
                                      "opacity-100":
                                        execution.id === hoverChatId ||
                                        openMenuId === execution.id,
                                    },
                                  )}
                                >
                                  <EllipsisIcon className="size-5 text-white" />
                                </button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="border-none rounded-xl">
                                <DropdownMenuItem
                                  className="focus:bg-orange-300/20 focus:text-orange-400 darK:focus:bg-orange-100/10 dark:focus:text-orange-100 rounded-xl"
                                  onClick={() => {
                                    const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/ask/${execution.id}`;
                                    navigator.clipboard.writeText(shareLink);
                                    toast.success(
                                      "Share link copied to clipboard",
                                    );
                                    setOpenMenuId(null);
                                  }}
                                >
                                  <ShareFatIcon className="focus:text-orange-400 dark:text-orange-100" />
                                  Share
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    handleDeleteExecution(execution.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="focus:bg-red-400/10 text-red-400 rounded-xl focus:text-red-400"
                                >
                                  <TrashIcon className="text-red-400" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            {/* <div
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
                            </div> */}

                            {/* <div
                              className="flex items-center justify-center rounded-md"
                              onClick={() =>
                                handleDeleteExecution(execution.id)
                              }
                            >
                              <TrashIcon
                                weight={"bold"}
                                className="hover:text-foreground size-4"
                              />
                            </div> */}
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarFooter className="sticky bottom-0 flex flex-col gap-2 w-full p-3 bg-background">
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
          </Dialog> */}

        <SidebarFooter className="sticky bottom-0 flex flex-col gap-2 w-full p-3 bg-transparent">
          <NavSetting />

          {/* {user && (
            <Dialog open={isAppsDialogOpen} onOpenChange={setIsAppsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full " size="lg">
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
>>>>>>> 2aafbba (feat(ui): revamp entire UI)

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )} */}

          {/* {user && (
            <Button
              variant="destructive"
              className="w-full text-sm text-white h-10 px-3.5 rounded-xl inset-shadow-sm inset-shadow-white/60 font-medium border border-black/4 outline-0"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </Button>
          )} */}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
