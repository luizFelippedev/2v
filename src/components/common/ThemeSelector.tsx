// src/components/common/ThemeSelector.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Monitor, Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "@/contexts";

export const ThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setThemeMode } = useTheme();

  const themes = [
    { id: "dark", name: "Escuro", icon: Moon },
    { id: "light", name: "Claro", icon: Sun },
    { id: "cyberpunk", name: "Cyberpunk", icon: Zap },
    { id: "neon", name: "Neon", icon: Zap },
    { id: "matrix", name: "Matrix", icon: Monitor },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-primary-600 rounded-full text-white shadow-lg hover:bg-primary-700 transition-colors"
      >
        <Palette className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-4 w-48"
          >
            <div className="space-y-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setThemeMode(themeOption.id as any);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      theme.mode === themeOption.id
                        ? "bg-primary-500/20 text-primary-400"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{themeOption.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};