import { Navigate } from "react-router-dom";

function ProtectedTeacherRoute({ children }) {
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
  if (role !== "teacher") {
    return <Navigate to="/student-home" />;
  }

  return children;
}

export default ProtectedTeacherRoute;