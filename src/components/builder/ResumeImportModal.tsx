"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  ClipboardPaste,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  ArrowRight,
  FileCode,
} from "lucide-react";
import { ResumeData } from "@/types/resume";
import { AiConfig } from "@/types/ai";

interface ResumeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiConfig: AiConfig;
  onOpenAiSettings: () => void;
  onApplyParsedData: (data: ResumeData, mode: "replace" | "merge") => void;
}

type ImportTab = "upload" | "paste";
type ImportStep = "input" | "extracting" | "structuring" | "review";

export function ResumeImportModal({
  isOpen,
  onClose,
  aiConfig,
  onOpenAiSettings,
  onApplyParsedData,
}: ResumeImportModalProps) {
  const [activeTab, setActiveTab] = useState<ImportTab>("upload");
  const [step, setStep] = useState<ImportStep>("input");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [extractedRawText, setExtractedRawText] = useState("");
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const hasApiKey =
    aiConfig.provider === "ollama" || Boolean(aiConfig.apiKey?.trim());

  const resetState = () => {
    setStep("input");
    setSelectedFile(null);
    setPastedText("");
    setExtractedRawText("");
    setParsedData(null);
    setErrorMessage(null);
    setStatusMessage("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleStartParsing = async () => {
    setErrorMessage(null);

    // 1. Check for JSON direct backup
    if (activeTab === "upload" && selectedFile?.name.toLowerCase().endsWith(".json")) {
      try {
        const text = await selectedFile.text();
        const json = JSON.parse(text);
        if (json && json.personalInfo) {
          setParsedData(json);
          setStep("review");
          return;
        }
      } catch (err: any) {
        // Not a direct json backup, will fall through to parser
      }
    }

    // 2. Validate input
    if (activeTab === "upload" && !selectedFile) {
      setErrorMessage("Please select a file to import (.pdf, .docx, .txt, or .json).");
      return;
    }
    if (activeTab === "paste" && !pastedText.trim()) {
      setErrorMessage("Please paste your resume text before proceeding.");
      return;
    }

    // 3. Step 1: Extract Text from Document
    setStep("extracting");
    setStatusMessage(
      activeTab === "upload"
        ? `Extracting text from ${selectedFile?.name}...`
        : "Preparing resume text..."
    );

    let rawText = "";

    try {
      if (activeTab === "upload" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const parseRes = await fetch("/api/parse", {
          method: "POST",
          body: formData,
        });

        const parseJson = await parseRes.json();
        if (!parseRes.ok || !parseJson.success) {
          throw new Error(
            parseJson.error || "Failed to extract text from the uploaded file."
          );
        }

        if (parseJson.isDirectResumeJson && parseJson.directResumeData) {
          setParsedData(parseJson.directResumeData);
          setStep("review");
          return;
        }

        rawText = parseJson.text;
      } else {
        rawText = pastedText.trim();
      }

      setExtractedRawText(rawText);

      // 4. Step 2: AI Structuring into ResumeData
      if (!hasApiKey) {
        setErrorMessage(
          "An AI API key is required to automatically structure resume fields. Please configure your key in AI Settings."
        );
        setStep("input");
        return;
      }

      setStep("structuring");
      setStatusMessage(
        "AI is analyzing your experience, skills, and formatting..."
      );

      const aiRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "parse-resume",
          provider: aiConfig.provider,
          apiKey: aiConfig.apiKey,
          model: aiConfig.model,
          ollamaUrl: aiConfig.ollamaUrl,
          content: rawText,
        }),
      });

      const aiJson = await aiRes.json();
      if (!aiRes.ok || !aiJson.success) {
        throw new Error(
          aiJson.error || "AI was unable to parse the resume structure."
        );
      }

      if (aiJson.parsedResume) {
        setParsedData(aiJson.parsedResume);
        setStep("review");
      } else {
        throw new Error("No structured data returned by the AI.");
      }
    } catch (err: any) {
      console.error("Resume import error:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred while parsing your resume."
      );
      setStep("input");
    }
  };

  const handleApply = (mode: "replace" | "merge") => {
    if (!parsedData) return;
    onApplyParsedData(parsedData, mode);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 no-print animate-in fade-in duration-150">
      <div className="bg-[#FCFBF9] border border-[#DAD5C9] rounded-md shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#DAD5C9] bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#28344E]/10 flex items-center justify-center text-[#28344E]">
              <UploadCloud size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#1C1D21] tracking-tight">
                Import Resume
              </h2>
              <p className="text-[12px] text-[#5B5F6B]">
                Upload a PDF, DOCX, TXT, or JSON file to auto-populate the builder
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
          {/* AI Notice if unconfigured */}
          {!hasApiKey && step === "input" && (
            <div className="bg-[#FAF7E8] border border-[#E5D7A3] rounded p-3.5 flex items-start gap-3 text-[12.5px] text-[#524419]">
              <AlertCircle size={17} className="mt-0.5 text-[#B8871E] shrink-0" />
              <div className="flex-1">
                <span className="font-semibold text-[#3C3212]">
                  AI Provider not configured:
                </span>{" "}
                To convert PDF/Word text into structured experience and skills, configure a free Gemini key or your preferred provider.
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

          {/* STEP: INPUT */}
          {step === "input" && (
            <>
              {/* Tab Switcher */}
              <div className="flex border-b border-[#DAD5C9]">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`pb-2.5 px-4 text-[13px] font-medium border-b-2 transition flex items-center gap-2 ${
                    activeTab === "upload"
                      ? "border-[#28344E] text-[#28344E]"
                      : "border-transparent text-[#5B5F6B] hover:text-[#1C1D21]"
                  }`}
                >
                  <FileText size={15} />
                  Upload Document
                </button>
                <button
                  onClick={() => setActiveTab("paste")}
                  className={`pb-2.5 px-4 text-[13px] font-medium border-b-2 transition flex items-center gap-2 ${
                    activeTab === "paste"
                      ? "border-[#28344E] text-[#28344E]"
                      : "border-transparent text-[#5B5F6B] hover:text-[#1C1D21]"
                  }`}
                >
                  <ClipboardPaste size={15} />
                  Paste Text
                </button>
              </div>

              {/* Upload Tab */}
              {activeTab === "upload" && (
                <div className="space-y-3">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                      isDragOver
                        ? "border-[#28344E] bg-[#28344E]/5"
                        : "border-[#DAD5C9] hover:border-[#5B5F6B] bg-white"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt,.json,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/json"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="w-12 h-12 rounded-full bg-[#F3F2EF] border border-[#DAD5C9] flex items-center justify-center text-[#28344E]">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-medium text-[#1C1D21]">
                        {selectedFile ? selectedFile.name : "Click to select or drag and drop your resume"}
                      </p>
                      <p className="text-[11.5px] text-[#5B5F6B] mt-1">
                        Supports PDF (.pdf), Word (.docx), Plain Text (.txt), or JSON (.json) up to 10MB
                      </p>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="flex items-center justify-between p-2.5 bg-white border border-[#DAD5C9] rounded text-[12px]">
                      <div className="flex items-center gap-2 text-[#28344E] font-medium truncate">
                        <FileCode size={15} />
                        <span className="truncate">{selectedFile.name}</span>
                        <span className="text-[#5B5F6B] font-normal">
                          ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-[#9A5142] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Paste Tab */}
              {activeTab === "paste" && (
                <div className="space-y-2">
                  <label className="text-[11.5px] font-medium uppercase tracking-wider text-[#5B5F6B]">
                    Paste Resume or LinkedIn Text
                  </label>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste full resume text here, including contact info, work history, skills, and education..."
                    rows={10}
                    className="w-full bg-white border border-[#DAD5C9] rounded p-3 text-[13px] text-[#1C1D21] font-mono placeholder:font-sans placeholder:text-[#9A9CA3] focus:outline-none focus:border-[#28344E]"
                  />
                  <p className="text-[11px] text-[#5B5F6B]">
                    Tip: You can copy and paste directly from your LinkedIn profile or a plain text document.
                  </p>
                </div>
              )}
            </>
          )}

          {/* STEP: EXTRACTING & STRUCTURING (LOADING) */}
          {(step === "extracting" || step === "structuring") && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-[#28344E]/10 flex items-center justify-center text-[#28344E]">
                  <Loader2 size={28} className="animate-spin text-[#28344E]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#DAD5C9] flex items-center justify-center text-[#28344E]">
                  <Sparkles size={13} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-[15px] font-semibold text-[#1C1D21]">
                  {step === "extracting"
                    ? "Reading Document..."
                    : "Structuring Resume with AI..."}
                </h3>
                <p className="text-[12.5px] text-[#5B5F6B] max-w-sm">
                  {statusMessage}
                </p>
              </div>
            </div>
          )}

          {/* STEP: REVIEW & CONFIRM */}
          {step === "review" && parsedData && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#2E7D32] bg-[#EBF5ED] border border-[#C8E6C9] p-3 rounded text-[13px]">
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="font-medium">
                  Resume successfully parsed and structured!
                </span>
              </div>

              {/* Extraction Snapshot Card */}
              <div className="bg-white border border-[#DAD5C9] rounded-md p-4 space-y-3.5">
                <div className="border-b border-[#DAD5C9] pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-[#5B5F6B] block">
                    Candidate Profile
                  </span>
                  <div className="text-[16px] font-bold text-[#1C1D21] mt-0.5">
                    {parsedData.personalInfo.name || "(Name not detected)"}
                  </div>
                  <div className="text-[13px] text-[#28344E] font-medium">
                    {parsedData.personalInfo.title || "(Title not detected)"}
                  </div>
                  <div className="text-[11.5px] text-[#5B5F6B] mt-1">
                    {[
                      parsedData.personalInfo.email,
                      parsedData.personalInfo.phone,
                      parsedData.personalInfo.location,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "No contact info detected"}
                  </div>
                </div>

                {/* Summary snippet */}
                {parsedData.summary && (
                  <div className="border-b border-[#DAD5C9] pb-3">
                    <span className="text-[11px] uppercase tracking-wider text-[#5B5F6B] block mb-1">
                      Professional Summary
                    </span>
                    <p className="text-[12px] text-[#2B2C30] italic line-clamp-2">
                      &ldquo;{parsedData.summary}&rdquo;
                    </p>
                  </div>
                )}

                {/* Grid of detected counts */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[#F3F2EF] p-2.5 rounded border border-[#DAD5C9]/70">
                    <div className="text-[17px] font-bold text-[#28344E]">
                      {parsedData.experience?.length || 0}
                    </div>
                    <div className="text-[11px] text-[#5B5F6B]">Work Roles</div>
                  </div>
                  <div className="bg-[#F3F2EF] p-2.5 rounded border border-[#DAD5C9]/70">
                    <div className="text-[17px] font-bold text-[#28344E]">
                      {parsedData.projects?.length || 0}
                    </div>
                    <div className="text-[11px] text-[#5B5F6B]">Projects</div>
                  </div>
                  <div className="bg-[#F3F2EF] p-2.5 rounded border border-[#DAD5C9]/70">
                    <div className="text-[17px] font-bold text-[#28344E]">
                      {parsedData.education?.length || 0}
                    </div>
                    <div className="text-[11px] text-[#5B5F6B]">Education</div>
                  </div>
                </div>

                {/* Skills tags preview */}
                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#5B5F6B] block mb-1.5">
                      Identified Skills ({parsedData.skills.length} categories)
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {parsedData.skills.map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-[#FAFAF8] border border-[#DAD5C9] px-2 py-0.5 rounded text-[11px] text-[#28344E]"
                        >
                          <strong>{cat.category}:</strong> {cat.skills}
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
                Back / Choose Different File
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApply("merge")}
                  className="px-3.5 py-1.5 text-[12.5px] font-medium text-[#28344E] bg-white border border-[#DAD5C9] hover:bg-[#F3F2EF] rounded transition"
                  title="Appends new roles and projects to your current resume without wiping current details"
                >
                  Merge with Existing
                </button>
                <button
                  onClick={() => handleApply("replace")}
                  className="px-4 py-1.5 text-[12.5px] font-semibold text-[#F3F2EF] bg-[#28344E] hover:bg-[#1E273A] rounded transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Replace Resume</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleClose}
                disabled={step === "extracting" || step === "structuring"}
                className="px-3.5 py-1.5 text-[12.5px] text-[#5B5F6B] hover:text-[#1C1D21] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStartParsing}
                disabled={
                  step === "extracting" ||
                  step === "structuring" ||
                  (activeTab === "upload" && !selectedFile) ||
                  (activeTab === "paste" && !pastedText.trim())
                }
                className="px-4 py-1.5 text-[12.5px] font-semibold text-[#F3F2EF] bg-[#28344E] hover:bg-[#1E273A] disabled:opacity-50 disabled:cursor-not-allowed rounded transition flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles size={14} />
                <span>Parse & Structure Resume</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
