import { env } from "@/env";
import type { Model } from "./types";
import { getModelById } from "./constants";
import { ModelProvider } from "./types";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatOptions {
  modelId: string;
  messages: ChatMessage[];
  stream?: boolean;
  maxTokens?: number;
  temperature?: number;
  fallbackToDefaultModel?: boolean;
}

  
const MODEL_ID_MAPPING: Record<string, string> = {
  "gpt-3.5-turbo": "gpt-3.5-turbo",
  "gpt-4o-mini": "gpt-4o-mini",
  "gemini-2.0-flash": "gpt-3.5-turbo",
  "anthropic/claude-3.5-sonnet": "anthropic/claude-3.5-sonnet",
  "claude-3-sonnet-3.7": "claude-3-sonnet-3.7",
  "claude-3.7": "claude-3.7",
};

function shouldUseDirectly(modelId: string): boolean {
  const workingModels = ["gpt-3.5-turbo", "gpt-4o-mini"];
  return workingModels.includes(modelId);
}

function createRequestBodyForProvider(
  provider: ModelProvider,
  options: ChatOptions,
): Record<string, unknown> {
  const { messages, stream, maxTokens, temperature } = options;

  const apiModelId = MODEL_ID_MAPPING[options.modelId] ?? options.modelId;

  const requestBody: Record<string, unknown> = {
    messages,
    stream: stream ?? true,
    model: apiModelId,
  };

  if (maxTokens) {
    requestBody.max_tokens = maxTokens;
  }

  if (temperature !== undefined) {
    requestBody.temperature = temperature;
  }

  return requestBody;
}

function getApiUrlForProvider(provider: ModelProvider): string {

  return "https://fast.typegpt.net/v1/chat/completions";
}


function getErrorMessage(status: number): string {
  switch (status) {
    case 503:
      return "Service unavailable - TypeGPT may not support this model yet";
    case 522:
      return "Connection timeout - TypeGPT server took too long to respond";
    case 429:
      return "Rate limit exceeded - Too many requests";
    case 401:
      return "Unauthorized - Check your API key";
    case 403:
      return "Forbidden - You may not have access to this model";
    default:
      return `Error code ${status}`;
  }
}

export async function fetchChatCompletion(
  options: ChatOptions,
): Promise<Response> {
  const model = getModelById(options.modelId);
  if (!model) {
    throw new Error(`Model ${options.modelId} not found`);
  }

  try {

    if (shouldUseDirectly(options.modelId)) {
      const requestBody = createRequestBodyForProvider(model.provider, options);
      const apiUrl = getApiUrlForProvider(model.provider);

      console.log(`Attempting to use model: ${options.modelId}`);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.TYPEGPT_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (response.ok) {
        console.log(`Successfully used model: ${options.modelId}`);
        return response;
      }


      const errorMessage = getErrorMessage(response.status);
      console.error(
        `Model ${options.modelId} failed: ${errorMessage} (${response.status})`,
      );


      if (!options.fallbackToDefaultModel) {
        return response;
      }


      console.warn(`Falling back to gpt-3.5-turbo from ${options.modelId}`);
    } else if (!options.fallbackToDefaultModel) {

      throw new Error(
        `Model ${options.modelId} is not supported by TypeGPT at this time`,
      );
    } else {

      console.warn(
        `Model ${options.modelId} is not supported by TypeGPT, falling back to gpt-3.5-turbo`,
      );
    }


    return fetchChatCompletion({
      ...options,
      modelId: "gpt-3.5-turbo",
      fallbackToDefaultModel: false, 
    });
  } catch (error) {
    console.error("Error fetching chat completion:", error);


    if (options.fallbackToDefaultModel && options.modelId !== "gpt-3.5-turbo") {
      console.warn(
        `Model ${options.modelId} failed with error, falling back to gpt-3.5-turbo`,
      );
      return fetchChatCompletion({
        ...options,
        modelId: "gpt-3.5-turbo",
        fallbackToDefaultModel: false, 
      });
    }

    throw error;
  }
}
