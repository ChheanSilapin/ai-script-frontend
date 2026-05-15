import type { GenerateResponse, GenerateScriptPayload } from "@/types/generator";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export const generatorApi = {
  generateScript: async (payload: GenerateScriptPayload): Promise<GenerateResponse> => {
    const response = await fetch(`${API_BASE}/api/generate-script`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail ?? "Failed to generate script");
    }

    return data as GenerateResponse;
  },
};