/* Service worker — met l'application en cache pour un usage hors-ligne. */
var CACHE = "boussole-v3";
var FICHIERS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/store.js", "./assets/js/ui.js", "./assets/js/app.js", "./assets/js/suggestions.js",
  "./assets/js/tools/accueil.js", "./assets/js/tools/hub.js", "./assets/js/tools/profils.js",
  "./assets/js/tools/timer.js", "./assets/js/tools/sequenceur.js",
  "./assets/js/tools/emploi-du-temps.js", "./assets/js/tools/jetons.js",
  "./assets/js/tools/emotions.js", "./assets/js/tools/pensees.js",
  "./assets/js/tools/respiration.js", "./assets/js/tools/humeur.js",
  "./assets/js/tools/ancrage.js", "./assets/js/tools/securite.js",
  "./assets/js/tools/abc.js", "./assets/js/tools/gratitude.js",
  "./assets/js/tools/suivi.js", "./assets/js/tools/accessibilite.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (rep) {
      return rep || fetch(e.request).then(function (reseau) {
        return caches.open(CACHE).then(function (c) { c.put(e.request, reseau.clone()); return reseau; });
      }).catch(function () { return caches.match("./index.html"); });
    })
  );
});
