// Service worker minimal pour Al Mizan — permet l'installation (PWA) et un
// fonctionnement hors-ligne doux. Réseau d'abord, cache en secours.
const CACHE = "almizan-v1";
const SHELL = ["/al-mizan", "/almizan-icon.svg", "/almizan-icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Réseau d'abord ; si hors-ligne, on sert le cache.
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("/al-mizan")))
  );
});
