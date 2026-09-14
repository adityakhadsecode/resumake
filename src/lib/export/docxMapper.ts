import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
} from "docx";
import { ResumeData } from "@/types/resume";

/**
 * Pure client-side function that generates a Microsoft Word (.docx) file from ResumeData.
 * Runs 100% in-browser using docx.js without needing any server route.
 * Matches the warm paper-and-ink visual hierarchy and typography.
 */
export async function resumeToDocx(data: ResumeData): Promise<Blob> {
  const { personalInfo, summary, experience, projects, education, skills, sectionOrder } = data;

  const children: Paragraph[] = [];

  // Header: Candidate Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: personalInfo.name || "Resume",
          bold: true,
          size: 34, // 17pt
          font: "Georgia",
          color: "1C1D21",
        }),
      ],
    })
  );

  // Candidate Title
  if (personalInfo.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [
          new TextRun({
            text: personalInfo.title,
            italics: true,
            size: 22, // 11pt
            font: "Georgia",
            color: "28344E",
          }),
        ],
      })
    );
  }

  // Contact line
  const contactParts: string[] = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 260 },
        children: [
          new TextRun({
            text: contactParts.join("   ·   "),
            size: 19, // 9.5pt
            font: "Georgia",
            color: "5B5F6B",
          }),
        ],
      })
    );
  }

  // Section Header Generator
  const createSectionHeader = (title: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: "DAD5C9",
          space: 2,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 20, // 10pt
          font: "Georgia",
          color: "28344E",
        }),
      ],
    });

  // Renderers
  const renderSummary = () => {
    if (!summary || !summary.trim()) return [];
    return [
      createSectionHeader("Summary"),
      new Paragraph({
        spacing: { after: 180, line: 280 },
        children: [
          new TextRun({
            text: summary.trim(),
            size: 20, // 10pt
            font: "Georgia",
            color: "2B2C30",
          }),
        ],
      }),
    ];
  };

  const renderExperience = () => {
    if (!experience || experience.length === 0) return [];
    const elements: Paragraph[] = [createSectionHeader("Experience")];

    experience.forEach((item) => {
      const dates = [item.startDate, item.endDate || (item.current ? "Present" : "")]
        .filter(Boolean)
        .join(" — ");

      // Role + Company Line
      elements.push(
        new Paragraph({
          spacing: { before: 140, after: 40 },
          children: [
            new TextRun({
              text: item.company || "Company",
              bold: true,
              size: 21,
              font: "Georgia",
              color: "1C1D21",
            }),
            item.location
              ? new TextRun({
                  text: ` · ${item.location}`,
                  italics: true,
                  size: 19,
                  font: "Georgia",
                  color: "5B5F6B",
                })
              : new TextRun(""),
          ],
        })
      );

      // Role + Date Line
      elements.push(
        new Paragraph({
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({
              text: item.role || "Role",
              italics: true,
              size: 20,
              font: "Georgia",
              color: "28344E",
            }),
            dates
              ? new TextRun({
                  text: ` (${dates})`,
                  size: 19,
                  font: "Georgia",
                  color: "5B5F6B",
                })
              : new TextRun(""),
          ],
        })
      );

      // Bullets
      if (item.bullets && item.bullets.trim()) {
        const bulletLines = item.bullets
          .split("\n")
          .map((b) => b.trim().replace(/^([•\-\*]|\d+\.)\s*/, ""))
          .filter(Boolean);

        bulletLines.forEach((bullet) => {
          elements.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60, line: 260 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: "Georgia",
                  color: "2B2C30",
                }),
              ],
            })
          );
        });
      }
    });

    return elements;
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return [];
    const elements: Paragraph[] = [createSectionHeader("Projects")];

    projects.forEach((item) => {
      const headerParts: TextRun[] = [
        new TextRun({
          text: item.name || "Project",
          bold: true,
          size: 21,
          font: "Georgia",
          color: "1C1D21",
        }),
      ];

      if (item.technologies) {
        headerParts.push(
          new TextRun({
            text: ` | ${item.technologies}`,
            italics: true,
            size: 19,
            font: "Georgia",
            color: "5B5F6B",
          })
        );
      }

      if (item.link) {
        headerParts.push(
          new TextRun({
            text: ` (${item.link})`,
            size: 18,
            font: "Georgia",
            color: "28344E",
          })
        );
      }

      elements.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: headerParts,
        })
      );

      if (item.bullets && item.bullets.trim()) {
        const bulletLines = item.bullets
          .split("\n")
          .map((b) => b.trim().replace(/^([•\-\*]|\d+\.)\s*/, ""))
          .filter(Boolean);

        bulletLines.forEach((bullet) => {
          elements.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60, line: 260 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: "Georgia",
                  color: "2B2C30",
                }),
              ],
            })
          );
        });
      }
    });

    return elements;
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return [];
    const elements: Paragraph[] = [createSectionHeader("Education")];

    education.forEach((item) => {
      const dates = [item.startDate, item.endDate].filter(Boolean).join(" — ");

      elements.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: item.school || "School",
              bold: true,
              size: 21,
              font: "Georgia",
              color: "1C1D21",
            }),
            item.location
              ? new TextRun({
                  text: ` · ${item.location}`,
                  italics: true,
                  size: 19,
                  font: "Georgia",
                  color: "5B5F6B",
                })
              : new TextRun(""),
          ],
        })
      );

      elements.push(
        new Paragraph({
          spacing: { before: 0, after: item.detail ? 60 : 120 },
          children: [
            new TextRun({
              text: item.degree || "Degree",
              italics: true,
              size: 20,
              font: "Georgia",
              color: "28344E",
            }),
            dates
              ? new TextRun({
                  text: ` (${dates})`,
                  size: 19,
                  font: "Georgia",
                  color: "5B5F6B",
                })
              : new TextRun(""),
          ],
        })
      );

      if (item.detail) {
        elements.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: item.detail,
                size: 19,
                font: "Georgia",
                color: "2B2C30",
              }),
            ],
          })
        );
      }
    });

    return elements;
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return [];
    const elements: Paragraph[] = [createSectionHeader("Skills")];

    skills
      .filter((s) => s.skills && s.skills.trim())
      .forEach((s) => {
        elements.push(
          new Paragraph({
            spacing: { before: 40, after: 60 },
            children: [
              new TextRun({
                text: `${s.category}: `,
                bold: true,
                size: 20,
                font: "Georgia",
                color: "28344E",
              }),
              new TextRun({
                text: s.skills,
                size: 20,
                font: "Georgia",
                color: "2B2C30",
              }),
            ],
          })
        );
      });

    return elements;
  };

  const sectionMap: Record<string, () => Paragraph[]> = {
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
      children.push(...sectionMap[key]());
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
