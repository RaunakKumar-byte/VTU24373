import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { NotificationCard } from "../components/NotificationCard.jsx";
import { NotificationFilter } from "../components/NotificationFilter.jsx";
import { usePriorityNotifications } from "../hooks/usePriorityNotifications.js";

export function PriorityPage() {
  const [filter, setFilter] = useState("All");
  const [limit, setLimit] = useState(10);
  const [tick, setTick] = useState(0);

  const { notifications, loading, error } = usePriorityNotifications(filter, limit);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <StarIcon color="warning" sx={{ fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>
          Priority Inbox
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Top unread notifications ranked by type weight (Placement &gt; Result &gt; Event) and recency.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems={{ sm: "center" }}>
        <NotificationFilter
          value={filter}
          onChange={setFilter}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Top N</InputLabel>
          <Select
            label="Top N"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[5, 10, 15, 20].map((n) => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load priority inbox: {error}</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No priority notifications available.</Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5} key={tick}>
          {notifications.map((n, i) => (
            <Box key={n.ID ?? n.id}>
              <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
                #{i + 1}
              </Typography>
              <NotificationCard
                notification={n}
                onRead={() => setTick((t) => t + 1)}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
