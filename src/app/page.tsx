"use client";

import React, { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { useAiConfig } from "@/hooks/useAiConfig";
import { HeaderBar } from "@/components/builder/HeaderBar";
import { FormPane } from "@/components/builder/FormPane";
import { PreviewPane } from "@/components/preview/PreviewPane";
import { JakesTemplate } from "@/components/templates/JakesTemplate";
import { PrintModal } from "@/components/builder/PrintModal";
import { AiSettingsModal } from "@/components/builder/AiSettingsModal";
import { AiDiffModal } from "@/components/builder/AiDiffModal";
import { ResumeImportModal } from "@/components/builder/ResumeImportModal";
import { ExperienceItem, ProjectItem, ResumeData } from "@/types/resume";

export default function Home() {
  const {
    data,
    isLoaded,
    lastSaved,
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
    moveSection,
    resetToSample,
    clearAll,
    exportJSON,
    importJSON,
    loadResumeData,
    mergeResumeData,
  } = useResume();

  const { config: aiConfig, isConfigured: isAiConfigured, saveConfig: saveAiConfig } = useAiConfig();

  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // AI Diff Modal State
  const [diffModal, setDiffModal] = useState<{
    isOpen: boolean;
    original: string;
    enhanced: string;
    title: string;
    onApply: (newText: string) => void;
  }>({
    isOpen: false,
    original: "",
    enhanced: "",
    title: "",
    onApply: () => {},
  });

  // AI Loading indicators
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [activeEnhanceId, setActiveEnhanceId] = useState<string | null>(null);

  // Native Print
  const triggerNativePrint = () => {
    const originalTitle = document.title;
    const cleanName = (data.personalInfo.name || "Resume")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    document.title = `${cleanName}_Resume`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handlePrintRequest = () => {
    try {
      const skip = localStorage.getItem("antislop_skip_print_guidance");
      if (skip === "true") {
        triggerNativePrint();
        return;
      }
    } catch (e) {
      // ignore
    }
    setIsPrintModalOpen(true);
  };

  // AI Action: Generate Professional Summary
  const handleGenerateSummaryAi = async () => {
    if (!isAiConfigured) {
      setIsAiSettingsOpen(true);
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const expSummary = data.experience
        .map((e) => `${e.role} at ${e.company}`)
        .filter(Boolean)
        .join("; ");
      const allSkills = data.skills.map((s) => s.skills).filter(Boolean);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-summary",
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey,
          model: aiConfig.model,
          ollamaUrl: aiConfig.ollamaUrl,
          context: {
            role: data.personalInfo.title,
            experienceSummary: expSummary,
            skills: allSkills,
          },
        }),
      });

      const json = await res.json();
      if (json.success && json.result) {
        updateSummary(json.result);
      } else {
        alert(json.error || "Failed to generate summary with AI.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to communicate with AI.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // AI Action: Enhance Experience Bullets
  const handleImproveExperienceAi = async (item: ExperienceItem) => {
    if (!isAiConfigured) {
      setIsAiSettingsOpen(true);
      return;
    }

    if (!item.bullets.trim()) {
      alert("Please add at least one rough bullet point first to enhance.");
      return;
    }

    setActiveEnhanceId(item.id);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance-bullets",
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey,
          model: aiConfig.model,
          ollamaUrl: aiConfig.ollamaUrl,
          content: item.bullets,
          context: {
            role: item.role,
            company: item.company,
          },
        }),
      });

      const json = await res.json();
      if (json.success && json.result) {
        setDiffModal({
          isOpen: true,
          original: item.bullets,
          enhanced: json.result,
          title: `Enhance ${item.role || "Role"} Highlights`,
          onApply: (newText) => {
            updateExperience(item.id, "bullets", newText);
          },
        });
      } else {
        alert(json.error || "Failed to enhance bullets with AI.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to communicate with AI.");
    } finally {
      setActiveEnhanceId(null);
    }
  };

  // AI Action: Enhance Project Bullets
  const handleImproveProjectAi = async (item: ProjectItem) => {
    if (!isAiConfigured) {
      setIsAiSettingsOpen(true);
      return;
    }

    if (!item.bullets.trim()) {
      alert("Please add at least one rough bullet point first to enhance.");
      return;
    }

    setActiveEnhanceId(item.id);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance-bullets",
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey,
          model: aiConfig.model,
          ollamaUrl: aiConfig.ollamaUrl,
          content: item.bullets,
          context: {
            projectName: item.name,
          },
        }),
      });

      const json = await res.json();
      if (json.success && json.result) {
        setDiffModal({
          isOpen: true,
          original: item.bullets,
          enhanced: json.result,
          title: `Enhance ${item.name || "Project"} Highlights`,
          onApply: (newText) => {
            updateProject(item.id, "bullets", newText);
          },
        });
      } else {
        alert(json.error || "Failed to enhance project highlights with AI.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to communicate with AI.");
    } finally {
      setActiveEnhanceId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F3F2EF]">
        <p className="text-[13px] text-[#5B5F6B]">Loading resume...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF] text-[#1C1D21] flex flex-col font-sans">
      {/* Topbar */}
      <HeaderBar
        onPrint={handlePrintRequest}
        onReset={resetToSample}
        onClear={clearAll}
        onExportJSON={exportJSON}
        onImportJSON={importJSON}
        onOpenAiSettings={() => setIsAiSettingsOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        isAiConfigured={isAiConfigured}
        lastSaved={lastSaved}
      />

      {/* Mobile Tab Switcher */}
      <div className="no-print flex border-b border-[#DAD5C9] bg-[#FAFAF8] px-4 py-2 lg:hidden">
        <div className="grid w-full grid-cols-2 gap-1 rounded bg-[#E9E7E1] p-1 text-[12.5px] font-medium">
          <button
            type="button"
            onClick={() => setMobileTab("edit")}
            className={`py-1 rounded text-center transition-colors ${
              mobileTab === "edit"
                ? "bg-[#FAFAF8] text-[#1C1D21] font-semibold"
                : "text-[#5B5F6B]"
            }`}
          >
            Edit Form
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`py-1 rounded text-center transition-colors ${
              mobileTab === "preview"
                ? "bg-[#FAFAF8] text-[#1C1D21] font-semibold"
                : "text-[#5B5F6B]"
            }`}
          >
            Preview Document
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Body */}
      <div className="no-print flex flex-1 overflow-hidden" style={{ minHeight: "calc(100vh - 65px)" }}>
        {/* Left: Form Pane (46% width on desktop) */}
        <div
          className={`w-full lg:w-[46%] px-7 py-6 pb-24 overflow-y-auto box-border ${
            mobileTab === "edit" ? "block" : "hidden lg:block"
          }`}
          style={{ maxHeight: "calc(100vh - 65px)" }}
        >
          <div className="max-w-[560px] mx-auto">
            <FormPane
              data={data}
              updatePersonalInfo={updatePersonalInfo}
              updateSummary={updateSummary}
              addExperience={addExperience}
              updateExperience={updateExperience}
              removeExperience={removeExperience}
              moveExperience={moveExperience}
              addProject={addProject}
              updateProject={updateProject}
              removeProject={removeProject}
              moveProject={moveProject}
              addEducation={addEducation}
              updateEducation={updateEducation}
              removeEducation={removeEducation}
              moveEducation={moveEducation}
              addSkillCategory={addSkillCategory}
              updateSkillCategory={updateSkillCategory}
              removeSkillCategory={removeSkillCategory}
              moveSection={moveSection}
              onGenerateSummaryAi={handleGenerateSummaryAi}
              isGeneratingSummary={isGeneratingSummary}
              onImproveExperienceAi={handleImproveExperienceAi}
              onImproveProjectAi={handleImproveProjectAi}
              activeEnhanceId={activeEnhanceId}
            />
          </div>
        </div>

        {/* Right: Preview Pane (54% width on desktop) */}
        <div
          className={`w-full lg:w-[54%] border-l border-[#DAD5C9] ${
            mobileTab === "preview" ? "block" : "hidden lg:block"
          }`}
          style={{ height: "calc(100vh - 65px)" }}
        >
          <PreviewPane data={data} onPrint={handlePrintRequest} />
        </div>
      </div>

      {/* Print-only clone for pixel-perfect PDF export */}
      <div className="print-only">
        <JakesTemplate data={data} />
      </div>

      {/* Print Guidance Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onConfirm={triggerNativePrint}
      />

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
        config={aiConfig}
        onSave={saveAiConfig}
      />

      {/* AI Diff / Review Modal */}
      <AiDiffModal
        isOpen={diffModal.isOpen}
        onClose={() => setDiffModal((prev) => ({ ...prev, isOpen: false }))}
        originalText={diffModal.original}
        enhancedText={diffModal.enhanced}
        title={diffModal.title}
        onApply={diffModal.onApply}
      />

      {/* Resume Import Modal (PDF / DOCX / TXT / JSON) */}
      <ResumeImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        aiConfig={aiConfig}
        onOpenAiSettings={() => setIsAiSettingsOpen(true)}
        onApplyParsedData={(parsedData, mode) => {
          if (mode === "replace") {
            loadResumeData(parsedData);
          } else {
            mergeResumeData(parsedData);
          }
        }}
      />
    </div>
  );
}
