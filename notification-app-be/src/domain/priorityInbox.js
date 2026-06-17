import { MinHeap } from "./minHeap.js";
import { calculateScore } from "./priorityScore.js";

function normalize(raw) {
  const id = raw.ID ?? raw.id;
  const type = raw.Type ?? raw.type;
  const message = raw.Message ?? raw.message;
  const timestamp = raw.Timestamp ?? raw.timestamp;
  const readVal = raw.IsRead ?? raw.isRead ?? raw.is_read;

  let isRead = false;
  if (readVal === true || readVal === "true" || readVal === 1) isRead = true;

  return {
    id,
    type,
    message,
    timestamp,
    isRead,
    score: calculateScore(type, timestamp),
  };
}

export class PriorityInbox {
  constructor(capacity = 10) {
    this.capacity = capacity;
    this.heap = new MinHeap();
    this.seen = new Set();
  }

  add(raw) {
    const n = normalize(raw);
    if (n.isRead || this.seen.has(n.id)) return false;

    if (this.heap.size() < this.capacity) {
      this.heap.push(n);
      this.seen.add(n.id);
      return true;
    }

    const weakest = this.heap.peekMin();
    if (n.score <= weakest.score) return false;

    const evicted = this.heap.popMin();
    if (evicted) this.seen.delete(evicted.id);
    this.heap.push(n);
    this.seen.add(n.id);
    return true;
  }

  buildFrom(list) {
    for (const item of list) this.add(item);
    return this.heap.toSortedArrayDesc();
  }

  getTop() {
    return this.heap.toSortedArrayDesc();
  }
}

export function buildPriorityInbox(notifications, limit = 10, typeFilter) {
  const inbox = new PriorityInbox(limit);
  let items = notifications;

  if (typeFilter && typeFilter !== "All") {
    const target = typeFilter.toLowerCase();
    items = notifications.filter(
      (n) => String(n.Type ?? n.type).toLowerCase() === target
    );
  }

  return inbox.buildFrom(items.filter((n) => {
    const readVal = n.IsRead ?? n.isRead;
    return readVal !== true && readVal !== "true";
  }));
}
