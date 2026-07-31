# SkillBridge — Project Log

## Day 1
- Defined PRD, Implementation Blueprint, and Pitch Deck.
- Scope locked: MERN + Claude API + JWT + bcrypt + MongoDB Atlas + Render.

## Day 2 — Technical Blueprint
- Created GitHub repository `Skill-Bridge` (public) and cloned it locally.
- Scaffolded initial project structure: `client/` (React + Vite), `server/` (Express, with `src/{config,controllers,middleware,models,routes}`), and `docs/`.
- Finalized tech stack (see `ARCHITECTURE.md`): React/Vite/Tailwind frontend, Express/Mongoose backend, JWT + bcrypt auth, Claude API via `@anthropic-ai/sdk`, `pdf-parse` for resume text extraction, `multer` for uploads, MongoDB Atlas M0, Render for both frontend (Static Site) and backend (Web Service).
- Designed full system architecture with component diagram, data flow, request lifecycle, and AI interaction detail — `ARCHITECTURE.md`.
- Designed database schema for `users` and `roadmaps` collections, validated against every PRD user story — `SCHEMA.md`.
- Designed complete v1.0 API surface (7 endpoints across Auth and Roadmap resources) with request/response/validation/error cases — `API.md`.
- Designed full user flow, screen list, and low-fidelity wireframes for 7 screens — `UI-WIREFRAMES.md`.
- Documented full project folder structure and where future code will live — `PROJECT-STRUCTURE.md`.
- Ran Day 3 readiness check: scope confirmed unchanged from PRD, no unnecessary additions, implementation can begin immediately on Day 3.

**Status at end of Day 2**: Planning complete. All design docs committed. Ready to begin implementation (auth first) on Day 3, no further planning needed.

## Day 3 — Project Setup & Foundation
- Configured development environment: Node.js verified, VS Code extensions (ESLint, Prettier, MongoDB for VS Code, DotENV) installed.
- Connected MongoDB Atlas cluster (database user + network access configured).
- **Switched AI provider from Anthropic Claude to Google Gemini** (approved change) — updated `ARCHITECTURE.md`, `API.md`, `PROJECT-STRUCTURE.md` accordingly.
- Installed all backend and frontend dependencies per the finalized stack.
- Built backend foundation: DB connection, `User`/`Roadmap` Mongoose models, JWT auth middleware scaffold, Gemini service scaffold, Express app with working `/api/health` route.
- Built frontend foundation: Tailwind CSS, Axios API client with JWT interceptor, AuthContext scaffold, Navbar, six routed page stubs.
- Verified full-stack "Hello World": landing page successfully fetches and displays live backend status.
- Established Git branching strategy (`main` + daily feature branches); Day 3 work committed and merged to `main`.

**Status at end of Day 3**: Foundation complete and verified working end-to-end. Ready to begin implementing authentication (Day 4), no further setup needed.

## Day 4 — Core Feature Implementation: Authentication
- Built real backend auth: `authController.js` (signup, login, getMe) with bcrypt password hashing, JWT issuance, and full validation/error handling matching `API.md`.
- Wired `authRoutes.js` into `app.js`.
- Tested all three endpoints directly via Thunder Client (signup 201, login 200, protected `/me` 200 with bearer token) — all verified against a real MongoDB Atlas document.
- Built frontend: functional `Signup.jsx` and `Login.jsx` forms wired to a real `AuthContext` (signup/login/logout, token + user persisted to localStorage).
- Added `ProtectedRoute.jsx` — guards `/dashboard`, `/roadmaps/new`, `/roadmaps/:id`.
- Updated `Navbar.jsx` and `Dashboard.jsx` to reflect real auth state.
- Verified in-browser: signup → auto-redirect to Dashboard → logout → protected-route redirect to `/login` → login → back to Dashboard. All working.

**Status at end of Day 4**: Authentication feature fully implemented and verified end-to-end (backend + frontend + protected routing). Ready to build the Create Roadmap feature (Day 5).

## Day 5 — Core Feature: AI Roadmap Generation
- Built resume upload (`multer`), PDF text extraction (`pdf-parse`), and full Gemini integration (`geminiService.js`) with structured JSON output, retry-on-invalid-JSON, and error handling.
- Diagnosed and fixed a Gemini model deprecation (`gemini-2.5-flash` → `gemini-3.1-flash-lite`) mid-build.
- Built full roadmap CRUD API (create/list/get/updateProgress/delete) with ownership checks — verified via Postman against real MongoDB documents.
- Built frontend Create Roadmap form, Dashboard roadmap list with live progress bars, and Roadmap Detail page with interactive step checklist.
- Verified the complete end-to-end loop in-browser: upload resume → real AI analysis → view roadmap → track progress → see it reflected on the dashboard.

**Status at end of Day 5**: Core feature (AI-powered skill-gap roadmap generation + progress tracking) fully implemented, tested with real data, and working end-to-end alongside Day 4's authentication. **Deployed to production** on Render (backend Web Service + frontend Static Site, both free tier) — fixed a deploy-only bug (stray `node` package in dependencies breaking `pdf-parse`) and verified the complete signup-to-roadmap flow live.

## Day 6 — Complete the MVP & Deliver a Working Demo
- Added the required footer ("Built with Claude as part of the AB Talks 60-Day Claude AI Challenge"), verified visible on the live deployed site.
- Fixed a production-only SPA routing bug: direct navigation to client-side routes returned "Not Found" on Render — resolved with a `/*` → `/index.html` rewrite rule.
- Ran a full regression pass on the **live production site**: signup, logout, protected-route redirect, login, second roadmap creation, progress persistence, roadmap deletion, and footer visibility across all pages — all passed.

**Status at end of Day 6**: Working MVP fully deployed and verified live — every core feature (auth, AI roadmap generation, progress tracking, roadmap management) functions together correctly in production. Demo-ready.

## Day 7 — Product Refinement & User Experience
- Built a shared design system: Tailwind v4 theme tokens, Inter font, and reusable UI primitives (Spinner, Badge, EmptyState, ErrorBanner, Skeleton, FileDropzone, AnalyzingLoader, ProgressRing).
- Redesigned every screen: Navbar (responsive/sticky), Footer, Landing (real hero + how-it-works), Login/Signup (password toggle + strength meter), Dashboard (skeletons, empty state, richer cards), Create Roadmap (drag-and-drop dropzone, char counter, rotating loading messages), Roadmap Detail (progress ring, priority badges, per-step save state).
- Senior review pass: added a 404 page, skip-to-content link, `prefers-reduced-motion` support, and fixed a mobile header layout issue.
- Ran full regression on the live production site after deploying — every feature confirmed working with the new UI.

**Status at end of Day 7**: MVP is now a polished, portfolio-worthy application — accessible, responsive, and fully verified live in production.

## Day 8 — Testing, Debugging & Production Optimization
- Conducted a full senior QA/security/performance review; fixed every issue found across backend and frontend.
- Backend hardening: rate limiting on auth routes, `helmet` security headers, strict input type validation, ObjectId validation (no more 500s on bad IDs), `resumeText` no longer exposed in API responses (and capped in storage), Gemini 429 detection, process-level crash safety nets.
- Frontend resilience: session-expiry modal + auto-logout on 401, offline banner, keyboard-accessible file dropzone, fixed a file re-selection bug, error feedback on failed progress toggles, deduplicated password-toggle logic into a shared component.
- Full end-to-end walkthrough re-verified on the live production site after deploying all fixes.

**Status at end of Day 8**: Application reviewed and hardened to production-readiness standards — stable, secure, and verified end-to-end live. Approved for public launch.
