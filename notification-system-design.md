Notification System Design

 Stage 1

### Overview

The Notification System allows users to receive and manage notifications. Users can view notifications, mark them as read, and delete them. Real-time updates will be supported using Socket.IO.

 APIs

Create Notification**

http
POST /api/notifications


Get All Notifications


GET /api/notifications


Get Notification By ID

http
GET /api/notifications/:id


Mark Notification as Read

```http
PATCH /api/notifications/:id/read
```

**Delete Notification**

```http
DELETE /api/notifications/:id
```

### Notification Schema

```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "string",
  "isRead": false,
  "createdAt": "datetime"
}
```

### Real-Time Notifications

Socket.IO will be used for real-time communication. Whenever a notification is created, the server will emit an event and connected users will receive the notification instantly without refreshing the page.

---

Stage 2

Database Choice

I would use MongoDB because notification data is document-based, flexible, and easy to scale.

Collection Structure

```json
{
  "_id": "ObjectId",
  "userId": "String",
  "title": "String",
  "message": "String",
  "type": "String",
  "isRead": "Boolean",
  "createdAt": "Date"
}
```

Indexes

* userId
* createdAt
* isRead

Handling Large Data

As the number of notifications grows, performance can be improved using:

 Indexing
Pagination
Archiving old notifications
 Database sharding



Stage 3

The given query is correct because it retrieves all unread notifications for a specific student and sorts them by creation date.

However, as the notifications table grows to millions of records, the query can become slow if proper indexes are not available. The database may need to scan a large number of rows before finding the required records and then sort them.

To improve performance, I would create a composite index on studentID, isRead, and createdAt. This allows the database to quickly locate unread notifications for a student and return them in sorted order.

Without indexes, the query may require a full table scan, which has a higher computational cost. With a suitable index, the database can find the required records much more efficiently.

I would not add indexes on every column because indexes consume storage and can slow down insert and update operations. Indexes should only be created for columns that are frequently used in filtering, searching, or sorting.

Query to find students who received Placement notifications in the last 7 days:

SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;

This query returns unique student IDs who received Placement notifications during the last seven days.
