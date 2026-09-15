export type TemplateId =
  | "jakes"
  | "modern-executive"
  | "academic-cv"
  | "two-column";

export type FontFamily = "georgia" | "inter" | "merriweather" | "mono";

export type AccentColor =
  | "#28344E" // Deep Academic Navy (Default)
  | "#334155" // Executive Slate
  | "#881337" // Rich Burgundy
  | "#14532D" // Forest Evergreen
  | "#27272A"; // Warm Charcoal

export type SpacingDensity = "compact" | "normal" | "spacious";

export type FontScale = "small" | "normal" | "large";

export interface ResumeDesign {
  templateId: TemplateId;
  fontFamily: FontFamily;
  accentColor: string;
  density: SpacingDensity;
  fontScale: FontScale;
}

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  tagline: string;
  recommendedFor: string;
  badge: string;
  previewClass: string;
}

export const TEMPLATE_CATALOG: TemplateMeta[] = [
  {
    id: "jakes",
    name: "Jake's Resume",
    tagline: "The gold standard single-column tech resume layout.",
    recommendedFor: "Software Engineers, DevOps, Data Scientists",
    badge: "ATS Gold Standard",
    previewClass: "bg-[#FAFAF8] border-[#DAD5C9]",
  },
  {
    id: "modern-executive",
    name: "Modern Executive",
    tagline: "Distinguished corporate hierarchy with accent headers and refined structure.",
    recommendedFor: "Engineering Managers, Directors, Product Leads",
    badge: "Executive Choice",
    previewClass: "bg-[#FFFFFF] border-l-4 border-l-[#28344E]",
  },
  {
    id: "academic-cv",
    name: "Academic / CV",
    tagline: "Dense scholarly format with education emphasis and publication styling.",
    recommendedFor: "Researchers, PhD Candidates, Faculty, Scientists",
    badge: "Scholarly",
    previewClass: "bg-[#FAF9F6] border-[#DAD5C9]",
  },
  {
    id: "two-column",
    name: "Two-Column Sidebar",
    tagline: "Modern asymmetric layout grouping skills & credentials in a structured rail.",
    recommendedFor: "Full-Stack Devs, Designers, Technical Generalists",
    badge: "Compact Rail",
    previewClass: "bg-[#FFFFFF] border-r border-[#DAD5C9]",
  },
];

export const FONT_OPTIONS: { id: FontFamily; name: string; styleName: string; fontCss: string }[] = [
  {
    id: "georgia",
    name: "Georgia",
    styleName: "Archival Serif",
    fontCss: "Georgia, 'Times New Roman', Times, serif",
  },
  {
    id: "inter",
    name: "Inter",
    styleName: "Modern Sans",
    fontCss: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    styleName: "Editorial Book Serif",
    fontCss: "var(--font-merriweather), Georgia, serif",
  },
  {
    id: "mono",
    name: "Roboto Mono",
    styleName: "Technical Monospace",
    fontCss: "var(--font-roboto-mono), monospace",
  },
];

export const ACCENT_COLOR_OPTIONS: { hex: AccentColor; name: string }[] = [
  { hex: "#28344E", name: "Navy" },
  { hex: "#334155", name: "Slate" },
  { hex: "#881337", name: "Burgundy" },
  { hex: "#14532D", name: "Forest" },
  { hex: "#27272A", name: "Charcoal" },
];
