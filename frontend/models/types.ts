export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  description: string;
  maxTokens: number;
  pricePer1kTokens: number;
  capabilities: ModelCapability[];
  isAvailable?: boolean;
}

export enum ModelProvider {
  OPENAI = "openai",
  GOOGLE = "google",
  ANTHROPIC = "anthropic",
}

export enum ModelCapability {
  TEXT = "text",
  CODE = "code",
  VISION = "vision",
  FUNCTION_CALLING = "function_calling",
}
