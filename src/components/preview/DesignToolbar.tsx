"use client";

import React, { useState } from "react";
import {
  ResumeDesign,
  FontFamily,
  SpacingDensity,
  FontScale,
  FONT_OPTIONS,
  ACCENT_COLOR_OPTIONS,
  TEMPLATE_CATALOG,
} from "@/types/template";
import { LayoutTemplate, Palette, Type, Sliders, ChevronDown } from "lucide-react";

interface DesignToolbarProps {
  design: ResumeDesign;
  onUpdateDesign: (updates: Partial<ResumeDesign>) => void;
  onOpenTemplatePicker: () => void;
}

export function DesignToolbar({
  design,
  onUpdateDesign,
  onOpenTemplatePicker,
}: DesignToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeTemplate =
    TEMPLATE_CATALOG.find((t) => t.id === design.templateId) || TEMPLATE_CATALOG[0];

  return (
    <div className="no-print bg-[#FAFAF8] border-b border-[#DAD5C9] px-4 py-2 text-[#1C1D21] transition-all">
      {/* Top Bar Summary / Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Template Quick Button */}
        <button
          type="button"
          onClick={onOpenTemplatePicker}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] border border-[#DAD5C9] bg-white hover:bg-[#F3F2EF] text-[12px] font-medium text-[#1C1D21] cursor-pointer transition-colors shadow-2xs"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-[#28344E]" />
          <span>Template:</span>
          <span className="font-bold text-[#28344E]">{activeTemplate.name}</span>
          <span className="text-[10px] text-[#888A93] uppercase font-semibold ml-1 bg-[#EAE7DF] px-1.5 py-0.5 rounded">
            Change
          </span>
        </button>

        {/* Formatting & Design Toggle Button */}
        <div className="flex items-center gap-2">
          {/* Quick Color Swatches */}
          <div className="hidden sm:flex items-center gap-1.5 border-r border-[#DAD5C9] pr-3 mr-1">
            <Palette className="w-3.5 h-3.5 text-[#888A93] mr-0.5" />
            {ACCENT_COLOR_OPTIONS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => onUpdateDesign({ accentColor: c.hex })}
                title={c.name}
                className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                  design.accentColor.toLowerCase() === c.hex.toLowerCase()
                    ? "ring-2 ring-offset-1 ring-[#1C1D21] scale-110"
                    : "hover:scale-105 opacity-85"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Expand Advanced Controls Drawer */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-2 py-1 rounded-[3px] text-[11.5px] font-medium border cursor-pointer transition-colors ${
              isOpen
                ? "bg-[#28344E] text-white border-[#28344E]"
                : "bg-white text-[#5B5F6B] border-[#DAD5C9] hover:text-[#1C1D21]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Format & Styling</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Collapsible Design & Formatting Drawer */}
      {isOpen && (
        <div className="mt-2.5 pt-2.5 border-t border-[#E8E5DC] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-100">
          {/* 1. Typography Selector */}
          <div>
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#5B5F6B] flex items-center gap-1 mb-1">
              <Type className="w-3 h-3" /> Typography
            </label>
            <select
              value={design.fontFamily}
              onChange={(e) => onUpdateDesign({ fontFamily: e.target.value as FontFamily })}
              className="w-full text-[12px] bg-white border border-[#DAD5C9] rounded-[3px] px-2 py-1 text-[#1C1D21] focus:outline-hidden focus:border-[#28344E] cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.styleName})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Accent Color Palette & Hex Picker */}
          <div>
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#5B5F6B] flex items-center gap-1 mb-1">
              <Palette className="w-3 h-3" /> Accent Color
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {ACCENT_COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onUpdateDesign({ accentColor: c.hex })}
                    title={c.name}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                      design.accentColor.toLowerCase() === c.hex.toLowerCase()
                        ? "ring-2 ring-offset-1 ring-[#1C1D21] scale-110"
                        : "hover:scale-105 opacity-85"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={design.accentColor}
                onChange={(e) => onUpdateDesign({ accentColor: e.target.value })}
                title="Custom color"
                className="w-6 h-6 p-0 border border-[#DAD5C9] rounded cursor-pointer bg-transparent"
              />
            </div>
          </div>

          {/* 3. Page Density & Margins (1-Page Fit Solution) */}
          <div>
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#5B5F6B] flex items-center justify-between mb-1">
              <span>Page Density</span>
              <span className="text-[9.5px] text-[#888A93] font-normal lowercase">1-page fit</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#EBE8E0] p-0.5 rounded-[3px]">
              {(["compact", "normal", "spacious"] as SpacingDensity[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onUpdateDesign({ density: d })}
                  className={`py-1 text-[11px] font-medium capitalize rounded-[2px] transition-all cursor-pointer ${
                    design.density === d
                      ? "bg-white text-[#1C1D21] shadow-2xs font-bold"
                      : "text-[#5B5F6B] hover:text-[#1C1D21]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Font Scaling */}
          <div>
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#5B5F6B] flex items-center justify-between mb-1">
              <span>Scale & Size</span>
              <span className="text-[9.5px] text-[#888A93] font-normal lowercase">proportional</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#EBE8E0] p-0.5 rounded-[3px]">
              {[
                { id: "small", label: "90%" },
                { id: "normal", label: "100%" },
                { id: "large", label: "108%" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onUpdateDesign({ fontScale: s.id as FontScale })}
                  className={`py-1 text-[11px] font-medium rounded-[2px] transition-all cursor-pointer ${
                    design.fontScale === s.id
                      ? "bg-white text-[#1C1D21] shadow-2xs font-bold"
                      : "text-[#5B5F6B] hover:text-[#1C1D21]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
