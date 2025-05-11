import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}
        >
          Fayda ID Checker
        </Typography>

        <Box>
          <Button component={Link} to="/" sx={{ color: 'white' }}>
            Home
          </Button>

          {token && role === 'admin' && (
            <>
              <Button component={Link} to="/dashboard" sx={{ color: 'white' }}>
                Dashboard
              </Button>
              <Button component={Link} to="/dashboard" sx={{ color: 'white' }}>
                Admin
              </Button>
            </>
          )}

          {token && (role === 'client' || role === 'user') && (
            <Button component={Link} to="/user" sx={{ color: 'white' }}>
              Dashboard
            </Button>
          )}

          {token ? (
            <Button onClick={handleLogout} sx={{ color: 'hotpink' }}>
              Logout
            </Button>
          ) : (
            <>
              <Button component={Link} to="/login" sx={{ color: 'white' }}>
                Login
              </Button>
              <Button component={Link} to="/register" sx={{ color: 'white' }}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
