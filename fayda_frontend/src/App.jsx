import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';
import theme from './theme';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Payment from './pages/Payment';
import UserProfile from './pages/UserProfile';
// import DesignTokenTest from './components/DesignTokenTest';
import LayoutTest from './components/LayoutTest';
import NavigationTest from './components/NavigationTest';
import TypographyTest from './components/TypographyTest';
// import SpacingTest from './components/SpacingTest';
import ErrorLoadingTest from './components/ErrorLoadingTest';
import UIShowcase from './components/UIShowcase';

function App() {
  const { token, role } = useAuth();
  const isAdmin = role === 'admin';
  const isClient = role === 'client' || role === 'user';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div id="app">
          <Navbar />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
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
              <Route 
                path="/payment" 
                element={token ? <Payment /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/profile" 
                element={token ? <UserProfile /> : <Navigate to="/login" />} 
              />
              
              {/* Test Routes */}
              {/* <Route path="/design-tokens" element={<DesignTokenTest />} /> */}
              <Route path="/layout-test" element={<LayoutTest />} />
              <Route path="/navigation-test" element={<NavigationTest />} />
              <Route path="/typography-test" element={<TypographyTest />} />
              {/* <Route path="/spacing-test" element={<SpacingTest />} /> */}
              <Route path="/error-loading-test" element={<ErrorLoadingTest />} />
              <Route path="/ui-showcase" element={<UIShowcase />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
