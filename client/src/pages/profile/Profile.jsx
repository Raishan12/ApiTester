import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", profilepicture: null });
  const [updateData, setUpdateData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        if (!userId || !token) {
          toast.error("Please log in to view your profile", { toastId: "auth-error" });
          navigate("/login");
          return;
        }

        const toastId = toast.loading("Loading profile...");
        const userRes = await axios.get(`http://localhost:5000/api/getuser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        setUpdateData({ name: userRes.data.name, email: userRes.data.email });
        toast.update(toastId, {
          render: "Profile loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (err) {
        console.error("Error fetching user data:", err.response?.data || err.message);
        toast.error(`Failed to load profile: ${err.response?.data?.message || err.message}`, {
          toastId: "fetch-error",
        });
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleUpdateProfile = async () => {
    if (!updateData.name.trim() || !updateData.email.trim()) {
      toast.warn("Name and email cannot be empty", { toastId: "update-warn" });
      return;
    }
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const toastId = toast.loading("Updating profile...");
      await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser({ ...user, ...updateData });
      toast.update(toastId, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      toast.error(`Failed to update profile: ${err.response?.data?.message || err.message}`, {
        toastId: "update-error",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warn("New passwords do not match", { toastId: "password-mismatch" });
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.warn("Please fill in all password fields", { toastId: "password-empty" });
      return;
    }
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const toastId = toast.loading("Changing password...");
      await axios.post(
        `http://localhost:5000/api/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.update(toastId, {
        render: "Password changed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error changing password:", err.response?.data || err.message);
      toast.error(`Failed to change password: ${err.response?.data?.message || err.message}`, {
        toastId: "password-error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!", { toastId: "logout-success" });
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const toastId = toast.loading("Deleting account...");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      toast.update(toastId, {
        render: "Account deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err.response?.data || err.message);
      toast.error(`Failed to delete account: ${err.response?.data?.message || err.message}`, {
        toastId: "delete-error",
      });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast.info(`Switched to ${newTheme} mode`, { toastId: "theme-switch" });
  };

  return (
    <div className="p-6 max-w-screen-lg mx-auto dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Profile</h1>

      {/* Profile Picture */}
      {user.profilepicture ? (
        <img
          src={user.profilepicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mb-4 text-gray-600 dark:text-gray-300">
          No Image
        </div>
      )}

      {/* Dashboard Navigation */}
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-purple-600 text-white px-4 py-2 rounded mb-6 hover:bg-purple-700"
      >
        Go to Dashboard
      </button>

      {/* Update Profile */}
      <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Update Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              value={updateData.name}
              onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
              className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={updateData.email}
              onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
              className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="mb-6">
        <button
          onClick={toggleTheme}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>

      {/* Account Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Confirm Account Deletion
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;