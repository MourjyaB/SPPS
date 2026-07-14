import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaQuestionCircle,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";
import "../styles/admin.css";
import Layout from "../components/layout";

function AdminHome() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Dashboard",
      icon: <FaChartBar size={45} />,
      description: "View overall system statistics.",
      route: "/admin-dashboard",
    },
    {
      title: "Question Management",
      icon: <FaQuestionCircle size={45} />,
      description: "Approve or reject teacher submitted questions.",
      route: "/question-management",
    },
    {
      title: "User Management",
      icon: <FaUsers size={45} />,
      description: "Manage students, teachers and admins.",
      route: "/user-management",
    },
    {
      title: "Teacher Statistics",
      icon: <FaChalkboardTeacher size={45} />,
      description: "Check teacher performance and contribution.",
      route: "/teacher-stats",
    },
  ];

  return (
    <Layout>
    <div className="admin-container">

     <div className="welcome-box">

          <h1>Welcome Back!</h1>
            
          <p>
            Student Performance Prediction System
          </p>
              
          <span>
            Manage • Monitor • Maintain
          </span>

        
        </div>

      <div className="admin-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className="admin-card"
            onClick={() => navigate(card.route)}
          >
            <div className="card-icon">{card.icon}</div>

            <h3>{card.title}</h3>

            <p>{card.description}</p>

            <button>Open</button>
          </div>
        ))}
      </div>

    
    </div>
    </Layout>
  );
}

export default AdminHome;