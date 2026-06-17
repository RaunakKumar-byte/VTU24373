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


