# Code Standards

## General Principles

- **Zero Clutter, Maximum Clarity**: Keep code concise, modular, and self-documenting.
- **Strict Typing**: All resume schemas, template props, and actions must be strictly typed via TypeScript. Never use `any`.
- **Defensive Data Handling**: Ensure all optional resume fields (e.g. empty bullets, missing URLs) fail gracefully and do not break rendering or print layout.
- **Pure Functions for Data Transformations**: Parsing, formatting dates, sanitization, and ATS audits must be implemented as testable pure functions.

## Next.js & React Conventions

- Use the Next.js App Router (`src/app`).
- Default to React Server Components (RSC) where possible; use `"use client"` directive explicitly on interactive form panes, state providers, and live preview canvases.
- Keep components focused: one component per file unless tightly coupled.
- Structure custom hooks (`useResume`, `useLocalStorage`) to encapsulate state synchronization cleanly.

## Styling & Component Conventions

- Strictly follow the warm paper-and-ink design tokens specified in `ui-docs.md`.
- Use native HTML elements (`<input>`, `<textarea>`, `<button>`) styled cleanly with the designated hex tokens and utility classes.
- Avoid bulky component wrappers or unnecessary abstraction layers.
- Strictly adhere to `@media print` class isolation (`no-print` vs `print-only` / `.resume-sheet`).
- Resume templates must use clean semantic typography with `Georgia, 'Times New Roman', serif` and hairline rules.

## Data and Storage

- The core resume data model must adhere to `ResumeData` interface in `src/types/resume.ts`.
- Auto-save to `localStorage` with a 300ms debounce to prevent layout thrashing and excessive writes.
- Provide clean validation when importing JSON files to guard against malformed user uploads.

## File Organization

- `src/app/` — Root layout, page, globals.css, and font configurations.
- `src/components/builder/` — Form section editors (`ContactForm`, `ExperienceForm`, `ProjectsForm`, etc.).
- `src/components/preview/` — Live resume canvas, zoom toolbar, print trigger.
- `src/components/templates/` — Visual resume templates (e.g. `JakesTemplate.tsx`).
- `src/components/ui/` — Shadcn primitives (`Button`, `Input`, `Dialog`, etc.).
- `src/lib/` — Storage helpers, default resume seed, utility functions (`cn.ts`, `print.ts`).
- `src/types/` — Shared TypeScript types (`resume.ts`, `template.ts`).
