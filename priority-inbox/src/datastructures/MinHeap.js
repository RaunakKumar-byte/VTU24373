import { comparePriority } from "../utils/priorityScore.js";

/**
 * Min Heap (priority queue) — root holds the LOWEST priority item.
 *
 * Used to maintain the top-K highest-priority notifications:
 * - When full, the root is the weakest among the current top K.
 * - A new item replaces the root only if it has strictly higher priority.
 *
 * Insert / extract-min: O(log n) where n = capacity (10).
 */
export class MinHeap {
  /**
   * @param {(a: object, b: object) => number} compareFn
   *   Returns negative if `a` is lower priority than `b`.
   */
  constructor(compareFn = (a, b) => comparePriority(a, b)) {
    this.items = [];
    this.compareFn = compareFn;
  }

  /** @returns {number} */
  size() {
    return this.items.length;
  }

  /** @returns {boolean} */
  isEmpty() {
    return this.items.length === 0;
  }

  /** @returns {object|undefined} lowest-priority item (heap root) */
  peekMin() {
    return this.items[0];
  }

  /**
   * Insert an item and restore heap property.
   * @param {object} item
   */
  push(item) {
    this.items.push(item);
    this.#bubbleUp(this.items.length - 1);
  }

  /**
   * Remove and return the lowest-priority item.
   * @returns {object|undefined}
   */
  popMin() {
    if (this.isEmpty()) {
      return undefined;
    }

    const min = this.items[0];
    const last = this.items.pop();

    if (!this.isEmpty() && last !== undefined) {
      this.items[0] = last;
      this.#bubbleDown(0);
    }

    return min;
  }

  /**
   * Return all items sorted by priority (highest first).
   * Does not mutate the heap.
   *
   * @returns {object[]}
   */
  toSortedArrayDesc() {
    return [...this.items].sort((a, b) => -this.compareFn(a, b));
  }

  /** @param {number} index */
  #bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.compareFn(this.items[index], this.items[parentIndex]) >= 0) {
        break;
      }

      this.#swap(index, parentIndex);
      index = parentIndex;
    }
  }

  /** @param {number} index */
  #bubbleDown(index) {
    const length = this.items.length;

    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let smallest = index;

      if (
        left < length &&
        this.compareFn(this.items[left], this.items[smallest]) < 0
      ) {
        smallest = left;
      }

      if (
        right < length &&
        this.compareFn(this.items[right], this.items[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest === index) {
        break;
      }

      this.#swap(index, smallest);
      index = smallest;
    }
  }

  /** @param {number} i @param {number} j */
  #swap(i, j) {
    [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
  }
}
