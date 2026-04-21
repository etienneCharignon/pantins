const CACHE = 'pantins-v2';
const ASSETS = [
  '.',
  'index.html',
  'pantin.css',
  'pantin.js',
  'manifest.json',
  'apple-touch-icon.png',
  'tete1.png', 'tete2.png', 'tete3.png',
  'corps1.png', 'corps2.png', 'corps3.png',
  'pieds1.png', 'pieds2.png', 'pieds3.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached ?? fetch(e.request))
  );
});
