"use client";

import React, { useState } from "react";

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PrintModal({ isOpen, onClose, onConfirm }: PrintModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem("antislop_skip_print_guidance", "true");
      } catch (e) {
        // ignore storage errors
      }
    }
    onConfirm();
    onClose();
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.45)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-[6px] border border-[#DAD5C9] bg-[#FCFBF9] p-6 shadow-xl"
        style={{
          boxShadow: "0 10px 30px rgba(28, 29, 33, 0.18), 0 1px 3px rgba(28, 29, 33, 0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[#DAD5C9] pb-3 mb-4">
          <h3
            className="text-[17px] font-bold text-[#28344E] tracking-[-0.01em]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            One-Time Print Setup
          </h3>
          <p className="text-[12.5px] text-[#5B5F6B] mt-1 leading-snug">
            In the browser print preview window, verify these 2 settings under{" "}
            <span className="font-semibold text-[#1C1D21]">More settings</span>:
          </p>
        </div>

        {/* Setting Checkpoints */}
        <div className="space-y-3 mb-5">
          {/* Item 1 */}
          <div className="flex items-start gap-3 rounded-[4px] border border-[#DAD5C9] bg-[#FAFAF8] p-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#28344E] text-[11px] font-bold text-[#F3F2EF]">
              1
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#1C1D21]">
                Uncheck &ldquo;Headers and footers&rdquo;
              </div>
              <p className="text-[11.5px] text-[#5B5F6B] mt-0.5 leading-relaxed">
                Removes the browser date, page title, URL, and page counter for a clean printed document.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3 rounded-[4px] border border-[#DAD5C9] bg-[#FAFAF8] p-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#28344E] text-[11px] font-bold text-[#F3F2EF]">
              2
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#1C1D21]">
                Check &ldquo;Background graphics&rdquo;
              </div>
              <p className="text-[11.5px] text-[#5B5F6B] mt-0.5 leading-relaxed">
                Ensures all hairline dividing rules and ink tones are preserved in the PDF output.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[#DAD5C9]">
          <label className="flex items-center gap-2 text-[12px] text-[#5B5F6B] cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-[#DAD5C9] text-[#28344E] focus:ring-0"
            />
            <span>Don&rsquo;t show this reminder again</span>
          </label>

          <div className="flex items-center justify-end gap-2.5 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-[12.5px] font-medium text-[#5B5F6B] hover:text-[#1C1D21] hover:underline px-3 py-1.5 cursor-pointer bg-transparent border-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-[3px] bg-[#28344E] px-4 py-2 text-[13px] font-semibold text-[#F3F2EF] hover:bg-[#1f293d] transition-colors cursor-pointer border-none shadow-xs"
            >
              Open Print Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
