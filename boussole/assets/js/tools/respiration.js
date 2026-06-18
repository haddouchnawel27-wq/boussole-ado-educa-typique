/* Respiration guidée — cohérence cardiaque & techniques d'apaisement */
(function () {
  "use strict";

  var EXERCICES = {
    coherence: { nom: "Cohérence cardiaque (5-5)", inspire: 5, pause1: 0, expire: 5, pause2: 0, desc: "5 secondes d'inspiration, 5 secondes d'expiration. La référence anti-stress." },
    carre: { nom: "Respiration carrée (4-4-4-4)", inspire: 4, pause1: 4, expire: 4, pause2: 4, desc: "Inspire, retiens, expire, retiens. Apaise rapidement." },
    apaisante: { nom: "4-7-8 (apaisante)", inspire: 4, pause1: 7, expire: 8, pause2: 0, desc: "Idéale pour le soir et l'endormissement." }
  };

  Boussole.registerTool({
    id: "respiration", groupe: "tcc", titre: "Respiration guidée", icone: "🫁",
    desc: "Bulle animée pour guider la respiration : cohérence cardiaque, carrée, 4-7-8.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Respiration guidée", "Suis la bulle : elle grandit quand tu inspires, elle rétrécit quand tu expires. Quelques minutes suffisent pour faire baisser la tension."));

      var cleEx = "coherence";
      var minutes = 3;
      var actif = false, timer = null, phaseTimer = null;

      var selEx = UI.select(Object.keys(EXERCICES).map(function (k) { return { value: k, label: EXERCICES[k].nom }; }));
      var descEx = UI.el("p.aide");
      var selDuree = UI.select([1, 2, 3, 5, 10].map(function (m) { return { value: m, label: m + " min", selected: m === 3 }; }));

      var bulle = UI.el(".resp-bulle", { text: "" });
      var consigne = UI.el(".resp-consigne", { text: "Prêt·e ?" });
      var compteCycles = UI.el("p.aide", { text: "" });
      var btn = UI.el("button.btn.grand", { text: "▶️ Commencer" });

      function majDesc() { descEx.textContent = EXERCICES[selEx.value].desc; }
      selEx.addEventListener("change", function () { majDesc(); });
      majDesc();

      function phase(nom, secondes, classeInspire) {
        return new Promise(function (resolve) {
          consigne.textContent = nom;
          if (classeInspire === true) bulle.classList.add("inspire");
          if (classeInspire === false) bulle.classList.remove("inspire");
          var reste = secondes;
          bulle.textContent = reste;
          phaseTimer = setInterval(function () {
            reste--;
            bulle.textContent = reste > 0 ? reste : "";
            if (reste <= 0) { clearInterval(phaseTimer); resolve(); }
          }, 1000);
        });
      }

      function lancer() {
        var ex = EXERCICES[selEx.value];
        var finA = Date.now() + parseInt(selDuree.value, 10) * 60000;
        var cycles = 0;
        actif = true; btn.textContent = "⏹️ Arrêter";

        function boucle() {
          if (!actif || Date.now() >= finA) { terminer(); return; }
          var seq = Promise.resolve();
          seq = seq.then(function () { return phase("Inspire…", ex.inspire, true); });
          if (ex.pause1) seq = seq.then(function () { return phase("Retiens…", ex.pause1, null); });
          seq = seq.then(function () { return phase("Expire…", ex.expire, false); });
          if (ex.pause2) seq = seq.then(function () { return phase("Retiens…", ex.pause2, null); });
          seq.then(function () { cycles++; compteCycles.textContent = cycles + " respiration" + (cycles > 1 ? "s" : ""); if (actif) boucle(); });
        }
        boucle();
      }

      function terminer() {
        actif = false; clearInterval(phaseTimer);
        bulle.classList.remove("inspire"); bulle.textContent = "🙂";
        consigne.textContent = "Bravo, c'est terminé.";
        btn.textContent = "▶️ Recommencer";
      }

      btn.addEventListener("click", function () { if (actif) terminer(); else lancer(); });

      vue.appendChild(UI.el(".carte", {}, [
        UI.champ("Exercice", selEx), descEx, UI.champ("Durée", selDuree)
      ]));
      vue.appendChild(UI.el(".resp-scene", {}, [bulle, consigne, compteCycles, btn]));
    }
  });
})();
