import type { Metadata } from "next";

const TITLE =
  "T3chat - An Open-source, user-friendly fast AI response chat app";
const DESCRIPTION =
  "T3chat is a platform that allows you to chat with AI, support different LLM, respond very fast, user friendly, have customization, cheap.";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

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
    "T3chat",
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
