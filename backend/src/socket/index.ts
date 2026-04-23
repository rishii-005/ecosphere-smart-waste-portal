import type { Server } from "socket.io";
import type { NotificationItem, PickupRequest } from "../types.js";

let ioInstance: Server | null = null;

export function registerSocket(io: Server) {
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("join:user", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on("join:admin", () => {
      socket.join("admin");
    });
  });
}

export function emitRequestCreated(request: PickupRequest) {
  ioInstance?.to("admin").emit("request:created", request);
  ioInstance?.to(`user:${request.userId}`).emit("request:created", request);
}

export function emitRequestUpdated(request: PickupRequest) {
  ioInstance?.to("admin").emit("request:updated", request);
  ioInstance?.to(`user:${request.userId}`).emit("request:updated", request);
}

export function emitNotification(notification: NotificationItem) {
  ioInstance?.to(`user:${notification.userId}`).emit("notification:new", notification);
}
