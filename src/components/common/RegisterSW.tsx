// src/components/common/RegisterSW.tsx
"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    // Verificação de suporte ao Service Worker
    if ('serviceWorker' in navigator) {
      // Registrar apenas se não estiver em desenvolvimento
      if (process.env.NODE_ENV !== 'development') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('ServiceWorker registration successful', {
                scope: registration.scope,
                active: !!registration.active
              });
            })
            .catch(err => {
              console.error('ServiceWorker registration failed:', err);
            });
        });
      }
    }
  }, []);

  return null;
}