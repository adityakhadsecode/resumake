# Architecture Context: Anti-Slop Resume Builder

## Stack

| Layer          | Technology                    | Role                                                        |
| -------------- | ----------------------------- | ----------------------------------------------------------- |
| Framework      | Next.js (App Router)          | Application runtime, routing, and SSR/SSG                   |
| Language       | TypeScript                    | Type safety across resume schemas, templates, and UI state |
| Styling        | Warm Paper & Ink CSS + Tailwind| Scoped, accessible tokens with archival serif document styles|
| Icons          | Lucide React / Inline SVG     | Consistent icon system                                      |
| State & Storage| React Hooks + LocalStorage    | Local-first state management with zero backend requirement  |
| PDF Engine     | CSS Paged Media (@media print)| Native vector PDF compilation via browser print pipeline   |
| AI (Phase 2/5) | Next.js API Proxy / BYOK SDK  | Dual-mode AI execution (LocalStorage BYOK or rate-limited API)|
| LaTeX (Phase 3)| WASM / Serverless TeX Engine  | Portable LaTeX compilation without OS dependencies          |

## System Boundaries

- `src/app/` — Root layout, metadata, global styles, and route handlers.
- `src/components/builder/` — Interactive form panes, section editors, reordering controls, top action bar.
- `src/components/preview/` — Live resume canvas, zoom/fit controls, and page breakdown view.
- `src/components/templates/` — Modular resume layout templates (Jake's resume, executive, etc.).
- `src/components/ui/` — Shadcn UI primitives (Button, Card, Input, Textarea, Tooltip, Dialog, etc.).
- `src/lib/` — Resume data schemas, validation, default starter resumes, export/import utilities.
- `src/types/` — TypeScript interface definitions for `ResumeData`, sections, and templates.

## Storage Model

- **Primary Storage**: Browser `localStorage` key `antislop_resume_state_v1`.
- **Portability**: JSON Import/Export (`.json` format) allowing users to backup, transfer, and restore complete resumes without a database.
- **Privacy Guarantee**: Resume text, personal identifiers, and contact details never leave the user's browser in Phase 1.

## Auth and Access Model

- **No Authentication Required**: 100% anonymous, instant access.
- **Data Ownership**: The user retains 100% ownership of their data on their local machine.
- **AI Keys (Phase 2)**:
  - Local Clone: Stored encrypted/plain in user's browser `localStorage` (BYOK).
  - Deployed GitHub Web App: Server-side environment key with strict IP-based rate limiting.

## Invariants

1. **No Paywalls or Watermarks**: The application must NEVER introduce paywalls, credit card forms, or watermarks.
2. **Text Selectability & ATS Compliance**: Resumes exported to PDF must maintain true vector text streams (no rasterized text or `html2canvas` hacks).
3. **Zero-Friction Startup**: Anyone who runs `git clone` and `npm run dev` must have a 100% working app without configuring paid third-party services.
4. **Auto-Save Integrity**: Any modification to resume fields must debounce and sync to `localStorage` to prevent accidental data loss.
5. **Separation of Content & Presentation**: The resume data structure must remain agnostic of the specific visual template rendering it.
