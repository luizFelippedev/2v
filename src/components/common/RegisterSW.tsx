'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Download, X, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface SWUpdateState {
  hasUpdate: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  registration: ServiceWorkerRegistration | null;
}

interface SWStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  version: string | null;
  lastUpdate: Date | null;
}

export function RegisterSW() {
  const [updateState, setUpdateState] = useState<SWUpdateState>({
    hasUpdate: false,
    isInstalling: false,
    isWaiting: false,
    registration: null,
  });

  const [status, setStatus] = useState<SWStatus>({
    isSupported: false,
    isRegistered: false,
    isOnline: true,
    version: null,
    lastUpdate: null,
  });

  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Verificar suporte e configurações
  const checkSWSupport = useCallback(() => {
    const isSupported = 'serviceWorker' in navigator;
    const isDev = process.env.NODE_ENV === 'development';
    const isEnabled = process.env.NEXT_PUBLIC_PWA_ENABLED === 'true';
    const devEnabled = process.env.NEXT_PUBLIC_ENABLE_SW_DEV === 'true';

    setStatus(prev => ({ ...prev, isSupported }));

    if (!isSupported) {
      console.warn('SW: Service Worker não é suportado neste navegador');
      return false;
    }

    if (isDev && !devEnabled) {
      console.log('SW: Service Worker desabilitado em desenvolvimento');
      console.log('SW: Para habilitar, defina NEXT_PUBLIC_ENABLE_SW_DEV=true');
      return false;
    }

    if (!isEnabled && !isDev) {
      console.log('SW: PWA desabilitado. Para habilitar, defina NEXT_PUBLIC_PWA_ENABLED=true');
      return false;
    }

    return true;
  }, []);

  // Registrar Service Worker
  const registerSW = useCallback(async () => {
    if (!checkSWSupport()) return;

    try {
      // Verificar se já existe registro
      const existingRegistration = await navigator.serviceWorker.getRegistration('/');

      if (existingRegistration) {
        console.log('SW: Service Worker já registrado:', {
          scope: existingRegistration.scope,
          active: !!existingRegistration.active,
          waiting: !!existingRegistration.waiting,
          installing: !!existingRegistration.installing,
        });

        setUpdateState(prev => ({ ...prev, registration: existingRegistration }));
        setStatus(prev => ({ 
          ...prev, 
          isRegistered: true,
          lastUpdate: new Date()
        }));

        setupRegistrationListeners(existingRegistration);

        // Verificar se há atualização pendente
        if (existingRegistration.waiting) {
          setUpdateState(prev => ({ 
            ...prev, 
            hasUpdate: true, 
            isWaiting: true 
          }));
          setShowUpdatePrompt(true);
        }

        return existingRegistration;
      }

      // Registrar novo Service Worker
      console.log('SW: Registrando novo Service Worker...');
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Sempre verificar atualizações
      });

      console.log('SW: Service Worker registrado com sucesso:', {
        scope: registration.scope,
        updateViaCache: registration.updateViaCache,
      });

      setUpdateState(prev => ({ ...prev, registration }));
      setStatus(prev => ({ 
        ...prev, 
        isRegistered: true,
        lastUpdate: new Date()
      }));

      setupRegistrationListeners(registration);

      // Obter versão do SW
      getServiceWorkerVersion(registration);

      return registration;

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('SW: Erro ao registrar o Service Worker:', err);
      
      setStatus(prev => ({ ...prev, isRegistered: false }));
      
      // Analytics de erro (se disponível)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: `SW Registration Error: ${err.message}`,
          fatal: false,
        });
      }
    }
  }, [checkSWSupport]);

  // Configurar listeners do registro
  const setupRegistrationListeners = useCallback((registration: ServiceWorkerRegistration) => {
    // Listener para novas atualizações encontradas
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (!newWorker) return;

      console.log('SW: Nova atualização encontrada');
      setUpdateState(prev => ({ ...prev, isInstalling: true }));

      newWorker.addEventListener('statechange', () => {
        console.log('SW: Estado mudou para:', newWorker.state);

        switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // Nova versão instalada, mas ainda há uma versão ativa
              console.log('SW: Nova versão instalada e aguardando');
              setUpdateState(prev => ({ 
                ...prev, 
                hasUpdate: true, 
                isInstalling: false,
                isWaiting: true 
              }));
              setShowUpdatePrompt(true);
            } else {
              // Primeira instalação
              console.log('SW: Service Worker instalado pela primeira vez');
              setUpdateState(prev => ({ 
                ...prev, 
                isInstalling: false 
              }));
            }
            break;

          case 'activated':
            console.log('SW: Service Worker ativado');
            setUpdateState(prev => ({ 
              ...prev, 
              hasUpdate: false,
              isWaiting: false 
            }));
            break;

          case 'redundant':
            console.log('SW: Service Worker se tornou redundante');
            break;
        }
      });
    });

    // Listener para controle ativo
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('SW: Controlador mudou - recarregando página');
      if (!isUpdating) {
        window.location.reload();
      }
    });

  }, [isUpdating]);

  // Obter versão do Service Worker
  const getServiceWorkerVersion = useCallback(async (registration: ServiceWorkerRegistration) => {
    try {
      if (registration.active) {
        const messageChannel = new MessageChannel();
        
        const versionPromise = new Promise<string>((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data.version || 'unknown');
          };
          
          setTimeout(() => resolve('timeout'), 5000);
        });

        registration.active.postMessage(
          { type: 'GET_VERSION' }, 
          [messageChannel.port2]
        );

        const version = await versionPromise;
        setStatus(prev => ({ ...prev, version }));
        console.log('SW: Versão:', version);
      }
    } catch (error) {
      console.warn('SW: Erro ao obter versão:', error);
    }
  }, []);

  // Aplicar atualização
  const applyUpdate = useCallback(async () => {
    if (!updateState.registration?.waiting) {
      console.warn('SW: Nenhuma atualização aguardando');
      return;
    }

    try {
      setIsUpdating(true);
      setShowUpdatePrompt(false);

      console.log('SW: Aplicando atualização...');
      
      // Enviar mensagem para o SW waiting assumir controle
      updateState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Aguardar um pouco antes de recarregar
      setTimeout(() => {
        console.log('SW: Recarregando página...');
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('SW: Erro ao aplicar atualização:', error);
      setIsUpdating(false);
    }
  }, [updateState.registration]);

  // Verificar status online/offline
  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      console.log('SW: Voltou online');
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
      console.log('SW: Ficou offline');
    };

    // Estado inicial
    setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listener para mensagens do Service Worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, message } = event.data;

      switch (type) {
        case 'UPDATE_AVAILABLE':
          console.log('SW: Atualização disponível via mensagem');
          setUpdateState(prev => ({ ...prev, hasUpdate: true }));
          setShowUpdatePrompt(true);
          break;

        case 'CACHE_UPDATED':
          console.log('SW: Cache atualizado');
          break;

        default:
          console.log('SW: Mensagem recebida:', { type, message });
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);

  // Verificar atualizações periodicamente
  useEffect(() => {
    if (!status.isRegistered || !updateState.registration) return;

    const checkForUpdates = async () => {
      try {
        console.log('SW: Verificando atualizações...');
        await updateState.registration!.update();
      } catch (error) {
        console.warn('SW: Erro ao verificar atualizações:', error);
      }
    };

    // Verificar imediatamente
    checkForUpdates();

    // Verificar a cada 60 minutos
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [status.isRegistered, updateState.registration]);

  // Registrar quando a página carregar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        window.addEventListener('load', registerSW);
      } else {
        registerSW();
      }
    }

    return () => {
      window.removeEventListener('load', registerSW);
    };
  }, [registerSW]);

  // Debug info em desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('SW Debug Info:', {
        status,
        updateState,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          PWA_ENABLED: process.env.NEXT_PUBLIC_PWA_ENABLED,
          ENABLE_SW_DEV: process.env.NEXT_PUBLIC_ENABLE_SW_DEV,
        }
      });
    }
  }, [status, updateState]);

  return (
    <>
      {/* Status Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            {status.isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span>SW Status</span>
          </div>
          <div className="space-y-1">
            <div>Suportado: {status.isSupported ? '✓' : '✗'}</div>
            <div>Registrado: {status.isRegistered ? '✓' : '✗'}</div>
            <div>Online: {status.isOnline ? '✓' : '✗'}</div>
            {status.version && <div>Versão: {status.version}</div>}
          </div>
        </div>
      )}

      {/* Update Prompt */}
      <AnimatePresence>
        {showUpdatePrompt && updateState.hasUpdate && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 max-w-sm shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">
                  Atualização Disponível
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Uma nova versão do site está disponível. Aplicar agora para obter as últimas melhorias?
                </p>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={applyUpdate}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Atualizar
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUpdatePrompt(false)}
                    className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Indicator */}
      <AnimatePresence>
        {!status.isOnline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 py-2 px-4"
          >
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <WifiOff className="w-4 h-4" />
              Você está offline. Algumas funcionalidades podem estar limitadas.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Installation Success */}
      <AnimatePresence>
        {status.isRegistered && status.lastUpdate && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed bottom-4 right-4 z-40 bg-green-500/20 border border-green-500/30 rounded-lg p-4 max-w-sm"
            style={{ display: showUpdatePrompt ? 'none' : 'block' }}
          >
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Site otimizado para uso offline
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default RegisterSW;