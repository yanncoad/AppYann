const CACHE_NAME = 'suivi-cache-v2';
const URLS = [
  'index.html',
  'manifest.json',
  'service-worker.js',
  'sport.html',
  'stats.html'
];
// Mise en cache initiale des ressources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
});

// Nettoyage des anciens caches lors de l'activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Stratégie network-first pour obtenir les mises à jour
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const respClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
