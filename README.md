# ResolveAI

AI-Powered Merchant Incident Resolution Agent

## Current Phase

**Phase 1 — Project Setup.** Infrastructure and UI only. No AI, no real payment
data, no tool-calling. See `PROJECT_SPEC.md` for the full product vision.

## Tech Stack

**Frontend:** React + Vite + Tailwind CSS
**Backend:** Node.js + Express
**Database:** MongoDB Atlas (via Mongoose)

## Architecture

```
React (frontend)  →  Express API (backend)  →  MongoDB Atlas
```

The frontend never talks to MongoDB directly. Only the Express backend holds
the database connection string.

## Project structure

```
resolve-ai/
├── frontend/     React + Vite + Tailwind — the incident workspace UI
├── backend/      Express + Mongoose — API and DB connection
├── .gitignore
├── README.md
└── PROJECT_SPEC.md
```

## Current Features

* Premium merchant incident-workspace UI (static demo data)
* React/Vite frontend with Tailwind CSS
* Express backend
* MongoDB Atlas connection foundation
* Health-check API (`GET /api/health`)
* Responsive layout (sidebar collapses on mobile, context panel hides below `xl`)

## Planned Features

* Incident memory
* AI agent
* Investigation tools
* Simulated payment environment
* Webhook replay
* Incident timeline
* Case memory
* Safety/approval system
* Evaluation framework

---

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env and paste in your MongoDB Atlas connection string
npm run dev
```

The server starts on `http://localhost:5000`. Visit
`http://localhost:5000/api/health` — you should see:

```json
{ "success": true, "message": "ResolveAI backend is running" }
```

The terminal should also print `MongoDB connected: <host>`.

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. You should see the ResolveAI workspace UI, and
the "System Ready" indicator in the top bar reflects whether it could reach
the backend's health endpoint.

---

## Setting up MongoDB Atlas

1. Create a free account/cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user (Database Access) with a username and password.
3. Under Network Access, allow your current IP (or `0.0.0.0/0` for local dev only).
4. Click **Connect → Drivers**, copy the connection string, and put it in
   `backend/.env` as `MONGODB_URI`, replacing `<username>` and `<password>`.

## Testing

**Backend**
```bash
cd backend
npm run dev
# check terminal for "MongoDB connected: ..."
# curl http://localhost:5000/api/health
```

**Frontend**
```bash
cd frontend
npm run dev
# check the browser console for errors
# resize the window to confirm the layout is responsive
```

## Common errors

| Symptom | Fix |
|---|---|
| `MONGODB_URI is not set` | Create `backend/.env` from `.env.example` and fill in your connection string. |
| Mongoose connection error / timeout | Check Atlas Network Access allows your IP, and the username/password in the URI are correct. |
| Frontend "System Ready" never turns green / CORS error in console | Make sure the backend is running on port 5000 and `frontend/.env` (if present) points `VITE_API_BASE_URL` at it. |
| `EADDRINUSE` on backend start | Another process is already using port 5000 — change `PORT` in `.env` or stop the other process. |

## Connecting to GitHub

```bash
git init          # if not already initialized
git add .
git commit -m "chore: initialize ResolveAI project"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Phase 1 completion checklist

- [x] React/Vite frontend runs
- [x] Tailwind CSS works
- [x] Distinctive ResolveAI incident-workspace UI (not a generic chatbot)
- [x] Sidebar with recent cases
- [x] Incident workspace + chat interface
- [x] Investigation preview card (static)
- [x] Memory preview card (static)
- [x] Right-side context panel
- [x] Express backend runs
- [x] `GET /api/health` returns success
- [x] MongoDB Atlas connection via Mongoose
- [x] `.env` excluded from git
- [x] Frontend never touches MongoDB directly
- [x] README + PROJECT_SPEC.md
- [x] Git initialized
- [x] No AI/agent functionality added yet

Next: **Phase 2 — Simulated payment backend.**
