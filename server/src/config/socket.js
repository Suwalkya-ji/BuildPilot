import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  const allowedOrigins = [
    "http://localhost:5173",
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : []),
  ].map((o) => o.trim()).filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO is not initialized.");
  }

  return io;
};