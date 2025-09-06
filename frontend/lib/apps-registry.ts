import type { AppRunnerConfig } from "@/app/(app)/apps/_components/AppRunner";

export type AppMenuMeta = {
  id: string;
  name: string;
  description: string;
  icon: string; // keep emoji strings for now
  credits: number;
};

export type AppDefinition = {
  meta: AppMenuMeta;
  runner: AppRunnerConfig;
};

export const appsRegistry: Record<string, AppDefinition> = {
  "article-summarizer": {
    meta: {
      id: "article-summarizer",
      name: "Article Summarizer",
      description:
        "Summarize long articles into concise, easy-to-read summaries",
      icon: "📄",
      credits: 2,
    },
    runner: {
      title: "Article Summarizer",
      description: "Enter article text to get a summary",
      placeholder: "Paste article text here...",
      makeRequestBody: (input: string) => ({ article: input }),
    },
  },
  "youtube-summarizer": {
    meta: {
      id: "youtube-summarizer",
      name: "Youtube Summarizer",
      description:
        "Summarize youtube videos into concise, easy-to-read summaries",
      icon: "🔴",
      credits: 2,
    },
    runner: {
      title: "Youtube Summarizer",
      description: "Enter a YouTube video link to get a summary",
      placeholder:
        "Enter YouTube link (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
      makeRequestBody: (input: string) => ({ videoLink: input }),
    },
  },
};

export const listAvailableApps = (): AppMenuMeta[] =>
  Object.values(appsRegistry).map((d) => d.meta);

export const getRunnerConfig = (id: string): AppRunnerConfig | undefined =>
  appsRegistry[id]?.runner;
