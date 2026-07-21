export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.info(`[Socket] Client connected: ${socket.id}`);

    socket.on("join-project", (projectId) => {
      if (projectId) {
        socket.join(`project:${projectId}`);
        console.info(`[Socket] ${socket.id} joined room: project:${projectId}`);
      }
    });

    socket.on("disconnect", () => {
      console.info(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};