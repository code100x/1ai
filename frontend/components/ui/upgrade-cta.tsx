"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCredits } from "@/hooks/useCredits";
import { SpinnerGapIcon } from "@phosphor-icons/react";

interface UpgradeCTAProps {
  variant?: "banner" | "card" | "minimal" | "topbar";
  className?: string;
}

export const UpgradeCTA: React.FC<UpgradeCTAProps> = ({ 
  variant = "banner", 
  className = "" 
}) => {
  const { userCredits, isPending } = useCredits();
  // Don't show if loading, user is premium, or has sufficient credits
  if (isPending || !userCredits || userCredits.isPremium || userCredits.credits > 3) {
    return null;
  }

  const getBannerContent = () => {
    if (userCredits.credits === 0) {
      return {
        title: "You're out of credits!",
        subtitle: "Upgrade to Pro to continue chatting with unlimited access",
        urgency: "high"
      };
    } else if (userCredits.credits <= 1) {
      return {
        title: `Only ${userCredits.credits} credit${userCredits.credits === 1 ? '' : 's'} left`,
        subtitle: "Upgrade now to avoid interruptions in your workflow",
        urgency: "medium"
      };
    } else {
      return {
        title: "Running low on credits",
        subtitle: "Upgrade to Pro for unlimited AI conversations",
        urgency: "low"
      };
    }
  };

  const content = getBannerContent();

  if (variant === "topbar") {
    return (
      <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
        <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
          <Zap className="h-3 w-3 text-purple-500" />
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
            {isPending ? <SpinnerGapIcon className="animate-spin" /> : Math.max(0, userCredits.credits)}
          </span>
        </div>
        <Link href="/pricing">
          <Button size="sm" variant="outline" className="h-7 px-1.5 sm:px-2 text-xs">
            <span className="hidden sm:inline">Upgrade</span>
            <span className="sm:hidden">Up</span>
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 ${className}`}>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">
            {Math.max(0, userCredits.credits)} credit{userCredits.credits === 1 ? '' : 's'} remaining
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
      <Card className={`border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 ${className}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10 flex-shrink-0">
                <Crown className="h-5 w-5 text-purple-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg break-words">{content.title}</h3>
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
      <div className={`relative rounded-xl border bg-muted/40 hover:bg-muted/60 transition-colors duration-200 p-4 sm:p-6 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="from-primary flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr to-pink-500 drop-shadow-md flex-shrink-0">
              {content.urgency === 'high' ? (
                <Zap className="size-5 text-primary-foreground" />
              ) : (
                <Crown className="size-5 text-primary-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground break-words">{content.title}</h3>
              <p className="text-muted-foreground text-sm break-words">
                {content.subtitle}
              </p>
            </div>
          </div>
          <Button 
            variant="default"
            className="h-10 sm:h-12 px-4 sm:px-6 w-full sm:w-auto flex-shrink-0"
          >
            <Crown className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Upgrade Now</span>
            <span className="sm:hidden">Upgrade</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default UpgradeCTA;
