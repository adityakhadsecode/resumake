"use client";

import React, { useState, useEffect } from "react";
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
import { JobTailorModal } from "@/components/builder/JobTailorModal";
import { LatexEditorPane } from "@/components/builder/LatexEditorPane";
import { ConfirmModal } from "@/components/builder/ConfirmModal";
import { ExperienceItem, ProjectItem } from "@/types/resume";
import { resumeToTex } from "@/lib/export/texMapper";
import { resumeToTxt } from "@/lib/export/txtMapper";
import { resumeToDocx } from "@/lib/export/docxMapper";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadText(text: string, filename: string, mimeType: string = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mimeType });
  downloadBlob(blob, filename);
}

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
    applyTailoredUpdates,
  } = useResume();

  const { config: aiConfig, isConfigured: isAiConfigured, saveConfig: saveAiConfig } = useAiConfig();

  // Navigation & View Mode State
  const [activeMode, setActiveMode] = useState<"form" | "latex">("form");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  // LaTeX State
  const [texCode, setTexCode] = useState("");
  const [isTexDirty, setIsTexDirty] = useState(false);
  const [isCompilingLatex, setIsCompilingLatex] = useState(false);
  const [compileError, setCompileError] = useState<{ error: string; stderr: string } | null>(null);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);

  // Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);

  // Confirmation Modal State (for unsaved LaTeX edits)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

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

  // Sync LaTeX code when resume data changes and user has not diverged
  useEffect(() => {
    if (!isTexDirty && data) {
      setTexCode(resumeToTex(data));
    }
  }, [data, isTexDirty]);

  // Candidate file base name helper
  const getFileBaseName = () => {
    return (data.personalInfo.name || "Resume")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
  };

  // Mode Switch with dirty-flag protection
  const handleModeChange = (targetMode: "form" | "latex") => {
    if (targetMode === activeMode) return;

    if (activeMode === "latex" && isTexDirty) {
      setConfirmModal({
        isOpen: true,
        title: "Unsaved LaTeX Changes",
        message:
          "You have made manual edits to the LaTeX code. Switching back to the Form view will preserve your form data, but form edits will not reflect in your custom LaTeX until you sync. Switch to Form view?",
        onConfirm: () => {
          setActiveMode(targetMode);
        },
      });
      return;
    }

    if (targetMode === "latex" && !isTexDirty) {
      setTexCode(resumeToTex(data));
    }

    setActiveMode(targetMode);
  };

  // Compile LaTeX helper
  const compileLatexInternal = async (
    sourceCode: string
  ): Promise<{ success: boolean; blob?: Blob; error?: string; stderr?: string }> => {
    setIsCompilingLatex(true);
    setCompileError(null);

    try {
      const res = await fetch("/api/compile-tex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tex: sourceCode }),
      });

      if (res.ok) {
        const blob = await res.blob();
        return { success: true, blob };
      } else {
        const errJson = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errJson.error || "Compilation failed",
          stderr: errJson.stderr || res.statusText,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to reach compilation server",
        stderr: err.stack || err.message,
      };
    } finally {
      setIsCompilingLatex(false);
    }
  };

  // Recompile handler from LaTeX Editor
  const handleRecompileLatex = async () => {
    const res = await compileLatexInternal(texCode);
    if (res.success && res.blob) {
      if (compiledPdfUrl) {
        URL.revokeObjectURL(compiledPdfUrl);
      }
      const url = URL.createObjectURL(res.blob);
      setCompiledPdfUrl(url);
      setCompileError(null);
    } else {
      setCompileError({
        error: res.error || "Compilation failed",
        stderr: res.stderr || "",
      });
    }
  };

  // ==================== EXPORT HANDLERS ====================

  // 1. JSON Export
  const handleExportJson = () => {
    exportJSON();
  };

  // 2. TXT Export
  const handleExportTxt = () => {
    const txt = resumeToTxt(data);
    downloadText(txt, `${getFileBaseName()}_Resume.txt`);
  };

  // 3. TEX Source Export
  const handleExportTex = () => {
    const code = activeMode === "latex" && texCode ? texCode : resumeToTex(data);
    downloadText(code, `${getFileBaseName()}_Resume.tex`, "application/x-tex;charset=utf-8");
  };

  // 4. DOCX Export
  const handleExportDocx = async () => {
    try {
      const blob = await resumeToDocx(data);
      downloadBlob(blob, `${getFileBaseName()}_Resume.docx`);
    } catch (err: any) {
      console.error("DOCX generation error:", err);
      alert("Failed to generate Word document: " + err.message);
    }
  };

  // 5. PDF (LaTeX Engine) Export
  const handleExportLatexPdf = async () => {
    const code = activeMode === "latex" && texCode ? texCode : resumeToTex(data);
    const res = await compileLatexInternal(code);
    if (res.success && res.blob) {
      downloadBlob(res.blob, `${getFileBaseName()}_Resume.pdf`);
    } else {
      setCompileError({
        error: res.error || "Compilation failed",
        stderr: res.stderr || "",
      });
      alert(
        res.error ||
          "LaTeX compilation failed. If editing LaTeX source, check the inline error drawer for details."
      );
    }
  };

  // 6. PDF (Print Engine) Export
  const triggerNativePrint = () => {
    const originalTitle = document.title;
    document.title = `${getFileBaseName()}_Resume`;
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

  // ==================== AI HANDLERS ====================

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
        activeMode={activeMode}
        onModeChange={handleModeChange}
        onPrint={handlePrintRequest}
        onReset={resetToSample}
        onClear={clearAll}
        onExportJson={handleExportJson}
        onExportTxt={handleExportTxt}
        onExportTex={handleExportTex}
        onExportDocx={handleExportDocx}
        onExportLatexPdf={handleExportLatexPdf}
        isCompilingLatex={isCompilingLatex}
        onImportJSON={importJSON}
        onOpenAiSettings={() => setIsAiSettingsOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenTailorModal={() => setIsTailorModalOpen(true)}
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
            {activeMode === "latex" ? "LaTeX Source" : "Edit Form"}
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
        {/* Left Pane (46% width on desktop) */}
        <div
          className={`w-full lg:w-[46%] ${
            activeMode === "form" ? "px-7 py-6 pb-24 overflow-y-auto box-border" : "overflow-hidden"
          } ${mobileTab === "edit" ? "block" : "hidden lg:block"}`}
          style={{ maxHeight: "calc(100vh - 65px)" }}
        >
          {activeMode === "form" ? (
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
          ) : (
            <LatexEditorPane
              texCode={texCode}
              isDirty={isTexDirty}
              onTexChange={(newCode) => {
                setTexCode(newCode);
                setIsTexDirty(true);
              }}
              onRecompile={handleRecompileLatex}
              onResetFromForm={() => {
                if (isTexDirty) {
                  setConfirmModal({
                    isOpen: true,
                    title: "Sync from Form Data?",
                    message:
                      "You have manual edits in your LaTeX source. Syncing will overwrite your LaTeX code with current form values. Proceed?",
                    onConfirm: () => {
                      setTexCode(resumeToTex(data));
                      setIsTexDirty(false);
                      setCompileError(null);
                    },
                  });
                } else {
                  setTexCode(resumeToTex(data));
                  setCompileError(null);
                }
              }}
              onDownloadTex={handleExportTex}
              onDownloadCompiledPdf={handleExportLatexPdf}
              isCompiling={isCompilingLatex}
              compileError={compileError}
              hasCompiledPdf={Boolean(compiledPdfUrl)}
            />
          )}
        </div>

        {/* Right Pane: Preview (54% width on desktop) */}
        <div
          className={`w-full lg:w-[54%] border-l border-[#DAD5C9] ${
            mobileTab === "preview" ? "block" : "hidden lg:block"
          }`}
          style={{ height: "calc(100vh - 65px)" }}
        >
          {activeMode === "latex" && compiledPdfUrl ? (
            <div className="w-full h-full flex flex-col bg-[#525659]">
              <div className="bg-[#FAFAF8] border-b border-[#DAD5C9] px-4 py-2 flex items-center justify-between text-[12px] text-[#5B5F6B]">
                <span className="font-semibold text-[#28344E]">Tectonic Compiled PDF Preview</span>
                <button
                  type="button"
                  onClick={() => setCompiledPdfUrl(null)}
                  className="hover:underline text-[#5B5F6B]"
                >
                  View HTML Document
                </button>
              </div>
              <iframe
                src={compiledPdfUrl}
                className="w-full flex-1 border-none"
                title="Tectonic PDF Preview"
              />
            </div>
          ) : (
            <PreviewPane data={data} onPrint={handlePrintRequest} />
          )}
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

      {/* Confirmation Modal for dirty LaTeX state */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel="Switch Anyway"
        cancelLabel="Stay Here"
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

      {/* AI Job Tailor Modal */}
      <JobTailorModal
        isOpen={isTailorModalOpen}
        onClose={() => setIsTailorModalOpen(false)}
        resumeData={data}
        aiConfig={aiConfig}
        onOpenAiSettings={() => setIsAiSettingsOpen(true)}
        onApplyTailored={applyTailoredUpdates}
      />
    </div>
  );
}
