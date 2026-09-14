"use client";

import { useState, useEffect, useCallback } from "react";
import { AiConfig } from "@/types/ai";

const STORAGE_KEY = "antislop_ai_config_v1";

const defaultAiConfig: AiConfig = {
  provider: "gemini",
  apiKey: "",
  model: "",
  ollamaUrl: "http://localhost:11434",
};

export function useAiConfig() {
  const [config, setConfig] = useState<AiConfig>(defaultAiConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setConfig({ ...defaultAiConfig, ...parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load AI config from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveConfig = useCallback((newConfig: Partial<AiConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save AI config to localStorage:", e);
      }
      return updated;
    });
  }, []);

  const isConfigured = Boolean(
    (config.provider === "ollama" && config.ollamaUrl) ||
      (config.provider !== "ollama" && config.apiKey.trim().length > 0)
  );

  return {
    config,
    isLoaded,
    isConfigured,
    saveConfig,
  };
}
