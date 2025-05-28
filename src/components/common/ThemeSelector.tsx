// src/components/common/ThemeSelector.tsx
"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Moon, 
  Sun, 
  Zap, 
  Sparkles,
  Cpu,
  Eye,
  Check
} from "lucide-react";
import { useTheme } from "@/contexts";

// Remover type Theme duplicado e usar o tipo do contexto
interface ThemeOption {
  id: "light" | "dark" | "cyberpunk" | "neon" | "matrix";
  name: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  description: string;
}

export const ThemeSelector: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setThemeMode } = useTheme();

  // Memoizar temas para evitar recriação a cada render
  const themes = useMemo<ThemeOption[]>(() => [
    { 
      id: "dark", 
      name: "Escuro", 
      icon: <Moon className="w-4 h-4" />,
      colors: {
        primary: "#60a5fa",
        secondary: "#a78bfa", 
        background: "#0f172a"
      },
      description: "Tema padrão escuro"
    },
    { 
      id: "light", 
      name: "Claro", 
      icon: <Sun className="w-4 h-4" />,
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        background: "#ffffff"
      },
      description: "Tema claro para o dia"
    },
    { 
      id: "cyberpunk", 
      name: "Cyberpunk", 
      icon: <Zap className="w-4 h-4" />,
      colors: {
        primary: "#00ffff",
        secondary: "#ff00ff",
        background: "#0a0a0a"
      },
      description: "Futuro neon cyberpunk"
    },
    { 
      id: "neon", 
      name: "Neon", 
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: "#ff0080",
        secondary: "#8000ff",
        background: "#000000"
      },
      description: "Cores vibrantes neon"
    },
    { 
      id: "matrix", 
      name: "Matrix", 
      icon: <Cpu className="w-4 h-4" />,
      colors: {
        primary: "#00ff41",
        secondary: "#008f11",
        background: "#000000"
      },
      description: "Estilo Matrix verde"
    },
  ], []);

  // Memoizar tema atual
  const currentTheme = useMemo(() => 
    themes.find(t => t.id === theme.mode) || themes[0]
  , [theme.mode, themes]);

  const handleThemeChange = React.useCallback((themeId: ThemeOption['id']) => {
    setThemeMode(themeId);
    setIsOpen(false);
  }, [setThemeMode]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Theme Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-4 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 text-white shadow-2xl hover:bg-white/10 transition-all group"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
          borderColor: `${currentTheme.colors.primary}30`
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
        </motion.div>
        
        {/* Notification Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />

        {/* Hover Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10, x: 10 }}
          whileHover={{ opacity: 1, y: 0, x: 0 }}
          className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/90 backdrop-blur-sm text-white text-sm rounded-lg border border-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          Trocar Tema
          <div className="absolute top-full right-4 w-2 h-2 bg-black/90 rotate-45 border-r border-b border-white/20" />
        </motion.div>
      </motion.button>

      {/* Theme Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-80 shadow-2xl"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Selecionar Tema
                </h3>
                <p className="text-gray-400 text-sm">
                  Escolha o tema que combina com você
                </p>
              </div>

              <div className="space-y-3">
                {themes.slice(0, 2).map((themeOption, index) => { // Só mostra dark/light por enquanto
                  const isSelected = themeOption.id === theme.mode; // Corrigido: comparar com theme.mode
                  
                  return (
                    <motion.button
                      key={themeOption.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleThemeChange(themeOption.id)}
                      className={`w-full flex items-center p-4 rounded-xl transition-all group ${
                        isSelected
                          ? "bg-white/10 border-2"
                          : "hover:bg-white/5 border-2 border-transparent"
                      }`}
                      style={{
                        borderColor: isSelected ? themeOption.colors.primary : 'transparent'
                      }}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Theme Icon */}
                        <div 
                          className="p-2 rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${themeOption.colors.primary}20, ${themeOption.colors.secondary}20)`,
                            color: themeOption.colors.primary
                          }}
                        >
                          {themeOption.icon}
                        </div>

                        {/* Theme Info */}
                        <div className="text-left flex-1">
                          <div className="text-white font-medium">
                            {themeOption.name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {themeOption.description}
                          </div>
                        </div>

                        {/* Color Preview */}
                        <div className="flex space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: themeOption.colors.primary }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: themeOption.colors.secondary }}
                          />
                        </div>

                        {/* Selection Indicator */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: isSelected ? 1 : 0 }}
                          className="flex items-center justify-center w-6 h-6 rounded-full"
                          style={{ 
                            backgroundColor: isSelected ? themeOption.colors.primary : 'transparent'
                          }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Coming Soon Themes */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-gray-500 text-xs mb-2">Em breve:</p>
                  {themes.slice(2).map((themeOption, index) => (
                    <motion.div
                      key={themeOption.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 2) * 0.1 }}
                      className="w-full flex items-center p-3 rounded-lg opacity-50 cursor-not-allowed"
                    >
                      <div 
                        className="p-2 rounded-lg mr-3"
                        style={{
                          background: `linear-gradient(135deg, ${themeOption.colors.primary}20, ${themeOption.colors.secondary}20)`,
                          color: themeOption.colors.primary
                        }}
                      >
                        {themeOption.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-gray-400 font-medium text-sm">
                          {themeOption.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {themeOption.description}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: themeOption.colors.primary }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: themeOption.colors.secondary }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <p className="text-gray-500 text-xs">
                  Tema atual: <span className="text-white">{currentTheme.name}</span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

ThemeSelector.displayName = 'ThemeSelector';