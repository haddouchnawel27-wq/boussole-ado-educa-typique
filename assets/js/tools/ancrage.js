/* Trousse anti-crise — ancrage 5-4-3-2-1 et techniques d'apaisement */
(function () {
  "use strict";

  var ETAPES_54321 = [
    { sens: "👀", nb: 5, consigne: "Nomme 5 choses que tu VOIS autour de toi." },
    { sens: "✋", nb: 4, consigne: "Nomme 4 choses que tu peux TOUCHER." },
    { sens: "👂", nb: 3, consigne: "Nomme 3 sons que tu ENTENDS." },
    { sens: "👃", nb: 2, consigne: "Nomme 2 odeurs que tu SENS (ou aimes)." },
    { sens: "👅", nb: 1, consigne: "Nomme 1 goût que tu peux GOÛTER (ou aimes)." }
  ];

  var TECHNIQUES = [
    { t: "🧊 Le glaçon", d: "Tiens un glaçon dans la main, concentre-toi sur le froid. Ramène vite au présent." },
    { t: "💧 Eau froide", d: "Passe de l'eau froide sur les poignets / le visage. Active le calme." },
    { t: "🫁 Souffler la bougie", d: "Inspire par le nez, souffle lentement comme pour faire vaciller une bougie sans l'éteindre." },
    { t: "💪 Relâcher les muscles", d: "Serre les poings 5 sec, puis relâche. Remonte épaules, puis relâche. Sens la détente." },
    { t: "🎵 Une chanson refuge", d: "Mets une musique qui apaise et chante / bouge dessus." },
    { t: "📝 Vider la tête", d: "Écris tout ce qui passe, sans filtre, pendant 2 minutes." }
  ];

  Boussole.registerTool({
    id: "ancrage", groupe: "secours", titre: "Trousse anti-crise", icone: "🧰",
    desc: "Techniques d'ancrage rapides (5-4-3-2-1, glaçon, respiration) pour apaiser une montée d'angoisse.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Trousse anti-crise", "À utiliser quand l'angoisse ou la colère montent. On ramène l'attention au corps et au présent."));

      // Exercice 5-4-3-2-1 interactif
      vue.appendChild(UI.el("h2", { text: "Ancrage 5-4-3-2-1", style: "margin:.5rem 0" }));
      var idx = 0;
      var carte = UI.el(".ancrage-carte");
      var boutons = UI.el(".btn-rangee", { style: "justify-content:center" });
      function rendreEtape() {
        UI.vider(carte);
        if (idx >= ETAPES_54321.length) {
          carte.appendChild(UI.el("div", {}, [
            UI.el("div.ancrage-sens", { text: "🌿" }),
            UI.el("p", { html: "<strong>Bravo.</strong> Tu es revenu·e dans l'instant présent. Respire encore une fois, lentement." })
          ]));
          UI.vider(boutons);
          boutons.appendChild(UI.el("button.btn", { text: "↺ Recommencer", onclick: function () { idx = 0; rendreEtape(); } }));
          return;
        }
        var e = ETAPES_54321[idx];
        carte.appendChild(UI.el("div.ancrage-sens", { text: e.sens }));
        carte.appendChild(UI.el("div", { style: "font-size:2rem;font-weight:800;color:#3a7d6e", text: e.nb }));
        carte.appendChild(UI.el("p", { text: e.consigne }));
        UI.vider(boutons);
        if (idx > 0) boutons.appendChild(UI.el("button.btn.ghost", { text: "← Précédent", onclick: function () { idx--; rendreEtape(); } }));
        boutons.appendChild(UI.el("button.btn", { text: idx === ETAPES_54321.length - 1 ? "Terminer ✓" : "Suivant →", onclick: function () { idx++; rendreEtape(); } }));
      }
      rendreEtape();
      vue.appendChild(carte);
      vue.appendChild(boutons);

      // Autres techniques
      vue.appendChild(UI.el("h2", { text: "Autres techniques express", style: "margin:1.6rem 0 .5rem" }));
      var grille = UI.el(".grille");
      TECHNIQUES.forEach(function (tech) {
        grille.appendChild(UI.el(".carte", {}, [UI.el("h3", { text: tech.t }), UI.el("p", { text: tech.d, style: "color:#6b7280;margin:0" })]));
      });
      vue.appendChild(grille);

      vue.appendChild(UI.el(".btn-rangee", { style: "margin-top:1.4rem" }, [
        UI.el("a.btn.secondaire", { href: "#/respiration", text: "🫁 Aller à la respiration guidée" }),
        UI.el("a.btn.secondaire", { href: "#/securite", text: "🆘 Plan de sécurité" })
      ]));
    }
  });
})();
