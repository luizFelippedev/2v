// public/sw.js - Service Worker Completo e Otimizado para Portfolio

const CACHE_VERSION = 'portfolio-v3.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGES_CACHE = `${CACHE_VERSION}-images`;

// URLs para cache estático
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/images/placeholder-avatar.png'
];

// URLs que NÃO devem ser interceptadas pelo SW
const BYPASS_PATTERNS = [
  /\/_next\/static\//,           // Next.js static files
  /\/_next\/webpack-hmr/,        // Hot module reload
  /\/api\//,                     // API routes
  /\?_rsc=/,                     // React Server Components
  /\/__nextjs_original-stack-frame/,  // Next.js dev tools
  /\/favicon\.ico$/,             // Favicon
  /\/robots\.txt$/,              // Robots
  /\/sitemap\.xml$/,             // Sitemap
  /localhost:3000/,              // Development server
];

// Configurações
const MAX_CACHE_ITEMS = 50;
const CACHE_EXPIRY_DAYS = 7;
const RETRY_ATTEMPTS = 3;

// Utilitários
const log = (message, ...args) => {
  if (self.location.hostname === 'localhost') {
    console.log(`SW: ${message}`, ...args);
  }
};

const shouldBypass = (url) => {
  const urlString = url.toString();
  return BYPASS_PATTERNS.some(pattern => pattern.test(urlString));
};

const isNavigationRequest = (request) => {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
};

const isImageRequest = (request) => {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(new URL(request.url).pathname);
};

const isCacheableRequest = (request) => {
  const url = new URL(request.url);
  
  // Não cachear em desenvolvimento
  if (url.hostname === 'localhost') return false;
  
  // Não cachear se deve ser bypassed
  if (shouldBypass(request.url)) return false;
  
  // Não cachear POST/PUT/DELETE
  if (request.method !== 'GET') return false;
  
  return true;
};

// Função para limpar cache expirado
const cleanExpiredCache = async (cacheName) => {
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const cachedTime = response.headers.get('sw-cached-time');
        if (cachedTime && (now - parseInt(cachedTime)) > expiryTime) {
          await cache.delete(request);
          log('Cache expirado removido:', request.url);
        }
      }
    }
  } catch (error) {
    log('Erro ao limpar cache expirado:', error);
  }
};

// Função para limitar tamanho do cache
const trimCache = async (cacheName, maxItems) => {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length <= maxItems) return;
    
    // Remover os itens mais antigos
    const itemsToDelete = keys.slice(0, keys.length - maxItems);
    for (const key of itemsToDelete) {
      await cache.delete(key);
    }
    
    log(`Cache trimmed: ${itemsToDelete.length} itens removidos de ${cacheName}`);
  } catch (error) {
    log('Erro ao fazer trim do cache:', error);
  }
};

// Event Listeners

// Install
self.addEventListener('install', (event) => {
  log('Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        log('Fazendo cache dos assets estáticos:', STATIC_ASSETS);
        return cache.addAll(STATIC_ASSETS.filter(url => shouldHandleRequest(url)));
      })
      .then(() => {
        log('Assets estáticos cacheados com sucesso');
        return self.skipWaiting();
      })
      .catch(error => {
        log('Erro ao fazer cache dos assets:', error);
      })
  );
});

// Activate
self.addEventListener('activate', (event) => {
  log('Ativando Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.startsWith(CACHE_VERSION)) {
              log('Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar controle de todas as páginas
      self.clients.claim()
    ])
    .then(() => {
      log('Service Worker ativado com sucesso!');
    })
    .catch(error => {
      log('Erro na ativação:', error);
    })
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Bypass para desenvolvimento e padrões específicos
  if (shouldBypass(request.url)) {
    return; // Deixar a requisição passar normalmente
  }
  
  // Em desenvolvimento, apenas interceptar imagens
  if (url.hostname === 'localhost') {
    if (isImageRequest(request)) {
      event.respondWith(handleImageRequest(request));
    }
    return;
  }
  
  // Estratégias diferentes baseadas no tipo de requisição
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isCacheableRequest(request)) {
    event.respondWith(handleCacheableRequest(request));
  }
});

// Handlers para diferentes tipos de requisição

const handleNavigationRequest = async (request) => {
  try {
    // Tentar rede primeiro
    const response = await fetch(request);
    
    if (response.ok) {
      // Cachear a resposta se for bem-sucedida
      const cache = await caches.open(DYNAMIC_CACHE);
      const responseClone = response.clone();
      
      // Adicionar timestamp
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-time', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      cache.put(request, cachedResponse);
      return response;
    }
    
    throw new Error(`HTTP ${response.status}`);
    
  } catch (error) {
    log('Falha na navegação, tentando cache:', error.message);
    
    // Tentar cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página offline
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Último recurso: página básica
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><title>Offline</title></head>
        <body>
          <h1>Você está offline</h1>
          <p>Por favor, verifique sua conexão com a internet.</p>
        </body>
      </html>`,
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 200
      }
    );
  }
};

const handleImageRequest = async (request) => {
  try {
    // Verificar cache primeiro
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Tentar buscar da rede
    const response = await fetch(request);
    
    if (response.ok) {
      // Cachear imagem
      const cache = await caches.open(IMAGES_CACHE);
      const responseClone = response.clone();
      
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-time', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      cache.put(request, cachedResponse);
      
      // Manter cache sob controle
      trimCache(IMAGES_CACHE, MAX_CACHE_ITEMS);
      
      return response;
    }
    
    throw new Error(`HTTP ${response.status}`);
    
  } catch (error) {
    log('Erro na imagem, retornando placeholder:', error.message);
    
    // Retornar placeholder SVG
    const placeholder = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#374151"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9CA3AF" text-anchor="middle" dy=".3em">
          Imagem indisponível
        </text>
      </svg>
    `;
    
    return new Response(placeholder, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache'
      }
    });
  }
};

const handleCacheableRequest = async (request) => {
  try {
    // Cache first strategy para recursos estáticos
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Verificar se não expirou
      const cachedTime = cachedResponse.headers.get('sw-cached-time');
      if (cachedTime) {
        const now = Date.now();
        const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        
        if ((now - parseInt(cachedTime)) < expiryTime) {
          return cachedResponse;
        }
      }
    }
    
    // Buscar da rede
    const response = await fetch(request);
    
    if (response.ok && isCacheableRequest(request)) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const responseClone = response.clone();
      
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-time', Date.now().toString());
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      cache.put(request, cachedResponse);
      
      // Manter cache sob controle
      trimCache(DYNAMIC_CACHE, MAX_CACHE_ITEMS);
    }
    
    return response;
    
  } catch (error) {
    log('Erro no recurso:', request.url, error.message);
    
    // Tentar cache como fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Retornar erro
    return new Response('Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
};

// Mensagens do cliente
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0]?.postMessage({ version: CACHE_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearAllCaches());
      break;
      
    case 'CLEAN_EXPIRED':
      event.waitUntil(
        Promise.all([
          cleanExpiredCache(STATIC_CACHE),
          cleanExpiredCache(DYNAMIC_CACHE),
          cleanExpiredCache(IMAGES_CACHE)
        ])
      );
      break;
      
    default:
      log('Mensagem desconhecida:', type);
  }
});

// Função para limpar todos os caches
const clearAllCaches = async () => {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    log('Todos os caches foram limpos');
  } catch (error) {
    log('Erro ao limpar caches:', error);
  }
};

// Limpeza periódica (apenas em produção)
if (self.location.hostname !== 'localhost') {
  setInterval(() => {
    Promise.all([
      cleanExpiredCache(STATIC_CACHE),
      cleanExpiredCache(DYNAMIC_CACHE),
      cleanExpiredCache(IMAGES_CACHE),
      trimCache(DYNAMIC_CACHE, MAX_CACHE_ITEMS),
      trimCache(IMAGES_CACHE, MAX_CACHE_ITEMS)
    ]).catch(error => {
      log('Erro na limpeza periódica:', error);
    });
  }, 60 * 60 * 1000); // A cada hora
}

// Push notifications (se necessário)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: data.tag || 'default',
      data: data.data || {},
      requireInteraction: false,
      ...data.options
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    log('Erro no push notification:', error);
  }
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { data } = event.notification;
  let url = data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Procurar janela existente
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Sync em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

const doBackgroundSync = async () => {
  try {
    log('Executando sync em background...');
    // Implementar lógica de sincronização se necessário
  } catch (error) {
    log('Erro no background sync:', error);
  }
};

log('Service Worker carregado com sucesso!');