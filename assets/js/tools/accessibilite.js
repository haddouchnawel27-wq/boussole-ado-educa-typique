/* Réglages — accessibilité (dys, taille, contraste) + gestion des données */
(function () {
  "use strict";

  function prefs() { return Store.lire("prefs", { dys: false, taille: "normal", contraste: false, sombre: false }); }

  function appliquer() {
    var p = prefs();
    document.body.classList.toggle("dys", !!p.dys);
    document.body.classList.toggle("contraste", !!p.contraste);
    document.body.classList.toggle("sombre", !!p.sombre);
    document.body.classList.remove("txt-grand", "txt-tres-grand");
    if (p.taille === "grand") document.body.classList.add("txt-grand");
    if (p.taille === "tres-grand") document.body.classList.add("txt-tres-grand");
    // Réappliquer la couleur personnalisée (cohérence avec le mode sombre)
    if (Boussole.appliquerPerso) Boussole.appliquerPerso();
  }
  // expose pour app.js (appel au démarrage)
  Boussole.appliquerAccessibilite = appliquer;

  function sauver(modifs) { var p = prefs(); Object.assign(p, modifs); Store.ecrire("prefs", p); appliquer(); }

  // Sauvegarde locale : télécharge un fichier + mémorise la date (il n'y a PAS d'auto-save).
  function exporter(nom) {
    UI.telecharger(nom, JSON.stringify(Store.exporterTout(), null, 2));
    Store.ecrire("derniereSauvegarde", new Date().toISOString());
  }

  Boussole.registerTool({
    id: "reglages", groupe: "pro", titre: "Réglages & données", icone: "⚙️",
    desc: "Confort de lecture (police dys, taille, contraste) et gestion privée de vos données.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Réglages & données", "Adaptez l'affichage et gardez la maîtrise de vos données."));
      var p = prefs();

      // Accessibilité
      vue.appendChild(UI.el("h2", { text: "Confort de lecture", style: "margin:.5rem 0" }));
      var carteA = UI.el(".carte");

      var chkDys = UI.el("input", { type: "checkbox", checked: p.dys });
      chkDys.addEventListener("change", function () { sauver({ dys: chkDys.checked }); });
      carteA.appendChild(UI.el("label", { style: "display:flex;gap:.6rem;align-items:center;font-weight:600;margin-bottom:.8rem" }, [chkDys, document.createTextNode("Police adaptée « dys » + espacement renforcé")]));

      var selTaille = UI.select([
        { value: "normal", label: "Normale", selected: p.taille === "normal" },
        { value: "grand", label: "Grande", selected: p.taille === "grand" },
        { value: "tres-grand", label: "Très grande", selected: p.taille === "tres-grand" }
      ]);
      selTaille.addEventListener("change", function () { sauver({ taille: selTaille.value }); });
      carteA.appendChild(UI.champ("Taille du texte", selTaille));

      var chkC = UI.el("input", { type: "checkbox", checked: p.contraste });
      chkC.addEventListener("change", function () { sauver({ contraste: chkC.checked }); });
      carteA.appendChild(UI.el("label", { style: "display:flex;gap:.6rem;align-items:center;font-weight:600;margin-bottom:.8rem" }, [chkC, document.createTextNode("Contraste renforcé")]));

      var chkS = UI.el("input", { type: "checkbox", checked: p.sombre });
      chkS.addEventListener("change", function () { sauver({ sombre: chkS.checked }); });
      carteA.appendChild(UI.el("label", { style: "display:flex;gap:.6rem;align-items:center;font-weight:600" }, [chkS, document.createTextNode("🌙 Mode sombre (repos visuel)")]));
      vue.appendChild(carteA);

      // — Sections sensibles : réservées à la vue « Praticienne » —
      // (le confort de lecture ci-dessus reste accessible à tous ; l'activation
      //  du coin spiritualité, l'export/import et l'effacement ne le sont pas.)
      var estPro = !!(Boussole.publicActif && Boussole.publicActif() === "pro");
      if (!estPro) {
        vue.appendChild(UI.el("p.aide", { style: "margin-top:1.4rem", html: "🔒 La gestion des données (sauvegarde, effacement) et le coin spiritualité sont réservés à la <strong>praticienne</strong> (vue « Praticienne »)." }));
      } else {
        // Coin spiritualité (activation réservée à la praticienne)
        vue.appendChild(UI.el("h2", { text: "Coin spiritualité", style: "margin:1.4rem 0 .5rem" }));
        var carteSpi = UI.el(".carte");
        var chkSpi = UI.el("input", { type: "checkbox", checked: Store.lire("coinSpiritualite", false) });
        chkSpi.addEventListener("change", function () {
          Store.ecrire("coinSpiritualite", chkSpi.checked);
          Boussole.majNav();
          UI.toast(chkSpi.checked ? "🤲 Coin spiritualité activé" : "Coin spiritualité masqué");
        });
        carteSpi.appendChild(UI.el("label", { style: "display:flex;gap:.6rem;align-items:center;font-weight:600" }, [chkSpi, document.createTextNode("🤲 Activer le coin spiritualité")]));
        carteSpi.appendChild(UI.el("p.aide", { style: "margin:.5rem 0 0", text: "Quand il est activé, un menu « Coin spiritualité » apparaît avec vos ressources d'ancrage spirituel. Masqué par défaut : à vous de choisir quand le proposer." }));
        vue.appendChild(carteSpi);

        // Données — sauvegarde manuelle (pas d'auto-save) + rappel de la dernière sauvegarde
        vue.appendChild(UI.el("h2", { text: "Vos données", style: "margin:1.4rem 0 .5rem" }));
        var last = Store.lire("derniereSauvegarde", null);
        var jours = last ? Math.floor((Date.now() - new Date(last).getTime()) / 86400000) : null;
        var rappelWarn = (last === null) || (jours >= 7);
        var rappelTxt = (last === null)
          ? "⚠️ Aucune sauvegarde encore réalisée. Il n'y a PAS de sauvegarde automatique — exporte tes données dès maintenant et régulièrement."
          : rappelWarn
            ? ("⚠️ Dernière sauvegarde il y a " + jours + " jour(s), le " + new Date(last).toLocaleDateString("fr-FR") + ". Pense à en refaire une.")
            : ("✔ Dernière sauvegarde : " + new Date(last).toLocaleDateString("fr-FR") + ".");

        var inputImport = UI.el("input", { type: "file", accept: "application/json", style: "display:none" });
        inputImport.addEventListener("change", function () {
          var f = inputImport.files[0]; if (!f) return;
          var r = new FileReader();
          r.onload = function () {
            try { Store.importerTout(JSON.parse(r.result)); Boussole.rafraichirSelectProfil(); appliquer(); UI.toast("Sauvegarde importée ✓"); Boussole.naviguer("reglages"); }
            catch (e) { UI.toast("Fichier invalide"); }
          };
          r.readAsText(f);
        });
        vue.appendChild(UI.el(".carte", {}, [
          UI.el("p", { text: "Toutes les données (fiches, émotions, jetons, plans…) sont stockées uniquement dans ce navigateur, sur cet appareil. Rien n'est envoyé sur Internet." }),
          UI.el("p", { style: "font-weight:700;margin:.4rem 0;color:" + (rappelWarn ? "#b23c17" : "#4d7a4d"), text: rappelTxt }),
          UI.el("p.aide", { text: "Exporte une sauvegarde régulièrement, et toujours avant de changer d'appareil ou de vider le navigateur." }),
          UI.el(".btn-rangee", { style: "margin-bottom:0" }, [
            UI.el("button.btn", { text: "⬇️ Sauvegarder mes données", onclick: function () {
              exporter("boussole-sauvegarde-" + new Date().toISOString().slice(0, 10) + ".json");
              UI.toast("Sauvegarde téléchargée ✓");
              Boussole.naviguer("reglages");
            }}),
            UI.el("button.btn.secondaire", { text: "⬆️ Restaurer une sauvegarde", onclick: function () { inputImport.click(); } }),
            inputImport
          ])
        ]));

        vue.appendChild(UI.el(".carte", { style: "margin-top:1rem;border-color:#f0c9c2" }, [
          UI.el("h3", { text: "Effacer toutes les données" }),
          UI.el("p.aide", { text: "Action irréversible. Par sécurité, une sauvegarde est téléchargée automatiquement avant l'effacement." }),
          UI.el("button.btn.danger", { text: "🗑️ Tout effacer", onclick: function () {
            UI.confirmer("Effacer définitivement toutes les données de Boussole sur cet appareil ? Une sauvegarde sera téléchargée avant.", { danger: true, texteOk: "Sauvegarder puis effacer", titre: "Attention" }).then(function (ok) {
              if (ok) {
                // filet de sécurité : on télécharge TOUJOURS une sauvegarde avant d'effacer
                try { exporter("boussole-sauvegarde-avant-effacement-" + new Date().toISOString().slice(0, 10) + ".json"); } catch (e) {}
                Store.effacerTout(); Boussole.rafraichirSelectProfil(); appliquer(); UI.toast("Sauvegarde téléchargée, puis données effacées"); Boussole.naviguer("accueil");
              }
            });
          }})
        ]));
      }

      vue.appendChild(UI.el("p.aide", { style: "margin-top:1.5rem", html: "🧭 <strong>Boussole</strong> — outil de soutien à l'accompagnement. Il ne remplace pas un diagnostic ni un avis médical." }));
    }
  });
})();
