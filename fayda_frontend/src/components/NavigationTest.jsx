import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip, Button } from '@mui/material';
import Layout from './layout/Layout';
import PageHeader from './layout/PageHeader';
import Breadcrumb from './Breadcrumb';

const NavigationTest = () => {
  return (
    <Layout>
      <PageHeader
        title="Navigation System Test"
        subtitle="This page demonstrates the improved navigation system including skip links, mobile menu, breadcrumbs, and accessibility features."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Navigation Test', href: '/navigation-test' }
        ]}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined">
              Secondary Action
            </Button>
            <Button variant="contained">
              Primary Action
            </Button>
          </Stack>
        }
      />

      {/* Navigation Features */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Navigation Features
        </Typography>
        
        <Stack spacing={3}>
          {/* Skip Link */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skip Link
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Press Tab when the page loads to see the skip link appear. This allows keyboard users 
                to skip directly to the main content, improving accessibility.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Accessibility" color="primary" size="small" />
                <Chip label="Keyboard Navigation" color="primary" size="small" />
                <Chip label="WCAG Compliant" color="primary" size="small" />
              </Stack>
            </CardContent>
          </Card>

          {/* Mobile Menu */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mobile Menu
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                On mobile devices, the navigation collapses into a hamburger menu with a slide-out drawer. 
                The menu includes all navigation items with proper icons and touch targets.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Responsive" color="secondary" size="small" />
                <Chip label="Touch Friendly" color="secondary" size="small" />
                <Chip label="Slide-out Drawer" color="secondary" size="small" />
              </Stack>
            </CardContent>
          </Card>

          {/* Breadcrumbs */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Breadcrumb Navigation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Automatic breadcrumb generation based on the current route, with proper accessibility 
                and responsive behavior.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Breadcrumbs:
                </Typography>
                <Breadcrumb />
              </Box>
              
              <Stack direction="row" spacing={1}>
                <Chip label="Auto-generated" color="success" size="small" />
                <Chip label="Accessible" color="success" size="small" />
                <Chip label="Responsive" color="success" size="small" />
              </Stack>
            </CardContent>
          </Card>

          {/* Focus Management */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Focus Management
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Proper focus indicators and keyboard navigation support throughout the navigation system. 
                All interactive elements are keyboard accessible with visible focus states.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Focus Indicators" color="info" size="small" />
                <Chip label="Keyboard Accessible" color="info" size="small" />
                <Chip label="ARIA Labels" color="info" size="small" />
              </Stack>
            </CardContent>
          </Card>

          {/* ARIA Support */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ARIA Support
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Comprehensive ARIA labels and roles for screen reader compatibility. All navigation 
                elements have proper semantic markup and accessibility attributes.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Screen Reader" color="warning" size="small" />
                <Chip label="Semantic HTML" color="warning" size="small" />
                <Chip label="ARIA Attributes" color="warning" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Usage Examples */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Usage Examples
        </Typography>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Navigation Configuration
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: 'neutral.50',
                borderRadius: 1,
                fontSize: '0.875rem',
                overflow: 'auto'
              }}
            >
{`// Navigation items configuration
const navigationItems = [
  {
    label: 'Home',
    href: '/',
    icon: <HomeIcon />,
    show: true
  },
  {
    label: 'Admin Dashboard',
    href: '/dashboard',
    icon: <AdminIcon />,
    show: token && role === 'admin'
  },
  {
    label: 'Dashboard',
    href: '/user',
    icon: <DashboardIcon />,
    show: token && (role === 'client' || role === 'user')
  }
];

// Breadcrumb usage
<Breadcrumb 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Current Page', href: '/current' }
  ]}
/>`}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default NavigationTest;
