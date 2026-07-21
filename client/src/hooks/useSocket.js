import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export const useSocket = (projectId, onStatusUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      if (projectId) {
        socketRef.current.emit("join-project", projectId);
      }
    });

    if (onStatusUpdate) {
      socketRef.current.on("generation-status", (data) => {
        onStatusUpdate(data);
      });
      socketRef.current.on("project-updated", (data) => {
        onStatusUpdate(data);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [projectId]);
};
