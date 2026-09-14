"use client";

import React from "react";
import { ExperienceItem } from "@/types/resume";
import { Field, SectionHeader } from "./Field";

interface ExperienceFormProps {
  items: ExperienceItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof ExperienceItem, value: any) => void;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onImproveWithAi?: (item: ExperienceItem) => void;
  activeEnhanceId?: string | null;
}

export function ExperienceForm({
  items,
  onAdd,
  onUpdate,
  onRemove,
  onMove,
  onImproveWithAi,
  activeEnhanceId,
}: ExperienceFormProps) {
  return (
    <div>
      <SectionHeader
        action={
          <button
            type="button"
            onClick={onAdd}
            className="text-[12.5px] font-semibold text-[#28344E] cursor-pointer hover:underline bg-transparent border-none p-0"
          >
            + Add role
          </button>
        }
      >
        Experience
      </SectionHeader>

      {items.map((exp, index) => {
        const isEnhancing = activeEnhanceId === exp.id;

        return (
          <div
            key={exp.id}
            className="border border-[#DAD5C9] rounded-[4px] p-3.5 mb-3.5 bg-[#FCFBF9]"
          >
            <div className="flex gap-3 items-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                <Field
                  label="Role"
                  value={exp.role}
                  onChange={(v) => onUpdate(exp.id, "role", v)}
                  placeholder="Senior Product Designer"
                />
                <Field
                  label="Company"
                  value={exp.company}
                  onChange={(v) => onUpdate(exp.id, "company", v)}
                  placeholder="Lumen Health"
                />
              </div>

              <div className="flex flex-col items-end gap-1 mt-5">
                <button
                  type="button"
                  onClick={() => onRemove(exp.id)}
                  className="text-[12px] text-[#9A5142] hover:underline cursor-pointer bg-transparent border-none whitespace-nowrap p-0"
                >
                  Remove
                </button>

                <div className="flex items-center gap-1 mt-1 text-[11px] text-[#5B5F6B]">
                  <button
                    type="button"
                    onClick={() => onMove(index, index - 1)}
                    disabled={index === 0}
                    className="hover:text-[#1C1D21] disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => onMove(index, index + 1)}
                    disabled={index === items.length - 1}
                    className="hover:text-[#1C1D21] disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field
                label="Location"
                value={exp.location}
                onChange={(v) => onUpdate(exp.id, "location", v)}
                placeholder="Austin, TX or Remote"
              />
              <Field
                label="Start"
                value={exp.startDate}
                onChange={(v) => onUpdate(exp.id, "startDate", v)}
                placeholder="2022"
              />
              <Field
                label="End"
                value={exp.endDate}
                onChange={(v) => onUpdate(exp.id, "endDate", v)}
                placeholder="Present"
              />
            </div>

            {/* Highlights with AI Action */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11.5px] text-[#5B5F6B] font-medium select-none">
                  Highlights (one per line)
                </span>
                {onImproveWithAi && (
                  <button
                    type="button"
                    onClick={() => onImproveWithAi(exp)}
                    disabled={isEnhancing || !exp.bullets.trim()}
                    className="text-[11.5px] font-semibold text-[#28344E] hover:underline cursor-pointer bg-transparent border-none p-0 disabled:opacity-40"
                    title="Rewrite bullets with strong action verbs & Google XYZ formula"
                  >
                    {isEnhancing ? "Enhancing..." : "✨ Improve with AI"}
                  </button>
                )}
              </div>
              <textarea
                value={exp.bullets}
                onChange={(e) => onUpdate(exp.id, "bullets", e.target.value)}
                rows={3}
                placeholder="Led redesign of the patient intake flow, cutting drop-off by 24%..."
                className="w-full box-border px-2.5 py-2 border border-[#DAD5C9] rounded-[3px] text-[13.5px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E] transition-colors resize-y leading-relaxed font-sans"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
