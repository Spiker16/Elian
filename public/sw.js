const CACHE_NAME = 'stockpro-v3';
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys
        .filter((key) => key.startsWith('stockpro-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key)));
    })
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        return await cache.match(request, { ignoreSearch: true })
          || await cache.match('/')
          || await cache.match('/offline.html');
      }
    })());
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || /\.(?:css|js|png|svg|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;

      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })());
  }
});