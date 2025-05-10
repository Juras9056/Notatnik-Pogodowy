self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('app-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/weather.html',
        '/notes.html',
        '/style.css',
        '/script.js',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => {
      return resp || fetch(e.request);
    })
  );
});
