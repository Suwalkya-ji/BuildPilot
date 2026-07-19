import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

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