import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const nvidia = createOpenAICompatible({
  name: "nvidia",
  baseURL: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
  },
});

export type NvidiaModelPurpose =
  | "general"
  | "general-fallback"
  | "alternative"
  | "coding"
  | "coding-fallback"
  | "coding-alternative";

export function getNvidiaModelName(purpose: NvidiaModelPurpose = "general") {
  if (purpose === "coding") {
    return process.env.NVIDIA_CODING_MODEL ?? "qwen/qwen3-coder-480b-a35b-instruct";
  }

  if (purpose === "coding-fallback") {
    return process.env.NVIDIA_CODING_FALLBACK_MODEL ?? "deepseek-ai/deepseek-v4-pro";
  }

  if (purpose === "coding-alternative") {
    return process.env.NVIDIA_CODING_ALTERNATIVE_MODEL ?? "deepseek-ai/deepseek-v4-flash";
  }

  if (purpose === "general-fallback") {
    return process.env.NVIDIA_FALLBACK_MODEL ?? "meta/llama-3.1-70b-instruct";
  }

  if (purpose === "alternative") {
    return process.env.NVIDIA_ALTERNATIVE_MODEL ?? "qwen/qwen3-next-80b-a3b-instruct";
  }

  return process.env.NVIDIA_PRIMARY_MODEL ?? "meta/llama-3.3-70b-instruct";
}

export function getNvidiaChatModel(purpose: NvidiaModelPurpose = "general") {
  return nvidia.chatModel(getNvidiaModelName(purpose));
}
