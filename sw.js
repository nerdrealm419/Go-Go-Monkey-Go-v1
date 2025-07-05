const CACHE_NAME = 'gogomonkey-cache-v1';
const urlsToCache = [
  './Go!Go!Monkey,Go!.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://nerdrealm419.github.io/Go-Go-Monkey-Go-v1/jungle-jive-intro.mp3',
  'https://nerdrealm419.github.io/Go-Go-Monkey-Go-v1/cartoon-jump-6462.mp3',
  'https://nerdrealm419.github.io/Go-Go-Monkey-Go-v1/sparkle-355937.mp3'
];

// Install event: opens the cache and adds the core assets to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serves assets from the cache first, falling back to the network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event: removes old, unused caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
