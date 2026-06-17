import { getTypeWeight } from "../utils/priorityScore.js";

/**
 * Print the priority inbox as a formatted ASCII table.
 *
 * @param {import("../types.js").ScoredNotification[]} notifications
 * @param {number} [limit=10]
 */
export function printPriorityTable(notifications, limit = 10) {
  const rows = notifications.slice(0, limit);

  if (rows.length === 0) {
    console.log("\nNo unread notifications in the priority inbox.\n");
    return;
  }

  const headers = ["Rank", "Type", "Weight", "Timestamp", "Message", "ID"];
  const data = rows.map((item, index) => [
    String(index + 1),
    item.type,
    String(getTypeWeight(item.type)),
    item.timestamp,
    truncate(item.message, 36),
    truncate(item.id, 12),
  ]);

  const widths = headers.map((header, colIndex) =>
    Math.max(header.length, ...data.map((row) => row[colIndex].length))
  );

  const divider = widths.map((w) => "-".repeat(w + 2)).join("+");
  const formatRow = (cells) =>
    cells
      .map((cell, i) => ` ${cell.padEnd(widths[i])} `)
      .join("|");

  console.log("\n=== Priority Inbox — Top Unread Notifications ===\n");
  console.log(formatRow(headers));
  console.log(divider);

  for (const row of data) {
    console.log(formatRow(row));
  }

  console.log(`\nShowing ${rows.length} of ${notifications.length} inbox items.\n`);
}

/** @param {string} value @param {number} max */
function truncate(value, max) {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 3)}...`;
}
