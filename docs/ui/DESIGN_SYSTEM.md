# Design System

## Overview

This design system establishes the foundation for consistent, accessible, and professional UI components across the Fayda ID Checker application. It combines Material-UI's component library with custom design tokens and Tailwind CSS utilities.

## Design Tokens

### Color Palette

#### Primary Colors
```javascript
// MUI Theme Primary
primary: {
  main: '#1976d2',      // Primary blue
  light: '#42a5f5',     // Light blue
  dark: '#1565c0',      // Dark blue
  contrastText: '#ffffff'
}

// Custom Primary Variants
primary: {
  50: '#e3f2fd',   // Very light blue
  100: '#bbdefb',  // Light blue
  200: '#90caf9',  // Medium light blue
  300: '#64b5f6',  // Medium blue
  400: '#42a5f5',  // Blue
  500: '#2196f3',  // Primary blue
  600: '#1e88e5',  // Medium dark blue
  700: '#1976d2',  // Dark blue
  800: '#1565c0',  // Very dark blue
  900: '#0d47a1'   // Darkest blue
}
```

#### Neutral Colors
```javascript
// Grays
neutral: {
  50: '#fafafa',   // Background
  100: '#f5f5f5',  // Light background
  200: '#eeeeee',  // Border light
  300: '#e0e0e0',  // Border
  400: '#bdbdbd',  // Disabled
  500: '#9e9e9e',  // Text secondary
  600: '#757575',  // Text secondary
  700: '#616161',  // Text primary
  800: '#424242',  // Text primary
  900: '#212121'   // Text primary
}
```

#### Semantic Colors
```javascript
// Success
success: {
  main: '#2e7d32',      // Green
  light: '#4caf50',
  dark: '#1b5e20',
  contrastText: '#ffffff'
}

// Warning
warning: {
  main: '#ed6c02',      // Orange
  light: '#ff9800',
  dark: '#e65100',
  contrastText: '#ffffff'
}

// Error
error: {
  main: '#d32f2f',      // Red
  light: '#ef5350',
  dark: '#c62828',
  contrastText: '#ffffff'
}

// Info
info: {
  main: '#0288d1',      // Blue
  light: '#03a9f4',
  dark: '#01579b',
  contrastText: '#ffffff'
}
```

### Typography Scale

```javascript
// MUI Typography Variants
typography: {
  h1: {
    fontSize: '2.5rem',    // 40px
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.02em'
  },
  h2: {
    fontSize: '2rem',      // 32px
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em'
  },
  h3: {
    fontSize: '1.75rem',   // 28px
    fontWeight: 600,
    lineHeight: 1.3
  },
  h4: {
    fontSize: '1.5rem',    // 24px
    fontWeight: 600,
    lineHeight: 1.4
  },
  h5: {
    fontSize: '1.25rem',   // 20px
    fontWeight: 600,
    lineHeight: 1.4
  },
  h6: {
    fontSize: '1.125rem',  // 18px
    fontWeight: 600,
    lineHeight: 1.4
  },
  body1: {
    fontSize: '1rem',      // 16px
    fontWeight: 400,
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',  // 14px
    fontWeight: 400,
    lineHeight: 1.43
  },
  caption: {
    fontSize: '0.75rem',   // 12px
    fontWeight: 400,
    lineHeight: 1.33
  },
  button: {
    fontSize: '0.875rem',  // 14px
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: 'none'
  }
}
```

### Spacing Scale

```javascript
// MUI Spacing (8px base)
spacing: {
  0: 0,        // 0px
  1: 8,        // 8px
  2: 16,       // 16px
  3: 24,       // 24px
  4: 32,       // 32px
  5: 40,       // 40px
  6: 48,       // 48px
  7: 56,       // 56px
  8: 64,       // 64px
  9: 72,       // 72px
  10: 80       // 80px
}

// Tailwind Spacing (4px base)
// Use for fine-grained control
// 1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 20px, 6: 24px, 8: 32px, 10: 40px, 12: 48px, 16: 64px, 20: 80px
```

### Border Radius

```javascript
// Border Radius Scale
borderRadius: {
  none: 0,
  sm: '4px',      // Small components
  md: '8px',      // Cards, buttons
  lg: '12px',     // Large cards
  xl: '16px',     // Modals
  full: '9999px'  // Pills, avatars
}
```

### Elevation (Shadows)

```javascript
// MUI Shadows
shadows: [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
  '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
]
```

### Motion (Transitions)

```javascript
// Transition Durations
transitions: {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  }
}
```

## Component Specifications

### Button

```jsx
// Primary Button
<Button
  variant="contained"
  color="primary"
  size="medium"
  disabled={false}
  startIcon={<Icon />}
  endIcon={<Icon />}
  fullWidth={false}
  sx={{
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 500,
    minHeight: 40,
    px: 3
  }}
>
  Button Text
</Button>

// Secondary Button
<Button
  variant="outlined"
  color="primary"
  size="medium"
  sx={{
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 500,
    minHeight: 40,
    px: 3,
    borderWidth: 1.5
  }}
>
  Button Text
</Button>

// Text Button
<Button
  variant="text"
  color="primary"
  size="medium"
  sx={{
    textTransform: 'none',
    fontWeight: 500,
    minHeight: 40,
    px: 2
  }}
>
  Button Text
</Button>
```

### Input/TextField

```jsx
// Standard Input
<TextField
  label="Label"
  placeholder="Placeholder text"
  type="text"
  required={false}
  disabled={false}
  error={false}
  helperText="Helper text"
  fullWidth={true}
  size="medium"
  variant="outlined"
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '& fieldset': {
        borderColor: 'neutral.300'
      },
      '&:hover fieldset': {
        borderColor: 'primary.main'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: 2
      }
    }
  }}
/>

// Error State
<TextField
  label="Email"
  type="email"
  error={true}
  helperText="Please enter a valid email address"
  required={true}
  fullWidth={true}
  variant="outlined"
/>
```

### Select

```jsx
<FormControl fullWidth variant="outlined" size="medium">
  <InputLabel>Select Option</InputLabel>
  <Select
    value={value}
    onChange={handleChange}
    label="Select Option"
    sx={{
      borderRadius: 2,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'neutral.300'
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
        borderWidth: 2
      }
    }}
  >
    <MenuItem value="option1">Option 1</MenuItem>
    <MenuItem value="option2">Option 2</MenuItem>
  </Select>
</FormControl>
```

### Modal/Dialog

```jsx
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: 24,
      p: 0
    }
  }}
>
  <DialogTitle sx={{ pb: 1 }}>
    <Typography variant="h6" component="div">
      Modal Title
    </Typography>
  </DialogTitle>
  <DialogContent sx={{ pt: 1 }}>
    <Typography variant="body1">
      Modal content goes here
    </Typography>
  </DialogContent>
  <DialogActions sx={{ p: 3, pt: 1 }}>
    <Button onClick={handleClose} variant="text">
      Cancel
    </Button>
    <Button onClick={handleConfirm} variant="contained">
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

### Toast/Alert

```jsx
// Success Alert
<Alert
  severity="success"
  variant="filled"
  sx={{
    borderRadius: 2,
    '& .MuiAlert-icon': {
      fontSize: 20
    }
  }}
>
  Success message
</Alert>

// Error Alert
<Alert
  severity="error"
  variant="filled"
  sx={{
    borderRadius: 2,
    '& .MuiAlert-icon': {
      fontSize: 20
    }
  }}
>
  Error message
</Alert>

// Info Alert
<Alert
  severity="info"
  variant="outlined"
  sx={{
    borderRadius: 2,
    borderWidth: 1.5
  }}
>
  Information message
</Alert>
```

### Card

```jsx
<Card
  elevation={2}
  sx={{
    borderRadius: 3,
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: 4
    }
  }}
>
  <CardHeader
    title="Card Title"
    subheader="Card subtitle"
    sx={{
      pb: 1
    }}
  />
  <CardContent sx={{ pt: 1 }}>
    <Typography variant="body1">
      Card content
    </Typography>
  </CardContent>
  <CardActions sx={{ p: 3, pt: 1 }}>
    <Button size="small" variant="text">
      Action 1
    </Button>
    <Button size="small" variant="contained">
      Action 2
    </Button>
  </CardActions>
</Card>
```

### Table

```jsx
<TableContainer component={Paper} elevation={1}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: 600, backgroundColor: 'neutral.50' }}>
          Header 1
        </TableCell>
        <TableCell sx={{ fontWeight: 600, backgroundColor: 'neutral.50' }}>
          Header 2
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow hover>
        <TableCell>Data 1</TableCell>
        <TableCell>Data 2</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

### Tabs

```jsx
<Tabs
  value={value}
  onChange={handleChange}
  variant="fullWidth"
  sx={{
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 500,
      minHeight: 48
    },
    '& .Mui-selected': {
      color: 'primary.main'
    }
  }}
>
  <Tab label="Tab 1" />
  <Tab label="Tab 2" />
</Tabs>
```

### Tooltip

```jsx
<Tooltip
  title="Tooltip text"
  placement="top"
  arrow
  sx={{
    '& .MuiTooltip-tooltip': {
      backgroundColor: 'neutral.800',
      color: 'white',
      fontSize: '0.875rem',
      borderRadius: 1,
      px: 2,
      py: 1
    },
    '& .MuiTooltip-arrow': {
      color: 'neutral.800'
    }
  }}
>
  <IconButton>
    <InfoIcon />
  </IconButton>
</Tooltip>
```

### Navbar

```jsx
<AppBar
  position="static"
  elevation={1}
  sx={{
    backgroundColor: 'primary.main',
    '& .MuiToolbar-root': {
      minHeight: 64
    }
  }}
>
  <Toolbar>
    <Typography
      variant="h6"
      component={Link}
      to="/"
      sx={{
        flexGrow: 1,
        textDecoration: 'none',
        color: 'white',
        fontWeight: 600
      }}
    >
      Fayda ID Checker
    </Typography>
    {/* Navigation items */}
  </Toolbar>
</AppBar>
```

### Sidebar

```jsx
<Drawer
  variant="permanent"
  sx={{
    width: 240,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 240,
      boxSizing: 'border-box',
      borderRight: '1px solid',
      borderColor: 'neutral.200',
      backgroundColor: 'neutral.50'
    }
  }}
>
  <List>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
  </List>
</Drawer>
```

### PageHeader

```jsx
<Box
  sx={{
    py: 4,
    px: 3,
    backgroundColor: 'white',
    borderBottom: '1px solid',
    borderColor: 'neutral.200'
  }}
>
  <Typography variant="h4" gutterBottom>
    Page Title
  </Typography>
  <Typography variant="body1" color="text.secondary">
    Page description or breadcrumbs
  </Typography>
</Box>
```

### EmptyState

```jsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 8,
    px: 3,
    textAlign: 'center'
  }}
>
  <Box
    sx={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      backgroundColor: 'neutral.100',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: 3
    }}
  >
    <Icon sx={{ fontSize: 40, color: 'neutral.500' }} />
  </Box>
  <Typography variant="h6" gutterBottom>
    No Data Found
  </Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
    There are no items to display at the moment.
  </Typography>
  <Button variant="contained">
    Add New Item
  </Button>
</Box>
```

## Interaction Patterns

### Forms

#### Validation States
```jsx
// Loading State
<TextField
  label="Email"
  disabled={true}
  InputProps={{
    endAdornment: <CircularProgress size={20} />
  }}
/>

// Error State
<TextField
  label="Email"
  error={true}
  helperText="Please enter a valid email address"
  InputProps={{
    endAdornment: <ErrorIcon color="error" />
  }}
/>

// Success State
<TextField
  label="Email"
  InputProps={{
    endAdornment: <CheckCircleIcon color="success" />
  }}
/>
```

#### Form Layout
```jsx
<Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
  <Stack spacing={3}>
    <TextField
      label="Full Name"
      required
      fullWidth
    />
    <TextField
      label="Email"
      type="email"
      required
      fullWidth
    />
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Button variant="outlined" onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  </Stack>
</Box>
```

### Error Handling

#### Error Boundaries
```jsx
// Global Error Boundary
<ErrorBoundary
  fallback={
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Something went wrong
      </Typography>
      <Button variant="contained" onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </Box>
  }
>
  {children}
</ErrorBoundary>
```

#### API Error Handling
```jsx
// Error State Component
{error && (
  <Alert
    severity="error"
    action={
      <Button color="inherit" size="small" onClick={handleRetry}>
        Retry
      </Button>
    }
  >
    {error.message}
  </Alert>
)}
```

### Loading States

#### Skeleton Loading
```jsx
// Table Skeleton
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {[1, 2, 3].map((item) => (
        <TableRow key={item}>
          <TableCell><Skeleton /></TableCell>
          <TableCell><Skeleton /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

#### Button Loading
```jsx
<Button
  variant="contained"
  disabled={loading}
  startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
>
  {loading ? 'Saving...' : 'Save'}
</Button>
```

### Pagination

```jsx
<TablePagination
  component="div"
  count={totalCount}
  page={page}
  onPageChange={handlePageChange}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleRowsPerPageChange}
  rowsPerPageOptions={[10, 25, 50]}
  sx={{
    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
      fontSize: '0.875rem'
    }
  }}
/>
```

### Search & Filters

```jsx
<Box sx={{ mb: 3 }}>
  <Stack direction="row" spacing={2} alignItems="center">
    <TextField
      placeholder="Search..."
      size="small"
      InputProps={{
        startAdornment: <SearchIcon sx={{ color: 'neutral.500', mr: 1 }} />
      }}
      sx={{ minWidth: 200 }}
    />
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Status</InputLabel>
      <Select label="Status">
        <MenuItem value="">All</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
      </Select>
    </FormControl>
    <Button variant="outlined" size="small">
      Clear Filters
    </Button>
  </Stack>
</Box>
```

## Accessibility Rules

### Focus Management
- All interactive elements must be keyboard accessible
- Focus order should follow logical reading order
- Focus indicators must be visible (2px solid primary color)
- Skip links for main content areas

### ARIA Usage
```jsx
// Proper labeling
<TextField
  label="Email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>

// Error association
{hasError && (
  <Typography id="email-error" color="error" variant="caption">
    Please enter a valid email
  </Typography>
)}

// Button with proper ARIA
<IconButton
  aria-label="Delete item"
  aria-describedby="delete-description"
>
  <DeleteIcon />
</IconButton>
```

### Keyboard Shortcuts
- `Tab` - Navigate between interactive elements
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals and dialogs
- `Arrow keys` - Navigate select options and tabs

### Reduced Motion
```jsx
// Respect user preferences
<Box
  sx={{
    transition: 'transform 0.3s ease',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none'
    }
  }}
>
  Content
</Box>
```

## Brand Guidelines

### Tone & Voice
- **Professional**: Clear, concise, and trustworthy
- **Inclusive**: Accessible to all users regardless of ability
- **Helpful**: Provide clear guidance and feedback
- **Secure**: Emphasize data protection and privacy

### Visual Density
- **Comfortable**: Adequate spacing between elements
- **Scannable**: Clear visual hierarchy
- **Efficient**: Information-dense but not overwhelming

### Dark Mode Rules
```jsx
// Dark mode color adjustments
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3'
    }
  }
});
```

## Tailwind Integration

### Custom Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1'
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121'
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px'
      }
    }
  },
  plugins: []
};
```

### Usage Examples
```jsx
// Combining MUI with Tailwind
<Box
  sx={{
    backgroundColor: 'primary.main',
    borderRadius: 2
  }}
  className="p-4 shadow-lg hover:shadow-xl transition-shadow"
>
  <Typography variant="h6" className="text-white mb-2">
    Card Title
  </Typography>
  <Typography variant="body2" className="text-white/80">
    Card content
  </Typography>
</Box>
```

---

*Design System v1.0 - Last updated: 2024-12-19*
