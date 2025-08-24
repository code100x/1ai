"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

interface ArticleSummarizerData {
  id: string;
  article: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticleSummarizerPageProps {
  convoId: string;
}

export default function ArticleSummarizerPage({ convoId }: ArticleSummarizerPageProps) {
  const [data, setData] = useState<ArticleSummarizerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found. Please login again.");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/apps/article-summarizer/${convoId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error from API:", response.statusText, errorText);
          setError(`Error ${response.status}: ${response.statusText}`);
          return;
        }

        const result = await response.json();
        if (result.error) {
          setError(result.error);
          return;
        }

        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error: Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    if (convoId) {
      fetchData();
    }
  }, [convoId]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-6 p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-2">
          Article Summarizer
        </h1>
        <p className="text-muted-foreground mb-6">
          Viewing saved article summary
        </p>

        {/* Article Section */}
        {data && (
          <div className="w-full space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Original Article:</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(data.article)}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy Article"}
                </Button>
              </div>
              
              <div className="bg-muted/10 border border-border/50 rounded-lg p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{data.article}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Summary:</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(data.summary)}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy Summary"}
                </Button>
              </div>
              
              <div className="bg-muted/10 border border-border/50 rounded-lg p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code(props) {
                        const { children, className, ...rest } = props;
                        const match = /language-(\w+)/.exec(className ?? "");
                        const isInline = !match;
                        
                        return isInline ? (
                          <code
                            className={cn(
                              "bg-accent rounded-sm px-1 py-0.5 text-sm",
                              className
                            )}
                            {...rest}
                          >
                            {children}
                          </code>
                        ) : (
                          <div className="my-4 overflow-hidden rounded-md">
                            <div className="bg-accent flex items-center justify-between px-4 py-2 text-sm">
                              <div>{match ? match[1] : "text"}</div>
                            </div>
                            <SyntaxHighlighter
                              language={match ? match[1] : "text"}
                              style={atomOneDark}
                              customStyle={{
                                margin: 0,
                                padding: "1rem",
                                backgroundColor:
                                  resolvedTheme === "dark" ? "#1a1620" : "#f5ecf9",
                                color:
                                  resolvedTheme === "dark" ? "#e5e5e5" : "#171717",
                                borderRadius: 0,
                                borderBottomLeftRadius: "0.375rem",
                                borderBottomRightRadius: "0.375rem",
                              }}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          </div>
                        );
                      },
                      strong: (props) => (
                        <span className="font-bold">{props.children}</span>
                      ),
                      a: (props) => (
                        <a
                          className="text-primary underline hover:no-underline"
                          href={props.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {props.children}
                        </a>
                      ),
                    }}
                  >
                    {data.summary}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="w-full flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0s]"></div>
              <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.2s] [animation-direction:reverse]"></div>
              <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.4s]"></div>
              <span className="text-muted-foreground text-sm ml-2">Loading...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full">
            <div className="bg-muted/10 border border-destructive/20 rounded-lg p-6">
              <div className="flex items-center space-x-2 text-destructive">
                <div className="h-2 w-2 rounded-full bg-destructive"></div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
