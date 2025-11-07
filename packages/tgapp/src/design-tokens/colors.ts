/**
 * Design System Color Tokens
 *
 * This file defines the color palette for the design system.
 * Hambazi Color Palette:
 * - Primary: Orange (#E87722), Navy Blue (#1C3C5A)
 * - Neutrals: Background (#F9FAFB), Surface/Card (#F3F4F6), Text Primary (#111827), Text Secondary (#374151), Border (#E5E7EB)
 * - Accents: Link Blue (#2563EB), Muted Gray (#9CA3AF), Warm Cream (#FFF4E6)
 *
 * Colors are organized into:
 * - Base palette: Primary, secondary, accent, neutral colors
 * - Semantic colors: Background, foreground, card, border, etc.
 * - State colors: Success, warning, error, info
 * - Chart colors: For data visualization
 */

export const colorTokens = {
  // Base color palette - Hambazi Colors
  primary: {
    light: '#E87722', // Orange
    dark: '#F59E4A', // Lighter orange for dark mode
  },
  secondary: {
    light: '#1C3C5A', // Navy Blue
    dark: '#2D5A7E', // Lighter navy for dark mode
  },
  accent: {
    light: '#FFF4E6', // Warm Cream
    dark: '#4A5568', // Darker accent for dark mode
  },
  neutral: {
    light: '#111827', // Text Primary
    dark: '#F9FAFB', // Background for dark mode
  },

  // Semantic colors - Hambazi Palette
  background: {
    light: '#F9FAFB', // Background
    dark: '#111827', // Text Primary (inverted for dark mode)
  },
  foreground: {
    light: '#111827', // Text Primary
    dark: '#F9FAFB', // Background (inverted for dark mode)
  },
  card: {
    light: '#F3F4F6', // Surface / Card
    dark: '#1F2937', // Darker surface for dark mode
  },
  'card-foreground': {
    light: '#111827', // Text Primary
    dark: '#F9FAFB', // Background (inverted for dark mode)
  },
  popover: {
    light: '#F3F4F6', // Surface / Card
    dark: '#1F2937', // Darker surface for dark mode
  },
  'popover-foreground': {
    light: '#111827', // Text Primary
    dark: '#F9FAFB', // Background (inverted for dark mode)
  },
  border: {
    light: '#E5E7EB', // Border
    dark: '#374151', // Text Secondary (for dark mode borders)
  },
  input: {
    light: '#E5E7EB', // Border
    dark: '#374151', // Text Secondary (for dark mode inputs)
  },
  ring: {
    light: '#2563EB', // Link / Hover Blue
    dark: '#3B82F6', // Lighter blue for dark mode
  },
  muted: {
    light: '#F3F4F6', // Surface / Card
    dark: '#374151', // Text Secondary (for dark mode muted)
  },
  'muted-foreground': {
    light: '#374151', // Text Secondary
    dark: '#9CA3AF', // Muted Gray (for dark mode)
  },

  // State colors
  destructive: {
    light: 'oklch(0.577 0.245 27.325)',
    dark: 'oklch(0.704 0.191 22.216)',
  },
  success: {
    light: 'oklch(0.6 0.15 150)',
    dark: 'oklch(0.7 0.15 150)',
  },
  warning: {
    light: 'oklch(0.75 0.15 80)',
    dark: 'oklch(0.8 0.15 80)',
  },
  info: {
    light: 'oklch(0.6 0.15 220)',
    dark: 'oklch(0.7 0.15 220)',
  },

  // Chart colors
  'chart-1': {
    light: 'oklch(0.646 0.222 41.116)',
    dark: 'oklch(0.488 0.243 264.376)',
  },
  'chart-2': {
    light: 'oklch(0.6 0.118 184.704)',
    dark: 'oklch(0.696 0.17 162.48)',
  },
  'chart-3': {
    light: 'oklch(0.398 0.07 227.392)',
    dark: 'oklch(0.769 0.188 70.08)',
  },
  'chart-4': {
    light: 'oklch(0.828 0.189 84.429)',
    dark: 'oklch(0.627 0.265 303.9)',
  },
  'chart-5': {
    light: 'oklch(0.769 0.188 70.08)',
    dark: 'oklch(0.645 0.246 16.439)',
  },

  // Sidebar colors - Hambazi Palette
  sidebar: {
    light: '#F3F4F6', // Surface / Card
    dark: '#1F2937', // Darker surface for dark mode
  },
  'sidebar-foreground': {
    light: '#111827', // Text Primary
    dark: '#F9FAFB', // Background
  },
  'sidebar-primary': {
    light: '#E87722', // Orange
    dark: '#F59E4A', // Lighter orange for dark mode
  },
  'sidebar-primary-foreground': {
    light: '#FFFFFF',
    dark: '#111827', // Text Primary
  },
  'sidebar-accent': {
    light: '#F3F4F6', // Surface / Card
    dark: '#374151', // Text Secondary
  },
  'sidebar-accent-foreground': {
    light: '#111827', // Text Primary
    dark: '#F9FAFB', // Background
  },
  'sidebar-border': {
    light: '#E5E7EB', // Border
    dark: '#374151', // Text Secondary
  },
  'sidebar-ring': {
    light: '#2563EB', // Link / Hover Blue
    dark: '#3B82F6', // Lighter blue for dark mode
  },
} as const;

/**
 * Helper function to get color value for a specific theme
 */
export function getColor(colorName: keyof typeof colorTokens, theme: 'light' | 'dark'): string {
  return colorTokens[colorName][theme];
}

/**
 * Helper function to get all colors for a specific theme
 */
export function getThemeColors(theme: 'light' | 'dark'): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [name, values] of Object.entries(colorTokens)) {
    colors[name] = values[theme];
  }
  return colors;
}
