"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import { clsx } from "clsx";

interface CardProps extends MotionProps {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  ...motionProps
}) => {
  const classes = clsx(
    "bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6 transition-all",
    className
  );

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
