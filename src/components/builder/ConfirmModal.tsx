"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Proceed",
  cancelLabel = "Cancel",
  isDestructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 select-none no-print animate-in fade-in duration-150">
      <div className="bg-[#FCFBF9] border border-[#DAD5C9] rounded-md shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#DAD5C9] bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#9A5142]">
            <AlertTriangle size={18} />
            <h3 className="text-[15px] font-semibold text-[#1C1D21]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#5B5F6B] hover:text-[#1C1D21] p-1 rounded hover:bg-black/5 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 text-[13px] text-[#2B2C30] leading-relaxed">
          {message}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#DAD5C9] bg-[#FAFAF8] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-[12.5px] font-medium text-[#5B5F6B] hover:text-[#1C1D21] transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-1.5 text-[12.5px] font-semibold rounded transition shadow-sm ${
              isDestructive
                ? "bg-[#9A5142] text-white hover:bg-[#834235]"
                : "bg-[#28344E] text-[#F3F2EF] hover:bg-[#1E273A]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
