import { Alert, CircularProgress, Grid, Box } from "@mui/material";
import CourseCard from "./CourseCard";

export default function CourseGrid({ courses, loading, error, linkFor, empty }) {
  if (loading)
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!courses.length) return <Alert severity="info">{empty}</Alert>;
  return (
    <Grid container spacing={2}>
      {courses.map((c) => (
        <Grid key={c.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <CourseCard course={c} to={linkFor(c)} />
        </Grid>
      ))}
    </Grid>
  );
}
