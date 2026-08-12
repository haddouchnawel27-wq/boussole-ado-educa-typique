/* Coachy — coach de focus pour ado : check-in batterie → mission → rounds →
   checkpoint, avec routeur (« Je bloque / Je décroche / Ça monte »), parking à
   pensées, resets et mini-jeux. Application autonome (coachy/index.html)
   embarquée telle quelle : on préserve la V1 sans la réécrire, le temps du
   bêta-test. 100% local, aucune donnée envoyée. */
(function () {
  "use strict";

  var URL_COACHY = "coachy/index.html";

  Boussole.registerTool({
    id: "coachy", groupe: "tnd", titre: "Coachy", icone: "🎮",
    desc: "Ton coach pour apprendre à piloter ton cerveau : une séance de devoirs par rounds, à ton rythme.",
    render: function (vue) {
      vue.appendChild(UI.enTete(
        "Coachy 🎮🧠",
        "Ton coach pour apprendre à piloter ton cerveau. On prépare le terrain, on choisit une mission, on bosse par rounds — et Coachy reste dans le coin sans devenir le relou de service."
      ));

      // Bandeau bêta : Coachy en est à sa V1, on observe avant d'enrichir.
      vue.appendChild(UI.el("p.aide", {
        style: "background:#f6f3fb;border-left:4px solid #9B7AD8;border-radius:10px;padding:.7rem .9rem;margin:0 0 1rem",
        text: "🧪 Version 1 bêta — on teste le cœur du jeu avec de vrais ados avant d'ajouter quoi que ce soit. Tes retours façonneront la suite."
      }));

      // Ouverture en plein écran (idéal sur mobile / pour envoyer le lien à un ado).
      vue.appendChild(UI.el(".btn-rangee", { style: "margin-bottom:1rem" }, [
        UI.el("a.btn", {
          href: URL_COACHY, target: "_blank", rel: "noopener",
          text: "🚀 Ouvrir Coachy en plein écran ↗"
        })
      ]));

      // Coachy embarqué tel quel. L'iframe partage l'origine : les observations
      // gardées restent dans le localStorage de cet appareil, comme prévu.
      var cadre = UI.el("iframe", {
        src: URL_COACHY,
        title: "Coachy — coach de focus",
        loading: "lazy",
        style: "width:100%;height:78vh;min-height:520px;border:1px solid var(--gris-clair);border-radius:16px;background:#fff"
      });
      vue.appendChild(cadre);

      vue.appendChild(UI.el("p.aide", {
        style: "margin-top:1rem",
        text: "Coachy n'est pas un outil diagnostique ni un substitut à un professionnel. Aucune donnée n'est envoyée en ligne."
      }));
    }
  });
})();
