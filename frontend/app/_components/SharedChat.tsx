"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  SpeakerHighIcon,
  SpeakerXIcon,
  CheckIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "react-speech-kit";
import { useTheme } from "next-themes";
import { Loader2Icon, WrapText } from "lucide-react";
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


const SharedChat = ({ chatId: initialChatId }: { chatId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [chatId, setChatId] = useState<string>(initialChatId);

  const {data: chatMessages} = api.chat.getChatById.useQuery({
    chatId: chatId,
  });

  useEffect(() => {
    setChatId(initialChatId);
  }, [initialChatId]);

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages.messages.map((message) => ({
        id: message.id,
        role: message.role === "USER" ? "user" : "assistant",
        content: message.content,
      })));
    }
  }, [chatMessages]);



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
    if (ttsSupported && voices.length > 0) {
      const defaultVoice = voices.find((v) => v.default) || voices[0];
      setSelectedVoice(defaultVoice!);
    }
  }, [voices, ttsSupported]);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);




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
                                    "bg-accent rounded-sm px-1 py-0.5 text-sm",
                                    geistMono.className,
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
                                        className={`hover:bg-muted/40 flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-all duration-200`}
                                        aria-label="Toggle line wrapping"
                                      >
                                        <WrapText className="h-3 w-3" />
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
                                    codeTagProps={{
                                      style: {
                                        fontFamily: `var(--font-geist-mono), ${geistMono.style.fontFamily}`,
                                        fontSize: "0.85em",
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "break-word",
                                        wordBreak: "break-word",
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
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedChat;
