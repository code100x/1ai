import {
  GlobeIcon,
  LightningIcon,
  LockIcon,
  RocketIcon,
} from "@phosphor-icons/react/dist/ssr";

export const features = [
  {
    title: "Multi-Model Chat",
    description:
      "Talk to multiple AI models from different providers — all in one place.",
    icon: LightningIcon,
  },
  {
    title: "Sync & Sign-In",
    description:
      "Secure authentication with chat history saved across sessions.",
    icon: LockIcon,
  },
  {
    title: "Web-First Experience",
    description:
      "No setup, no downloads — everything runs smoothly in your browser.",
    icon: GlobeIcon,
  },
  // {
  //   title: "Instant Access",
  //   description: "Jump right in and start chatting. No waiting, no friction.",
  //   icon: RocketIcon,
  // },
];

export const tiers = [
  {
    name: "Free",
    price: 0,
    interval: "forever",
    description: "Perfect for getting started with AI aggregation",
    features: [
      { name: "100 queries per month", included: true },
      { name: "Access to 3 AI models", included: true },
      { name: "Basic analytics", included: true },
      { name: "Community support", included: true },
      { name: "Standard response time", included: true },
      { name: "API access", included: false },
      { name: "Custom integrations", included: false },
    ],
    cta: {
      text: "Start for free",
      href: "/signup",
    },
  },
  {
    name: "Pro",
    price: 8,
    interval: "monthly",
    description: "Ideal for professionals and growing teams",
    highlight: true,
    features: [
      { name: "Unlimited queries", included: true },
      { name: "Access to all AI models", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true },
      { name: "Custom integrations", included: true },
      { name: "API access", included: true, highlight: true },
      { name: "Team collaboration", included: true },
    ],
    cta: {
      text: "Upgrade to Pro",
      href: "/upgrade",
    },
  },
  {
    name: "Enterprise",
    price: 0,
    interval: "contact us",
    description: "Tailored solutions for large organizations",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Dedicated infrastructure", included: true },
      { name: "SLA guarantees", included: true },
      { name: "Custom model training", included: true },
      { name: "On-premise deployment", included: true },
      { name: "Dedicated support team", included: true },
      { name: "Advanced security features", included: true },
    ],
    cta: {
      text: "Contact sales",
      onClick: () => console.log("Contact sales clicked"),
    },
  },
];
