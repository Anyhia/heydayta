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

  // Don't intercept cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

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
        // Skip caching for video files - range requests (206) not supported by Cache API
    if (url.pathname.match(/\.(mp4|webm|ogg)$/)) {
        event.respondWith(fetch(event.request));
        return;
    }
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
  event.respondWith(
    fetch(event.request).catch(() =>
        caches.match(event.request).then(cached => cached || new Response('Offline', { status: 503 }))
    )
  );
});

// When the app sends a SKIP_WAITING message, activate the new service worker immediately
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


// Receive a push from the server and show a notification
self.addEventListener('push', (event) => {
  let title = 'HeyDayta';
  let body = 'You have a reminder.';

  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
    } catch (e) {
      // If the payload isn't JSON, use it as plain text
      body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      badge: 'https://heydayta.app/android-chrome-192x192.png',
    })
  );
});

// When the user taps the notification, open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If the app is already open in a tab, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});