/**
 * Design Tokens
 * Centralized design system tokens for colors.
 * Color values are injected as CSS variables at runtime via DesignTokensProvider.
 */

import { generateJigsawPattern } from './patterns/jigsaw';

// Brand colors - Dark magenta/plum palette from image
const brandColors = {
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
} as const;

// Accent colors - Complementary palette based on light pale green/off-white from image
const accentColors = {
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
} as const;

// Neutral colors - Derived from image (desaturated dark magenta/plum base with light pale green/off-white)
const neutralColors = {
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
} as const;

export const designTokens = {
  colors: {
    brand: brandColors,
    accent: accentColors,
    neutral: neutralColors,
  },
  patterns: {
    jigsaw: generateJigsawPattern({
      backgroundColor: brandColors[100],
      strokeColor: brandColors[500],
    }),
  },
} as const;

export type DesignTokens = typeof designTokens;
