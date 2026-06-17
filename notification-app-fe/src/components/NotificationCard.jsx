import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { TYPE_COLORS } from "../config/constants.js";
import { isRead, markAsRead } from "../utils/readStore.js";

export function NotificationCard({ notification, onRead }) {
  const id = notification.ID ?? notification.id;
  const type = notification.Type ?? notification.type;
  const message = notification.Message ?? notification.message;
  const timestamp = notification.Timestamp ?? notification.timestamp;
  const read = isRead(id);

  const handleClick = () => {
    if (!read) {
      markAsRead(id);
      onRead?.();
    }
  };

  return (
    <Card
      variant="outlined"
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        bgcolor: read ? "action.hover" : "background.paper",
        borderColor: read ? "divider" : "primary.light",
        opacity: read ? 0.75 : 1,
        transition: "0.2s",
        "&:hover": { boxShadow: 2 },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {!read && (
            <FiberManualRecordIcon color="primary" sx={{ fontSize: 12 }} />
          )}
          <Chip
            label={type}
            size="small"
            color={TYPE_COLORS[type] ?? "default"}
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
            {timestamp}
          </Typography>
        </Stack>
        <Typography variant="body1">{message}</Typography>
      </CardContent>
    </Card>
  );
}
