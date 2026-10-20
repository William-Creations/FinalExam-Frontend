import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import StatusChip from "./StatusChip";

export default function CourseCard({ course, to }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
          <Typography variant="h6">{course.name}</Typography>
          <StatusChip status={course.status} />
        </Stack>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Teacher: {course.teacherName}
        </Typography>
        <Typography variant="body2">
          {course.duration} days · {Number(course.price).toLocaleString()} THB
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Seats: {course.enrolledCount}/{course.maxStudent} ({course.seatsLeft} left)
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {course.topics.map((t) => (
            <Chip key={t} size="small" variant="outlined" label={t} />
          ))}
        </Stack>
      </CardContent>
      <CardActions>
        <Button component={RouterLink} to={to}>
          View details
        </Button>
        {course.enrolled && <Chip size="small" color="primary" label="Enrolled" />}
      </CardActions>
    </Card>
  );
}
