const CACHE_NAME = 'gogomonkey-cache-v2'; // Note: I incremented the version name. This is important to trigger an update.
const urlsToCache = [
  './', // This caches the root, which on GH Pages is your index file (the HTML)
  'Go!Go!Monkey,Go!.html', // Be explicit just in case
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'https://nerdrealm419.github.io/Go-Go-Monkey-Go-v1/jungle-jive-intro.mp3',
  'https://nerdrealm419.github.io/Go-Go-Monkey-Go-v1/cartoon-jump-6462.mp3',
  'https://nerdrealm419.github.io/Go-Go-Monkey-Go-v1/sparkle-355937.mp3'
];

// Install event: opens the cache and adds the core assets to it.
self.addEventListener('install', event => {
  self.skipWaiting(); // Force the new service worker to become active
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
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
        // Not in cache, fetch from network
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
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
