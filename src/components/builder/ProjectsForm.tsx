"use client";

import React from "react";
import { ProjectItem } from "@/types/resume";
import { Field, SectionHeader } from "./Field";

interface ProjectsFormProps {
  items: ProjectItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof ProjectItem, value: any) => void;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onImproveWithAi?: (item: ProjectItem) => void;
  activeEnhanceId?: string | null;
}

export function ProjectsForm({
  items,
  onAdd,
  onUpdate,
  onRemove,
  onMove,
  onImproveWithAi,
  activeEnhanceId,
}: ProjectsFormProps) {
  return (
    <div>
      <SectionHeader
        action={
          <button
            type="button"
            onClick={onAdd}
            className="text-[12.5px] font-semibold text-[#28344E] cursor-pointer hover:underline bg-transparent border-none p-0"
          >
            + Add project
          </button>
        }
      >
        Projects
      </SectionHeader>

      {items.map((proj, index) => {
        const isEnhancing = activeEnhanceId === proj.id;

        return (
          <div
            key={proj.id}
            className="border border-[#DAD5C9] rounded-[4px] p-3.5 mb-3.5 bg-[#FCFBF9]"
          >
            <div className="flex gap-3 items-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                <Field
                  label="Project name"
                  value={proj.name}
                  onChange={(v) => onUpdate(proj.id, "name", v)}
                  placeholder="PulseUI Design System"
                />
                <Field
                  label="Technologies"
                  value={proj.technologies}
                  onChange={(v) => onUpdate(proj.id, "technologies", v)}
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>

              <div className="flex flex-col items-end gap-1 mt-5">
                <button
                  type="button"
                  onClick={() => onRemove(proj.id)}
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

            <Field
              label="Link / URL (optional)"
              value={proj.link}
              onChange={(v) => onUpdate(proj.id, "link", v)}
              placeholder="github.com/you/project"
            />

            {/* Highlights with AI Action */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11.5px] text-[#5B5F6B] font-medium select-none">
                  Highlights (one per line)
                </span>
                {onImproveWithAi && (
                  <button
                    type="button"
                    onClick={() => onImproveWithAi(proj)}
                    disabled={isEnhancing || !proj.bullets.trim()}
                    className="text-[11.5px] font-semibold text-[#28344E] hover:underline cursor-pointer bg-transparent border-none p-0 disabled:opacity-40"
                    title="Rewrite bullets with strong action verbs & Google XYZ formula"
                  >
                    {isEnhancing ? "Enhancing..." : "✨ Improve with AI"}
                  </button>
                )}
              </div>
              <textarea
                value={proj.bullets}
                onChange={(e) => onUpdate(proj.id, "bullets", e.target.value)}
                rows={3}
                placeholder="Built an accessible design system with 40+ components..."
                className="w-full box-border px-2.5 py-2 border border-[#DAD5C9] rounded-[3px] text-[13.5px] bg-white text-[#1C1D21] focus:outline-none focus:border-[#28344E] transition-colors resize-y leading-relaxed font-sans"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
