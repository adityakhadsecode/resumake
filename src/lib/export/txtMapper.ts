import { ResumeData } from "@/types/resume";

/**
 * Pure function rendering ResumeData as clean, human-readable plain text without any markup.
 * Designed for direct copy-pasting into ATS job application portals or plain-text emails.
 */
export function resumeToTxt(data: ResumeData): string {
  const { personalInfo, summary, experience, projects, education, skills, sectionOrder } = data;
  const sections: string[] = [];

  // Header
  const headerLines: string[] = [];
  if (personalInfo.name) {
    headerLines.push(personalInfo.name.toUpperCase());
  }
  if (personalInfo.title) {
    headerLines.push(personalInfo.title);
  }

  const contactParts: string[] = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    headerLines.push(contactParts.join(" | "));
  }

  sections.push(headerLines.join("\n"));

  const divider = "=".repeat(40);

  // Summary
  const renderSummary = () => {
    if (!summary || !summary.trim()) return "";
    return `\n${divider}\nPROFESSIONAL SUMMARY\n${divider}\n${summary.trim()}`;
  };

  // Experience
  const renderExperience = () => {
    if (!experience || experience.length === 0) return "";
    const items = experience.map((item) => {
      const dates = [item.startDate, item.endDate || (item.current ? "Present" : "")]
        .filter(Boolean)
        .join(" - ");
      const locStr = item.location ? ` | ${item.location}` : "";
      const header = `${item.role} - ${item.company}${locStr} (${dates})`;

      const bullets = item.bullets
        ? item.bullets
            .split("\n")
            .map((b) => b.trim().replace(/^([•\-\*]|\d+\.)\s*/, ""))
            .filter(Boolean)
            .map((b) => `  * ${b}`)
            .join("\n")
        : "";

      return bullets ? `${header}\n${bullets}` : header;
    });

    return `\n${divider}\nWORK EXPERIENCE\n${divider}\n${items.join("\n\n")}`;
  };

  // Projects
  const renderProjects = () => {
    if (!projects || projects.length === 0) return "";
    const items = projects.map((item) => {
      const techStr = item.technologies ? ` [${item.technologies}]` : "";
      const linkStr = item.link ? ` (${item.link})` : "";
      const header = `${item.name}${techStr}${linkStr}`;

      const bullets = item.bullets
        ? item.bullets
            .split("\n")
            .map((b) => b.trim().replace(/^([•\-\*]|\d+\.)\s*/, ""))
            .filter(Boolean)
            .map((b) => `  * ${b}`)
            .join("\n")
        : "";

      return bullets ? `${header}\n${bullets}` : header;
    });

    return `\n${divider}\nPROJECTS\n${divider}\n${items.join("\n\n")}`;
  };

  // Education
  const renderEducation = () => {
    if (!education || education.length === 0) return "";
    const items = education.map((item) => {
      const dates = [item.startDate, item.endDate].filter(Boolean).join(" - ");
      const locStr = item.location ? ` | ${item.location}` : "";
      const header = `${item.degree} - ${item.school}${locStr} (${dates})`;
      return item.detail ? `${header}\n  * ${item.detail}` : header;
    });

    return `\n${divider}\nEDUCATION\n${divider}\n${items.join("\n\n")}`;
  };

  // Skills
  const renderSkills = () => {
    if (!skills || skills.length === 0) return "";
    const items = skills
      .filter((s) => s.skills && s.skills.trim())
      .map((s) => `  * ${s.category}: ${s.skills}`);

    return `\n${divider}\nSKILLS\n${divider}\n${items.join("\n")}`;
  };

  const sectionMap: Record<string, () => string> = {
    summary: renderSummary,
    experience: renderExperience,
    projects: renderProjects,
    education: renderEducation,
    skills: renderSkills,
  };

  const order = sectionOrder && sectionOrder.length > 0
    ? sectionOrder
    : ["summary", "experience", "projects", "education", "skills"];

  order.forEach((key) => {
    if (sectionMap[key]) {
      const content = sectionMap[key]();
      if (content) sections.push(content);
    }
  });

  return sections.join("\n\n") + "\n";
}
