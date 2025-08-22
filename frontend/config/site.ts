import type { Metadata } from "next";

const TITLE =
  "1AI - An Open-source, user-friendly fast AI response chat app";
const DESCRIPTION =
  "1AI is a platform that allows you to chat with AI, support different LLM, respond very fast, user friendly, have customization, cheap.";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";

export const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/logo.svg",
  },
  applicationName: "1AI Chat",

  category: "AI",
  alternates: {
    canonical: BASE_URL,
  },
  keywords: [
    "1AI Chat",
    "AI Fiesta",
    "1AI",
    "AI",
    "LLM",
    "Fast",
    "User friendly",
    "Customization",
    "Cheap",
    "web3",
    "blockchain",
    "open-source",
    "self-hosted",
    "self-hosting",
    "self-host",
    "self-hosting",
  ],
  metadataBase: new URL(BASE_URL!),
};
