// Typography System for Fayda ID Checker
// This file contains typography variants, heading components, and text utilities

import { designTokens } from './designTokens';

// Typography variants configuration
export const typographyVariants = {
  // Display variants (large, attention-grabbing text)
  display1: {
    fontSize: '3.5rem', // 56px
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    fontFamily: designTokens.typography.fontFamily.primary
  },
  display2: {
    fontSize: '3rem', // 48px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    fontFamily: designTokens.typography.fontFamily.primary
  },
  display3: {
    fontSize: '2.5rem', // 40px
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    fontFamily: designTokens.typography.fontFamily.primary
  },

  // Heading variants
  h1: {
    fontSize: '2.25rem', // 36px
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    fontFamily: designTokens.typography.fontFamily.primary
  },
  h2: {
    fontSize: '1.875rem', // 30px
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    fontFamily: designTokens.typography.fontFamily.primary
  },
  h3: {
    fontSize: '1.5rem', // 24px
    fontWeight: 600,
    lineHeight: 1.3,
    fontFamily: designTokens.typography.fontFamily.primary
  },
  h4: {
    fontSize: '1.25rem', // 20px
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: designTokens.typography.fontFamily.primary
  },
  h5: {
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: designTokens.typography.fontFamily.primary
  },
  h6: {
    fontSize: '1rem', // 16px
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: designTokens.typography.fontFamily.primary
  },

  // Body text variants
  body1: {
    fontSize: '1rem', // 16px
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: designTokens.typography.fontFamily.primary
  },
  body2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: 1.43,
    fontFamily: designTokens.typography.fontFamily.primary
  },

  // Caption and small text
  caption: {
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    lineHeight: 1.33,
    fontFamily: designTokens.typography.fontFamily.primary
  },
  overline: {
    fontSize: '0.75rem', // 12px
    fontWeight: 500,
    lineHeight: 1.33,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: designTokens.typography.fontFamily.primary
  },

  // Button text
  button: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.01em',
    textTransform: 'none',
    fontFamily: designTokens.typography.fontFamily.primary
  },

  // Special variants
  subtitle1: {
    fontSize: '1rem', // 16px
    fontWeight: 500,
    lineHeight: 1.5,
    fontFamily: designTokens.typography.fontFamily.primary
  },
  subtitle2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.43,
    fontFamily: designTokens.typography.fontFamily.primary
  }
};

// Responsive typography breakpoints
export const responsiveTypography = {
  // Mobile-first responsive typography
  display1: {
    xs: { fontSize: '2.5rem', lineHeight: 1.1 }, // 40px
    sm: { fontSize: '3rem', lineHeight: 1.1 },   // 48px
    md: { fontSize: '3.5rem', lineHeight: 1.1 }, // 56px
  },
  display2: {
    xs: { fontSize: '2rem', lineHeight: 1.2 },   // 32px
    sm: { fontSize: '2.5rem', lineHeight: 1.2 }, // 40px
    md: { fontSize: '3rem', lineHeight: 1.2 },   // 48px
  },
  display3: {
    xs: { fontSize: '1.75rem', lineHeight: 1.2 }, // 28px
    sm: { fontSize: '2rem', lineHeight: 1.2 },    // 32px
    md: { fontSize: '2.5rem', lineHeight: 1.2 },  // 40px
  },
  h1: {
    xs: { fontSize: '1.75rem', lineHeight: 1.2 }, // 28px
    sm: { fontSize: '2rem', lineHeight: 1.2 },    // 32px
    md: { fontSize: '2.25rem', lineHeight: 1.2 }, // 36px
  },
  h2: {
    xs: { fontSize: '1.5rem', lineHeight: 1.3 },  // 24px
    sm: { fontSize: '1.75rem', lineHeight: 1.3 }, // 28px
    md: { fontSize: '1.875rem', lineHeight: 1.3 }, // 30px
  },
  h3: {
    xs: { fontSize: '1.25rem', lineHeight: 1.3 }, // 20px
    sm: { fontSize: '1.375rem', lineHeight: 1.3 }, // 22px
    md: { fontSize: '1.5rem', lineHeight: 1.3 },   // 24px
  },
  h4: {
    xs: { fontSize: '1.125rem', lineHeight: 1.4 }, // 18px
    sm: { fontSize: '1.1875rem', lineHeight: 1.4 }, // 19px
    md: { fontSize: '1.25rem', lineHeight: 1.4 },   // 20px
  },
  h5: {
    xs: { fontSize: '1rem', lineHeight: 1.4 },     // 16px
    sm: { fontSize: '1.0625rem', lineHeight: 1.4 }, // 17px
    md: { fontSize: '1.125rem', lineHeight: 1.4 },  // 18px
  },
  h6: {
    xs: { fontSize: '0.9375rem', lineHeight: 1.4 }, // 15px
    sm: { fontSize: '0.96875rem', lineHeight: 1.4 }, // 15.5px
    md: { fontSize: '1rem', lineHeight: 1.4 },      // 16px
  }
};

// Typography utility functions
export const getTypographyVariant = (variant) => {
  return typographyVariants[variant] || typographyVariants.body1;
};

export const getResponsiveTypography = (variant, breakpoint = 'md') => {
  const responsive = responsiveTypography[variant];
  if (!responsive) return getTypographyVariant(variant);
  
  return responsive[breakpoint] || responsive.md || getTypographyVariant(variant);
};

// Font weight utilities
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800
};

// Text alignment utilities
export const textAlignments = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify'
};

// Text transform utilities
export const textTransforms = {
  none: 'none',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize'
};

// Text decoration utilities
export const textDecorations = {
  none: 'none',
  underline: 'underline',
  overline: 'overline',
  lineThrough: 'line-through'
};

// Line height utilities
export const lineHeights = {
  tight: 1.1,
  normal: 1.2,
  relaxed: 1.3,
  loose: 1.4,
  body: 1.5
};

// Letter spacing utilities
export const letterSpacings = {
  tight: '-0.02em',
  normal: '0em',
  wide: '0.01em',
  wider: '0.05em',
  widest: '0.1em'
};

// Typography mixins for common patterns
export const typographyMixins = {
  // Heading styles
  heading: (level = 'h1') => ({
    ...getTypographyVariant(level),
    color: 'text.primary',
    marginBottom: 2
  }),

  // Body text styles
  body: (size = 'body1') => ({
    ...getTypographyVariant(size),
    color: 'text.primary',
    marginBottom: 1
  }),

  // Caption styles
  caption: {
    ...getTypographyVariant('caption'),
    color: 'text.secondary'
  },

  // Link styles
  link: {
    ...getTypographyVariant('body1'),
    color: 'primary.main',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },

  // Error text styles
  error: {
    ...getTypographyVariant('body2'),
    color: 'error.main'
  },

  // Success text styles
  success: {
    ...getTypographyVariant('body2'),
    color: 'success.main'
  },

  // Warning text styles
  warning: {
    ...getTypographyVariant('body2'),
    color: 'warning.main'
  },

  // Info text styles
  info: {
    ...getTypographyVariant('body2'),
    color: 'info.main'
  }
};

// Export all typography utilities
export default {
  variants: typographyVariants,
  responsive: responsiveTypography,
  weights: fontWeights,
  alignments: textAlignments,
  transforms: textTransforms,
  decorations: textDecorations,
  lineHeights,
  letterSpacings,
  mixins: typographyMixins,
  getVariant: getTypographyVariant,
  getResponsive: getResponsiveTypography
};
