import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationCard } from "../components/NotificationCard.jsx";
import { NotificationFilter } from "../components/NotificationFilter.jsx";
import { useNotifications } from "../hooks/useNotifications.js";
import { unreadCount } from "../utils/readStore.js";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);

  const { notifications, totalPages, loading, error } = useNotifications(filter, page);
  const unread = unreadCount(notifications);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unread} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          All Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box mb={3}>
        <NotificationFilter
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
        />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5} key={tick}>
          {notifications.map((n) => (
            <NotificationCard
              key={n.ID ?? n.id}
              notification={n}
              onRead={() => setTick((t) => t + 1)}
            />
          ))}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
