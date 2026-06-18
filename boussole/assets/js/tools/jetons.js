/* Économie de jetons — renforcement positif (token economy) */
(function () {
  "use strict";

  Boussole.registerTool({
    id: "jetons", groupe: "tnd", titre: "Tableau de jetons", icone: "⭐",
    desc: "Système de renforcement positif : on gagne des jetons, on les échange contre des récompenses.",
    render: function (vue, ctx) {
      if (!ctx.profil) {
        vue.appendChild(UI.enTete("Tableau de jetons", ""));
        vue.appendChild(UI.el(".alerte", {}, [document.createTextNode("Sélectionnez un jeune en haut de l'écran pour gérer ses jetons. ")]));
        vue.appendChild(UI.el("a.btn", { href: "#/profils", text: "Choisir un jeune" }));
        return;
      }
      var pid = ctx.profil.id;
      vue.appendChild(UI.enTete("Jetons de " + ctx.profil.prenom, "Valorisez les efforts et comportements positifs. Restez bienveillant : on ne retire pas de jetons en punition."));

      function evts() { return Store.jetonsEvts.filtre(function (e) { return e.profilId === pid; }); }
      function solde() { return evts().reduce(function (s, e) { return s + e.montant; }, 0); }
      function recompenses() { return Store.recompenses.filtre(function (r) { return r.profilId === pid; }); }

      var compteur = UI.el(".jeton-compteur");
      var visu = UI.el(".jetons-visu");
      function majSolde() {
        var n = solde();
        compteur.textContent = "⭐ " + n;
        UI.vider(visu);
        for (var i = 0; i < Math.min(n, 60); i++) visu.appendChild(UI.el("span.jeton-pic", { text: "⭐" }));
        if (n > 60) visu.appendChild(UI.el("span", { text: " +" + (n - 60), style: "align-self:center;font-weight:700" }));
      }

      vue.appendChild(UI.el(".carte", { style: "text-align:center" }, [compteur, visu]));

      // Gagner des jetons
      vue.appendChild(UI.el("h2", { text: "Gagner des jetons", style: "margin:1.4rem 0 .5rem" }));
      var rangee = UI.el(".btn-rangee");
      [1, 2, 3, 5].forEach(function (m) {
        rangee.appendChild(UI.el("button.btn", { text: "+" + m + " ⭐", onclick: function () {
          UI.modal({ titre: "Pourquoi " + m + " jeton" + (m > 1 ? "s" : "") + " ?", contenu: (function () { var i = UI.input({ placeholder: "ex. A rangé sa chambre" }); editerRaison = i; return UI.champ("Motif (optionnel)", i); })(), texteOk: "Ajouter", onOk: function () {
            Store.jetonsEvts.ajouter({ profilId: pid, montant: m, motif: editerRaison.value.trim(), type: "gain" });
            majSolde(); majHistorique(); UI.toast("+" + m + " jeton" + (m > 1 ? "s" : "") + " 🎉"); return true;
          }});
        }}));
      });
      var editerRaison = null;
      vue.appendChild(rangee);

      // Récompenses
      vue.appendChild(UI.el("h2", { text: "Récompenses", style: "margin:1.4rem 0 .5rem" }));
      vue.appendChild(UI.el(".btn-rangee", {}, [UI.el("button.btn.secondaire", { text: "➕ Ajouter une récompense", onclick: function () {
        var nom = UI.input({ placeholder: "ex. 30 min de jeu vidéo" });
        var cout = UI.input({ type: "number", min: 1, value: 10 });
        UI.modal({ titre: "Nouvelle récompense", contenu: UI.el("div", {}, [UI.champ("Récompense", nom), UI.champ("Coût en jetons", cout)]), texteOk: "Ajouter", onOk: function () {
          if (!nom.value.trim()) { UI.toast("Indiquez la récompense"); return false; }
          Store.recompenses.ajouter({ profilId: pid, nom: nom.value.trim(), cout: parseInt(cout.value, 10) || 1 });
          majRecompenses(); return true;
        }});
      }})]));
      var blocRec = UI.el("ul.liste");
      function majRecompenses() {
        UI.vider(blocRec);
        var recs = recompenses();
        if (!recs.length) { blocRec.appendChild(UI.el("p.aide", { text: "Aucune récompense définie. Co-construisez-les avec le jeune et le parent." })); return; }
        recs.forEach(function (r) {
          var possible = solde() >= r.cout;
          blocRec.appendChild(UI.el("li.liste-item", {}, [
            UI.el("span", { text: "🎁", style: "font-size:1.5rem" }),
            UI.el("div.grow", {}, [UI.el("strong", { text: r.nom }), UI.el("div.meta", { text: r.cout + " jetons" })]),
            UI.el("button.btn" + (possible ? "" : ".ghost"), { text: "Échanger", disabled: !possible, onclick: function () {
              UI.confirmer("Échanger " + r.cout + " jetons contre « " + r.nom + " » ?").then(function (ok) {
                if (ok) { Store.jetonsEvts.ajouter({ profilId: pid, montant: -r.cout, motif: "Récompense : " + r.nom, type: "echange" }); majSolde(); majRecompenses(); majHistorique(); UI.toast("🎁 Récompense échangée !"); }
              });
            }}),
            UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () { Store.recompenses.supprimer(r.id); majRecompenses(); } })
          ]));
        });
      }
      vue.appendChild(blocRec);

      // Historique
      vue.appendChild(UI.el("h2", { text: "Historique", style: "margin:1.4rem 0 .5rem" }));
      var histo = UI.el("ul.liste");
      function majHistorique() {
        UI.vider(histo);
        var es = evts().slice().reverse().slice(0, 30);
        if (!es.length) { histo.appendChild(UI.el("p.aide", { text: "Rien pour l'instant." })); return; }
        es.forEach(function (e) {
          histo.appendChild(UI.el("li.liste-item", {}, [
            UI.el("span", { text: e.montant > 0 ? "➕" : "🎁", style: "font-size:1.3rem" }),
            UI.el("div.grow", {}, [UI.el("strong", { text: (e.montant > 0 ? "+" : "") + e.montant + " ⭐" }), UI.el("div.meta", { text: (e.motif || "") + " — " + UI.dateHeureFr(e.cree) })])
          ]));
        });
      }
      vue.appendChild(histo);

      majSolde(); majRecompenses(); majHistorique();
    }
  });
})();
