// ============================================================
// CAMPUSLY — Service Worker (PWA)
// Version 2.1.0
// ============================================================

const CACHE_NAME = 'campusly-v2.1.0';
const RUNTIME_CACHE = 'campusly-runtime';

// Fichiers à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/epreuves.html',
  '/revision.html',
  '/chatbot.html',
  '/forum.html',
  '/contribuer.html',
  '/auth.html',
  '/css/modern.css',
  '/css/theme-light.css',
  '/css/theme-dark.css',
  '/css/enhancements.css',
  '/css/mobile.css',
  '/css/interactive-buttons.css',
  '/js/app.js',
  '/js/theme.js',
  '/js/theme-switcher.js',
  '/js/supabase-config.js',
  '/js/auth-guard.js',
  '/js/auto-logout.js',
  '/js/i18n.js',
  '/js/logo.js',
  '/manifest.json',
  '/offline.html'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des assets statiques');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[SW] Erreur lors de la mise en cache:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[SW] Suppression ancien cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Stratégie de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return;

  // Ignorer les requêtes vers des domaines externes (sauf fonts, images)
  if (url.origin !== location.origin && 
      !url.hostname.includes('supabase') &&
      !url.hostname.includes('googleapis') &&
      !url.hostname.includes('gstatic')) {
    return;
  }

  // Stratégie Network First pour les API Supabase
  if (url.hostname.includes('supabase')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Stratégie Cache First pour les assets statiques
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stratégie Network First pour les pages HTML
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Par défaut: Cache First
  event.respondWith(cacheFirst(request));
});

// Stratégie Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    // Mettre en cache si la réponse est valide
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    
    // Retourner la page offline si disponible
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) return offlinePage;
    }
    
    throw error;
  }
}

// Stratégie Network First
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    
    // Mettre en cache si la réponse est valide
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Network error, trying cache:', error);
    
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Retourner la page offline pour les pages HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlinePage = await caches.open(CACHE_NAME).then(c => c.match('/offline.html'));
      if (offlinePage) return offlinePage;
    }
    
    throw error;
  }
}

// Vérifier si c'est un asset statique
function isStaticAsset(pathname) {
  return pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/);
}

// Gestion des messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});

// Notifications Push (préparation future)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Nouvelle notification Campusly',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'close', title: 'Fermer' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Campusly', options)
  );
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Synchronisation en arrière-plan (préparation future)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Synchronisation des données...');
  // À implémenter: synchronisation des données offline
}

console.log('[SW] Service Worker chargé - Version', CACHE_NAME);
