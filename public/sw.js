// public/sw.js

// Service worker version for cache busting
const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `portfolio-cache-${CACHE_VERSION}`;

// Resources to pre-cache (only include resources that definitely exist)
const PRECACHE_RESOURCES = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/apple-icon.png',
  '/offline.html'
];

// Install event - precache important resources
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing new version:', CACHE_VERSION);
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Pre-caching resources');
        // Cache resources individually to handle failures gracefully
        return Promise.allSettled(
          PRECACHE_RESOURCES.map(url => 
            cache.add(url).catch(err => {
              console.warn(`[ServiceWorker] Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .catch(err => {
        console.error('[ServiceWorker] Install failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
  
  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('portfolio-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('[ServiceWorker] Removing old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Function to determine if a request is cacheable
function isCacheableRequest(request) {
  try {
    const url = new URL(request.url);
    
    // Skip non-HTTP(S) protocols (chrome-extension, file, etc.)
    if (!url.protocol.startsWith('http')) {
      return false;
    }
    
    // Only cache same-origin requests
    if (url.origin !== self.location.origin) {
      return false;
    }
    
    // Skip API requests with query parameters (they're likely dynamic)
    if (url.pathname.startsWith('/api/') && url.search) {
      return false;
    }
    
    // Skip authentication related URLs
    if (url.pathname.includes('auth') || url.search.includes('token=')) {
      return false;
    }
    
    // Skip Next.js internal routes
    if (url.pathname.startsWith('/_next/webpack-hmr') || 
        url.pathname.startsWith('/_next/static/chunks/webpack')) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('[ServiceWorker] Error parsing URL:', request.url, error);
    return false;
  }
}

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Check if the request should be cached
  if (!isCacheableRequest(event.request)) {
    return;
  }
  
  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Store in cache (handle errors gracefully)
            caches.open(CACHE_NAME)
              .then(cache => {
                return cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.warn('[ServiceWorker] Cache put error for', event.request.url, ':', err);
              });
            
            return response;
          })
          .catch(error => {
            console.warn('[ServiceWorker] Fetch error for', event.request.url, ':', error);
            
            // For HTML pages, try to return a cached version or offline page
            if (event.request.headers.get('Accept')?.includes('text/html')) {
              return caches.match('/') || caches.match('/offline.html');
            }
            
            // For other resources, just throw the error
            throw error;
          });
      })
      .catch(error => {
        console.error('[ServiceWorker] Cache match error:', error);
        return fetch(event.request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    
    // Filter cacheable URLs
    const cacheableUrls = urls.filter(url => {
      try {
        return isCacheableRequest({ url });
      } catch {
        return false;
      }
    });
    
    if (cacheableUrls.length > 0) {
      console.log('[ServiceWorker] Caching URLs from message:', cacheableUrls);
      
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => {
            return Promise.allSettled(
              cacheableUrls.map(url => 
                cache.add(url).catch(err => {
                  console.warn(`[ServiceWorker] Failed to cache ${url}:`, err);
                  return null;
                })
              )
            );
          })
      );
    }
  }
});

// Error handling for unhandled promise rejections
self.addEventListener('unhandledrejection', event => {
  console.error('[ServiceWorker] Unhandled promise rejection:', event.reason);
  event.preventDefault();
});