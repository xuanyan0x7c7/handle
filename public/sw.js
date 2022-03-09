importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js');

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({ cacheName: 'navigation' }),
);

workbox.routing.registerRoute(
  /\.mjs$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'script',
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /\.wasm$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'wasm',
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'style',
  new workbox.strategies.CacheFirst({
    cacheName: 'styles',
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({
        statuses: [200],
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.cacheableResponse.CacheableResponse({
        statuses: [200],
      }),
    ],
  }),
);
