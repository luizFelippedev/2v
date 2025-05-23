// app/components/PWAManager.tsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Monitor } from "lucide-react";

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAManager = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    if ("serviceWorker" in navigator) registerServiceWorker();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as PWAInstallPrompt);
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem("pwa-install-dismissed")) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isInstalled]);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });

      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "UPDATE_AVAILABLE") {
          setUpdateAvailable(true);
        }
      });
    } catch (err) {
      console.error("Erro ao registrar SW:", err);
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("Instalação aceita");
    } else {
      localStorage.setItem("pwa-install-dismissed", "true");
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true");
    setShowInstallPrompt(false);
  };

  const handleUpdate = () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    });
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
              <button onClick={handleUpdate} className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-semibold hover:bg-blue-50">
                Atualizar
              </button>
              <button onClick={() => setUpdateAvailable(false)} className="hover:bg-blue-600 p-1 rounded">
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
                  <button onClick={handleInstall} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" /> Instalar
                  </button>
                  <button onClick={handleDismiss} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    Agora não
                  </button>
                </div>
              </div>
              <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hook para reutilização
export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true
    );
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isInstalled, isOnline };
};

// Preloader opcional
export const ResourcePreloader = ({ resources }: { resources: string[] }) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ type: "CACHE_URLS", urls: resources });
      });
    }
  }, [resources]);

  return null;
};
