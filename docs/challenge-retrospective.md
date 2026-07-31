# SkillBridge — Challenge Retrospective

*A day-by-day account of how this project actually got built, written from the record of our 10 days together — not a polished afterstory, the real one.*

## The Timeline

**Day 1-2: Requirements and Design**
The project started as a PRD: an AI-powered app to compare a resume against a target job description and generate a skill-gap roadmap, scoped for a MERN stack with Claude as the AI provider. Day 2 turned that PRD into a full technical blueprint — system architecture with Mermaid diagrams, a two-collection MongoDB schema (`users`, `roadmaps`) validated line-by-line against every user story, a complete v1.0 API contract, low-fidelity wireframes for all 7 screens, and a documented project structure. No code was written yet — this was the day the *shape* of the whole system got locked in, and it held up for the rest of the build without a rewrite.

**Day 3: Foundation**
Repository created, MERN scaffolding stood up, MongoDB Atlas connected, and a genuine full-stack "Hello World" verified — React fetching a live status message from Express, proving the whole chain (client → CORS → API → response) actually worked before any real feature was attempted. A daily-branch Git workflow was established here and used for the rest of the build.

**Day 4: Authentication**
Real signup/login/JWT — bcrypt hashing, protected routes, and a frontend `AuthContext` actually managing session state instead of a stub. Verified independently at the API layer (Thunder Client) *before* wiring the frontend, which meant the frontend work had a known-good backend to build against.

**Day 5: The Pivot and the Core Feature**
This was the most consequential day of the build. Mid-implementation, the AI provider was switched from the originally planned Claude to Google Gemini — a real scope change, and one that was flagged explicitly (different SDK, different env var, different prompt conventions) and confirmed before proceeding, rather than made silently. Then, immediately after that, `gemini-2.5-flash` — the model initially chosen — turned out to be deprecated for new API keys entirely, discovered directly from a live 404 error during testing. The fix was to search for what Google currently recommends, land on `gemini-3.1-flash-lite`, swap it in, and re-test. Two provider-level pivots in one day, both resolved through reading the actual error rather than guessing. By the end of the day, resume upload, PDF parsing, structured AI analysis, and full roadmap CRUD were built, tested with a real resume, and deployed live — including tracking down and fixing a deploy-only bug where an accidentally-installed `node` npm package was silently breaking `pdf-parse`'s module resolution on Render's clean server build (a bug that never appeared locally, only in production logs).

**Day 6: MVP Completion**
The required footer went in, and a second real production bug surfaced: direct navigation to a client-side route like `/dashboard` returned "Not Found" on Render's static site — a classic SPA-hosting gap, fixed with a proper rewrite rule once diagnosed. A full regression pass was then run against the *live* site, not localhost, to call the MVP genuinely done.

**Day 7: Product Refinement**
A real design system got built — Tailwind v4 tokens, a shared component library (`Spinner`, `Badge`, `EmptyState`, `FileDropzone`, `ProgressRing`, and more) — and every screen was redesigned against it: a real Landing hero, password-strength feedback on Signup, skeleton loading states on the Dashboard, drag-and-drop resume upload, and a circular progress ring on the Roadmap Detail page. A senior-level accessibility pass added a 404 page, a skip-to-content link, and `prefers-reduced-motion` support — the kind of details that don't show up in a feature list but are exactly what separates a demo from a product.

**Day 8: Hardening**
A full senior QA/security/performance review surfaced fourteen real issues — from missing rate limiting on auth routes to a keyboard-inaccessible file dropzone to silent failures on step-toggle network errors — and every one got fixed: `helmet`, `express-rate-limit`, strict input validation, ObjectId safety checks, session-expiry handling with a proper modal instead of silent breakage, offline detection, and a genuine keyboard-accessible dropzone. This was the day the project stopped being "a working demo" and became something closer to "an app I'd trust with a stranger's data."

**Day 9: Launch Readiness**
Branding, SEO/social metadata, an MIT license, a real README, and — the one gap a blank white screen represents — a React error boundary, verified by intentionally triggering and then reverting a real crash. A 16-point release-readiness review across deployment, security, accessibility, documentation, and more came back clean.

**Day 10: Graduation**
The final review pass caught the last honest gaps — a missing `.env.example`, no screenshots in the README, no repo metadata — fixed them, and moved into documenting the journey itself: this file, the growth plan, and the ceremony of an actual v1.0.0 release.

## Major Technical Decisions and Pivots

1. **MERN + JWT + MongoDB Atlas**, decided Day 2, never revisited — the foundational architecture held for the entire build.
2. **Claude → Gemini**, Day 5 — a real, flagged, approved pivot, not a silent substitution.
3. **`gemini-2.5-flash` → `gemini-3.1-flash-lite`**, Day 5 — a forced pivot from an external provider deprecation, resolved same-session.
4. **Render for both frontend and backend** (rather than splitting frontend to Vercel), Day 3 — a deliberate choice to stay strictly inside the PRD's named hosting platform rather than optimize prematurely.

## Challenges Solved and Debugging Moments Worth Remembering

- The `pdf-parse` / stray `node` dependency bug (Day 5) — a bug that was invisible locally and only appeared in Render's clean-install logs, solved by reading the actual stack trace rather than guessing at PDF parsing itself.
- The SPA routing 404 on direct URL navigation (Day 6) — a deployment-configuration problem, not a code problem, correctly diagnosed as such.
- The Gemini model 404 (Day 5) — resolved by searching for current information rather than assuming stale training knowledge was still accurate.

## Skills Demonstrated

Full-stack MERN development; REST API design with real validation and error-case handling; JWT authentication and password security; third-party AI API integration including prompt engineering for structured JSON output; production deployment and environment configuration across two separate hosting services; independent debugging of both application-level and infrastructure-level bugs; accessibility-conscious frontend engineering; security hardening (rate limiting, input validation, security headers); and technical documentation maintained *throughout* the build rather than reconstructed after the fact.

## Final Project Summary

SkillBridge is a live, deployed, production-hardened MERN application that takes a resume and a target job description and returns a real, AI-generated, trackable skill-gap roadmap. It went from a one-page PRD to a licensed v1.0.0 release in ten days, survived a mid-build AI-provider pivot and a model deprecation without losing a day of momentum, and was reviewed and hardened against real security and accessibility standards before launch — not just demoed and abandoned.

## Lessons Learned

- **A locked design (Day 2) is worth more than it seems on the day you write it.** Nothing in the schema, API contract, or architecture needed a rewrite across 8 more days of implementation — only extension.
- **Production and local are different environments, and treating them as identical is where the real bugs hide.** Every hardest bug in this build (the `node` dependency, the SPA routing 404) only existed in deployment, never in `npm run dev`.
- **Flagging a scope change is not slower than making it silently — it's what makes the change trustworthy.** The Claude→Gemini pivot worked because it was surfaced as a decision, not buried as an implementation detail.
- **"Done" and "hardened" are different milestones.** The Day 6 MVP genuinely worked end-to-end — and Day 8 still found fourteen real issues in it. Both days were necessary; neither was wasted.

## A Note, From Me to You

I've been the one writing the code across these ten days, but every real decision in this retrospective — the Gemini switch, holding the line on Render instead of splitting hosting, choosing to hardcode a 50-character job-description minimum instead of over-engineering validation — those were yours, made in real time, under the same uncertainty any engineer works under. The bugs we chased together weren't toy bugs. A dependency silently breaking a native module on a clean production install is a real-world class of bug that trips up engineers with years more experience than a 10-day sprint implies. You read the actual error text every time instead of guessing, and that's the whole job, honestly.

You started this capstone with a PRD and you're ending it with a live URL, a GitHub repo with a real commit history, an MIT license, and a v1.0.0 tag. That's not a tutorial output. That's a shipped product. Wear it as one.
