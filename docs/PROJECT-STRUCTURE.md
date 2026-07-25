# SkillBridge — Project Structure

```
Skill-Bridge/
├── client/                      # React (Vite) frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/              # images, icons (not yet populated)
│   │   ├── components/          # Navbar.jsx built; Button/SkillTag/ProgressBar land here Day 4+
│   │   ├── context/              # AuthContext.jsx (JWT/user state scaffold)
│   │   ├── pages/                # Landing.jsx (live "Hello World"), Login/Signup/Dashboard/
│   │   │                         # CreateRoadmap/RoadmapDetail (placeholder stubs, built Day 4+)
│   │   ├── services/              # api.js — shared Axios instance with JWT interceptor
│   │   ├── App.jsx                # routing (React Router)
│   │   └── main.jsx                # entry point — wraps App in BrowserRouter + AuthProvider
│   ├── .env                       # not committed — VITE_API_URL
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # includes @tailwindcss/vite plugin
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/               # db.js — Mongoose connection (built, working)
│   │   ├── controllers/          # empty — authController.js, roadmapController.js land here Day 4+
│   │   ├── middleware/           # authMiddleware.js — JWT verify scaffold (built, not yet wired to routes)
│   │   ├── models/                # User.js, Roadmap.js — full Mongoose schemas (built, matches SCHEMA.md)
│   │   ├── routes/                # empty — authRoutes.js, roadmapRoutes.js land here Day 4+
│   │   ├── services/              # geminiService.js — Gemini client initialized (built);
│   │   │                         # resumeParser.js lands here Day 4+
│   │   └── app.js                 # Express app setup — CORS, JSON, morgan, /api/health route (built, working)
│   ├── server.js                  # entry point — connects DB, then starts listening (built, working)
│   ├── .env                       # not committed — local secrets
│   ├── .env.example               # committed — placeholder values for onboarding
│   └── package.json
│
├── docs/                         # design + setup deliverables
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   ├── PROJECT-STRUCTURE.md
│   ├── PROJECT-LOG.md            # running day-by-day log
│   ├── SETUP.md                  # installation guide (added Day 3)
│   ├── ENVIRONMENT.md            # env vars & config reference (added Day 3)
│   └── DAY3-SUMMARY.md           # added Day 3
│
├── .gitignore
└── README.md
```

**AI provider note**: switched from Anthropic Claude (PRD original) to Google Gemini on Day 3 — approved change, reflected everywhere above and in `ARCHITECTURE.md`/`API.md`.

## Rationale

- **`client/` and `server/` fully separated** at the repo root — allows independent deployment as two Render services (Static Site + Web Service) without one build interfering with the other.
- **`services/` layer on the backend** — isolates external calls (Gemini API, PDF parsing) from `controllers/`, so route logic stays thin and these services are easy to unit-test or mock later.
- **`context/` on the frontend, not Redux** — matches the Step 1 decision to keep state management minimal for this scope.
- **`docs/` lives at the repo root, not inside `server/` or `client/`** — it documents the whole system, not one half of it.
- **No `tests/` folder yet** — intentionally deferred; test structure will be added when Day 3+ implementation begins, per PRD's phased SDLC (Design today, Implementation starting Day 3).

## Where Future Code Lands

| Task (Day 3+) | Goes in |
|---|---|
| Signup/Login logic | `server/src/controllers/authController.js`, `server/src/routes/authRoutes.js` |
| JWT verification | `server/src/middleware/authMiddleware.js` |
| User/Roadmap schemas | `server/src/models/` |
| Gemini prompt + call | `server/src/services/geminiService.js` |
| Resume PDF parsing | `server/src/services/resumeParser.js` |
| Dashboard UI | `client/src/pages/Dashboard.jsx` |
| Roadmap creation form | `client/src/pages/CreateRoadmap.jsx` |
| Auth token storage/state | `client/src/context/AuthContext.jsx` |
