"use client";

import React from "react";
import { ResumeData, ExperienceItem, ProjectItem } from "@/types/resume";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { SummaryForm } from "./SummaryForm";
import { ExperienceForm } from "./ExperienceForm";
import { ProjectsForm } from "./ProjectsForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { SectionHeader } from "./Field";

interface FormPaneProps {
  data: ResumeData;
  updatePersonalInfo: (field: any, value: string) => void;
  updateSummary: (val: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: any, value: any) => void;
  removeExperience: (id: string) => void;
  moveExperience: (from: number, to: number) => void;
  addProject: () => void;
  updateProject: (id: string, field: any, value: any) => void;
  removeProject: (id: string) => void;
  moveProject: (from: number, to: number) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: any, value: any) => void;
  removeEducation: (id: string) => void;
  moveEducation: (from: number, to: number) => void;
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, field: any, value: string) => void;
  removeSkillCategory: (id: string) => void;
  moveSection: (from: number, to: number) => void;
  onGenerateSummaryAi?: () => void;
  isGeneratingSummary?: boolean;
  onImproveExperienceAi?: (item: ExperienceItem) => void;
  onImproveProjectAi?: (item: ProjectItem) => void;
  activeEnhanceId?: string | null;
}

export function FormPane({
  data,
  updatePersonalInfo,
  updateSummary,
  addExperience,
  updateExperience,
  removeExperience,
  moveExperience,
  addProject,
  updateProject,
  removeProject,
  moveProject,
  addEducation,
  updateEducation,
  removeEducation,
  moveEducation,
  addSkillCategory,
  updateSkillCategory,
  removeSkillCategory,
  onGenerateSummaryAi,
  isGeneratingSummary,
  onImproveExperienceAi,
  onImproveProjectAi,
  activeEnhanceId,
}: FormPaneProps) {
  return (
    <div className="no-print">
      {/* Contact Section */}
      <SectionHeader>Contact</SectionHeader>
      <PersonalInfoForm
        data={data.personalInfo}
        onChange={updatePersonalInfo}
      />

      {/* Summary Section */}
      <SectionHeader>Summary</SectionHeader>
      <SummaryForm
        value={data.summary}
        onChange={updateSummary}
        onGenerateAi={onGenerateSummaryAi}
        isGenerating={isGeneratingSummary}
      />

      {/* Experience Section */}
      <ExperienceForm
        items={data.experience}
        onAdd={addExperience}
        onUpdate={updateExperience}
        onRemove={removeExperience}
        onMove={moveExperience}
        onImproveWithAi={onImproveExperienceAi}
        activeEnhanceId={activeEnhanceId}
      />

      {/* Projects Section */}
      <ProjectsForm
        items={data.projects}
        onAdd={addProject}
        onUpdate={updateProject}
        onRemove={removeProject}
        onMove={moveProject}
        onImproveWithAi={onImproveProjectAi}
        activeEnhanceId={activeEnhanceId}
      />

      {/* Education Section */}
      <EducationForm
        items={data.education}
        onAdd={addEducation}
        onUpdate={updateEducation}
        onRemove={removeEducation}
        onMove={moveEducation}
      />

      {/* Skills Section */}
      <SkillsForm
        items={data.skills}
        onAdd={addSkillCategory}
        onUpdate={updateSkillCategory}
        onRemove={removeSkillCategory}
      />
    </div>
  );
}
