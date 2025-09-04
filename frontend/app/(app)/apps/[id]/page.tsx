"use client";
import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SpinnerGapIcon, CopyIcon, CheckIcon } from "@phosphor-icons/react";
import { ArrowUpIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

const articleFeatures: {
  id: number;
  title: string;
}[] = [
  {
    id: 1,
    title: "Summarize articles instantly",
  },
  {
    id: 2,
    title: "Turn long reads into key insights",
  },
  {
    id: 3,
    title: "Get clear, concise summaries",
  },
];

interface AppPageProps {
  params: Promise<{ id: string }>;
}

export default function AppPage({ params }: AppPageProps) {
  const [appId, setAppId] = React.useState<string>("");
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { resolvedTheme } = useTheme();
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();

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
                    setResponse(
                      (prev) => prev + `Error: ${parsedData.error}\n`,
                    );
                    continue;
                  }
                } catch {
                  // If parsing fails, treat as plain text
                }
              }

              // For normal streaming, the data is raw text content
              if (data && data !== "[DONE]") {
                setResponse((prev) => prev + data);
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth");
      return;
    }

    if (!input.trim() || isLoading) return;

    setShowWelcome(false);
    setIsLoading(true);
    setResponse("");
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log(input);
      console.log(appId);
      console.log(BACKEND_URL);
      console.log(`${BACKEND_URL}/apps/${appId}`);
      const currentArticleInput = input.trim();
      setInput("");
      const response = await fetch(`${BACKEND_URL}/apps/${appId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          article: currentArticleInput,
        }),
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
    <div className="flex h-[96dvh] w-full flex-col items-center justify-start gap-6">
      <div className="relative flex space-y-6 flex-col items-center justify-end h-full w-full">
        {(response || isLoading || error) && (
          <div className="no-scrollbar xl:mt-0 flex h-full w-full flex-1 flex-col gap-4 overflow-y-auto pb-20">
            <div className="mx-auto w-full max-w-4xl">
              <div className="mt-6 w-full">
                <div>
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
                      <span className="text-muted-foreground text-sm ml-2">
                        Processing...
                      </span>
                    </div>
                  )}

                  {response && (
                    <div className="prose dark:prose-invert max-w-none space-y-4 overflow-auto prose-th:border-b prose-td:border-b prose-th:border-zinc-700/30 prose-td:border-zinc-700/30 prose-hr:border-zinc-700/30">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code(props) {
                            const { children, className, ...rest } = props;
                            const match = /language-(\w+)/.exec(
                              className ?? "",
                            );
                            const isInline = !match;

                            return isInline ? (
                              <code
                                className={cn(
                                  "bg-orange-400/10 text-orange-400 dark:text-orange-100 dark:bg-orange-200/10 rounded-xl px-1.5 py-0.5 text-sm",
                                )}
                                {...rest}
                              >
                                {children}
                              </code>
                            ) : (
                              <div className="overflow-hidden rounded-3xl outline-4 outline-offset-2 outline-solid outline-zinc-200/50 dark:outline-zinc-800/50">
                                <div className="bg-zinc-400/10 flex items-center justify-between px-4 text-sm">
                                  <p className="text-xs">
                                    {match ? match[1] : "text"}
                                  </p>
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
                                  }}
                                  PreTag="div"
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              </div>
                            );
                          },
                          h1: (props) => <h2 className="">{props.children}</h2>,
                          h2: (props) => <h3 className="">{props.children}</h3>,
                          strong: (props) => (
                            <span className="font-bold">{props.children}</span>
                          ),
                          pre: (props) => (
                            <pre className="!bg-transparent !p-0 !m-0 !border-none !rounded-none !text-inherit !overflow-visible">
                              {props.children}
                            </pre>
                          ),
                          a: (props) => (
                            <a
                              className="!underline-none hover:underline hover:underline-offset-3 text-orange-400 dark:text-orange-200 tracking-wide"
                              target="_blank"
                              href={props.href}
                            >
                              {props.children}
                            </a>
                          ),
                        }}
                      >
                        {response}
                      </ReactMarkdown>

                      <div className="flex items-center justify-start">
                        {response && (
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleCopy(response)}
                            className="flex items-center gap-2"
                          >
                            {copied ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <CopyIcon className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
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
            </div>
          </div>
        )}

        {!response && showWelcome && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-serif mb-2">
              {appId
                ? appId
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : "App"}
            </h1>

            <p className="text-muted-foreground mb-6">
              {appId === "article-summarizer"
                ? "Enter article text to get a summary"
                : `Use the ${appId} app`}
            </p>

            <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
              {articleFeatures.map((item, index) => (
                <div
                  key={item.title}
                  className={cn(
                    `group inline-block realtive w-50 h-30 p-4 text-sm leading-5 rounded-3xl font-semibold drop-shadow-md drop-shadow-zinc-400 dark:drop-shadow-white/50 overflow-hidden`,
                    {
                      "bg-linear-to-r/oklab from-[#A294F9] via-[#CDC1FF] to-[#F5EFFF] text-purple-900/40":
                        index === 0,
                      "bg-linear-to-r/oklab from-[#FAF7F3] via-[#F0E4D3] to-[#DCC5B2] text-amber-900/40":
                        index === 1,
                      "bg-linear-to-r/oklab from-[#FFEDFA] via-[#FFB8E0] to-[#EC7FA9] text-pink-900/40":
                        index === 2,
                    },
                  )}
                >
                  {item.title}
                  <div className="absolute right-0 -bottom-4">
                    <div
                      className={cn(
                        "absolute h-18 rounded-2xl w-18 transform transition-transform duration-500 ease-in-out",
                        {
                          "bg-purple-300 -z-30 -rotate-10 right-14 group-hover:scale-125 group-hover:-rotate-20":
                            index === 0,
                          "bg-amber-100 -z-30 -rotate-10 right-8 -bottom-2.5 group-hover:scale-125":
                            index === 1,
                          "bg-pink-300 z-30 -rotate-8 right-10 group-hover:scale-125":
                            index === 2,
                        },
                      )}
                    />

                    <div
                      className={cn(
                        "h-18 rounded-2xl w-18 transform transition-transform duration-500 ease-in-out",
                        {
                          "bg-purple-200 z-40 rotate-10 group-hover:scale-105 group-hover:rotate-20 ":
                            index === 0,
                          "bg-amber-200 z-40 rotate-20 group-hover:scale-130":
                            index === 1,
                          "bg-pink-400 -z-40 rotate-45 group-hover:scale-120":
                            index === 2,
                        },
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800/10 w-full mb-4 rounded-3xl border border-black/10 dark:border-zinc-400/10">
          <div className="w-full max-w-4xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col p-3 rounded-3xl bg-traansparent inset-shadow-sm  
						shadow-inner 
						[box-shadow:inset_0_0_40px_15px_rgba(128,128,128,0.10)]
						focus:outline-none
						"
            >
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
                    : "Enter your input..."
                }
                className="min-h-12 max-h-80 tracking-wider leading-5 resize-none rounded-none border-none bg-transparent px-2 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent placeholder:tracking-wider"
                disabled={isLoading}
              />
              <div className="mt-2 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="text-xs text-white bg-gray-100/80 hover:bg-gray-300/90 p-4 rounded-full font-extrabold border border-black/4 outline-0"
                >
                  {isLoading ? (
                    <SpinnerGapIcon className="h-4 w-4 animate-spin text-black" />
                  ) : (
                    <ArrowUpIcon className="size-4 text-neutral-600" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
