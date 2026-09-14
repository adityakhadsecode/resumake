"use client";

import React from "react";
import { PersonalInfo } from "@/types/resume";
import { Field } from "./Field";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Full name"
          value={data.name}
          onChange={(v) => onChange("name", v)}
          placeholder="Jordan Alvarez"
        />
        <Field
          label="Title"
          value={data.title}
          onChange={(v) => onChange("title", v)}
          placeholder="Senior Product Designer"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Email"
          type="email"
          value={data.email}
          onChange={(v) => onChange("email", v)}
          placeholder="jordan@email.com"
        />
        <Field
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="(555) 012-3344"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Location"
          value={data.location}
          onChange={(v) => onChange("location", v)}
          placeholder="Austin, TX"
        />
        <Field
          label="Website / Portfolio"
          value={data.website}
          onChange={(v) => onChange("website", v)}
          placeholder="jordanalvarez.design"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="LinkedIn"
          value={data.linkedin}
          onChange={(v) => onChange("linkedin", v)}
          placeholder="linkedin.com/in/jordan"
        />
        <Field
          label="GitHub"
          value={data.github}
          onChange={(v) => onChange("github", v)}
          placeholder="github.com/jordan"
        />
      </div>
    </div>
  );
}
