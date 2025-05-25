import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  animated = true
}) => {
  const baseClasses = 'bg-gray-700/50 relative overflow-hidden';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const styles = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100px')
  };

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        animated && 'after:absolute after:inset-0 after:translate-x-[-100%] after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:animate-shimmer',
        className
      )}
      style={styles}
      role="status"
      aria-label="Loading..."
    />
  );
};
