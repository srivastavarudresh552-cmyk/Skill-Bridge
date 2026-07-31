# SkillBridge — 30-Day Growth Plan

A realistic, one-milestone-per-day roadmap taking SkillBridge from its current v1.0.0 state toward the "Next 3 Months" goals in `future-scope.md`. Each day assumes 1-3 focused hours and builds directly on the day before — no day requires re-architecting prior work.

## Week 1: Testing Foundation (the honestly-acknowledged gap)

- **Day 1**: Set up Jest + Supertest in `server/`. Write the first integration test: `POST /api/auth/signup` — happy path + duplicate email.
- **Day 2**: Extend auth tests: login (correct/incorrect password), `/me` with valid/invalid/missing token.
- **Day 3**: Add a test MongoDB setup (in-memory via `mongodb-memory-server`) so tests don't touch your real Atlas cluster.
- **Day 4**: Write roadmap CRUD tests: create (mocking the Gemini call so tests don't burn real API quota), list, get, delete.
- **Day 5**: Write tests for the progress-update endpoint and the ownership checks (403 when a roadmap isn't yours).
- **Day 6**: Add a GitHub Actions workflow (`.github/workflows/test.yml`) that runs the test suite on every push — your first real CI.
- **Day 7**: Review week 1 — confirm all tests pass in CI, write a short `docs/TESTING.md` documenting how to run them locally.

## Week 2: Resilience and Real-World Input Handling

- **Day 8**: Add OCR fallback for scanned PDFs — integrate `tesseract.js`, trigger it only when `pdf-parse` returns near-empty text.
- **Day 9**: Add a visible retry countdown UI when Gemini returns a 429, instead of a flat error message.
- **Day 10**: Add server-side logging for AI response parse failures (log the raw Gemini output, not just "invalid JSON") so future debugging has real data to work from.
- **Day 11**: Build the password reset flow — backend: token generation + expiry, email-free version first (a reset link with a signed token shown directly in the UI for now, since email is next week).
- **Day 12**: Password reset flow — frontend: "Forgot password" page, reset form, wire to backend.
- **Day 13**: Add basic request logging/monitoring — a simple `/api/admin/stats` endpoint (protected, just for you) showing total users and roadmaps created.
- **Day 14**: Review week 2 — full regression pass on staging, update `API.md` with the two new endpoints.

## Week 3: The Highest-Value Feature — Re-Analysis

- **Day 15**: Design the re-analysis data model: add an `analysisHistory` array to `Roadmap` storing each past analysis snapshot with a timestamp.
- **Day 16**: Build the backend endpoint: `POST /api/roadmaps/:id/reanalyze` — accepts a new resume, re-runs the Gemini comparison against the *same* job description, appends to history.
- **Day 17**: Build the frontend trigger: an "Update My Progress" button on Roadmap Detail that opens a small re-upload modal.
- **Day 18**: Build the comparison view: show old gap skills vs. new gap skills side by side — this is the moment a user sees their actual growth.
- **Day 19**: Add a simple line-style visual (even just a text delta: "3 skills closed since last analysis") — no need for a charting library yet.
- **Day 20**: Test the full re-analysis loop end-to-end with a real updated resume; fix any edge cases (what if the new resume is worse-matched than before?).
- **Day 21**: Review week 3 — this was the biggest feature of the month, so give it a full regression pass and update `SCHEMA.md` and `ARCHITECTURE.md` to reflect the new data flow.

## Week 4: Retention and Sharing

- **Day 22**: Add a `Resend` (or similar free-tier email API) integration — send a welcome email on signup.
- **Day 23**: Build a weekly digest email job (a simple scheduled function, even a manually-triggered one for now) summarizing roadmap progress.
- **Day 24**: Add an `isPublic` boolean to the `Roadmap` schema and a public read-only view route (`/public/roadmaps/:id`) with resume text and personal data stripped.
- **Day 25**: Add a "Share" button on Roadmap Detail that toggles `isPublic` and copies the public link.
- **Day 26**: Polish the public view page — no auth-required navbar, a small "Made with SkillBridge" footer link back to signup (your first real growth loop).
- **Day 27**: Security pass on the new public route — confirm no private data (email, resumeText, other users' roadmaps) is reachable through it under any input.
- **Day 28**: Add basic rate limiting to the new public/email endpoints (same pattern as Day 8 of the original build).
- **Day 29**: Full end-to-end regression across every feature added this month, deployed to production.
- **Day 30**: Write a `v1.1.0` changelog, tag the release, and update `future-scope.md` — cross off what's now done, and add whatever new opportunities this month's work revealed.

## How to Use This Plan

Each day is scoped to be genuinely completable in a short focused session — if a day's task feels too big once you're in it, that's a signal to split it further, not to skip ahead. Use `daily-build-prompt.md` each day, just updating the day number — it will always have full context of what's been built so far.
