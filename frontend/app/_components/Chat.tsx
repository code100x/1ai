"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  MicrophoneIcon,
  SpinnerGapIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  SpeakerHighIcon,
  SpeakerXIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowsLeftRightIcon,
  ArrowUpIcon,
} from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ModelSelector } from "@/components/ui/model-selector";
import { DEFAULT_MODEL_ID } from "@/models/constants";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Globe, Loader2Icon, Paperclip, WrapText } from "lucide-react";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { api } from "@/trpc/react";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: true,
  display: "swap",
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Chat = ({ chatId: initialChatId }: { chatId: string }) => {
  const [model, setModel] = useState<string>(DEFAULT_MODEL_ID);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modeOfChatting, setModeOfChatting] = useState<"text" | "voice">(
    "text"
  );
  const [showWelcome, setShowWelcome] = useState(true);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isWrapped, setIsWrapped] = useState(false);
  const { resolvedTheme } = useTheme();
  const [query, setQuery] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [chatId, setChatId] = useState<string>(initialChatId);

  const { data: chatMessages } = api.chat.getChatMessages.useQuery({
    chatId: chatId,
  });

  useEffect(() => {
    setChatId(initialChatId);
  }, [initialChatId]);

  useEffect(() => {
    if (chatMessages) {
      setMessages(
        chatMessages.messages.map(
          (message: { id: string; role: string; content: string }) => ({
            id: message.id,
            role: message.role === "USER" ? "user" : "assistant",
            content: message.content,
          })
        )
      );
    }
  }, [chatMessages]);

  const toggleWrap = useCallback(() => {
    setIsWrapped((prev) => !prev);
  }, []);

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const {
    speak,
    cancel,
    speaking,
    supported: ttsSupported,
    voices,
  } = useSpeechSynthesis();
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (modeOfChatting === "voice" && !ttsSupported) {
      toast.error("Text-to-speech not supported in your browser");
      setModeOfChatting("text");
    }
  }, [modeOfChatting, ttsSupported]);

  useEffect(() => {
    if (ttsSupported && voices.length > 0) {
      const defaultVoice = voices.find((v) => v.default) || voices[0];
      setSelectedVoice(defaultVoice!);
    }
  }, [voices, ttsSupported]);

  useEffect(() => {
    if (listening) {
      setQuery(transcript);
    }
  }, [listening, transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processStream = async (response: Response, userMessage: string) => {
    if (!response.ok) {
      console.error("Error from API:", response.statusText);
      setIsLoading(false);
      return;
    }

    try {
      const reader = response.body?.getReader();
      if (!reader) {
        console.error("No reader available");
        setIsLoading(false);
        return;
      }

      const tempMessageId = `ai-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: tempMessageId, role: "assistant", content: "" },
      ]);

      let accumulatedContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // console.log("Stream complete");
          break;
        }

        const chunk = new TextDecoder().decode(value);
        // console.log("Received chunk:", chunk);

        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const data = line.substring(6);

            if (data === "[DONE]") {
              console.log("Stream ended with [DONE]");
              continue;
            }

            try {
              // console.log("Parsing JSON:", data);
              const parsedData = JSON.parse(data) as {
                choices?: Array<{
                  delta?: {
                    content?: string;
                  };
                }>;
              };

              const content = parsedData.choices?.[0]?.delta?.content;
              if (content) {
                // console.log("Received content:", content);
                accumulatedContent += content;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing JSON:", e, line);
            }
          }
        }
      }

      // console.log("Saving chat to database:", userMessage, accumulatedContent);
    } catch (error) {
      console.error("Error processing stream:", error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
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
            const response = await fetch("/api/ask", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: [{ role: "user", content: currentQuery }],
                model: model,
                chatId: chatId,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = input.trim();

    setInput("");

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: currentMessage }],
          model: model,
          chatId: chatId,
        }),
        signal: abortControllerRef.current.signal,
      });

      await processStream(response, currentMessage);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sending message:", error);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const query = localStorage.getItem("chatQuery");
    if (query) {
      setInput(query);
      localStorage.removeItem("chatQuery");
    }
  }, []);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="h-[96vh] w-full">
      <div className="relative flex h-full w-full flex-col">
        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-4 pb-40 md:px-4">
          <div className="mx-auto w-full max-w-4xl py-4">
            {messages.length === 0 ? (
              <div className="text-muted-foreground flex h-[50vh] items-center justify-center">
                <Loader2Icon className="animate-spin" />
              </div>
            ) : (
              <div className="no-scrollbar mt-6 flex h-full w-full flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4 pb-10 md:px-8">
                <div className="mx-auto h-full w-full max-w-4xl">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`group mb-8 flex w-full flex-col ${message.role === "assistant" ? "items-start" : "items-end"} gap-2`}
                    >
                      <div
                        className={cn(
                          "prose dark:prose-invert max-w-none rounded-lg px-4 py-2",
                          message.role === "user"
                            ? "bg-accent/40 w-fit max-w-full font-medium"
                            : "w-full p-0"
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code(props) {
                              const { children, className, ...rest } = props;
                              const match = /language-(\w+)/.exec(
                                className ?? ""
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
                                    "bg-accent rounded-sm px-1 py-0.5 text-sm",
                                    geistMono.className
                                  )}
                                  {...rest}
                                >
                                  {children}
                                </code>
                              ) : (
                                <div
                                  className={`${geistMono.className} my-4 overflow-hidden rounded-md`}
                                >
                                  <div className="bg-accent flex items-center justify-between px-4 py-2 text-sm">
                                    <div>{match ? match[1] : "text"}</div>
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
                                      padding: "1rem",
                                      backgroundColor:
                                        resolvedTheme === "dark"
                                          ? "#1a1620"
                                          : "#f5ecf9",
                                      color:
                                        resolvedTheme === "dark"
                                          ? "#e5e5e5"
                                          : "#171717",
                                      borderRadius: 0,
                                      borderBottomLeftRadius: "0.375rem",
                                      borderBottomRightRadius: "0.375rem",
                                      fontSize: "1.2rem",
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
                              <span className="font-bold">
                                {props.children}
                              </span>
                            ),
                            a: (props) => (
                              <a
                                className="text-primary underline"
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
                        {message.role === "assistant" && (
                          <div className="invisible flex w-fit items-center gap-2 text-base font-semibold group-hover:visible">
                            <button className="hover:bg-accent flex size-7 items-center justify-center rounded-lg">
                              <ThumbsUpIcon weight="bold" />
                            </button>
                            <button className="hover:bg-accent flex size-7 items-center justify-center rounded-lg">
                              <ThumbsDownIcon weight="bold" />
                            </button>
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
                            {modeOfChatting === "voice" && (
                              <button
                                className="hover:bg-accent flex size-7 items-center justify-center rounded-lg"
                                onClick={() => {
                                  if (speaking) {
                                    cancel();
                                  } else if (ttsSupported && selectedVoice) {
                                    speak({
                                      text: message.content,
                                      voice: selectedVoice,
                                    });
                                  }
                                }}
                              >
                                {speaking ? (
                                  <SpeakerXIcon weight="bold" />
                                ) : (
                                  <SpeakerHighIcon weight="bold" />
                                )}
                              </button>
                            )}
                          </div>
                        )}
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
                  ))}
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
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-muted border-border/20 absolute bottom-4 w-full rounded-3xl border-t">
          <div className="mx-auto w-full max-w-4xl">
            <form
              onSubmit={handleSubmit}
              className="bg-accent/30 flex w-full flex-col rounded-3xl p-3 pb-3"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleCreateChat(e);
                  }
                }}
                placeholder="Ask whatever you want to be"
                className="h-[2rem] resize-none rounded-none border-none bg-transparent px-3 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
                disabled={isLoading}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ModelSelector
                    value={model}
                    onValueChange={setModel}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
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
      </div>
    </div>
  );
};

export default Chat;
