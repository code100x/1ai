"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  StarIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import RazorpayPayment from "@/components/RazorpayPayment";

const pricingPlans = [
  {
    name: "Monthly",
    price: 99,
    currency: "₹",
    interval: "per month",
    description: "Perfect for individuals getting started with AI",
    highlight: false,
    popular: false,
    features: [
      "Unlimited AI conversations",
      "Access to all AI models",
      "Chat history & sync",
      "Web-based platform",
      "24/7 customer support",
      "Regular model updates",
      "Mobile responsive design",
    ],
    cta: {
      text: "Start Monthly Plan",
      href: "/auth",
    },
  },
  {
    name: "Yearly",
    price: 999,
    currency: "₹",
    interval: "per year",
    description: "Best value for committed users - Save ₹189 annually!",
    highlight: true,
    popular: true,
    savings: "Save ₹189",
    features: [
      "Everything in Monthly plan",
      "Priority customer support",
      "Early access to new features",
      "Advanced analytics dashboard",
      "Custom AI model preferences",
      "Export conversation history",
      "API access (coming soon)",
      "2 months free (₹198 value)",
    ],
    cta: {
      text: "Choose Yearly Plan",
      href: "/auth",
    },
  },
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen overflow-y-auto pt-6 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="text-center flex flex-col gap-2 mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to
            our complete AI platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative w-full h-full border-muted/40 bg-muted/10 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                plan.highlight
                  ? "border-primary/50 bg-primary/5"
                  : "hover:border-muted/60"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1 text-xs sm:text-sm">
                    <StarIcon className="size-3" weight="fill" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold">
                  {plan.name}
                </CardTitle>
                <div className="mt-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary">
                      {plan.currency}
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm sm:text-base">
                      {plan.interval}
                    </span>
                  </div>
                  {plan.savings && (
                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm"
                      >
                        {plan.savings}
                      </Badge>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm sm:text-base mt-3">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm sm:text-base"
                    >
                      <div className="flex size-4 items-center justify-center rounded-full bg-primary/10">
                        <CheckIcon
                          className="size-2.5 text-primary"
                          weight="bold"
                        />
                      </div>
                      <span className="text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>
                <RazorpayPayment
                  plan={{
                    name: plan.name,
                    price: plan.price,
                    currency: plan.currency,
                    interval: plan.interval.replace("per ", ""),
                  }}
                  className={`w-full h-10 font-semibold text-sm sm:text-base rounded-lg ${
                    plan.highlight
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {plan.cta.text}
                </RazorpayPayment>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
