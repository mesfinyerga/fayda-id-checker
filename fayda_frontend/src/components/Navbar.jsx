import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from "@mui/material";
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // State for mobile menu and user menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // Navigation items configuration - using actual routes
  const navigationItems = [
    {
      label: 'Home',
      href: '/',
      icon: <HomeIcon />,
      show: true,
      hasDropdown: false
    },
    {
      label: 'Dashboard',
      href: token && role === 'admin' ? '/dashboard' : '/user',
      icon: <DashboardIcon />,
      show: token,
      hasDropdown: false
    },
    {
      label: 'Payment',
      href: '/payment',
      icon: <PaymentIcon />,
      show: token,
      hasDropdown: false
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <PersonIcon />,
      show: token,
      hasDropdown: false
    }
  ];

  // Handle logout
  const handleLogout = () => {
    logout();
    setUserMenuAnchor(null);
    navigate("/");
  };

  // Handle navigation
  const handleNavigation = (href) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  // Check if current route is active
  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  // Render navigation items
  const renderNavigationItems = () => {
    return navigationItems
      .filter(item => item.show)
      .map((item) => (
        <Button
          key={item.label}
          component={Link}
          to={item.href}
          startIcon={item.icon}
          sx={{
            color: 'var(--color-text-inverse)',
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1rem',
            px: 3,
            py: 2,
            borderRadius: 0,
            position: 'relative',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            ...(isActiveRoute(item.href) && {
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: 'var(--color-primary)',
              }
            })
          }}
        >
          {item.label}
          {item.hasDropdown && <KeyboardArrowDownIcon sx={{ ml: 1 }} />}
        </Button>
      ));
  };

  // Render mobile navigation items
  const renderMobileNavigationItems = () => {
    return navigationItems
      .filter(item => item.show)
      .map((item) => (
        <ListItem
          key={item.label}
          button
          onClick={() => handleNavigation(item.href)}
          sx={{
            backgroundColor: isActiveRoute(item.href) ? 'var(--color-primary)' : 'transparent',
            color: isActiveRoute(item.href) ? 'var(--color-text-inverse)' : 'var(--color-text)',
            '&:hover': {
              backgroundColor: isActiveRoute(item.href) ? 'var(--color-primary-hover)' : 'var(--color-hover)',
            }
          }}
        >
          <ListItemIcon sx={{ 
            color: isActiveRoute(item.href) ? 'var(--color-text-inverse)' : 'var(--color-primary)' 
          }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ));
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'var(--color-primary)',
          borderTop: '3px solid var(--color-secondary)',
          '& .MuiToolbar-root': {
            minHeight: 64
          }
        }}
      >
        <Toolbar>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: 'var(--color-text-inverse)',
              fontWeight: 'bold',
              ml: 2,
              textDecoration: 'none',
              '&:hover': {
                color: 'var(--color-text-inverse)',
              }
            }}
          >
            Fayda ID Checker
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              {renderNavigationItems()}
            </Box>
          )}

          {/* User Authentication Section */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            {token ? (
              <>
                {/* User Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={role || 'User'}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'var(--color-text-inverse)',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}
                  />
                  {user?.full_name && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--color-text-inverse)',
                        fontWeight: 'medium',
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                      {user.full_name}
                    </Typography>
                  )}
                </Box>

                {/* User Avatar */}
                <IconButton
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{ p: 0, ml: 2 }}
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={Boolean(userMenuAnchor)}
                >
                  <Avatar 
                    src={user?.avatar_url} 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      bgcolor: 'var(--color-secondary)',
                      border: '2px solid var(--color-text-inverse)'
                    }}
                    alt={user?.full_name ? `${user.full_name} avatar` : 'User avatar'}
                  >
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>

                {/* User Menu */}
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: 'var(--shadow-lg)',
                      '& .MuiMenuItem-root': {
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          bgcolor: 'var(--color-hover)',
                        }
                      }
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={() => setUserMenuAnchor(null)}
                    sx={{
                      color: 'var(--color-text)',
                      '&:hover': {
                        bgcolor: 'var(--color-hover)',
                      }
                    }}
                  >
                    <PersonIcon sx={{ mr: 2, color: 'var(--color-primary)' }} />
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: 'var(--color-danger)',
                      '&:hover': {
                        bgcolor: 'var(--color-danger-bg)',
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 2 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {/* Login/Register Buttons */}
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{
                    color: 'var(--color-text-inverse)',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    bgcolor: 'var(--color-text-inverse)',
                    color: 'var(--color-primary)',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  color: 'var(--color-text-inverse)',
                  ml: 1
                }}
                aria-label="Open mobile menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'var(--color-surface)',
            boxShadow: 'var(--shadow-xl)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="var(--color-primary)">
              Menu
            </Typography>
            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              sx={{ color: 'var(--color-text)' }}
              aria-label="Close mobile menu"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {renderMobileNavigationItems()}
          </List>
          
          {token && (
            <>
              <Divider sx={{ my: 2 }} />
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  color: 'var(--color-danger)',
                  '&:hover': {
                    bgcolor: 'var(--color-danger-bg)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'var(--color-danger)' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
