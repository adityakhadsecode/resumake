"use client";

import React, { useState } from "react";
import { ResumeData } from "@/types/resume";
import { ResumeDesign } from "@/types/template";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { DesignToolbar } from "@/components/preview/DesignToolbar";

interface PreviewPaneProps {
  data: ResumeData;
  design: ResumeDesign;
  onUpdateDesign: (updates: Partial<ResumeDesign>) => void;
  onOpenTemplatePicker: () => void;
  onPrint: () => void;
}

export function PreviewPane({
  data,
  design,
  onUpdateDesign,
  onOpenTemplatePicker,
}: PreviewPaneProps) {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex h-full flex-col bg-[#E9E7E1]">
      {/* Live Design & Formatting Toolbar */}
      <DesignToolbar
        design={design}
        onUpdateDesign={onUpdateDesign}
        onOpenTemplatePicker={onOpenTemplatePicker}
      />

      {/* Minimal Top Control Bar */}
      <div className="no-print flex items-center justify-between px-6 py-2 border-b border-[#DAD5C9] bg-[#E9E7E1]/90">
        <span className="text-[11.5px] font-medium text-[#5B5F6B]">
          Live Vector Canvas (Letter / A4)
        </span>

        {/* Minimal Zoom Controls */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#5B5F6B]">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 10, 60))}
            disabled={zoom <= 60}
            className="px-2 py-0.5 rounded-[3px] hover:bg-[#DAD5C9]/60 disabled:opacity-30 cursor-pointer"
          >
            –
          </button>
          <span className="w-10 text-center font-medium select-none text-[#1C1D21]">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 10, 140))}
            disabled={zoom >= 140}
            className="px-2 py-0.5 rounded-[3px] hover:bg-[#DAD5C9]/60 disabled:opacity-30 cursor-pointer"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom(100)}
            className="ml-1 text-[11px] text-[#5B5F6B] hover:text-[#1C1D21] hover:underline cursor-pointer"
          >
            Fit
          </button>
        </div>
      </div>

      {/* Viewport Canvas */}
      <div className="flex-1 overflow-auto p-6 md:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.12s ease-out",
          }}
          className="w-full max-w-[640px]"
        >
          {/* Paper Sheet on Desk with authentic shadow */}
          <div
            style={{
              boxShadow:
                "0 1px 3px rgba(28,29,33,0.15), 0 1px 12px rgba(28,29,33,0.08)",
            }}
          >
            <TemplateRenderer data={data} design={design} />
          </div>
        </div>
      </div>
    </div>
  );
}
