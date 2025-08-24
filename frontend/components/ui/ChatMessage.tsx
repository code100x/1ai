"use client";
import {
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  CheckIcon,
  CheckCircleIcon,
  ArrowsLeftRightIcon,
} from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { WrapText } from "lucide-react";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Geist_Mono } from "next/font/google";
import React from "react";

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

interface ChatMessageProps {
  message: Message;
  handleCopy: (text: string, id: string) => void;
  copied: string | null;
  isWrapped: boolean;
  toggleWrap: () => void;
  resolvedTheme: string | undefined;
}


const ChatMessage = ({
    message,
    handleCopy,
    copied,
    isWrapped,
    toggleWrap,
    resolvedTheme,
}:ChatMessageProps) => {
  return (
                    <div
                      className={`group mb-8 flex w-full flex-col ${message.role === "assistant" ? "items-start" : "items-end"} gap-2`}
                    >
                      <div
                        className={cn(
                          "prose cursor-pointer dark:prose-invert max-w-none rounded-lg px-4 py-2",
                          message.role === "user"
                            ? "bg-accent/10 w-fit max-w-full font-medium"
                            : "w-full p-0"
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code(props) {
                              const { children, className, ...rest } = props;
                              const match = /language-(\w+)/.exec(className ?? "");
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
                                        onClick={() => handleCopy(codeContent, message.id)}
                                        className={`hover:bg-muted/40 sticky top-10 flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-all duration-200`}
                                        aria-label="Copy code"
                                      >
                                       {copied === message.id ? (
                                        <CheckCircleIcon weight="bold" className="size-4" />
                                        ) : (
                                        <CopyIcon className="size-4" />
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
                                        whiteSpace: isWrapped ? "pre-wrap" : "pre",
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
                              onClick={() => handleCopy(message.content, message.id)}
                              className="hover:bg-accent flex size-7 items-center justify-center rounded-lg"
                            >
                                {copied === message.id ? (
                                <CheckIcon weight="bold" />
                                ) : (
                                <CopyIcon weight="bold" />
                                )}
                            </button>
                          </div>
                        )}
                        {message.role === "user" && (
                          <button
                            onClick={() => handleCopy(message.content, message.id)}
                            className="hover:bg-accent flex size-7 items-center justify-center rounded-lg"
                          >
                            {copied === message.id ? (
                            <CheckIcon weight="bold" />
                            ) : (
                            <CopyIcon weight="bold" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
  )
}

export default React.memo(ChatMessage);
