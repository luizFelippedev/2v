import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export function useNotification() {
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = useCallback((
    message: string,
    type: NotificationType = 'info',
    options?: NotificationOptions
  ) => {
    setIsVisible(true);
    
    const toastOptions = {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      className: 'bg-black/80 backdrop-blur-xl border border-white/10',
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast(message, {
          ...toastOptions,
          icon: '⚠️',
        });
        break;
      default:
        toast(message, toastOptions);
    }

    setTimeout(() => setIsVisible(false), toastOptions.duration);
  }, []);

  return { showNotification, isVisible };
}