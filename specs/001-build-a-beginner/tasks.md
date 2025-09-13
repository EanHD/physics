# Tasks: Build a beginner-friendly quantum mechanics study app

**Input**: Design documents from `/home/eanhd/projects/physics/specs/001-build-a-beginner/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓), quickstart.md (✓)

## Execution Flow Summary
Based on analysis of available documents:
- **Tech Stack**: React + Vite + TypeScript + Tailwind CSS PWA
- **Storage**: IndexedDB with localForage for offline-first experience
- **Entities**: Module, Resource, UserProgress, ScheduleEntry, Quiz
- **Contracts**: 4 client-side API endpoints (modules, module content, progress, reviews)
- **Structure**: Single project with `src/` and `tests/` at repository root

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup & Infrastructure
- [ ] T001 Configure PostCSS for Tailwind CSS in `postcss.config.js`
- [ ] T002 Create ESLint configuration in `.eslintrc.json` for React + TypeScript
- [ ] T003 [P] Add PWA icons and manifest assets to `public/` directory

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (Client-side API)
- [ ] T004 [P] Contract test GET /api/modules in `tests/contract/modules.test.ts`
- [ ] T005 [P] Contract test GET /api/modules/{id} in `tests/contract/module-content.test.ts`  
- [ ] T006 [P] Contract test GET /api/progress in `tests/contract/progress-get.test.ts`
- [ ] T007 [P] Contract test POST /api/progress in `tests/contract/progress-post.test.ts`
- [ ] T008 [P] Contract test GET /api/reviews in `tests/contract/reviews.test.ts`

### Integration Tests (User Stories)
- [ ] T009 [P] Integration test module browsing in `tests/integration/browse-modules.test.ts`
- [ ] T010 [P] Integration test study session flow in `tests/integration/study-session.test.ts`
- [ ] T011 [P] Integration test progress tracking in `tests/integration/progress-tracking.test.ts`
- [ ] T012 [P] Integration test spaced repetition in `tests/integration/spaced-repetition.test.ts`
- [ ] T013 [P] Integration test PWA offline mode in `tests/integration/offline-mode.test.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Data Models & Storage
- [ ] T014 [P] Module model in `src/lib/models/Module.ts`
- [ ] T015 [P] Resource model in `src/lib/models/Resource.ts`
- [ ] T016 [P] UserProgress model in `src/lib/models/UserProgress.ts`
- [ ] T017 [P] Quiz model in `src/lib/models/Quiz.ts`
- [ ] T018 Storage service with localForage in `src/lib/services/StorageService.ts`

### Content & Module Services
- [ ] T019 Content loader service in `src/lib/services/ContentService.ts`
- [ ] T020 Module service in `src/lib/services/ModuleService.ts`
- [ ] T021 Progress service in `src/lib/services/ProgressService.ts`
- [ ] T022 Spaced repetition service (SM-2) in `src/lib/services/SpacedRepetitionService.ts`

### React Hooks & Utilities
- [ ] T023 [P] useTheme hook in `src/hooks/useTheme.tsx`
- [ ] T024 [P] useModules hook in `src/hooks/useModules.ts`
- [ ] T025 [P] useProgress hook in `src/hooks/useProgress.ts`
- [ ] T026 [P] useSpacedRepetition hook in `src/hooks/useSpacedRepetition.ts`

### UI Components (Layout & Navigation)
- [ ] T027 [P] Layout component in `src/components/Layout.tsx`
- [ ] T028 [P] Navigation component in `src/components/Navigation.tsx`
- [ ] T029 [P] ThemeToggle component in `src/components/ThemeToggle.tsx`
- [ ] T030 [P] OfflineIndicator component in `src/components/OfflineIndicator.tsx`

### UI Components (Module & Progress)
- [ ] T031 [P] ModuleCard component in `src/components/ModuleCard.tsx`
- [ ] T032 [P] ProgressRing component in `src/components/ProgressRing.tsx`
- [ ] T033 [P] QuizComponent in `src/components/QuizComponent.tsx`
- [ ] T034 [P] StudyStreak component in `src/components/StudyStreak.tsx`

### Page Components
- [ ] T035 [P] Home page in `src/pages/Home.tsx`
- [ ] T036 [P] Modules page in `src/pages/Modules.tsx`
- [ ] T037 ModuleDetail page in `src/pages/ModuleDetail.tsx`
- [ ] T038 [P] Progress page in `src/pages/Progress.tsx`
- [ ] T039 [P] Reviews page in `src/pages/Reviews.tsx`
- [ ] T040 [P] Settings page in `src/pages/Settings.tsx`

## Phase 3.4: Integration & Polish
- [ ] T041 Connect content loader to generated modules in `content/`
- [ ] T042 Implement quiz scoring and progress updates
- [ ] T043 Add error boundaries and loading states
- [ ] T044 PWA installation prompts and service worker registration
- [ ] T045 Export/import functionality for user progress

## Phase 3.5: Testing & Validation
- [ ] T046 [P] Unit tests for SpacedRepetitionService in `tests/unit/spaced-repetition.test.ts`
- [ ] T047 [P] Unit tests for StorageService in `tests/unit/storage.test.ts`
- [ ] T048 [P] Unit tests for ContentService in `tests/unit/content.test.ts`
- [ ] T049 E2E test complete study flow using Playwright
- [ ] T050 Performance validation (<3s initial load, smooth animations)

## Dependencies
- **Setup (T001-T003)** before everything
- **Tests (T004-T013)** before implementation (T014-T045) - TDD ENFORCED
- **Models (T014-T017)** before services (T018-T022)
- **Services (T018-T022)** before hooks (T023-T026)
- **Hooks & components (T023-T034)** before pages (T035-T040)
- **Core implementation (T014-T040)** before integration (T041-T045)
- **Everything** before final testing (T046-T050)

## Parallel Execution Examples

### Phase 3.2: All contract tests can run together
```bash
# Launch T004-T008 together (different test files):
Task: "Contract test GET /api/modules in tests/contract/modules.test.ts"
Task: "Contract test GET /api/modules/{id} in tests/contract/module-content.test.ts"
Task: "Contract test GET /api/progress in tests/contract/progress-get.test.ts"
Task: "Contract test POST /api/progress in tests/contract/progress-post.test.ts"
Task: "Contract test GET /api/reviews in tests/contract/reviews.test.ts"
```

### Phase 3.3: Models can be implemented in parallel
```bash
# Launch T014-T017 together (different model files):
Task: "Module model in src/lib/models/Module.ts"
Task: "Resource model in src/lib/models/Resource.ts"  
Task: "UserProgress model in src/lib/models/UserProgress.ts"
Task: "Quiz model in src/lib/models/Quiz.ts"
```

### Phase 3.3: UI components can be built in parallel
```bash
# Launch T027-T030 together (different component files):
Task: "Layout component in src/components/Layout.tsx"
Task: "Navigation component in src/components/Navigation.tsx"
Task: "ThemeToggle component in src/components/ThemeToggle.tsx"
Task: "OfflineIndicator component in src/components/OfflineIndicator.tsx"
```

## Notes
- **[P] tasks** = different files, no dependencies between them
- **TDD CRITICAL**: All tests (T004-T013) must be written and failing before any implementation
- **PWA Focus**: Offline-first, mobile-optimized, installable experience
- **Storage Strategy**: IndexedDB for persistence, service worker for content caching
- **Content Source**: Generated modules from `physics_study/study_resources.md`
- Commit after each task completion
- Verify tests pass after each implementation task

## Validation Checklist
✅ All contracts (5 endpoints) have corresponding test tasks  
✅ All entities (Module, Resource, UserProgress, Quiz) have model tasks  
✅ All tests come before implementation (T004-T013 before T014+)  
✅ Parallel tasks are truly independent (different files)  
✅ Each task specifies exact file path  
✅ No task modifies same file as another [P] task  
✅ PWA requirements (offline, installable) addressed  
✅ Spaced repetition (SM-2) implementation included