# Quickstart - PWA Quantum Mechanics Study App

**Feature**: 001-build-a-beginner
**Date**: 2025-09-13

This quickstart shows how to run the PWA locally and deploy to GitHub Pages. Requires Node.js v18+.

## Local Development

1. Install dependencies
```bash
npm install
```

2. Start dev server
```bash
npm run dev
```

3. Build for production
```bash
npm run build
npm run preview
```

## PWA Features
- **Home Screen**: Add to iPhone home screen for native-like experience
- **Offline**: Study content cached for offline access
- **Progressive**: Works on any device with modern browser
- **Modern UI**: Dark/light mode, responsive design, touch-friendly

## Deployment (GitHub Actions)

The app automatically deploys to GitHub Pages on push to main branch:

1. Push changes to main branch
2. GitHub Actions builds and deploys to `https://yourusername.github.io/physics`
3. PWA manifest enables home screen installation

## Content Management

- Add lesson Markdown files to `content/modules/` with frontmatter
- Quizzes go in `content/quizzes/` as JSON files
- Resources imported from `physics_study/study_resources.md`

## Study Features

- **Progress Tracking**: Persistent progress in IndexedDB
- **Spaced Repetition**: SM-2 algorithm for review scheduling
- **Export/Import**: Backup progress as JSON
- **Search**: Find modules and concepts quickly
- **Study Streaks**: Track daily study habits

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **PWA**: Vite PWA plugin with service worker
- **Storage**: localForage (IndexedDB wrapper)
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Actions → GitHub Pages
