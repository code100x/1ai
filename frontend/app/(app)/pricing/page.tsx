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
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary lg:text-4xl tracking-tight mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to
            our complete AI platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative h-full transition-all duration-300 hover:shadow-xl ${
                plan.highlight
                  ? "border-primary/30 bg-primary/5 shadow-lg scale-[1.02] ring-1 ring-primary/10"
                  : "border-border/40 bg-card/50 hover:border-border/60"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1 shadow-md">
                    <StarIcon className="size-3" weight="fill" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="flex flex-col h-full">
                <CardHeader className="text-center pb-4 pt-6">
                  <CardTitle className="text-xl font-bold mb-4">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">
                        {plan.currency}
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {plan.interval}
                      </span>
                    </div>
                    {plan.savings && (
                      <div className="mt-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-500/10 text-green-600 dark:text-green-400"
                        >
                          {plan.savings}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col px-6 pb-6">
                  <div className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 size-4 items-center justify-center rounded-full bg-primary/10 flex mt-0.5">
                          <CheckIcon
                            className="size-2.5 text-primary"
                            weight="bold"
                          />
                        </div>
                        <span className="text-foreground/90 text-sm">
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
                    className={`w-full h-10 font-semibold text-sm ${
                      plan.highlight
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    }`}
                  >
                    {plan.cta.text}
                  </RazorpayPayment>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
