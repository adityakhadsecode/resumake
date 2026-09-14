"use client";

import React from "react";
import { ResumeData } from "@/types/resume";

interface JakesTemplateProps {
  data: ResumeData;
}

export function JakesTemplate({ data }: JakesTemplateProps) {
  const { personalInfo, summary, experience, projects, education, skills } = data;

  const contactItems = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  return (
    <div
      className="resume-sheet bg-[#FAFAF8] text-[#1C1D21] w-full max-w-[640px] min-h-[820px] p-[48px_44px] box-border mx-auto select-text"
      style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
    >
      {/* Name */}
      <div className="text-[26px] font-bold tracking-[-0.01em] text-[#1C1D21] leading-tight">
        {personalInfo.name || "Your Name"}
      </div>

      {/* Title */}
      {personalInfo.title && (
        <div className="text-[14.5px] text-[#28344E] mt-0.5">
          {personalInfo.title}
        </div>
      )}

      {/* Contact Line */}
      {contactItems.length > 0 && (
        <div className="text-[11.5px] text-[#5B5F6B] mt-2 leading-normal">
          {contactItems.join("   ·   ")}
        </div>
      )}

      {/* Summary */}
      {summary && (
        <>
          <div className="border-t border-[#DAD5C9] my-4" />
          <p className="text-[13px] leading-[1.55] text-[#2B2C30] m-0">
            {summary}
          </p>
        </>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <>
          <div className="border-t border-[#DAD5C9] my-4" />
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#28344E] mb-2.5">
            Experience
          </div>
          {experience.map((exp) => {
            const bullets = exp.bullets
              ? exp.bullets
                  .split("\n")
                  .map((b) => b.trim())
                  .filter(Boolean)
              : [];

            return (
              <div key={exp.id} className="mb-3.5 page-break-inside-avoid">
                <div className="flex justify-between items-baseline gap-3">
                  <span className="text-[13.5px] font-bold text-[#1C1D21]">
                    {exp.role}
                    {exp.company ? `, ${exp.company}` : ""}
                  </span>
                  <span className="text-[11.5px] text-[#5B5F6B] whitespace-nowrap">
                    {[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                  </span>
                </div>
                {exp.location && (
                  <div className="text-[12px] text-[#5B5F6B] italic mt-0.5">
                    {exp.location}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="mt-1.5 pl-4.5 text-[12.5px] leading-[1.55] text-[#2B2C30] list-disc">
                    {bullets.map((b, i) => (
                      <li key={i} className="mb-0.5 pl-0.5">
                        {b.replace(/^[•\-\*]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <>
          <div className="border-t border-[#DAD5C9] my-4" />
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#28344E] mb-2.5">
            Projects
          </div>
          {projects.map((proj) => {
            const bullets = proj.bullets
              ? proj.bullets
                  .split("\n")
                  .map((b) => b.trim())
                  .filter(Boolean)
              : [];

            return (
              <div key={proj.id} className="mb-3.5 page-break-inside-avoid">
                <div className="flex justify-between items-baseline gap-3">
                  <span className="text-[13.5px] font-bold text-[#1C1D21]">
                    {proj.name}
                    {proj.technologies ? ` — ${proj.technologies}` : ""}
                  </span>
                  {proj.link && (
                    <span className="text-[11.5px] text-[#5B5F6B] whitespace-nowrap">
                      {proj.link}
                    </span>
                  )}
                </div>
                {proj.role && (
                  <div className="text-[12px] text-[#5B5F6B] italic mt-0.5">
                    {proj.role}
                  </div>
                )}
                {bullets.length > 0 && (
                  <ul className="mt-1.5 pl-4.5 text-[12.5px] leading-[1.55] text-[#2B2C30] list-disc">
                    {bullets.map((b, i) => (
                      <li key={i} className="mb-0.5 pl-0.5">
                        {b.replace(/^[•\-\*]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <>
          <div className="border-t border-[#DAD5C9] my-4" />
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#28344E] mb-2.5">
            Education
          </div>
          {education.map((ed) => (
            <div key={ed.id} className="mb-3.5 page-break-inside-avoid">
              <div className="flex justify-between items-baseline gap-3">
                <span className="text-[13.5px] font-bold text-[#1C1D21]">
                  {ed.school}
                </span>
                <span className="text-[11.5px] text-[#5B5F6B] whitespace-nowrap">
                  {[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}
                </span>
              </div>
              {ed.degree && (
                <div className="text-[12px] text-[#5B5F6B] italic mt-0.5">
                  {ed.degree}
                </div>
              )}
              {ed.detail && (
                <div className="text-[12px] text-[#5B5F6B] mt-0.5">
                  {ed.detail}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <>
          <div className="border-t border-[#DAD5C9] my-4" />
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#28344E] mb-2.5">
            Skills
          </div>
          <div className="text-[12.5px] text-[#2B2C30] leading-[1.6] space-y-1">
            {skills.map((cat) => (
              <div key={cat.id} className="page-break-inside-avoid">
                {cat.category && (
                  <span className="font-bold text-[#1C1D21]">
                    {cat.category}:{" "}
                  </span>
                )}
                <span>
                  {cat.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .join("   ·   ")}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
