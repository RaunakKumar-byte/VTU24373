import { useCallback, useEffect, useState } from "react";
import { fetchPriorityNotifications } from "../api/notifications.js";
import { logError } from "../utils/logger.js";

export function usePriorityNotifications(filter = "All", limit = 10) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPriorityNotifications({ limit, notification_type: filter });
      setNotifications(data.notifications ?? []);
    } catch (err) {
      logError("hook", err.message);
      setError(err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [filter, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { notifications, loading, error, reload: load };
}
