/**
 * Design Tokens
 * Centralized design system tokens for colors, spacing, typography, etc.
 */

export const designTokens = {
  colors: {
    // Brand colors - Dark magenta/plum palette from image
    brand: {
      50: '#F5E6F0',
      100: '#E8CCE0',
      200: '#D199C1',
      300: '#BA66A2',
      400: '#A33383', // Medium magenta/plum
      500: '#6B2D5E', // Dark magenta/plum - Primary brand color from image
      600: '#55244A',
      700: '#401B36',
      800: '#2B1222', // Dark magenta/plum
      900: '#1D0C17',
      950: '#0F060B',
    },
    // Accent colors - Complementary palette based on light pale green/off-white from image
    accent: {
      50: '#F5F5E6', // Light pale green/off-white from image
      100: '#E8E8D9',
      200: '#D1D1B3',
      300: '#BABA8D',
      400: '#A3A367', // Medium pale green
      500: '#8C8C41', // Pale green accent
      600: '#707033',
      700: '#545425',
      800: '#383817', // Dark pale green
      900: '#1C1C0C',
      950: '#0E0E06',
    },
    // Neutral colors - Derived from image (desaturated dark magenta/plum base with light pale green/off-white)
    neutral: {
      50: '#F5F5E6', // Light pale green/off-white from image
      100: '#E8E8DC',
      200: '#D1D1C4',
      300: '#B8B8AC',
      400: '#9F9F94',
      500: '#86867C',
      600: '#6D6D64',
      700: '#54544C',
      800: '#3B3B34',
      900: '#2D2A2E', // Desaturated dark magenta/plum base
      950: '#1A181B', // Darkest neutral
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
      primary: 'var(--font-rubik)',
      body: 'var(--font-vazirmatn)',
      mono: 'var(--font-geist-mono)',
      sans: 'var(--font-vazirmatn)', // Alias for body font
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
