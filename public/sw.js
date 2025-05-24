// public/sw.js - Versão Otimizada
const CACHE_NAME = 'portfolio-cache-v1.0.5';
const OFFLINE_URL = '/offline.html';

const PRECACHE_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico'
];

// Verificar se deve ser cacheado
function shouldCache(request) {
  const url = new URL(request.url);
  
  if (!url.protocol.startsWith('http')) return false;
  if (url.pathname.startsWith('/api/')) return false;
  if (url.pathname.startsWith('/admin/')) return false;
  if (url.pathname.includes('_next/webpack-hmr')) return false;
  
  return true;
}

// Evento de instalação
self.addEventListener('install', (event) => {
  console.log('[SW] Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching resources');
        return cache.addAll(PRECACHE_RESOURCES.map(url => 
          new Request(url, { cache: 'no-cache' })
        ));
      })
      .catch((error) => {
        console.error('[SW] Precaching failed:', error);
      })
  );

  self.skipWaiting();
});

// Evento de ativação
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// Estratégia de fetch - Cache First com Network Fallback
self.addEventListener('fetch', (event) => {
  if (!shouldCache(event.request)) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            if (event.request.headers.get('Accept')?.includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            return new Response('Offline', { 
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});