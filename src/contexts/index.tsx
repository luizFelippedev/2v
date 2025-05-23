// Add this to the top of your /frontend/src/contexts/index.tsx file
"use client";
import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { DataProvider } from "./DataContext";

export { useTheme } from './ThemeContext';
export { useAuth } from './AuthContext';
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