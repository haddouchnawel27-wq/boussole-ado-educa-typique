/* Service worker — met l'application en cache pour un usage hors-ligne.
   Stratégie « stale-while-revalidate » : on sert vite depuis le cache,
   puis on met à jour en arrière-plan, pour que les nouvelles versions
   s'appliquent d'elles-mêmes à l'ouverture suivante. */
var CACHE = "boussole-v14";
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
  "./assets/js/tools/personnalisation.js", "./assets/js/tools/accessibilite.js",
  "./assets/js/tools/flashcards.js", "./assets/js/tools/carte-mentale.js",
  "./assets/js/tools/aide-ecrire.js", "./assets/js/tools/apprendre.js",
  "./assets/js/tools/metacognition.js",
  "./assets/img/mascotte-neuroo.png", "./assets/img/mascotte-noury.png",
  "./assets/img/mascotte-maman.png", "./assets/img/mascotte-educa.png"
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

  // Hors application : ressources d'une autre origine (ex. CDN de l'OCR) →
  // réseau direct, jamais mises dans le cache de l'appli.
  if (url.origin !== self.location.origin) return;

  // Les sites vitrines (Parcours Clarté · Jannat Al Qalb) ne font PAS partie
  // de l'application : on les laisse au réseau, sans cache ni coquille d'appli.
  if (url.pathname.indexOf("/parcours-clarte-tnd/") !== -1 ||
      url.pathname.indexOf("/jannat-al-qalb/") !== -1 ||
      url.pathname.indexOf("/al-mizan/") !== -1 ||
      url.pathname.indexOf("/souffle-lumiere/") !== -1) {
    return;
  }

  // Stale-while-revalidate : réponse immédiate depuis le cache si elle existe,
  // et rafraîchissement en arrière-plan pour la prochaine fois ; sinon réseau,
  // avec repli sur la coquille de l'appli hors-ligne.
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
