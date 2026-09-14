# Resumake — Anti-Slop Resume Builder

> **A 100% free, private, and ATS-optimized alternative to predatory resume builder companies.**
> No paywalls. No subscription traps. No forced accounts. No watermarks. Ever.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🎯 The Mission: Killing the Slop Companies

Commercial resume builders (Zety, Resume.io, Novoresume, etc.) trick job seekers by letting them spend hours crafting a resume in a sleek editor, only to drop a paywall, demand a $25/month recurring subscription, or slap a hideous watermark on the PDF at the very last step.

**Resumake** is built to kill the slop:
- **Zero Paywalls & No Watermarks**: True vector PDF downloads, completely free forever.
- **100% Private & Local-First**: Your personal data is stored strictly in your browser (`localStorage`). Nothing is tracked, stored, or sent to a server.
- **ATS-Optimized**: Single-column semantic layouts with 100% text selectability that pass Applicant Tracking Systems with flying colors.
- **Warm Paper-and-Ink Aesthetic**: Styled like authentic printed stationery with classic serif typography (`Georgia`), hairline rules, and zero card shadows on the document.

---

## ✨ Features (Phase 1)

- **Interactive Two-Pane Studio**: Form editor on the left with instant real-time document preview on the right.
- **Authentic Print Styling**: Crisp hairline dividers, elegant typography, and zero digital card shadows on the page.
- **Dynamic List Management**: Add, remove, and reorder work history, projects, degrees, and skills with one click.
- **Native Vector PDF Export**: High-fidelity `@media print` CSS engine with `@page { margin: 0 }` to eliminate browser-injected header dates and footer URLs.
- **Built-in Print Setup Guidance**: Helpful modal reminding you to uncheck *"Headers & footers"* and check *"Background graphics"* for pixel-perfect PDF export.
- **Offline JSON Backup & Restore**: Export your resume data as portable JSON and restore it on any device without creating an account.

---

## 🗺 Roadmap

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Core Form Builder, Live Preview, and Vector PDF Export | ✅ **Complete** |
| **Phase 2** | Resume Import (PDF/DOCX) + BYOK AI Assistant & Job Tailor | ✅ **Complete** |
| **Phase 3** | LaTeX Compilation ("Overleaf-lite") & Multi-Format Export (DOCX, TXT, TEX) | ✅ **Complete** |
| **Phase 4** | Curated Template Gallery (Jake's Resume, Executive, Academic CV) | 📋 *Planned* |
| **Phase 5** | ATS Compatibility Audit & AI Keyword Matching Suite | 📋 *Planned* |

---

## 🏛 Architecture Exceptions

Resumake is designed from the ground up as a **100% Local-First** web application:
- Form editing, LocalStorage auto-save, JSON export/import, Plain-Text (`.txt`) generation, raw LaTeX (`.tex`) source download, client-side Microsoft Word (`.docx`) generation, and native Print-PDF downloads run **entirely in your browser with zero network calls**.
- **The Only Exception**: **LaTeX PDF Compilation (`/api/compile-tex`)** is the single feature requiring a live backend environment. Because it invokes the single static `tectonic` binary via `child_process.execFile` in an isolated sandbox, it requires a **container-based deployment target** (such as [Fly.io](https://fly.io), [Railway](https://railway.app), [Render](https://render.com), [AWS Cloud Run](https://aws.amazon.com), or Docker) rather than standard Vercel or Netlify serverless functions.
- A multi-stage [Dockerfile](Dockerfile) with Tectonic pre-installed is included in the repository for one-command container deployment.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adityakhadsecode/resumake.git
   cd resumake
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + Warm Paper-and-Ink Design System
- **Icons**: [Lucide React](https://lucide.dev)
- **State**: React Hooks + LocalStorage auto-persistence (debounced)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">
Part of the <b>Killing Slop Companies</b> series by <a href="https://github.com/adityakhadsecode">Aditya Khadse</a>
</div>
