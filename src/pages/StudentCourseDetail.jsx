import { useEffect, useState } from "react";
import { Alert, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { api } from "../api";
import StatusChip from "../components/StatusChip";

// Student: view a course and enroll.
export default function StudentCourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/api/course/${id}`)
      .then(setCourse)
      .catch((e) => setError(e.message));
  }, [id]);

  async function enroll() {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const res = await api(`/api/course/${id}/enroll`, { method: "POST" });
      setCourse(res.course);
      setNotice("You are now enrolled in this course.");
    } catch (e) {
      setError(e.message);
      // Refresh so the seat count / status shown is current.
      api(`/api/course/${id}`).then(setCourse).catch(() => {});
    } finally {
      setBusy(false);
    }
  }

  if (error && !course) return <Alert severity="error">{error}</Alert>;
  if (!course) return <CircularProgress />;

  const full = course.seatsLeft <= 0;
  let blocked = "";
  if (course.enrolled) blocked = "You are already enrolled in this course.";
  else if (course.status !== "Open") blocked = "This course is not open for enrollment.";
  else if (full) blocked = "This course is full.";

  return (
    <Stack spacing={2}>
      <Button component={RouterLink} to="/courses" sx={{ alignSelf: "start" }}>
        ← Back to courses
      </Button>
      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      {notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
            <Typography variant="h5">{course.name}</Typography>
            <StatusChip status={course.status} />
          </Stack>
          <Typography color="text.secondary" gutterBottom>
            Teacher: {course.teacherName}
          </Typography>
          <Typography>Duration: {course.duration} days</Typography>
          <Typography>Price: {Number(course.price).toLocaleString()} THB</Typography>
          <Typography>
            Seats: {course.enrolledCount}/{course.maxStudent} ({course.seatsLeft} left)
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
            {course.topics.map((t) => (
              <Chip key={t} size="small" variant="outlined" label={t} />
            ))}
          </Stack>
          <Button variant="contained" sx={{ mt: 2 }} onClick={enroll} disabled={busy || !!blocked}>
            {course.enrolled ? "Enrolled" : "Enroll"}
          </Button>
          {blocked && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              {blocked}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
