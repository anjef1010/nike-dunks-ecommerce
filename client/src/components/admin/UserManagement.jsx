// client/src/components/admin/UserManagement.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
// import axios from "axios"; // Not directly used if using authAxios
import { toast } from "react-toastify";
import '../../css/UserManagement.css' // Make sure this CSS exists

const UserManagement = () => {
  const { token, authAxios } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null); // Clear previous errors on new fetch
      try {
        if (authAxios && token) {
          // --- FIX 1: Change URL from /api/admin/users to /api/users ---
          // --- FIX 3: Log response and extract 'users' array ---
          const { data } = await authAxios.get("/api/users"); // Corrected URL

          console.log("UserManagement: API Response Data (GET /api/users):", data); 
          if (data && Array.isArray(data.users)) {
            setUsers(data.users);
          } else {
            setError('Invalid users data received from API. Expected an array in `data.users`.');
            console.error("UserManagement: API response for users was not an array:", data);
            setUsers([]); // Ensure users is an empty array to prevent map error
          }
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        toast.error(`Failed to fetch users: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (authAxios && token) {
      fetchUsers();
    }
  }, [authAxios, token]);

  return (
    <div className="admin-page">
      <h2>User Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            {/* Hydration error fix: Ensure no whitespace between <th> tags */}
            <tr>
              <th>ID</th><th>Email</th><th>Role</th>
              {/* Add actions if you plan to have edit/delete for users */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                     <td>{user._id.substring(0, 8)}...</td>
                     <td>{user.email}</td>
                     <td>{user.isAdmin ? "Admin" : "User"}</td>
                     </tr>
                    ))}
                    </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;