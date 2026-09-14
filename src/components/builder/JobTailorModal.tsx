"use client";

import React, { useState } from "react";
import {
  Target,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  ArrowRight,
  Check,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ResumeData } from "@/types/resume";
import { AiConfig, TailorResumeResult } from "@/types/ai";

interface JobTailorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  aiConfig: AiConfig;
  onOpenAiSettings: () => void;
  onApplyTailored: (updates: {
    summary?: string;
    experiences?: Array<{ id: string; bullets: string }>;
    skillsToAdd?: string[];
  }) => void;
}

const SAMPLE_JOB_DESCRIPTION = `Senior Full-Stack Engineer — Acme Cloud Solutions
Location: Remote (US / Global)

About the Role:
We are looking for a Senior Full-Stack Engineer to architect and scale our real-time collaboration engine. You will design mission-critical microservices, optimize browser-side rendering performance, and mentor a distributed team of engineers.

Key Responsibilities:
• Architect high-throughput distributed APIs using TypeScript, Node.js, and PostgreSQL.
• Build responsive, accessible frontend interfaces with Next.js, React 19, and Tailwind CSS.
• Optimize database query performance, reducing p99 latency across core customer workflows.
• Implement robust CI/CD pipelines, Docker containerization, and AWS infrastructure (ECS, Lambda, S3).
• Champion engineering excellence, automated testing, and agile design sprints.

Requirements:
• 4+ years of professional full-stack software development experience.
• Mastery of TypeScript, React, Next.js, and modern CSS architectures.
• Proven track record of improving system scalability and reducing latency.
• Strong written and verbal communication skills.`;

export function JobTailorModal({
  isOpen,
  onClose,
  resumeData,
  aiConfig,
  onOpenAiSettings,
  onApplyTailored,
}: JobTailorModalProps) {
  const [step, setStep] = useState<"input" | "analyzing" | "review">("input");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<TailorResumeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User selections in review step
  const [selectedSummary, setSelectedSummary] = useState(true);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<
    Record<string, boolean>
  >({});
  const [selectedSkills, setSelectedSkills] = useState(true);

  // Accordion toggle states
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({ summary: true });

  if (!isOpen) return null;

  const hasApiKey =
    aiConfig.provider === "ollama" || Boolean(aiConfig.apiKey?.trim());

  const resetState = () => {
    setStep("input");
    setJobDescription("");
    setResult(null);
    setErrorMessage(null);
    setSelectedSummary(true);
    setSelectedExperienceIds({});
    setSelectedSkills(true);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleStartTailoring = async () => {
    if (!jobDescription.trim()) {
      setErrorMessage("Please paste a target job description to begin.");
      return;
    }

    if (!hasApiKey) {
      setErrorMessage(
        "An AI API key is required to tailor your resume. Please configure your key in AI Settings."
      );
      return;
    }

    setErrorMessage(null);
    setStep("analyzing");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tailor-resume",
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey,
          model: aiConfig.model,
          ollamaUrl: aiConfig.ollamaUrl,
          content: jobDescription.trim(),
          context: {
            resumeData,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.tailorResult) {
        throw new Error(
          json.error || "Failed to analyze and tailor the resume."
        );
      }

      const tailorData: TailorResumeResult = json.tailorResult;
      setResult(tailorData);

      // Pre-select all tailored experiences by default
      const expSelection: Record<string, boolean> = {};
      tailorData.tailoredExperiences.forEach((exp) => {
        expSelection[exp.id] = true;
      });
      setSelectedExperienceIds(expSelection);

      setStep("review");
    } catch (err: any) {
      console.error("Tailor resume error:", err);
      setErrorMessage(
        err?.message || "An error occurred while tailoring your resume."
      );
      setStep("input");
    }
  };

  const handleApply = () => {
    if (!result) return;

    const experiencesToUpdate = result.tailoredExperiences
      .filter((exp) => selectedExperienceIds[exp.id])
      .map((exp) => ({ id: exp.id, bullets: exp.tailoredBullets }));

    onApplyTailored({
      summary: selectedSummary ? result.tailoredSummary : undefined,
      experiences: experiencesToUpdate,
      skillsToAdd: selectedSkills ? result.suggestedSkillsAdditions : undefined,
    });

    handleClose();
  };

  const toggleAccordion = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalSelectedCount =
    (selectedSummary ? 1 : 0) +
    Object.values(selectedExperienceIds).filter(Boolean).length +
    (selectedSkills && (result?.suggestedSkillsAdditions?.length || 0) > 0 ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 no-print animate-in fade-in duration-150">
      <div className="bg-[#FCFBF9] border border-[#DAD5C9] rounded-md shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#DAD5C9] bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#28344E]/10 flex items-center justify-center text-[#28344E]">
              <Target size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#1C1D21] tracking-tight">
                Tailor Resume to Job Posting
              </h2>
              <p className="text-[12px] text-[#5B5F6B]">
                Analyze ATS keywords and re-tailor bullets to match the job requirements
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#5B5F6B] hover:text-[#1C1D21] p-1.5 rounded hover:bg-black/5 transition"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* AI Unconfigured Warning */}
          {!hasApiKey && step === "input" && (
            <div className="bg-[#FAF7E8] border border-[#E5D7A3] rounded p-3.5 flex items-start gap-3 text-[12.5px] text-[#524419]">
              <AlertCircle size={17} className="mt-0.5 text-[#B8871E] shrink-0" />
              <div className="flex-1">
                <span className="font-semibold text-[#3C3212]">
                  AI Provider not configured:
                </span>{" "}
                To run the ATS keyword matcher and tailored bullet rewriter, please set up a free Gemini key or your chosen provider in AI Settings.
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAiSettings();
                }}
                className="text-[12px] font-semibold text-[#28344E] hover:underline flex items-center gap-1 shrink-0 mt-0.5"
              >
                <Settings size={13} />
                AI Settings
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-[#FCEDEA] border border-[#F0BCB4] rounded p-3 text-[12.5px] text-[#9A5142] flex items-start gap-2.5">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* STEP: INPUT JOB DESCRIPTION */}
          {step === "input" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[11.5px] font-medium uppercase tracking-wider text-[#5B5F6B]">
                  Paste Target Job Description (JD)
                </label>
                <button
                  type="button"
                  onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
                  className="text-[12px] text-[#28344E] hover:underline cursor-pointer"
                >
                  Insert Sample Job Posting
                </button>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here (title, requirements, responsibilities, tech stack)..."
                rows={12}
                className="w-full bg-white border border-[#DAD5C9] rounded p-3 text-[13px] text-[#1C1D21] placeholder:text-[#9A9CA3] focus:outline-none focus:border-[#28344E] leading-relaxed"
              />

              <div className="flex items-center justify-between text-[11.5px] text-[#5B5F6B]">
                <span>
                  Tip: Include the responsibilities and requirements sections for the highest keyword accuracy.
                </span>
                <span>{jobDescription.length} characters</span>
              </div>
            </div>
          )}

          {/* STEP: ANALYZING (LOADING) */}
          {step === "analyzing" && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#28344E]/10 flex items-center justify-center text-[#28344E]">
                  <Loader2 size={32} className="animate-spin text-[#28344E]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#DAD5C9] flex items-center justify-center text-[#28344E]">
                  <Sparkles size={13} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-semibold text-[#1C1D21]">
                  Analyzing Job Posting & Resume...
                </h3>
                <p className="text-[12.5px] text-[#5B5F6B] max-w-md">
                  Matching hard skills, calculating ATS relevance, and rewriting accomplishments using the Google XYZ formula...
                </p>
              </div>
            </div>
          )}

          {/* STEP: REVIEW & SELECTIVE APPLICATION */}
          {step === "review" && result && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* ATS Match Score Card */}
              <div className="bg-white border border-[#DAD5C9] rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#5B5F6B] block">
                    ATS Keyword Compatibility
                  </span>
                  <p className="text-[13px] text-[#1C1D21] font-medium leading-relaxed">
                    {result.summaryAnalysis}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 self-center sm:self-auto bg-[#F3F2EF] border border-[#DAD5C9] rounded-lg px-4 py-2.5">
                  <div className="text-right">
                    <div className="text-[20px] font-bold text-[#28344E] leading-none">
                      {result.matchScore}%
                    </div>
                    <div className="text-[10.5px] text-[#5B5F6B] uppercase font-medium mt-0.5">
                      Match Score
                    </div>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      result.matchScore >= 75
                        ? "bg-emerald-600"
                        : result.matchScore >= 50
                        ? "bg-amber-500"
                        : "bg-[#9A5142]"
                    }`}
                  />
                </div>
              </div>

              {/* Keywords Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Matched Keywords */}
                <div className="bg-white border border-[#DAD5C9] rounded-md p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2E7D32]">
                    <Check size={14} />
                    <span>Matched Keywords ({result.matchedKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {result.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-[#EBF5ED] border border-[#C8E6C9] text-[#2E7D32] px-2 py-0.5 rounded text-[11px] font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing / High-Impact Keywords */}
                <div className="bg-white border border-[#DAD5C9] rounded-md p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9A5142]">
                    <Plus size={14} />
                    <span>Target Keywords to Emphasize ({result.missingKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {result.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-[#FCEDEA] border border-[#F0BCB4] text-[#9A5142] px-2 py-0.5 rounded text-[11px] font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tailored Changes Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#DAD5C9] pb-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[#28344E]">
                    Proposed Tailored Content
                  </span>
                  <span className="text-[11.5px] text-[#5B5F6B]">
                    Select which sections to apply
                  </span>
                </div>

                {/* 1. Tailored Summary Accordion */}
                <div className="border border-[#DAD5C9] rounded-md bg-white overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#FAFAF8] border-b border-[#DAD5C9]">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none text-[13px] font-medium text-[#1C1D21]">
                      <input
                        type="checkbox"
                        checked={selectedSummary}
                        onChange={(e) => setSelectedSummary(e.target.checked)}
                        className="rounded border-[#DAD5C9] text-[#28344E] focus:ring-0 cursor-pointer"
                      />
                      <span>Tailor Professional Summary</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleAccordion("summary")}
                      className="text-[#5B5F6B] hover:text-[#1C1D21] p-1"
                    >
                      {expandedSections["summary"] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>

                  {expandedSections["summary"] && (
                    <div className="p-3.5 space-y-2.5 text-[12.5px]">
                      <div>
                        <span className="text-[10.5px] uppercase font-semibold text-[#5B5F6B] block mb-1">
                          Tailored Output (Targeted to JD):
                        </span>
                        <div className="p-2.5 bg-[#FAFAF8] border border-[#DAD5C9] rounded text-[#1C1D21] leading-relaxed">
                          {result.tailoredSummary}
                        </div>
                      </div>
                      {resumeData.summary && (
                        <div>
                          <span className="text-[10.5px] uppercase font-semibold text-[#9A9CA3] block mb-1">
                            Current Summary:
                          </span>
                          <div className="p-2 text-[#5B5F6B] line-clamp-2 italic text-[12px]">
                            &ldquo;{resumeData.summary}&rdquo;
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Tailored Experiences Accordions */}
                {result.tailoredExperiences.map((exp) => {
                  const isChecked = Boolean(selectedExperienceIds[exp.id]);
                  const isExpanded = Boolean(expandedSections[exp.id]);

                  return (
                    <div
                      key={exp.id}
                      className="border border-[#DAD5C9] rounded-md bg-white overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#FAFAF8] border-b border-[#DAD5C9]">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none text-[13px] font-medium text-[#1C1D21]">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              setSelectedExperienceIds((prev) => ({
                                ...prev,
                                [exp.id]: e.target.checked,
                              }))
                            }
                            className="rounded border-[#DAD5C9] text-[#28344E] focus:ring-0 cursor-pointer"
                          />
                          <span>
                            Tailor Highlights for{" "}
                            <strong>{exp.role || "Role"}</strong> at{" "}
                            <strong>{exp.company || "Company"}</strong>
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => toggleAccordion(exp.id)}
                          className="text-[#5B5F6B] hover:text-[#1C1D21] p-1"
                        >
                          {isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="p-3.5 space-y-2.5 text-[12.5px]">
                          <div>
                            <span className="text-[10.5px] uppercase font-semibold text-[#5B5F6B] block mb-1">
                              Tailored Highlights (Google XYZ Formula):
                            </span>
                            <div className="p-2.5 bg-[#FAFAF8] border border-[#DAD5C9] rounded text-[#1C1D21] font-mono text-[12px] whitespace-pre-line leading-relaxed">
                              {exp.tailoredBullets}
                            </div>
                          </div>
                          {exp.originalBullets && (
                            <div>
                              <span className="text-[10.5px] uppercase font-semibold text-[#9A9CA3] block mb-1">
                                Current Bullets:
                              </span>
                              <div className="p-2 text-[#5B5F6B] font-mono text-[11.5px] whitespace-pre-line line-clamp-3">
                                {exp.originalBullets}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* 3. Suggested Skills Additions */}
                {result.suggestedSkillsAdditions &&
                  result.suggestedSkillsAdditions.length > 0 && (
                    <div className="border border-[#DAD5C9] rounded-md bg-white p-3.5">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none text-[13px] font-medium text-[#1C1D21] mb-2">
                        <input
                          type="checkbox"
                          checked={selectedSkills}
                          onChange={(e) => setSelectedSkills(e.target.checked)}
                          className="rounded border-[#DAD5C9] text-[#28344E] focus:ring-0 cursor-pointer"
                        />
                        <span>Add High-Value Target Skills to Skills Section</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5 pl-6">
                        {result.suggestedSkillsAdditions.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FAFAF8] border border-[#DAD5C9] text-[#28344E] px-2 py-0.5 rounded text-[11px]"
                          >
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#DAD5C9] bg-[#FAFAF8] flex items-center justify-between">
          {step === "review" ? (
            <>
              <button
                onClick={() => setStep("input")}
                className="px-3.5 py-1.5 text-[12.5px] text-[#5B5F6B] hover:text-[#1C1D21] border border-[#DAD5C9] rounded hover:bg-white transition"
              >
                Back to Job Description
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="px-3.5 py-1.5 text-[12.5px] text-[#5B5F6B] hover:text-[#1C1D21] transition"
                >
                  Discard
                </button>
                <button
                  onClick={handleApply}
                  disabled={totalSelectedCount === 0}
                  className="px-4 py-1.5 text-[12.5px] font-semibold text-[#F3F2EF] bg-[#28344E] hover:bg-[#1E273A] disabled:opacity-50 disabled:cursor-not-allowed rounded transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Apply Selected Changes ({totalSelectedCount})</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleClose}
                disabled={step === "analyzing"}
                className="px-3.5 py-1.5 text-[12.5px] text-[#5B5F6B] hover:text-[#1C1D21] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartTailoring}
                disabled={step === "analyzing" || !jobDescription.trim()}
                className="px-4 py-1.5 text-[12.5px] font-semibold text-[#F3F2EF] bg-[#28344E] hover:bg-[#1E273A] disabled:opacity-50 disabled:cursor-not-allowed rounded transition flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles size={14} />
                <span>Analyze & Tailor Resume</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
