import React from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "textarea" | "email" | "tel";
  rows?: number;
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  rows = 3,
}: FieldProps) {
  return (
    <label className="block mb-3">
      <span className="block text-[11.5px] text-[#5B5F6B] mb-1 font-medium select-none">
        {label}
      </span>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full box-border px-2.5 py-2 border border-[#DAD5C9] rounded-[3px] text-[13.5px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E] transition-colors resize-y leading-relaxed font-sans"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full box-border px-2.5 py-2 border border-[#DAD5C9] rounded-[3px] text-[13.5px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E] transition-colors font-sans"
        />
      )}
    </label>
  );
}

interface SectionHeaderProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionHeader({ children, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between text-[12px] font-bold text-[#28344E] uppercase tracking-[0.06em] mt-6 mb-3 pb-1.5 border-b border-[#DAD5C9]">
      <span>{children}</span>
      {action}
    </div>
  );
}
