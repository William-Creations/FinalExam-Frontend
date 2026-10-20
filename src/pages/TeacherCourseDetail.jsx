import { useEffect, useState } from "react";
import {
  Alert, Button, Card, CardContent, Chip, CircularProgress, Divider, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import CourseForm from "../components/CourseForm";
import StatusChip from "../components/StatusChip";

// Teacher: details of one own course, enrolled students, update and delete.
export default function TeacherCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api(`/api/course/${id}`)
      .then(setCourse)
      .catch((e) => setError(e.message));
  }, [id]);

  async function remove() {
    if (!window.confirm(`Delete "${course.name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/course/${id}`, { method: "DELETE" });
      navigate("/teacher");
    } catch (e) {
      setError(e.message);
    }
  }

  if (error && !course) return <Alert severity="error">{error}</Alert>;
  if (!course) return <CircularProgress />;

  const students = course.students || [];

  return (
    <Stack spacing={2}>
      <Button component={RouterLink} to="/teacher" sx={{ alignSelf: "start" }}>
        ← Back to my courses
      </Button>
      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
      {notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}

      <Card>
        <CardContent>
          {editing ? (
            <>
              <Typography variant="h5" gutterBottom>
                Edit course
              </Typography>
              <CourseForm
                initial={course}
                submitLabel="Save changes"
                onCancel={() => setEditing(false)}
                onSubmit={async (data) => {
                  const updated = await api(`/api/course/${id}`, { method: "PUT", body: data });
                  setCourse({ ...course, ...updated });
                  setEditing(false);
                  setNotice("Course updated.");
                }}
              />
            </>
          ) : (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                <Typography variant="h5">{course.name}</Typography>
                <StatusChip status={course.status} />
              </Stack>
              <Typography sx={{ mt: 1 }}>Duration: {course.duration} days</Typography>
              <Typography>Price: {Number(course.price).toLocaleString()} THB</Typography>
              <Typography>
                Seats: {course.enrolledCount}/{course.maxStudent} ({course.seatsLeft} left)
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ my: 1 }}>
                {course.topics.map((t) => (
                  <Chip key={t} size="small" variant="outlined" label={t} />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="contained" onClick={() => { setNotice(""); setEditing(true); }}>
                  Edit
                </Button>
                <Button color="error" variant="outlined" onClick={remove} disabled={students.length > 0}>
                  Delete
                </Button>
              </Stack>
              {students.length > 0 && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  A course with enrolled students cannot be deleted.
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Enrolled students ({students.length})</Typography>
          <Divider sx={{ my: 1 }} />
          {students.length === 0 ? (
            <Typography color="text.secondary">No students have enrolled yet.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s, i) => (
                  <TableRow key={s.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{s.username}</TableCell>
                    <TableCell>{s.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
