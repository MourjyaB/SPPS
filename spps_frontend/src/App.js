import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Test from "./pages/test";
import Exam from "./pages/exam";
import TeacherDashboard from "./pages/teacherDashboard";
import TeacherHome from "./pages/teacherHome";
import StudentHome from "./pages/studentHome";
import UploadQuestions from "./pages/uploadQuestions";
import TeacherProfile from "./pages/teacherProfile";
import StudentProfile from "./pages/studentProfile";
import StudentDashboard from "./pages/studentDashboard";
import Results from "./pages/results";
import Performance from "./pages/performance";
import FindStudent from "./pages/findStudent";
import StudentReport from "./pages/studentReport";
import AdminHome from "./pages/adminHome";
import AdminDashboard from "./pages/adminDashboard";
import QuestionManagement from "./pages/questionManagement";
import UserManagement from "./pages/userManagement";
import TeacherStatistics from "./pages/teacherStats";
import AdminProfile from "./pages/adminProfile";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
      <Route path="/test" element={<Test />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/student-home" element={<StudentHome />}/>
      <Route path="/student-profile" element={<StudentProfile />}/>
      <Route path="/student-dashboard" element={<StudentDashboard />}/>
      <Route path="/results" element={<Results />}/>
      <Route path="/performance" element={<Performance />}/>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
      <Route path="/teacher-home" element={<TeacherHome />}/>
      <Route path="/teacher-dashboard" element={<TeacherDashboard />}/>
      <Route path="/upload-questions" element={<UploadQuestions />}/>
      <Route path="/teacher-profile" element={<TeacherProfile />}/>
      <Route path="/find-student" element={<FindStudent />}/>
      <Route path="/student-report" element={<StudentReport />}/>
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="/admin-profile" element={<AdminProfile/>}/>
      <Route path="/admin-home" element={<AdminHome />}/>
      <Route path="/admin-dashboard" element={<AdminDashboard />}/>
      <Route path="/question-management" element={<QuestionManagement />}/>
      <Route path="/user-management" element={<UserManagement/>}/>
      <Route path="/teacher-stats" element={<TeacherStatistics/>}/>
      </Route>

    </Routes>
  );
}

export default App;