/* Service worker — Coachy 2.0
   Hors-ligne complet après la première visite.
   - pages et scripts de l'appli : réseau d'abord (pour recevoir chaque nouvelle
     version), puis le cache si on est hors-ligne ;
   - icônes et lecteur PDF partagé : cache d'abord ;
   - /api/ (mode IA) : jamais mis en cache. */
const CACHE = 'coachy2-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './assets/app.css',
  './assets/js/core.js', './assets/js/data.js', './assets/js/m-accueil.js', './assets/js/m-apprendre.js',
  './assets/js/m-memoire.js', './assets/js/m-organise.js', './assets/js/m-ludo.js', './assets/js/m-soin.js',
  './assets/js/m-jardin.js', './assets/js/m-modemploi.js', './assets/js/m-reglages.js',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()).catch(() => {}));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('coachy2-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  const statique = /\.(png|svg|webmanifest)$/.test(url.pathname) || url.pathname.includes('/vendor/');
  if (statique) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((resp) => { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return resp; })));
    return;
  }
  e.respondWith(
    fetch(req).then((resp) => { if (resp.ok) { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return resp; })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
