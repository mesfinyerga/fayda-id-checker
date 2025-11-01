import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Stack, Chip } from '@mui/material';
import Layout from './layout/Layout';
import PageHeader from './layout/PageHeader';
import Sidebar from './layout/Sidebar';
import Grid from './layout/Grid';

const LayoutTest = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        variant="permanent"
      />
      
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Layout>
          <PageHeader
            title="Layout System Test"
            subtitle="This page demonstrates the layout system components including Layout wrapper, PageHeader, Sidebar, and Grid system."
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Layout Test', href: '/layout-test' }
            ]}
            actions={
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  Toggle Sidebar
                </Button>
                <Button variant="contained">
                  Primary Action
                </Button>
              </Stack>
            }
          />

          {/* Grid System Examples */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Grid System Examples
            </Typography>
            
            {/* Basic Grid */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Grid (Responsive)
                </Typography>
                <Grid.Container spacing={2}>
                  <Grid.Item xs={12} sm={6} md={4}>
                    <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1, textAlign: 'center' }}>
                      Grid Item 1
                    </Box>
                  </Grid.Item>
                  <Grid.Item xs={12} sm={6} md={4}>
                    <Box sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', borderRadius: 1, textAlign: 'center' }}>
                      Grid Item 2
                    </Box>
                  </Grid.Item>
                  <Grid.Item xs={12} sm={6} md={4}>
                    <Box sx={{ p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 1, textAlign: 'center' }}>
                      Grid Item 3
                    </Box>
                  </Grid.Item>
                </Grid.Container>
              </CardContent>
            </Card>

            {/* Auto-fit Grid */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Auto-fit Grid
                </Typography>
                <Grid.AutoFit minWidth={250} spacing={2}>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        p: 2,
                        bgcolor: 'neutral.100',
                        borderRadius: 1,
                        textAlign: 'center',
                        minHeight: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Auto-fit Item {item}
                    </Box>
                  ))}
                </Grid.AutoFit>
              </CardContent>
            </Card>

            {/* Responsive Grid */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Responsive Grid
                </Typography>
                <Grid.Responsive>
                  {[1, 2, 3, 4].map((item) => (
                    <Grid.Item key={item}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: 'info.light',
                          color: 'white',
                          borderRadius: 1,
                          textAlign: 'center',
                          minHeight: 80
                        }}
                      >
                        Responsive Item {item}
                      </Box>
                    </Grid.Item>
                  ))}
                </Grid.Responsive>
              </CardContent>
            </Card>
          </Box>

          {/* Layout Features */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Layout Features
            </Typography>
            
            <Grid.Container spacing={3}>
              <Grid.Item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Layout Wrapper
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      The Layout component provides consistent page structure with responsive container, 
                      proper spacing, and background colors.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Responsive" color="primary" size="small" />
                      <Chip label="Consistent Spacing" color="primary" size="small" />
                      <Chip label="Background Colors" color="primary" size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid.Item>
              
              <Grid.Item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Page Header
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      PageHeader component provides consistent page titles, subtitles, breadcrumbs, 
                      and action buttons across the application.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Breadcrumbs" color="secondary" size="small" />
                      <Chip label="Action Buttons" color="secondary" size="small" />
                      <Chip label="Responsive" color="secondary" size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid.Item>
              
              <Grid.Item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sidebar Navigation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Sidebar component provides collapsible navigation with role-based menu items, 
                      expandable sections, and mobile responsiveness.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Collapsible" color="success" size="small" />
                      <Chip label="Role-based" color="success" size="small" />
                      <Chip label="Mobile Ready" color="success" size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid.Item>
              
              <Grid.Item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Grid System
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Comprehensive grid system with responsive breakpoints, auto-fit layouts, 
                      and masonry grid options for flexible content arrangement.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Responsive" color="info" size="small" />
                      <Chip label="Auto-fit" color="info" size="small" />
                      <Chip label="Masonry" color="info" size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid.Item>
            </Grid.Container>
          </Box>

          {/* Usage Examples */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Usage Examples
            </Typography>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Layout Structure
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
{`// Basic page structure
<Layout>
  <PageHeader
    title="Page Title"
    subtitle="Page description"
    breadcrumbs={[...]}
    actions={<Button>Action</Button>}
  />
  <Grid.Container spacing={2}>
    <Grid.Item xs={12} md={6}>
      Content
    </Grid.Item>
  </Grid.Container>
</Layout>`}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Layout>
      </Box>
    </Box>
  );
};

export default LayoutTest;
