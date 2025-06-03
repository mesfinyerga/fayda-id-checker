import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = "http://localhost:8000"; // Adjust for production!

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);
  const [user, setUser] = useState(null);

  // Setup: Always send token in all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Restore session (token/role) on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  // Login: Save token and role, setup axios
  const login = (jwt, userRole) => {
    setToken(jwt);
    setRole(userRole);
    localStorage.setItem('token', jwt);
    localStorage.setItem('role', userRole);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  };

  // Logout: Clear everything
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Registration: Supports all user fields
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API}/register/`, userData);
      return res.status === 200 || res.status === 201;
    } catch (err) {
      // You can parse err.response.data here for detail
      return false;
    }
  };

  // Fetch logged-in user's profile
  const fetchProfile = async () => {
  if (!token) return null;
  try {
    const res = await axios.get(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    return null;
  }
  };

  // Update profile (PUT /users/me)
  const updateProfile = async (profileData) => {
    if (!token) return null;
    try {
      const res = await axios.put(`${API}/users/me`, profileData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      return null;
    }
  };

  // Avatar upload (POST /users/me/avatar)
  const uploadAvatar = async (file) => {
    if (!token) return null;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API}/users/me/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.avatar_url;
    } catch (err) {
      return null;
    }
  };

  // Password change (PUT /users/me/password)
  const changePassword = async (oldPassword, newPassword) => {
    if (!token) return false;
    try {
      await axios.put(`${API}/users/me/password`, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  // Fetch payments for user (GET /payments/)
  const fetchPayments = async () => {
    if (!token) return [];
    try {
      const res = await axios.get(`${API}/payments/`);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  // --------- ADMIN Features ---------
  // List all users (GET /admin/users)
  const getUsers = async () => {
    if (!token) return [];
    try {
      const res = await axios.get(`${API}/admin/users`);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  // Update a user's status (PATCH /admin/users/:id/status)
  const updateUserStatus = async (id, status) => {
    if (!token) return false;
    try {
      await axios.patch(`${API}/admin/users/${id}/status`, { status });
      return true;
    } catch (err) {
      return false;
    }
  };

  // Update a user's role (PATCH /admin/users/:id/role)
  const updateUserRole = async (id, newRole) => {
    if (!token) return false;
    try {
      await axios.patch(`${API}/admin/users/${id}/role`, { role: newRole });
      return true;
    } catch (err) {
      return false;
    }
  };

  // ---------- Expose context ----------
  return (
    <AuthContext.Provider
      value={{
        token, role, user,
        login, logout, register,
        fetchProfile, updateProfile, uploadAvatar, changePassword,
        fetchPayments,
        getUsers, updateUserStatus, updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
