import http from "node:http";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { Server } from "socket.io";
import { config } from "./config.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import locationRoutes from "./routes/location.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import requestRoutes from "./routes/request.routes.js";
import { registerSocket } from "./socket/index.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: config.clientUrls, credentials: true }
});

registerSocket(io);

app.use(
  cors({
    origin(origin, callback) {
      const isLocalDevOrigin = !origin || /^http:\/\/(localhost|127\.0\.0\.1):51\d{2}$/.test(origin);
      if (config.clientUrls.includes(origin || "") || (config.nodeEnv !== "production" && isLocalDevOrigin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "6mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "smart-waste-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(notFound);
app.use(errorHandler);

server.listen(config.port, () => {
  console.log(`Smart Waste backend running on http://localhost:${config.port}`);
});
