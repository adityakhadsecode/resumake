export type AiProvider = "gemini" | "openai" | "groq" | "ollama";

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  model?: string;
  ollamaUrl?: string;
}

export type AiAction =
  | "enhance-bullets"
  | "generate-summary"
  | "test-connection"
  | "parse-resume";

export interface AiRequestPayload {
  action: AiAction;
  provider: AiProvider;
  apiKey?: string;
  model?: string;
  ollamaUrl?: string;
  content?: string;
  context?: {
    role?: string;
    company?: string;
    projectName?: string;
    skills?: string[];
    experienceSummary?: string;
  };
}

export interface AiResponsePayload {
  success: boolean;
  result?: string;
  parsedResume?: any;
  error?: string;
}
