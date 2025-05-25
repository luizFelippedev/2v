// public/sw.js - Service Worker Completo e Otimizado

const CACHE_NAME = 'portfolio-cache-v1';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

// Métricas de desempenho
const METRICS = {
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0
};

// Assets para cache
const STATIC_ASSETS = [
  '/',                // Garante que a home está em cache
  '/admin',
  '/login',
  '/images/placeholder-avatar.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Instalando Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('SW: Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
          return caches.delete(key);
        }
      })
    ))
  );
  console.log('SW: Ativado com sucesso!');
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) return;
  
  // Ignorar requisições de fontes do Google
  if (request.url.includes('fonts.googleapis.com') || 
      request.url.includes('fonts.gstatic.com')) {
    return;
  }

  // Estratégia: Cache First
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          METRICS.cacheHits++;
          return response;
        }

        METRICS.cacheMisses++;
        return fetch(request)
          .then(fetchResponse => {
            if (!fetchResponse || fetchResponse.status !== 200) {
              return fetchResponse;
            }
            return caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
              });
          });
      })
      .catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
        return null;
      })
  );
});

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
      
    case 'GET_METRICS':
      event.ports[0].postMessage(METRICS);
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

// Adicionar gestão de memória cache
async function trimCache(cacheName, maxItems = 50) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length <= maxItems) return;

  const itemsToDelete = keys
    .sort((a, b) => {
      const aDate = new Date(a.headers?.get('date') || 0);
      const bDate = new Date(b.headers?.get('date') || 0);
      return aDate - bDate;
    })
    .slice(0, keys.length - maxItems);

  await Promise.all(itemsToDelete.map(key => cache.delete(key)));
}

// Adicionar limpeza periódica
setInterval(() => {
  trimCache(STATIC_CACHE);
  trimCache(DYNAMIC_CACHE);
  trimCache(IMAGE_CACHE);
}, 1000 * 60 * 60); // A cada hora

console.log('SW: Service Worker carregado com sucesso!');