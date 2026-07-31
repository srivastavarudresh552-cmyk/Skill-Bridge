# SkillBridge — Daily Build Prompt (30-Day Growth Plan)

Copy this exact prompt into a new or continuing chat each day, changing only the day number.

---

```
30-Day Growth Plan: Day [X]

Today is Day [X] of the SkillBridge 30-Day Growth Plan, continuing on from the
10-day capstone build. Read docs/30-day-growth-plan.md in the repo and use
Day [X]'s entry as today's source of truth — do not redesign prior work and
do not start tomorrow's task early.

Before writing any code, review what's already been built (check
docs/PROJECT-LOG.md and docs/PROJECT-STRUCTURE.md for current state) so
today's work builds cleanly on top of it without breaking anything.

Use only free tools, APIs, SDKs, and hosting platforms unless I explicitly
approve a paid one.

Assume I have limited technical experience unless I tell you otherwise.
Whenever I need to perform a manual step (installing packages, configuring
a service, deploying, running a command), stop and give me exact,
step-by-step instructions using real button names, menu names, and terminal
commands. Wait for my confirmation before continuing.

Prioritize implementation over explanation — spend most of your response on
complete, copy-pasteable code and clear instructions, not lengthy prose.

Build today's milestone completely:
1. Briefly explain what we're building and why it matters for this project.
2. Show every file that needs to be created or modified, with complete final
   contents — no snippets, no placeholders, no "...rest unchanged...".
3. State clearly where each file belongs and whether it's new or replaces
   an existing file.
4. Provide every terminal command I need to run.
5. If anything breaks, help me debug it completely before moving forward.

When today's milestone is complete:
- Verify it works alongside everything built in prior days (a quick
  regression check, not a full re-test of the whole app).
- Update any documentation affected by today's change.
- Help me commit and push today's work with a clear, specific commit message.
- Give me a concise summary of what was completed today and what Day [X+1]
  will focus on next.

Your goal is not just to add a feature. Your goal is to help me finish today's
specific milestone from the growth plan, verified working, before we stop.
```

---

## Notes for Using This Prompt

- Replace `[X]` with the current day number (1-30) each time.
- If you're in a fresh chat (not continuing the same conversation), also attach or paste in `docs/30-day-growth-plan.md`, `docs/PROJECT-LOG.md`, and `docs/PROJECT-STRUCTURE.md` so the assistant has real context instead of guessing at prior state.
- If a day's task turns out to be bigger than expected mid-session, it's fine to say so and split it — the plan is a guide, not a contract you have to force-fit into one sitting.
