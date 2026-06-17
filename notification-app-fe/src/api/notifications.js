import axios from "axios";
import { logError, logInfo } from "../utils/logger.js";

const client = axios.create({ baseURL: "/api", timeout: 20000 });

function extractError(err) {
  const data = err.response?.data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors)) {
    return data.errors
      .map((item) => {
        const [field, msg] = Object.entries(item)[0] ?? [];
        return `${field}: ${msg}`;
      })
      .join(", ");
  }
  return err.message;
}

export async function fetchNotifications({ page = 1, limit = 10, notification_type } = {}) {
  try {
    const params = { page, limit };
    if (notification_type && notification_type !== "All") {
      params.notification_type = notification_type;
    }

    const { data } = await client.get("/notifications", { params });
    logInfo("api", `loaded page ${page}`);
    return data;
  } catch (err) {
    const msg = extractError(err);
    logError("api", msg);
    throw new Error(msg);
  }
}

export async function fetchPriorityNotifications({ limit = 10, notification_type } = {}) {
  try {
    const params = { limit };
    if (notification_type && notification_type !== "All") {
      params.notification_type = notification_type;
    }

    const { data } = await client.get("/notifications/priority", { params });
    logInfo("api", `loaded priority inbox`);
    return data;
  } catch (err) {
    const msg = extractError(err);
    logError("api", msg);
    throw new Error(msg);
  }
}
