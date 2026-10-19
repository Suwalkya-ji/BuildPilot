# 🚀 BuildPilot AI — AI-Powered Website Builder & Code Generator

BuildPilot AI is a full-stack web application that uses generative AI (Google Gemini & HuggingFace embeddings) and vector retrieval (Qdrant) to turn plain-English prompts into complete, interactive React + Tailwind web applications — with real-time progress updates, an in-browser code editor, live preview and one-click export of a runnable project.

---

## ✨ Features

- **🤖 AI-Driven Site Generation**: Google Gemini generates a complete multi-file React + Tailwind CSS project from a prompt.
- **💬 Context-Aware AI Chat**: Ask for changes in plain English. Relevant files are retrieved from Qdrant (RAG) before the AI edits them. Your message appears instantly and a live status ("Updating 5 files", "Generating your project") shows while the AI works.
- **⚡ Live Interactive Preview**: Instant in-browser preview of generated code in the workspace (iframe + Babel), plus a full-screen Sandpack preview page.
- **🧑‍💻 In-Browser IDE**: Monaco code editor with file explorer, tabs, resizable panels and Ctrl/Cmd+S save. On mobile, a focused Chat | Code | Preview layout.
- **📦 Runnable Code Export**: Download your project as a ZIP that runs straight away with `npm install && npm run dev` (Vite + Tailwind, `index.html`, scripts and all imported packages included).
- **🎨 Light & Dark Themes with Motion**: Light mode by default (Sage Green · Walnut Brown · Amber Glow) and a dark mode (Jet Black · Royal Amethyst · Electric Cyan), with subtle animations that respect the system's reduced-motion setting.
- **🔐 Secure Auth & Email OTP**: JWT authentication with `bcrypt` password hashing, 6-digit email OTP verification and password reset via Brevo.
- **🔄 Async Queue Processing**: AI generation jobs run through **BullMQ** + **Redis** with retries and backoff.
- **📡 Real-Time Socket.IO Updates**: Generation progress is pushed to the browser. Sockets require a valid login, and users can only join their own project rooms.
- **🐳 Docker Ready**: `docker-compose` setup for Redis, Qdrant and the app for one-command local testing and deployment.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 with CSS-variable design tokens (light/dark)
- **Fonts**: Instrument Serif (headings), Inter (UI), JetBrains Mono (code)
- **Code Editor**: `@monaco-editor/react` (custom light/dark themes)
- **Code Preview**: iframe + Babel standalone, `@codesandbox/sandpack-react` (full-screen)
- **Routing & State**: React Router v7, `@tanstack/react-query`
- **Icons & UI**: Lucide React, Sonner (toasts), JSZip (export)

### Backend (`server/`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express v5 (+ Helmet, rate limiting on auth and AI routes)
- **Database**: MongoDB (via Mongoose)
- **Queue System**: BullMQ + Redis (`ioredis`)
- **Vector Database**: Qdrant
- **Email Service**: Brevo API & SMTP (`nodemailer`)
- **AI Integrations**: Google Gen AI SDK (Gemini, default `gemini-3.8-flash`), HuggingFace Inference (`all-MiniLM-L6-v2` embeddings)
- **Real-Time Engine**: Socket.IO

---

## 📂 Project Structure

```text
BuildPilot/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets (favicon)
│   ├── src/
│   │   ├── api/                # Axios API client & endpoint helpers
│   │   ├── components/         # UI components (landing, auth, dashboard, workspace, common)
│   │   ├── context/            # Auth & Theme context providers
│   │   ├── hooks/              # Custom hooks (useSocket, useAuth)
│   │   ├── layouts/            # Auth, Dashboard & Workspace layouts
│   │   ├── pages/              # Landing, Login, Signup, Dashboard, Workspace, Preview, 404
│   │   ├── utils/              # Preview builder & runnable project export
│   │   └── index.css           # Design tokens, component classes & animations
│   ├── .env.example            # Client environment variable template
│   └── vite.config.js          # Vite build configuration
├── server/                     # Express Backend API
│   ├── src/
│   │   ├── config/             # DB, Redis, BullMQ, Qdrant, Socket.IO configuration
│   │   ├── controllers/        # Express route handlers (auth, project, ai)
│   │   ├── lib/                # Gemini client helper
│   │   ├── middleware/         # Auth, validation & error handling
│   │   ├── models/             # Mongoose schemas (User, Project, Otp, PasswordReset)
│   │   ├── routes/             # API routes (/api/v1/auth, /projects, /ai)
│   │   ├── services/           # AI, embedding, vector (RAG), email & project services
│   │   ├── sockets/            # Socket.IO auth & project rooms
│   │   └── workers/            # BullMQ generation worker (runs inside the server process)
│   ├── Dockerfile              # Multi-stage production image (builds the client too)
│   └── .env.example            # Server environment variable template
├── docker-compose.yml          # Redis, Qdrant & app containers
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v20 or higher)
- Docker & Docker Compose (for local Redis & Qdrant)
- MongoDB instance (Atlas URI or local)
- A Google Gemini API key — get one at <https://aistudio.google.com/apikey>

### 1. Clone Repository
```bash
git clone https://github.com/Suwalkya-ji/BuildPilot.git
cd BuildPilot
```

### 2. Start Redis & Qdrant via Docker
```bash
docker compose up -d redis qdrant
```

### 3. Setup Server Environment & Start Backend
```bash
cd server
cp .env.example .env
# Open .env and add your MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, HF_API_KEY and BREVO_API_KEY

npm install
npm run dev
```

The server also runs the BullMQ generation worker — no separate worker process is needed.

### 4. Setup Client Environment & Start Frontend
```bash
# In a new terminal window
cd client
cp .env.example .env

npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:8000`.

In development, the BullMQ queue dashboard is available at `http://localhost:8000/admin/queues` (it is disabled in production because it has no login).

---

## 📦 Running an Exported Project

Click **Export ZIP** in the workspace to download your project. The ZIP is a complete Vite + React + Tailwind project:

```bash
unzip my-project.zip
cd my-project
npm install
npm run dev        # start the dev server (usually http://localhost:5173)
npm run build      # production build in dist/
```

---

## 🐳 Running with Docker (Production Mode)

You can run the entire stack (Redis, Qdrant and the Express server with its worker, serving the built React app) with a single command:

```bash
# Ensure server/.env has your production environment variables set
docker compose up --build -d
```

Access the application at `http://localhost:8000`.

---

## 🔑 Environment Variables Reference

### Backend (`server/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Server HTTP listening port | `8000` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for signing JWT tokens | Required |
| `JWT_EXPIRE` | JWT lifetime | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `GEMINI_MODEL` | Gemini model used for generation | `gemini-3.8-flash` |
| `HF_API_KEY` | HuggingFace API token (embeddings) | Required |
| `BREVO_API_KEY` | Brevo email & SMTP API key | Required for email OTP |
| `BREVO_SMTP_USER` | Brevo SMTP account email | Optional |
| `SENDER_EMAIL` | Sender email address for OTPs | `noreply@buildpilot.ai` |
| `SENDER_NAME` | Sender display name | `"BuildPilot AI"` |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `QDRANT_URL` | Qdrant vector DB URL | `http://localhost:6333` |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS & sockets (comma-separated) | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Express API endpoint | `http://localhost:8000/api/v1` |
| `VITE_SOCKET_URL` | Express Socket.IO endpoint | `http://localhost:8000` |

---
