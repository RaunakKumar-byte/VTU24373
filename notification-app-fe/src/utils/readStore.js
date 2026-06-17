const KEY = "read_notification_ids";

export function getReadIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function markAsRead(id) {
  const ids = getReadIds();
  ids.add(id);
  localStorage.setItem(KEY, JSON.stringify([...ids]));
}

export function isRead(id) {
  return getReadIds().has(id);
}

export function unreadCount(list) {
  const read = getReadIds();
  return list.filter((n) => !read.has(n.ID ?? n.id)).length;
}
