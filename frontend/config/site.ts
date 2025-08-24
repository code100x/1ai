import type { Metadata } from "next";

const TITLE = "1ai | Multi-model AI chat app";
const DESCRIPTION =
  "1ai is a platform that allows you to chat with different LLMs via a unified interface.";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";

export const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon-dark.svg",
        type: "image/svg+xml",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },

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
