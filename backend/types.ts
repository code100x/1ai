import { z } from "zod";

const MAX_INPUT_TOKENS = 1000;


export const MODELS: ModelFull[] = [
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    isPremium: true
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    isPremium: false
  },
  {
    id: "agentica-org/deepcoder-14b-preview:free",
    name: "DeepCoder 14B Preview",
    isPremium: true
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1 (free)",
    isPremium: true
  },
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat v3 0324 (free)",
    isPremium: true
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Instruct (free)",
    isPremium: true
  },
  {
    id: "mistralai/mistral-small-24b-instruct-2501:free",
    name: "Mistral Small 24B Instruct 2501 (free)",
    isPremium: true
  },
  {
    id: "qwen/qwen-2.5-72b-instruct:free",
    name: "Qwen 2.5 72B Instruct (free)",
    isPremium: true
  },
  {
    id: "moonshotai/kimi-k2:free",
    name: "Moonshot Kimi K2 (free)",
    isPremium: true
  },
  {
    id: "rekaai/reka-flash-3:free",
    name: "Reka Flash 3 (free)",
    isPremium: true
  },
  {
    id: "z-ai/glm-4.5-air:free",
    name: "GLM 4.5 Air (free)",
    isPremium: true
  },
  {
    id: "tencent/hunyuan-a13b-instruct:free",
    name: "Tencent Hunyuan A13B Instruct (free)",
    isPremium: true
  },
  {
    id: "google/gemma-3n-e2b-it:free",
    name: "Google Gemma 3n e2B IT (free)",
    isPremium: true
  },
  {
    id: "google/gemma-3-27b-it:free",
    name: "Google Gemma 3 27B IT (free)",
    isPremium: true
  },
  {
    id: "cognitivecomputations/dolphin3.0-mistral-24b:free",
    name: "Dolphin 3.0 Mistral 24B (free)",
    isPremium: true
  },
  {
    id: "google/gemma-2-9b-it:free",
    name: "Google Gemma 2 9B IT (free)",
    isPremium: true
  },
  {
    id: "shisa-ai/shisa-v2-llama3.3-70b:free",
    name: "Shisa v2 Llama 3.3 70B (free)",
    isPremium: true
  },
  {
    id: "tngtech/deepseek-r1t-chimera:free",
    name: "DeepSeek R1T Chimera (free)",
    isPremium: true
  },
  {
    id: "microsoft/mai-ds-r1:free",
    name: "Microsoft MAI DS-R1 (free)",
    isPremium: true
  },
  {
    id: "baidu/ernie-4.5-21b-a3b",
    name: "Baidu ERNIE 4.5 21B A3B",
    isPremium: true
  },
  {
    id: "openai/gpt-oss-20b:free",
    name: "OpenAI GPT-OSS 20B (free)",
    isPremium: true
  },
  {
    id: "x-ai/grok-3-mini",
    name: "xAI Grok 3 Mini",
    isPremium: true
  },
];


export const SUPPORTER_MODELS = MODELS.map(model => model.id);
export type MODEL = typeof SUPPORTER_MODELS[number];

export type ModelFull = {
    id: string;
    name: string;
    isPremium: boolean;
}

export const CreateChatSchema = z.object({
    conversationId: z.uuid().optional(),
    message: z.string().max(MAX_INPUT_TOKENS),
    model: z.enum(SUPPORTER_MODELS)
})

export const CreateUser = z.object({
    email: z.email()
})

export const SignIn = z.object({
    email: z.email(),
    otp: z.string().or(z.number().int()),
})

export type Message = {
    content: string;
    role: Role;
}

export type Messages = Message[];

export enum Role {
    Agent = "assistant",
    User = "user"
}
