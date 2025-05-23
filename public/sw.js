// public/sw.js
const CACHE_NAME = 'portfolio-cache-v1.0.4';
const OFFLINE_URL = '/offline.html';

// Recursos essenciais para pré-cache
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
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

// Estratégia de busca em cache: Cache First, falling back to network
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
          .catch((error) => {
            // Fallback para offline
            console.log('[ServiceWorker] Fetch failed:', error);
            
            if (event.request.headers.get('Accept')?.includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            // Se não for um pedido HTML, retorna um erro específico
            return new Response('Sem conexão', { 
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Mensagens personalizadas
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
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

// Evento para escutar atualizações
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Estratégia para sincronização offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Implementação básica de sincronização
async function syncData() {
  // Esta função seria implementada para sincronizar dados
  // que foram armazenados localmente enquanto o usuário estava offline
  console.log('[ServiceWorker] Syncing data');
  // Por exemplo: buscar todos os posts de um IndexedDB e enviá-los para o servidor
}

// Manipulador de notificações push
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  
  const title = data.title || 'Notificação';
  const options = {
    body: data.body || 'Você tem uma nova notificação',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/notification-badge.png',
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Manipulador de cliques em notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Se a notificação tiver dados com uma URL, navegar para essa URL
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    // Caso contrário, abrir a janela principal do aplicativo
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        // Se já existe uma janela aberta, focar nela
        for (let client of windowClients) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }
        // Caso contrário, abrir uma nova janela
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});