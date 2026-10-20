import { AppBar, Box, Button, Chip, Container, Toolbar, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Layout() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const links =
    user?.role === "Teacher"
      ? [
          ["My Courses", "/teacher"],
          ["New Course", "/teacher/new"],
        ]
      : [
          ["All Courses", "/courses"],
          ["My Enrollments", "/my-courses"],
        ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <SchoolIcon />
          <Typography variant="h6" sx={{ mr: 2 }}>
            Online Course Service
          </Typography>
          {links.map(([label, to]) => (
            <Button key={to} color="inherit" component={RouterLink} to={to}>
              {label}
            </Button>
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            label={`${user?.username} · ${user?.role}`}
            sx={{ bgcolor: "rgba(255,255,255,.2)", color: "inherit" }}
          />
          <Button
            color="inherit"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
