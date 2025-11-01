// Design Token Utilities
// Provides easy access to design tokens and ensures consistent usage

import { designTokens, cssVariables } from '../theme/designTokens';

// Get token value by path (e.g., 'colors.primary.500')
export const getToken = (path) => {
  const keys = path.split('.');
  let value = designTokens;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Token not found: ${path}`);
      return undefined;
    }
  }
  
  return value;
};

// Get CSS variable
export const getCSSVariable = (name) => {
  return `var(${name})`;
};

// Color utilities
export const colors = {
  // Primary colors
  primary: {
    50: getToken('colors.primary.50'),
    100: getToken('colors.primary.100'),
    200: getToken('colors.primary.200'),
    300: getToken('colors.primary.300'),
    400: getToken('colors.primary.400'),
    500: getToken('colors.primary.500'),
    600: getToken('colors.primary.600'),
    700: getToken('colors.primary.700'),
    800: getToken('colors.primary.800'),
    900: getToken('colors.primary.900'),
  },

  // Secondary colors
  secondary: {
    50: getToken('colors.secondary.50'),
    100: getToken('colors.secondary.100'),
    200: getToken('colors.secondary.200'),
    300: getToken('colors.secondary.300'),
    400: getToken('colors.secondary.400'),
    500: getToken('colors.secondary.500'),
    600: getToken('colors.secondary.600'),
    700: getToken('colors.secondary.700'),
    800: getToken('colors.secondary.800'),
    900: getToken('colors.secondary.900'),
  },

  // Success colors
  success: {
    50: getToken('colors.success.50'),
    100: getToken('colors.success.100'),
    200: getToken('colors.success.200'),
    300: getToken('colors.success.300'),
    400: getToken('colors.success.400'),
    500: getToken('colors.success.500'),
    600: getToken('colors.success.600'),
    700: getToken('colors.success.700'),
    800: getToken('colors.success.800'),
    900: getToken('colors.success.900'),
  },

  // Warning colors
  warning: {
    50: getToken('colors.warning.50'),
    100: getToken('colors.warning.100'),
    200: getToken('colors.warning.200'),
    300: getToken('colors.warning.300'),
    400: getToken('colors.warning.400'),
    500: getToken('colors.warning.500'),
    600: getToken('colors.warning.600'),
    700: getToken('colors.warning.700'),
    800: getToken('colors.warning.800'),
    900: getToken('colors.warning.900'),
  },

  // Danger colors
  danger: {
    50: getToken('colors.danger.50'),
    100: getToken('colors.danger.100'),
    200: getToken('colors.danger.200'),
    300: getToken('colors.danger.300'),
    400: getToken('colors.danger.400'),
    500: getToken('colors.danger.500'),
    600: getToken('colors.danger.600'),
    700: getToken('colors.danger.700'),
    800: getToken('colors.danger.800'),
    900: getToken('colors.danger.900'),
  },

  // Info colors
  info: {
    50: getToken('colors.info.50'),
    100: getToken('colors.info.100'),
    200: getToken('colors.info.200'),
    300: getToken('colors.info.300'),
    400: getToken('colors.info.400'),
    500: getToken('colors.info.500'),
    600: getToken('colors.info.600'),
    700: getToken('colors.info.700'),
    800: getToken('colors.info.800'),
    900: getToken('colors.info.900'),
  },

  // Gray colors
  gray: {
    50: getToken('colors.gray.50'),
    100: getToken('colors.gray.100'),
    200: getToken('colors.gray.200'),
    300: getToken('colors.gray.300'),
    400: getToken('colors.gray.400'),
    500: getToken('colors.gray.500'),
    600: getToken('colors.gray.600'),
    700: getToken('colors.gray.700'),
    800: getToken('colors.gray.800'),
    900: getToken('colors.gray.900'),
  },

  // Ethiopian colors
  ethiopian: getToken('colors.ethiopian'),
};

// Semantic color utilities
export const semanticColors = {
  // Background colors
  bg: getCSSVariable('--color-bg'),
  bgAlt: getCSSVariable('--color-bg-alt'),
  surface: getCSSVariable('--color-surface'),
  surfaceHover: getCSSVariable('--color-surface-hover'),

  // Text colors
  text: getCSSVariable('--color-text'),
  textMuted: getCSSVariable('--color-text-muted'),
  textDisabled: getCSSVariable('--color-text-disabled'),
  textInverse: getCSSVariable('--color-text-inverse'),

  // Border colors
  border: getCSSVariable('--color-border'),
  borderFocus: getCSSVariable('--color-border-focus'),
  borderError: getCSSVariable('--color-border-error'),

  // Status colors
  info: getCSSVariable('--color-info'),
  infoBg: getCSSVariable('--color-info-bg'),
  success: getCSSVariable('--color-success'),
  successBg: getCSSVariable('--color-success-bg'),
  warning: getCSSVariable('--color-warning'),
  warningBg: getCSSVariable('--color-warning-bg'),
  danger: getCSSVariable('--color-danger'),
  dangerBg: getCSSVariable('--color-danger-bg'),

  // Action colors
  primary: getCSSVariable('--color-primary'),
  primaryHover: getCSSVariable('--color-primary-hover'),
  primaryContrast: getCSSVariable('--color-primary-contrast'),
  secondary: getCSSVariable('--color-secondary'),
  secondaryHover: getCSSVariable('--color-secondary-hover'),
  secondaryContrast: getCSSVariable('--color-secondary-contrast'),

  // Interactive states
  focus: getCSSVariable('--color-focus'),
  focusRing: getCSSVariable('--color-focus-ring'),
  hover: getCSSVariable('--color-hover'),
  active: getCSSVariable('--color-active'),
  disabled: getCSSVariable('--color-disabled'),
  disabledText: getCSSVariable('--color-disabled-text'),
};

// Typography utilities
export const typography = {
  // Font sizes
  fontSize: {
    xs: getCSSVariable('--font-size-xs'),
    sm: getCSSVariable('--font-size-sm'),
    base: getCSSVariable('--font-size-base'),
    lg: getCSSVariable('--font-size-lg'),
    xl: getCSSVariable('--font-size-xl'),
    '2xl': getCSSVariable('--font-size-2xl'),
    '3xl': getCSSVariable('--font-size-3xl'),
    '4xl': getCSSVariable('--font-size-4xl'),
    '5xl': getCSSVariable('--font-size-5xl'),
  },

  // Line heights
  lineHeight: {
    none: getCSSVariable('--line-height-none'),
    tight: getCSSVariable('--line-height-tight'),
    snug: getCSSVariable('--line-height-snug'),
    normal: getCSSVariable('--line-height-normal'),
    relaxed: getCSSVariable('--line-height-relaxed'),
    loose: getCSSVariable('--line-height-loose'),
  },

  // Font weights
  fontWeight: {
    light: getCSSVariable('--font-weight-light'),
    normal: getCSSVariable('--font-weight-normal'),
    medium: getCSSVariable('--font-weight-medium'),
    semibold: getCSSVariable('--font-weight-semibold'),
    bold: getCSSVariable('--font-weight-bold'),
    extrabold: getCSSVariable('--font-weight-extrabold'),
  },
};

// Spacing utilities
export const spacing = {
  0: getCSSVariable('--space-0'),
  1: getCSSVariable('--space-1'),
  2: getCSSVariable('--space-2'),
  3: getCSSVariable('--space-3'),
  4: getCSSVariable('--space-4'),
  5: getCSSVariable('--space-5'),
  6: getCSSVariable('--space-6'),
  8: getCSSVariable('--space-8'),
  10: getCSSVariable('--space-10'),
  12: getCSSVariable('--space-12'),
  16: getCSSVariable('--space-16'),
  20: getCSSVariable('--space-20'),
  24: getCSSVariable('--space-24'),
};

// Border radius utilities
export const borderRadius = {
  none: getCSSVariable('--radius-none'),
  sm: getCSSVariable('--radius-sm'),
  base: getCSSVariable('--radius-base'),
  md: getCSSVariable('--radius-md'),
  lg: getCSSVariable('--radius-lg'),
  xl: getCSSVariable('--radius-xl'),
  '2xl': getCSSVariable('--radius-2xl'),
  '3xl': getCSSVariable('--radius-3xl'),
  full: getCSSVariable('--radius-full'),
};

// Shadow utilities
export const shadows = {
  none: getCSSVariable('--shadow-none'),
  sm: getCSSVariable('--shadow-sm'),
  base: getCSSVariable('--shadow-base'),
  md: getCSSVariable('--shadow-md'),
  lg: getCSSVariable('--shadow-lg'),
  xl: getCSSVariable('--shadow-xl'),
  '2xl': getCSSVariable('--shadow-2xl'),
  inner: getCSSVariable('--shadow-inner'),
};

// MUI sx prop helpers
export const sx = {
  // Color helpers
  colors: {
    primary: (shade = 500) => ({ color: colors.primary[shade] }),
    secondary: (shade = 500) => ({ color: colors.secondary[shade] }),
    success: (shade = 500) => ({ color: colors.success[shade] }),
    warning: (shade = 500) => ({ color: colors.warning[shade] }),
    danger: (shade = 500) => ({ color: colors.danger[shade] }),
    info: (shade = 500) => ({ color: colors.info[shade] }),
    gray: (shade = 500) => ({ color: colors.gray[shade] }),
  },

  // Background color helpers
  bgColors: {
    primary: (shade = 500) => ({ bgcolor: colors.primary[shade] }),
    secondary: (shade = 500) => ({ bgcolor: colors.secondary[shade] }),
    success: (shade = 500) => ({ bgcolor: colors.success[shade] }),
    warning: (shade = 500) => ({ bgcolor: colors.warning[shade] }),
    danger: (shade = 500) => ({ bgcolor: colors.danger[shade] }),
    info: (shade = 500) => ({ bgcolor: colors.info[shade] }),
    gray: (shade = 500) => ({ bgcolor: colors.gray[shade] }),
  },

  // Semantic color helpers
  semantic: {
    bg: { bgcolor: semanticColors.bg },
    surface: { bgcolor: semanticColors.surface },
    text: { color: semanticColors.text },
    textMuted: { color: semanticColors.textMuted },
    border: { borderColor: semanticColors.border },
    focus: { borderColor: semanticColors.focus },
  },

  // Status helpers
  status: {
    info: { 
      bgcolor: semanticColors.infoBg, 
      color: semanticColors.info 
    },
    success: { 
      bgcolor: semanticColors.successBg, 
      color: semanticColors.success 
    },
    warning: { 
      bgcolor: semanticColors.warningBg, 
      color: semanticColors.warning 
    },
    danger: { 
      bgcolor: semanticColors.dangerBg, 
      color: semanticColors.danger 
    },
  },

  // Interactive state helpers
  interactive: {
    hover: { '&:hover': { bgcolor: semanticColors.hover } },
    active: { '&:active': { bgcolor: semanticColors.active } },
    focus: { 
      '&:focus': { 
        outline: `2px solid ${semanticColors.focus}`,
        outlineOffset: '2px',
        boxShadow: `0 0 0 4px ${semanticColors.focusRing}`,
      } 
    },
    disabled: { 
      '&:disabled': { 
        bgcolor: semanticColors.disabled,
        color: semanticColors.disabledText,
      } 
    },
  },

  // Spacing helpers
  spacing: {
    p: (value) => ({ p: value }),
    px: (value) => ({ px: value }),
    py: (value) => ({ py: value }),
    pt: (value) => ({ pt: value }),
    pr: (value) => ({ pr: value }),
    pb: (value) => ({ pb: value }),
    pl: (value) => ({ pl: value }),
    m: (value) => ({ m: value }),
    mx: (value) => ({ mx: value }),
    my: (value) => ({ my: value }),
    mt: (value) => ({ mt: value }),
    mr: (value) => ({ mr: value }),
    mb: (value) => ({ mb: value }),
    ml: (value) => ({ ml: value }),
  },

  // Border radius helpers
  radius: {
    none: { borderRadius: borderRadius.none },
    sm: { borderRadius: borderRadius.sm },
    base: { borderRadius: borderRadius.base },
    md: { borderRadius: borderRadius.md },
    lg: { borderRadius: borderRadius.lg },
    xl: { borderRadius: borderRadius.xl },
    '2xl': { borderRadius: borderRadius['2xl'] },
    '3xl': { borderRadius: borderRadius['3xl'] },
    full: { borderRadius: borderRadius.full },
  },

  // Shadow helpers
  shadow: {
    none: { boxShadow: shadows.none },
    sm: { boxShadow: shadows.sm },
    base: { boxShadow: shadows.base },
    md: { boxShadow: shadows.md },
    lg: { boxShadow: shadows.lg },
    xl: { boxShadow: shadows.xl },
    '2xl': { boxShadow: shadows['2xl'] },
    inner: { boxShadow: shadows.inner },
  },
};

// Accessibility helpers
export const accessibility = {
  // Focus styles
  focusRing: {
    outline: `2px solid ${semanticColors.focus}`,
    outlineOffset: '2px',
    boxShadow: `0 0 0 4px ${semanticColors.focusRing}`,
  },

  // Screen reader only
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },

  // Skip link
  skipLink: {
    position: 'absolute',
    top: '-40px',
    left: '6px',
    background: semanticColors.primary,
    color: semanticColors.primaryContrast,
    padding: '8px',
    textDecoration: 'none',
    borderRadius: borderRadius.base,
    zIndex: 9999,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    '&:focus': {
      top: '6px',
      transition: 'top 0.3s ease',
    },
  },
};

// Component-specific helpers
export const components = {
  // Button styles
  button: {
    primary: {
      bgcolor: semanticColors.primary,
      color: semanticColors.primaryContrast,
      '&:hover': { bgcolor: semanticColors.primaryHover },
      ...accessibility.focusRing,
    },
    secondary: {
      bgcolor: semanticColors.secondary,
      color: semanticColors.secondaryContrast,
      '&:hover': { bgcolor: semanticColors.secondaryHover },
      ...accessibility.focusRing,
    },
    outline: {
      border: `1.5px solid ${semanticColors.primary}`,
      color: semanticColors.primary,
      bgcolor: 'transparent',
      '&:hover': { 
        bgcolor: semanticColors.infoBg,
        borderColor: semanticColors.primaryHover,
      },
      ...accessibility.focusRing,
    },
  },

  // Card styles
  card: {
    base: {
      bgcolor: semanticColors.surface,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.base,
      '&:hover': { boxShadow: shadows.md },
    },
  },

  // Input styles
  input: {
    base: {
      '& .MuiOutlinedInput-root': {
        borderRadius: borderRadius.md,
        '& fieldset': {
          borderColor: semanticColors.border,
        },
        '&:hover fieldset': {
          borderColor: semanticColors.primary,
        },
        '&.Mui-focused fieldset': {
          borderColor: semanticColors.focus,
          borderWidth: '2px',
        },
        '&.Mui-error fieldset': {
          borderColor: semanticColors.danger,
        },
      },
    },
  },
};

// Utility functions
export const utils = {
  // Get contrast ratio (simplified)
  getContrastRatio: (color1, color2) => {
    // This is a simplified version - in production, use a proper color contrast library
    return 4.5; // Placeholder
  },

  // Check if color meets WCAG AA contrast requirements
  meetsContrastAA: (foreground, background, isLargeText = false) => {
    const ratio = utils.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  },

  // Generate accessible color combinations
  getAccessibleColors: (baseColor, isBackground = false) => {
    // This would generate accessible color combinations
    // For now, return the design token colors
    return {
      primary: colors.primary[500],
      secondary: colors.secondary[500],
      success: colors.success[500],
      warning: colors.warning[500],
      danger: colors.danger[500],
      info: colors.info[500],
    };
  },
};

export default {
  colors,
  semanticColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  sx,
  accessibility,
  components,
  utils,
  getToken,
  getCSSVariable,
};
