"use client";

import React, { useRef } from "react";
import { UploadCloud, Target, FileText, Code2 } from "lucide-react";
import { ExportMenu } from "./ExportMenu";

interface HeaderBarProps {
  activeMode: "form" | "latex";
  onModeChange: (mode: "form" | "latex") => void;
  onPrint: () => void;
  onReset: () => void;
  onClear: () => void;
  onExportJson: () => void;
  onExportTxt: () => void;
  onExportTex: () => void;
  onExportDocx: () => void;
  onExportLatexPdf: () => void;
  isCompilingLatex?: boolean;
  onImportJSON: (data: any) => boolean;
  onOpenAiSettings: () => void;
  onOpenImportModal: () => void;
  onOpenTailorModal: () => void;
  isAiConfigured: boolean;
  lastSaved: Date | null;
}

export function HeaderBar({
  activeMode,
  onModeChange,
  onPrint,
  onReset,
  onClear,
  onExportJson,
  onExportTxt,
  onExportTex,
  onExportDocx,
  onExportLatexPdf,
  isCompilingLatex = false,
  onImportJSON,
  onOpenAiSettings,
  onOpenImportModal,
  onOpenTailorModal,
  isAiConfigured,
  lastSaved,
}: HeaderBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const success = onImportJSON(json);
        if (!success) {
          alert("Invalid resume JSON format.");
        }
      } catch (err) {
        alert("Could not parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="no-print flex items-center justify-between px-7 py-3.5 border-b border-[#DAD5C9] bg-[#FAFAF8] select-none">
      {/* Left: Brand Title & Mode Switcher */}
      <div className="flex items-center gap-6">
        <div>
          <div className="text-[17px] font-semibold tracking-[-0.01em] text-[#1C1D21]">
            Resume Builder
          </div>
          <div className="text-[12px] text-[#5B5F6B] mt-0.5">
            Free. No account, no watermark.
          </div>
        </div>

        {/* View Mode Switcher (Form vs LaTeX) */}
        <div className="hidden md:flex items-center p-0.5 rounded-[4px] bg-[#E9E7E1] border border-[#DAD5C9]/80 text-[12px] font-medium">
          <button
            type="button"
            onClick={() => onModeChange("form")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
              activeMode === "form"
                ? "bg-[#FCFBF9] text-[#28344E] font-semibold shadow-xs"
                : "text-[#5B5F6B] hover:text-[#1C1D21]"
            }`}
          >
            <FileText size={13} />
            <span>Form</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("latex")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] transition-colors cursor-pointer ${
              activeMode === "latex"
                ? "bg-[#FCFBF9] text-[#28344E] font-semibold shadow-xs"
                : "text-[#5B5F6B] hover:text-[#1C1D21]"
            }`}
          >
            <Code2 size={13} />
            <span>LaTeX</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {lastSaved && (
          <span className="hidden lg:inline text-[11.5px] text-[#5B5F6B] mr-1">
            Auto-saved
          </span>
        )}

        {/* Sample Data */}
        <button
          type="button"
          onClick={onReset}
          className="text-[12.5px] font-medium text-[#28344E] hover:underline cursor-pointer px-1.5 py-1"
        >
          Sample
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to clear all resume fields?")) {
              onClear();
            }
          }}
          className="text-[12.5px] text-[#9A5142] hover:underline cursor-pointer px-1.5 py-1"
        >
          Clear
        </button>

        {/* Import Resume */}
        <button
          type="button"
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#28344E] hover:underline cursor-pointer px-1.5 py-1"
          title="Import resume from PDF, Word (.docx), text, or JSON"
        >
          <UploadCloud size={14} className="text-[#28344E]" />
          <span className="hidden sm:inline">Import</span>
        </button>

        {/* Tailor to Job */}
        <button
          type="button"
          onClick={onOpenTailorModal}
          className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#28344E] hover:underline cursor-pointer px-1.5 py-1"
          title="Tailor resume to a target job description"
        >
          <Target size={14} className="text-[#28344E]" />
          <span className="hidden sm:inline">Tailor to Job</span>
        </button>

        {/* AI Setup */}
        <button
          type="button"
          onClick={onOpenAiSettings}
          className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#28344E] hover:underline cursor-pointer px-1.5 py-1"
          title="Configure AI API key (Gemini / OpenAI / Groq / Ollama)"
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isAiConfigured ? "bg-emerald-600" : "bg-[#DAD5C9]"
            }`}
          />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Multi-Format Export Menu */}
        <div className="ml-1">
          <ExportMenu
            onPrint={onPrint}
            onExportJson={onExportJson}
            onExportTxt={onExportTxt}
            onExportTex={onExportTex}
            onExportDocx={onExportDocx}
            onExportLatexPdf={onExportLatexPdf}
            isCompilingLatex={isCompilingLatex}
          />
        </div>
      </div>
    </header>
  );
}
