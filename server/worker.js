import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import { connectRedis } from "./src/config/redis.js";

const startWorker = async () => {
  try {
    await connectDB();
    await connectRedis();

    await import("./src/workers/generation.worker.js");
    console.log("🚀 Generation Worker Started...");
  } catch (error) {
    console.error("❌ Worker failed to start:", error);
  }
};

startWorker();