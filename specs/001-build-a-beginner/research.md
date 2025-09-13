# Research: Decisions for MVP - Beginner Quantum Mechanics Study App

**Feature**: 001-build-a-beginner
**Date**: 2025-09-13

## Unknowns to resolve
- Auth: should there be user accounts or support anonymous/local profiles?
- Storage/persistence: client-side only (LocalStorage) or file-based server storage (JSON/SQLite)?
- Platform: static site (client-only) or simple web server with API?

## Options considered

### Auth
- None / anonymous: simplest; progress stored in LocalStorage; no user accounts.
- Local profiles (no server auth): users can create a local profile stored in LocalStorage or local files; portable but not synced.
- Server-based accounts (email/OAuth): requires backend and user management.

**Recommendation (MVP)**: Start with anonymous users + optional local profiles stored in browser LocalStorage or file (for CLI). Mark `FR-010` as: optional auth via local profile; server auth deferred.

### Storage
- Client-only: LocalStorage or IndexedDB (no server). Pros: zero server overhead; Cons: cannot sync between devices.
- File-based server JSON/SQLite: simple server to persist multiple users; Pros: easy to implement and portable; Cons: requires running a server.
- Full DB (Postgres): overkill for MVP.

**Recommendation (MVP)**: Use client-only LocalStorage (or IndexedDB) initially and provide an export/import feature for progress. For users who want cross-device syncing, plan optional server + SQLite later.

### Platform
- Static site (React/Vite or plain HTML/JS): easiest to ship; can be hosted on GitHub Pages.
- Small server + frontend: adds persistence and multi-user capabilities.

**Recommendation (MVP)**: Implement as a static site that reads `content/` Markdown and uses client-side rendering, LocalStorage for progress, and supports downloadable content packages.

## Chosen approach summary
- Platform: PWA (Progressive Web App) with React + Vite + TypeScript for modern UI and iPhone home screen support.
- Storage: IndexedDB with localForage for robust offline storage; export/import for backup.
- Auth: None for MVP; optional local profiles feature.
- Deployment: GitHub Actions → GitHub Pages with PWA manifest and service worker.
- UI: Modern design system (Tailwind CSS or similar) with dark/light mode, mobile-first responsive design.
- AI: Optional integration with free AI APIs for quiz generation or study recommendations if beneficial.

## Rationale
- PWA enables native-like experience on iPhone with home screen installation.
- GitHub Actions deployment ensures fast iteration and zero hosting costs.
- IndexedDB provides robust offline storage for study progress and content caching.
- Modern UI framework enables polished, easy-to-use interface for daily study sessions.
- Respects licensing by linking to external resources rather than redistributing.

## Technical decisions
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **PWA**: Vite PWA plugin for manifest.json and service worker generation
- **Storage**: localForage (IndexedDB wrapper) for progress, cached content
- **Content**: Markdown modules with frontmatter, parsed at build time
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Actions workflow building to GitHub Pages
- **AI Integration**: Optional OpenAI/Anthropic API integration for study assistance
