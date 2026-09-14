"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  FileText,
  FileCode,
  FileCheck,
  FileDown,
  Printer,
  Globe,
  Check,
  Download,
  Loader2,
} from "lucide-react";

interface ExportMenuProps {
  onPrint: () => void;
  onExportJson: () => void;
  onExportTxt: () => void;
  onExportTex: () => void;
  onExportDocx: () => void;
  onExportLatexPdf: () => void;
  isCompilingLatex?: boolean;
}

export function ExportMenu({
  onPrint,
  onExportJson,
  onExportTxt,
  onExportTex,
  onExportDocx,
  onExportLatexPdf,
  isCompilingLatex = false,
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left select-none" ref={menuRef}>
      {/* Primary Action Button + Dropdown Trigger */}
      <div className="inline-flex rounded-[3px] shadow-xs">
        {/* Fast Print PDF Action (Default) */}
        <button
          type="button"
          onClick={onPrint}
          className="bg-[#28344E] text-[#F3F2EF] px-3.5 py-2 text-[13px] font-semibold cursor-pointer hover:bg-[#1f293d] transition-colors rounded-l-[3px] border-r border-[#1a2336]"
          title="Fast print-ready vector PDF"
        >
          Download PDF
        </button>

        {/* Dropdown Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#28344E] text-[#F3F2EF] px-2 py-2 text-[13px] cursor-pointer hover:bg-[#1f293d] transition-colors rounded-r-[3px]"
          title="More export formats (DOCX, LaTeX, TXT, JSON)"
        >
          <ChevronDown size={15} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-72 rounded-[4px] border border-[#DAD5C9] bg-[#FCFBF9] shadow-xl py-1.5 z-50 animate-in fade-in duration-100">
          <div className="px-3 py-1.5 border-b border-[#DAD5C9]/80 mb-1">
            <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#5B5F6B]">
              Export Options
            </span>
          </div>

          {/* 1. PDF (Print Engine) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onPrint();
            }}
            className="w-full text-left px-3.5 py-2 text-[12.5px] text-[#1C1D21] hover:bg-[#F3F2EF] flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Printer size={15} className="text-[#28344E]" />
              <div>
                <div className="font-semibold text-[#1C1D21] leading-none">
                  PDF (Print)
                </div>
                <div className="text-[11px] text-[#5B5F6B] mt-0.5">
                  Instant ATS vector document
                </div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Offline
            </span>
          </button>

          {/* 2. PDF (LaTeX Engine) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportLatexPdf();
            }}
            disabled={isCompilingLatex}
            className="w-full text-left px-3.5 py-2 text-[12.5px] text-[#1C1D21] hover:bg-[#F3F2EF] flex items-center justify-between group transition-colors cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              {isCompilingLatex ? (
                <Loader2 size={15} className="animate-spin text-[#28344E]" />
              ) : (
                <Globe size={15} className="text-[#28344E]" />
              )}
              <div>
                <div className="font-semibold text-[#1C1D21] leading-none">
                  PDF (LaTeX, Tectonic)
                </div>
                <div className="text-[11px] text-[#5B5F6B] mt-0.5">
                  Typeset via Tectonic compiler
                </div>
              </div>
            </div>
            <span className="text-[10px] text-[#28344E] bg-[#28344E]/10 border border-[#28344E]/20 px-1.5 py-0.5 rounded">
              Requires Server
            </span>
          </button>

          {/* 3. Word Document (.docx) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportDocx();
            }}
            className="w-full text-left px-3.5 py-2 text-[12.5px] text-[#1C1D21] hover:bg-[#F3F2EF] flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={15} className="text-[#28344E]" />
              <div>
                <div className="font-semibold text-[#1C1D21] leading-none">
                  Word Document (.docx)
                </div>
                <div className="text-[11px] text-[#5B5F6B] mt-0.5">
                  Editable Microsoft Word file
                </div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Offline
            </span>
          </button>

          {/* 4. LaTeX Source (.tex) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportTex();
            }}
            className="w-full text-left px-3.5 py-2 text-[12.5px] text-[#1C1D21] hover:bg-[#F3F2EF] flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileCode size={15} className="text-[#28344E]" />
              <div>
                <div className="font-semibold text-[#1C1D21] leading-none">
                  LaTeX Source (.tex)
                </div>
                <div className="text-[11px] text-[#5B5F6B] mt-0.5">
                  Overleaf-ready standalone source
                </div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Offline
            </span>
          </button>

          {/* 5. Plain Text (.txt) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportTxt();
            }}
            className="w-full text-left px-3.5 py-2 text-[12.5px] text-[#1C1D21] hover:bg-[#F3F2EF] flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileCheck size={15} className="text-[#28344E]" />
              <div>
                <div className="font-semibold text-[#1C1D21] leading-none">
                  Plain Text (.txt)
                </div>
                <div className="text-[11px] text-[#5B5F6B] mt-0.5">
                  Clean ASCII text for ATS portals
                </div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Offline
            </span>
          </button>

          {/* 6. Data Backup (.json) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportJson();
            }}
            className="w-full text-left px-3.5 py-2 text-[12.5px] text-[#1C1D21] hover:bg-[#F3F2EF] flex items-center justify-between group transition-colors cursor-pointer border-t border-[#DAD5C9]/80 mt-1 pt-2"
          >
            <div className="flex items-center gap-2.5">
              <Download size={15} className="text-[#5B5F6B]" />
              <div>
                <div className="font-semibold text-[#1C1D21] leading-none">
                  JSON Backup (.json)
                </div>
                <div className="text-[11px] text-[#5B5F6B] mt-0.5">
                  Full data structure restore file
                </div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Offline
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
