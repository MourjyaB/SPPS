import { Navigate } from "react-router-dom";

function ProtectedStudentRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const expiry = localStorage.getItem("token_expiry");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Session expired
  if (expiry && Date.now() > Number(expiry)) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  // Wrong role
  if (role !== "student") {
    return <Navigate to="/teacher-home" />;
  }

  return children;
}

export default ProtectedStudentRoute;