import { DEFAULT_INBOX_SIZE } from "../config/constants.js";
import { MinHeap } from "../datastructures/MinHeap.js";
import {
  filterUnread,
  normalizeNotification,
} from "../utils/normalizeNotification.js";

/**
 * Priority Inbox — maintains the top-N highest-priority unread notifications
 * using a fixed-size Min Heap without sorting the entire dataset.
 */
export class PriorityInbox {
  /**
   * @param {number} [capacity=DEFAULT_INBOX_SIZE]
   */
  constructor(capacity = DEFAULT_INBOX_SIZE) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Priority inbox capacity must be a positive integer");
    }

    this.capacity = capacity;
    /** @type {MinHeap} stores ScoredNotification objects */
    this.heap = new MinHeap();
    /** Track IDs to avoid duplicate inserts when streaming updates */
    this.seenIds = new Set();
  }

  /**
   * Attempt to add a single unread notification to the inbox.
   * O(log k) per insertion where k = capacity.
   *
   * @param {import("../types.js").ScoredNotification} notification
   * @returns {boolean} true if the notification was accepted into the inbox
   */
  add(notification) {
    if (notification.isRead) {
      return false;
    }

    if (this.seenIds.has(notification.id)) {
      return false;
    }

    if (this.heap.size() < this.capacity) {
      this.heap.push(notification);
      this.seenIds.add(notification.id);
      return true;
    }

    const weakest = this.heap.peekMin();

    // Replace root only when the newcomer outranks the current minimum.
    if (notification.score > weakest.score) {
      const evicted = this.heap.popMin();
      if (evicted) {
        this.seenIds.delete(evicted.id);
      }

      this.heap.push(notification);
      this.seenIds.add(notification.id);
      return true;
    }

    return false;
  }

  /**
   * Process a batch of raw API notifications.
   *
   * @param {object[]} rawNotifications
   * @returns {number} count of notifications accepted into the inbox
   */
  ingestBatch(rawNotifications) {
    const unread = filterUnread(normalizeNotifications(rawNotifications));
    let accepted = 0;

    for (const notification of unread) {
      if (this.add(notification)) {
        accepted += 1;
      }
    }

    return accepted;
  }

  /**
   * Handle a single incoming notification (real-time path).
   *
   * @param {object} rawNotification
   * @returns {boolean}
   */
  onNotificationArrived(rawNotification) {
    const notification = normalizeNotification(rawNotification);
    return this.add(notification);
  }

  /**
   * Return top notifications sorted by priority (highest first).
   *
   * @returns {import("../types.js").ScoredNotification[]}
   */
  getTopNotifications() {
    return this.heap.toSortedArrayDesc();
  }

  /** @returns {number} */
  getCount() {
    return this.heap.size();
  }
}
