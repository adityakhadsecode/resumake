"use client";

import { useState, useEffect, useCallback } from "react";
import { ResumeDesign, TemplateId, FontFamily, SpacingDensity, FontScale } from "@/types/template";

const STORAGE_KEY = "antislop_resume_design_v1";

export const defaultResumeDesign: ResumeDesign = {
  templateId: "jakes",
  fontFamily: "georgia",
  accentColor: "#28344E",
  density: "normal",
  fontScale: "normal",
};

export function useResumeDesign() {
  const [design, setDesign] = useState<ResumeDesign>(defaultResumeDesign);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load design preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && parsed.templateId) {
          setDesign({ ...defaultResumeDesign, ...parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load resume design from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update design state and persist to localStorage
  const updateDesign = useCallback((updates: Partial<ResumeDesign>) => {
    setDesign((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save resume design to localStorage:", e);
      }
      return next;
    });
  }, []);

  const setTemplate = useCallback((templateId: TemplateId) => {
    updateDesign({ templateId });
  }, [updateDesign]);

  const setFontFamily = useCallback((fontFamily: FontFamily) => {
    updateDesign({ fontFamily });
  }, [updateDesign]);

  const setAccentColor = useCallback((accentColor: string) => {
    updateDesign({ accentColor });
  }, [updateDesign]);

  const setDensity = useCallback((density: SpacingDensity) => {
    updateDesign({ density });
  }, [updateDesign]);

  const setFontScale = useCallback((fontScale: FontScale) => {
    updateDesign({ fontScale });
  }, [updateDesign]);

  const resetDesign = useCallback(() => {
    setDesign(defaultResumeDesign);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear resume design from localStorage:", e);
    }
  }, []);

  return {
    design,
    isLoaded,
    updateDesign,
    setTemplate,
    setFontFamily,
    setAccentColor,
    setDensity,
    setFontScale,
    resetDesign,
  };
}
