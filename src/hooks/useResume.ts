"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ResumeData,
  PersonalInfo,
  ExperienceItem,
  ProjectItem,
  EducationItem,
  SkillCategory,
} from "@/types/resume";
import { defaultResumeData } from "@/lib/defaultData";

const STORAGE_KEY = "antislop_resume_state_v1";

const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

export function useResume() {
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && parsed.personalInfo) {
          setData(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load resume from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage with debounce
  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setLastSaved(new Date());
      } catch (e) {
        console.error("Failed to save resume to localStorage:", e);
      }
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, isLoaded]);

  // Personal Info
  const updatePersonalInfo = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value,
        },
      }));
    },
    []
  );

  // Summary
  const updateSummary = useCallback((summary: string) => {
    setData((prev) => ({ ...prev, summary }));
  }, []);

  // Experience Actions
  const addExperience = useCallback(() => {
    const newItem: ExperienceItem = {
      id: generateId("exp"),
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: "",
    };
    setData((prev) => ({
      ...prev,
      experience: [newItem, ...prev.experience],
    }));
  }, []);

  const updateExperience = useCallback(
    (id: string, field: keyof ExperienceItem, value: any) => {
      setData((prev) => ({
        ...prev,
        experience: prev.experience.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const removeExperience = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  }, []);

  const moveExperience = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => {
      const items = [...prev.experience];
      if (toIndex < 0 || toIndex >= items.length) return prev;
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      return { ...prev, experience: items };
    });
  }, []);

  // Projects Actions
  const addProject = useCallback(() => {
    const newItem: ProjectItem = {
      id: generateId("proj"),
      name: "",
      role: "",
      link: "",
      technologies: "",
      bullets: "",
    };
    setData((prev) => ({
      ...prev,
      projects: [newItem, ...prev.projects],
    }));
  }, []);

  const updateProject = useCallback(
    (id: string, field: keyof ProjectItem, value: any) => {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const removeProject = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  }, []);

  const moveProject = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => {
      const items = [...prev.projects];
      if (toIndex < 0 || toIndex >= items.length) return prev;
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      return { ...prev, projects: items };
    });
  }, []);

  // Education Actions
  const addEducation = useCallback(() => {
    const newItem: EducationItem = {
      id: generateId("edu"),
      school: "",
      degree: "",
      location: "",
      startDate: "",
      endDate: "",
      detail: "",
    };
    setData((prev) => ({
      ...prev,
      education: [newItem, ...prev.education],
    }));
  }, []);

  const updateEducation = useCallback(
    (id: string, field: keyof EducationItem, value: any) => {
      setData((prev) => ({
        ...prev,
        education: prev.education.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const removeEducation = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  }, []);

  const moveEducation = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => {
      const items = [...prev.education];
      if (toIndex < 0 || toIndex >= items.length) return prev;
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      return { ...prev, education: items };
    });
  }, []);

  // Skills Actions
  const addSkillCategory = useCallback(() => {
    const newItem: SkillCategory = {
      id: generateId("skill"),
      category: "Tools & Technologies",
      skills: "",
    };
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, newItem],
    }));
  }, []);

  const updateSkillCategory = useCallback(
    (id: string, field: keyof SkillCategory, value: string) => {
      setData((prev) => ({
        ...prev,
        skills: prev.skills.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const removeSkillCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item.id !== id),
    }));
  }, []);

  // Section Ordering
  const moveSection = useCallback((fromIndex: number, toIndex: number) => {
    setData((prev) => {
      const order = [...prev.sectionOrder];
      if (toIndex < 0 || toIndex >= order.length) return prev;
      const [removed] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, removed);
      return { ...prev, sectionOrder: order };
    });
  }, []);

  // Preset / Reset Actions
  const resetToSample = useCallback(() => {
    setData(defaultResumeData);
  }, []);

  const clearAll = useCallback(() => {
    setData({
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
      },
      summary: "",
      experience: [],
      projects: [],
      education: [],
      skills: [],
      sectionOrder: ["experience", "projects", "education", "skills"],
    });
  }, []);

  // JSON Import & Export
  const exportJSON = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    const fileName = `${data.personalInfo.name || "resume"}.json`
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "_");
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [data]);

  const importJSON = useCallback((imported: any) => {
    if (imported && typeof imported === "object" && imported.personalInfo) {
      setData(imported);
      return true;
    }
    return false;
  }, []);

  const loadResumeData = useCallback((newData: ResumeData) => {
    if (newData && typeof newData === "object" && newData.personalInfo) {
      setData(newData);
      return true;
    }
    return false;
  }, []);

  const mergeResumeData = useCallback((incoming: Partial<ResumeData>) => {
    setData((prev) => {
      const merged: ResumeData = {
        personalInfo: {
          name: incoming.personalInfo?.name || prev.personalInfo.name,
          title: incoming.personalInfo?.title || prev.personalInfo.title,
          email: incoming.personalInfo?.email || prev.personalInfo.email,
          phone: incoming.personalInfo?.phone || prev.personalInfo.phone,
          location: incoming.personalInfo?.location || prev.personalInfo.location,
          website: incoming.personalInfo?.website || prev.personalInfo.website,
          linkedin: incoming.personalInfo?.linkedin || prev.personalInfo.linkedin,
          github: incoming.personalInfo?.github || prev.personalInfo.github,
        },
        summary: incoming.summary || prev.summary,
        experience: [
          ...(incoming.experience || []),
          ...prev.experience,
        ],
        projects: [
          ...(incoming.projects || []),
          ...prev.projects,
        ],
        education: [
          ...(incoming.education || []),
          ...prev.education,
        ],
        skills: [
          ...(incoming.skills || []),
          ...prev.skills,
        ],
        sectionOrder: incoming.sectionOrder || prev.sectionOrder,
      };
      return merged;
    });
  }, []);

  const applyTailoredUpdates = useCallback(
    ({
      summary,
      experiences,
      skillsToAdd,
    }: {
      summary?: string;
      experiences?: Array<{ id: string; bullets: string }>;
      skillsToAdd?: string[];
    }) => {
      setData((prev) => {
        let updatedSummary = prev.summary;
        if (summary !== undefined) {
          updatedSummary = summary;
        }

        let updatedExperience = [...prev.experience];
        if (experiences && experiences.length > 0) {
          const expMap = new Map(experiences.map((e) => [e.id, e.bullets]));
          updatedExperience = updatedExperience.map((item) => {
            if (expMap.has(item.id)) {
              return { ...item, bullets: expMap.get(item.id)! };
            }
            return item;
          });
        }

        let updatedSkills = [...prev.skills];
        if (skillsToAdd && skillsToAdd.length > 0) {
          const newSkillsStr = skillsToAdd.join(", ");
          if (updatedSkills.length > 0) {
            updatedSkills = updatedSkills.map((cat, idx) => {
              if (idx === 0) {
                return {
                  ...cat,
                  skills: cat.skills
                    ? `${cat.skills}, ${newSkillsStr}`
                    : newSkillsStr,
                };
              }
              return cat;
            });
          } else {
            updatedSkills = [
              {
                id: generateId("skill"),
                category: "Target Job Skills",
                skills: newSkillsStr,
              },
            ];
          }
        }

        return {
          ...prev,
          summary: updatedSummary,
          experience: updatedExperience,
          skills: updatedSkills,
        };
      });
    },
    []
  );

  return {
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
  };
}
