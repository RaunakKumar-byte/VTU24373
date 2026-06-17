import axios from "axios";
import { Log } from "logging-middleware";
import { config } from "../config/env.js";
import { getAuthorizationHeader } from "../auth/tokenService.js";

let cachedList = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

async function fetchRawNotifications() {
  if (cachedList && Date.now() - cacheTime < CACHE_TTL) {
    return cachedList;
  }

  const auth = await getAuthorizationHeader();
  const url = `${config.evaluationBase}/notifications`;

  const { data } = await axios.get(url, {
    headers: { Accept: "application/json", Authorization: auth },
    timeout: 20000,
  });

  cachedList = data.notifications ?? [];
  cacheTime = Date.now();
  Log("backend", "info", "service", `fetched ${cachedList.length} notifications`);
  return cachedList;
}

function filterByType(list, notification_type) {
  if (!notification_type || notification_type === "All") return list;
  const target = String(notification_type).toLowerCase();
  return list.filter((n) => String(n.Type ?? n.type).toLowerCase() === target);
}

export async function fetchNotifications(params = {}) {
  try {
    const all = await fetchRawNotifications();
    const filtered = filterByType(all, params.notification_type);
    const limit = Math.max(1, Number(params.limit ?? 20));
    const page = Math.max(1, Number(params.page ?? 1));
    const start = (page - 1) * limit;
    const slice = filtered.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

    return {
      notifications: slice,
      total: filtered.length,
      totalPages,
      page,
      limit,
    };
  } catch (err) {
    Log("backend", "error", "service", err.response?.data?.message ?? err.message);
    throw err;
  }
}

export async function fetchAllNotifications() {
  return fetchRawNotifications();
}

export function clearNotificationCache() {
  cachedList = null;
  cacheTime = 0;
}
