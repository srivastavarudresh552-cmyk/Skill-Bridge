# SkillBridge — Project Structure

```
Skill-Bridge/
├── client/                      # React (Vite) frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/              # images, icons (not yet populated)
│   │   ├── components/          # Navbar.jsx, ProtectedRoute.jsx (Day 4); Footer.jsx (Day 6);
│   │   │                         # ui/ — Spinner, Badge, EmptyState, ErrorBanner, Skeleton, FileDropzone,
│   │   │                         # AnalyzingLoader, ProgressRing — shared design system primitives (Day 7)
│   │   ├── context/              # AuthContext.jsx — real signup/login/logout (built, Day 4)
│   │   ├── pages/                # Landing.jsx, Login.jsx, Signup.jsx, Dashboard.jsx (built, Day 4);
│   │   │                         # CreateRoadmap.jsx, RoadmapDetail.jsx — full upload + AI flow + progress tracking (built, Day 5);
│   │   │                         # NotFound.jsx — 404 catch-all route (Day 7); all pages redesigned Day 7
│   │   ├── utils/                # formatDate.js — relative time formatting (Day 7)
│   │   ├── services/              # api.js (Axios + JWT interceptor), roadmapApi.js (built, Day 5)
│   │   ├── App.jsx                # routing (React Router), all roadmap routes protected
│   │   └── main.jsx                # entry point — wraps App in BrowserRouter + AuthProvider
│   ├── .env                       # not committed — VITE_API_URL
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # includes @tailwindcss/vite plugin
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/               # db.js — Mongoose connection (built, working)
│   │   ├── controllers/          # authController.js (Day 4); roadmapController.js — create/list/get/
│   │   │                         # updateProgress/delete, all verified against real Gemini calls (Day 5)
│   │   ├── middleware/           # authMiddleware.js (JWT verify, wired to routes, Day 4);
│   │   │                         # upload.js — multer PDF upload config (Day 5)
│   │   ├── models/                # User.js, Roadmap.js — full Mongoose schemas (matches SCHEMA.md)
│   │   ├── routes/                # authRoutes.js (Day 4); roadmapRoutes.js (Day 5)
│   │   ├── services/              # geminiService.js — full prompt construction + JSON parsing + retry,
│   │   │                         # using gemini-3.1-flash-lite (free tier); resumeParser.js — pdf-parse wrapper (Day 5)
│   │   └── app.js                 # Express app setup — CORS, JSON, morgan, /api/health, auth + roadmap routes mounted
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
