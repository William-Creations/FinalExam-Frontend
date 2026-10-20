import { CircularProgress, Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { homeFor } from "../utils";

// Requires a logged-in user, optionally with a specific role.
// (The backend enforces this too - this only avoids showing wrong screens.)
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useUser();
  if (loading)
    return (
      <Box sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;
  return children;
}
