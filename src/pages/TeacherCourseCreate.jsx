import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import CourseForm from "../components/CourseForm";

export default function TeacherCourseCreate() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create a new course
        </Typography>
        <CourseForm
          submitLabel="Create course"
          onCancel={() => navigate("/teacher")}
          onSubmit={async (data) => {
            const created = await api("/api/course", { method: "POST", body: data });
            navigate(`/teacher/${created.id}`);
          }}
        />
      </CardContent>
    </Card>
  );
}
