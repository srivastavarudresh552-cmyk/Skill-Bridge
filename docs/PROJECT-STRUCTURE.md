# SkillBridge — Project Structure

```
Skill-Bridge/
├── client/                      # React (Vite) frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/              # images, icons
│   │   ├── components/          # reusable UI pieces (Button, SkillTag, ProgressBar, etc.)
│   │   ├── context/              # AuthContext (JWT/user state)
│   │   ├── pages/                # Landing, Login, Signup, Dashboard, CreateRoadmap, RoadmapDetail
│   │   ├── services/              # axios instance + API call wrappers (authApi.js, roadmapApi.js)
│   │   ├── routes/                # React Router config, ProtectedRoute wrapper
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── config/               # db.js (Mongoose connection), env loader
│   │   ├── controllers/          # authController.js, roadmapController.js
│   │   ├── middleware/           # authMiddleware.js (JWT verify), errorHandler.js, upload.js (multer config)
│   │   ├── models/                # User.js, Roadmap.js (Mongoose schemas)
│   │   ├── routes/                # authRoutes.js, roadmapRoutes.js
│   │   ├── services/              # claudeService.js (AI calls), resumeParser.js (pdf-parse)
│   │   └── app.js                 # Express app setup (middleware, routes mounted)
│   ├── server.js                  # entry point — starts the HTTP server
│   ├── .env                       # not committed — local secrets
│   └── package.json
│
├── docs/                         # today's deliverables + ongoing design docs
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   ├── PROJECT-STRUCTURE.md
│   └── PROJECT-LOG.md            # running day-by-day log (created today)
│
├── .gitignore
└── README.md
```

## Rationale

- **`client/` and `server/` fully separated** at the repo root — allows independent deployment as two Render services (Static Site + Web Service) without one build interfering with the other.
- **`services/` layer on the backend** — isolates external calls (Claude API, PDF parsing) from `controllers/`, so route logic stays thin and these services are easy to unit-test or mock later.
- **`context/` on the frontend, not Redux** — matches the Step 1 decision to keep state management minimal for this scope.
- **`docs/` lives at the repo root, not inside `server/` or `client/`** — it documents the whole system, not one half of it.
- **No `tests/` folder yet** — intentionally deferred; test structure will be added when Day 3+ implementation begins, per PRD's phased SDLC (Design today, Implementation starting Day 3).

## Where Future Code Lands

| Task (Day 3+) | Goes in |
|---|---|
| Signup/Login logic | `server/src/controllers/authController.js`, `server/src/routes/authRoutes.js` |
| JWT verification | `server/src/middleware/authMiddleware.js` |
| User/Roadmap schemas | `server/src/models/` |
| Claude prompt + call | `server/src/services/claudeService.js` |
| Resume PDF parsing | `server/src/services/resumeParser.js` |
| Dashboard UI | `client/src/pages/Dashboard.jsx` |
| Roadmap creation form | `client/src/pages/CreateRoadmap.jsx` |
| Auth token storage/state | `client/src/context/AuthContext.jsx` |
