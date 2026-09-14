"use client";

import React, { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { HeaderBar } from "@/components/builder/HeaderBar";
import { FormPane } from "@/components/builder/FormPane";
import { PreviewPane } from "@/components/preview/PreviewPane";
import { JakesTemplate } from "@/components/templates/JakesTemplate";
import { PrintModal } from "@/components/builder/PrintModal";

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
  } = useResume();

  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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
    </div>
  );
}
