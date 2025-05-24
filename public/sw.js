// public/sw.js - Service Worker Completo e Otimizado

const CACHE_NAME = 'portfolio-v2.1.0';
const STATIC_CACHE = 'portfolio-static-v1';
const DYNAMIC_CACHE = 'portfolio-dynamic-v1';
const IMAGE_CACHE = 'portfolio-images-v1';
const API_CACHE = 'portfolio-api-v1';

// Recursos essenciais para cache offline
const STATIC_ASSETS = [
  '/',
  '/about',
  '/projects',
  '/skills',
  '/certificates',
  '/contact',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/css/',
  '/_next/static/js/',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Estratégias de cache por tipo de recurso
const CACHE_STRATEGIES = {
  // Cache first para recursos estáticos
  static: [
    /\/_next\/static\//,
    /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
    /^https:\/\/fonts\.googleapis\.com\//,
    /^https:\/\/fonts\.gstatic\.com\//
  ],
  
  // Network first para páginas
  pages: [
    /^(?!.*\/(api|_next)).*$/,
  ],
  
  // Stale while revalidate para imagens
  images: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /\/api\/placeholder\//
  ],
  
  // Network first com fallback para APIs
  api: [
    /\/api\//
  ]
};

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Instalando Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache dos recursos estáticos essenciais
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS.filter(url => !url.includes('_next')));
      }),
      
      // Skip waiting para ativar imediatamente
      self.skipWaiting()
    ])
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('SW: Ativando Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log('SW: Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Assumir controle de todas as abas
      self.clients.claim()
    ])
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) return;
  
  // Estratégia baseada no tipo de recurso
  if (matchesPattern(request.url, CACHE_STRATEGIES.static)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (matchesPattern(request.url, CACHE_STRATEGIES.images)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
  } else if (matchesPattern(request.url, CACHE_STRATEGIES.api)) {
    event.respondWith(networkFirstWithFallback(request, API_CACHE));
  } else if (matchesPattern(request.url, CACHE_STRATEGIES.pages)) {
    event.respondWith(networkFirstWithFallback(request, DYNAMIC_CACHE));
  }
});

// Estratégia: Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Atualizar cache em background
      fetch(request).then((response) => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {}); // Falha silenciosa
      
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Estratégia: Network First com Fallback
async function networkFirstWithFallback(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, tentando cache...', error);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para páginas
    if (request.mode === 'navigate') {
      const fallbackResponse = await cache.match('/');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    // Fallback para imagens
    if (request.destination === 'image') {
      return generatePlaceholderImage();
    }
    
    return new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estratégia: Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Verificar se URL corresponde aos padrões
function matchesPattern(url, patterns) {
  return patterns.some(pattern => pattern.test(url));
}

// Gerar imagem placeholder para fallback
function generatePlaceholderImage() {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#374151"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9CA3AF" text-anchor="middle" dy=".3em">
        Imagem indisponível offline
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

// Escutar mensagens do cliente
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CACHE_URLS':
      if (payload?.urls) {
        event.waitUntil(precacheUrls(payload.urls));
      }
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearAllCaches());
      break;
      
    default:
      console.log('SW: Mensagem desconhecida:', type);
  }
});

// Pre-cache URLs específicas
async function precacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.log('SW: Erro ao fazer pre-cache de:', url, error);
    }
  }
}

// Limpar todos os caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('SW: Todos os caches foram limpos');
}

// Notificar cliente sobre atualizações
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Verificar se há nova versão
    event.waitUntil(checkForUpdates());
  }
});

async function checkForUpdates() {
  try {
    const registration = await self.registration.update();
    if (registration.installing) {
      // Nova versão disponível
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          message: 'Nova versão disponível!'
        });
      });
    }
  } catch (error) {
    console.log('SW: Erro ao verificar atualizações:', error);
  }
}

// Sync em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(backgroundSync());
  }
});

async function backgroundSync() {
  console.log('SW: Executando sync em background...');
  
  // Sincronizar dados pendentes quando voltar online
  try {
    const pendingRequests = await getPendingRequests();
    
    for (const request of pendingRequests) {
      try {
        await fetch(request.url, request.options);
        await removePendingRequest(request.id);
      } catch (error) {
        console.log('SW: Erro ao sincronizar:', error);
      }
    }
  } catch (error) {
    console.log('SW: Erro no background sync:', error);
  }
}

// Gerenciar requisições pendentes (simplified)
async function getPendingRequests() {
  // Implementar storage de requisições pendentes
  return [];
}

async function removePendingRequest(id) {
  // Implementar remoção de requisição pendente
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { action, data } = event;
  let url = '/';
  
  if (action) {
    url = data.actionUrls?.[action] || '/';
  } else if (data.url) {
    url = data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Procurar janela existente
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Abrir nova janela se nenhuma for encontrada
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('SW: Service Worker carregado com sucesso!');