"use client";

import React from "react";
import { ResumeData } from "@/types/resume";
import { ResumeDesign } from "@/types/template";
import { getFontFamilyCss, getDensityConfig, getFontScaleConfig } from "@/lib/designUtils";

interface TwoColumnTemplateProps {
  data: ResumeData;
  design?: ResumeDesign;
}

export function TwoColumnTemplate({ data, design }: TwoColumnTemplateProps) {
  const { personalInfo, summary, experience, projects, education, skills } = data;

  const fontCss = getFontFamilyCss(design?.fontFamily || "inter");
  const density = getDensityConfig(design?.density || "normal");
  const scale = getFontScaleConfig(design?.fontScale || "normal");
  const accentColor = design?.accentColor || "#28344E";

  const contactList = [
    { label: "Email", val: personalInfo.email, link: personalInfo.email ? `mailto:${personalInfo.email}` : undefined },
    { label: "Phone", val: personalInfo.phone },
    { label: "Location", val: personalInfo.location },
    { label: "Website", val: personalInfo.website, link: personalInfo.website },
    { label: "LinkedIn", val: personalInfo.linkedin, link: personalInfo.linkedin },
    { label: "GitHub", val: personalInfo.github, link: personalInfo.github },
  ].filter((item) => Boolean(item.val));

  return (
    <div
      className="resume-sheet bg-[#FFFFFF] text-[#1C1D21] w-full max-w-[640px] min-h-[820px] box-border mx-auto select-text shadow-sm overflow-hidden"
      style={{ fontFamily: fontCss }}
    >
      {/* Top Header Banner */}
      <div
        className="px-8 pt-7 pb-5 border-b border-[#E2DFD8]"
        style={{
          borderTop: `4px solid ${accentColor}`,
        }}
      >
        <h1
          className="font-extrabold tracking-tight text-[#1C1D21] m-0"
          style={{ fontSize: scale.nameSize }}
        >
          {personalInfo.name || "Your Name"}
        </h1>
        {personalInfo.title && (
          <div
            className="mt-1 font-semibold uppercase tracking-wider text-[12.5px]"
            style={{ color: accentColor, fontSize: scale.titleSize }}
          >
            {personalInfo.title}
          </div>
        )}
      </div>

      {/* Asymmetric Two-Column Grid */}
      <div className="flex flex-col md:flex-row min-h-[720px]">
        {/* Left Sidebar Rail (~34%) */}
        <div
          className="w-full md:w-[34%] bg-[#F9F8F6] p-5 border-r border-[#E8E5DC] flex flex-col gap-5 shrink-0"
          style={{ padding: density.sheetPadding.split(" ")[1] }}
        >
          {/* Contact Details */}
          {contactList.length > 0 && (
            <div>
              <div
                className="font-bold uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-[#E2DFD8]"
                style={{ color: accentColor, fontSize: scale.headingSize }}
              >
                Contact
              </div>
              <div className="space-y-1.5" style={{ fontSize: scale.smallSize }}>
                {contactList.map((item, idx) => (
                  <div key={idx} className="break-words">
                    <span className="text-[#888A93] text-[10px] uppercase font-bold block">
                      {item.label}
                    </span>
                    {item.link ? (
                      <span className="text-[#2B2C30] hover:underline cursor-pointer">
                        {item.val}
                      </span>
                    ) : (
                      <span className="text-[#2B2C30]">{item.val}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in Rail */}
          {education && education.length > 0 && (
            <div>
              <div
                className="font-bold uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-[#E2DFD8]"
                style={{ color: accentColor, fontSize: scale.headingSize }}
              >
                Education
              </div>
              <div className="space-y-3">
                {education.map((ed) => (
                  <div key={ed.id} className="page-break-inside-avoid">
                    <div className="font-bold text-[#1C1D21]" style={{ fontSize: scale.smallSize }}>
                      {ed.school}
                    </div>
                    {ed.degree && (
                      <div className="text-[#5B5F6B] text-[11px] leading-tight mt-0.5">
                        {ed.degree}
                      </div>
                    )}
                    <div className="text-[#888A93] text-[10.5px] mt-0.5">
                      {[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills in Rail */}
          {skills && skills.length > 0 && (
            <div>
              <div
                className="font-bold uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-[#E2DFD8]"
                style={{ color: accentColor, fontSize: scale.headingSize }}
              >
                Skills
              </div>
              <div className="space-y-3">
                {skills.map((cat) => (
                  <div key={cat.id} className="page-break-inside-avoid">
                    {cat.category && (
                      <div className="text-[11px] font-bold text-[#1C1D21] mb-1">
                        {cat.category}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {cat.skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-1.5 py-0.5 rounded bg-[#FFFFFF] border border-[#DAD5C9] text-[10.5px] text-[#2B2C30]"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content (~66%) */}
        <div
          className="w-full md:w-[66%] p-6 flex flex-col gap-4"
          style={{ padding: density.sheetPadding.split(" ")[1] }}
        >
          {/* Summary */}
          {summary && (
            <div>
              <div
                className="font-bold uppercase tracking-wider text-[11px] mb-1.5 pb-1 border-b border-[#E2DFD8]"
                style={{ color: accentColor, fontSize: scale.headingSize }}
              >
                Summary
              </div>
              <p
                className="text-[#2B2C30] m-0"
                style={{ fontSize: scale.bodySize, lineHeight: density.lineHeight }}
              >
                {summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <div
                className="font-bold uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-[#E2DFD8]"
                style={{ color: accentColor, fontSize: scale.headingSize }}
              >
                Work Experience
              </div>
              <div className="space-y-3">
                {experience.map((exp) => {
                  const bullets = exp.bullets
                    ? exp.bullets
                        .split("\n")
                        .map((b) => b.trim())
                        .filter(Boolean)
                    : [];

                  return (
                    <div
                      key={exp.id}
                      className="page-break-inside-avoid"
                      style={{ marginBottom: density.itemMargin }}
                    >
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-bold text-[#1C1D21]" style={{ fontSize: scale.bodySize }}>
                          {exp.role}
                        </span>
                        <span className="text-[#5B5F6B] text-[11px] shrink-0" style={{ fontSize: scale.smallSize }}>
                          {[exp.startDate, exp.endDate || (exp.current ? "Present" : "")].filter(Boolean).join(" – ")}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[#5B5F6B] font-medium" style={{ fontSize: scale.smallSize }}>
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ""}
                      </div>
                      {bullets.length > 0 && (
                        <ul
                          className="pl-4 text-[#2B2C30] list-disc mt-1"
                          style={{ fontSize: scale.bodySize, lineHeight: density.lineHeight }}
                        >
                          {bullets.map((b, i) => (
                            <li key={i} style={{ marginBottom: density.bulletMargin }}>
                              {b.replace(/^[•\-\*]\s*/, "")}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <div
                className="font-bold uppercase tracking-wider text-[11px] mb-2 pb-1 border-b border-[#E2DFD8]"
                style={{ color: accentColor, fontSize: scale.headingSize }}
              >
                Projects
              </div>
              <div className="space-y-3">
                {projects.map((proj) => {
                  const bullets = proj.bullets
                    ? proj.bullets
                        .split("\n")
                        .map((b) => b.trim())
                        .filter(Boolean)
                    : [];

                  return (
                    <div
                      key={proj.id}
                      className="page-break-inside-avoid"
                      style={{ marginBottom: density.itemMargin }}
                    >
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-bold text-[#1C1D21]" style={{ fontSize: scale.bodySize }}>
                          {proj.name}
                        </span>
                        {proj.link && (
                          <span className="text-[#5B5F6B] text-[11px] underline shrink-0" style={{ fontSize: scale.smallSize }}>
                            {proj.link.replace(/^https?:\/\//, "")}
                          </span>
                        )}
                      </div>
                      {proj.technologies && (
                        <div className="text-[11px] text-[#888A93] italic" style={{ fontSize: scale.smallSize }}>
                          {proj.technologies}
                        </div>
                      )}
                      {bullets.length > 0 && (
                        <ul
                          className="pl-4 text-[#2B2C30] list-disc mt-1"
                          style={{ fontSize: scale.bodySize, lineHeight: density.lineHeight }}
                        >
                          {bullets.map((b, i) => (
                            <li key={i} style={{ marginBottom: density.bulletMargin }}>
                              {b.replace(/^[•\-\*]\s*/, "")}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
