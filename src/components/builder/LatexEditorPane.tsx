"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileCode,
  FileDown,
} from "lucide-react";

interface LatexEditorPaneProps {
  texCode: string;
  isDirty: boolean;
  onTexChange: (newCode: string) => void;
  onRecompile: () => void;
  onResetFromForm: () => void;
  onDownloadTex: () => void;
  onDownloadCompiledPdf: () => void;
  isCompiling: boolean;
  compileError: { error: string; stderr: string } | null;
  hasCompiledPdf: boolean;
}

export function LatexEditorPane({
  texCode,
  isDirty,
  onTexChange,
  onRecompile,
  onResetFromForm,
  onDownloadTex,
  onDownloadCompiledPdf,
  isCompiling,
  compileError,
  hasCompiledPdf,
}: LatexEditorPaneProps) {
  const [isErrorDrawerOpen, setIsErrorDrawerOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#FCFBF9] border-r border-[#DAD5C9]">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#DAD5C9] bg-[#FAFAF8] select-none">
        <div className="flex items-center gap-2">
          {/* Recompile Button */}
          <button
            type="button"
            onClick={onRecompile}
            disabled={isCompiling}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#28344E] text-[#F3F2EF] hover:bg-[#1E273A] disabled:opacity-50 text-[12.5px] font-semibold rounded-[3px] transition shadow-xs cursor-pointer"
            title="Compile LaTeX source with Tectonic"
          >
            {isCompiling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Play size={13} className="fill-current" />
            )}
            <span>{isCompiling ? "Compiling..." : "Recompile"}</span>
          </button>

          {/* Sync from Form */}
          <button
            type="button"
            onClick={onResetFromForm}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-[#5B5F6B] hover:text-[#1C1D21] border border-[#DAD5C9] hover:bg-white rounded-[3px] transition cursor-pointer"
            title="Regenerate LaTeX source from current form data"
          >
            <RotateCcw size={12} />
            <span>Sync from Form</span>
          </button>

          {/* Dirty Indicator */}
          {isDirty && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-[3px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Manual Edits
            </span>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Status message */}
          {compileError ? (
            <button
              type="button"
              onClick={() => setIsErrorDrawerOpen(!isErrorDrawerOpen)}
              className="flex items-center gap-1 text-[11.5px] font-medium text-[#9A5142] hover:underline cursor-pointer"
            >
              <AlertCircle size={13} />
              <span>Compile Error</span>
            </button>
          ) : hasCompiledPdf ? (
            <span className="hidden sm:flex items-center gap-1 text-[11.5px] font-medium text-emerald-700">
              <CheckCircle2 size={13} />
              <span>Clean</span>
            </span>
          ) : null}

          {/* Download Source */}
          <button
            type="button"
            onClick={onDownloadTex}
            className="flex items-center gap-1 text-[12px] text-[#5B5F6B] hover:text-[#1C1D21] px-2 py-1 cursor-pointer"
            title="Download raw .tex file"
          >
            <FileCode size={13} />
            <span>.tex</span>
          </button>

          {/* Download PDF via LaTeX */}
          <button
            type="button"
            onClick={onDownloadCompiledPdf}
            disabled={isCompiling}
            className="flex items-center gap-1 text-[12px] font-medium text-[#28344E] hover:underline px-2 py-1 cursor-pointer disabled:opacity-50"
            title="Download compiled LaTeX PDF"
          >
            <FileDown size={13} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        <Editor
          height="100%"
          language="latex"
          value={texCode}
          onChange={(value) => onTexChange(value || "")}
          options={{
            lineNumbers: "on",
            minimap: { enabled: false },
            wordWrap: "on",
            fontSize: 12.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            tabSize: 2,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            renderLineHighlight: "all",
          }}
          loading={
            <div className="flex items-center justify-center h-full text-[12px] text-[#5B5F6B]">
              <Loader2 size={18} className="animate-spin mr-2" />
              Loading LaTeX Editor...
            </div>
          }
        />
      </div>

      {/* Overleaf-like Collapsible Inline Error Drawer */}
      {compileError && (
        <div className="border-t border-[#DAD5C9] bg-[#FCEDEA] flex flex-col max-h-[40%] transition-all">
          <div
            onClick={() => setIsErrorDrawerOpen(!isErrorDrawerOpen)}
            className="px-4 py-2 bg-[#F7DDD7] border-b border-[#F0BCB4] flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-[#9A5142] text-[12px] font-semibold">
              <AlertCircle size={14} />
              <span>{compileError.error}</span>
            </div>
            <button className="text-[#9A5142] p-0.5">
              {isErrorDrawerOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {isErrorDrawerOpen && (
            <div className="p-3 overflow-y-auto font-mono text-[11px] text-[#7A3628] whitespace-pre-wrap leading-relaxed max-h-48 bg-[#FCEDEA]">
              {compileError.stderr}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
