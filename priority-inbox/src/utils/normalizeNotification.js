import { calculatePriorityScore } from "./priorityScore.js";

/**
 * Normalize raw API notification objects (PascalCase fields) into a
 * consistent internal shape and attach a computed priority score.
 *
 * API shape:
 * { ID, Type, Message, Timestamp, IsRead? }
 *
 * @param {object} raw
 * @returns {import("../types.js").ScoredNotification}
 */
export function normalizeNotification(raw) {
  const id = raw.ID ?? raw.id;
  const type = raw.Type ?? raw.type;
  const message = raw.Message ?? raw.message;
  const timestamp = raw.Timestamp ?? raw.timestamp;
  const isRead = resolveReadStatus(raw);

  if (!id || !type || !message || !timestamp) {
    throw new Error(
      `Notification missing required fields: ${JSON.stringify(raw)}`
    );
  }

  const score = calculatePriorityScore(type, timestamp);

  return {
    id,
    type,
    message,
    timestamp,
    isRead,
    score,
  };
}

/**
 * Determine read status from API payload.
 * Treat missing IsRead as unread (API may only return unread items).
 *
 * @param {object} raw
 * @returns {boolean}
 */
function resolveReadStatus(raw) {
  const value = raw.IsRead ?? raw.isRead ?? raw.is_read;

  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }

  return Boolean(value);
}

/**
 * @param {object[]} notifications
 * @returns {import("../types.js").ScoredNotification[]}
 */
export function normalizeNotifications(notifications) {
  return notifications.map(normalizeNotification);
}

/**
 * Keep only unread notifications.
 *
 * @param {import("../types.js").ScoredNotification[]} notifications
 * @returns {import("../types.js").ScoredNotification[]}
 */
export function filterUnread(notifications) {
  return notifications.filter((notification) => !notification.isRead);
}
