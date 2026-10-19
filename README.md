# BuildPilot AI

**Describe a website in plain English. Get a working React + Tailwind app you can edit, preview and download.**

BuildPilot uses Google Gemini to generate the code, then lets you refine it by chatting with the AI, editing in a built-in code editor, and watching a live preview update as you go.

---

## Features

| Feature | What it does |
| :--- | :--- |
| **AI generation** | Turn a prompt into a complete multi-file React + Tailwind project. |
| **AI chat edits** | Ask for changes in plain English. The AI looks up the relevant files before editing. |
| **Live preview** | See the site running in the browser as soon as code is generated or changed. |
| **Code editor** | Monaco editor with file explorer, tabs and Ctrl/Cmd + S to save. |
| **Mobile friendly** | A simple Chat / Code / Preview layout on phones. |
| **Runnable export** | Download a ZIP that runs with `npm install` and `npm run dev`. |
| **Light & dark themes** | Light by default, with a dark mode and subtle animations. |
| **Secure accounts** | Email sign-up with a 6-digit code, JWT login and password reset. |
| **Live progress** | Generation runs in a background queue and reports progress in real time. |

---

## How it works

1. You sign up and create a project with a prompt.
2. The request goes into a background queue (BullMQ + Redis).
3. Gemini generates the project files, which are saved to MongoDB.
4. The files are indexed in Qdrant so later chat edits can find the right code.
5. The browser receives updates over Socket.IO and shows the editor and preview.

---

## Tech stack

| Part | Built with |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router, TanStack Query |
| **Editor & preview** | Monaco Editor, Babel (iframe preview), Sandpack (full-screen preview) |
| **Backend** | Node.js, Express 5, Socket.IO |
| **Data** | MongoDB (Mongoose), Redis, Qdrant |
| **AI** | Google Gemini (`gemini-3.8-flash` by default), HuggingFace embeddings |
| **Email** | Brevo |

---

## Getting started

### What you need

- Node.js 20 or newer
- Docker (for Redis and Qdrant)
- A MongoDB database (local or MongoDB Atlas)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the project

```bash
git clone https://github.com/Suwalkya-ji/BuildPilot.git
cd BuildPilot
```

### 2. Start Redis and Qdrant

```bash
docker compose up -d redis qdrant
```

### 3. Start the backend

```bash
cd server
cp .env.example .env     # then fill in your keys (see below)
npm install
npm run dev
```

The backend runs at `http://localhost:8000` and also runs the generation worker.

### 4. Start the frontend

In a new terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Running an exported project

Click **Export ZIP** in the workspace, then:

```bash
unzip my-project.zip
cd my-project
npm install
npm run dev
```

---

## Running with Docker

To run everything (Redis, Qdrant and the app) in production mode:

```bash
docker compose up --build -d
```

Then open `http://localhost:8000`.

---

## Environment variables

### Backend — `server/.env`

| Variable | What it's for | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection | **required** |
| `JWT_SECRET` | Signs login tokens | **required** |
| `GEMINI_API_KEY` | Google Gemini access | **required** |
| `HF_API_KEY` | HuggingFace embeddings | **required** |
| `BREVO_API_KEY` | Sends verification emails | **required** for email codes |
| `GEMINI_MODEL` | Which Gemini model to use | `gemini-3.8-flash` |
| `JWT_EXPIRE` | How long a login lasts | `7d` |
| `PORT` | Backend port | `8000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `CLIENT_URL` | Frontend address(es) allowed to connect | `http://localhost:5173` |
| `REDIS_HOST` / `REDIS_PORT` | Redis connection | `127.0.0.1` / `6379` |
| `QDRANT_URL` | Qdrant connection | `http://localhost:6333` |
| `BREVO_SMTP_USER` | Brevo SMTP login | optional |
| `SENDER_EMAIL` / `SENDER_NAME` | "From" address on emails | `noreply@yourdomain.com` / `BuildPilot AI` |

### Frontend — `client/.env`

| Variable | What it's for | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend API address | `http://localhost:8000/api/v1` |
| `VITE_SOCKET_URL` | Backend live-updates address | `http://localhost:8000` |

---

## Project structure

```text
BuildPilot/
├── client/                 Frontend (React)
│   ├── public/             Static files (favicon)
│   └── src/
│       ├── api/            Calls to the backend
│       ├── components/     UI pieces (landing, auth, dashboard, workspace)
│       ├── context/        Login and theme state
│       ├── hooks/          Reusable hooks (live updates, auth)
│       ├── layouts/        Page layouts
│       ├── pages/          Screens
│       ├── utils/          Preview builder and ZIP export
│       └── index.css       Colors, fonts and animations
├── server/                 Backend (Express)
│   └── src/
│       ├── config/         Database, Redis, Qdrant and Socket.IO setup
│       ├── controllers/    Request handlers
│       ├── lib/            Gemini client
│       ├── middleware/     Auth, validation and errors
│       ├── models/         Database schemas
│       ├── routes/         API routes
│       ├── services/       AI, search, email and project logic
│       ├── sockets/        Live-update connections
│       └── workers/        Background generation worker
└── docker-compose.yml      Redis, Qdrant and app containers
```

---

## Notes

- The job queue dashboard is at `http://localhost:8000/admin/queues` in development only.
- Live-update connections require a login, and users can only see their own projects.
