/* Par où commencer — entrée de l'app par action d'apprentissage :
   Lire · Écrire · Comprendre · Réviser. Chaque action regroupe les bons
   outils. Sert aussi de section « Home par actions » sur l'accueil. */
(function () {
  "use strict";

  var ACTIONS = [
    { id: "lire", titre: "Lire", icone: "📖", couleur: "#3FB8AF", soft: "#DBF3F0", desc: "Lire plus facilement : voix haute, syllabes, confort d'affichage.", outils: ["dys"] },
    { id: "ecrire", titre: "Écrire", icone: "✍️", couleur: "#5AB98E", soft: "#DDF1E7", desc: "Trouver les mots, construire ses phrases, écrire à grandes touches.", outils: ["aide-ecrire", "dys"] },
    { id: "comprendre", titre: "Comprendre", icone: "💡", couleur: "#F0996B", soft: "#FFE7DA", desc: "Organiser ses idées en carte mentale, comprendre les nombres.", outils: ["carte-mentale", "dys"] },
    { id: "reviser", titre: "Réviser", icone: "🔁", couleur: "#9B7AD8", soft: "#EEE6FB", desc: "S'entraîner et garder en mémoire : cartes de révision, parcours.", outils: ["flashcards", "carte-mentale", "metacognition"] }
  ];
  Boussole.actionsApprendre = ACTIONS;

  function actionParId(id) { return ACTIONS.filter(function (a) { return a.id === id; })[0]; }

  function tuileOutil(o) {
    return UI.el("a.tuile", { href: "#/" + o.id }, [
      UI.el("span.tuile-ic", { text: o.icone, "aria-hidden": "true" }),
      UI.el("h3", { text: o.titre }),
      UI.el("p", { text: o.desc || "" })
    ]);
  }

  function vueAction(vue, a) {
    vue.appendChild(UI.el("button.btn.ghost", { text: "← Toutes les actions", style: "margin-bottom:.8rem", onclick: function () { Boussole.naviguer("apprendre"); } }));
    vue.appendChild(UI.enTete(a.icone + " " + a.titre, a.desc));
    var outils = a.outils.map(Boussole.outilParId).filter(Boolean).filter(Boussole.outilVisible);
    if (!outils.length) { vue.appendChild(UI.el("p.aide", { text: "Aucun outil disponible ici pour le moment." })); return; }
    var grille = UI.el(".grille");
    outils.forEach(function (o) { grille.appendChild(tuileOutil(o)); });
    vue.appendChild(grille);
  }

  function vueAccueil(vue) {
    vue.appendChild(UI.enTete("Par où commencer ?", "Choisis ce que tu veux faire. Chaque action te mène aux bons outils."));
    var grille = UI.el(".grille");
    ACTIONS.forEach(function (a) {
      grille.appendChild(UI.el("a.tuile", { href: "#/apprendre/" + a.id, style: "border-top:5px solid " + a.couleur }, [
        UI.el("span.tuile-ic", { text: a.icone, "aria-hidden": "true", style: "background:" + a.soft }),
        UI.el("h3", { text: a.titre }),
        UI.el("p", { text: a.desc })
      ]));
    });
    vue.appendChild(grille);
  }

  Boussole.registerTool({
    id: "apprendre", groupe: "meta", titre: "Par où commencer", icone: "🧩",
    desc: "Entre par action : Lire, Écrire, Comprendre ou Réviser.",
    render: function (vue, ctx) {
      var a = ctx.arg && actionParId(ctx.arg);
      if (a) return vueAction(vue, a);
      return vueAccueil(vue);
    }
  });
})();
