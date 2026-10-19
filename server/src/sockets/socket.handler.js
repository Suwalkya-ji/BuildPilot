import jwt from "jsonwebtoken";
import Project from "../models/project.model.js";

export const registerSocketHandlers = (io) => {
  // Only logged-in users can connect (token sent from client in auth.token)
  io.use((socket, next) => {
    try {
      const decoded = jwt.verify(
        socket.handshake.auth?.token,
        process.env.JWT_SECRET
      );
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.info(`[Socket] Client connected: ${socket.id}`);

    socket.on("join-project", async (projectId) => {
      if (!projectId) return;

      try {
        // Users may only join rooms of their own projects
        const isOwner = await Project.exists({
          _id: projectId,
          owner: socket.userId,
        });

        if (isOwner) {
          socket.join(`project:${projectId}`);
          console.info(`[Socket] ${socket.id} joined room: project:${projectId}`);
        }
      } catch (error) {
        console.warn("[Socket] join-project failed:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.info(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};
