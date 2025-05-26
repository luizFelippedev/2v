// src/contexts/ThemeContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeMode = "light" | "dark" | "cyberpunk" | "neon" | "matrix";

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
}

interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  name: string;
  description: string;
}

interface ThemeContextType {
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  availableThemes: Theme[];
}

const themes: Record<ThemeMode, Theme> = {
  dark: {
    mode: "dark",
    name: "Escuro",
    description: "Tema padrão escuro",
    colors: {
      primary: "#60a5fa",
      secondary: "#a78bfa",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f8fafc",
      textSecondary: "#94a3b8",
      border: "#334155",
      accent: "#fbbf24",
    },
  },
  light: {
    mode: "light",
    name: "Claro",
    description: "Tema claro para o dia",
    colors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      accent: "#f59e0b",
    },
  },
  cyberpunk: {
    mode: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuro neon cyberpunk",
    colors: {
      primary: "#00ffff",
      secondary: "#ff00ff",
      background: "#0a0a0a",
      surface: "#1a1a1a",
      text: "#ffffff",
      textSecondary: "#cccccc",
      border: "#333333",
      accent: "#ffff00",
    },
  },
  neon: {
    mode: "neon",
    name: "Neon",
    description: "Cores vibrantes neon",
    colors: {
      primary: "#ff0080",
      secondary: "#8000ff",
      background: "#000000",
      surface: "#111111",
      text: "#ffffff",
      textSecondary: "#dddddd",
      border: "#444444",
      accent: "#00ff80",
    },
  },
  matrix: {
    mode: "matrix",
    name: "Matrix",
    description: "Estilo Matrix verde",
    colors: {
      primary: "#00ff41",
      secondary: "#008f11",
      background: "#000000",
      surface: "#001100",
      text: "#00ff41",
      textSecondary: "#00cc33",
      border: "#004400",
      accent: "#55ff55",
    },
  },
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeMode, setCurrentThemeMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode;
    if (stored && themes[stored]) {
      setCurrentThemeMode(stored);
    }
  }, []);

  useEffect(() => {
    const theme = themes[currentThemeMode];
    const root = document.documentElement;
    
    // Aplicar variáveis CSS customizadas
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-accent', theme.colors.accent);
    
    // Aplicar classes do tema
    root.classList.remove('theme-dark', 'theme-light', 'theme-cyberpunk', 'theme-neon', 'theme-matrix');
    root.classList.add(`theme-${currentThemeMode}`);
    
    // Manter compatibilidade com dark mode
    root.classList.toggle("dark", currentThemeMode !== "light");
    
    localStorage.setItem("theme", currentThemeMode);
  }, [currentThemeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setCurrentThemeMode(mode);
  };

  const toggleTheme = () => {
    setCurrentThemeMode(prev => prev === "dark" ? "light" : "dark");
  };

  const value: ThemeContextType = {
    theme: themes[currentThemeMode],
    setThemeMode,
    toggleTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}