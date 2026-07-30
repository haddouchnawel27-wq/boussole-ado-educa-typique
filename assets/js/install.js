/* Aide à l'installation (PWA) : capte l'invite native et propose des
   instructions adaptées à chaque appareil (Android, iPhone, ordinateur). */
(function () {
  "use strict";

  var promptDiffere = null;
  var dejaInstallee = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    promptDiffere = e;
  });
  window.addEventListener("appinstalled", function () {
    promptDiffere = null; dejaInstallee = true;
    if (window.UI) UI.toast("🎉 Cap Educa est installée !");
  });

  function instructionsManuelles() {
    var ua = navigator.userAgent || "";
    var iOS = /iPad|iPhone|iPod/.test(ua);
    var contenu = UI.el("div");
    if (dejaInstallee) {
      contenu.appendChild(UI.el("p", { text: "✅ Cap Educa est déjà installée sur cet appareil ! Vous la trouverez avec vos autres applications." }));
    } else if (iOS) {
      contenu.appendChild(UI.el("p", { html: "Sur <strong>iPhone / iPad</strong> (Safari) :" }));
      contenu.appendChild(UI.el("ol", { html:
        "<li>Touchez l'icône <strong>Partager</strong> (le carré avec une flèche ⬆️) en bas de l'écran.</li>" +
        "<li>Faites défiler et choisissez <strong>« Sur l'écran d'accueil »</strong>.</li>" +
        "<li>Touchez <strong>« Ajouter »</strong> en haut à droite.</li>" }));
    } else {
      contenu.appendChild(UI.el("p", { html: "Sur <strong>Android</strong> (Chrome) :" }));
      contenu.appendChild(UI.el("ol", { html:
        "<li>Touchez le menu <strong>⋮</strong> (en haut à droite).</li>" +
        "<li>Choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</li>" +
        "<li>Confirmez avec <strong>« Installer »</strong>.</li>" }));
      contenu.appendChild(UI.el("p", { html: "Sur <strong>ordinateur</strong> (Chrome / Edge) : cliquez sur l'icône <strong>d'installation</strong> (un écran avec une flèche ⤓) tout à droite de la barre d'adresse, puis <strong>« Installer »</strong>." }));
    }
    UI.modal({ titre: "📲 Installer Boussole", contenu: contenu, annuler: false, texteOk: "Compris" });
  }

  // Lance l'invite native si dispo, sinon affiche les instructions.
  function lancer() {
    if (promptDiffere) {
      promptDiffere.prompt();
      promptDiffere.userChoice.then(function () { promptDiffere = null; });
    } else {
      instructionsManuelles();
    }
  }

  Boussole.installDispo = function () { return !dejaInstallee; };
  Boussole.lancerInstall = lancer;
})();
