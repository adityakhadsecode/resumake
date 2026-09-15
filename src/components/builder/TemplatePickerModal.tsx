"use client";

import React from "react";
import { TemplateId, TEMPLATE_CATALOG } from "@/types/template";
import { Check, X, Sparkles } from "lucide-react";

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTemplateId: TemplateId;
  onSelectTemplate: (id: TemplateId) => void;
}

export function TemplatePickerModal({
  isOpen,
  onClose,
  activeTemplateId,
  onSelectTemplate,
}: TemplatePickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-[#FCFBF9] border border-[#DAD5C9] rounded-[6px] w-full max-w-[840px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DAD5C9] bg-[#FAFAF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#28344E]/10 flex items-center justify-center text-[#28344E]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1C1D21] leading-tight">
                Curated Resume Templates
              </h2>
              <p className="text-[12px] text-[#5B5F6B] mt-0.5">
                All templates use 100% vector typography and pass standard ATS text extraction tests.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[4px] text-[#5B5F6B] hover:text-[#1C1D21] hover:bg-[#DAD5C9]/40 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Catalog Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATE_CATALOG.map((tmpl) => {
            const isSelected = activeTemplateId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  onSelectTemplate(tmpl.id);
                  onClose();
                }}
                className={`relative rounded-[6px] border p-4 cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? "border-[#28344E] bg-[#28344E]/[0.02] ring-1 ring-[#28344E] shadow-sm"
                    : "border-[#DAD5C9] bg-white hover:border-[#28344E]/50 hover:shadow-xs"
                }`}
              >
                {/* Active Pill Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#28344E] text-[#F3F2EF] text-[10.5px] font-semibold">
                    <Check className="w-3 h-3" /> Active
                  </div>
                )}

                <div>
                  {/* Category Chip */}
                  <div className="inline-block px-2 py-0.5 rounded text-[10.5px] font-semibold uppercase tracking-wider bg-[#EAE7DF] text-[#5B5F6B] mb-2.5">
                    {tmpl.badge}
                  </div>

                  {/* Template Title */}
                  <h3 className="text-[15px] font-bold text-[#1C1D21] m-0">
                    {tmpl.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-[12.5px] text-[#5B5F6B] mt-1 leading-normal">
                    {tmpl.tagline}
                  </p>

                  {/* Layout Visual Miniature Blueprint */}
                  <div className="my-3.5 p-3 rounded bg-[#FAF9F6] border border-[#EBE8E0] flex flex-col gap-1.5 pointer-events-none select-none">
                    {tmpl.id === "jakes" && (
                      <div className="space-y-1.5 opacity-75">
                        <div className="h-2 w-1/3 bg-[#28344E]/60 rounded-xs mx-auto" />
                        <div className="h-1 w-2/3 bg-[#DAD5C9] rounded-xs mx-auto" />
                        <div className="h-[1px] w-full bg-[#DAD5C9] my-1" />
                        <div className="h-1.5 w-1/4 bg-[#28344E]/40 rounded-xs" />
                        <div className="h-1 w-full bg-[#E5E2D9] rounded-xs" />
                        <div className="h-1 w-5/6 bg-[#E5E2D9] rounded-xs" />
                        <div className="h-[1px] w-full bg-[#DAD5C9] my-1" />
                        <div className="h-1.5 w-1/4 bg-[#28344E]/40 rounded-xs" />
                        <div className="h-1 w-full bg-[#E5E2D9] rounded-xs" />
                      </div>
                    )}

                    {tmpl.id === "modern-executive" && (
                      <div className="space-y-1.5 opacity-75">
                        <div className="h-1.5 w-full bg-[#28344E] rounded-xs mb-1" />
                        <div className="flex justify-between items-center">
                          <div className="h-2.5 w-1/3 bg-[#1C1D21]/80 rounded-xs" />
                          <div className="h-1 w-1/3 bg-[#DAD5C9] rounded-xs" />
                        </div>
                        <div className="flex items-center gap-1 my-1">
                          <div className="h-2 w-1 bg-[#28344E] rounded-xs" />
                          <div className="h-1.5 w-1/4 bg-[#28344E]/60 rounded-xs" />
                          <div className="h-[1px] flex-1 bg-[#DAD5C9]" />
                        </div>
                        <div className="h-1 w-full bg-[#E5E2D9] rounded-xs" />
                        <div className="h-1 w-4/5 bg-[#E5E2D9] rounded-xs" />
                      </div>
                    )}

                    {tmpl.id === "academic-cv" && (
                      <div className="space-y-1.5 opacity-75">
                        <div className="h-2 w-2/5 bg-[#28344E] rounded-xs mx-auto text-center" />
                        <div className="h-1 w-1/2 bg-[#DAD5C9] rounded-xs mx-auto" />
                        <div className="h-[1px] w-full bg-[#28344E]/30 my-1" />
                        <div className="h-1.5 w-1/3 bg-[#28344E]/50 rounded-xs" />
                        <div className="h-1 w-11/12 bg-[#E5E2D9] rounded-xs ml-2" />
                        <div className="h-1 w-3/4 bg-[#E5E2D9] rounded-xs ml-2" />
                        <div className="h-[1px] w-full bg-[#28344E]/30 my-1" />
                        <div className="h-1.5 w-1/3 bg-[#28344E]/50 rounded-xs" />
                        <div className="h-1 w-5/6 bg-[#E5E2D9] rounded-xs ml-2" />
                      </div>
                    )}

                    {tmpl.id === "two-column" && (
                      <div className="flex gap-2 opacity-75">
                        <div className="w-1/3 bg-[#EFECE6] p-1.5 rounded-xs space-y-1">
                          <div className="h-1.5 w-full bg-[#28344E]/50 rounded-xs" />
                          <div className="h-1 w-3/4 bg-[#DAD5C9] rounded-xs" />
                          <div className="h-1.5 w-full bg-[#28344E]/50 rounded-xs mt-2" />
                          <div className="h-1 w-5/6 bg-[#DAD5C9] rounded-xs" />
                          <div className="h-1 w-2/3 bg-[#DAD5C9] rounded-xs" />
                        </div>
                        <div className="w-2/3 space-y-1.5 py-1">
                          <div className="h-2.5 w-1/2 bg-[#1C1D21]/80 rounded-xs" />
                          <div className="h-1 w-full bg-[#E5E2D9] rounded-xs" />
                          <div className="h-1.5 w-1/3 bg-[#28344E]/60 rounded-xs mt-2" />
                          <div className="h-1 w-full bg-[#E5E2D9] rounded-xs" />
                          <div className="h-1 w-4/5 bg-[#E5E2D9] rounded-xs" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Recommendation */}
                <div className="pt-2 border-t border-[#F0ECE1] flex items-center justify-between text-[11.5px]">
                  <span className="text-[#888A93]">Recommended for:</span>
                  <span className="font-medium text-[#28344E] text-right truncate max-w-[200px]">
                    {tmpl.recommendedFor}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#DAD5C9] bg-[#FAFAF8] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-[3px] border border-[#DAD5C9] text-[12.5px] font-medium text-[#1C1D21] hover:bg-[#F3F2EF] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
