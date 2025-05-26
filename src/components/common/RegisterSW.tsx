// src/components/common/RegisterSW.tsx
"use client";
import { useEffect } from 'react';

export const RegisterSW: React.FC = () => {
  useEffect(() => {
    // Apenas registrar SW em produção
    if (
      'serviceWorker' in navigator && 
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_PWA_ENABLED === 'true'
    ) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    } else {
      // Durante desenvolvimento, desregistrar qualquer SW existente
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister().then(() => {
              console.log('SW unregistered for development');
            });
          }
        });
      }
    }
  }, []);

  return null;
};