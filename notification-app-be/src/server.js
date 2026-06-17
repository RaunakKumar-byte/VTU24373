import express from "express";
import cors from "cors";
import { initLog } from "logging-middleware";
import { config } from "./config/env.js";
import { getAuthorizationHeader } from "./auth/tokenService.js";
import notificationRoutes from "./route/notificationRoutes.js";
import logRoutes from "./route/logRoutes.js";
import authRoutes from "./route/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

initLog({
  logsUrl: `${config.evaluationBase}/logs`,
  getAuthorization: getAuthorizationHeader,
});

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.use("/api/notifications", notificationRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`backend running on http://localhost:${config.port}`);
});
