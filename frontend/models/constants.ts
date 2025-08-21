import { type Model, ModelCapability, ModelProvider } from "./types";

export const MODELS: Model[] = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT 3.5 Turbo",
    provider: ModelProvider.OPENAI,
    description: "Fast and efficient model for most tasks",
    maxTokens: 16385,
    pricePer1kTokens: 0.0015,
    capabilities: [
      ModelCapability.TEXT,
      ModelCapability.CODE,
      ModelCapability.FUNCTION_CALLING,
    ],
    isAvailable: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT 4o Mini",
    provider: ModelProvider.OPENAI,
    description: "Compact version of GPT-4o with improved performance",
    maxTokens: 128000,
    pricePer1kTokens: 0.005,
    capabilities: [
      ModelCapability.TEXT,
      ModelCapability.CODE,
      ModelCapability.FUNCTION_CALLING,
    ],
    isAvailable: true,
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash (Beta)",
    provider: ModelProvider.GOOGLE,
    description: "Google's fastest Gemini model for responsive applications",
    maxTokens: 32768,
    pricePer1kTokens: 0.0035,
    capabilities: [
      ModelCapability.TEXT,
      ModelCapability.CODE,
      ModelCapability.FUNCTION_CALLING,
    ],
    isAvailable: false,
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet (Experimental)",
    provider: ModelProvider.ANTHROPIC,
    description: "Latest Claude model with enhanced capabilities",
    maxTokens: 200000,
    pricePer1kTokens: 0.003,
    capabilities: [
      ModelCapability.TEXT,
      ModelCapability.CODE,
      ModelCapability.FUNCTION_CALLING,
    ],
    isAvailable: false,
  },
  {
    id: "claude-3-sonnet-3.7",
    name: "Claude 3.7 Sonnet (Experimental)",
    provider: ModelProvider.ANTHROPIC,
    description: "Latest Claude 3.7 model with excellent performance",
    maxTokens: 200000,
    pricePer1kTokens: 0.003,
    capabilities: [
      ModelCapability.TEXT,
      ModelCapability.CODE,
      ModelCapability.FUNCTION_CALLING,
    ],
    isAvailable: false,
  },
  {
    id: "claude-3.7",
    name: "Claude 3.7 (Experimental)",
    provider: ModelProvider.ANTHROPIC,
    description: "Claude 3.7 flagship model",
    maxTokens: 200000,
    pricePer1kTokens: 0.015,
    capabilities: [
      ModelCapability.TEXT,
      ModelCapability.CODE,
      ModelCapability.FUNCTION_CALLING,
    ],
    isAvailable: false,
  },
];

export const DEFAULT_MODEL_ID = "gpt-3.5-turbo";

export const getModelById = (id: string): Model | undefined => {
  return MODELS.find((model) => model.id === id);
};

export const getAvailableModels = (): Model[] => {
  return MODELS.filter((model) => model.isAvailable !== false);
};
