/* Personnalisation : couleur d'accent, logo et message d'accueil. */
(function () {
  "use strict";

  var COULEURS = {
    violet: { nom: "Violet",      clair: "#EFE7FB", base: "#8259C0", fonce: "#6D46A8" },
    vert:   { nom: "Vert sauge",  clair: "#e7f2ef", base: "#3a7d6e", fonce: "#2c6055" },
    bleu:   { nom: "Bleu doux",   clair: "#e6eef5", base: "#4a7fa5", fonce: "#38617f" },
    rose:   { nom: "Rose",        clair: "#fbe9f0", base: "#d46a93", fonce: "#b34f78" },
    corail: { nom: "Corail",      clair: "#fdeceb", base: "#e26d5c", fonce: "#c9543f" },
    ambre:  { nom: "Ambre",       clair: "#fdf1e0", base: "#d98e2b", fonce: "#b5731f" },
    nuit:   { nom: "Bleu nuit",   clair: "#e7eaf2", base: "#3f4d7a", fonce: "#2c3760" }
  };
  var LOGOS = ["🧭", "🌟", "🌈", "💛", "🦋", "🌻", "🧸", "❤️", "🌿", "🕊️", "🌸", "✨"];

  function perso() {
    return Object.assign({ couleur: "violet", logo: "🧭", accueilMode: "heure", accueilTexte: "", nomCabinet: "" }, Store.lire("perso", {}));
  }
  function sauver(modifs) { var p = perso(); Object.assign(p, modifs); Store.ecrire("perso", p); appliquer(); }

  function appliquer() {
    var p = perso();
    var c = COULEURS[p.couleur] || COULEURS.vert;
    var b = document.body.style;
    b.setProperty("--vert", c.base);
    b.setProperty("--vert-fonce", c.fonce);
    if (document.body.classList.contains("sombre")) b.removeProperty("--vert-clair");
    else b.setProperty("--vert-clair", c.clair);
    var logo = document.querySelector(".brand-logo");
    if (logo) logo.textContent = p.logo || "🧭";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", c.base);
  }
  Boussole.appliquerPerso = appliquer;
  Boussole.perso = perso;

  Boussole.registerTool({
    id: "personnalisation", groupe: "pro", titre: "Personnalisation", icone: "🎨",
    desc: "Adaptez Cap Educa à votre image : couleur, logo et message d'accueil.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Personnalisation", "Rendez Boussole vraiment vôtre. Les changements s'appliquent immédiatement et sont gardés sur cet appareil."));
      var p = perso();

      // --- Couleur ---
      vue.appendChild(UI.el("h2", { text: "Couleur principale", style: "margin:.5rem 0" }));
      var grilleC = UI.el(".grille", { style: "grid-template-columns:repeat(auto-fill,minmax(120px,1fr))" });
      Object.keys(COULEURS).forEach(function (cle) {
        var c = COULEURS[cle];
        var sel = p.couleur === cle;
        var b = UI.el("button.emo-btn", { style: "border-color:" + (sel ? c.base : "var(--gris-clair)") + (sel ? ";border-width:3px" : "") , onclick: function () { sauver({ couleur: cle }); Boussole.naviguer("personnalisation"); } }, [
          UI.el("span", { style: "width:40px;height:40px;border-radius:50%;background:" + c.base + ";display:inline-block" }),
          UI.el("span", { text: c.nom, style: "font-size:.85rem" }),
          sel ? UI.el("span", { text: "✓ actuel", style: "font-size:.75rem;color:" + c.fonce + ";font-weight:700" }) : null
        ]);
        grilleC.appendChild(b);
      });
      vue.appendChild(grilleC);

      // --- Logo ---
      vue.appendChild(UI.el("h2", { text: "Logo (en haut à gauche)", style: "margin:1.4rem 0 .5rem" }));
      var grilleL = UI.el(".emo-grille", { style: "grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:.4rem" });
      LOGOS.forEach(function (emo) {
        var b = UI.el("button.emo-btn", { style: "font-size:1.8rem;padding:.5rem", text: emo, onclick: function () { sauver({ logo: emo }); Boussole.naviguer("personnalisation"); } });
        if (p.logo === emo) b.classList.add("choisi");
        grilleL.appendChild(b);
      });
      vue.appendChild(grilleL);

      // --- Message d'accueil ---
      vue.appendChild(UI.el("h2", { text: "Message d'accueil", style: "margin:1.4rem 0 .5rem" }));
      var carte = UI.el(".carte");
      var selMode = UI.select([
        { value: "heure", label: "S'adapte à l'heure (Bonjour / Bon après-midi / Bonne soirée)", selected: p.accueilMode === "heure" },
        { value: "fixe", label: "Message fixe personnalisé", selected: p.accueilMode === "fixe" }
      ]);
      var champTexte = UI.input({ value: p.accueilTexte || "", placeholder: "ex. Bienvenue chez Educa Typique" });
      var blocTexte = UI.champ("Votre message", champTexte);
      blocTexte.style.display = p.accueilMode === "fixe" ? "" : "none";
      selMode.addEventListener("change", function () { blocTexte.style.display = selMode.value === "fixe" ? "" : "none"; sauver({ accueilMode: selMode.value }); });
      champTexte.addEventListener("change", function () { sauver({ accueilTexte: champTexte.value.trim() }); UI.toast("Message mis à jour"); });
      carte.appendChild(UI.champ("Type de message", selMode));
      carte.appendChild(blocTexte);

      var champCab = UI.input({ value: p.nomCabinet || "", placeholder: "ex. Cabinet Educa Typique" });
      champCab.addEventListener("change", function () { sauver({ nomCabinet: champCab.value.trim() }); UI.toast("Enregistré"); });
      carte.appendChild(UI.champ("Nom de votre cabinet (optionnel, affiché sur l'accueil)", champCab));
      vue.appendChild(carte);

      vue.appendChild(UI.el(".btn-rangee", { style: "margin-top:1.2rem" }, [
        UI.el("button.btn.ghost", { text: "↺ Revenir aux réglages par défaut", onclick: function () {
          UI.confirmer("Réinitialiser couleur, logo et message d'accueil ?").then(function (ok) {
            if (ok) { Store.ecrire("perso", {}); appliquer(); Boussole.naviguer("personnalisation"); UI.toast("Réinitialisé"); }
          });
        }})
      ]));
    }
  });
})();
