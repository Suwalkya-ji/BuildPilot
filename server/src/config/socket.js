import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
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