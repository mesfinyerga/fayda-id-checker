// Spacing Utilities for Fayda ID Checker
// This file provides helper functions for consistent spacing across the application

import { designTokens } from '../theme/designTokens';

// MUI Spacing Helper (8px base)
export const muiSpacing = (factor) => `${designTokens.spacing[factor] || factor * 8}px`;

// Tailwind Spacing Helper (4px base)
export const tailwindSpacing = (factor) => `${designTokens.spacing[factor] || factor * 4}px`;

// Responsive Spacing Helper
export const responsiveSpacing = (xs, sm, md, lg, xl) => ({
  xs: muiSpacing(xs),
  sm: muiSpacing(sm || xs),
  md: muiSpacing(md || sm || xs),
  lg: muiSpacing(lg || md || sm || xs),
  xl: muiSpacing(xl || lg || md || sm || xs)
});

// Margin Helpers
export const margin = {
  // All sides
  all: (value) => ({ margin: muiSpacing(value) }),
  
  // Individual sides
  top: (value) => ({ marginTop: muiSpacing(value) }),
  right: (value) => ({ marginRight: muiSpacing(value) }),
  bottom: (value) => ({ marginBottom: muiSpacing(value) }),
  left: (value) => ({ marginLeft: muiSpacing(value) }),
  
  // Horizontal/Vertical
  x: (value) => ({ 
    marginLeft: muiSpacing(value), 
    marginRight: muiSpacing(value) 
  }),
  y: (value) => ({ 
    marginTop: muiSpacing(value), 
    marginBottom: muiSpacing(value) 
  }),
  
  // Responsive
  responsive: (xs, sm, md, lg, xl) => ({
    margin: responsiveSpacing(xs, sm, md, lg, xl)
  })
};

// Padding Helpers
export const padding = {
  // All sides
  all: (value) => ({ padding: muiSpacing(value) }),
  
  // Individual sides
  top: (value) => ({ paddingTop: muiSpacing(value) }),
  right: (value) => ({ paddingRight: muiSpacing(value) }),
  bottom: (value) => ({ paddingBottom: muiSpacing(value) }),
  left: (value) => ({ paddingLeft: muiSpacing(value) }),
  
  // Horizontal/Vertical
  x: (value) => ({ 
    paddingLeft: muiSpacing(value), 
    paddingRight: muiSpacing(value) 
  }),
  y: (value) => ({ 
    paddingTop: muiSpacing(value), 
    paddingBottom: muiSpacing(value) 
  }),
  
  // Responsive
  responsive: (xs, sm, md, lg, xl) => ({
    padding: responsiveSpacing(xs, sm, md, lg, xl)
  })
};

// Gap Helpers
export const gap = {
  // Standard gap
  standard: (value) => ({ gap: muiSpacing(value) }),
  
  // Responsive gap
  responsive: (xs, sm, md, lg, xl) => ({
    gap: responsiveSpacing(xs, sm, md, lg, xl)
  })
};

// Layout Spacing Helpers
export const layout = {
  // Container spacing
  container: {
    standard: {
      ...padding.all(3),
      ...margin.x('auto'),
      maxWidth: '1200px'
    },
    narrow: {
      ...padding.all(3),
      ...margin.x('auto'),
      maxWidth: '800px'
    },
    wide: {
      ...padding.all(3),
      ...margin.x('auto'),
      maxWidth: '1400px'
    }
  },
  
  // Section spacing
  section: {
    standard: {
      ...padding.y(6),
      ...padding.x(3)
    },
    compact: {
      ...padding.y(4),
      ...padding.x(3)
    },
    spacious: {
      ...padding.y(8),
      ...padding.x(3)
    }
  },
  
  // Card spacing
  card: {
    standard: {
      ...padding.all(3)
    },
    compact: {
      ...padding.all(2)
    },
    spacious: {
      ...padding.all(4)
    }
  },
  
  // Form spacing
  form: {
    field: {
      ...margin.bottom(2)
    },
    group: {
      ...margin.bottom(3)
    },
    section: {
      ...margin.bottom(4)
    }
  }
};

// Component-specific spacing
export const components = {
  // Button spacing
  button: {
    standard: {
      ...padding.x(3),
      ...padding.y(1.5)
    },
    compact: {
      ...padding.x(2),
      ...padding.y(1)
    },
    spacious: {
      ...padding.x(4),
      ...padding.y(2)
    }
  },
  
  // Input spacing
  input: {
    standard: {
      ...padding.x(2),
      ...padding.y(1.5)
    },
    compact: {
      ...padding.x(1.5),
      ...padding.y(1)
    }
  },
  
  // Table spacing
  table: {
    cell: {
      ...padding.x(2),
      ...padding.y(1.5)
    },
    header: {
      ...padding.x(2),
      ...padding.y(2)
    }
  },
  
  // Modal spacing
  modal: {
    header: {
      ...padding.all(3),
      ...padding.bottom(2)
    },
    content: {
      ...padding.all(3)
    },
    actions: {
      ...padding.all(3),
      ...padding.top(2)
    }
  }
};

// Utility functions for common spacing patterns
export const spacingUtils = {
  // Stack items vertically
  stack: (gap = 2) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: muiSpacing(gap)
  }),
  
  // Stack items horizontally
  row: (gap = 2) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: muiSpacing(gap)
  }),
  
  // Center content
  center: {
    horizontal: {
      display: 'flex',
      justifyContent: 'center'
    },
    vertical: {
      display: 'flex',
      alignItems: 'center'
    },
    both: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  
  // Grid layout
  grid: (columns = 1, gap = 2) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: muiSpacing(gap)
  })
};

// Export all spacing values for direct use
export const spacingValues = {
  mui: designTokens.spacing,
  tailwind: designTokens.spacing
};

// Default export for convenience
export default {
  muiSpacing,
  tailwindSpacing,
  responsiveSpacing,
  margin,
  padding,
  gap,
  layout,
  components,
  spacingUtils,
  spacingValues
};
