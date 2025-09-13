# Implementation Plan: Build a beginner-friendly quantum mechanics study app


**Branch**: `001-build-a-beginner` | **Date**: 2025-09-13 | **Spec**: `/home/eanhd/projects/physics/specs/001-build-a-beginner/spec.md`
**Input**: Feature specification from `/home/eanhd/projects/physics/specs/001-build-a-beginner/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

## Summary
Primary requirement: Provide a beginner-friendly, structured learning experience that guides users from math prerequisites through introductory quantum mechanics, with modular lessons, quizzes, progress tracking, and links to curated external resources.

Proposed approach: Start with a single-project repository layout (content + simple web UI optional). Implement content as Markdown modules in `content/` (or `modules/`) and a minimal backend to serve content and store progress (file-based JSON for MVP). Keep authentication optional for MVP (local-profile or anonymous progress stored locally). Use TDD-first approach to satisfy the constitution.

## Technical Context
**Language/Version**: TypeScript + React 18+ with Vite 5+
**Primary Dependencies**: React+Vite+TypeScript, PWA plugin, localForage for storage, Tailwind CSS for modern UI
**Storage**: IndexedDB via localForage (offline-capable), export/import for backup
**Testing**: Vitest + React Testing Library
**Target Platform**: PWA (Progressive Web App) - iPhone homescreen compatible, GitHub Pages deployment
**Project Type**: Single project (PWA static site with service worker)
**Performance Goals**: <2s initial load, offline-capable, 90+ Lighthouse PWA score
**Constraints**: Offline-first design, respect external resource licensing, iPhone Safari PWA support
**Scale/Scope**: Single user focus with potential for AI-enhanced study recommendations
**Deployment**: GitHub Actions → GitHub Pages with PWA manifest and service worker
**AI Integration**: Optional study path recommendations and quiz generation (using client-side or API calls)

## Constitution Check

**Simplicity**:
- Projects: 1 (content + minimal server)
- Use framework directly where necessary
- Single data model (user progress + modules)

**Architecture**:
- Feature implemented as library-backed content with a thin UI layer

**Testing (NON-NEGOTIABLE)**:
- Enforce TDD: write failing tests before implementing features

**Observability**:
- Minimal logging for server actions; frontend debug logs

**Versioning**:
- Feature branch follows `001-...` convention; release tagging TBD

## Project Structure

### Documentation (this feature)
```
specs/001-build-a-beginner/
├── plan.md
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
└── tasks.md             # Phase 2 (not created by /plan)
```

### Source Code (repository root - PWA layout)
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── ModuleCard.tsx
│   ├── QuizView.tsx
│   └── ProgressTracker.tsx
├── pages/              # Route components
│   ├── Dashboard.tsx
│   ├── ModuleView.tsx
│   └── StudyPlan.tsx
├── lib/                # Core logic
│   ├── storage.ts      # localForage wrapper
│   ├── spaced-repetition.ts
│   └── ai-recommendations.ts
├── assets/
└── App.tsx

content/                # Markdown modules + metadata
├── modules/
│   ├── calculus-basics.md
│   └── linear-algebra-intro.md
├── quizzes/
└── resources.json      # Parsed from study_resources.md

public/
├── manifest.json       # PWA manifest
├── icons/              # PWA icons (multiple sizes)
└── sw.js              # Service worker

.github/
└── workflows/
    └── deploy.yml      # GitHub Actions for PWA deployment

tests/
├── components/
└── lib/
```

## Phase 0: Outline & Research
1. Resolve NEEDS CLARIFICATION in spec (auth, storage persistence, platform choice).
2. Research lightweight approaches for MVP: static site + client-side storage vs simple server + file-based storage.
3. Produce `research.md` consolidating recommendations and chosen approach for Phase 1.

## Phase 1: Design & Contracts
1. Design data model for Module, UserProfile, Quiz, Resource, ScheduleEntry. Output `data-model.md`.
2. Define minimal API contract (if server chosen): endpoints for listing modules, fetching module content, recording progress, scheduling reviews.
3. Create quickstart.md describing how to run the MVP locally (static preview or Node server).

## Phase 2: Task Planning Approach
Describe task generation strategy (TDD-first). Tasks will include:
- Create content ingestion script to parse `study_resources.md` into Markdown modules.
- Implement Module model and storage layer (file-based JSON).
- Implement basic API endpoints or client content loader.
- Implement frontend pages for browsing modules, taking quizzes, and tracking progress.
- Add tests for each contract and model.

## Complexity Tracking
No constitution violations identified for MVP approach.

## Progress Tracking
- [ ] Phase 0: Research complete
- [ ] Phase 1: Design complete
- [ ] Phase 2: Task planning complete

---

Next steps: Resolve the `FR-010` and `FR-011` clarifications (auth and retention) in `research.md`, then run Phase 1 to generate data model and quickstart.
