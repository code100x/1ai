"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import PricingButton from "./pricing-button";
import { redirect, useRouter } from "next/navigation";

export interface PricingFeature {
  name: string;
  highlight?: boolean;
  included: boolean;
}

export interface PricingTier {
  name: string;
  price: number;
  interval?: string;
  description: string;
  features: PricingFeature[];
  highlight?: boolean;
  cta?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
}

export interface PricingCardsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tiers: PricingTier[];
  containerClassName?: string;
  cardClassName?: string;
  sectionClassName?: string;
}

export function PricingCards({
  tiers,
  className,
  containerClassName,
  cardClassName,
  sectionClassName,
  ...props
}: PricingCardsProps) {
  const router = useRouter();
  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "px-4 py-12 sm:py-24 md:py-20",
        "fade-bottom overflow-hidden pb-0",
        sectionClassName,
      )}
    >
      <div
        className={cn("mx-auto w-full max-w-5xl px-4", containerClassName)}
        {...props}
      >
        <div className={cn("grid grid-cols-1 gap-8 md:grid-cols-3", className)}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "group relative rounded-2xl border transition-all duration-500",
                tier.highlight
                  ? "bg-primary text-accent-foreground"
                  : "bg-card text-card-foreground",
                "border-border hover:shadow-lg",
                cardClassName,
              )}
            >
              <div className="flex h-full flex-col p-10">
                <div className="space-y-4">
                  <h3
                    className={cn(
                      "text-lg font-medium tracking-wider uppercase",
                      tier.highlight ? "text-accent-foreground" : "",
                    )}
                  >
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    {tier.name !== "Enterprise" && (
                      <span className="text-5xl font-light">${tier.price}</span>
                    )}
                    <span className="text-muted-foreground text-sm">
                      {tier.interval || "one-time"}
                    </span>
                  </div>
                  <p className="border-border text-muted-foreground border-b pb-6 text-sm">
                    {tier.description}
                  </p>
                </div>

                <div className="mt-8 flex-grow space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
                          feature.included
                            ? tier.highlight
                              ? "text-accent-foreground"
                              : "text-foreground"
                            : "text-muted",
                        )}
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {tier.cta && (
                  <div className="mt-8">
                    {tier.name === "Pro" ? (
                      <PricingButton plan={tier.name} amount={tier.price} />
                    ) : (
                      <Button
                        className={cn(
                          "group relative h-12 w-full transition-all duration-300",
                          tier.highlight
                            ? "bg-background text-foreground hover:bg-muted"
                            : "bg-primary text-primary-foreground hover:bg-primary/90",
                        )}
                        onClick={() => {
                          if (tier.name === "Free") {
                            redirect("https://x.com/kirat_tw");
                          } else if (tier.name === "Enterprise") {
                            redirect("https://x.com/kirat_tw");
                          }
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 font-medium tracking-wide">
                          {tier.name === "Enterprise"
                            ? "Contact Sales"
                            : "Get Started"}
                        </span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
