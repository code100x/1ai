"use client";
import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, SpinnerGapIcon, CopyIcon, CheckIcon } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useExecutionContext } from "@/contexts/execution-context";
import { useCredits } from "@/hooks/useCredits";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

interface AppPageProps {
  params: Promise<{ id: string }>;
}

export default function AppPage({ params }: AppPageProps) {
  const [appId, setAppId] = React.useState<string>("");
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { resolvedTheme } = useTheme();
  const { refreshExecutions } = useExecutionContext();
  const { refetchCredits } = useCredits();

  React.useEffect(() => {
    params.then(({ id }) => setAppId(id));
  }, [params]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const processStream = async (response: Response) => {
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from API:", response.statusText, errorText);
      setError(`Error ${response.status}: ${response.statusText}`);
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

      setResponse(""); // Clear previous response
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = new TextDecoder().decode(value);
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const data = line.substring(6);

            if (data === "[DONE]") {
              continue;
            }

            try {
              // The backend sends raw text chunks directly, but we need to handle potential JSON error responses
              if (data.startsWith("{") && data.endsWith("}")) {
                try {
                  const parsedData = JSON.parse(data);
                  if (parsedData.error) {
                    const errorMessage = parsedData.error.includes("Insufficient credits") 
                      ? "❌ Insufficient Credits\n\nYou need 2 credits to use YouTube Summarizer. Please upgrade to premium or purchase more credits to continue."
                      : `Error: ${parsedData.error}`;
                    setResponse(prev => prev + errorMessage + "\n");
                    continue;
                  }
                } catch {
                  // If parsing fails, treat as plain text
                }
              }
              
              // For normal streaming, the data is raw text content
              if (data && data !== "[DONE]") {
                setResponse(prev => prev + data);
              }
            } catch (e) {
              console.error("Error processing data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing stream:", error);
      setResponse("Error: Failed to process response");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      
      // Refresh credits after successful processing
      await refetchCredits();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // For YouTube summarizer, create execution first and redirect
    if (appId === "youtube-summarizer") {
      try {
        setIsLoading(true);
        setResponse("");
        setError(null);

        const createResponse = await fetch(`${BACKEND_URL}/apps/youtube-summarizer/create-execution`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ youtubeUrl: input }),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error("Error creating execution:", createResponse.statusText, errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error && errorData.error.includes("Insufficient credits")) {
              setError("Insufficient Credits\n\nYou need 2 credits to use YouTube Summarizer. Please upgrade to premium or purchase more credits to continue.");
            } else {
              setError(`Error: ${errorData.error || createResponse.statusText}`);
            }
          } catch {
            setError(`Error ${createResponse.status}: ${createResponse.statusText}`);
          }
          
          setIsLoading(false);
          return;
        }

        const { executionId } = await createResponse.json();

        // Refresh sidebar history to show the new execution immediately
        await refreshExecutions();

        window.location.href = `/apps/youtube-summarizer/${executionId}`;
        return;
      } catch (error) {
        console.error("Error creating execution:", error);
        setError("Error: Failed to create execution");
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setResponse("");
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${BACKEND_URL}/apps/${appId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(
          appId === "article-summarizer" 
            ? { article: input }
            : { }
        ),
        signal: abortControllerRef.current?.signal,
      });

      await processStream(response);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sending request:", error);
        setResponse("Error: Failed to send request");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-6 p-6 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-4xl min-h-0 flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-2">
          {appId ? appId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "App"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {appId === "article-summarizer" 
            ? "Enter article text to get a summary"
            : appId === "youtube-summarizer"
            ? "Enter YouTube URL to get a summary (works best with videos that have captions enabled)"
            : `Use the ${appId} app`
          }
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="bg-muted/20 backdrop-blur-3xl border border-border/50 rounded-2xl p-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSubmit(e);
                }
              }}
              placeholder={
                appId === "article-summarizer" 
                  ? "Paste article text here..."
                  : appId === "youtube-summarizer"
                  ? "Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)!"
                  : "Enter your input..."
              }
              className="min-h-[100px] resize-none border-none bg-transparent shadow-none ring-0 focus-visible:ring-0"
              disabled={isLoading}
            />
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <SpinnerGapIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUpIcon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Processing..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>

        {(response || isLoading || error) && (
          <div className="mt-6 w-full flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Response:</h2>
              {response && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(response)}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
            
            <div className="bg-muted/10 border border-border/50 rounded-lg p-6 min-h-[200px] flex-1 overflow-y-auto w-full no-scrollbar">
              {error && (
                <div className="flex items-center space-x-2 text-destructive">
                  <div className="h-2 w-2 rounded-full bg-destructive"></div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}
              
              {isLoading && !response && !error && (
                <div className="flex items-center space-x-2">
                  <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0s]"></div>
                  <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.2s] [animation-direction:reverse]"></div>
                  <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.4s]"></div>
                  <span className="text-muted-foreground text-sm ml-2">Processing...</span>
                </div>
              )}
              
              {response && (
                <div className="prose dark:prose-invert max-w-none break-words overflow-wrap-anywhere">
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
                    {response}
                  </ReactMarkdown>
                </div>
              )}
              
              {isLoading && response && (
                <div className="mt-4 flex items-center space-x-2">
                  <div className="bg-accent h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0s]"></div>
                  <div className="bg-accent h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.2s] [animation-direction:reverse]"></div>
                  <div className="bg-accent h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}