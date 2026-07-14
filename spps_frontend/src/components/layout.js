import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaChartBar,
  FaClipboardCheck,
  FaTrophy,
  FaChartLine,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaFileUpload,
  FaUsers,
  FaQuestionCircle,
  FaChalkboardTeacher
} from "react-icons/fa";

function Layout({ children }) {

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const [role, setRole] = useState("");

  useEffect(() => {

    const fetchRole = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        setRole(data.role);

      } catch (err) {

        console.log(err);

      }

    };

    fetchRole();

  }, []);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("token_expiry");

    navigate("/login");

  };

  return (

    <div className={`layout ${collapsed ? "sidebar-collapsed" : ""}`}>

      <div className="sidebar">

        <div
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </div>

        {!collapsed && (

          <div className="logo-section">

            <h1>SPPS</h1>

            <p>
                {role === "teacher"
                ? "Teacher Portal"
                : role === "admin"
                ? "Admin Portal"
                : "Student Portal"}
            </p>

          </div>

        )}

        <ul className="sidebar-menu">
            {role === "admin" ? (

    <>
      <li onClick={() => navigate("/admin-home")}>
        <FaHome />
        {!collapsed && <span>Home</span>}
      </li>

      <li onClick={() => navigate("/admin-dashboard")}>
        <FaChartBar />
        {!collapsed && <span>Dashboard</span>}
      </li>
      <li onClick={() => navigate("/question-management")}>
        <FaQuestionCircle />
        {!collapsed && <span>Question Management</span>}
      </li>
      <li onClick={() => navigate("/user-management")}>
        <FaUsers />
        {!collapsed && <span>User Management</span>}
      </li>
      <li onClick={() => navigate("/teacher-stats")}>
        <FaChalkboardTeacher />
        {!collapsed && <span>Teacher Statistics</span>}
      </li>
      <li onClick={() => navigate("/admin-profile")}>
        <FaUser />
        {!collapsed && <span>Profile</span>}
      </li>

    </>

  ): role === "teacher" ? (

            <>

              <li onClick={() => navigate("/teacher-home")}>
                <FaHome />
                {!collapsed && <span>Home</span>}
              </li>

              <li onClick={() => navigate("/upload-questions")}>
                <FaFileUpload />
                {!collapsed && <span>Upload Questions</span>}
              </li>
              <li onClick={() => navigate("/find-student")}>
                <FaUsers />
                {!collapsed && <span>Find Students</span>}
              </li>

              <li onClick={() => navigate("/student-report")}>
                <FaChartBar />
                {!collapsed && <span>Student Reports</span>}
              </li>

              <li onClick={() => navigate("/teacher-profile")}>
                <FaUser />
                {!collapsed && <span>Profile</span>}
              </li>

            </>

          ) : (

            <>
              {/* -------- STUDENT MENU -------- */}

              <li onClick={() => navigate("/student-home")}>

                <FaHome />

                {!collapsed && <span>Home</span>}

              </li>

              <li onClick={() => navigate("/student-dashboard")}>

                <FaChartBar />

                {!collapsed && <span>Dashboard</span>}

              </li>

              <li onClick={() => navigate("/test")}>

                <FaClipboardCheck />

                {!collapsed && <span>Take Test</span>}

              </li>

              <li onClick={() => navigate("/results")}>

                <FaTrophy />

                {!collapsed && <span>Exam Analysis</span>}

              </li>

              <li onClick={() => navigate("/performance")}>

                <FaChartLine />

                {!collapsed && <span>Performance Analytics</span>}

              </li>

              <li onClick={() => navigate("/student-profile")}>

                <FaUser />

                {!collapsed && <span>Profile</span>}

              </li>

            </>

          )}

        </ul>

        <div className="sidebar-bottom">

          <button
            className="logout-btn"
            onClick={logout}
          >

            <FaSignOutAlt />

            {!collapsed && <span>Logout</span>}

          </button>

        </div>

      </div>

      <div className="main-content">

        {children}

      </div>

    </div>

  );

}

export default Layout;