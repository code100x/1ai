import type { Model } from "./types";
import { ModelProvider } from "./types";
import { MODELS } from "./constants";
import { DiamondIcon, StarIcon, CircleIcon } from "lucide-react";
import React from "react";
import { OpenAI } from "@/components/svgs/openai";
import { StarFourIcon } from "@phosphor-icons/react/dist/ssr";
import { Anthrophic } from "@/components/svgs/anthropic";

export function getModelProviderIcon(model: Model): React.ReactNode {
  switch (model.provider) {
    case ModelProvider.OPENAI:
      return <OpenAI className="text-orange-400 dark:text-orange-100 h-4 w-4" />; // OpenAI
    case ModelProvider.GOOGLE:
      return <StarFourIcon className="h-4 w-4 text-orange-400 dark:text-orange-100" />; // Google
    case ModelProvider.ANTHROPIC:
      return <Anthrophic className="h-4 w-4 text-orange-400 dark:text-orange-100" />; // Anthropic Claude
    default:
      return <DiamondIcon className="h-4 w-4 text-orange-400 dark:text-orange-100" />; // Default
  }
}

export function estimateCost(modelId: string, tokenCount: number): number {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) return 0;

  return (tokenCount / 1000) * model.pricePer1kTokens;
}

export function isModelCompatibleWithFeature(
  modelId: string,
  feature: string,
): boolean {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) return false;

  return true;
}

export function getModelsByProvider(provider: ModelProvider): Model[] {
  return MODELS.filter(
    (model) => model.provider === provider && model.isAvailable !== false,
  );
}
