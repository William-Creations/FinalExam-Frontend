//src/App.jsx

import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { homeFor } from "./utils";
import { useUser } from "./context/UserContext";
import AuthPage from "./pages/AuthPage";
import MyCourses from "./pages/MyCourses";
import StudentCourseDetail from "./pages/StudentCourseDetail";
import StudentCourses from "./pages/StudentCourses";
import TeacherCourseCreate from "./pages/TeacherCourseCreate";
import TeacherCourseDetail from "./pages/TeacherCourseDetail";
import TeacherCourses from "./pages/TeacherCourses";

function Home() {
  const { user, loading } = useUser();
  if (loading) return null;
  return <Navigate to={homeFor(user)} replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        {/* Teacher */}
        <Route
          element={
            <ProtectedRoute role="Teacher">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/teacher" element={<TeacherCourses />} />
          <Route path="/teacher/new" element={<TeacherCourseCreate />} />
          <Route path="/teacher/:id" element={<TeacherCourseDetail />} />
        </Route>

        {/* Student */}
        <Route
          element={
            <ProtectedRoute role="Student">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/courses" element={<StudentCourses />} />
          <Route path="/courses/:id" element={<StudentCourseDetail />} />
          <Route path="/my-courses" element={<MyCourses />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
