import { createClient } from "redis";

// REDIS_URL (e.g. Render Key Value) takes priority over REDIS_HOST/REDIS_PORT
const redisClient = createClient(
  process.env.REDIS_URL
    ? { url: process.env.REDIS_URL }
    : {
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      }
);

redisClient.on("connect", () => {
  console.log("🟢 Redis Connected");
});

redisClient.on("ready", () => {
  console.log("🚀 Redis Ready");
});

redisClient.on("error", (error) => {
  console.error("🔴 Redis Error:", error.message);
});

redisClient.on("end", () => {
  console.log("⚪ Redis Disconnected");
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;