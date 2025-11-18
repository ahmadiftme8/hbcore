# UI Components

This directory contains reusable UI components built with shadcn/ui.

## Adding Components

To add a new shadcn/ui component:

```bash
bunx shadcn@latest add [component-name]
```

## Component Structure

Each component should follow this structure:

```
ComponentName/
  ComponentName.tsx    # Component implementation
  ComponentName.css    # Component styles (if needed)
  index.ts             # Export file
```

## Styling Guidelines

- Use Tailwind CSS classes for styling
- Use CSS variables from `globals.css` for colors
- Follow the design tokens from `@/lib/design-tokens`
- Keep styles separate from component logic

## Color Usage

- Use `bg-brand-*` for brand colors
- Use `bg-accent-*` for accent colors
- Use shadcn's semantic colors (`bg-primary`, `bg-secondary`, etc.)
- All colors are theme-aware (light/dark mode)

