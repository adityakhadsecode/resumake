"use client";

import React, { useRef } from "react";

interface HeaderBarProps {
  onPrint: () => void;
  onReset: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  onImportJSON: (data: any) => boolean;
  lastSaved: Date | null;
}

export function HeaderBar({
  onPrint,
  onReset,
  onClear,
  onExportJSON,
  onImportJSON,
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
    <header className="no-print flex items-center justify-between px-7 py-4 border-b border-[#DAD5C9] bg-[#FAFAF8] select-none">
      {/* Brand Title & Tagline */}
      <div>
        <div className="text-[17px] font-semibold tracking-[-0.01em] text-[#1C1D21]">
          Resume Builder
        </div>
        <div className="text-[12.5px] text-[#5B5F6B] mt-0.5">
          Free. No account, no watermark.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {lastSaved && (
          <span className="hidden sm:inline text-[11.5px] text-[#5B5F6B] mr-2">
            Auto-saved
          </span>
        )}

        {/* Sample Data */}
        <button
          type="button"
          onClick={onReset}
          className="text-[12.5px] font-medium text-[#28344E] hover:underline cursor-pointer px-2 py-1"
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
          className="text-[12.5px] text-[#9A5142] hover:underline cursor-pointer px-2 py-1"
        >
          Clear
        </button>

        {/* Export JSON */}
        <button
          type="button"
          onClick={onExportJSON}
          className="text-[12.5px] text-[#5B5F6B] hover:text-[#1C1D21] hover:underline cursor-pointer px-2 py-1"
          title="Backup as JSON"
        >
          Export JSON
        </button>

        {/* Import JSON */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[12.5px] text-[#5B5F6B] hover:text-[#1C1D21] hover:underline cursor-pointer px-2 py-1"
          title="Restore from JSON"
        >
          Import JSON
        </button>

        {/* Primary Download PDF */}
        <button
          type="button"
          onClick={onPrint}
          className="bg-[#28344E] text-[#F3F2EF] border-none rounded-[3px] px-4 py-2 text-[13.5px] font-semibold cursor-pointer hover:bg-[#1f293d] transition-colors ml-1"
        >
          Download PDF
        </button>
      </div>
    </header>
  );
}
