import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  VerifiedUser as VerifiedUserIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({
  open = true,
  onToggle,
  variant = 'permanent',
  width = 240,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Navigation items configuration
  const navigationItems = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/dashboard',
      roles: ['admin', 'client']
    },
    {
      label: 'ID Verification',
      icon: <VerifiedUserIcon />,
      href: '/verification',
      roles: ['client']
    },
    {
      label: 'User Management',
      icon: <PeopleIcon />,
      href: '/users',
      roles: ['admin'],
      children: [
        {
          label: 'All Users',
          href: '/users',
          roles: ['admin']
        },
        {
          label: 'Register Client',
          href: '/register-client',
          roles: ['admin']
        }
      ]
    },
    {
      label: 'Payments',
      icon: <PaymentIcon />,
      href: '/payment',
      roles: ['admin', 'client']
    },
    {
      label: 'Analytics',
      icon: <AssessmentIcon />,
      href: '/analytics',
      roles: ['admin']
    },
    {
      label: 'Settings',
      icon: <SettingsIcon />,
      href: '/settings',
      roles: ['admin', 'client']
    }
  ];

  const handleToggleExpanded = (label) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavigationItem = (item, level = 0) => {
    const isExpanded = expandedItems.has(item.label);
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Box key={item.label}>
        <ListItem
          disablePadding
          sx={{
            pl: level * 2,
            '& .MuiListItemButton-root': {
              minHeight: 48,
              px: 2,
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText'
                }
              },
              ...(isActive && {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText'
                },
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              })
            }
          }}
        >
          <ListItemButton
            component={hasChildren ? 'div' : Link}
            to={hasChildren ? undefined : item.href}
            onClick={hasChildren ? () => handleToggleExpanded(item.label) : undefined}
            sx={{
              justifyContent: 'flex-start',
              gap: 2
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? 'primary.contrastText' : 'text.secondary'
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 600 : 400,
                    color: 'inherit'
                  }}
                >
                  {item.label}
                </Typography>
              }
            />
            
            {hasChildren && (
              <Box sx={{ ml: 'auto' }}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>

        {/* Render children */}
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderNavigationItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: width,
        backgroundColor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'neutral.200',
        ...sx
      }}
      {...props}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'neutral.200'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Fayda ID Checker
        </Typography>
        
        {variant === 'temporary' && (
          <IconButton onClick={onToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List>
          {navigationItems.map((item) => renderNavigationItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'neutral.200'
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center', display: 'block' }}
        >
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: width,
            boxSizing: 'border-box'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant={variant}
      open={open}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          border: 'none'
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
