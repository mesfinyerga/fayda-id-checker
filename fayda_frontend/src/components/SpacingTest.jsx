import React from 'react';
import { Box, Typography, Card, Button, TextField, Stack } from '@mui/material';
import {
  muiSpacing,
  tailwindSpacing,
  margin,
  padding,
  gap,
  layout,
  components,
  spacingUtils
} from '../utils/spacing';

const SpacingTest = () => {
  return (
    <Box sx={{ ...layout.container.standard }}>
      <Typography variant="h4" gutterBottom>
        Spacing Utilities Test
      </Typography>
      
      {/* Basic Spacing Functions */}
      <Card sx={{ ...layout.card.standard, ...margin.bottom(4) }}>
        <Typography variant="h6" gutterBottom>
          Basic Spacing Functions
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ ...padding.all(2), backgroundColor: 'primary.100' }}>
            MUI Spacing (8px base): {muiSpacing(2)} = 16px
          </Box>
          <Box sx={{ ...padding.all(2), backgroundColor: 'secondary.100' }}>
            Tailwind Spacing (4px base): {tailwindSpacing(4)} = 16px
          </Box>
        </Stack>
      </Card>

      {/* Margin Examples */}
      <Card sx={{ ...layout.card.standard, ...margin.bottom(4) }}>
        <Typography variant="h6" gutterBottom>
          Margin Examples
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ ...margin.all(2), backgroundColor: 'success.100', border: '1px solid' }}>
            All margins: 16px
          </Box>
          <Box sx={{ ...margin.x(2), backgroundColor: 'warning.100', border: '1px solid' }}>
            Horizontal margins: 16px left/right
          </Box>
          <Box sx={{ ...margin.y(2), backgroundColor: 'info.100', border: '1px solid' }}>
            Vertical margins: 16px top/bottom
          </Box>
          <Box sx={{ ...margin.top(3), backgroundColor: 'error.100', border: '1px solid' }}>
            Top margin only: 24px
          </Box>
        </Stack>
      </Card>

      {/* Padding Examples */}
      <Card sx={{ ...layout.card.standard, ...margin.bottom(4) }}>
        <Typography variant="h6" gutterBottom>
          Padding Examples
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ ...padding.all(2), backgroundColor: 'primary.50', border: '1px solid' }}>
            All padding: 16px
          </Box>
          <Box sx={{ ...padding.x(2), backgroundColor: 'secondary.50', border: '1px solid' }}>
            Horizontal padding: 16px left/right
          </Box>
          <Box sx={{ ...padding.y(2), backgroundColor: 'success.50', border: '1px solid' }}>
            Vertical padding: 16px top/bottom
          </Box>
          <Box sx={{ ...padding.left(3), backgroundColor: 'warning.50', border: '1px solid' }}>
            Left padding only: 24px
          </Box>
        </Stack>
      </Card>

      {/* Layout Examples */}
      <Card sx={{ ...layout.card.standard, ...margin.bottom(4) }}>
        <Typography variant="h6" gutterBottom>
          Layout Examples
        </Typography>
        <Stack spacing={3}>
          <Box sx={{ ...layout.section.standard, backgroundColor: 'primary.50', border: '1px solid' }}>
            Standard section spacing
          </Box>
          <Box sx={{ ...layout.section.compact, backgroundColor: 'secondary.50', border: '1px solid' }}>
            Compact section spacing
          </Box>
          <Box sx={{ ...layout.section.spacious, backgroundColor: 'success.50', border: '1px solid' }}>
            Spacious section spacing
          </Box>
        </Stack>
      </Card>

      {/* Component Spacing */}
      <Card sx={{ ...layout.card.standard, ...margin.bottom(4) }}>
        <Typography variant="h6" gutterBottom>
          Component Spacing
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Button Spacing
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button sx={{ ...components.button.standard }} variant="contained">
                Standard
              </Button>
              <Button sx={{ ...components.button.compact }} variant="outlined">
                Compact
              </Button>
              <Button sx={{ ...components.button.spacious }} variant="text">
                Spacious
              </Button>
            </Stack>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Input Spacing
            </Typography>
            <Stack spacing={2}>
              <TextField 
                label="Standard Input" 
                sx={{ ...components.input.standard }}
                fullWidth
              />
              <TextField 
                label="Compact Input" 
                sx={{ ...components.input.compact }}
                fullWidth
              />
            </Stack>
          </Box>
        </Stack>
      </Card>

      {/* Spacing Utils */}
      <Card sx={{ ...layout.card.standard, ...margin.bottom(4) }}>
        <Typography variant="h6" gutterBottom>
          Spacing Utilities
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Stack Layout
            </Typography>
            <Box sx={{ ...spacingUtils.stack(2), backgroundColor: 'primary.50', padding: 2 }}>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Item 1</Box>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Item 2</Box>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Item 3</Box>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Row Layout
            </Typography>
            <Box sx={{ ...spacingUtils.row(2), backgroundColor: 'secondary.50', padding: 2 }}>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Item 1</Box>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Item 2</Box>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Item 3</Box>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Grid Layout
            </Typography>
            <Box sx={{ ...spacingUtils.grid(3, 2), backgroundColor: 'success.50', padding: 2 }}>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Grid 1</Box>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Grid 2</Box>
              <Box sx={{ backgroundColor: 'white', padding: 1 }}>Grid 3</Box>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Center Layout
            </Typography>
            <Box sx={{ ...spacingUtils.center.both, height: 100, backgroundColor: 'warning.50', border: '1px solid' }}>
              Centered Content
            </Box>
          </Box>
        </Stack>
      </Card>

      {/* Responsive Spacing */}
      <Card sx={{ ...layout.card.standard, ...margin.bottom(4) }}>
        <Typography variant="h6" gutterBottom>
          Responsive Spacing
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Resize the browser window to see responsive spacing in action
        </Typography>
        <Box sx={{ 
          ...padding.responsive(2, 3, 4, 5, 6),
          backgroundColor: 'info.50',
          border: '1px solid',
          minHeight: 100
        }}>
          <Typography>
            This box has responsive padding that changes with screen size
          </Typography>
        </Box>
      </Card>

      {/* Form Spacing */}
      <Card sx={{ ...layout.card.standard }}>
        <Typography variant="h6" gutterBottom>
          Form Spacing
        </Typography>
        <Box component="form" sx={{ ...spacingUtils.stack(3) }}>
          <Box sx={{ ...layout.form.field }}>
            <TextField label="Name" fullWidth />
          </Box>
          <Box sx={{ ...layout.form.field }}>
            <TextField label="Email" fullWidth />
          </Box>
          <Box sx={{ ...layout.form.group }}>
            <Typography variant="subtitle2" gutterBottom>
              Contact Information
            </Typography>
            <Stack spacing={2}>
              <TextField label="Phone" fullWidth />
              <TextField label="Address" fullWidth multiline rows={2} />
            </Stack>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default SpacingTest;
