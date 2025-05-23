// src/components/common/PWA.tsx
import React, { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor,
  Zap 
} from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

// Componente PWA
export const PWA: FC = () => {
  const { 
    isInstalled,
    isInstallable,
    isOnline,
    updateAvailable,
    deferredPrompt,
    promptInstall,
    dismissInstall,
    applyUpdate
  } = usePWA();

  // Estado para controlar a exibição do prompt de instalação
  const [showInstallPrompt, setShowInstallPrompt] = React.useState<boolean>(false);

  // Verificar se deve mostrar o prompt com base nas condições
  React.useEffect(() => {
    if (isInstallable && deferredPrompt && !isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
      // Atrasar o prompt para não interromper imediatamente a experiência do usuário
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, deferredPrompt, isInstalled]);

  // Função para lidar com a instalação do PWA
  const handleInstall = async () => {
    const success = await promptInstall();
    
    if (success) {
      console.log('Instalação aceita');
      localStorage.setItem('pwa-installed', 'true');
    } else {
      console.log('Instalação cancelada');
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
    
    setShowInstallPrompt(false);
  };

  // Função para descartar o prompt de instalação
  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowInstallPrompt(false);
    dismissInstall();
  };

  // Função para tratar atualizações
  const handleUpdate = () => {
    applyUpdate();
    setUpdateAvailable(false);
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
            className="fixed bottom-4 right-4 z-50 bg-black/80 dark:bg-gray-900 p-5 rounded-lg shadow-xl max-w-sm border border-white/20 dark:border-gray-700"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                {window.innerWidth < 768 ? <Smartphone className="text-white" /> : <Monitor className="text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Instalar Portfolio</h3>
                <p className="text-sm text-gray-300">
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
                    className="text-sm text-gray-400 hover:text-gray-200"
                  >
                    Agora não
                  </button>
                </div>
              </div>
              <button 
                onClick={handleDismiss} 
                className="text-gray-400 hover:text-white"
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