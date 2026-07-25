# SkillBridge — Environment & Configuration Reference

## Backend Environment Variables (`server/.env`)

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/skillbridge?retryWrites=true&w=majority` |
| `JWT_SECRET` | Signs/verifies login tokens | random 32-byte hex string |
| `GEMINI_API_KEY` | Authenticates requests to Google Gemini | `AIza...` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

`server/.env.example` is committed to the repo (placeholder values only) so anyone cloning knows what to supply. `server/.env` itself is gitignored and never committed.

## Frontend Environment Variables (`client/.env`)

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | Base URL the frontend uses to reach the backend API | `http://localhost:5000/api` |

## AI Provider

- **Provider**: Google Gemini (switched from the originally planned Anthropic Claude — approved Day 3 decision)
- **SDK**: `@google/generative-ai`
- **Service module**: `server/src/services/geminiService.js`
- This change is reflected in `ARCHITECTURE.md`, `API.md`, and `PROJECT-STRUCTURE.md`.

## Tooling Installed

| Tool | Scope | Purpose |
|---|---|---|
| Node.js 18+ | Global | Runs both client and server |
| npm | Global | Package manager |
| nodemon | Backend dev dependency | Auto-restarts server on file changes |
| Vite | Frontend | Dev server + build tool |
| Tailwind CSS (`@tailwindcss/vite`) | Frontend | Utility-first styling |
| ESLint, Prettier, MongoDB for VS Code, DotENV | VS Code extensions | Code quality, DB browsing, `.env` readability |

## Database

- **Provider**: MongoDB Atlas, free M0 cluster
- **Database name**: `skillbridge`
- **Access**: Network Access configured to allow the developer's IP (or `0.0.0.0/0` for development convenience)
- **Collections**: `users`, `roadmaps` (see `SCHEMA.md`)

## Hosting (planned, not yet deployed)
- Frontend: Render Static Site
- Backend: Render Web Service
- Both use the same env variables above, set via the Render dashboard instead of a local `.env` file.
