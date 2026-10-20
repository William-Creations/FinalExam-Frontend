import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { api } from "../api";
import CourseGrid from "../components/CourseGrid";

// Student: courses the student is enrolled in.
export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/course/enrolled")
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        My Enrollments
      </Typography>
      <CourseGrid
        courses={courses}
        loading={loading}
        error={error}
        linkFor={(c) => `/courses/${c.id}`}
        empty="You have not enrolled in any course yet."
      />
    </>
  );
}
