import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  const { token, role } = useAuth();

  const isAdmin = role === 'admin';
  const isClient = role === 'client' || role === 'user'; // support both

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            !token ? (
              <LoginForm />
            ) : isAdmin ? (
              <Navigate to="/dashboard" />
            ) : isClient ? (
              <Navigate to="/user" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={token && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/user"
          element={token && isClient ? <UserDashboard /> : <Navigate to="/login" />}
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
