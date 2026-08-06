/* Service worker — Mode d'Emploi de Moi (espace Ado).
   App autonome, scope /parcours-ado/. Cache pour usage 100% hors-ligne.
   Stratégie « stale-while-revalidate » : réponse immédiate depuis le cache,
   rafraîchie en arrière-plan pour la prochaine ouverture. */
var CACHE = "mem-ado-v15";
var FICHIERS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/css/style.css",
  "./assets/js/vault.js",
  "./assets/js/app.js",
  "./assets/js/screens/ad03.js",
  "./assets/js/screens/ad04.js",
  "./assets/js/screens/ad05.js",
  "./assets/js/screens/ad06.js",
  "./assets/js/screens/ad07.js",
  "./assets/js/screens/ad08.js",
  "./assets/js/screens/ad09.js",
  "./assets/js/screens/ad10.js",
  "./assets/js/screens/ad11.js",
  "./assets/js/screens/profil.js",
  "./assets/js/screens/etincelle.js",
  "./assets/js/screens/cerveau.js",
  "./assets/js/screens/experience.js",
  "./assets/js/screens/pensees.js"
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
