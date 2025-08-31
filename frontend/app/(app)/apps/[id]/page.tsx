"use client";
import React from "react";
import AppRunner, { AppRunnerConfig } from "../_components/AppRunner";
import { getRunnerConfig } from "@/lib/apps-registry";

interface AppPageProps {
  params: Promise<{ id: string }>;
}

export default function AppPage({ params }: AppPageProps) {
  const [appId, setAppId] = React.useState<string>("");

  React.useEffect(() => {
    params.then(({ id }) => setAppId(id));
  }, [params]);

  if (!appId) {
    return null;
  }

  const config: AppRunnerConfig = getRunnerConfig(appId) ?? {
    title: appId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: `Use the ${appId} app`,
    placeholder: "Enter your input...",
    makeRequestBody: (input: string) => ({ input }),
  };

  return <AppRunner appId={appId} config={config} />;
}
