# 🚀 BuildPilot AI — AI-Powered Website Builder & Code Generator

BuildPilot AI is a full-stack, state-of-the-art web application that leverages generative AI (Groq LLMs & HuggingFace embeddings) and vector retrieval (Qdrant) to turn natural language prompts into complete, interactive web applications with real-time streaming updates and live browser preview.

---

## ✨ Features

- **🤖 AI-Driven Site Generation**: Uses Groq AI to generate structured React components and HTML/CSS styling based on user prompts.
- **⚡ Live Interactive Preview**: Embedded CodeSandbox Sandpack engine for real-time live preview of generated code directly in the browser.
- **🎨 Premium Dual Theme & Responsive UI**: Custom "Rosewood & Slate" Light Mode Theme + Dark Mode toggle with responsive mobile viewport IDE layouts.
- **🔐 Secure Auth & Email OTP**: JWT Authentication with `bcrypt` password hashing, 6-digit OTP verification, and Email Password Reset via Brevo SMTP.
- **🔄 Async Queue Processing**: Heavy AI generation tasks are queued using **BullMQ** and **Redis** for resilient, non-blocking performance.
- **📡 Real-Time Socket.IO Updates**: Instant progress notifications streamed directly to the frontend during site generation steps.
- **🧠 Vector Search RAG**: Integrated **Qdrant Vector DB** and **HuggingFace Inference API** for context-aware code generation and component retrieval.
- **🐳 Docker Ready**: Full multi-container Docker setup (`docker-compose`) for one-command local testing and seamless cloud deployment.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Rosewood & Slate Design Tokens
- **Code Preview**: `@codesandbox/sandpack-react`
- **Code Editor**: `@monaco-editor/react`
- **Routing & State**: React Router v7, `@tanstack/react-query`
- **Icons & UI**: Lucide React, Sonner (Toasts)

### Backend (`server/`)
- **Runtime**: Node.js ES Modules
- **Framework**: Express v5
- **Database**: MongoDB (via Mongoose)
- **Queue System**: BullMQ + Redis (`ioredis`)
- **Vector Database**: Qdrant Vector DB
- **Email Service**: Brevo API & SMTP (`nodemailer`)
- **AI Integrations**: Groq SDK (`llama-3.3-70b-versatile`), HuggingFace Inference (`all-MiniLM-L6-v2`)
- **Real-Time Engine**: Socket.IO

---

## 📂 Project Structure

```text
BuildPilot/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── api/                # Axios API Client configuration
│   │   ├── components/         # UI Components (Landing, Builder, Auth, Editor)
│   │   ├── context/            # Auth & Theme Context Providers
│   │   ├── hooks/              # Custom React Hooks (useSocket, useAuth, useTheme)
│   │   └── pages/              # App Pages (Home, Dashboard, Generator)
│   ├── .env.example            # Client environment variable template
│   └── vite.config.js          # Vite build configuration
├── server/                     # Express Backend API & Worker
│   ├── src/
│   │   ├── config/             # DB, Redis, Qdrant, Socket.IO configurations
│   │   ├── controllers/        # Express route handlers (auth, project, ai)
│   │   ├── middleware/         # Auth & Error handling middlewares
│   │   ├── models/             # Mongoose schemas (User, Project, Otp, PasswordReset)
│   │   ├── routes/             # API routes (/api/v1/auth, /projects, /ai)
│   │   ├── services/           # AI, Embedding, Email, Qdrant & Generation services
│   │   └── workers/            # BullMQ background workers
│   ├── worker.js               # Standalone worker process entry point
│   ├── Dockerfile              # Multi-stage production container recipe
│   └── .env.example            # Server environment variable template
├── docker-compose.yml          # Full-stack multi-container Docker compose
└── README.md                   # Project Documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v20 or higher)
- Docker & Docker Compose (for local Redis & Qdrant)
- MongoDB instance (Atlas URI or local)

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
# Open .env and add your MONGODB_URI, GROQ_API_KEY, HF_API_KEY, and BREVO_API_KEY

npm install
npm run dev
```

### 4. Setup Client Environment & Start Frontend
```bash
# In a new terminal window
cd client
cp .env.example .env

npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:8000`.

---

## 🐳 Running with Docker (Production Mode)

You can run the entire stack (Redis, Qdrant, Express Server, and Worker) in Docker with a single command:

```bash
# Ensure server/.env has your production environment variables set
docker compose up --build -d
```

Access the unified application at `http://localhost:8000`.

---

## 🔑 Environment Variables Reference

### Backend (`server/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Server HTTP listening port | `8000` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for signing JWT tokens | Required |
| `GROQ_API_KEY` | Groq AI API Key | Required |
| `HF_API_KEY` | HuggingFace API Token | Required |
| `BREVO_API_KEY` | Brevo Email & SMTP API Key | Required for Email OTP |
| `BREVO_SMTP_USER` | Brevo SMTP Account Email | Optional |
| `SENDER_EMAIL` | Sender Email Address for OTPs | `noreply@buildpilot.ai` |
| `SENDER_NAME` | Sender Display Name | `"BuildPilot AI"` |
| `REDIS_HOST` | Redis host | `127.0.0.1` |
| `REDIS_PORT` | Redis port | `6379` |
| `QDRANT_URL` | Qdrant Vector DB URL | `http://localhost:6333` |

### Frontend (`client/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Express API endpoint | `http://localhost:8000/api/v1` |
| `VITE_SOCKET_URL` | Express Socket.IO endpoint | `http://localhost:8000` |

---