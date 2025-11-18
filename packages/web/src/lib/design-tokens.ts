/**
 * Design Tokens
 * Centralized design system tokens for colors, spacing, typography, etc.
 */

export const designTokens = {
  colors: {
    // Brand colors - Tango (#EA7525) palette
    brand: {
      50: '#FEF5EF',
      100: '#FDE6D3',
      200: '#FBCBA7',
      300: '#F8A871',
      400: '#F57F3A',
      500: '#EA7525', // Tango - Primary brand color
      600: '#D15F1A',
      700: '#AE4A15',
      800: '#8B3A14',
      900: '#723012',
      950: '#3D1809',
    },
    // Accent colors - Blue Zodiac (#14345B) palette
    accent: {
      50: '#E8EDF3',
      100: '#D1DBE7',
      200: '#A3B7CF',
      300: '#7593B7',
      400: '#476F9F',
      500: '#14345B', // Blue Zodiac - Primary accent color
      600: '#102A49',
      700: '#0C2037',
      800: '#081625',
      900: '#040C13',
      950: '#020609',
    },
    // Neutral colors - Spring Wood (#F8F9F4) and Shuttle Gray (#54646C)
    neutral: {
      50: '#F8F9F4', // Spring Wood
      100: '#F0F2EA',
      200: '#E1E5D5',
      300: '#D2D8C0',
      400: '#C3CBAB',
      500: '#B4BE96',
      600: '#9BA57F',
      700: '#828C68',
      800: '#54646C', // Shuttle Gray
      900: '#434F54',
      950: '#2A3236',
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem', // 2px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    full: '9999px',
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
} as const;

export type DesignTokens = typeof designTokens;
