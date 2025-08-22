import {
  GiftIcon,
  LifebuoyIcon,
  RocketIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "../ui/button";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="border-border bg-muted/50 flex flex-col items-start justify-center gap-1 rounded-lg border px-4 py-3">
      <div className="text-xl text-primary">{icon}</div>
      <div className="text-foreground font-semibold">{title}</div>
      <div className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </div>
    </div>
  );
}

const features = [
  {
    icon: (
      <span role="img" aria-label="rocket">
        <RocketIcon />
      </span>
    ),
    title: "Access to All Models",
    description:
      "Get access to our full suite of models including Claude, o3-mini-high, and more!",
  },
  {
    icon: (
      <span role="img" aria-label="gift">
        <GiftIcon />
      </span>
    ),
    title: "Generous Limits",
    description:
      "Receive 1500 standard credits per month, plus 100 premium credits* per month.",
  },
  {
    icon: (
      <span role="img" aria-label="support">
        <LifebuoyIcon />
      </span>
    ),
    title: "Priority Support",
    description:
      "Get faster responses and dedicated assistance from the T3 team whenever you need help!",
  },
];

export const Account = () => {
  return (
    <div className="space-y-8 lg:col-span-2">
      {/* Upgrade to Pro */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-foreground text-xl font-bold">Upgrade to Pro</h2>
          <div className="bg-accent/40 flex items-end rounded-xl border px-2 py-0.5 text-right">
            <div className="text-foreground mr-1 text-2xl font-bold">$8 </div>{" "}
            <div className="text-muted-foreground">/month</div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
          <Button>Upgrade Now</Button>
        </div>

        {/* Upgrade Button */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">
            * Premium credits are used for GPT Image Gen, Claude Sonnet, and
            Grok 3. Additional Premium credits can be purchased separately.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-1 pt-8">
        <h2 className="text-xl font-bold text-white">Danger Zone</h2>
        <p className="text-muted-foreground text-sm">
          Permanently delete your account and all associated data.
        </p>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
};
