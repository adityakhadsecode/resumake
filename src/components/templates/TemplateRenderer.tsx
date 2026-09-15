"use client";

import React from "react";
import { ResumeData } from "@/types/resume";
import { ResumeDesign } from "@/types/template";
import { JakesTemplate } from "./JakesTemplate";
import { ModernExecutiveTemplate } from "./ModernExecutiveTemplate";
import { AcademicCvTemplate } from "./AcademicCvTemplate";
import { TwoColumnTemplate } from "./TwoColumnTemplate";

interface TemplateRendererProps {
  data: ResumeData;
  design: ResumeDesign;
}

export function TemplateRenderer({ data, design }: TemplateRendererProps) {
  switch (design.templateId) {
    case "modern-executive":
      return <ModernExecutiveTemplate data={data} design={design} />;
    case "academic-cv":
      return <AcademicCvTemplate data={data} design={design} />;
    case "two-column":
      return <TwoColumnTemplate data={data} design={design} />;
    case "jakes":
    default:
      return <JakesTemplate data={data} design={design} />;
  }
}
