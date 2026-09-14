"use client";

import React, { useState } from "react";
import { AiConfig, AiProvider } from "@/types/ai";

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AiConfig;
  onSave: (newConfig: Partial<AiConfig>) => void;
}

export function AiSettingsModal({
  isOpen,
  onClose,
  config,
  onSave,
}: AiSettingsModalProps) {
  const [provider, setProvider] = useState<AiProvider>(config.provider || "gemini");
  const [apiKey, setApiKey] = useState(config.apiKey || "");
  const [model, setModel] = useState(config.model || "");
  const [ollamaUrl, setOllamaUrl] = useState(config.ollamaUrl || "http://localhost:11434");
  const [showKey, setShowKey] = useState(false);

  // Testing status
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  if (!isOpen) return null;

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
          model,
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
      model: model.trim(),
      ollamaUrl: ollamaUrl.trim(),
    });
    onClose();
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-[6px] border border-[#DAD5C9] bg-[#FCFBF9] p-6 shadow-xl text-[#1C1D21]"
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
            Configure your AI provider to enable one-click bullet point rewriting and summary generation.
          </p>
        </div>

        {/* Provider Selection */}
        <div className="mb-4">
          <label className="block text-[11.5px] font-medium text-[#5B5F6B] mb-1.5">
            AI Provider
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "gemini", label: "Google Gemini", tag: "Free Tier" },
              { id: "groq", label: "Groq", tag: "Fast / Free" },
              { id: "openai", label: "OpenAI", tag: "GPT-4o" },
              { id: "ollama", label: "Ollama", tag: "100% Offline" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setProvider(p.id as AiProvider);
                  setTestStatus("idle");
                }}
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
                  className="text-[11px] text-[#28344E] hover:underline"
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
              Your key is saved in your browser&apos;s LocalStorage and is never shared or stored on any server.
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
              Make sure Ollama is running locally with your desired model (e.g. <code className="bg-[#E9E7E1] px-1 py-0.5 rounded text-[10px]">ollama run llama3</code>).
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
