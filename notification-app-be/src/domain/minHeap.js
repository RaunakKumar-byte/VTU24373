import { comparePriority } from "./priorityScore.js";

export class MinHeap {
  constructor(compareFn = comparePriority) {
    this.items = [];
    this.compareFn = compareFn;
  }

  size() {
    return this.items.length;
  }

  peekMin() {
    return this.items[0];
  }

  push(item) {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  popMin() {
    if (!this.items.length) return undefined;
    const min = this.items[0];
    const last = this.items.pop();
    if (this.items.length && last !== undefined) {
      this.items[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  toSortedArrayDesc() {
    return [...this.items].sort((a, b) => -this.compareFn(a, b));
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compareFn(this.items[index], this.items[parent]) >= 0) break;
      [this.items[index], this.items[parent]] = [this.items[parent], this.items[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const len = this.items.length;
    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let smallest = index;
      if (left < len && this.compareFn(this.items[left], this.items[smallest]) < 0) smallest = left;
      if (right < len && this.compareFn(this.items[right], this.items[smallest]) < 0) smallest = right;
      if (smallest === index) break;
      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      index = smallest;
    }
  }
}
