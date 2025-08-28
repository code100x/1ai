"use client";
import { v4 } from "uuid";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  SpinnerGapIcon,
  CopyIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowsLeftRightIcon,
} from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import TabsSuggestion from "./tabs-suggestion";
import { ModelSelector } from "@/components/ui/model-selector";
import { DEFAULT_MODEL_ID } from "@/models/constants";
import { useTheme } from "next-themes";
import { ArrowUpIcon, WrapText } from "lucide-react";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useConversationById } from "@/hooks/useConversation";
import { useCredits } from "@/hooks/useCredits";
import { UpgradeCTA } from "@/components/ui/upgrade-cta";
import { useGlobalKeyPress } from "@/hooks/useGlobalKeyPress";
import { useExecutionContext } from "@/contexts/execution-context";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: true,
  display: "swap",
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

interface UIInputProps {
  conversationId?: string;
}

const options = {
  keepBackground: false,
  theme: {
    dark: "dracula",
    light: "github-light",
  },
};

const UIInput = ({
  conversationId: initialConversationId,
}: UIInputProps = {}) => {
  const [model, setModel] = useState<string>(DEFAULT_MODEL_ID);
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isWrapped, setIsWrapped] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId || v4(),
  );
  const { resolvedTheme } = useTheme();
  const { user, isLoading: isUserLoading } = useUser();
  const { conversation, loading: converstionLoading } = useConversationById(
    initialConversationId,
  );
  const {
    userCredits,
    isLoading: isCreditsLoading,
    refetchCredits,
  } = useCredits();
  const { refreshExecutions } = useExecutionContext();
  const router = useRouter();

  const toggleWrap = useCallback(() => {
    setIsWrapped((prev) => !prev);
  }, []);

  useEffect(() => {
    if (conversation?.messages && initialConversationId) {
      setMessages(conversation.messages);
      setShowWelcome(false);
    }
  }, [conversation, initialConversationId]);

  useGlobalKeyPress({
    inputRef: textareaRef,
    onKeyPress: (key: string) => {
      setQuery(prev => prev + key);
    },
    disabled: !!(userCredits && userCredits.credits <= 0 && !userCredits.isPremium),
    loading: isLoading,
  });

  const processStream = async (response: Response, userMessage: string) => {
    if (!response.ok) {
      // Handle credit-related errors
      if (response.status === 403) {
        try {
          const errorData = await response.json();
          if (errorData.message?.includes("Insufficient credits")) {
            // Refetch credits to update UI
            await refetchCredits();
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
      }
      console.error("Error from API:", response.statusText);
      setIsLoading(false);
      return;
    }

    const tempMessageId = `ai-${Date.now()}`;

    try {
      const reader = response.body?.getReader();
      if (!reader) {
        console.error("No reader available");
        setIsLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: tempMessageId, role: "assistant", content: "" },
      ]);

      let accumulatedContent = "";
      let buffer = "";
      let updateTimeout: NodeJS.Timeout | null = null;

      const updateMessage = (content: string) => {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempMessageId ? { ...msg, content } : msg,
            ),
          );
        }, 50);
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempMessageId
                ? { ...msg, content: accumulatedContent }
                : msg,
            ),
          );

          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }

          break;
        }

        const chunk = new TextDecoder().decode(value);
        console.log(chunk);

        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let hasNewContent = false;

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const data = line.substring(6);

            if (data === "[DONE]") {
              continue;
            }

            try {
              const parsedData = JSON.parse(data) as {
                content?: string;
              };
              const content = parsedData.content;
              if (content) {
                accumulatedContent += content;
                hasNewContent = true;
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }

        if (hasNewContent) {
          updateMessage(accumulatedContent);
        }
      }
    } catch (error) {
      console.error("Error processing stream:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId
            ? { ...msg, content: "Error: Failed to process response" }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      await refreshExecutions();
    }
  };

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth");
      return;
    }

    // Check if user has credits
    if (userCredits && userCredits.credits <= 0 && !userCredits.isPremium) {
      // Don't allow chat if no credits
      return;
    }

    if (!query.trim() || isLoading) return;

    setShowWelcome(false);

    const currentQuery = query.trim();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: currentQuery,
    };

    setQuery("");
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setTimeout(() => {
        void (async () => {
          try {
            const response = await fetch(`${BACKEND_URL}/ai/chat`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                message: currentQuery,
                model: model,
                conversationId: conversationId,
              }),
              signal: abortControllerRef.current?.signal,
            });

            await processStream(response, currentQuery);
          } catch (error) {
            if ((error as Error).name !== "AbortError") {
              console.error("Error sending message:", error);
            }
            setIsLoading(false);
          }
        })();
      }, 0);
    } catch (error) {
      console.error("Error preparing request:", error);
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (initialConversationId && converstionLoading) {
    return (
      <div className="flex w-full overflow-hidden h-[96dvh]">
        <div className="relative flex h-full w-full flex-col">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0s]"></div>
                <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.2s] [animation-direction:reverse]"></div>
                <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.4s]"></div>
              </div>
              <p className="text-muted-foreground text-sm">
                Loading conversation...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[96dvh] w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col justify-center">
        {showWelcome && messages.length === 0 ? null : (
          <div className="no-scrollbar mt-8 xl:mt-0 flex h-full w-full flex-1 flex-col gap-4 overflow-y-auto pb-20">
            <div className="mx-auto w-full max-w-4xl">
              {messages.map((message) => {
                return (
                  <div
                    key={message.id}
                    className={`group mb-8 flex w-full flex-col ${message.role === "assistant" ? "items-start" : "items-end"} gap-2`}
                  >
                    <div
                      className={cn(
                        "prose cursor-pointer dark:prose-invert max-w-none px-4 py-2 space-y-4",
                        message.role === "user"
                          ? "bg-zinc-200/60 dark:bg-zinc-800 w-full max-w-xl rounded-xl"
                          : "w-full p-0",
                      )}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code(props) {
                            const { children, className, ...rest } = props;
                            const match = /language-(\w+)/.exec(
                              className ?? "",
                            );
                            const isInline = !match;
                            const codeContent = Array.isArray(children)
                              ? children.join("")
                              : typeof children === "string"
                                ? children
                                : "";

                            return isInline ? (
                              <code
                                className={cn(
                                  "bg-orange-400/10 text-orange-400 dark:text-orange-100 dark:bg-orange-200/10 rounded-lg px-1.5 py-0.5 text-sm",
                                  geistMono.className,
                                )}
                                {...rest}
                              >
                                {children}
                              </code>
                            ) : (
                              <div
                                className={`${geistMono.className} overflow-hidden rounded-2xl`}
                              >
                                <div className="bg-zinc-400/10 flex items-center justify-between px-4 py-2 text-sm">
                                  <p className="text-xs">
                                    {match ? match[1] : "text"}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={toggleWrap}
                                      className={`hover:bg-muted/40 flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-all duration-200`}
                                      aria-label="Toggle line wrapping"
                                    >
                                      {isWrapped ? (
                                        <>
                                          <ArrowsLeftRightIcon
                                            weight="bold"
                                            className="h-3 w-3"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <WrapText className="h-3 w-3" />
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleCopy(codeContent)}
                                      className={`hover:bg-muted/40 sticky top-10 flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-all duration-200`}
                                      aria-label="Copy code"
                                    >
                                      {copied ? (
                                        <>
                                          <CheckCircleIcon
                                            weight="bold"
                                            className="size-4"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <CopyIcon className="size-4" />
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                                <SyntaxHighlighter
                                  language={match ? match[1] : "text"}
                                  style={atomOneDark}
                                  customStyle={{
                                    margin: 0,
                                    padding: "1.5rem",
                                    backgroundColor:
                                      resolvedTheme === "dark"
                                        ? "#262626"
                                        : "#f5f5f5",
                                    color:
                                      resolvedTheme === "dark"
                                        ? "#e5e5e5"
                                        : "#171717",
                                    borderRadius: 0,
                                    boxShadow: "#fa7319",
                                    fontSize: "0.95rem",
                                    fontFamily: `var(--font-geist-mono), ${geistMono.style.fontFamily}`,
                                  }}
                                  wrapLongLines={isWrapped}
                                  codeTagProps={{
                                    style: {
                                      fontFamily: `var(--font-geist-mono), ${geistMono.style.fontFamily}`,
                                      fontSize: "0.85em",
                                      whiteSpace: isWrapped
                                        ? "pre-wrap"
                                        : "pre",
                                      overflowWrap: isWrapped
                                        ? "break-word"
                                        : "normal",
                                      wordBreak: isWrapped
                                        ? "break-word"
                                        : "keep-all",
                                    },
                                  }}
                                  PreTag="div"
                                >
                                  {codeContent}
                                </SyntaxHighlighter>
                              </div>
                            );
                          },
                          strong: (props) => (
                            <span className="font-bold">{props.children}</span>
                          ),
                          a: (props) => (
                            <a
                              className="hover:underline hover:underline-offset-3 text-orange-400 dark:text-orange-200 tracking-wide"
                              target="_blank"
                              href={props.href}
                            >
                              {props.children}
                            </a>
                          ),
                          h1: (props) => (
                            <h1 className="my-4 text-2xl font-bold">
                              {props.children}
                            </h1>
                          ),
                          h2: (props) => (
                            <h2 className="my-3 text-xl font-bold">
                              {props.children}
                            </h2>
                          ),
                          h3: (props) => (
                            <h3 className="my-2 text-lg font-bold">
                              {props.children}
                            </h3>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <div className="font-medium">
                      {message.role === "user" && (
                        <button
                          onClick={() => handleCopy(message.content)}
                          className="hover:bg-accent flex size-7 items-center justify-center rounded-lg"
                        >
                          {!copied ? (
                            <CopyIcon weight="bold" />
                          ) : (
                            <CheckIcon weight="bold" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex h-5 items-start justify-start space-x-2">
                  <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0s]"></div>
                  <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.2s] [animation-direction:reverse]"></div>
                  <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.4s]"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {showWelcome && messages.length === 0 && (
          <h1 className="text-4xl font-serif mb-8 text-center">
            What's on your mind today?
          </h1>
        )}

        {/* Show upgrade prompt when user has no credits */}
        {userCredits && userCredits.credits <= 0 && !userCredits.isPremium && (
          <div className="w-full px-4">
            <UpgradeCTA variant="banner" />
          </div>
        )}

        <div className="bg-zinc-400/10 w-full mb-4 border rounded-2xl border-black/10 dark:border-zinc-400/8">
          <div className="w-full max-w-4xl mx-auto">
            <form
              onSubmit={handleCreateChat}
              className="flex flex-col p-3 rounded-lg bg-traansparent inset-shadow-sm"
            >
              <Textarea
                ref={textareaRef}
                autoFocus
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleCreateChat(e);
                  }
                }}
                placeholder={
                  userCredits &&
                  userCredits.credits <= 0 &&
                  !userCredits.isPremium
                    ? "You need credits to start a chat. Please upgrade to continue."
                    : "Ask anything..."
                }
                className="min-h-16 max-h-80 tracking-wider leading-5 resize-none rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent placeholder:tracking-wider"
                disabled={
                  isLoading ||
                  !!(
                    userCredits &&
                    userCredits.credits <= 0 &&
                    !userCredits.isPremium
                  )
                }
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ModelSelector
                    value={model}
                    onValueChange={setModel}
                    disabled={
                      isLoading ||
                      !!(
                        userCredits &&
                        userCredits.credits <= 0 &&
                        !userCredits.isPremium
                      )
                    }
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="text-xs text-white bg-[#fa7319] hover:bg-[#fa7319]/90 p-4 rounded-xl inset-shadow-sm inset-shadow-white/60 font-medium border border-black/4 outline-0"
                  disabled={
                    isLoading ||
                    !query.trim() ||
                    !!(
                      userCredits &&
                      userCredits.credits <= 0 &&
                      !userCredits.isPremium
                    )
                  }
                >
                  {isLoading ? (
                    <SpinnerGapIcon className="animate-spin" />
                  ) : (
                    <ArrowUpIcon className="size-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        {showWelcome && messages.length === 0 && (
          <div className="flex items-center justify-center">
            <TabsSuggestion
              suggestedInput={query}
              setSuggestedInput={setQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UIInput;
