"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CurrencyCircleDollarIcon,
  CheckIcon,
  StarIcon,
  LightningIcon,
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
  return (
    <div className="h-full overflow-y-auto pt-10 pb-8">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-primary md:text-5xl tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to
            our complete AI platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-10">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative bg-card border transition-all duration-200 hover:shadow-md ${
                plan.highlight ? "ring-2 ring-primary/70 shadow-sm" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1 rounded-full shadow">
                    <StarIcon className="size-3" weight="fill" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-semibold">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {plan.currency}
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm md:text-base">
                      {plan.interval}
                    </span>
                  </div>
                  {plan.savings && (
                    <Badge
                      variant="secondary"
                      className="mt-3 bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-full"
                    >
                      {plan.savings}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm md:text-base mt-3">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-5 pb-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                        <CheckIcon
                          className="size-3 text-primary"
                          weight="bold"
                        />
                      </div>
                      <span className="text-foreground/90 text-sm leading-relaxed">
                        {feature}
                      </span>
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
                  className={`w-full h-11 font-medium text-sm rounded-md ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-foreground hover:bg-muted/80"
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
