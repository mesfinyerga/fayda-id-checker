import React from 'react';
import { Box, Typography, Button, Card, CardContent, TextField, Alert } from '@mui/material';
import { sxPatterns } from '../utils/themeUtils';

const DesignTokenTest = () => {
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Design Token System Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        This component demonstrates the design token system integration with MUI and Tailwind.
      </Typography>

      {/* Typography Scale */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Typography Scale
          </Typography>
          <Typography variant="h1" sx={{ mb: 2 }}>Heading 1</Typography>
          <Typography variant="h2" sx={{ mb: 2 }}>Heading 2</Typography>
          <Typography variant="h3" sx={{ mb: 2 }}>Heading 3</Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>Heading 4</Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>Heading 5</Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>Heading 6</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>Body 1 - Main text content</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Body 2 - Secondary text content</Typography>
          <Typography variant="caption">Caption - Small helper text</Typography>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Color Palette
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}>
              Primary Main
            </Box>
            <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
              Primary Light
            </Box>
            <Box sx={{ p: 2, bgcolor: 'primary.dark', color: 'primary.contrastText', borderRadius: 1 }}>
              Primary Dark
            </Box>
            <Box sx={{ p: 2, bgcolor: 'success.main', color: 'success.contrastText', borderRadius: 1 }}>
              Success
            </Box>
            <Box sx={{ p: 2, bgcolor: 'warning.main', color: 'warning.contrastText', borderRadius: 1 }}>
              Warning
            </Box>
            <Box sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText', borderRadius: 1 }}>
              Error
            </Box>
            <Box sx={{ p: 2, bgcolor: 'info.main', color: 'info.contrastText', borderRadius: 1 }}>
              Info
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Button Variants */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Button Variants
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary">
              Primary Contained
            </Button>
            <Button variant="outlined" color="primary">
              Primary Outlined
            </Button>
            <Button variant="text" color="primary">
              Primary Text
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="contained" color="success">
              Success
            </Button>
            <Button variant="contained" color="error">
              Error
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Form Components
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
            <TextField
              label="Standard Input"
              placeholder="Enter text here"
              fullWidth
            />
            <TextField
              label="Required Input"
              required
              fullWidth
            />
            <TextField
              label="Error Input"
              error
              helperText="This field has an error"
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      {/* Alert Components */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Alert Components
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success">
              This is a success alert
            </Alert>
            <Alert severity="info">
              This is an info alert
            </Alert>
            <Alert severity="warning">
              This is a warning alert
            </Alert>
            <Alert severity="error">
              This is an error alert
            </Alert>
          </Box>
        </CardContent>
      </Card>

      {/* Spacing and Layout */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Spacing and Layout
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ p: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
              p: 1 (8px)
            </Box>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
              p: 2 (16px)
            </Box>
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
              p: 3 (24px)
            </Box>
            <Box sx={{ p: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
              p: 4 (32px)
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Custom SX Patterns */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Custom SX Patterns
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={sxPatterns.card}>
              <CardContent>
                <Typography variant="h6">Card with Custom Pattern</Typography>
                <Typography variant="body2">
                  This card uses the custom card pattern from sxPatterns.
                </Typography>
              </CardContent>
            </Card>
            <Button sx={sxPatterns.button}>
              Button with Custom Pattern
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tailwind Integration */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Tailwind Integration
          </Typography>
          <Box className="flex flex-col gap-4">
            <div className="p-4 bg-primary-main text-white rounded-lg">
              Tailwind Primary Color
            </div>
            <div className="p-4 bg-neutral-100 text-neutral-900 rounded-lg">
              Tailwind Neutral Color
            </div>
            <div className="p-4 bg-success-main text-white rounded-lg">
              Tailwind Success Color
            </div>
            <div className="shadow-card p-4 rounded-lg">
              Tailwind Custom Shadow
            </div>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DesignTokenTest;
