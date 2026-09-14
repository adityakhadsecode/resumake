"use client";

import React from "react";
import { Field } from "./Field";

interface SummaryFormProps {
  value: string;
  onChange: (value: string) => void;
  onGenerateAi?: () => void;
  isGenerating?: boolean;
}

export function SummaryForm({
  value,
  onChange,
  onGenerateAi,
  isGenerating = false,
}: SummaryFormProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11.5px] text-[#5B5F6B] font-medium select-none">
          A few sentences on who you are
        </span>
        {onGenerateAi && (
          <button
            type="button"
            onClick={onGenerateAi}
            disabled={isGenerating}
            className="text-[11.5px] font-semibold text-[#28344E] hover:underline cursor-pointer bg-transparent border-none p-0 disabled:opacity-50"
          >
            {isGenerating ? "Drafting with AI..." : "✨ Draft with AI"}
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Product designer with 5 years shipping consumer web and mobile products end to end, from research through high-fidelity UI..."
        className="w-full box-border px-2.5 py-2 border border-[#DAD5C9] rounded-[3px] text-[13.5px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E] transition-colors resize-y leading-relaxed font-sans"
      />
    </div>
  );
}
