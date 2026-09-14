# Project Overview: Anti-Slop Resume Builder

## Overview

A modern, fast, and completely free alternative to predatory "resume builder" companies (Zety, Resume.io, Novoresume, etc.) that bait job seekers with free editors only to gate-keep downloads behind paywalls, deceptive recurring subscriptions, and forced watermarks. 

This project empowers anyone to craft high-impact, ATS-optimized resumes with live previews, instant vector PDF downloads, LaTeX support, and AI bullet optimization—completely free, private, and open-source.

## Goals

1. **Zero Paywalls & No Watermarks**: Provide 100% free resume creation and high-fidelity PDF exports with zero payment prompts or hidden traps.
2. **Zero Sign-up Friction**: 100% functional out-of-the-box using local-first storage without requiring an account or collecting personal data.
3. **ATS-First Quality**: Produce clean, single-column and multi-column semantic layouts that pass Applicant Tracking Systems (ATS) with 100% text-parse accuracy.
4. **Developer & Power User Friendly**: Support standard form inputs, JSON export/import, LaTeX export/compilation, and AI enhancement.
5. **Effortless Local & Web Deployment**: Work seamlessly out-of-the-box via `git clone` or on GitHub Pages / Vercel.

## Core User Flow (Phase 1)

1. **Enter Application**: User lands directly on the builder—no login screen, no splash page wall.
2. **Input Information**: User fills in Contact Info, Summary, Experience, Projects, Education, and Skills using a clean two-pane layout.
3. **Live Responsive Preview**: The right pane dynamically updates a pixel-perfect, ATS-compliant resume sheet in real-time.
4. **Customization**: User reorders items, toggles optional sections, or loads sample starter data.
5. **Export**: User clicks "Download PDF" which triggers the print engine configured with custom `@page` styles for pristine vector PDF output, or clicks "Export JSON" to backup data.

## Phased Feature Roadmap

### Phase 1: Core Form Builder & High-Fidelity PDF Export (Current)
- Clean two-pane interface (Left: Form editor, Right: Live preview).
- Sections: Contact Information, Professional Summary, Work Experience, Projects, Education, and Skills.
- Dynamic list management (add, delete, reorder items).
- Instant vector PDF generation via optimized `@media print` / `@page` CSS (selectable text, ATS compliant).
- Local storage auto-save and JSON data export/import.
- Single pixel-perfect modern template (Jake's Resume / Classic Tech standard).

### Phase 2: Resume Import & AI Integration
- Resume parsing/import from existing PDF, DOCX, and LinkedIn JSON.
- AI integration for bullet point rewriting, action verb enhancement, and summary generation.
- Dual AI execution mode:
  - Local / Self-hosted: Bring Your Own Key (BYOK) stored in browser LocalStorage (OpenAI, Gemini, Groq, local Ollama).
  - Deployed GitHub Web App: Preconfigured server-side AI API key with daily usage rate-limiting.

### Phase 3: LaTeX Resume Integration & WASM/Cloud Compilation
- Bi-directional LaTeX template editor and preview.
- Zero-dependency compilation supporting both local `git clone` and deployed web environments (WASM LaTeX engine / serverless microservice).
- Code editor with syntax highlighting and instant sync with form data.

### Phase 4: Curated Template Gallery
- Gallery of proven open-source resume templates:
  - Jake's Resume (Classic Tech standard)
  - Modern Executive (Clean hierarchy with accent elements)
  - Academic / CV (Dense layout with publications & awards)
  - Compact Two-Column (Sidebar layout for skills/contact)
- Custom font, margin, and accent color customization.

### Phase 5: ATS Review & AI Improvement Suite
- ATS compatibility score calculator and formatting audit.
- Job description keyword comparison (paste job description, highlight missing keywords).
- AI bullet strength critique (quantified results, active verbs, conciseness scoring).

## Scope

### In Scope
- Next.js App Router web application with TypeScript, Tailwind CSS, and Shadcn UI.
- LocalStorage persistence with JSON backup/restore.
- High-fidelity print styles for US Letter and A4 PDF downloads.
- Modular template engine ready for Phase 4 expansion.
- Extensible AI client architecture ready for Phase 2.

### Out of Scope (for Phase 1)
- User accounts / authentication (kept 100% private and local).
- Paid tiers, monetization, or analytics tracking.
- Complex backend databases.

## Success Criteria

1. User can fill in resume information and download a clean, unwatermarked PDF in under 2 minutes.
2. PDF text is 100% selectable and passes standard ATS text extraction tests.
3. Page reloads persist state locally without data loss.
4. Zero sign-up, payment, or watermark prompts anywhere in the UI.
5. `npm run build` and `npm run dev` pass with zero errors.
