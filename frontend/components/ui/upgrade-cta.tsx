"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Zap, ArrowRight } from "lucide-react";
import { LightningIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useCredits } from "@/hooks/useCredits";

interface UpgradeCTAProps {
  variant?: "banner" | "card" | "minimal" | "topbar";
  className?: string;
}

export const UpgradeCTA: React.FC<UpgradeCTAProps> = ({
  variant = "banner",
  className = "",
}) => {
  const { userCredits, isLoading } = useCredits();
  // Don't show if loading, user is premium, or has sufficient credits
  if (
    isLoading ||
    !userCredits ||
    userCredits.isPremium ||
    userCredits.credits > 3
  ) {
    return null;
  }

  const getBannerContent = () => {
    if (userCredits.credits === 0) {
      return {
        title: "You're out of credits!",
        subtitle: "Upgrade to Pro to continue chatting with unlimited access",
        urgency: "high",
      };
    } else if (userCredits.credits <= 1) {
      return {
        title: `Only ${userCredits.credits} credit${userCredits.credits === 1 ? "" : "s"} left`,
        subtitle: "Upgrade now to avoid interruptions in your workflow",
        urgency: "medium",
      };
    } else {
      return {
        title: "Running low on credits",
        subtitle: "Upgrade to Pro for unlimited AI conversations",
        urgency: "low",
      };
    }
  };

  const content = getBannerContent();

  if (variant === "topbar") {
    return (
      <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
        <div className="flex items-center gap-1 h-8 px-1.5 sm:px-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Zap className="h-3 w-3 text-purple-500" />
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
            {Math.max(0, userCredits.credits)}
          </span>
        </div>
        <Link href="/pricing">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-1.5 sm:px-2 text-xs rounded-lg"
          >
            <span className="hidden sm:inline">Upgrade</span>
            <span className="sm:hidden">Up</span>
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 ${className}`}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">
            {Math.max(0, userCredits.credits)} credit
            {userCredits.credits === 1 ? "" : "s"} remaining
          </span>
        </div>
        <Link href="/pricing">
          <Button size="sm" variant="outline" className="h-8 w-full sm:w-auto">
            Upgrade
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card
        className={`border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 ${className}`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10 flex-shrink-0">
                <Crown className="h-5 w-5 text-purple-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg break-words">
                  {content.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 break-words">
                  {content.subtitle}
                </p>
              </div>
            </div>
            <Link href="/pricing" className="w-full sm:w-auto flex-shrink-0">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto">
                <Crown className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Upgrade to Pro</span>
                <span className="sm:hidden">Upgrade</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default banner variant
  return (
    <Link href="/pricing">
      <div
        className={`relative bg-white/90 hover:bg-white/50 dark:bg-neutral-900 dark:hover:bg-neutral-900/60 rounded-tl-2xl rounded-tr-2xl transition-colors duration-200 p-4 ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {content.urgency === "high" ? (
              <LightningIcon className="size-6 text-foreground" />
            ) : (
              <Crown className="size-6 text-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground break-words font-medium">
                {content.title}
              </h3>
              <p className="text-muted-foreground font-medium text-xs break-words">
                {content.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-green-500 inset-shadow-sm inset-shadow-green-300 rounded-full ring-5 ring-green-200/40 dark:ring-green-200/10" />

            <h1 className="text-sm tracking-wider font-medium">Upgrade now</h1>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UpgradeCTA;
