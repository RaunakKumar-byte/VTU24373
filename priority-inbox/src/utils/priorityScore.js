import {
  TYPE_WEIGHTS,
  TYPE_WEIGHT_MULTIPLIER,
} from "../config/constants.js";

/**
 * Parse API timestamp format: "YYYY-MM-DD HH:MM:SS"
 * @param {string} timestamp
 * @returns {number} epoch milliseconds
 */
export function parseTimestamp(timestamp) {
  if (!timestamp || typeof timestamp !== "string") {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }

  const isoLike = timestamp.trim().replace(" ", "T") + "Z";
  const ms = Date.parse(isoLike);

  if (Number.isNaN(ms)) {
    throw new Error(`Unable to parse timestamp: ${timestamp}`);
  }

  return ms;
}

/**
 * Resolve numeric weight for a notification type (case-insensitive).
 * @param {string} type
 * @returns {number}
 */
export function getTypeWeight(type) {
  const normalized = String(type ?? "").trim().toLowerCase();
  const weight = TYPE_WEIGHTS[normalized];

  if (weight === undefined) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  return weight;
}

/**
 * Compute a single comparable priority score.
 *
 * score = (typeWeight × TYPE_WEIGHT_MULTIPLIER) + timestampMs
 *
 * Type dominates recency: a Placement always outranks Result/Event regardless
 * of age, while newer notifications of the same type rank higher.
 *
 * @param {string} type
 * @param {string} timestamp
 * @returns {number}
 */
export function calculatePriorityScore(type, timestamp) {
  const weight = getTypeWeight(type);
  const timestampMs = parseTimestamp(timestamp);

  return weight * TYPE_WEIGHT_MULTIPLIER + timestampMs;
}

/**
 * Compare two scored notifications. Returns positive if `a` has higher priority.
 * @param {{ score: number }} a
 * @param {{ score: number }} b
 * @returns {number}
 */
export function comparePriority(a, b) {
  return a.score - b.score;
}
