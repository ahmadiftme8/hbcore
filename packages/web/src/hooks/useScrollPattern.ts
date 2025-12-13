'use client';

import { useEffect } from 'react';

interface UseScrollPatternOptions {
  /** CSS variable name to update (default: '--pattern-jigsaw-offset') */
  variableName?: string;
  /** Speed multiplier for the animation (default: 0.5) */
  speed?: number;
  /** Direction of animation: 'left' or 'right' (default: 'left') */
  direction?: 'left' | 'right';
}

/**
 * Hook that animates a background pattern horizontally based on scroll position
 * Updates a CSS variable that can be used for background-position
 */
export function useScrollPattern({
  variableName = '--pattern-jigsaw-offset',
  speed = 0.5,
  direction = 'left',
}: UseScrollPatternOptions = {}) {
  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const updatePatternPosition = () => {
      const scrollY = window.scrollY;
      
      // Calculate offset based on scroll position and direction
      const offset = direction === 'left' 
        ? scrollY * speed 
        : -scrollY * speed;
      
      // Update CSS variable
      document.documentElement.style.setProperty(
        variableName,
        `${offset}px 0`
      );

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updatePatternPosition);
        ticking = true;
      }
    };

    // Initialize the CSS variable
    document.documentElement.style.setProperty(variableName, '0 0');

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial update
    handleScroll();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [variableName, speed, direction]);
}

