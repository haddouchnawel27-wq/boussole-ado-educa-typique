/* Coin spiritualité — espace privé, activé uniquement par la praticienne.
   Rassemble les ressources d'ancrage spirituel. Liens modifiables. */
(function () {
  "use strict";

  var PAR_DEFAUT = [
    { id: "sp-souffle", emoji: "🕊️", titre: "Souffle & Lumière — Jannat Al Qalb", desc: "Espace d'apaisement et d'ancrage spirituel pour ados", url: "https://boussoleado-souffle-lumiere-voiechifa.netlify.app/" },
    { id: "sp-emo612", emoji: "🤲", titre: "Boîte à émotions 6-12 ans (spirituelle)", desc: "Gestion des émotions, approche islamique", url: "https://boite-outil-emotions-6-12ans-isl.netlify.app/" }
  ];

  function liens() {
    var v = Store.lire("liensSpirituels", null);
    if (v === null) { Store.ecrire("liensSpirituels", PAR_DEFAUT.slice()); return PAR_DEFAUT.slice(); }
    return v;
  }
  function sauver(arr) { Store.ecrire("liensSpirituels", arr); }

  function editer(lien, onValide) {
    var titre = UI.input({ value: lien ? lien.titre : "", placeholder: "Nom de la ressource" });
    var url = UI.input({ value: lien ? lien.url : "", placeholder: "https://…" });
    var desc = UI.input({ value: lien ? lien.desc : "", placeholder: "Courte description" });
    var emoji = UI.input({ value: lien ? lien.emoji : "🤲", placeholder: "🤲", style: "max-width:90px" });
    UI.modal({
      titre: lien ? "Modifier la ressource" : "Ajouter une ressource",
      contenu: UI.el("div", {}, [UI.champ("Nom", titre), UI.champ("Adresse (URL)", url), UI.champ("Description", desc), UI.champ("Icône (emoji)", emoji)]),
      texteOk: "Enregistrer",
      onOk: function () {
        if (!titre.value.trim() || !url.value.trim()) { UI.toast("Nom et adresse requis"); return false; }
        var u = url.value.trim(); if (!/^https?:\/\//i.test(u)) u = "https://" + u;
        onValide({ titre: titre.value.trim(), url: u, desc: desc.value.trim(), emoji: emoji.value.trim() || "🤲" });
        return true;
      }
    });
  }

  Boussole.registerTool({
    id: "spiritualite", groupe: "spirituel", titre: "Coin spiritualité", icone: "🤲",
    desc: "Vos ressources d'ancrage spirituel, réunies dans un espace privé que vous activez vous-même.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Coin spiritualité 🤲", "Un espace que vous seule activez, pour proposer un ancrage spirituel aux consultants qui le souhaitent. Les ressources s'ouvrent dans un nouvel onglet."));

      vue.appendChild(UI.el(".alerte", {}, [
        document.createTextNode("Ce coin est "),
        UI.el("strong", { text: "désactivable à tout moment" }),
        document.createTextNode(" dans « Réglages & données ». Il reste masqué tant que vous ne l'activez pas.")
      ]));

      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "➕ Ajouter une ressource", onclick: function () {
          editer(null, function (d) { var arr = liens(); d.id = Store.id(); arr.push(d); sauver(arr); Boussole.naviguer("spiritualite"); });
        }})
      ]));

      var arr = liens();
      if (!arr.length) { vue.appendChild(UI.vide("🤲", "Aucune ressource", "Ajoutez vos espaces spirituels.")); return; }

      var grille = UI.el(".grille");
      arr.forEach(function (l) {
        var tuile = UI.el(".tuile", {}, [
          UI.el("span.tuile-ic", { text: l.emoji || "🤲", "aria-hidden": "true" }),
          UI.el("h3", { text: l.titre }),
          UI.el("p", { text: l.desc || "" }),
          UI.el(".btn-rangee", { style: "margin:.4rem 0 0" }, [
            UI.el("a.btn.secondaire", { href: l.url, target: "_blank", rel: "noopener", text: "Ouvrir ↗", onclick: function (e) { e.stopPropagation(); } }),
            UI.el("button.btn.ghost", { text: "✏️", "aria-label": "Modifier", onclick: function (e) { e.stopPropagation(); editer(l, function (d) { Object.assign(l, d); sauver(arr); Boussole.naviguer("spiritualite"); }); } }),
            UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Retirer", onclick: function (e) { e.stopPropagation(); UI.confirmer("Retirer « " + l.titre + " » ?", { danger: true, texteOk: "Retirer" }).then(function (ok) { if (ok) { sauver(arr.filter(function (x) { return x !== l; })); Boussole.naviguer("spiritualite"); } }); } })
          ])
        ]);
        tuile.addEventListener("click", function () { window.open(l.url, "_blank", "noopener"); });
        grille.appendChild(tuile);
      });
      vue.appendChild(grille);
    }
  });
})();
