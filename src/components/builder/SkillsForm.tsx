"use client";

import React from "react";
import { SkillCategory } from "@/types/resume";
import { Field, SectionHeader } from "./Field";

interface SkillsFormProps {
  items: SkillCategory[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof SkillCategory, value: string) => void;
  onRemove: (id: string) => void;
}

export function SkillsForm({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: SkillsFormProps) {
  return (
    <div>
      <SectionHeader
        action={
          <button
            type="button"
            onClick={onAdd}
            className="text-[12.5px] font-semibold text-[#28344E] cursor-pointer hover:underline bg-transparent border-none p-0"
          >
            + Add category
          </button>
        }
      >
        Skills
      </SectionHeader>

      {items.map((cat) => (
        <div
          key={cat.id}
          className="border border-[#DAD5C9] rounded-[4px] p-3.5 mb-3.5 bg-[#FCFBF9]"
        >
          <div className="flex gap-3 items-start">
            <div className="w-1/3">
              <Field
                label="Category"
                value={cat.category}
                onChange={(v) => onUpdate(cat.id, "category", v)}
                placeholder="Languages"
              />
            </div>
            <div className="flex-1">
              <Field
                label="Comma-separated skills"
                value={cat.skills}
                onChange={(v) => onUpdate(cat.id, "skills", v)}
                placeholder="Figma, Design Systems, HTML/CSS, React"
              />
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => onRemove(cat.id)}
                className="text-[12px] text-[#9A5142] hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
