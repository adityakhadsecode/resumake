"use client";

import React from "react";
import { ResumeData } from "@/types/resume";
import { ResumeDesign } from "@/types/template";
import { getFontFamilyCss, getDensityConfig, getFontScaleConfig } from "@/lib/designUtils";

interface AcademicCvTemplateProps {
  data: ResumeData;
  design?: ResumeDesign;
}

export function AcademicCvTemplate({ data, design }: AcademicCvTemplateProps) {
  const { personalInfo, summary, experience, projects, education, skills, sectionOrder } = data;

  const fontCss = getFontFamilyCss(design?.fontFamily || "georgia");
  const density = getDensityConfig(design?.density || "normal");
  const scale = getFontScaleConfig(design?.fontScale || "normal");
  const accentColor = design?.accentColor || "#28344E";

  const contactItems = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  const SectionHeading = ({ title }: { title: string }) => (
    <div className="mt-3 mb-1.5 border-b border-[#28344E]/30 pb-0.5">
      <span
        className="font-bold tracking-[0.1em] uppercase text-[12px]"
        style={{ color: accentColor, fontSize: scale.headingSize }}
      >
        {title}
      </span>
    </div>
  );

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <div key="summary" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Research Overview & Interests" />
        <p
          className="text-[#2B2C30] m-0 text-justify"
          style={{ fontSize: scale.bodySize, lineHeight: density.lineHeight }}
        >
          {summary}
        </p>
      </div>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    return (
      <div key="education" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Education & Academic Honors" />
        {education.map((ed) => (
          <div
            key={ed.id}
            className="page-break-inside-avoid mb-2"
            style={{ marginBottom: density.itemMargin }}
          >
            <div className="flex justify-between items-baseline gap-2">
              <span className="font-bold text-[#1C1D21]" style={{ fontSize: scale.bodySize }}>
                {ed.degree ? `${ed.degree}, ` : ""}
                <span className="font-semibold">{ed.school}</span>
              </span>
              <span className="text-[#5B5F6B] text-[11px] shrink-0" style={{ fontSize: scale.smallSize }}>
                {[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}
              </span>
            </div>
            {ed.location && (
              <div className="text-[#5B5F6B] italic text-[11.5px]" style={{ fontSize: scale.smallSize }}>
                {ed.location}
              </div>
            )}
            {ed.detail && (
              <div className="text-[#2B2C30] text-[12px] mt-0.5" style={{ fontSize: scale.smallSize }}>
                {ed.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Research & Academic Appointments" />
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
                  {exp.company ? `, ${exp.company}` : ""}
                </span>
                <span className="text-[#5B5F6B] text-[11px] shrink-0" style={{ fontSize: scale.smallSize }}>
                  {[exp.startDate, exp.endDate || (exp.current ? "Present" : "")].filter(Boolean).join(" – ")}
                </span>
              </div>
              {exp.location && (
                <div className="text-[#5B5F6B] italic text-[11.5px]" style={{ fontSize: scale.smallSize }}>
                  {exp.location}
                </div>
              )}
              {bullets.length > 0 && (
                <ul
                  className="pl-5 text-[#2B2C30] list-disc mt-1"
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
    );
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null;
    return (
      <div key="projects" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Publications, Grants & Key Projects" />
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
              className="page-break-inside-avoid mb-2"
              style={{ marginBottom: density.itemMargin }}
            >
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-[#1C1D21]" style={{ fontSize: scale.bodySize }}>
                  {proj.name}
                  {proj.technologies ? ` [${proj.technologies}]` : ""}
                </span>
                {proj.link && (
                  <span className="text-[#5B5F6B] text-[11px] underline shrink-0" style={{ fontSize: scale.smallSize }}>
                    {proj.link}
                  </span>
                )}
              </div>
              {proj.role && (
                <div className="text-[#5B5F6B] italic text-[11.5px]" style={{ fontSize: scale.smallSize }}>
                  {proj.role}
                </div>
              )}
              {bullets.length > 0 && (
                <ul
                  className="pl-5 text-[#2B2C30] list-disc mt-1"
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
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    return (
      <div key="skills" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Methodologies & Scholarly Expertise" />
        <div
          className="text-[#2B2C30] space-y-1 mt-1"
          style={{ fontSize: scale.bodySize, lineHeight: density.lineHeight }}
        >
          {skills.map((cat) => (
            <div key={cat.id} className="page-break-inside-avoid">
              {cat.category && (
                <span className="font-bold text-[#1C1D21]">{cat.category}: </span>
              )}
              <span>
                {cat.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .join("; ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Academic order prefers Education near the top if not explicitly changed
  const defaultAcademicOrder = ["education", "summary", "experience", "projects", "skills"];
  const sectionMap: Record<string, () => React.ReactNode> = {
    education: renderEducation,
    summary: renderSummary,
    experience: renderExperience,
    projects: renderProjects,
    skills: renderSkills,
  };

  const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultAcademicOrder;

  return (
    <div
      className="resume-sheet bg-[#FAF9F6] text-[#1C1D21] w-full max-w-[640px] min-h-[820px] box-border mx-auto select-text shadow-sm"
      style={{
        fontFamily: fontCss,
        padding: density.sheetPadding,
      }}
    >
      {/* Centered Scholarly Header */}
      <div className="text-center pb-3 border-b border-[#28344E]/40">
        <div
          className="font-bold tracking-tight text-[#1C1D21] uppercase"
          style={{ fontSize: scale.nameSize, color: accentColor }}
        >
          {personalInfo.name || "Curriculum Vitae"}
        </div>

        {personalInfo.title && (
          <div className="italic text-[#5B5F6B] mt-0.5 font-medium" style={{ fontSize: scale.titleSize }}>
            {personalInfo.title}
          </div>
        )}

        {contactItems.length > 0 && (
          <div
            className="text-[#5B5F6B] text-[11px] mt-2 flex flex-wrap justify-center gap-x-2.5 gap-y-0.5"
            style={{ fontSize: scale.smallSize }}
          >
            {contactItems.map((item, i) => (
              <span key={i}>
                {item}
                {i < contactItems.length - 1 && <span className="ml-2.5 opacity-50">·</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      {order.map((secKey) => (sectionMap[secKey] ? sectionMap[secKey]() : null))}
    </div>
  );
}
