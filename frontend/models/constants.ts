import { type Model, ModelCapability, ModelProvider } from "./types";

export const MODELS: Model[] = [
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: ModelProvider.GOOGLE,
    description: "Fast and efficient model for most tasks",
    maxTokens: 16385,
    pricePer1kTokens: 0.0015,
    capabilities: [
      ModelCapability.TEXT,
      ModelCapability.CODE,
      ModelCapability.FUNCTION_CALLING,
    ],
    isAvailable: true,
  }
];

export const DEFAULT_MODEL_ID = "google/gemini-2.5-flash";

export const getModelById = (id: string): Model | undefined => {
  return MODELS.find((model) => model.id === id);
};

export const getAvailableModels = (): Model[] => {
  return MODELS.filter((model) => model.isAvailable !== false);
};
