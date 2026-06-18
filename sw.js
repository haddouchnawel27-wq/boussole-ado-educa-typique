/* Service worker du PORTAIL (racine).
   Boussole occupait autrefois la racine avec son propre service worker et son
   cache "boussole-vX". Maintenant la racine est une simple page d'accueil et
   Boussole vit dans /boussole/ (avec son propre SW). Ce fichier remplace donc
   l'ancien SW racine : il vide les anciens caches et laisse passer le réseau,
   pour qu'aucun visiteur ne reste bloqué sur une ancienne version mise en cache. */
self.addEventListener("install", function () { self.skipWaiting(); });

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (cles) { return Promise.all(cles.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

/* Pas de mise en cache : on sert toujours le réseau (passthrough). */
