/**
 * Central configuration for the Priority Inbox service.
 */

export const NOTIFICATIONS_API_URL =
  process.env.NOTIFICATIONS_API_URL ??
  "http://4.224.186.213/evaluation-service/notifications";

/** Default number of top notifications to retain in the priority inbox. */
export const DEFAULT_INBOX_SIZE = Number(process.env.PRIORITY_INBOX_SIZE ?? 10);

/**
 * Type weights — higher value means higher importance.
 * Placement > Result > Event
 */
export const TYPE_WEIGHTS = {
  placement: 3,
  result: 2,
  event: 1,
};

/**
 * Multiplier applied to type weight so recency (timestamp ms) never
 * overrides type priority. One year ≈ 3.15e10 ms, well below 1e12.
 */
export const TYPE_WEIGHT_MULTIPLIER = 1e12;
