const CACHE_NAME = 'notatnik-pwa-v1';
const urlsToCache = [
  '/Notatnik-Pogodowy/',
  '/Notatnik-Pogodowy/index.html',
  '/Notatnik-Pogodowy/weather.html',
  '/Notatnik-Pogodowy/notes.html',
  '/Notatnik-Pogodowy/style.css',
  '/Notatnik-Pogodowy/script.js',
  '/Notatnik-Pogodowy/manifest.json',
  '/Notatnik-Pogodowy/icons/icon-192.png',
  '/Notatnik-Pogodowy/icons/icon-512.png'
];

// Instalacja Service Workera i cache'owanie plików
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Obsługa fetch - cache-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      }).catch(() => {
        return caches.match('/Notatnik-Pogodowy/index.html');
      })
  );
});

// Opcjonalne czyszczenie starego cache'a
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});
