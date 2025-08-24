"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCredits } from "@/hooks/useCredits";

interface UpgradeCTAProps {
  variant?: "banner" | "card" | "minimal" | "topbar";
  className?: string;
}

export const UpgradeCTA: React.FC<UpgradeCTAProps> = ({ 
  variant = "banner", 
  className = "" 
}) => {
  const { userCredits, isLoading } = useCredits();
  
  // Only hide if loading or no user data
  if (isLoading || !userCredits) {
    return null
  }

  const shouldShowUpgradeCTA = !userCredits.isPremium;

  const getBannerContent = () => {
    if (userCredits.isPremium) {
      return {
        title: `Premium: ${userCredits.credits} credits available`,
        subtitle: "You have premium access",
        urgency: "none"
      };
    } else if (userCredits.credits === 0) {
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
    } else if (userCredits.credits < 3) {
      return {
        title: "Running low on credits",
        subtitle: "Upgrade to Pro for unlimited AI conversations",
        urgency: "low"
      };
    } else {
      return {
        title: `${userCredits.credits} credits available`,
        subtitle: "You have plenty of credits remaining",
        urgency: "none"
      };
    }
  };

  const content = getBannerContent();

  if (variant === "topbar") {
    return (
      <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
        <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md ${
          userCredits.isPremium 
            ? 'bg-green-500/10 border border-green-500/20' 
            : 'bg-purple-500/10 border border-purple-500/20'
        }`}>
          {userCredits.isPremium ? (
            <Crown className="h-3 w-3 text-green-500" />
          ) : (
            <Zap className="h-3 w-3 text-purple-500" />
          )}
          <span className={`text-xs font-medium ${
            userCredits.isPremium 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-purple-600 dark:text-purple-400'
          }`}>
            {Math.max(0, userCredits.credits)}
          </span>
        </div>
        {shouldShowUpgradeCTA && (
          <Link href="/pricing">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 px-1.5 sm:px-2 text-xs"
              title={content.title} // Tooltip on hover
            >
              <span className="hidden sm:inline">Upgrade</span>
              <span className="sm:hidden">Up</span>
            </Button>
          </Link>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 rounded-lg ${
        userCredits.isPremium
          ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20'
          : 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20'
      } ${className}`}>
        <div className="flex items-center gap-2">
          {userCredits.isPremium ? (
            <Crown className="h-4 w-4 text-green-500" />
          ) : (
            <Zap className="h-4 w-4 text-purple-500" />
          )}
          <span className="text-sm font-medium">
            {userCredits.isPremium ? 'Premium: ' : ''}{Math.max(0, userCredits.credits)} credit{userCredits.credits === 1 ? '' : 's'} 
            {userCredits.isPremium ? ' available' : ' remaining'}
          </span>
        </div>
        {shouldShowUpgradeCTA && (
          <Link href="/pricing">
            <Button size="sm" variant="outline" className="h-8 w-full sm:w-auto">
              Upgrade
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card className={`${
        userCredits.isPremium
          ? 'border-green-500/20 bg-gradient-to-br from-green-500/5 to-blue-500/5'
          : 'border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5'
      } ${className}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                userCredits.isPremium ? 'bg-green-500/10' : 'bg-purple-500/10'
              } flex-shrink-0`}>
                <Crown className={`h-5 w-5 ${
                  userCredits.isPremium ? 'text-green-500' : 'text-purple-500'
                }`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg break-words">{content.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 break-words">
                  {content.subtitle}
                </p>
              </div>
            </div>
            {shouldShowUpgradeCTA && (
              <Link href="/pricing" className="w-full sm:w-auto flex-shrink-0">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto">
                  <Crown className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Upgrade to Pro</span>
                  <span className="sm:hidden">Upgrade</span>
                </Button>
              </Link>
            )}
            {
              <div className="w-full sm:w-auto flex-shrink-0">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto">
                  <Crown className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Upgrade to Pro</span>
                  <span className="sm:hidden">Upgrade</span>
                </Button>
              </div>
            }
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default banner variant - show minimal display for users with plenty of credits
  if (!shouldShowUpgradeCTA) {
    // For users with plenty of credits, show a minimal credits display
    return (
      <div className={`rounded-xl border bg-muted/20 p-3 ${className}`}>
        <div className="flex items-center gap-3">
          {userCredits.isPremium ? (
            <Crown className="h-4 w-4 text-green-500" />
          ) : (
            <Zap className="h-4 w-4 text-purple-500" />
          )}
          <span className="text-sm font-medium">
            {userCredits.isPremium ? 'Premium: ' : ''}{userCredits.credits} credit{userCredits.credits === 1 ? '' : 's'} 
            {userCredits.isPremium ? ' available' : ' remaining'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link href="/pricing">
      <div className={`relative rounded-xl border bg-muted/40 hover:bg-muted/60 transition-colors duration-200 p-4 sm:p-6 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`from-primary flex size-10 items-center justify-center rounded-xl ${
              userCredits.isPremium 
                ? 'bg-gradient-to-tr from-green-500 to-blue-500' 
                : 'bg-gradient-to-tr to-pink-500'
            } drop-shadow-md flex-shrink-0`}>
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