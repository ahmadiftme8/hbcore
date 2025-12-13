'use client';

import { useScrollPattern } from '@/hooks/useScrollPattern';

interface ScrollPatternAnimatorProps {
  /** Speed multiplier for the animation (default: 0.5) */
  speed?: number;
  /** Direction of animation: 'left' or 'right' (default: 'left') */
  direction?: 'left' | 'right';
}

/**
 * Component that animates the jigsaw pattern horizontally based on scroll position
 * This component has no visual output, it only manages the scroll animation
 */
export function ScrollPatternAnimator({
  speed = 0.5,
  direction = 'left',
}: ScrollPatternAnimatorProps) {
  useScrollPattern({
    variableName: '--pattern-jigsaw-offset',
    speed,
    direction,
  });

  return null;
}

