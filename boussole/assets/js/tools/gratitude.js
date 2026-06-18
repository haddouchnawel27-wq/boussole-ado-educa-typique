/* Carnet de gratitude & ancrage positif (approche bienveillante / spirituelle) */
(function () {
  "use strict";

  var INSPIRATIONS = [
    "Aujourd'hui, je suis reconnaissant·e pour…",
    "Une petite chose qui m'a fait du bien aujourd'hui…",
    "Une personne à qui je pense avec gratitude…",
    "Une qualité en moi que j'apprécie…",
    "Un moment de calme que j'ai vécu…",
    "Une difficulté qui m'a appris quelque chose…"
  ];

  Boussole.registerTool({
    id: "gratitude", groupe: "tcc", titre: "Carnet de gratitude", icone: "🌸",
    desc: "Cultiver le positif et l'ancrage intérieur : noter chaque jour ce pour quoi on est reconnaissant·e.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Carnet de gratitude", "Prendre un instant pour reconnaître le bon, même petit. Une pratique douce qui nourrit l'apaisement et le sens."));

      var inspiration = INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
      var txt = UI.textarea({ placeholder: inspiration });
      vue.appendChild(UI.el(".carte", {}, [
        UI.el("p", { html: "✨ <em>" + inspiration + "</em>" }),
        UI.champ("", txt),
        UI.el(".btn-rangee", { style: "margin-bottom:0" }, [
          UI.el("button.btn", { text: "💛 Ajouter au carnet", onclick: function () {
            if (!txt.value.trim()) { UI.toast("Écris quelques mots"); return; }
            Store.gratitudes.ajouter({ profilId: ctx.profil ? ctx.profil.id : null, texte: txt.value.trim(), invite: inspiration });
            UI.toast("Ajouté 🤲"); Boussole.naviguer("gratitude");
          }})
        ])
      ]));

      var liste = Store.gratitudes.filtre(function (g) { return !ctx.profil || g.profilId === ctx.profil.id; }).slice().reverse();
      if (liste.length) {
        vue.appendChild(UI.el("h2", { text: "Mon carnet", style: "margin:1.4rem 0 .5rem" }));
        var ul = UI.el("ul.liste");
        liste.forEach(function (g) {
          ul.appendChild(UI.el("li.liste-item", {}, [
            UI.el("span", { text: "🌸", style: "font-size:1.4rem" }),
            UI.el("div.grow", {}, [UI.el("div", { text: g.texte }), UI.el("div.meta", { text: UI.dateFr(g.cree) })]),
            UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () { Store.gratitudes.supprimer(g.id); Boussole.naviguer("gratitude"); } })
          ]));
        });
        vue.appendChild(ul);
      }
    }
  });
})();
