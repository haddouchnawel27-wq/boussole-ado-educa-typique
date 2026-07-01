/* Accueil — tableau de bord intelligent */
(function () {
  "use strict";

  var NIV_EMO = ["", "😞", "🙁", "😐", "🙂", "😄"];

  function salutation() {
    var h = new Date().getHours();
    if (h < 6) return "Bonne nuit";
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonne soirée";
  }

  function tuileOutil(o, avecEtoile) {
    var tuile = UI.el("a.tuile", { href: "#/" + o.id }, [
      UI.el("span.tuile-ic", { text: o.icone, "aria-hidden": "true" }),
      UI.el("h3", { text: o.titre }),
      UI.el("p", { text: o.desc || "" })
    ]);
    if (avecEtoile) {
      var fav = Boussole.estFavori(o.id);
      var btn = UI.el("button.fav-btn", { text: fav ? "★" : "☆", title: fav ? "Retirer des favoris" : "Épingler", "aria-label": "Épingler " + o.titre });
      btn.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        Boussole.toggleFavori(o.id); Boussole.naviguer("accueil");
      });
      tuile.appendChild(btn);
    }
    return tuile;
  }

  Boussole.registerTool({
    id: "accueil", groupe: "accueil", titre: "Accueil", icone: "🏠",
    render: function (vue, ctx) {
      var p = Boussole.perso ? Boussole.perso() : {};
      var titre = (p.accueilMode === "fixe" && p.accueilTexte) ? p.accueilTexte : (salutation() + " 👋");
      var sous = "Votre boîte à outils d'accompagnement. Tout reste privé, sur cet appareil.";
      if (p.nomCabinet) sous = p.nomCabinet + " — " + sous;
      vue.appendChild(UI.enTete(titre, sous));

      // Bouton d'installation (si l'app n'est pas déjà installée)
      if (Boussole.installDispo && Boussole.installDispo()) {
        vue.appendChild(UI.el(".btn-rangee", {}, [
          UI.el("button.btn", { text: "📲 Installer l'application sur cet appareil", onclick: function () { Boussole.lancerInstall(); } })
        ]));
      }

      // --- Bandeau jeune actif : aperçu + actions rapides ---
      if (ctx.profil) {
        var pid = ctx.profil.id;
        var humeurs = Store.humeurs.filtre(function (h) { return h.profilId === pid; });
        var derH = humeurs.slice().sort(function (a, b) { return new Date(b.cree) - new Date(a.cree); })[0];
        var emos = Store.emotions.filtre(function (e) { return e.profilId === pid; });
        var derE = emos.slice().sort(function (a, b) { return new Date(b.cree) - new Date(a.cree); })[0];
        var solde = Store.jetonsEvts.filtre(function (j) { return j.profilId === pid; }).reduce(function (s, j) { return s + j.montant; }, 0);

        var apercu = UI.el(".carte", { style: "background:var(--vert-clair);border-color:#cfe5df" });
        apercu.appendChild(UI.el("div", { style: "display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:space-between" }, [
          UI.el("div", {}, [
            UI.el("div", { style: "font-weight:800;font-size:1.2rem", text: "🧑 " + ctx.profil.prenom + (ctx.profil.age ? " · " + ctx.profil.age + " ans" : "") }),
            UI.el("div.meta", { text: (derH ? "Humeur " + NIV_EMO[derH.niveau] + " (" + UI.dateFr(derH.cree) + ")" : "Pas encore d'humeur notée") + (derE ? " · Dernière émotion : " + derE.emoji + " " + derE.emotion : "") })
          ]),
          UI.el("div", { style: "text-align:center" }, [
            UI.el("div", { style: "font-size:1.6rem;font-weight:800;color:var(--ambre)", text: "⭐ " + solde }),
            UI.el("div.meta", { text: "jetons" })
          ])
        ]));
        apercu.appendChild(UI.el("div.btn-rangee", { style: "margin:.9rem 0 0" }, [
          UI.el("a.btn", { href: "#/emotions", text: "🌡️ Noter une émotion" }),
          UI.el("a.btn.secondaire", { href: "#/humeur", text: "📈 Humeur du jour" }),
          UI.el("a.btn.secondaire", { href: "#/respiration", text: "🫁 Respirer" }),
          UI.el("a.btn.secondaire", { href: "#/suivi", text: "🗂️ Dossier de suivi" })
        ]));
        vue.appendChild(apercu);
      } else {
        var a = UI.el(".alerte", {}, [
          UI.el("strong", { text: "Astuce : " }),
          document.createTextNode("sélectionnez un jeune en haut de l'écran (ou créez une fiche) pour relier ses émotions, jetons et suivis. Les outils restent utilisables librement sans fiche.")
        ]);
        a.appendChild(UI.el("div.btn-rangee", { style: "margin-bottom:0" }, [
          UI.el("a.btn", { href: "#/profils", text: "➕ Créer une fiche jeune" })
        ]));
        vue.appendChild(a);
      }

      // --- Par où commencer ? (Home par actions d'apprentissage) ---
      if (Boussole.actionsApprendre) {
        vue.appendChild(UI.el("h2", { text: "Par où commencer ?", style: "margin:1.6rem 0 .6rem" }));
        var ga = UI.el(".grille");
        Boussole.actionsApprendre.forEach(function (a) {
          ga.appendChild(UI.el("a.tuile", { href: "#/apprendre/" + a.id, style: "border-top:5px solid " + a.couleur }, [
            UI.el("span.tuile-ic", { text: a.icone, "aria-hidden": "true", style: "background:" + a.soft }),
            UI.el("h3", { text: a.titre }),
            UI.el("p", { text: a.desc })
          ]));
        });
        vue.appendChild(ga);
      }

      // --- Favoris ---
      var favs = Boussole.favoris().map(Boussole.outilParId).filter(Boolean).filter(Boussole.outilVisible);
      if (favs.length) {
        vue.appendChild(UI.el("h2", { text: "⭐ Mes favoris", style: "margin:1.6rem 0 .6rem" }));
        var gf = UI.el(".grille");
        favs.forEach(function (o) { gf.appendChild(tuileOutil(o, true)); });
        vue.appendChild(gf);
      }

      // --- Récemment utilisés ---
      var rec = Boussole.recents().filter(function (o) { return o.id !== "accueil" && Boussole.outilVisible(o); }).slice(0, 6);
      if (rec.length) {
        vue.appendChild(UI.el("h2", { text: "🕓 Repris récemment", style: "margin:1.6rem 0 .6rem" }));
        var gr = UI.el(".grille");
        rec.forEach(function (o) { gr.appendChild(tuileOutil(o, false)); });
        vue.appendChild(gr);
      }

      // --- Catalogue complet par groupe (avec épinglage) ---
      var groupes = ["ressources", "tnd", "meta", "tcc", "enfants", "secours", "spirituel", "pro"];
      groupes.forEach(function (g) {
        if (g === "spirituel" && !Boussole.spiritualiteActive()) return;
        var liste = Boussole.tousLesOutils().filter(function (o) { return o.groupe === g && Boussole.outilVisible(o); });
        if (!liste.length) return;
        vue.appendChild(UI.el("h2", { text: Boussole.nomGroupe(g), style: "margin:1.6rem 0 .6rem" }));
        var grille = UI.el(".grille");
        liste.forEach(function (o) { grille.appendChild(tuileOutil(o, true)); });
        vue.appendChild(grille);
      });
    }
  });
})();
