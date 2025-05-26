"use client";

// Exportações simples dos hooks e providers
export { ThemeProvider, useTheme } from './ThemeContext';
export { AuthProvider, useAuth } from './AuthContext';
export { DataProvider, useData } from './DataContext';

// Componente provedor combinado
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { DataProvider } from './DataContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
        {children}
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
