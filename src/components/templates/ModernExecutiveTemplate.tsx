"use client";

import React from "react";
import { ResumeData } from "@/types/resume";
import { ResumeDesign } from "@/types/template";
import { getFontFamilyCss, getDensityConfig, getFontScaleConfig } from "@/lib/designUtils";

interface ModernExecutiveTemplateProps {
  data: ResumeData;
  design?: ResumeDesign;
}

export function ModernExecutiveTemplate({ data, design }: ModernExecutiveTemplateProps) {
  const { personalInfo, summary, experience, projects, education, skills, sectionOrder } = data;

  const fontCss = getFontFamilyCss(design?.fontFamily || "inter");
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
    <div
      className="flex items-center gap-2.5 mb-2.5 font-bold uppercase tracking-[0.08em]"
      style={{ fontSize: scale.headingSize, color: accentColor }}
    >
      <span
        className="w-1 h-3.5 rounded-full inline-block"
        style={{ backgroundColor: accentColor }}
      />
      <span>{title}</span>
      <span className="flex-1 h-[1px] bg-[#E2DFD8]" />
    </div>
  );

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <div key="summary" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Executive Summary" />
        <p
          className="text-[#2B2C30] m-0 pl-3.5 border-l-2 border-[#E2DFD8] italic"
          style={{ fontSize: scale.bodySize, lineHeight: density.lineHeight }}
        >
          {summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null;
    return (
      <div key="experience" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Work Experience" />
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
                <div className="font-bold text-[#1C1D21]" style={{ fontSize: scale.bodySize }}>
                  {exp.role}
                  {exp.company && (
                    <span className="font-semibold text-[#5B5F6B]"> — {exp.company}</span>
                  )}
                </div>
                <div
                  className="px-2 py-0.5 rounded text-[11px] font-medium shrink-0"
                  style={{
                    backgroundColor: `${accentColor}12`,
                    color: accentColor,
                    fontSize: scale.smallSize,
                  }}
                >
                  {[exp.startDate, exp.endDate || (exp.current ? "Present" : "")].filter(Boolean).join(" – ")}
                </div>
              </div>
              {exp.location && (
                <div className="text-[#5B5F6B] text-[11.5px] mt-0.5" style={{ fontSize: scale.smallSize }}>
                  {exp.location}
                </div>
              )}
              {bullets.length > 0 && (
                <ul
                  className="pl-4 text-[#2B2C30] list-disc mt-1.5"
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
        <SectionHeading title="Key Projects & Initiatives" />
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
                <div className="font-bold text-[#1C1D21]" style={{ fontSize: scale.bodySize }}>
                  {proj.name}
                  {proj.technologies && (
                    <span className="font-normal text-[#5B5F6B]"> | {proj.technologies}</span>
                  )}
                </div>
                {proj.link && (
                  <span
                    className="text-[11.5px] underline"
                    style={{ color: accentColor, fontSize: scale.smallSize }}
                  >
                    {proj.link.replace(/^https?:\/\//, "")}
                  </span>
                )}
              </div>
              {proj.role && (
                <div className="text-[#5B5F6B] italic mt-0.5" style={{ fontSize: scale.smallSize }}>
                  {proj.role}
                </div>
              )}
              {bullets.length > 0 && (
                <ul
                  className="pl-4 text-[#2B2C30] list-disc mt-1.5"
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

  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    return (
      <div key="education" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Education & Credentials" />
        {education.map((ed) => (
          <div
            key={ed.id}
            className="page-break-inside-avoid"
            style={{ marginBottom: density.itemMargin }}
          >
            <div className="flex justify-between items-baseline gap-2">
              <span className="font-bold text-[#1C1D21]" style={{ fontSize: scale.bodySize }}>
                {ed.school}
              </span>
              <span className="text-[#5B5F6B] text-[11px] shrink-0" style={{ fontSize: scale.smallSize }}>
                {[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}
              </span>
            </div>
            {ed.degree && (
              <div className="text-[#28344E] font-medium mt-0.5" style={{ fontSize: scale.smallSize }}>
                {ed.degree}
              </div>
            )}
            {ed.detail && (
              <div className="text-[#5B5F6B] mt-0.5" style={{ fontSize: scale.smallSize }}>
                {ed.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    return (
      <div key="skills" style={{ marginTop: density.sectionMargin }}>
        <SectionHeading title="Core Competencies" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {skills.map((cat) => (
            <div
              key={cat.id}
              className="p-2.5 rounded bg-[#F8F7F4] border border-[#E8E5DC] page-break-inside-avoid"
            >
              {cat.category && (
                <div
                  className="font-bold uppercase tracking-wider text-[11px] mb-1"
                  style={{ color: accentColor }}
                >
                  {cat.category}
                </div>
              )}
              <div
                className="text-[#2B2C30] flex flex-wrap gap-1.5"
                style={{ fontSize: scale.smallSize }}
              >
                {cat.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#DAD5C9] text-[11.5px]"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sectionMap: Record<string, () => React.ReactNode> = {
    summary: renderSummary,
    experience: renderExperience,
    projects: renderProjects,
    education: renderEducation,
    skills: renderSkills,
  };

  const order = sectionOrder && sectionOrder.length > 0
    ? sectionOrder
    : ["summary", "experience", "projects", "education", "skills"];

  return (
    <div
      className="resume-sheet bg-[#FFFFFF] text-[#1C1D21] w-full max-w-[640px] min-h-[820px] box-border mx-auto select-text shadow-sm"
      style={{
        fontFamily: fontCss,
        padding: density.sheetPadding,
      }}
    >
      {/* Top Corporate Accent Bar */}
      <div
        className="w-full h-1.5 rounded-full mb-6"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 pb-4 border-b border-[#E2DFD8]">
        <div>
          <h1
            className="font-extrabold tracking-tight text-[#1C1D21] m-0 leading-none"
            style={{ fontSize: scale.nameSize }}
          >
            {personalInfo.name || "Your Name"}
          </h1>
          {personalInfo.title && (
            <div
              className="mt-1 font-semibold uppercase tracking-wider text-[13px]"
              style={{ color: accentColor, fontSize: scale.titleSize }}
            >
              {personalInfo.title}
            </div>
          )}
        </div>

        {contactItems.length > 0 && (
          <div
            className="text-[#5B5F6B] text-[11px] leading-relaxed text-left md:text-right"
            style={{ fontSize: scale.smallSize }}
          >
            {contactItems.map((item, i) => (
              <span key={i}>
                {item}
                {i < contactItems.length - 1 && <span className="mx-1.5 opacity-40">|</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content Sections */}
      {order.map((secKey) => (sectionMap[secKey] ? sectionMap[secKey]() : null))}
    </div>
  );
}
