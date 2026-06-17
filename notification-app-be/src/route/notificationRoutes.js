import { Router } from "express";
import axios from "axios";
import { Log } from "logging-middleware";
import { config } from "../config/env.js";
import { getAuthorizationHeader } from "../auth/tokenService.js";
import { buildPriorityInbox } from "../domain/priorityInbox.js";
import { fetchAllNotifications, fetchNotifications } from "../service/notificationService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit = "10", page = "1", notification_type } = req.query;
    const data = await fetchNotifications({ limit, page, notification_type });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/priority", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? config.prioritySize);
    const { notification_type } = req.query;

    Log("backend", "info", "route", `priority inbox limit=${limit}`);

    const all = await fetchAllNotifications();
    const top = buildPriorityInbox(all, limit, notification_type);

    res.json({
      notifications: top.map((n) => ({
        ID: n.id,
        Type: n.type,
        Message: n.message,
        Timestamp: n.timestamp,
        priorityScore: n.score,
      })),
      count: top.length,
      limit,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
