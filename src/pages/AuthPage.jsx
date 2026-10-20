import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography, Link } from "@mui/material";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { homeFor } from "../utils";

// One component for both /login and /register.
export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { user, login, register } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "Student" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (user) return <Navigate to={homeFor(user)} replace />;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = isLogin ? await login(form.email, form.password) : await register(form);
      navigate(homeFor(u), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "grey.100", p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Online Course Service
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {isLogin ? "Log in to continue" : "Create an account"}
          </Typography>
          <Box component="form" onSubmit={submit}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {!isLogin && (
                <TextField label="Username" value={form.username} onChange={set("username")} required />
              )}
              <TextField
                label={isLogin ? "Email or username" : "Email"}
                value={form.email}
                onChange={set("email")}
                type={isLogin ? "text" : "email"}
                autoComplete="username"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={set("password")}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
              {!isLogin && (
                <TextField select label="Role" value={form.role} onChange={set("role")}>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                </TextField>
              )}
              <Button type="submit" variant="contained" size="large" disabled={busy}>
                {busy ? "Please wait..." : isLogin ? "Log in" : "Register"}
              </Button>
              <Typography variant="body2">
                {isLogin ? (
                  <>
                    No account? <Link component={RouterLink} to="/register">Register</Link>
                  </>
                ) : (
                  <>
                    Already registered? <Link component={RouterLink} to="/login">Log in</Link>
                  </>
                )}
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
