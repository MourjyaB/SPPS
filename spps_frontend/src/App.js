import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import Test from "./test";
import Exam from "./exam";
import TeacherDashboard from "./teacherDashboard";
import ProtectedTeacherRoute from "./ProtectedTeacherRoute";
import ProtectedStudentRoute from "./ProtectedStudentRoute";
import TeacherHome from "./teacherHome";
import StudentHome from "./studentHome";
import UploadQuestions from "./uploadQuestions";
import QuestionBank from "./questionBank";
import Analytics from "./analytics";
import TeacherProfile from "./teacherProfile";
import StudentDashboard from "./studentDashboard";
import Results from "./results";
import Performance from "./performance";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<Test />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/student-home" element={<ProtectedStudentRoute> <StudentHome /> </ProtectedStudentRoute>}/>
      <Route path="/teacher-home" element={<ProtectedTeacherRoute> <TeacherHome /> </ProtectedTeacherRoute>}/>
      <Route path="/teacher-dashboard" element={<ProtectedTeacherRoute> <TeacherDashboard /> </ProtectedTeacherRoute>}/>
      <Route path="/upload-questions" element={<ProtectedTeacherRoute> <UploadQuestions /> </ProtectedTeacherRoute>}/>
      <Route path="/question-bank" element={<ProtectedTeacherRoute> <QuestionBank /> </ProtectedTeacherRoute>}/>
      <Route path="/analytics" element={<ProtectedTeacherRoute> <Analytics /> </ProtectedTeacherRoute>}/>
      <Route path="/teacher-profile" element={<ProtectedTeacherRoute> <TeacherProfile /> </ProtectedTeacherRoute>}/>
      <Route path="/student-dashboard" element={<ProtectedStudentRoute> <StudentDashboard /> </ProtectedStudentRoute>}/>
      <Route path="/results" element={<ProtectedStudentRoute> <Results /> </ProtectedStudentRoute>}/>
      <Route path="/performance" element={<ProtectedStudentRoute> <Performance /> </ProtectedStudentRoute>}/>
    </Routes>
  );
}

export default App;