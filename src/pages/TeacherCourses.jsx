import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../api";
import CourseGrid from "../components/CourseGrid";

// Teacher: list of the teacher's own courses.
export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/course")
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">My Courses</Typography>
        <Button variant="contained" component={RouterLink} to="/teacher/new">
          New course
        </Button>
      </Stack>
      <CourseGrid
        courses={courses}
        loading={loading}
        error={error}
        linkFor={(c) => `/teacher/${c.id}`}
        empty="You have not created any courses yet."
      />
    </>
  );
}
