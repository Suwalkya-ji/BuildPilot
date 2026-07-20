import dotenv from "dotenv";
dotenv.config();
import IORedis from "ioredis";


const bullmqConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

bullmqConnection.on("connect", () => {
  console.log("🟢 BullMQ Redis Connected");
});

bullmqConnection.on("error", (error) => {
  console.error("🔴 BullMQ Redis Error:", error.message);
});

export default bullmqConnection;