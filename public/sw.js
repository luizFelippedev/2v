// public/sw.js
const CACHE_NAME = 'portfolio-cache-v1.0.2';
const OFFLINE_URL = '/offline.html';

// Recursos essenciais para pré-cache
const PRECACHE_RESOURCES = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/icons/icon-192x192.png'
];

// Middleware para verificar se a solicitação deve ser armazenada em cache
function shouldCache(request) {
  const url = new URL(request.url);
  
  // Ignorar URLs não HTTP(S)
  if (!url.protocol.startsWith('http')) return false;

  // Ignorar solicitações de API
  if (url.pathname.startsWith('/api/')) return false;

  // Ignorar rotas administrativas
  if (url.pathname.startsWith('/admin/')) return false;

  // Ignorar recursos de desenvolvimento
  if (url.pathname.includes('_next/webpack-hmr')) return false;

  return true;
}

// Evento de instalação - pré-cache recursos
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Precaching resources');
        return cache.addAll(PRECACHE_RESOURCES.map(url => new Request(url, { cache: 'no-cache' })));
      })
      .catch((error) => {
        console.error('[ServiceWorker] Precaching failed:', error);
      })
  );

  // Ativa o novo service worker imediatamente
  self.skipWaiting();
});

// Evento de ativação - limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Assume o controle imediato de todas as páginas
  return self.clients.claim();
});

// Estratégia de busca em cache
self.addEventListener('fetch', (event) => {
  // Ignorar solicitações que não devem ser cacheadas
  if (!shouldCache(event.request)) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }

        // Busca na rede, atualiza cache
        return fetch(event.request)
          .then((networkResponse) => {
            // Verifica se a resposta é válida para cache
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clona a resposta para cache
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn('[ServiceWorker] Cache update failed:', error);
              });

            return networkResponse;
          })
          .catch(() => {
            // Fallback para offline
            if (event.request.headers.get('Accept')?.includes('text/html')) {
              return caches.match(OFFLINE_URL) || new Response('Sem conexão', { status: 503 });
            }
          });
      })
  );
});

// Mensagens personalizadas
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.all(
          urls.map(url => 
            cache.add(url).catch(err => console.warn(`Failed to cache ${url}:`, err))
          )
        );
      });
  }
});

// Log de erros não tratados
self.addEventListener('error', (event) => {
  console.error('[ServiceWorker] Unhandled error:', event);
});