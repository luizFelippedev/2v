"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  width?: string;
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  width = '300px',
  title,
  children,
}) => {
  // Prevenir scroll quando drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const slideDirections = {
    left: {
      open: { x: 0 },
      closed: { x: '-100%' },
    },
    right: {
      open: { x: 0 },
      closed: { x: '100%' },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={slideDirections[position].closed}
            animate={slideDirections[position].open}
            exit={slideDirections[position].closed}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed top-0 ${position}-0 h-full bg-black/20 backdrop-blur-xl border-l border-white/10 z-50`}
            style={{ width }}
          >
            {/* Header */}
            {(title || typeof onClose === "function") && (
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
                {typeof onClose === "function" && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded hover:bg-white/10 transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4 h-full overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
