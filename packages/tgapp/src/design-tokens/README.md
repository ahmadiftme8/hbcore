# Design System Tokens

This directory contains the design tokens for the Telegram app, providing a centralized system for colors, typography, and other design decisions.

## Overview

The design system is built on top of Tailwind CSS v4 and uses CSS custom properties (CSS variables) for theming. All tokens are defined in TypeScript for type safety and programmatic access, and exposed as CSS variables for use in stylesheets.

## Structure

- `colors.ts` - Color palette definitions
- `typography.ts` - Typography system (fonts, sizes, weights, etc.)
- `index.ts` - Central export point

## Colors

### Color System

Colors are organized into several categories:

#### Base Palette
- `primary` - Main brand color
- `secondary` - Secondary brand color
- `accent` - Accent color for highlights
- `neutral` - Neutral grayscale colors

#### Semantic Colors
These colors adapt to their context (background, foreground, etc.):
- `background` / `foreground` - Main background and text colors
- `card` / `card-foreground` - Card component colors
- `popover` / `popover-foreground` - Popover component colors
- `muted` / `muted-foreground` - Muted/secondary text colors
- `border` - Border color
- `input` - Input border color
- `ring` - Focus ring color

#### State Colors
- `destructive` - Error/danger states
- `success` - Success states
- `warning` - Warning states
- `info` - Informational states

#### Chart Colors
- `chart-1` through `chart-5` - Colors for data visualization

#### Sidebar Colors
- `sidebar` / `sidebar-foreground` - Sidebar background and text
- `sidebar-primary` / `sidebar-primary-foreground` - Sidebar primary elements
- `sidebar-accent` / `sidebar-accent-foreground` - Sidebar accent elements
- `sidebar-border` / `sidebar-ring` - Sidebar borders and focus rings

### Using Colors

#### In CSS/Tailwind

Colors are available as Tailwind utility classes:

```tsx
<div className="bg-primary text-primary-foreground">
  Primary content
</div>

<div className="bg-destructive text-destructive-foreground">
  Error message
</div>

<div className="border border-border">
  Bordered element
</div>
```

#### In TypeScript

Import color tokens for programmatic access:

```typescript
import { colorTokens, getColor } from '@/design-tokens';

// Get a specific color
const primaryColor = getColor('primary', 'light');

// Get all colors for a theme
import { getThemeColors } from '@/design-tokens';
const lightColors = getThemeColors('light');
```

#### CSS Variables

Colors are also available as CSS custom properties:

```css
.custom-element {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}
```

### Theme Support

All colors support both light and dark themes. The theme is controlled by the `.dark` class on the document element. Colors automatically switch based on the active theme.

## Typography

### Font Families

- `sans` - System sans-serif font stack (default)
- `mono` - System monospace font stack

### Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `xs` | 0.75rem (12px) | Captions, labels |
| `sm` | 0.875rem (14px) | Small text, secondary content |
| `base` | 1rem (16px) | Body text (default) |
| `lg` | 1.125rem (18px) | Large body text |
| `xl` | 1.25rem (20px) | Subheadings |
| `2xl` | 1.5rem (24px) | Headings |
| `3xl` | 1.875rem (30px) | Large headings |
| `4xl` | 2.25rem (36px) | Display headings |
| `5xl` | 3rem (48px) | Hero headings |

### Font Weights

- `light` (300)
- `normal` (400) - Default
- `medium` (500)
- `semibold` (600)
- `bold` (700)

### Line Heights

- `none` (1)
- `tight` (1.2)
- `snug` (1.4)
- `normal` (1.5)
- `relaxed` (1.6) - Default for body text
- `loose` (2)

### Letter Spacing

- `tighter` (-0.02em)
- `tight` (-0.01em)
- `normal` (0) - Default
- `wide` (0.02em)
- `wider` (0.05em)
- `widest` (0.1em)

### Using Typography

#### In Tailwind

```tsx
<h1 className="text-5xl font-bold leading-tight">
  Hero Heading
</h1>

<p className="text-base leading-relaxed">
  Body text with relaxed line height
</p>

<code className="font-mono text-sm">
  Monospace code
</code>
```

#### Typography Presets

The design system includes pre-configured typography presets:

```typescript
import { typographyPresets } from '@/design-tokens';

// Available presets:
// - heading-1 through heading-6
// - body-large, body-base, body-small
// - caption
```

#### CSS Variables

```css
.heading {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}
```

## Usage Examples

### Creating a Button Component

```tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'base' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'base', children }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        {
          'bg-primary text-primary-foreground': variant === 'primary',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
        },
        {
          'text-sm px-3 py-1.5': size === 'sm',
          'text-base px-4 py-2': size === 'base',
          'text-lg px-6 py-3': size === 'lg',
        }
      )}
    >
      {children}
    </button>
  );
}
```

### Creating Typography Components

```tsx
export function Heading1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-5xl font-bold leading-tight tracking-tight">
      {children}
    </h1>
  );
}

export function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-relaxed">
      {children}
    </p>
  );
}
```

## Telegram Theme Integration

The design system is designed to work with Telegram's theme system. The app automatically switches between light and dark themes based on Telegram's color scheme.

### Customizing for Telegram

To integrate Telegram's theme colors, you can extend the color system in `colors.ts` or modify the CSS variables in `index.css` to use Telegram's `themeParams`:

```typescript
// Example: Using Telegram theme colors
const webApp = window.Telegram?.WebApp;
if (webApp?.themeParams) {
  // Apply Telegram colors to CSS variables
  document.documentElement.style.setProperty(
    '--color-primary',
    webApp.themeParams.button_color || 'oklch(0.216 0.006 56.043)'
  );
}
```

## Best Practices

1. **Use semantic color names** - Prefer `primary`, `destructive`, etc. over raw color values
2. **Use Tailwind utilities** - Leverage Tailwind classes for consistency
3. **Maintain type safety** - Import tokens from TypeScript files when needed programmatically
4. **Follow the scale** - Use the predefined font sizes and spacing scales
5. **Test both themes** - Always verify your components work in both light and dark themes

## Maintenance

### Adding New Colors

1. Add the color to `colors.ts` with light and dark variants
2. Add the CSS variable to `index.css` in the `@theme` block
3. Add the dark theme variant in the `.dark` block
4. Update this documentation

### Adding New Typography Tokens

1. Add the token to `typography.ts`
2. Add the CSS variable to `index.css` in the `@theme` block
3. Update `tailwind.config.js` if needed
4. Update this documentation

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [OKLCH Color Space](https://oklch.com/) - Better color accuracy and perceptual uniformity
- [Design Tokens Community Group](https://www.designtokens.org/)

