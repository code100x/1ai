"use client";
import {
  LightningIcon,
  ChartBarIcon,
  SlidersIcon,
  CodeIcon,
} from "@phosphor-icons/react/dist/ssr";
import RazorpayPayment from "@/components/RazorpayPayment";
import { useEffect } from "react";
import { useCredits } from "@/hooks/useCredits";

const pricingPlans = [
  {
    name: "Yearly",
    price: 999,
    currency: "₹",
    interval: "/ year",
    description: "Best value for committed users - Save ₹189 annually!",
    highlight: true,
    popular: true,
    features: [
      { text: "Early access to new features", icon: LightningIcon },
      { text: "Advanced analytics dashboard", icon: ChartBarIcon },
      { text: "Custom AI model preferences", icon: SlidersIcon },
      { text: "API access (coming soon)", icon: CodeIcon },
    ],
    cta: {
      text: "Purchase",
      href: "/auth",
    },
  },
];

export default function PricingPage() {
      const router = useRouter();
  const { userCredits, isPending } = useCredits();

  useEffect(() => {
    if (isPending) return;

    if (userCredits?.isPremium) {
      router.push("/ask");
    }
  }, []);
        
  return (
    <div className="flex flex-col gap-8 py-12 items-center justify-center">
      <h1 className="text-center text-2xl lg:text-3xl font-semibold tracking-tighter text-yellow-600">
        Simple, Transparent Pricing
      </h1>
      <div className="flex gap-6 w-full items-center justify-center">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`relative transition-all duration-300 flex flex-col gap-6 bg-muted shadow-2xl p-6 rounded-3xl w-full min-h-96 max-w-sm`}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-secondary-foreground text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-end-safe">
                <span className="text-3xl font-semibold text-primary">
                  {plan.currency}
                  {plan.price}
                </span>
                <span className="text-sm">{plan.interval}</span>
              </div>

              <RazorpayPayment
                plan={{
                  name: plan.name,
                  price: plan.price,
                  currency: plan.currency,
                  interval: plan.interval.replace("per ", ""),
                }}
                className={`w-full h-10`}
              >
                {plan.cta.text}
              </RazorpayPayment>
            </div>
            <div className="flex w-full h-full border-t pt-6">
              <div className="grid grid-cols-1 gap-3">
                {plan.features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex p-2 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-400/10 border border-blue-100 dark:border-blue-400/10">
                        <IconComponent
                          className="size-5 text-primary"
                          weight="duotone"
                        />
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
