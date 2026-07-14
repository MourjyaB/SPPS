import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const expiry = localStorage.getItem("token_expiry");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token expired
  if (expiry && Date.now() > Number(expiry)) {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("token_expiry");

    return <Navigate to="/login" replace />;
  }


  // Role checking
  if (!allowedRoles.includes(role)) {

    if (role === "student") {
      return <Navigate to="/student-home" replace />;
    }

    if (role === "teacher") {
      return <Navigate to="/teacher-dashboard" replace />;
    }

    if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }


  // Allowed
  return <Outlet />;
}

export default ProtectedRoute;