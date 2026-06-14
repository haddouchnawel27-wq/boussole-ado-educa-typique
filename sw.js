/* Service worker — met l'application en cache pour un usage hors-ligne. */
var CACHE = "boussole-v9";
var FICHIERS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/store.js", "./assets/js/ui.js", "./assets/js/app.js", "./assets/js/suggestions.js", "./assets/js/install.js",
  "./assets/js/tools/accueil.js", "./assets/js/tools/hub.js", "./assets/js/tools/profils.js",
  "./assets/js/tools/timer.js", "./assets/js/tools/sequenceur.js",
  "./assets/js/tools/emploi-du-temps.js", "./assets/js/tools/jetons.js",
  "./assets/js/tools/dys.js", "./assets/js/tools/profil-neuro.js",
  "./assets/js/tools/pomodoro.js", "./assets/js/tools/organisateur.js",
  "./assets/js/tools/emotions.js", "./assets/js/tools/pensees.js",
  "./assets/js/tools/roue-emotions.js", "./assets/js/tools/besoins-corps.js",
  "./assets/js/tools/jeux-fe.js", "./assets/js/tools/modeles-pro.js",
  "./assets/js/tools/respiration.js", "./assets/js/tools/humeur.js",
  "./assets/js/tools/ancrage.js", "./assets/js/tools/securite.js",
  "./assets/js/tools/abc.js", "./assets/js/tools/gratitude.js",
  "./assets/js/tools/spiritualite.js",
  "./assets/js/tools/enfants.js", "./assets/js/tools/suivi.js",
  "./assets/js/tools/personnalisation.js", "./assets/js/tools/accessibilite.js"
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

  // Les sites vitrines (Educa Typique · Parcours Clarté, et Jannat Al Qalb)
  // ne font PAS partie de l'application : on laisse le navigateur les charger
  // directement depuis le réseau, sans jamais les remplacer par la coquille
  // de l'appli ni les mettre dans le cache de l'appli.
  var chemin = new URL(e.request.url).pathname;
  if (chemin.indexOf("/parcours-clarte-tnd/") !== -1 ||
      chemin.indexOf("/jannat-al-qalb/") !== -1) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function (rep) {
      return rep || fetch(e.request).then(function (reseau) {
        return caches.open(CACHE).then(function (c) { c.put(e.request, reseau.clone()); return reseau; });
      }).catch(function () { return caches.match("./index.html"); });
    })
  );
});
