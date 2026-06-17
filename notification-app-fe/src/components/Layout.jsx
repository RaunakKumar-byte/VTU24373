import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export function Layout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" fontWeight={700} color="primary" sx={{ flexGrow: 1 }}>
            Campus Notify
          </Typography>
          <Button
            component={NavLink}
            to="/"
            end
            sx={{ textTransform: "none" }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            All
          </Button>
          <Button
            component={NavLink}
            to="/priority"
            sx={{ textTransform: "none" }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Priority
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
