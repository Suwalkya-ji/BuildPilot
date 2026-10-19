import dotenv from "dotenv";
dotenv.config();
import IORedis from "ioredis";


// REDIS_URL (e.g. Render Key Value) takes priority over REDIS_HOST/REDIS_PORT
const bullmqConnection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : new IORedis({
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