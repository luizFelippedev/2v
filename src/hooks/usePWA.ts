// src/hooks/usePWA.ts
import { useState, useEffect, useCallback } from 'react';

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UsePWAReturn {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  deferredPrompt: PWAInstallPrompt | null;
  promptInstall: () => Promise<boolean>;
  dismissInstall: () => void;
  checkForUpdates: () => Promise<boolean>;
  applyUpdate: () => void;
}

/**
 * Hook para gerenciar funcionalidades de PWA como instalação,
 * status online/offline e atualizações
 */
export function usePWA(): UsePWAReturn {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);

  // Verificar se o app está instalado
  useEffect(() => {
    const checkInstallState = () => {
      // Diferentes plataformas têm métodos diferentes para verificar
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isAppleStandalone = (navigator as any).standalone === true;
      setIsInstalled(isStandalone || isAppleStandalone);
    };

    // Verificar inicialmente
    if (typeof window !== 'undefined') {
      checkInstallState();

      // Verificar novamente se houver mudança no modo de exibição
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      const listener = () => checkInstallState();
      
      // Usar método moderno se disponível
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else {
        // Fallback para navegadores mais antigos
        (mediaQuery as any).addListener(listener);
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', listener);
        } else {
          (mediaQuery as any).removeListener(listener);
        }
      };
    }
  }, []);

  // Monitorar status de online/offline
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Definir estado inicial
    setIsOnline(navigator.onLine);

    // Adicionar listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Capturar evento beforeinstallprompt para permitir instalação personalizada
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir o prompt automático
      e.preventDefault();
      
      // Armazenar o evento para uso posterior
      setDeferredPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
    };

    // Capturar evento appinstalled para atualizar estado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      
      // Poderia enviar eventos de analytics aqui
      console.log('App foi instalado com sucesso');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Monitorar atualizações do service worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Verifica se o navegador suporta serviceWorker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (!newWorker) return;
          
          newWorker.addEventListener('statechange', () => {
            // Nova versão instalada e pronta para assumir
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      });

      // Escutar mensagens de atualização do service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  // Mostrar prompt de instalação
  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('Nenhum prompt de instalação disponível');
      return false;
    }

    try {
      // Mostrar o prompt de instalação
      await deferredPrompt.prompt();
      
      // Aguardar a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;
      
      // Limpar o prompt armazenado
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
        return true;
      } else {
        console.log('Usuário recusou a instalação');
        return false;
      }
    } catch (error) {
      console.error('Erro ao exibir prompt de instalação:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Dispensar o prompt de instalação
  const dismissInstall = useCallback(() => {
    setDeferredPrompt(null);
  }, []);

  // Verificar se há atualizações disponíveis
  const checkForUpdates = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Forçar verificação de atualizações
      await registration.update();
      
      if (registration.waiting) {
        setUpdateAvailable(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
      return false;
    }
  }, []);

  // Aplicar atualização disponível
  const applyUpdate = useCallback(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        // Enviar mensagem para o service worker waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Recarregar a página após uma breve pausa
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });
  }, []);

  return {
    isInstalled,
    isInstallable,
    isOnline,
    updateAvailable,
    deferredPrompt,
    promptInstall,
    dismissInstall,
    checkForUpdates,
    applyUpdate
  };
}

export default usePWA;