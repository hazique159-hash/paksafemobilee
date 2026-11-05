// PakSafeMobiles service worker.
// Conservative network-first strategy: while online the app always loads the
// latest content from the network (so build assets never go stale); the cache
// is only used as an offline fallback.

const CACHE = 'paksafe-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE = ['/offline.html', '/icon-192x192.png', '/icon-512x512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // For page navigations: try the network, fall back to the offline page.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // For precached static assets (icons, offline page): serve from cache if the
  // network fails. Everything else passes straight through to the network.
  if (PRECACHE.includes(new URL(request.url).pathname)) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
  }
});
