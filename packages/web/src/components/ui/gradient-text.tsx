'use client';

import { motion, type Transition } from 'motion/react';
import * as React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

type GradientTextProps = React.ComponentProps<'span'> & {
  text: string;
  gradient?: string;
  neon?: boolean;
  transition?: Transition;
};

// Default gradient using design system colors: light and dark versions of main brand color
const defaultGradient = `linear-gradient(90deg, ${designTokens.colors.brand[400]} 0%, ${designTokens.colors.brand[200]} 50%, ${designTokens.colors.brand[400]} 100%)`;

function GradientText({
  text,
  className,
  gradient = defaultGradient,
  neon = false,
  transition = { duration: 3, repeat: Infinity, ease: 'linear' },
  ...props
}: GradientTextProps) {
  const baseStyle: React.CSSProperties = {
    backgroundImage: gradient,
  };

  return (
    <span data-slot="gradient-text" className={cn('relative inline-block', className)} {...props}>
      <motion.span
        className="m-0 text-transparent bg-clip-text bg-size-[200%_100%]"
        style={baseStyle}
        animate={{ backgroundPositionX: ['0%', '200%'] }}
        transition={transition}
      >
        {text}
      </motion.span>

      {neon && (
        <motion.span
          className="m-0 absolute top-0 left-0 text-transparent bg-clip-text blur-[8px] mix-blend-plus-lighter bg-size-[200%_100%]"
          style={baseStyle}
          animate={{ backgroundPositionX: ['0%', '200%'] }}
          transition={transition}
        >
          {text}
        </motion.span>
      )}
    </span>
  );
}

export { GradientText, type GradientTextProps };
