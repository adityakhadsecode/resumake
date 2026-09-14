"use client";

import React, { useState, useEffect } from "react";

interface AiDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  enhancedText: string;
  title?: string;
  onApply: (newText: string) => void;
}

export function AiDiffModal({
  isOpen,
  onClose,
  originalText,
  enhancedText,
  title = "AI Highlight Enhancements",
  onApply,
}: AiDiffModalProps) {
  const [editedText, setEditedText] = useState(enhancedText);

  useEffect(() => {
    setEditedText(enhancedText);
  }, [enhancedText]);

  if (!isOpen) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] rounded-[6px] border border-[#DAD5C9] bg-[#FCFBF9] p-6 shadow-xl text-[#1C1D21] max-h-[90vh] flex flex-col"
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
              {title}
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-[3px] bg-[#28344E]/10 text-[#28344E] font-medium">
              Google XYZ Formula
            </span>
          </div>
          <p className="text-[12px] text-[#5B5F6B] mt-1">
            Review the rewritten highlights with active verbs and quantified impact. You can tweak the text below before applying.
          </p>
        </div>

        {/* Content Comparison */}
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Original */}
          <div>
            <span className="block text-[11px] font-semibold text-[#5B5F6B] uppercase tracking-[0.05em] mb-1">
              Original
            </span>
            <div className="rounded-[4px] border border-[#DAD5C9] bg-[#F3F2EF] p-3 text-[12px] text-[#5B5F6B] whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto">
              {originalText || "(No original text)"}
            </div>
          </div>

          {/* Enhanced Editable */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="block text-[11px] font-semibold text-[#28344E] uppercase tracking-[0.05em]">
                AI-Enhanced Result (Editable)
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                ✓ Ready to apply
              </span>
            </div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={6}
              className="w-full box-border px-3 py-2.5 border border-[#28344E]/40 rounded-[3px] text-[13px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E] leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#DAD5C9] mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[12.5px] font-medium text-[#5B5F6B] hover:text-[#1C1D21] hover:underline px-3 py-1.5 cursor-pointer bg-transparent border-none"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(editedText);
              onClose();
            }}
            className="rounded-[3px] bg-[#28344E] px-4 py-2 text-[13px] font-semibold text-[#F3F2EF] hover:bg-[#1f293d] transition-colors cursor-pointer border-none shadow-xs"
          >
            Apply to Resume
          </button>
        </div>
      </div>
    </div>
  );
}
