import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Breadcrumb = ({
  items = [],
  showHome = true,
  maxItems = 5,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Auto-generate breadcrumbs from current location if no items provided
  const generateBreadcrumbs = () => {
    if (items.length > 0) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        icon: <HomeIcon fontSize="small" />
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  const renderBreadcrumbItem = (item, index) => {
    const isLast = index === breadcrumbItems.length - 1;

    if (isLast) {
      return (
        <Typography
          key={item.href}
          color="text.primary"
          variant={isMobile ? "body2" : "body1"}
          sx={{
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
          aria-current="page"
        >
          {item.icon && item.icon}
          {item.label}
        </Typography>
      );
    }

    return (
      <Link
        key={item.href}
        component={RouterLink}
        to={item.href}
        color="text.secondary"
        variant={isMobile ? "body2" : "body1"}
        sx={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          '&:hover': {
            textDecoration: 'underline',
            color: 'primary.main'
          },
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
            borderRadius: 1
          }
        }}
        aria-label={`Navigate to ${item.label}`}
      >
        {item.icon && item.icon}
        {item.label}
      </Link>
    );
  };

  return (
    <Box
      sx={{
        py: 1,
        ...sx
      }}
      {...props}
    >
      <MuiBreadcrumbs
        separator={
          <NavigateNextIcon 
            fontSize="small" 
            sx={{ color: 'text.secondary' }}
            aria-hidden="true"
          />
        }
        maxItems={maxItems}
        itemsBeforeCollapse={1}
        itemsAfterCollapse={2}
        aria-label="Breadcrumb navigation"
      >
        {breadcrumbItems.map(renderBreadcrumbItem)}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
