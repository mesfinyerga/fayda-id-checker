import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, role, logout, fetchProfile } = useAuth();
  const navigate = useNavigate();

  // --- Avatar dropdown for user profile ---
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      fetchProfile().then(setProfile);
    } else {
      setProfile(null);
    }
  }, [token, fetchProfile]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
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
            <Button component={Link} to="/dashboard" sx={{ color: 'white' }}>
              Admin Dashboard
            </Button>
          )}

          {token && (role === 'client' || role === 'user') && (
            <Button component={Link} to="/user" sx={{ color: 'white' }}>
              Dashboard
            </Button>
          )}

          {token && (
            <Button component={Link} to="/payment" sx={{ color: 'white' }}>
              Simulate Payment
            </Button>
          )}

          {token ? (
            <>
              {/* Profile Avatar + Menu */}
              <Tooltip title="Profile">
                <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 2 }}>
                  <Avatar
                    src={profile?.avatar_url}
                    sx={{ width: 36, height: 36, bgcolor: '#90caf9' }}
                  >
                    {/* Fallback: first letter of name, else generic */}
                    {profile?.full_name
                      ? profile.full_name[0].toUpperCase()
                      : <span role="img" aria-label="user">👤</span>
                    }
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem
                  onClick={() => {
                    navigate('/profile');
                    handleMenuClose();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
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
