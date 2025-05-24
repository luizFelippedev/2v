// src/components/advanced/AdvancedComponents.tsx - Componentes avançados

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  Shield, 
  Cpu, 
  MonitorSpeaker,
  Sparkles,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Settings,
  Download,
  Share2
} from 'lucide-react';

// Sistema de Notificações Avançado
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  persistent?: boolean;
  icon?: React.ReactNode;
}

export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove se não for persistente
    if (!notification.persistent) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'error': return 'from-red-500/20 to-red-600/20 border-red-500/30';
      case 'warning': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 'info': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  // Expor função globalmente
  useEffect(() => {
    (window as any).addNotification = addNotification;
  }, [addNotification]);

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            className={`bg-gradient-to-r ${getColors(notification.type)} backdrop-blur-xl rounded-2xl border p-4 shadow-2xl`}
          >
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0">
                {notification.icon || getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white mb-1">
                  {notification.title}
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  {notification.message}
                </p>
                
                {notification.actions && (
                  <div className="flex gap-2">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          action.variant === 'primary'
                            ? 'bg-white/20 hover:bg-white/30 text-white'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Monitor de Performance em Tempo Real
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    loadTime: 0,
    score: 100,
  });
  
  const [isVisible, setIsVisible] = useState(