/**
 * Demonstrates maintaining the top-10 inbox as notifications arrive one-by-one
 * (simulates a real-time stream without polling the full list each time).
 *
 * Uses the same sample shape returned by the evaluation API.
 * Run: npm run demo:stream
 */

import { DEFAULT_INBOX_SIZE } from "../config/constants.js";
import { printPriorityTable } from "../display/tablePrinter.js";
import { PriorityInbox } from "../inbox/PriorityInbox.js";

const SAMPLE_STREAM = [
  {
    ID: "81589ada-0000-4000-8000-000000000001",
    Type: "Event",
    Message: "farewell",
    Timestamp: "2024-04-22 17:51:06",
    IsRead: false,
  },
  {
    ID: "8035513a-0000-4000-8000-000000000002",
    Type: "Result",
    Message: "mid-sem",
    Timestamp: "2024-04-22 17:50:54",
    IsRead: false,
  },
  {
    ID: "b283218f-0000-4000-8000-000000000003",
    Type: "Placement",
    Message: "CSX Corporation hiring",
    Timestamp: "2024-04-22 17:51:18",
    IsRead: false,
  },
  {
    ID: "d146095a-0000-4000-8000-000000000004",
    Type: "Result",
    Message: "mid sem",
    Timestamp: "2024-04-22 17:51:30",
    IsRead: false,
  },
  {
    ID: "8a7412bd-0000-4000-8000-000000000005",
    Type: "Placement",
    Message: "Advanced Micro Devices Inc. hiring",
    Timestamp: "2024-04-22 17:49:42",
    IsRead: false,
  },
  {
    ID: "1cfcc5ee-0000-4000-8000-000000000006",
    Type: "Event",
    Message: "tech-fest",
    Timestamp: "2024-04-22 17:50:06",
    IsRead: true,
  },
  {
    ID: "e5c4ff20-0000-4000-8000-000000000007",
    Type: "Result",
    Message: "project-review",
    Timestamp: "2024-04-22 17:50:18",
    IsRead: false,
  },
];

function runStreamSimulation() {
  const inbox = new PriorityInbox(DEFAULT_INBOX_SIZE);

  console.log("=== Stream Simulation — O(log 10) per arrival ===\n");

  for (const raw of SAMPLE_STREAM) {
    const added = inbox.onNotificationArrived(raw);
    console.log(
      `[${added ? "ADDED" : "SKIP  "}] ${raw.Type.padEnd(10)} | ${raw.Message}`
    );
  }

  printPriorityTable(inbox.getTopNotifications(), DEFAULT_INBOX_SIZE);
}

runStreamSimulation();
