/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colors from design tokens
      colors: {
        // Primary colors (Blue - Color-blind safe)
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Main primary
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        // Secondary colors (Teal - Color-blind safe)
        secondary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6', // Main secondary
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },

        // Success colors (Green - Color-blind safe)
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Main success
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },

        // Warning colors (Amber - Color-blind safe)
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Main warning
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // Danger colors (Red - Color-blind safe)
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // Main danger
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },

        // Info colors (Blue - Color-blind safe)
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Main info
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        // Neutral colors (Gray)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        // Ethiopian colors (Cultural)
        ethiopian: {
          green: '#009639',
          yellow: '#FEDD00',
          red: '#DA121A',
          blue: '#1E3A8A',
          gold: '#D4AF37',
          cream: '#F5F5DC',
          darkGreen: '#006400',
          lightGreen: '#90EE90',
        },

        // Semantic colors
        bg: {
          DEFAULT: '#F9FAFB',
          alt: '#FFFFFF',
          surface: '#FFFFFF',
          'surface-hover': '#F3F4F6',
        },

        text: {
          DEFAULT: '#111827',
          muted: '#6B7280',
          disabled: '#9CA3AF',
          inverse: '#FFFFFF',
        },

        border: {
          DEFAULT: '#E5E7EB',
          focus: '#3B82F6',
          error: '#EF4444',
        },

        // Status colors
        info: {
          DEFAULT: '#3B82F6',
          bg: '#EFF6FF',
        },

        success: {
          DEFAULT: '#22C55E',
          bg: '#F0FDF4',
        },

        warning: {
          DEFAULT: '#F59E0B',
          bg: '#FFFBEB',
        },

        danger: {
          DEFAULT: '#EF4444',
          bg: '#FEF2F2',
        },
      },

      // Spacing scale (4px increments)
      spacing: {
        '0': '0',
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
        '32': '8rem',     // 128px
        '40': '10rem',    // 160px
        '48': '12rem',    // 192px
        '56': '14rem',    // 224px
        '64': '16rem',    // 256px
      },

      // Border radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'base': '0.25rem',  // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
      },

      // Typography
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px
      },

      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },

      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },

      // Shadows
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },

      // Transitions
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },

      transitionTimingFunction: {
        'ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // Z-index
      zIndex: {
        'hide': '-1',
        'auto': 'auto',
        'base': '0',
        'docked': '10',
        'dropdown': '1000',
        'sticky': '1100',
        'banner': '1200',
        'overlay': '1300',
        'modal': '1400',
        'popover': '1500',
        'skipLink': '1600',
        'toast': '1700',
        'tooltip': '1800',
      },

      // Focus styles for accessibility
      outline: {
        'focus': '2px solid var(--color-focus)',
        'focus-offset': '2px',
      },

      // Custom utilities for design tokens
      backgroundColor: {
        'surface': 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        'info-bg': 'var(--color-info-bg)',
        'success-bg': 'var(--color-success-bg)',
        'warning-bg': 'var(--color-warning-bg)',
        'danger-bg': 'var(--color-danger-bg)',
      },

      textColor: {
        'muted': 'var(--color-text-muted)',
        'disabled': 'var(--color-text-disabled)',
        'inverse': 'var(--color-text-inverse)',
        'info': 'var(--color-info)',
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'danger': 'var(--color-danger)',
      },

      borderColor: {
        'focus': 'var(--color-border-focus)',
        'error': 'var(--color-border-error)',
      },
    },
  },
  plugins: [
    // Custom plugin for design token utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Focus ring utilities
        '.focus-ring': {
          outline: '2px solid var(--color-focus)',
          outlineOffset: '2px',
          boxShadow: '0 0 0 4px var(--color-focus-ring)',
        },

        // High contrast mode support
        '.high-contrast': {
          border: '2px solid var(--color-text)',
          backgroundColor: 'var(--color-text)',
          color: 'var(--color-bg)',
        },

        // Reduced motion support
        '.reduced-motion': {
          transition: 'none',
          animation: 'none',
        },

        // Status utilities
        '.status-info': {
          backgroundColor: 'var(--color-info-bg)',
          color: 'var(--color-info)',
        },

        '.status-success': {
          backgroundColor: 'var(--color-success-bg)',
          color: 'var(--color-success)',
        },

        '.status-warning': {
          backgroundColor: 'var(--color-warning-bg)',
          color: 'var(--color-warning)',
        },

        '.status-danger': {
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
        },

        // Interactive states
        '.interactive-hover': {
          backgroundColor: 'var(--color-hover)',
        },

        '.interactive-active': {
          backgroundColor: 'var(--color-active)',
        },

        '.interactive-disabled': {
          backgroundColor: 'var(--color-disabled)',
          color: 'var(--color-disabled-text)',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
