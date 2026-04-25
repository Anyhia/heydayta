const CACHE_NAME = 'heydayta-v4';

// Cache the app shell so the app loads when offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
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
    )
  );
});

self.addEventListener('fetch', (event) => {
    // Workaround for Chrome bug: only-if-cached requires same-origin mode
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }
  const url = new URL(event.request.url);

  // Don't intercept cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Never cache API calls - always go to network
  if (url.pathname.startsWith('/api/')) {
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


  // Navigation requests and app routes - network first, fallback to cached index.html if offline
  if (event.request.mode === 'navigate' || !url.pathname.includes('.')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
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
      body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: '/android-chrome-192x192.png',
      badge: '/badge-96x96.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data: { url: self.location.origin + '/createlog' },
    })
  );
});

// When the user taps the notification, open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = (event.notification.data && event.notification.data.url)
      ? event.notification.data.url
      : self.location.origin + '/createlog';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});