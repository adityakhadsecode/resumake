import { ResumeData } from "@/types/resume";

/**
 * Escapes special LaTeX characters in user input to prevent syntax errors and injection.
 */
export function escapeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function parseBulletsToLatexItems(bulletsStr: string): string {
  if (!bulletsStr || !bulletsStr.trim()) return "";
  const lines = bulletsStr
    .split("\n")
    .map((line) => line.trim().replace(/^([•\-\*]|\d+\.)\s*/, ""))
    .filter(Boolean);

  if (lines.length === 0) return "";

  return lines
    .map((line) => `      \\resumeItem{${escapeLatex(line)}}`)
    .join("\n");
}

/**
 * Maps a ResumeData state object to a complete, standalone, portable LaTeX document.
 * Based on the standard single-column Jake's Resume / Classic Tech layout.
 * Requires ZERO external .cls files — compiles cleanly with Tectonic, pdfLaTeX, or Overleaf.
 */
export function resumeToTex(data: ResumeData): string {
  const { personalInfo, summary, experience, projects, education, skills, sectionOrder } = data;

  // Build Contact Line items
  const contactParts: string[] = [];
  if (personalInfo.phone) {
    contactParts.push(escapeLatex(personalInfo.phone));
  }
  if (personalInfo.email) {
    contactParts.push(`\\href{mailto:${personalInfo.email}}{\\underline{${escapeLatex(personalInfo.email)}}}`);
  }
  if (personalInfo.linkedin) {
    const cleanUrl = personalInfo.linkedin.startsWith("http")
      ? personalInfo.linkedin
      : `https://${personalInfo.linkedin}`;
    contactParts.push(`\\href{${cleanUrl}}{\\underline{${escapeLatex(personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, ""))}}}`);
  }
  if (personalInfo.github) {
    const cleanUrl = personalInfo.github.startsWith("http")
      ? personalInfo.github
      : `https://${personalInfo.github}`;
    contactParts.push(`\\href{${cleanUrl}}{\\underline{${escapeLatex(personalInfo.github.replace(/^https?:\/\/(www\.)?/, ""))}}}`);
  }
  if (personalInfo.website) {
    const cleanUrl = personalInfo.website.startsWith("http")
      ? personalInfo.website
      : `https://${personalInfo.website}`;
    contactParts.push(`\\href{${cleanUrl}}{\\underline{${escapeLatex(personalInfo.website.replace(/^https?:\/\/(www\.)?/, ""))}}}`);
  }
  if (personalInfo.location) {
    contactParts.push(escapeLatex(personalInfo.location));
  }

  const contactLine = contactParts.join(" $|$ ");

  // Build section renderers
  const renderSummary = () => {
    if (!summary || !summary.trim()) return "";
    return `
%----------- PROFESSIONAL SUMMARY -----------
\\section{Summary}
\\small{${escapeLatex(summary)}}
`;
  };

  const renderExperience = () => {
    if (!experience || experience.length === 0) return "";
    const items = experience
      .map((item) => {
        const dateRange = [item.startDate, item.endDate || (item.current ? "Present" : "")]
          .filter(Boolean)
          .join(" -- ");
        const bulletItems = parseBulletsToLatexItems(item.bullets);

        return `    \\resumeSubheading
      {${escapeLatex(item.company)}}{${escapeLatex(item.location)}}
      {${escapeLatex(item.role)}}{${escapeLatex(dateRange)}}
      \\resumeItemListStart
${bulletItems}
      \\resumeItemListEnd`;
      })
      .join("\n\n");

    return `
%----------- EXPERIENCE -----------
\\section{Experience}
  \\resumeSubHeadingListStart
${items}
  \\resumeSubHeadingListEnd
`;
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return "";
    const items = projects
      .map((item) => {
        const bulletItems = parseBulletsToLatexItems(item.bullets);
        const linkDisplay = item.link
          ? ` $|$ \\href{${item.link.startsWith("http") ? item.link : `https://${item.link}`}}{\\underline{Link}}`
          : "";
        const techDisplay = item.technologies
          ? ` $|$ \\emph{${escapeLatex(item.technologies)}}`
          : "";

        return `    \\resumeProjectHeading
      {\\textbf{${escapeLatex(item.name)}}${techDisplay}${linkDisplay}}{}
      \\resumeItemListStart
${bulletItems}
      \\resumeItemListEnd`;
      })
      .join("\n\n");

    return `
%----------- PROJECTS -----------
\\section{Projects}
  \\resumeSubHeadingListStart
${items}
  \\resumeSubHeadingListEnd
`;
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return "";
    const items = education
      .map((item) => {
        const dateRange = [item.startDate, item.endDate].filter(Boolean).join(" -- ");
        const detailLine = item.detail
          ? `\n      \\resumeItemListStart\n        \\resumeItem{${escapeLatex(item.detail)}}\n      \\resumeItemListEnd`
          : "";

        return `    \\resumeSubheading
      {${escapeLatex(item.school)}}{${escapeLatex(item.location)}}
      {${escapeLatex(item.degree)}}{${escapeLatex(dateRange)}}${detailLine}`;
      })
      .join("\n\n");

    return `
%----------- EDUCATION -----------
\\section{Education}
  \\resumeSubHeadingListStart
${items}
  \\resumeSubHeadingListEnd
`;
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return "";
    const items = skills
      .filter((s) => s.skills && s.skills.trim())
      .map((s) => `     \\textbf{${escapeLatex(s.category)}}: {${escapeLatex(s.skills)}} \\\\`)
      .join("\n");

    return `
%----------- TECHNICAL SKILLS -----------
\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${items}
    }}
 \\end{itemize}
`;
  };

  // Section order mapping
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

  const renderedSections = order
    .map((secKey) => (sectionMap[secKey] ? sectionMap[secKey]() : ""))
    .filter(Boolean)
    .join("\n");

  return `%-------------------------
% Auto-generated Resume from Resumake (100% Free & Open-Source)
% License: MIT
% Compatible with: Tectonic, pdfLaTeX, XeLaTeX, Overleaf
%------------------------

\\documentclass[letterpaper,10pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

% Set page margins
\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure PDF is machine-readable and ATS-parseable
\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in, label={$\\bullet$}]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%---------- HEADING ----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personalInfo.name || "Resume")}} \\\\ \\vspace{1pt}
    ${personalInfo.title ? `{\\large \\textit{${escapeLatex(personalInfo.title)}}} \\\\ \\vspace{1pt}` : ""}
    \\small ${contactLine}
\\end{center}

${renderedSections}

\\end{document}
`;
}
