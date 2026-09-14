"use client";

import React from "react";
import { EducationItem } from "@/types/resume";
import { Field, SectionHeader } from "./Field";

interface EducationFormProps {
  items: EducationItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof EducationItem, value: any) => void;
  onRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

export function EducationForm({
  items,
  onAdd,
  onUpdate,
  onRemove,
  onMove,
}: EducationFormProps) {
  return (
    <div>
      <SectionHeader
        action={
          <button
            type="button"
            onClick={onAdd}
            className="text-[12.5px] font-semibold text-[#28344E] cursor-pointer hover:underline bg-transparent border-none p-0"
          >
            + Add school
          </button>
        }
      >
        Education
      </SectionHeader>

      {items.map((ed, index) => (
        <div
          key={ed.id}
          className="border border-[#DAD5C9] rounded-[4px] p-3.5 mb-3.5 bg-[#FCFBF9]"
        >
          <div className="flex gap-3 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <Field
                label="School"
                value={ed.school}
                onChange={(v) => onUpdate(ed.id, "school", v)}
                placeholder="University of Texas at Austin"
              />
              <Field
                label="Degree"
                value={ed.degree}
                onChange={(v) => onUpdate(ed.id, "degree", v)}
                placeholder="B.F.A. in Design"
              />
            </div>

            <div className="flex flex-col items-end gap-1 mt-5">
              <button
                type="button"
                onClick={() => onRemove(ed.id)}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Start"
              value={ed.startDate}
              onChange={(v) => onUpdate(ed.id, "startDate", v)}
              placeholder="2015"
            />
            <Field
              label="End"
              value={ed.endDate}
              onChange={(v) => onUpdate(ed.id, "endDate", v)}
              placeholder="2019"
            />
          </div>

          <Field
            label="Detail (optional)"
            value={ed.detail}
            onChange={(v) => onUpdate(ed.id, "detail", v)}
            placeholder="Honors, GPA, relevant coursework"
          />
        </div>
      ))}
    </div>
  );
}
