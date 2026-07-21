import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/error.middleware.js";

import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import bullBoard from "./dashboard/bullBoard.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// Resolve __dirname for ES Modules (not available by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
===========================
Middlewares
===========================
*/

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, curl, server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

// Use "combined" Apache-style logs in production, "dev" colorized logs in development
app.use(morgan(isProduction ? "combined" : "dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});

app.use(limiter);

/*
===========================
Health Check
===========================
*/

// Dev-only health check (in prod, the React app serves the root)
if (!isProduction) {
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "🚀 BuildPilot Backend Running",
    });
  });
}

/*
===========================
Routes
===========================
*/

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use("/admin/queues", bullBoard.getRouter());

/*
===========================
Error Handler
===========================
*/

app.use(errorHandler);

/*
===========================
Production: Serve React Build
===========================
*/

if (isProduction) {
  // Point to the Vite build output folder
  const clientBuildPath = path.join(__dirname, "../../client/dist");

  // Serve static assets (JS, CSS, images) from the dist folder
  app.use(express.static(clientBuildPath));

  // Catch-all: for any route not matched by the API, serve index.html
  // This is required so React Router works when the user refreshes a page
  // e.g. refreshing /dashboard doesn't return a 404 from Express
  app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
   });
}

export default app;