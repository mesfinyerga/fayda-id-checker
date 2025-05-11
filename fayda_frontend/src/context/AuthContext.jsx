import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  const login = (jwt, userRole) => {
    setToken(jwt);
    setRole(userRole);
    localStorage.setItem('token', jwt);
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('http://localhost:8000/register/', userData);
      return res.status === 200 || res.status === 201;
    } catch (err) {
      console.error('Registration failed:', err);
      return false;
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error('Failed to fetch users:', err);
      return [];
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:8000/admin/users/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  const updateUserRole = async (id, newRole) => {
    try {
      await axios.patch(
        `http://localhost:8000/admin/users/${id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
        register,
        getUsers,
        updateUserStatus,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
