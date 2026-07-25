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
