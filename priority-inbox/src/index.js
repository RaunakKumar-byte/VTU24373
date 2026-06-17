import "dotenv/config";

import { DEFAULT_INBOX_SIZE } from "./config/constants.js";
import { printPriorityTable } from "./display/tablePrinter.js";
import { PriorityInbox } from "./inbox/PriorityInbox.js";
import { fetchNotificationsFromApi } from "./services/notificationApi.js";

/**
 * Stage 6 entry point:
 * 1. Fetch notifications from the evaluation API
 * 2. Filter unread items
 * 3. Maintain top-N via Min Heap
 * 4. Print sorted priority table
 */
async function main() {
  const inboxSize = DEFAULT_INBOX_SIZE;
  const inbox = new PriorityInbox(inboxSize);

  console.log("Fetching notifications from evaluation API...\n");
  console.log("(Authenticating via auth API if credentials are in .env)\n");

  const rawNotifications = await fetchNotificationsFromApi();
  console.log(`Received ${rawNotifications.length} notifications from API.`);

  const unreadCount = rawNotifications.filter((item) => {
    const isRead = item.IsRead ?? item.isRead ?? item.is_read;
    return isRead !== true && isRead !== "true" && isRead !== 1;
  }).length;

  console.log(`Unread notifications: ${unreadCount}`);

  const accepted = inbox.ingestBatch(rawNotifications);
  console.log(`Accepted into priority inbox (capacity ${inboxSize}): ${accepted}`);

  const topNotifications = inbox.getTopNotifications();
  printPriorityTable(topNotifications, inboxSize);

  return topNotifications;
}

main().catch((error) => {
  console.error("\n[ERROR]", error.message);
  process.exitCode = 1;
});
