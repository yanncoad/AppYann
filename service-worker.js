const CACHE_NAME = 'suivi-cache-v1';
const URLS = [
  'index.html',
  'manifest.json',
  'service-worker.js'
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
