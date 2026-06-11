/* Accueil — tableau de bord et accès aux outils */
(function () {
  "use strict";

  Boussole.registerTool({
    id: "accueil", groupe: "accueil", titre: "Accueil", icone: "🏠",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete(
        "Bonjour 👋",
        "Votre boîte à outils d'accompagnement. Choisissez un jeune en haut de l'écran, puis un outil ci-dessous. Tout reste privé, sur cet appareil."
      ));

      if (!ctx.profil) {
        var a = UI.el(".alerte", {}, [
          UI.el("strong", { text: "Astuce : " }),
          document.createTextNode("commencez par créer une fiche pour un jeune afin de relier ses émotions, jetons et suivis. Vous pouvez aussi utiliser les outils librement sans fiche.")
        ]);
        a.appendChild(UI.el("div.btn-rangee", { style: "margin-bottom:0" }, [
          UI.el("a.btn", { href: "#/profils", text: "➕ Créer une fiche jeune" })
        ]));
        vue.appendChild(a);
      } else {
        vue.appendChild(UI.el("p", {}, [
          document.createTextNode("Jeune sélectionné·e : "),
          UI.el("span.pilule", { text: ctx.profil.prenom + (ctx.profil.age ? " · " + ctx.profil.age + " ans" : "") })
        ]));
      }

      // Regrouper les tuiles par groupe
      var groupes = ["tnd", "tcc", "secours", "spirituel", "pro"];
      groupes.forEach(function (g) {
        var liste = Boussole.tousLesOutils().filter(function (o) { return o.groupe === g; });
        if (!liste.length) return;
        vue.appendChild(UI.el("h2", { text: Boussole.nomGroupe(g), style: "margin:1.6rem 0 .6rem" }));
        var grille = UI.el(".grille");
        liste.forEach(function (o) {
          grille.appendChild(UI.el("a.tuile", { href: "#/" + o.id }, [
            UI.el("span.tuile-ic", { text: o.icone, "aria-hidden": "true" }),
            UI.el("h3", { text: o.titre }),
            UI.el("p", { text: o.desc || "" })
          ]));
        });
        vue.appendChild(grille);
      });
    }
  });
})();
