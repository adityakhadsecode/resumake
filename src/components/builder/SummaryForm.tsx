"use client";

import React from "react";
import { Field } from "./Field";

interface SummaryFormProps {
  value: string;
  onChange: (value: string) => void;
}

export function SummaryForm({ value, onChange }: SummaryFormProps) {
  return (
    <div>
      <Field
        label="A few sentences on who you are"
        value={value}
        onChange={onChange}
        type="textarea"
        rows={3}
        placeholder="Product designer with 5 years shipping consumer web and mobile products end to end..."
      />
    </div>
  );
}
