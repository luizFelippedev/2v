import React, { forwardRef } from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      variant = "default",
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses = "px-4 py-3 rounded-xl focus:outline-none transition-all";

    const variants = {
      default: "bg-white/5 border border-white/10 focus:border-primary-500",
      filled: "bg-black/20 focus:bg-black/30",
      outlined: "bg-transparent border-2 border-white/20 focus:border-primary-500",
    };

    const inputClasses = clsx(
      baseClasses,
      variants[variant],
      error && "border-red-500",
      fullWidth && "w-full",
      className,
    );

    return (
      <div className={clsx("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <label className="mb-2 text-sm font-medium text-gray-300">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={clsx(
              inputClasses,
              leftIcon && "pl-10",
              rightIcon && "pr-10",
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <span className="mt-1 text-sm text-red-400">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
