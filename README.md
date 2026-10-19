# BuildPilot AI

**Describe a website in plain English. Get a working React + Tailwind app you can edit, preview and download.**

BuildPilot uses Google Gemini to generate the code, then lets you refine it by chatting with the AI, editing in a built-in code editor, and watching a live preview update as you go. Chat edits use **RAG (Retrieval-Augmented Generation)** with a **Qdrant vector database**, so the AI works from the parts of your project that matter for each request.

---

## Features

| Feature | What it does |
| :--- | :--- |
| **AI generation** | Turn a prompt into a complete multi-file React + Tailwind project. |
| **AI chat edits** | Ask for changes in plain English. The AI edits your existing code instead of starting over. |
| **RAG with a vector database** | Every file is stored as an embedding in Qdrant. Each chat request finds the most relevant files and gives them to the AI as context. |
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

## RAG and the vector database

BuildPilot uses **RAG (Retrieval-Augmented Generation)** so chat edits are based on your actual code.

**Storing the code (indexing)**

- Each project file is turned into an *embedding* — a list of 384 numbers that captures what the code is about — using the HuggingFace model `all-MiniLM-L6-v2`.
- The embeddings are saved in **Qdrant** (collection `project_files`) along with the file path, its content and the project ID.
- The index is refreshed after the first generation, after every chat edit and after every manual save, and removed when a project is deleted.

**Using it in chat (retrieval)**

1. Your chat message is turned into an embedding the same way.
2. Qdrant finds the **5 most similar files** in *your* project (cosine similarity, filtered by project ID).
3. Those files are added to the prompt as "relevant project context", together with the chat history and the current files.
4. Gemini returns the updated files, which are saved and re-indexed.

If the vector search is unavailable, chat still works — the AI simply gets the current files without the extra context.

| File | Role |
| :--- | :--- |
| `server/src/services/embedding.service.js` | Creates embeddings with HuggingFace |
| `server/src/services/vector.service.js` | Saves, refreshes and deletes a project's embeddings |
| `server/src/services/rag.service.js` | Finds the most relevant files for a message |
| `server/src/services/qdrant.service.js` | Creates the Qdrant collection on startup |

---

## Tech stack

| Part | Built with |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router, TanStack Query |
| **Editor & preview** | Monaco Editor, Babel (iframe preview), Sandpack (full-screen preview) |
| **Backend** | Node.js, Express 5, Socket.IO |
| **Data** | MongoDB (Mongoose), Redis |
| **AI** | Google Gemini (`gemini-3.8-flash` by default) |
| **RAG / vector search** | Qdrant vector database, HuggingFace embeddings (`all-MiniLM-L6-v2`) |
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

## Deployment (Vercel + Render)

The frontend runs on **Vercel** and the backend on **Render**. The backend needs a server that stays running (live updates and the AI job queue), so it can't run on Vercel.

| Part | Where | Cost |
| :--- | :--- | :--- |
| Frontend (`client/`) | Vercel | Free |
| Backend API + worker (`server/`) | Render web service | Free (sleeps when idle) or Starter |
| Redis | Render Key Value | Free |
| MongoDB | MongoDB Atlas | Free tier |
| Vector database | Qdrant Cloud | Free tier |

### 1. Create the databases

1. **MongoDB Atlas** — create a free cluster and a database user. Under *Network Access*, allow `0.0.0.0/0` (Render's IP addresses change). Copy the connection string.
2. **Qdrant Cloud** — create a free cluster. Copy its **URL** and **API key**.

### 2. Deploy the backend on Render

1. In Render, choose **New → Blueprint** and select this repository. Render reads `render.yaml` and creates the API (`buildpilot-api`) and Redis (`buildpilot-redis`).
2. Fill in the values it asks for: `MONGODB_URI`, `GEMINI_API_KEY`, `HF_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `BREVO_API_KEY`, `BREVO_SMTP_USER`, `SENDER_EMAIL`. Leave `CLIENT_URL` empty for now.
3. When it's live, open `https://<your-api>.onrender.com/api/v1/health` — it should show `"status":"ok"`.

### 3. Deploy the frontend on Vercel

1. In Vercel, choose **Add New → Project** and import this repository.
2. Set **Root Directory** to `client` (Vercel detects Vite automatically).
3. Add these environment variables, using your Render URL:

   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://<your-api>.onrender.com/api/v1` |
   | `VITE_SOCKET_URL` | `https://<your-api>.onrender.com` |

4. Deploy and copy your Vercel URL (e.g. `https://buildpilot.vercel.app`).

### 4. Connect the two

In Render, set `CLIENT_URL` on `buildpilot-api` to your Vercel URL (no trailing slash) and save — Render redeploys. The site is now live at your Vercel URL.

**Good to know**

- On Render's free plan the backend sleeps after 15 minutes without traffic; the first request after that takes about a minute. Switch the service to **Starter** to keep it always on.
- If you change `VITE_*` variables in Vercel, redeploy the frontend — they're baked in at build time.
- For a custom domain, add it in Vercel and update `CLIENT_URL` on Render to match.

---

## Running with Docker

To run everything (Redis, Qdrant and the app) on one machine in production mode:

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
| `REDIS_URL` | Full Redis URL, used instead of host/port (Render) | `redis://red-xxxx:6379` |
| `QDRANT_URL` | Qdrant connection | `http://localhost:6333` |
| `QDRANT_API_KEY` | Qdrant Cloud API key | only for Qdrant Cloud |
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
│       ├── services/       AI, RAG / vector search, email and project logic
│       ├── sockets/        Live-update connections
│       └── workers/        Background generation worker
└── docker-compose.yml      Redis, Qdrant and app containers
```

---

## Notes

- The job queue dashboard is at `http://localhost:8000/admin/queues` in development only.
- Live-update connections require a login, and users can only see their own projects.
