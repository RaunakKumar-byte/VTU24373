const WEIGHTS = { placement: 3, result: 2, event: 1 };
const MULTIPLIER = 1e12;

export function parseTimestamp(ts) {
  const ms = Date.parse(ts.trim().replace(" ", "T") + "Z");
  if (Number.isNaN(ms)) throw new Error(`bad timestamp: ${ts}`);
  return ms;
}

export function getTypeWeight(type) {
  const w = WEIGHTS[String(type).trim().toLowerCase()];
  if (!w) throw new Error(`unknown type: ${type}`);
  return w;
}

export function calculateScore(type, timestamp) {
  return getTypeWeight(type) * MULTIPLIER + parseTimestamp(timestamp);
}

export function comparePriority(a, b) {
  return a.score - b.score;
}
