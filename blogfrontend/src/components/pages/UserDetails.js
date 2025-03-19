import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDetails() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleViewBlogs = (id) => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth) {
      navigate(`/user/${id}`);
    } else {
      alert("Please Login/Signup");
      navigate("/");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/admin/users/deleteUser/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/admin/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
        User Details
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">
          {error}
        </div>
      )}
      {users.length === 0 && !error && (
        <p className="text-center text-gray-500">No users available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-lg rounded-lg p-5 flex flex-col items-center text-center border"
          >
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
              {user.imageData ? (
                <img
                  src={`data:${user.imageContentType};base64,${user.imageData}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>

            {/* User Info */}
            <h4 className="mt-4 text-lg font-semibold text-gray-700">
              {user.userName}
            </h4>
            <span className="text-gray-500 text-sm">{user.email}</span>

            {/* Buttons */}
            <div className="mt-4 flex space-x-2 w-full">
              <button
                onClick={() => handleViewBlogs(user.id)}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                View Blogs
              </button>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
