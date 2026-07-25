# SkillBridge — Setup Guide

Follow this to get the project running from a fresh clone.

## Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas account with a cluster created, a database user, and Network Access set to allow your IP (or `0.0.0.0/0` for development)
- A Google Gemini API key from https://aistudio.google.com/apikey
- Git

## 1. Clone the repo
```
git clone https://github.com/srivastavarudresh552-cmyk/Skill-Bridge.git
cd Skill-Bridge
```

## 2. Backend setup
```
cd server
npm install
```
Create `server/.env` (copy `server/.env.example` and fill in real values):
```
PORT=5000
MONGO_URI=<your Atlas connection string>
JWT_SECRET=<random 32-byte hex string — generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
GEMINI_API_KEY=<your Gemini key>
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
Run the backend:
```
npm run dev
```
Verify: open `http://localhost:5000/api/health` — should return `{"status":"ok","message":"SkillBridge API is running"}`.

## 3. Frontend setup
In a new terminal:
```
cd client
npm install
```
Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```
Run the frontend:
```
npm run dev
```
Verify: open `http://localhost:5173` — should show the SkillBridge landing page with "Backend status: SkillBridge API is running".

## 4. VS Code Extensions (recommended)
- ESLint
- Prettier - Code formatter
- MongoDB for VS Code
- DotENV

## Troubleshooting
| Symptom | Likely Cause |
|---|---|
| "Backend not reachable" on landing page | Backend isn't running, or `VITE_API_URL` doesn't match the backend port |
| `MongoDB connection failed` in server terminal | Wrong password in `MONGO_URI`, or your IP isn't whitelisted in Atlas Network Access |
| CORS error in browser console | `CLIENT_URL` in `server/.env` doesn't match the frontend's actual URL/port |
