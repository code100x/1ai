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
import { useCredits } from "@/hooks/useCredits";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

interface YouTubeSummarizerData {
  id: string;
  youtubeUrl: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

interface YouTubeSummarizerPageProps {
  convoId: string;
}

export default function YouTubeSummarizerPage({ convoId }: YouTubeSummarizerPageProps) {
  const [data, setData] = useState<YouTubeSummarizerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string>("");
  const { refetchCredits } = useCredits();

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const extractVideoId = (url: string): string | null => {
    console.log("🔍 Extracting video ID from URL:", url);
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/
    ];
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const match = url.match(pattern);
      if (match) {
        console.log(`Video ID extracted with pattern ${i + 1}:`, match[1]);
        return match[1];
      }
    }
    
    console.log(" No video ID found in URL");
    return null;
  };

  const getEmbedUrl = (url: string): string => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const startProcessing = React.useCallback(async () => {
    if (!data?.youtubeUrl || isProcessing) return;

    setIsProcessing(true);
    setStreamingResponse("");
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/apps/youtube-summarizer/${convoId}/process`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(" Error from API:", response.statusText, errorText);
        setError(`Error ${response.status}: ${response.statusText}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        console.error("No reader available");
        return;
      }

      let buffer = "";
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.trim() === "") continue;
          if (line.startsWith("data: ")) {
            const data = line.substring(6);
            if (data === "[DONE]") continue;

            try {
              if (data.startsWith("{") && data.endsWith("}")) {
                try {
                  const parsedData = JSON.parse(data);
                  if (parsedData.error) {
                    const errorMessage = parsedData.error.includes("Insufficient credits") 
                      ? "❌ Insufficient Credits\n\nYou need 2 credits to use YouTube Summarizer. Please upgrade to premium or purchase more credits to continue."
                      : `Error: ${parsedData.error}`;
                    setStreamingResponse(prev => prev + errorMessage + "\n");
                    continue;
                  }
                } catch {}
              }
              if (data && data !== "[DONE]") {
                setStreamingResponse(prev => prev + data);
                fullResponse += data;
              }
            } catch (e) {
              console.error("Error processing data:", e);
            }
          }
        }
      }

      setData(prev => prev ? { ...prev, summary: fullResponse } : null);
      
      // Refresh credits after successful processing
      await refetchCredits();
    } catch (error) {
      console.error("❌ Error during processing:", error);
      setError("Error: Failed to process YouTube summary");
    } finally {
      setIsProcessing(false);
    }
  }, [convoId, data?.youtubeUrl, isProcessing, refetchCredits]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("YouTube Summarizer Page - Loading data...");
        console.log("Conversation ID:", convoId);
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          setError("Authentication token not found. Please login again.");
          return;
        }

        console.log("🔗 Fetching from:", `${BACKEND_URL}/apps/youtube-summarizer/${convoId}`);
        const response = await fetch(`${BACKEND_URL}/apps/youtube-summarizer/${convoId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          
          // Parse error response to show user-friendly message
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error && errorData.error.includes("Insufficient credits")) {
              setError("Insufficient Credits\n\nYou need 2 credits to use YouTube Summarizer. Please upgrade to premium or purchase more credits to continue.");
            } else {
              setError(`Error: ${errorData.error || response.statusText}`);
            }
          } catch {
            setError(`Error ${response.status}: ${response.statusText}`);
          }
          
          return;
        }

        const result = await response.json();
        console.log("✅ Data fetched successfully:", result);
        
        if (result.error) {
          console.error("Error in response:", result.error);
          setError(result.error);
          return;
        }

        setData(result);
        console.log("📄 Summary data set:", {
          youtubeUrl: result.youtubeUrl,
          summaryLength: result.summary?.length || 0
        });

        // Auto-start processing if no summary yet
        if (!result.summary || result.summary.trim() === "") {
          setTimeout(() => {
            void startProcessing();
          }, 400);
        }
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
  }, [convoId, startProcessing]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-6 p-4 md:p-6 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-4xl min-w-0 flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-2">
          YouTube Summarizer
        </h1>
        {/* YouTube Video Section */}
        {data && (
          <div className="w-full space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">YouTube Video:</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(data.youtubeUrl)}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
              </div>
              
              <div className="bg-muted/10 border border-border/50 rounded-lg p-4">
                <div className="aspect-video w-full">
                  <iframe
                    src={getEmbedUrl(data.youtubeUrl)}
                    title="YouTube video player"
                    className="w-full h-full rounded-md"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-4">
                  <a 
                    href={data.youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {data.youtubeUrl}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Summary:</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(isProcessing && streamingResponse ? streamingResponse : data.summary)}
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
              
              <div className="bg-muted/10 border border-border/50 rounded-lg p-4 md:p-6 w-full min-w-0 flex-1 overflow-y-auto no-scrollbar">
                <div className="w-full min-w-0">
                  <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none w-full">
                  {/* Show processing indicator when starting or no content yet */}
                  {isProcessing && !streamingResponse && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0s]"></div>
                      <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.2s] [animation-direction:reverse]"></div>
                      <div className="bg-accent h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:0.4s]"></div>
                      <span className="text-muted-foreground text-sm ml-2">Processing YouTube video...</span>
                    </div>
                  )}
                  
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
                              "bg-accent rounded-sm px-1 py-0.5 text-sm font-mono",
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
                    }}
                  >
                    {isProcessing && streamingResponse ? streamingResponse : data.summary}
                  </ReactMarkdown>
                  
                  {/* Show continuation indicator when streaming */}
                  {isProcessing && streamingResponse && (
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="bg-accent h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0s]"></div>
                      <div className="bg-accent h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.2s] [animation-direction:reverse]"></div>
                      <div className="bg-accent h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.4s]"></div>
                    </div>
                  )}
                  </div>
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
