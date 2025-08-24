"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import RazorpayPayment from "@/components/RazorpayPayment";
import { redirect } from "next/navigation";

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
  return (
    <div className="pt-8 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back button */}
        <Button
          onClick={() => redirect("/ask")}
          className="mb-6 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Back
        </Button>

        {/* Heading */}
        <div className="text-center flex flex-col gap-3 mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. All subscriptions include full access to our AI platform.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`
                relative h-full flex flex-col justify-between
                border rounded-xl transition-all duration-300
                ${plan.highlight
                  ? "border-primary shadow-lg bg-primary/5 scale-[1.02]"
                  : "border-muted/40 hover:border-muted/60 hover:shadow-md"
                }
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-3 py-1 bg-primary text-primary-foreground shadow-md flex items-center gap-1">
                    <StarIcon className="w-4 h-4" weight="fill" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Header Section */}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-3 flex flex-col items-center">
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-4xl font-extrabold tracking-tight text-primary">
                      {plan.currency}{plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">{plan.interval}</span>
                  </div>
                  {plan.savings && (
                    <Badge
                      variant="secondary"
                      className="mt-2 bg-green-500/10 text-green-700 dark:text-green-400"
                    >
                      {plan.savings}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm sm:text-base mt-3 px-2">
                  {plan.description}
                </p>
              </CardHeader>

              {/* Features + CTA */}
              <CardContent className="flex flex-col flex-grow justify-between space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex w-5 h-5 items-center justify-center rounded-full bg-primary/10">
                        <CheckIcon className="w-3 h-3 text-primary" weight="bold" />
                      </div>
                      <span className="text-foreground text-sm sm:text-base">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <RazorpayPayment
                  aria-label={`Subscribe to ${plan.name} plan`}
                  plan={{
                    name: plan.name,
                    price: plan.price,
                    currency: plan.currency,
                    interval: plan.interval.replace("per ", ""),
                  }}
                  className={`w-full h-11 rounded-lg font-semibold text-sm sm:text-base transition-all
                    ${plan.highlight
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                    }
                  `}
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
