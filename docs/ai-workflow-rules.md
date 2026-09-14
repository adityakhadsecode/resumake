# AI Workflow Rules

## Approach

Development follows an incremental, phased delivery model. Each phase is broken down into small, verifiable units that can be tested end-to-end. We never introduce speculative bloat or leave half-wired features.

## Scoping Rules

- Work on one feature unit at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.
- Verify each unit end-to-end before proceeding to the next.

## When to Split Work

Split an implementation step if it combines:
- Form UI input components and backend/AI proxy logic.
- Template rendering engine modifications and data storage schema migrations.
- Print CSS styling and unrelated form validation rules.

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files.
- If a requirement is ambiguous, resolve it with the user or in the relevant context file before implementing.
- If a requirement is missing, log it as an open question in `progress-tracker.md` before continuing.

## Protected Files & Conventions

- Do not modify `AGENTS.md` unless explicitly instructed.
- Always keep documentation in sync across the `docs/` folder.

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:
- System architecture or boundaries (`docs/architecture.md`)
- UI design tokens or print behavior (`docs/ui-docs.md`)
- Code conventions or standards (`docs/code-standards.md`)
- Feature scope (`docs/project-overview.md`)
- Implementation status (`docs/progress-tracker.md`)

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `docs/architecture.md` was violated.
3. `docs/progress-tracker.md` reflects the completed work.
4. `npm run build` (or TypeScript check / dev server test) passes with zero errors.
