"use client";

import React, { useState, useEffect } from "react";
import { AiConfig, AiProvider } from "@/types/ai";

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AiConfig;
  onSave: (newConfig: Partial<AiConfig>) => void;
}

interface ModelOption {
  id: string;
  name: string;
  badge?: string;
  desc: string;
}

const PROVIDER_MODELS: Record<AiProvider, ModelOption[]> = {
  gemini: [
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      badge: "Recommended · Free Tier",
      desc: "Fast, generous free tier rate limits, and 1M context window.",
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      badge: "Deep Reasoning",
      desc: "Higher analytical power for complex multi-page executive resumes.",
    },
    {
      id: "gemini-2.0-flash",
      name: "Gemini 2.0 Flash",
      badge: "Next-Gen Speed",
      desc: "Google's newest low-latency multimodal model.",
    },
  ],
  groq: [
    {
      id: "llama-3.1-8b-instant",
      name: "Llama 3.1 8B",
      badge: "Recommended · Ultra Fast",
      desc: "Instantaneous responses (< 600ms) with high formatting accuracy.",
    },
    {
      id: "llama-3.3-70b-versatile",
      name: "Llama 3.3 70B",
      badge: "High Intelligence",
      desc: "Flagship open-weight intelligence for superior phrasing.",
    },
    {
      id: "mixtral-8x7b-32768",
      name: "Mixtral 8x7B",
      badge: "MoE 32k",
      desc: "Mixture-of-Experts architecture with 32k context window.",
    },
  ],
  openai: [
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      badge: "Recommended · Fast & Cheap",
      desc: "Smarter than GPT-3.5 Turbo at a fraction of the cost.",
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      badge: "Flagship Multimodal",
      desc: "Top-tier prose and executive resume tailoring.",
    },
    {
      id: "o3-mini",
      name: "o3-mini",
      badge: "STEM & Deep Logic",
      desc: "Optimized for deep technical problem solving and precision.",
    },
  ],
  ollama: [
    {
      id: "llama3",
      name: "Llama 3 (8B)",
      badge: "Recommended Default",
      desc: "Standard local model (run: ollama run llama3).",
    },
    {
      id: "llama3.2",
      name: "Llama 3.2 (3B)",
      badge: "Lightweight",
      desc: "Runs smoothly on laptops with limited RAM/VRAM.",
    },
    {
      id: "mistral",
      name: "Mistral 7B",
      badge: "Balanced",
      desc: "Classic open-weights model with punchy writing style.",
    },
    {
      id: "qwen2.5",
      name: "Qwen 2.5",
      badge: "High Precision",
      desc: "Strong multilingual & code logic comprehension.",
    },
  ],
};

export function AiSettingsModal({
  isOpen,
  onClose,
  config,
  onSave,
}: AiSettingsModalProps) {
  const [provider, setProvider] = useState<AiProvider>(config.provider || "gemini");
  const [apiKey, setApiKey] = useState(config.apiKey || "");
  const [selectedModel, setSelectedModel] = useState(
    config.model || PROVIDER_MODELS[config.provider || "gemini"][0].id
  );
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customModelText, setCustomModelText] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState(config.ollamaUrl || "http://localhost:11434");
  const [showKey, setShowKey] = useState(false);

  // Testing status
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  // Sync state when config changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const activeProvider = config.provider || "gemini";
      setProvider(activeProvider);
      setApiKey(config.apiKey || "");
      setOllamaUrl(config.ollamaUrl || "http://localhost:11434");

      const models = PROVIDER_MODELS[activeProvider];
      const matchingModel = models.find((m) => m.id === config.model);

      if (config.model && !matchingModel) {
        setIsCustomModel(true);
        setCustomModelText(config.model);
        setSelectedModel("custom");
      } else {
        setIsCustomModel(false);
        setCustomModelText("");
        setSelectedModel(config.model || models[0].id);
      }

      setTestStatus("idle");
      setTestMessage("");
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: AiProvider) => {
    setProvider(newProvider);
    setIsCustomModel(false);
    setCustomModelText("");
    setSelectedModel(PROVIDER_MODELS[newProvider][0].id);
    setTestStatus("idle");
    setTestMessage("");
  };

  const handleModelDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomModel(true);
      setSelectedModel("custom");
    } else {
      setIsCustomModel(false);
      setSelectedModel(val);
    }
    setTestStatus("idle");
  };

  const effectiveModel = isCustomModel ? customModelText.trim() : selectedModel;

  const handleTestConnection = async () => {
    setTestStatus("loading");
    setTestMessage("Testing connection...");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test-connection",
          provider,
          apiKey,
          model: effectiveModel,
          ollamaUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestStatus("success");
        setTestMessage("✓ Successfully connected!");
      } else {
        setTestStatus("error");
        setTestMessage(`✕ ${data.error || "Connection failed"}`);
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestMessage(`✕ ${err.message || "Network error"}`);
    }
  };

  const handleSave = () => {
    onSave({
      provider,
      apiKey: apiKey.trim(),
      model: effectiveModel,
      ollamaUrl: ollamaUrl.trim(),
    });
    onClose();
  };

  const currentModelObj = PROVIDER_MODELS[provider].find(
    (m) => m.id === selectedModel
  );

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] rounded-[6px] border border-[#DAD5C9] bg-[#FCFBF9] p-6 shadow-xl text-[#1C1D21] max-h-[92vh] overflow-y-auto"
        style={{
          boxShadow: "0 10px 30px rgba(28, 29, 33, 0.18), 0 1px 3px rgba(28, 29, 33, 0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#DAD5C9] pb-3 mb-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-[17px] font-bold text-[#28344E] tracking-[-0.01em]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              AI Assistant Settings
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-[3px] bg-[#FAFAF8] border border-[#DAD5C9] text-[#5B5F6B]">
              Stored Locally
            </span>
          </div>
          <p className="text-[12px] text-[#5B5F6B] mt-1 leading-snug">
            Configure your AI provider and preferred model for bullet rewriting, summary drafting, and job tailoring.
          </p>
        </div>

        {/* Provider Selection */}
        <div className="mb-4">
          <label className="block text-[11.5px] font-medium text-[#5B5F6B] mb-1.5">
            AI Provider
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "gemini", label: "Google Gemini", tag: "Free Tier Available" },
              { id: "groq", label: "Groq", tag: "Ultra Fast Inference" },
              { id: "openai", label: "OpenAI", tag: "GPT-4o & o3-mini" },
              { id: "ollama", label: "Ollama", tag: "100% Offline / Local" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderChange(p.id as AiProvider)}
                className={`flex flex-col items-start px-3 py-2 rounded-[4px] border text-left cursor-pointer transition-colors ${
                  provider === p.id
                    ? "border-[#28344E] bg-[#FAFAF8] text-[#28344E]"
                    : "border-[#DAD5C9] bg-white text-[#5B5F6B] hover:border-[#28344E]/50"
                }`}
              >
                <span className="text-[12.5px] font-semibold">{p.label}</span>
                <span className="text-[10.5px] opacity-80">{p.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Model Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11.5px] font-medium text-[#5B5F6B]">
              Model Selection
            </label>
            {currentModelObj?.badge && (
              <span className="text-[10.5px] text-[#28344E] font-medium bg-[#28344E]/5 px-2 py-0.5 rounded">
                {currentModelObj.badge}
              </span>
            )}
          </div>

          <select
            value={isCustomModel ? "custom" : selectedModel}
            onChange={handleModelDropdownChange}
            className="w-full box-border px-2.5 py-2 border border-[#DAD5C9] rounded-[3px] text-[13px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E]"
          >
            {PROVIDER_MODELS[provider].map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.badge || m.id}
              </option>
            ))}
            <option value="custom">Custom / Other Model Name...</option>
          </select>

          {isCustomModel && (
            <div className="mt-2">
              <input
                type="text"
                value={customModelText}
                onChange={(e) => {
                  setCustomModelText(e.target.value);
                  setTestStatus("idle");
                }}
                placeholder={
                  provider === "gemini"
                    ? "e.g. gemini-1.5-pro-latest"
                    : provider === "ollama"
                    ? "e.g. deepseek-r1:8b or phi4"
                    : "Enter custom model ID"
                }
                className="w-full box-border px-2.5 py-1.5 border border-[#DAD5C9] rounded-[3px] text-[12.5px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E] font-mono"
              />
            </div>
          )}

          {!isCustomModel && currentModelObj?.desc && (
            <p className="text-[11px] text-[#5B5F6B] mt-1.5 leading-snug">
              {currentModelObj.desc}
            </p>
          )}
        </div>

        {/* Provider Specific Inputs */}
        {provider !== "ollama" ? (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11.5px] font-medium text-[#5B5F6B]">
                {provider === "gemini"
                  ? "Gemini API Key"
                  : provider === "groq"
                  ? "Groq API Key"
                  : "OpenAI API Key"}
              </label>
              {provider === "gemini" && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#28344E] hover:underline font-medium"
                >
                  Get free key ↗
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus("idle");
                }}
                placeholder={
                  provider === "gemini"
                    ? "AIzaSy..."
                    : provider === "groq"
                    ? "gsk_..."
                    : "sk-..."
                }
                className="w-full box-border px-2.5 py-1.5 pr-14 border border-[#DAD5C9] rounded-[3px] text-[13px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#5B5F6B] hover:text-[#1C1D21] cursor-pointer bg-transparent border-none p-1"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-[11px] text-[#5B5F6B] mt-1">
              Your key is saved strictly in your browser&apos;s LocalStorage and is never shared with third parties.
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-[11.5px] font-medium text-[#5B5F6B] mb-1">
              Ollama Endpoint URL
            </label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => {
                setOllamaUrl(e.target.value);
                setTestStatus("idle");
              }}
              placeholder="http://localhost:11434"
              className="w-full box-border px-2.5 py-1.5 border border-[#DAD5C9] rounded-[3px] text-[13px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E]"
            />
            <p className="text-[11px] text-[#5B5F6B] mt-1">
              Make sure Ollama is running locally with your chosen model (e.g. <code className="bg-[#E9E7E1] px-1 py-0.5 rounded text-[10px]">ollama run {effectiveModel || "llama3"}</code>).
            </p>
          </div>
        )}

        {/* Test Connection Button & Status */}
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === "loading"}
            className="text-[12px] font-medium text-[#28344E] hover:underline cursor-pointer bg-transparent border-none p-0 disabled:opacity-50"
          >
            {testStatus === "loading" ? "Testing..." : "Test Connection"}
          </button>
          {testMessage && (
            <span
              className={`text-[11.5px] font-medium ${
                testStatus === "success" ? "text-emerald-700" : "text-[#9A5142]"
              }`}
            >
              {testMessage}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DAD5C9]">
          <button
            type="button"
            onClick={onClose}
            className="text-[12.5px] font-medium text-[#5B5F6B] hover:text-[#1C1D21] hover:underline px-3 py-1.5 cursor-pointer bg-transparent border-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-[3px] bg-[#28344E] px-4 py-2 text-[13px] font-semibold text-[#F3F2EF] hover:bg-[#1f293d] transition-colors cursor-pointer border-none shadow-xs"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
