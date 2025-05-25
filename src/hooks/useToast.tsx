import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from '@/components/ui/Toast';
import { nanoid } from 'nanoid';
import { AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastContextValue {
  showToast: (type: Toast['type'], message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = (type: Toast['type'], message: string, duration?: number) => {
    const id = nanoid();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
              {toasts.map(toast => (
                <Toast
                  key={toast.id}
                  id={toast.id}
                  type={toast.type}
                  message={toast.message}
                  onClose={removeToast}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
