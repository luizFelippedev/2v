// src/components/common/PWAManager.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Monitor } from "lucide-react";

// Interface para o evento de instalação do PWA
interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAManager: React.FC = () => {
  // Estados com tipagem explícita
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // Função para registrar o Service Worker
  const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    // Verifica se já está registrado ou se não suporta Service Worker
    if (isRegistered || !('serviceWorker' in navigator)) return null;

    try {
      // Tenta obter registro existente
      const existingRegistration = await navigator.serviceWorker.getRegistration('/');
      
      if (existingRegistration) {
        console.log('ServiceWorker already registered', existingRegistration);
        setIsRegistered(true);
        return existingRegistration;
      }

      // Registra novo Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js', { 
        scope: '/' 
      });

      console.log('ServiceWorker registration successful', registration);
      setIsRegistered(true);

      // Verificar atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      return null;
    }
  };

  useEffect(() => {
    // Verificação de suporte e registro do Service Worker
    registerServiceWorker();

    // Verificar estado de instalação do PWA
    const checkPWAInstallStatus = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (navigator as any).standalone === true) {
        setIsInstalled(true);
      }
    };

    // Configurar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      // Importante: Apenas previne o comportamento padrão se quiser adiar
      e.preventDefault();
      
      // Armazena o evento para uso posterior
      setDeferredPrompt(e as PWAInstallPrompt);
      
      // Mostra prompt de instalação após um tempo
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    };

    // Eventos de online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Registrar eventos
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Executa verificações iniciais
    checkPWAInstallStatus();

    // Limpar eventos
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  // Função para lidar com a instalação do PWA
  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.warn('Não há prompt de instalação disponível');
      return;
    }

    try {
      // Mostra o prompt de instalação
      await deferredPrompt.prompt();
      
      // Espera a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Instalação aceita');
        setIsInstalled(true);
        localStorage.setItem('pwa-installed', 'true');
      } else {
        console.log('Instalação cancelada');
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
    } catch (error) {
      console.error('Erro durante a instalação:', error);
    } finally {
      // Limpa o prompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  // Função para atualizar o Service Worker
  const handleUpdate = () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  };

  // Função para descartar o prompt de instalação
  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 text-center py-2 px-4"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-900 rounded-full animate-pulse" />
              <span className="font-medium">Você está offline</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Banner */}
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
                onClick={handleUpdate} 
                className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-semibold hover:bg-blue-50"
              >
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

      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && deferredPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 p-5 rounded-lg shadow-xl max-w-sm border dark:border-gray-700"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                {window.innerWidth < 768 ? <Smartphone className="text-white" /> : <Monitor className="text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Instalar Portfolio</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Instale o site como app para melhor desempenho e acesso offline.
                </p>
                <div className="flex mt-3 gap-3">
                  <button 
                    onClick={handleInstall} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Instalar
                  </button>
                  <button 
                    onClick={handleDismiss} 
                    className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white"
                  >
                    Agora não
                  </button>
                </div>
              </div>
              <button 
                onClick={handleDismiss} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hook para reutilização das funcionalidades do PWA
export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const checkInstallStatus = () => {
      setIsInstalled(
        window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as any).standalone === true
      );
      setIsOnline(navigator.onLine);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    checkInstallStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isInstalled, isOnline };
};