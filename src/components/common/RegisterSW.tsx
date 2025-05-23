// src/components/common/RegisterSW.tsx
"use client";

import { useEffect, useState } from "react";

interface RegisterSWProps {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function RegisterSW({ onSuccess, onUpdate, onError }: RegisterSWProps = {}) {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Verificação de suporte ao Service Worker
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker não é suportado neste navegador');
      return;
    }

    // Não registrar em desenvolvimento, a menos que seja explicitamente habilitado
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_SW_DEV !== 'true') {
      console.log('Service Worker desabilitado em ambiente de desenvolvimento');
      return;
    }

    const registerSW = async () => {
      try {
        // Verificar registros existentes
        const existingRegistration = await navigator.serviceWorker.getRegistration('/');
        
        if (existingRegistration) {
          console.log('Service Worker já registrado', {
            scope: existingRegistration.scope,
            active: !!existingRegistration.active
          });
          
          setIsRegistered(true);
          onSuccess?.(existingRegistration);
          
          // Verificar atualizações
          if (existingRegistration.waiting) {
            console.log('Nova versão do Service Worker disponível');
            onUpdate?.(existingRegistration);
          }
          
          return;
        }
        
        // Registrar um novo Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('Service Worker registrado com sucesso', {
          scope: registration.scope
        });
        
        setIsRegistered(true);
        onSuccess?.(registration);
        
        // Verificar atualizações futuras
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;
          
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nova versão do Service Worker instalada');
              onUpdate?.(registration);
            }
          };
        };
      } catch (error) {
        console.error('Erro ao registrar o Service Worker:', error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    // Registrar quando a página for carregada completamente
    window.addEventListener('load', registerSW);

    // Cleanup
    return () => {
      window.removeEventListener('load', registerSW);
    };
  }, [onSuccess, onUpdate, onError]);

  return null;
}

export default RegisterSW;