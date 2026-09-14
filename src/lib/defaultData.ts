import { ResumeData } from "@/types/resume";

export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: "Jordan Alvarez",
    title: "Senior Product Designer",
    email: "jordan.alvarez@email.com",
    phone: "(555) 012-3344",
    location: "Austin, TX",
    website: "jordanalvarez.design",
    linkedin: "linkedin.com/in/jordanalvarez",
    github: "github.com/jordanalvarez",
  },
  summary:
    "Product designer with 5+ years shipping consumer web and mobile products end to end, from research through high-fidelity UI. Comfortable owning a problem space, scaling design systems, and partnering closely with engineering.",
  experience: [
    {
      id: "exp-1",
      role: "Senior Product Designer",
      company: "Lumen Health",
      location: "Remote",
      startDate: "2022",
      endDate: "Present",
      current: true,
      bullets:
        "Led redesign of the patient intake flow, cutting user drop-off by 24%\nBuilt and maintained the company's first shared multi-brand design system in Figma\nRan weekly moderated usability sessions and translated findings directly into shipped changes",
    },
    {
      id: "exp-2",
      role: "Product Designer",
      company: "Northwind Software",
      location: "Austin, TX",
      startDate: "2019",
      endDate: "2022",
      current: false,
      bullets:
        "Owned core onboarding and billing user flows for a B2B SaaS analytics platform\nPartnered with PM and engineering to ship a self-serve tier upgrade flow (+18% conversion)",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Pulse Design Tokens Studio",
      role: "Creator & Maintainer",
      link: "pulse-tokens.dev",
      technologies: "Figma Plugin, TypeScript, Design Systems",
      bullets:
        "Engineered an automated Figma-to-CSS design token pipeline used by 12+ product teams\nAutomated accessibility contrast checks directly in the design workflow",
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "University of Texas at Austin",
      degree: "B.F.A. in Design",
      location: "Austin, TX",
      startDate: "2015",
      endDate: "2019",
      detail: "Graduated with Honors · Interaction Design & Typography",
    },
  ],
  skills: [
    {
      id: "skill-1",
      category: "Design & Research",
      skills: "Figma, Design Systems, User Research, Prototyping, Usability Testing, Wireframing",
    },
    {
      id: "skill-2",
      category: "Technical",
      skills: "HTML/CSS, Tailwind CSS, TypeScript, Design Tokens, Git",
    },
  ],
  sectionOrder: ["experience", "projects", "education", "skills"],
};
