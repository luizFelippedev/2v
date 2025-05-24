'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';

export function RegisterSW() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Verificar estado online/offline
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Registrar Service Worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW: Service Worker registrado com sucesso:', registration.scope);
        setIsRegistered(true);

        // Verificar por updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });

        // Detectar mudanças no controller
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('SW: Controller changed - reload may be needed');
        });
      } catch (error) {
        console.error('SW: Erro ao registrar Service Worker:', error);
      }
    };

    // Verificar se deve registrar o SW
    const shouldRegisterSW = process.env.NEXT_PUBLIC_PWA_ENABLED === 'true' || process.env.NODE_ENV === 'production';
    
    if (shouldRegisterSW) {
      if (document.readyState === 'complete') {
        registerServiceWorker();
      } else {
        window.addEventListener('load', registerServiceWorker);
        return () => window.removeEventListener('load', registerServiceWorker);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Aplicar atualização
  const applyUpdate = () => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        // Enviar mensagem para o service worker aplicar a atualização
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Recarregar a página para aplicar as mudanças
        window.location.reload();
      }
    });
  };

  return (
    <>
      {/* Banner de Atualização */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white py-3 px-4 text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <span>Nova versão disponível!</span>
              <button 
                onClick={applyUpdate} 
                className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-semibold hover:bg-blue-50"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Atualizar
              </button>
              <button 
                onClick={() => setUpdateAvailable(false)} 
                className="hover:bg-blue-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador Offline */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 py-2 px-4"
          >
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <div className="w-2 h-2 bg-yellow-900 rounded-full animate-pulse"></div>
              Você está offline. Algumas funcionalidades podem estar limitadas.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default RegisterSW;