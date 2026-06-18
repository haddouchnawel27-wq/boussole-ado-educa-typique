/* Suggestions contextuelles bienveillantes.
   Après une émotion intense ou une humeur basse, proposer un outil d'apaisement.
   Logique de soutien — ne remplace jamais une évaluation clinique. */
(function () {
  "use strict";

  var NEGATIVES = ["Tristesse", "Colère", "Peur", "Stress", "Honte", "Dégoût", "Frustration", "Solitude", "Fatigue"];

  function carteOutils(liste) {
    var rangee = UI.el(".btn-rangee", { style: "flex-direction:column;align-items:stretch;margin:0" });
    liste.forEach(function (o) {
      rangee.appendChild(UI.el("button.btn" + (o.style || ".secondaire"), {
        text: o.label,
        onclick: function () {
          var ov = document.querySelector(".modal-overlay");
          if (ov) ov.remove();
          Boussole.naviguer(o.route);
        }
      }));
    });
    return rangee;
  }

  // Appelée après l'enregistrement d'une émotion.
  function apresEmotion(emotion, intensite) {
    var negative = NEGATIVES.indexOf(emotion) >= 0;
    if (!negative || intensite < 6) return false;

    var outils = [
      { label: "🫁 Respirer ensemble", route: "respiration", style: "" },
      { label: "🧰 Ancrage 5-4-3-2-1", route: "ancrage" }
    ];
    var message = "Cette émotion est forte (" + intensite + "/10). Ce n'est pas grave de ne pas aller bien — on peut s'apaiser ensemble. Que veux-tu essayer ?";
    if (intensite >= 9) {
      outils.push({ label: "🆘 Voir mon plan de sécurité", route: "securite" });
      message = "Cette émotion est très intense (" + intensite + "/10). Tu n'es pas seul·e. Prenons un moment pour t'apaiser — par quoi veux-tu commencer ?";
    }

    UI.modal({
      titre: "Prendre soin de toi 💛",
      message: message,
      contenu: carteOutils(outils),
      annuler: true,
      texteAnnuler: "Plus tard",
      texteOk: "Rester ici",
      onOk: function () { return true; }
    });
    return true;
  }

  // Appelée après l'enregistrement d'une humeur (niveau 1-5).
  function apresHumeur(niveau) {
    if (niveau > 2) return false;
    UI.modal({
      titre: niveau === 1 ? "Journée difficile 💛" : "Pas au top aujourd'hui",
      message: "Merci de l'avoir noté. Veux-tu un petit coup de pouce ?",
      contenu: carteOutils([
        { label: "🫁 Respiration apaisante", route: "respiration", style: "" },
        { label: "🤲 Écrire une gratitude", route: "gratitude" },
        { label: "🧰 Trousse anti-crise", route: "ancrage" }
      ].concat(niveau === 1 ? [{ label: "🆘 Plan de sécurité", route: "securite" }] : [])),
      annuler: true, texteAnnuler: "Plus tard", texteOk: "Rester ici", onOk: function () { return true; }
    });
    return true;
  }

  Boussole.suggererApresEmotion = apresEmotion;
  Boussole.suggererApresHumeur = apresHumeur;
})();
