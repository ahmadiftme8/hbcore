'use client';

import { useEffect } from 'react';
import { designTokens } from '@/lib/design-tokens';

type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * Injects CSS variables from design tokens into the document root
 * This ensures design-tokens.ts is the single source of truth
 */
export function DesignTokensProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const scaleKeys: ColorScale[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    // Inject brand colors
    scaleKeys.forEach((scale) => {
      root.style.setProperty(`--brand-${scale}`, designTokens.colors.brand[scale]);
    });

    // Inject accent colors
    scaleKeys.forEach((scale) => {
      root.style.setProperty(`--accent-${scale}`, designTokens.colors.accent[scale]);
    });

    // Inject neutral colors
    scaleKeys.forEach((scale) => {
      root.style.setProperty(`--neutral-${scale}`, designTokens.colors.neutral[scale]);
    });

    // Inject patterns
    Object.entries(designTokens.patterns).forEach(([name, value]) => {
      root.style.setProperty(`--pattern-${name}`, value);
    });
  }, []);

  return null;
}
