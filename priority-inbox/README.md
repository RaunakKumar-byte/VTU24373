# Stage 6 — Priority Inbox (Min Heap)

Node.js implementation that fetches notifications from the evaluation API and maintains the **top 10 highest-priority unread notifications** using a **Min Heap** — without sorting the entire list or using a database.

## Installation

```bash
cd priority-inbox
npm install
cp .env.example .env
```

Edit `.env` with **your registration details** from the Pre-Test Setup document (not the auth URL):

```env
AUTH_EMAIL=you@college.edu
AUTH_NAME=Your Name
AUTH_ROLL_NO=VTU24373
AUTH_ACCESS_CODE=your_access_code
AUTH_CLIENT_ID=your_client_id_uuid
AUTH_CLIENT_SECRET=your_client_secret
```

The app will **automatically POST** to `http://4.224.186.213/evaluation-service/auth` and use the returned `access_token`.

**Test auth only:**

```bash
npm run auth
```

**Or** paste the JWT token directly (must start with `eyJ...`, NOT the URL):

```env
AUTHORIZATION_TOKEN=Bearer eyJhbGciOiJIUzI1NiIs...
```

## Run

**Live API (requires valid token):**

```bash
npm start
```

**Stream simulation (no API token — demonstrates heap updates):**

```bash
npm run demo:stream
```

## Project Structure

```
priority-inbox/
├── package.json
├── .env.example
├── README.md
└── src/
    ├── index.js                 # Entry: fetch API → build inbox → print table
    ├── config/constants.js      # API URL, type weights, inbox size
    ├── services/
    │   └── notificationApi.js   # axios client + error handling
    ├── utils/
    │   ├── priorityScore.js     # Score calculation & comparison
    │   └── normalizeNotification.js
    ├── datastructures/
    │   └── MinHeap.js           # Generic min heap (O(log k) ops)
    ├── inbox/
    │   └── PriorityInbox.js     # Top-N maintenance logic
    ├── display/
    │   └── tablePrinter.js      # Formatted ASCII table output
    └── demo/
        └── streamSimulation.js  # Real-time arrival simulation
```

## Algorithm

### Priority Score

Each unread notification receives a numeric score:

```
score = (typeWeight × 10^12) + timestampMs
```

| Type        | Weight |
|-------------|--------|
| Placement   | 3      |
| Result      | 2      |
| Event       | 1      |

- **Type weight** ensures Placement always outranks Result and Event.
- **Recency** (timestamp in ms) breaks ties within the same type — newer wins.
- The multiplier `10^12` keeps type dominance over any realistic timestamp delta.

### Min Heap (size = 10)

A **min heap** stores the current top 10 notifications. The **root** is the *weakest* among those 10.

For each incoming unread notification:

1. If heap size `< 10` → push (O(log 10)).
2. If heap is full and `new.score > root.score` → pop root, push new (O(log 10)).
3. Otherwise → discard.

To display results, extract heap items and sort 10 elements descending — O(10 log 10) = O(1).

### Why not sort the full list?

| Approach              | Per batch (N items) | Per new arrival |
|-----------------------|---------------------|-----------------|
| Sort entire list      | O(N log N)          | O(N log N)      |
| Min heap (k = 10)     | O(N log k)          | O(log k)        |

With N = 100,000 and k = 10, the heap avoids ~100,000 × log(100,000) comparisons on every update.

### Complexity

| Operation              | Time           | Space   |
|------------------------|----------------|---------|
| Build inbox from N items | O(N log k)   | O(k)    |
| Add one notification   | O(log k)       | O(k)    |
| Get top k sorted       | O(k log k)     | O(k)    |

Where k = 10 (constant), so per-arrival cost is effectively **O(1)** with fixed memory.

## Error Handling

The API client handles:

- Missing `AUTHORIZATION_TOKEN`
- HTTP 401 (invalid token)
- HTTP 5xx (server errors)
- Network unreachable / timeout (15 s)
- Unexpected response shape

Errors are printed to stderr and the process exits with code 1.

## Sample Output

### Stream simulation (`npm run demo:stream`)

```
=== Stream Simulation — O(log 10) per arrival ===

[ADDED] Event      | farewell
[ADDED] Result     | mid-sem
[ADDED] Placement  | CSX Corporation hiring
[ADDED] Result     | mid sem
[ADDED] Placement  | Advanced Micro Devices Inc. hiring
[SKIP  ] Event     | tech-fest
[ADDED] Result     | project-review

=== Priority Inbox — Top Unread Notifications ===

 Rank | Type      | Weight | Timestamp           | Message                              | ID
------+-----------+--------+---------------------+--------------------------------------+-------------
 1    | Result    | 2      | 2024-04-22 17:51:30 | mid sem                              | d146095a-0...
 2    | Placement | 3      | 2024-04-22 17:51:18 | CSX Corporation hiring               | b283218f-0...
 3    | Result    | 2      | 2024-04-22 17:50:54 | mid-sem                              | 8035513a-0...
 4    | Result    | 2      | 2024-04-22 17:50:18 | project-review                       | e5c4ff20-3...
 5    | Placement | 3      | 2024-04-22 17:49:42 | Advanced Micro Devices Inc. hiring   | 8a7412bd-b...
 6    | Event     | 1      | 2024-04-22 17:51:06 | farewell                             | 81589ada-0...

Showing 6 of 6 inbox items.
```

*(Rank order: Placements first by recency, then Results, then Events.)*

### Live API (`npm start`)

```
Fetching notifications from evaluation API...

Received 847 notifications from API.
Unread notifications: 612
Accepted into priority inbox (capacity 10): 10

=== Priority Inbox — Top Unread Notifications ===
...
```

## Continuous Incoming Notifications

`PriorityInbox.onNotificationArrived(rawNotification)` is the real-time hook:

- Call it when SSE/WebSocket/polling delivers a new notification.
- Each call is **O(log 10)** — no full re-sort, no database query.
- Duplicate IDs are ignored via a `Set`.

See `src/demo/streamSimulation.js` for a worked example.

## Dependencies

| Package | Purpose        |
|---------|----------------|
| axios   | HTTP client    |
| dotenv  | Load `.env`    |

No database. No manual notification seeding. All live data comes from the evaluation API.
