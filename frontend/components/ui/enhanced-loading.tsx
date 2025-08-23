"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RobotIcon } from "@phosphor-icons/react";

interface EnhancedLoadingProps {
  variant?: "dots" | "pulse" | "wave" | "typing";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function EnhancedLoading({
  variant = "dots",
  size = "md",
  className,
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const dotSizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <div
          className={cn(
            "bg-primary rounded-full animate-pulse",
            dotSizeClasses[size]
          )}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={cn(
            "bg-primary rounded-full animate-pulse",
            dotSizeClasses[size]
          )}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={cn(
            "bg-primary rounded-full animate-pulse",
            dotSizeClasses[size]
          )}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          className={cn(
            "bg-gradient-to-r from-primary to-primary/60 rounded-full animate-pulse",
            sizeClasses[size]
          )}
        />
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-primary rounded-full animate-bounce",
              dotSizeClasses[size]
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "typing") {
    return (
      <div
        className={cn(
          "flex items-center gap-1 p-3 bg-muted/50 rounded-2xl",
          className
        )}
      >
        <div className="flex items-center gap-1">
          <div
            className={cn(
              "bg-muted-foreground/60 rounded-full animate-bounce",
              dotSizeClasses[size]
            )}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={cn(
              "bg-muted-foreground/60 rounded-full animate-bounce",
              dotSizeClasses[size]
            )}
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className={cn(
              "bg-muted-foreground/60 rounded-full animate-bounce",
              dotSizeClasses[size]
            )}
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <span className="text-xs text-muted-foreground ml-2">
          AI is thinking...
        </span>
      </div>
    );
  }

  return null;
}

// Special typing indicator for chat messages
export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-start space-x-2 p-4", className)}>
      <div className="flex items-center space-x-2">
        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <RobotIcon className="h-4 w-4" weight="bold" />
        </div>

        {/* Shimmer message bubble */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
          <div className="relative rounded-2xl bg-muted/50 px-4 py-3 max-w-[85%]">
            {/* Shimmer placeholder lines */}
            <div className="space-y-2">
              <div
                className="h-3 bg-muted-foreground/20 rounded shimmer"
                style={{ width: "80%" }}
              />
              <div
                className="h-3 bg-muted-foreground/20 rounded shimmer"
                style={{ width: "60%" }}
              />
              <div
                className="h-3 bg-muted-foreground/20 rounded shimmer"
                style={{ width: "40%" }}
              />
            </div>
            {/* Bouncing dots */}
            <div className="flex space-x-1 mt-2">
              <div
                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced spinner for buttons
export function EnhancedSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
