import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();

/*
===========================
Middlewares
===========================
*/

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

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

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 BuildPilot Backend Running",
  });
});

export default app;