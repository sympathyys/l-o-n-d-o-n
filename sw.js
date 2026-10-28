// Offline cache for the trip map: everything is stored on first open, then served from the cache.
const CACHE = 'trip-map-42bad2167f5e';
const FILES = ["./", "index.html", "manifest.webmanifest", "fonts.json", "tiles/base.txt", "tiles/detail.txt", "tiles/edi-base.txt", "tiles/edi-detail.txt", "fonts/golos-text-cyrillic-400-normal.woff2", "fonts/golos-text-latin-400-normal.woff2", "fonts/golos-text-cyrillic-500-normal.woff2", "fonts/golos-text-latin-500-normal.woff2", "fonts/golos-text-cyrillic-600-normal.woff2", "fonts/golos-text-latin-600-normal.woff2", "fonts/golos-text-cyrillic-700-normal.woff2", "fonts/golos-text-latin-700-normal.woff2", "fonts/jetbrains-mono-cyrillic-500-normal.woff2", "fonts/jetbrains-mono-latin-500-normal.woff2", "fonts/jetbrains-mono-cyrillic-600-normal.woff2", "fonts/jetbrains-mono-latin-600-normal.woff2", "fonts/jetbrains-mono-cyrillic-700-normal.woff2", "fonts/jetbrains-mono-latin-700-normal.woff2", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('trip-map-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;   // links out go to the network
  e.respondWith(caches.open(CACHE)
    .then(c => c.match(req, { ignoreSearch: true }).then(hit => hit || (req.mode === 'navigate' ? c.match('./') : undefined)))
    .then(hit => hit || fetch(req)));
});
