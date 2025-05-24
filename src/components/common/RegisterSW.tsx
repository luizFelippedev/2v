'use client';

import { useEffect, useState } from 'react';

interface RegisterSWProps {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function RegisterSW({ onSuccess, onUpdate, onError }: RegisterSWProps = {}) {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker não é suportado neste navegador');
      return;
    }

    if (
      process.env.NODE_ENV === 'development' &&
      process.env.NEXT_PUBLIC_ENABLE_SW_DEV !== 'true'
    ) {
      console.log('Service Worker desabilitado em ambiente de desenvolvimento');
      return;
    }

    const registerSW = async () => {
      try {
        const existingRegistration = await navigator.serviceWorker.getRegistration('/');

        if (existingRegistration) {
          console.log('Service Worker já registrado:', {
            scope: existingRegistration.scope,
            active: !!existingRegistration.active,
          });

          setIsRegistered(true);
          onSuccess?.(existingRegistration);

          if (existingRegistration.waiting) {
            console.log('Nova versão do Service Worker disponível');
            onUpdate?.(existingRegistration);
          }

          return;
        }

        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('Service Worker registrado com sucesso:', {
          scope: registration.scope,
        });

        setIsRegistered(true);
        onSuccess?.(registration);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('Nova versão do Service Worker instalada');
              onUpdate?.(registration);
            }
          };
        };
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Erro ao registrar o Service Worker:', err);
        onError?.(err);
      }
    };

    window.addEventListener('load', registerSW);
    return () => window.removeEventListener('load', registerSW);
  }, [onSuccess, onUpdate, onError]);

  return null;
}

export default RegisterSW;
