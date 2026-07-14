import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/layout";
import "../styles/admin.css";

import {
  FaSearch,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaUserSlash
} from "react-icons/fa";

function UserManagement() {
  const API_URL = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default page
  const [filter, setFilter] = useState("students");

  const [search, setSearch] = useState("");

  /* ==========================================
                FETCH USERS
  ========================================== */

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      let endpoint = "";

      switch (filter) {
        case "students":
          endpoint = "/admin/all_students";
          break;

        case "teachers":
          endpoint = "/admin/all_teachers";
          break;

        case "admins":
          endpoint = "/admin/all_admins";
          break;

        case "banned":
          endpoint = "/admin/all_banned_accounts";
          break;

        default:
          endpoint = "/admin/all_students";
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Unable to fetch users");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.log("Unexpected API response:", data);
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, filter, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ==========================================
                SEARCH USER
  ========================================== */

  const searchUser = async () => {
  const query = search.trim();

  if (!query) {
    fetchUsers();
    return;
  }

  setLoading(true);

  try {
    let url = `${API_URL}/admin/find_user/{username/email/user_id}`;

    // Decide whether the user entered an ID, email or username
    if (/^\d+$/.test(query)) {
      url += `?user_id=${query}`;
    } else if (query.includes("@")) {
      url += `?email=${encodeURIComponent(query)}`;
    } else {
      url += `?username=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "User not found");
    }

    setUsers(Array.isArray(data) ? data : [data]);
  } catch (err) {
    alert(err.message);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

  /* ==========================================
              BAN / UNBAN USER
  ========================================== */

  const toggleUserStatus = async (user) => {
    const action = user.is_active ? "ban" : "unban";

    const confirmed = window.confirm(
      `${action === "ban" ? "Ban" : "Unban"} ${user.username}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/${action}_user/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      alert(
        action === "ban"
          ? "User banned successfully."
          : "User unbanned successfully."
      );

      fetchUsers();
    } catch {
      alert("Operation failed.");
    }
  };

  /* ==========================================
                PROMOTE TEACHER
  ========================================== */

  const promoteUser = async (id) => {
    if (!window.confirm("Promote this teacher to Admin?")) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/promote_user_to_admin/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      alert("Teacher promoted successfully.");

      fetchUsers();
    } catch {
      alert("Unable to promote teacher.");
    }
  };

  /* ==========================================
                DEMOTE ADMIN
  ========================================== */

  const demoteUser = async (id) => {
    if (!window.confirm("Demote this admin to Teacher?")) return;

    try {
      const response = await fetch(
        `${API_URL}/admin/demote_admin/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      alert("Admin demoted successfully.");

      fetchUsers();
    } catch {
      alert("Unable to demote admin.");
    }
  };

  return (
    <Layout>
      <div className="admin-container">
                <div className="admin-title-section">
          <div>
            <h1>User Management</h1>
            <p>Manage students, teachers and administrators.</p>
          </div>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="user-toolbar">
          <div className="filter-group">

            <button
              className={`filter-btn ${
                filter === "students" ? "active" : ""
              }`}
              onClick={() => setFilter("students")}
            >
              <FaUserGraduate />
              Students
            </button>

            <button
              className={`filter-btn ${
                filter === "teachers" ? "active" : ""
              }`}
              onClick={() => setFilter("teachers")}
            >
              <FaChalkboardTeacher />
              Teachers
            </button>

            <button
              className={`filter-btn ${
                filter === "admins" ? "active" : ""
              }`}
              onClick={() => setFilter("admins")}
            >
              <FaUserShield />
              Admins
            </button>

            <button
              className={`filter-btn ${
                filter === "banned" ? "active" : ""
              }`}
              onClick={() => setFilter("banned")}
            >
              <FaUserSlash />
              Banned
            </button>

          </div>

          {/* ================= SEARCH ================= */}

          <div className="search-container">
            <input
                type="text"
                placeholder="Search by username, email or ID..."
                value={search}
                onChange={(e) => {
                setSearch(e.target.value);

                if (e.target.value === "") {
                fetchUsers();
                }
                }}
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                searchUser();
                    }
                }}
            />

            <button onClick={searchUser}>
              <FaSearch />
            </button>
          </div>
        </div>

                {/* ================= TABLE ================= */}

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              No users found.
            </div>
          ) : (
            <>
            {filter === "banned" && (
                <div className="banned-info">
                <strong>Note:</strong> This list includes users who are currently banned or have been banned at least once.
                 </div>
            )}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>{user.username}</td>

                    <td>{user.email}</td>

                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={user.is_active}
                          onChange={() => toggleUserStatus(user)}
                        />
                        <span className="slider"></span>
                      </label>

                      <span
                        className={
                          user.is_active
                            ? "status-badge active-status"
                            : "status-badge banned-status"
                        }
                      >
                        {user.is_active ? "Active" : "Banned"}
                      </span>
                    </td>

                      <td>
                        <div className="action-group">
                          {filter === "students" && (
                            <button
                            className={`action-btn ${
                              user.is_active ? "ban" : "unban"
                            }`}
                            onClick={() => toggleUserStatus(user)}
                            >
                              {user.is_active ? "Ban" : "Unban"}
                            </button>
                          )}
                          {filter === "teachers" && (
                            <button
                            className="action-btn promote"
                            onClick={() => promoteUser(user.id)}
                            >
                              Promote
                            </button>
                          )}
                          {filter === "admins" && (
                            <button
                            className="action-btn demote"
                            onClick={() => demoteUser(user.id)}
                            >
                              Demote
                            </button>
                          )}
                          {filter === "banned" && (
                            <button
                            className={`action-btn ${
                              user.is_active ? "ban" : "unban"
                            }`}
                            onClick={() => toggleUserStatus(user)}
                            >
                              {user.is_active ? "Ban" : "Unban"}
                            </button>
                          )}
                          </div>
                          </td>
                        </tr>
                      ))}
              </tbody>
            </table>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default UserManagement;