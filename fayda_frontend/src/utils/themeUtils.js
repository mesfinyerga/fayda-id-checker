// Theme utilities for accessing design tokens and theme values
import { designTokens } from '../theme/designTokens';

/**
 * Get color value from design tokens
 * @param {string} colorPath - Path to color (e.g., 'primary.main', 'neutral.500')
 * @returns {string} Color value
 */
export const getColor = (colorPath) => {
  const path = colorPath.split('.');
  let value = designTokens.colors;
  
  for (const key of path) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Color path "${colorPath}" not found in design tokens`);
      return designTokens.colors.neutral[500]; // Fallback color
    }
  }
  
  return value;
};

/**
 * Get spacing value from design tokens
 * @param {number|string} factor - Spacing factor or specific value
 * @param {string} type - 'mui' or 'tailwind'
 * @returns {string} Spacing value
 */
export const getSpacing = (factor, type = 'mui') => {
  // The spacing object is flat, so we access it directly
  return designTokens.spacing[factor] || (factor * 4);
};

/**
 * Get border radius value from design tokens
 * @param {string} size - Border radius size ('sm', 'md', 'lg', 'xl', 'full')
 * @returns {string} Border radius value
 */
export const getBorderRadius = (size = 'md') => {
  return designTokens.borderRadius[size] || designTokens.borderRadius.md;
};

/**
 * Get shadow value from design tokens
 * @param {string|number} elevation - Shadow elevation or custom shadow name
 * @returns {string} Shadow value
 */
export const getShadow = (elevation) => {
  if (typeof elevation === 'number') {
    // Map numeric elevation to shadow names
    const shadowMap = {
      0: 'none',
      1: 'sm',
      2: 'base',
      3: 'md',
      4: 'lg',
      5: 'xl',
      6: '2xl'
    };
    const shadowName = shadowMap[elevation] || 'base';
    return designTokens.shadows[shadowName] || designTokens.shadows.base;
  }
  return designTokens.shadows[elevation] || designTokens.shadows.base;
};

/**
 * Get typography variant from design tokens
 * @param {string} variant - Typography variant name
 * @returns {object} Typography styles
 */
export const getTypography = (variant = 'body1') => {
  // Map common typography variants to our design tokens
  const variantMap = {
    h1: { fontSize: designTokens.typography.fontSize['4xl'], fontWeight: designTokens.typography.fontWeight.bold },
    h2: { fontSize: designTokens.typography.fontSize['3xl'], fontWeight: designTokens.typography.fontWeight.bold },
    h3: { fontSize: designTokens.typography.fontSize['2xl'], fontWeight: designTokens.typography.fontWeight.semibold },
    h4: { fontSize: designTokens.typography.fontSize.xl, fontWeight: designTokens.typography.fontWeight.semibold },
    h5: { fontSize: designTokens.typography.fontSize.lg, fontWeight: designTokens.typography.fontWeight.medium },
    h6: { fontSize: designTokens.typography.fontSize.base, fontWeight: designTokens.typography.fontWeight.medium },
    body1: { fontSize: designTokens.typography.fontSize.base, fontWeight: designTokens.typography.fontWeight.normal },
    body2: { fontSize: designTokens.typography.fontSize.sm, fontWeight: designTokens.typography.fontWeight.normal },
    caption: { fontSize: designTokens.typography.fontSize.xs, fontWeight: designTokens.typography.fontWeight.normal },
    button: { fontSize: designTokens.typography.fontSize.sm, fontWeight: designTokens.typography.fontWeight.medium }
  };
  return variantMap[variant] || variantMap.body1;
};

/**
 * Get transition duration from design tokens
 * @param {string} type - Transition duration type
 * @returns {number} Duration in milliseconds
 */
export const getTransitionDuration = (type = 'normal') => {
  return designTokens.transitions.duration[type] || designTokens.transitions.duration.normal;
};

/**
 * Get transition easing from design tokens
 * @param {string} type - Transition easing type
 * @returns {string} Easing function
 */
export const getTransitionEasing = (type = 'easeInOut') => {
  return designTokens.transitions.easing[type] || designTokens.transitions.easing.easeInOut;
};

/**
 * Create a complete transition string
 * @param {string} property - CSS property to transition
 * @param {string} duration - Duration type
 * @param {string} easing - Easing type
 * @returns {string} Complete transition string
 */
export const createTransition = (property = 'all', duration = 'normal', easing = 'easeInOut') => {
  const durationValue = getTransitionDuration(duration);
  const easingValue = getTransitionEasing(easing);
  return `${property} ${durationValue}ms ${easingValue}`;
};

/**
 * Get breakpoint value from design tokens
 * @param {string} breakpoint - Breakpoint name ('xs', 'sm', 'md', 'lg', 'xl')
 * @returns {number} Breakpoint value in pixels
 */
export const getBreakpoint = (breakpoint) => {
  return designTokens.breakpoints[breakpoint] || 0;
};

/**
 * Get z-index value from design tokens
 * @param {string} layer - Z-index layer name
 * @returns {number} Z-index value
 */
export const getZIndex = (layer) => {
  return designTokens.zIndex[layer] || 0;
};

/**
 * Create sx prop object with design tokens
 * @param {object} styles - Style object using design token references
 * @returns {object} Sx prop object
 */
export const createSx = (styles) => {
  return styles;
};

/**
 * Common sx prop patterns using design tokens
 */
export const sxPatterns = {
  // Card styles
  card: {
    borderRadius: getBorderRadius('lg'),
    boxShadow: getShadow('md'),
    transition: createTransition('box-shadow'),
    '&:hover': {
      boxShadow: getShadow('lg'),
    },
  },
  
  // Button styles
  button: {
    borderRadius: getBorderRadius('md'),
    textTransform: 'none',
    fontWeight: 500,
    minHeight: 40,
    padding: `${getSpacing(1)}px ${getSpacing(3)}px`,
    boxShadow: getShadow('sm'),
    transition: createTransition(),
    '&:hover': {
      boxShadow: getShadow('md'),
      transform: 'translateY(-1px)',
    },
    '&:focus': {
      outline: `2px solid ${getColor('primary.main')}`,
      outlineOffset: '2px',
    },
  },
  
  // Form field styles
  formField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: getBorderRadius('md'),
      '& fieldset': {
        borderColor: getColor('neutral.300'),
        borderWidth: 1,
      },
      '&:hover fieldset': {
        borderColor: getColor('primary.main'),
        borderWidth: 1,
      },
      '&.Mui-focused fieldset': {
        borderColor: getColor('primary.main'),
        borderWidth: 2,
      },
    },
  },
  
  // Container styles
  container: {
    padding: getSpacing(3),
    backgroundColor: getColor('background.paper'),
    borderRadius: getBorderRadius('md'),
  },
  
  // Page header styles
  pageHeader: {
    padding: `${getSpacing(4)}px ${getSpacing(3)}px`,
    backgroundColor: getColor('background.paper'),
    borderBottom: `1px solid ${getColor('neutral.200')}`,
  },
};

// Export design tokens for direct access
export { designTokens };

export default {
  getColor,
  getSpacing,
  getBorderRadius,
  getShadow,
  getTypography,
  getTransitionDuration,
  getTransitionEasing,
  createTransition,
  getBreakpoint,
  getZIndex,
  createSx,
  sxPatterns,
  designTokens,
};
