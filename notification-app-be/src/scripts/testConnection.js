import "dotenv/config";
import { getAuthorizationHeader } from "../auth/tokenService.js";
import { fetchNotifications } from "../service/notificationService.js";

async function test() {
  await getAuthorizationHeader();
  console.log("auth ok");

  const data = await fetchNotifications({ page: 1, limit: 10 });
  console.log(`notifications: ${data.notifications.length} / ${data.total}`);
}

test().catch((err) => {
  console.error(err.response?.data?.message ?? err.message);
  process.exit(1);
});
