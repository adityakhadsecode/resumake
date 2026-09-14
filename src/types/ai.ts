import { ResumeData } from "./resume";

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
  | "parse-resume"
  | "tailor-resume";

export interface TailorExperienceItem {
  id: string;
  role: string;
  company: string;
  originalBullets: string;
  tailoredBullets: string;
}

export interface TailorResumeResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  summaryAnalysis: string;
  tailoredSummary: string;
  tailoredExperiences: TailorExperienceItem[];
  suggestedSkillsAdditions: string[];
}

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
    resumeData?: ResumeData;
  };
}

export interface AiResponsePayload {
  success: boolean;
  result?: string;
  parsedResume?: ResumeData;
  tailorResult?: TailorResumeResult;
  error?: string;
}
