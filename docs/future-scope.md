# SkillBridge — Future Scope

This isn't a generic "add more features" list — it's grounded in what SkillBridge actually is today (a MERN app with Gemini-powered resume/JD analysis, JWT auth, and roadmap progress tracking) and the real gaps and opportunities that fall directly out of that.

## Next 3 Months: Depth Over Breadth

The MVP proves the core loop works. The next quarter is about making that loop *trustworthy* and *sticky*.

- **Resume parsing robustness**: `pdf-parse` handles text-based PDFs well but fails on scanned/image-based resumes. Add OCR fallback (e.g. Tesseract.js) so a scanned resume doesn't hit a dead-end `PDF_PARSE_FAILED` error.
- **Roadmap step verification**: right now a step is "complete" the moment a user checks a box — no evidence required. Add optional artifact links (a GitHub repo, a certificate URL) attached to a completed step, turning the checklist into a lightweight portfolio.
- **Job description source expansion**: currently requires pasting raw text. Add a URL-paste option that fetches and extracts the JD from a LinkedIn/Indeed posting automatically — removes real user friction.
- **Password reset flow**: explicitly scoped out of the 10-day build; this becomes a real gap the moment there are actual users outside of testing.
- **Automated testing**: the one honestly-acknowledged gap from Day 8's review. Start with API integration tests for the auth and roadmap endpoints (Jest + Supertest), since those are the highest-risk surfaces.
- **Rate-limit-aware retry UX**: Gemini's free tier will get hit harder with real traffic. Add a visible "queued, retrying in Xs" state instead of a flat error when a 429 occurs.

## Next 6 Months: From Tool to Habit

Once the core product is hardened, the opportunity is turning a one-time analysis into an ongoing relationship with the user's career growth.

- **Roadmap re-analysis**: let a user re-run the AI analysis against an updated resume after they've completed some steps, and see how their gap has actually closed — this is the single highest-value feature not in the current scope, because it's the difference between "a report" and "a progress tool."
- **Multi-resume comparison**: users targeting multiple roles (already supported structurally via multiple roadmaps) could benefit from a single "meta-view" showing overlapping skill gaps across all their target roles — surfaces which skill to prioritize because it unlocks the most roles at once.
- **Email/notification nudges**: a simple weekly digest ("You're 40% through your Frontend Developer roadmap — here's your next step") using a free-tier email service (e.g. Resend or Brevo's free tier) to bring users back.
- **Public roadmap sharing**: an opt-in, shareable read-only link to a completed roadmap — a natural, low-effort viral/portfolio mechanic that fits the existing data model with minimal backend change (a `isPublic` flag on `Roadmap`).
- **Admin/analytics dashboard**: even a minimal one — most-requested target roles, most common gap skills across all users — would be genuinely interesting product data and a good engineering exercise in aggregation queries.

## Next 12 Months: Platform Maturity

- **Migrate off free-tier hosting constraints**: Render's free tier sleep/wake behavior is fine for a portfolio project but not for a product with real retention goals — moving to a low-cost paid tier (or a cold-start-tolerant architecture) becomes worth it once there's real usage data justifying the cost.
- **Swap or abstract the AI provider layer**: the Day 5 Claude→Gemini pivot proved the app can survive an AI provider change, but it required manual code edits across the service layer. A proper abstraction (a single `AIProvider` interface with pluggable implementations) would make future provider swaps or multi-provider fallback trivial instead of a manual migration.
- **Skill taxonomy standardization**: right now Gemini free-forms skill names ("TypeScript Advanced Patterns" vs "Advanced TypeScript"), so cross-roadmap analytics are noisy. Introduce a normalized skill taxonomy (even a simple internal lookup table) that the AI output gets mapped against.
- **Team/cohort mode**: for bootcamps or university career centers — a shared view where an instructor can see aggregate skill-gap trends across a cohort of students, without exposing individual resumes. This is the most significant scope expansion on this list and would need real design work, not just an incremental feature.

## What Won't Change

Regardless of which of the above gets built, the core architectural decisions from this capstone hold up: MERN stack, JWT auth, an AI service layer isolated from route/controller logic, and MongoDB's document model fitting the embedded `roadmapSteps`/`gapSkills` structure well. None of the above requires a rewrite — every item extends the existing schema and architecture rather than replacing it, which is itself a signal the Day 2 design decisions were sound.
