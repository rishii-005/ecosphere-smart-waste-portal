import { useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import type { PickupRequest } from "../types";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export function useSocket(onRequestUpdate?: (request: PickupRequest) => void) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket.emit("join:user", user.id);
    if (user.role === "admin") socket.emit("join:admin");

    socket.on("request:created", (request: PickupRequest) => {
      onRequestUpdate?.(request);
      toast.success("New pickup request received.");
    });

    socket.on("request:updated", (request: PickupRequest) => {
      onRequestUpdate?.(request);
      toast.success(`Request moved to ${request.status}.`);
    });

    socket.on("notification:new", (notification: { message: string }) => {
      toast(notification.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [onRequestUpdate, user]);
}
