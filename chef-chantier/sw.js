/* Service worker de Chef de Chantier — cache local pour usage hors-ligne.
   Périmètre limité au dossier /chef-chantier/ (le SW de la Boussole exclut ce chemin). */
var CACHE = "chantier-v3";
var FICHIERS = ["./", "./index.html", "./sous-le-capot.html", "./manifest.webmanifest"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Stale-while-revalidate : réponse immédiate depuis le cache, mise à jour en arrière-plan. */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function (rep) {
      var reseau = fetch(e.request).then(function (r) {
        if (r && r.status === 200) {
          caches.open(CACHE).then(function (c) { c.put(e.request, r.clone()); });
        }
        return r;
      }).catch(function () { return rep || caches.match("./index.html"); });
      return rep || reseau;
    })
  );
});
