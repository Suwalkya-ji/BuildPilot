import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import {connectRedis} from "./config/redis.js";
import http from "http";
import { initSocket } from "./config/socket.js";
import { registerSocketHandlers } from "./sockets/socket.handler.js";
import { createCollection } from "./services/qdrant.service.js";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
const io = initSocket(server);
registerSocketHandlers(io);

const startServer = async () => {
  try {
    await connectDB();

    await connectRedis();

    await createCollection();

    app.listen(PORT, () => {
      console.log(`🚀 Server Running On Port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();