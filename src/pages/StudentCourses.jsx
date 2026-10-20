import { useEffect, useState } from "react";
import { InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { api } from "../api";
import CourseGrid from "../components/CourseGrid";

// Student: all non-cancelled courses, filter by course name or teacher name.
export default function StudentCourses() {
  const [q, setQ] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(() => {
      setLoading(true);
      api(`/api/course?q=${encodeURIComponent(q.trim())}`)
        .then((d) => { if (!ignore) { setCourses(d); setError(""); } })
        .catch((e) => { if (!ignore) setError(e.message); })
        .finally(() => { if (!ignore) setLoading(false); });
    }, 300); // debounce typing
    return () => { ignore = true; clearTimeout(timer); };
  }, [q]);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Courses
      </Typography>
      <TextField
        fullWidth
        sx={{ mb: 2, bgcolor: "background.paper" }}
        placeholder="Search by course name or teacher name"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <CourseGrid
        courses={courses}
        loading={loading}
        error={error}
        linkFor={(c) => `/courses/${c.id}`}
        empty="No courses found."
      />
    </>
  );
}
