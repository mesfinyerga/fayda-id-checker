import { createTheme } from '@mui/material/styles';
import { designTokens, cssVariables } from './designTokens';

// Create MUI theme using design tokens
const theme = createTheme({
  palette: {
    mode: 'light',
    
    // Primary colors
    primary: {
      main: designTokens.colors.primary[500],
      light: designTokens.colors.primary[400],
      dark: designTokens.colors.primary[600],
      contrastText: designTokens.colors.white,
      50: designTokens.colors.primary[50],
      100: designTokens.colors.primary[100],
      200: designTokens.colors.primary[200],
      300: designTokens.colors.primary[300],
      400: designTokens.colors.primary[400],
      500: designTokens.colors.primary[500],
      600: designTokens.colors.primary[600],
      700: designTokens.colors.primary[700],
      800: designTokens.colors.primary[800],
      900: designTokens.colors.primary[900],
    },

    // Secondary colors
    secondary: {
      main: designTokens.colors.secondary[500],
      light: designTokens.colors.secondary[400],
      dark: designTokens.colors.secondary[600],
      contrastText: designTokens.colors.white,
      50: designTokens.colors.secondary[50],
      100: designTokens.colors.secondary[100],
      200: designTokens.colors.secondary[200],
      300: designTokens.colors.secondary[300],
      400: designTokens.colors.secondary[400],
      500: designTokens.colors.secondary[500],
      600: designTokens.colors.secondary[600],
      700: designTokens.colors.secondary[700],
      800: designTokens.colors.secondary[800],
      900: designTokens.colors.secondary[900],
    },

    // Success colors
    success: {
      main: designTokens.colors.success[500],
      light: designTokens.colors.success[400],
      dark: designTokens.colors.success[600],
      contrastText: designTokens.colors.white,
      50: designTokens.colors.success[50],
      100: designTokens.colors.success[100],
      200: designTokens.colors.success[200],
      300: designTokens.colors.success[300],
      400: designTokens.colors.success[400],
      500: designTokens.colors.success[500],
      600: designTokens.colors.success[600],
      700: designTokens.colors.success[700],
      800: designTokens.colors.success[800],
      900: designTokens.colors.success[900],
    },

    // Warning colors
    warning: {
      main: designTokens.colors.warning[500],
      light: designTokens.colors.warning[400],
      dark: designTokens.colors.warning[600],
      contrastText: designTokens.colors.white,
      50: designTokens.colors.warning[50],
      100: designTokens.colors.warning[100],
      200: designTokens.colors.warning[200],
      300: designTokens.colors.warning[300],
      400: designTokens.colors.warning[400],
      500: designTokens.colors.warning[500],
      600: designTokens.colors.warning[600],
      700: designTokens.colors.warning[700],
      800: designTokens.colors.warning[800],
      900: designTokens.colors.warning[900],
    },

    // Error colors
    error: {
      main: designTokens.colors.danger[500],
      light: designTokens.colors.danger[400],
      dark: designTokens.colors.danger[600],
      contrastText: designTokens.colors.white,
      50: designTokens.colors.danger[50],
      100: designTokens.colors.danger[100],
      200: designTokens.colors.danger[200],
      300: designTokens.colors.danger[300],
      400: designTokens.colors.danger[400],
      500: designTokens.colors.danger[500],
      600: designTokens.colors.danger[600],
      700: designTokens.colors.danger[700],
      800: designTokens.colors.danger[800],
      900: designTokens.colors.danger[900],
    },

    // Info colors
    info: {
      main: designTokens.colors.info[500],
      light: designTokens.colors.info[400],
      dark: designTokens.colors.info[600],
      contrastText: designTokens.colors.white,
      50: designTokens.colors.info[50],
      100: designTokens.colors.info[100],
      200: designTokens.colors.info[200],
      300: designTokens.colors.info[300],
      400: designTokens.colors.info[400],
      500: designTokens.colors.info[500],
      600: designTokens.colors.info[600],
      700: designTokens.colors.info[700],
      800: designTokens.colors.info[800],
      900: designTokens.colors.info[900],
    },

    // Background colors
    background: {
      default: designTokens.colors.gray[50],
      paper: designTokens.colors.white,
    },

    // Text colors
    text: {
      primary: designTokens.colors.gray[900],
      secondary: designTokens.colors.gray[600],
      disabled: designTokens.colors.gray[400],
    },

    // Divider color
    divider: designTokens.colors.gray[200],

    // Common colors
    common: {
      black: designTokens.colors.black,
      white: designTokens.colors.white,
    },

    // Grey scale
    grey: designTokens.colors.gray,
  },

  // Typography
  typography: {
    fontFamily: designTokens.typography.fontFamily.sans.join(','),
    
    // Typography variants
    h1: {
      fontSize: designTokens.typography.fontSize['4xl'],
      fontWeight: designTokens.typography.fontWeight.bold,
      lineHeight: designTokens.typography.lineHeight.tight,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: designTokens.typography.fontSize['3xl'],
      fontWeight: designTokens.typography.fontWeight.bold,
      lineHeight: designTokens.typography.lineHeight.tight,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: designTokens.typography.fontSize['2xl'],
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.snug,
    },
    h4: {
      fontSize: designTokens.typography.fontSize.xl,
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.snug,
    },
    h5: {
      fontSize: designTokens.typography.fontSize.lg,
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.snug,
    },
    h6: {
      fontSize: designTokens.typography.fontSize.base,
      fontWeight: designTokens.typography.fontWeight.semibold,
      lineHeight: designTokens.typography.lineHeight.snug,
    },
    body1: {
      fontSize: designTokens.typography.fontSize.base,
      fontWeight: designTokens.typography.fontWeight.normal,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    body2: {
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.normal,
      lineHeight: designTokens.typography.lineHeight.normal,
    },
    caption: {
      fontSize: designTokens.typography.fontSize.xs,
      fontWeight: designTokens.typography.fontWeight.normal,
      lineHeight: designTokens.typography.lineHeight.tight,
    },
    button: {
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: designTokens.typography.fontWeight.medium,
      lineHeight: designTokens.typography.lineHeight.none,
      textTransform: 'none',
    },
    overline: {
      fontSize: designTokens.typography.fontSize.xs,
      fontWeight: designTokens.typography.fontWeight.medium,
      lineHeight: designTokens.typography.lineHeight.tight,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },

  // Spacing
  spacing: (factor) => `${8 * factor}px`,

  // Border radius
  shape: {
    borderRadius: parseInt(designTokens.borderRadius.md),
  },

  // Shadows
  shadows: [
    'none',
    designTokens.shadows.sm,
    designTokens.shadows.base,
    designTokens.shadows.md,
    designTokens.shadows.lg,
    designTokens.shadows.xl,
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
    designTokens.shadows['2xl'],
  ],

  // Breakpoints
  breakpoints: {
    values: {
      xs: parseInt(designTokens.breakpoints.xs),
      sm: parseInt(designTokens.breakpoints.sm),
      md: parseInt(designTokens.breakpoints.md),
      lg: parseInt(designTokens.breakpoints.lg),
      xl: parseInt(designTokens.breakpoints.xl),
    },
  },

  // Z-index
  zIndex: {
    mobileStepper: designTokens.zIndex.dropdown,
    fab: designTokens.zIndex.dropdown + 50,
    speedDial: designTokens.zIndex.dropdown + 50,
    appBar: designTokens.zIndex.sticky,
    drawer: designTokens.zIndex.overlay,
    modal: designTokens.zIndex.modal,
    snackbar: designTokens.zIndex.toast,
    tooltip: designTokens.zIndex.tooltip,
  },

  // Component overrides for accessibility and consistency
  components: {
    // Button component
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(designTokens.borderRadius.md),
          textTransform: 'none',
          fontWeight: designTokens.typography.fontWeight.medium,
          boxShadow: designTokens.shadows.sm,
          '&:hover': {
            boxShadow: designTokens.shadows.md,
          },
          '&:focus': {
            outline: '2px solid var(--color-focus)',
            outlineOffset: '2px',
            boxShadow: '0 0 0 4px var(--color-focus-ring)',
          },
          '&:disabled': {
            backgroundColor: designTokens.colors.gray[100],
            color: designTokens.colors.gray[400],
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: designTokens.shadows.md,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: designTokens.colors.gray[100],
          },
        },
      },
    },

    // TextField component
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: parseInt(designTokens.borderRadius.md),
            '& fieldset': {
              borderColor: designTokens.colors.gray[300],
            },
            '&:hover fieldset': {
              borderColor: designTokens.colors.primary[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: designTokens.colors.primary[500],
              borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
              borderColor: designTokens.colors.danger[500],
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: designTokens.colors.primary[500],
            },
            '&.Mui-error': {
              color: designTokens.colors.danger[500],
            },
          },
        },
      },
    },

    // Card component
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(designTokens.borderRadius.lg),
          boxShadow: designTokens.shadows.base,
          '&:hover': {
            boxShadow: designTokens.shadows.md,
          },
        },
      },
    },

    // Paper component
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(designTokens.borderRadius.md),
        },
        elevation1: {
          boxShadow: designTokens.shadows.base,
        },
        elevation2: {
          boxShadow: designTokens.shadows.md,
        },
        elevation3: {
          boxShadow: designTokens.shadows.lg,
        },
        elevation4: {
          boxShadow: designTokens.shadows.xl,
        },
        elevation5: {
          boxShadow: designTokens.shadows['2xl'],
        },
      },
    },

    // Chip component
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(designTokens.borderRadius.full),
          fontWeight: designTokens.typography.fontWeight.medium,
        },
        colorPrimary: {
          backgroundColor: designTokens.colors.primary[500],
          color: designTokens.colors.white,
          '&:hover': {
            backgroundColor: designTokens.colors.primary[600],
          },
        },
        colorSecondary: {
          backgroundColor: designTokens.colors.secondary[500],
          color: designTokens.colors.white,
          '&:hover': {
            backgroundColor: designTokens.colors.secondary[600],
          },
        },
        colorSuccess: {
          backgroundColor: designTokens.colors.success[500],
          color: designTokens.colors.white,
          '&:hover': {
            backgroundColor: designTokens.colors.success[600],
          },
        },
        colorWarning: {
          backgroundColor: designTokens.colors.warning[500],
          color: designTokens.colors.white,
          '&:hover': {
            backgroundColor: designTokens.colors.warning[600],
          },
        },
        colorError: {
          backgroundColor: designTokens.colors.danger[500],
          color: designTokens.colors.white,
          '&:hover': {
            backgroundColor: designTokens.colors.danger[600],
          },
        },
      },
    },

    // Alert component
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: parseInt(designTokens.borderRadius.md),
          fontWeight: designTokens.typography.fontWeight.medium,
        },
        standardInfo: {
          backgroundColor: designTokens.colors.info[50],
          color: designTokens.colors.info[700],
          '& .MuiAlert-icon': {
            color: designTokens.colors.info[500],
          },
        },
        standardSuccess: {
          backgroundColor: designTokens.colors.success[50],
          color: designTokens.colors.success[700],
          '& .MuiAlert-icon': {
            color: designTokens.colors.success[500],
          },
        },
        standardWarning: {
          backgroundColor: designTokens.colors.warning[50],
          color: designTokens.colors.warning[700],
          '& .MuiAlert-icon': {
            color: designTokens.colors.warning[500],
          },
        },
        standardError: {
          backgroundColor: designTokens.colors.danger[50],
          color: designTokens.colors.danger[700],
          '& .MuiAlert-icon': {
            color: designTokens.colors.danger[500],
          },
        },
      },
    },

    // AppBar component
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.shadows.base,
        },
      },
    },

    // Dialog component
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: parseInt(designTokens.borderRadius.xl),
          boxShadow: designTokens.shadows['2xl'],
        },
      },
    },

    // Menu component
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: parseInt(designTokens.borderRadius.md),
          boxShadow: designTokens.shadows.lg,
        },
      },
    },

    // Tooltip component
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: designTokens.colors.gray[800],
          color: designTokens.colors.white,
          borderRadius: parseInt(designTokens.borderRadius.base),
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.normal,
        },
        arrow: {
          color: designTokens.colors.gray[800],
        },
      },
    },

    // Focus styles for all interactive elements
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: '2px solid var(--color-focus)',
            outlineOffset: '2px',
          },
        },
      },
    },
  },
});

export default theme;
