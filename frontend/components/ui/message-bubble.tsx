"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  CopyIcon, 
  CheckIcon, 
  ThumbsUpIcon, 
  ThumbsDownIcon,
  UserIcon,
  RobotIcon
} from "@phosphor-icons/react";

interface MessageBubbleProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: string;
  onCopy?: () => void;
  copied?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function MessageBubble({
  content,
  role,
  timestamp,
  onCopy,
  copied = false,
  className,
  children
}: MessageBubbleProps) {
  const isUser = role === "user";
  
  return (
    <div className={cn(
      "group relative flex w-full items-start gap-3 p-4 transition-all duration-200 hover:bg-muted/30",
      className
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground"
      )}>
        {isUser ? (
          <UserIcon className="h-4 w-4" weight="bold" />
        ) : (
          <RobotIcon className="h-4 w-4" weight="bold" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        {/* Message Header */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? "You" : "AI Assistant"}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {timestamp}
            </span>
          )}
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200",
          isUser
            ? "bg-primary text-primary-foreground ml-auto max-w-[85%]"
            : "bg-muted/50 text-foreground max-w-[85%]"
        )}>
          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {children || content}
          </div>

          {/* Action Buttons - Only show on hover */}
          <div className={cn(
            "absolute -top-2 -right-2 flex items-center gap-1 opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100"
          )}>
            {!isUser && (
              <>
                <button
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full bg-background/80",
                    "hover:bg-background transition-colors duration-200",
                    "shadow-sm border border-border/50"
                  )}
                  title="Thumbs up this response"
                >
                  <ThumbsUpIcon className="h-3 w-3" weight="bold" />
                </button>
                <button
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full bg-background/80",
                    "hover:bg-background transition-colors duration-200",
                    "shadow-sm border border-border/50"
                  )}
                  title="Thumbs down this response"
                >
                  <ThumbsDownIcon className="h-3 w-3" weight="bold" />
                </button>
              </>
            )}
            <button
              onClick={onCopy}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full bg-background/80",
                "hover:bg-background transition-colors duration-200",
                "shadow-sm border border-border/50"
              )}
              title="Copy message"
            >
              {copied ? (
                <CheckIcon className="h-3 w-3 text-green-500" weight="bold" />
              ) : (
                <CopyIcon className="h-3 w-3" weight="bold" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Special component for code blocks within messages
export function CodeBlock({ 
  content, 
  language = "text",
  className 
}: { 
  content: string; 
  language?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "relative rounded-lg border bg-muted/30 p-4 my-3",
      className
    )}>
      {/* Language badge */}
      <div className="absolute -top-2 left-4 bg-background px-2 py-1 rounded text-xs font-mono text-muted-foreground border">
        {language}
      </div>
      
      {/* Code content */}
      <pre className="mt-2 overflow-x-auto">
        <code className="text-sm font-mono">
          {content}
        </code>
      </pre>
    </div>
  );
}

// Component for inline code
export function InlineCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <code className={cn(
      "rounded bg-muted/50 px-1.5 py-0.5 text-sm font-mono",
      className
    )}>
      {children}
    </code>
  );
}
