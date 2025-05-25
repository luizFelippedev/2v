import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ProgressProps {
  value: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelPosition?: 'top' | 'right';
  className?: string;
  animated?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  labelPosition = 'right',
  className = '',
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-400">Progresso</span>
          <span className="text-sm text-gray-300">{percentage.toFixed(0)}%</span>
        </div>
      )}

      <div className="relative">
        <div className={clsx(
          'w-full rounded-full bg-gray-700',
          sizes[size]
        )}>
          <motion.div
            initial={animated ? { width: 0 } : { width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: animated ? 0.8 : 0 }}
            className={clsx(
              'rounded-full',
              colors[color],
              sizes[size]
            )}
          />
        </div>

        {showLabel && labelPosition === 'right' && (
          <span className="ml-2 text-sm text-gray-300">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};
