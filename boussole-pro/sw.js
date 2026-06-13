/* Boussole Pro — service worker minimal (hors-ligne). */
var CACHE = "boussole-pro-v1";
var FICHIERS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/store.js",
  "./assets/js/ui.js",
  "./assets/js/data.js",
  "./assets/js/app.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (rep) {
      return rep || fetch(e.request).then(function (net) {
        return caches.open(CACHE).then(function (c) { c.put(e.request, net.clone()); return net; });
      }).catch(function () { return caches.match("./index.html"); });
    })
  );
});
