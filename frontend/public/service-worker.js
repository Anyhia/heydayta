const CACHE_NAME = 'heydayta-v1';

// Cache only the app shell - index.html is intentionally excluded
// so the browser always fetches the latest from the server
const STATIC_ASSETS = [
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  // Take over immediately without waiting for old tabs to close
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  // Remove old caches from previous versions
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache index.html or API calls - always go to network
  if (
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname.startsWith('/api/')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For hashed static assets (JS/CSS), use cache-first
  // They have unique filenames per build, so stale cache is not a risk
  if (url.pathname.startsWith('/static/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        } else {
          return fetch(event.request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
          });
        }
      })
    );
    return;
  }

  // Everything else: network first, fall back to cache if offline
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});

// When the app sends a SKIP_WAITING message, activate the new service worker immediately
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});