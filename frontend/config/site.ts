import type { Metadata } from "next";

const TITLE = "1ai | Multi-model AI chat app";
const DESCRIPTION =
  "1ai is a powerful platform that allows you to chat with different Large Language Models (LLMs) via a unified interface. Experience seamless AI conversations with models like GPT-4, Claude, and more. Fast, secure, and user-friendly AI chat application.";

// Use environment variable or default to production URL
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://1ai.chat";

export const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "AI Chat",
    "Large Language Models",
    "LLM",
    "GPT-4",
    "Claude",
    "AI Assistant",
    "Chat AI",
    "Multi-model AI",
    "AI Platform",
    "Conversational AI",
    "AI Chat App",
    "Artificial Intelligence",
    "Machine Learning",
    "Natural Language Processing",
    "AI Tools",
    "Productivity",
    "AI Assistant",
    "Chatbot",
    "AI Conversation",
    "Smart Chat",
  ],
  authors: [{ name: "1ai Team" }],
  creator: "1ai",
  publisher: "1ai",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "1ai",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "1ai - Multi-model AI chat app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_URL}/og-image.png`],
    creator: "@1ai_chat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
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
    apple: "/apple-touch-icon.png",
  },
  category: "AI",
};
