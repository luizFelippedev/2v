// Add this to the top of your /frontend/src/contexts/index.tsx file
"use client";
import React from "react";
import { ThemeProvider, ThemeContext, useTheme } from "./ThemeContext";
import { AuthProvider, AuthContext, useAuth } from "./AuthContext";
import { DataProvider } from "./DataContext";

export { ThemeProvider, ThemeContext, useTheme } from './ThemeContext';
export { AuthProvider, AuthContext, useAuth } from './AuthContext';
export { useData } from './DataContext';

// Make sure this component is exported and used in your layout.tsx
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>{children}</DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};