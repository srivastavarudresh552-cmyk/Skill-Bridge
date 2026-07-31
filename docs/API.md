# SkillBridge — API Design (v1.0)

Base URL (local): `http://localhost:5000/api`
Base URL (prod): `https://<render-backend-url>/api`

Implemented Days 4-5; hardened Day 8 (rate limiting, strict input validation, ObjectId checks, `resumeText` no longer returned in any response).

**Day 8 additions**:
- `POST /api/auth/signup` and `POST /api/auth/login` are now rate-limited: 10 requests per 15 minutes per IP → `429 TOO_MANY_REQUESTS` beyond that.
- `POST /api/roadmaps` can now return `429 AI_RATE_LIMITED` if Gemini's free-tier rate limit is hit (distinct from other AI failures).
- All roadmap endpoints now validate the `:id` param is a real MongoDB ObjectId before querying, returning a clean `404` instead of a `500` for malformed IDs.
- `resumeText` is never included in any API response (create/get), even though it's still stored server-side for potential future use.

---

## Auth Endpoints

### `POST /api/auth/signup`
- **Purpose**: Register a new user.
- **Auth**: None.
- **Request body**:
  ```json
  { "name": "Jane Doe", "email": "jane@example.com", "password": "min8chars" }
  ```
- **Validation**: `name` 2–50 chars; `email` valid format, must not already exist; `password` min 8 chars.
- **Response (201)**:
  ```json
  { "user": { "id": "...", "name": "...", "email": "..." }, "token": "<JWT>" }
  ```
- **Error cases**:
  - `400` — validation failure (missing/malformed fields)
  - `409` — email already registered

### `POST /api/auth/login`
- **Purpose**: Authenticate an existing user.
- **Auth**: None.
- **Request body**: `{ "email": "...", "password": "..." }`
- **Validation**: Both fields required.
- **Response (200)**: `{ "user": {...}, "token": "<JWT>" }`
- **Error cases**:
  - `400` — missing fields
  - `401` — invalid email or password (generic message, no hinting which was wrong)

### `GET /api/auth/me`
- **Purpose**: Return the currently authenticated user's profile.
- **Auth**: Required (Bearer JWT).
- **Response (200)**: `{ "id": "...", "name": "...", "email": "..." }`
- **Error cases**: `401` — missing/invalid/expired token.

---

## Roadmap Endpoints

### `POST /api/roadmaps`
- **Purpose**: Create a new roadmap — accepts resume (PDF) + target job description, runs AI analysis, saves result.
- **Auth**: Required.
- **Request**: `multipart/form-data`
  - `resume`: PDF file (required, max 5MB)
  - `targetRole`: string (required)
  - `jobDescription`: string (required, min 50 chars)
- **Validation**: file must be `application/pdf`; `targetRole` and `jobDescription` required and non-empty.
- **Response (201)**: Full `Roadmap` document (see SCHEMA.md), including `matchedSkills`, `gapSkills`, `roadmapSteps`.
- **Error cases**:
  - `400` — missing file, wrong file type, missing text fields
  - `401` — not authenticated
  - `422` — PDF could not be parsed (corrupt/scanned image PDF)
  - `502` — Gemini API call failed or returned invalid structure after retry

### `GET /api/roadmaps`
- **Purpose**: List all roadmaps belonging to the logged-in user (Dashboard view).
- **Auth**: Required.
- **Response (200)**: Array of roadmap summaries (`_id`, `targetRole`, `createdAt`, completion percentage).
- **Error cases**: `401` — not authenticated.

### `GET /api/roadmaps/:id`
- **Purpose**: Fetch full detail of a single roadmap.
- **Auth**: Required; must own the roadmap.
- **Response (200)**: Full `Roadmap` document.
- **Error cases**:
  - `401` — not authenticated
  - `403` — roadmap belongs to a different user
  - `404` — roadmap not found

### `PATCH /api/roadmaps/:id/progress`
- **Purpose**: Mark one or more roadmap steps as completed/incomplete.
- **Auth**: Required; must own the roadmap.
- **Request body**: `{ "stepId": "...", "completed": true }`
- **Validation**: `stepId` must exist within the roadmap's `roadmapSteps`; `completed` must be boolean.
- **Response (200)**: Updated `Roadmap` document.
- **Error cases**:
  - `400` — invalid stepId or non-boolean value
  - `401` — not authenticated
  - `403` — not the owner
  - `404` — roadmap or step not found

### `DELETE /api/roadmaps/:id`
- **Purpose**: Delete a roadmap the user no longer wants.
- **Auth**: Required; must own the roadmap.
- **Response (200)**: `{ "message": "Roadmap deleted" }`
- **Error cases**:
  - `401` — not authenticated
  - `403` — not the owner
  - `404` — not found

---

## Cross-Cutting Rules

- Every non-auth route passes through the JWT auth middleware first; a missing/invalid/expired token always short-circuits to `401` before any DB or AI call.
- Ownership checks (`403`) happen at the controller level by comparing `req.user.id` to the resource's `userId`.
- All error responses follow one shape: `{ "error": { "code": "...", "message": "..." } }` for predictable client-side handling.
