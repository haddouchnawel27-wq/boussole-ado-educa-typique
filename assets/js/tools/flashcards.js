/* Cartes de révision (flashcards) — moteur générique et local.
   Sert de socle pour mots (dyslexie), orthographe (dysorthographie),
   nombres (dyscalculie) et pour la métacognition (« je révise »).
   Données dans localStorage, aucune dépendance. */
(function () {
  "use strict";

  var CLE = "fc_paquets";
  var compteur = 0;
  function uid() { return "fc" + Date.now().toString(36) + (compteur++).toString(36); }

  function charger() { return Store.lire(CLE, []); }
  function sauver(paquets) { Store.ecrire(CLE, paquets); }
  function paquetParId(id) { return charger().filter(function (p) { return p.id === id; })[0]; }

  var CATEGORIES = [
    { id: "mots", nom: "Mots", couleur: "#4a7fa5" },
    { id: "orthographe", nom: "Orthographe", couleur: "#8a6bb0" },
    { id: "nombres", nom: "Nombres", couleur: "#3a7d6e" },
    { id: "libre", nom: "Libre", couleur: "#e8a33d" }
  ];
  function categorie(id) { return CATEGORIES.filter(function (c) { return c.id === id; })[0] || CATEGORIES[3]; }

  var MODELES = [
    {
      nom: "Mots à lire", categorie: "mots",
      cartes: [
        ["monsieur", "se lit « me-sieu »"],
        ["femme", "se lit « fame »"],
        ["oignon", "se lit « o-gnon »"],
        ["aquarium", "se lit « a-koua-rium »"],
        ["deuxième", "se lit « deu-zième »"],
        ["automne", "se lit « o-tone » (le m est muet)"]
      ]
    },
    {
      nom: "Pièges d'orthographe", categorie: "orthographe",
      cartes: [
        ["un chev… (pluriel)", "des chevaux"],
        ["a ou à ? « Il ___ faim »", "Il a faim (verbe avoir)"],
        ["et ou est ? « Il ___ content »", "Il est content (verbe être)"],
        ["accord : « des fille… »", "des filles"],
        ["beaucoup de…", "beaucoup s'écrit avec p muet"],
        ["toujours", "toujours prend toujours un s"]
      ]
    },
    {
      nom: "Nombres en lettres", categorie: "nombres",
      cartes: [
        ["80", "quatre-vingts"],
        ["quatre-vingts", "80"],
        ["71", "soixante et onze"],
        ["342", "trois cent quarante-deux"],
        ["200", "deux cents"],
        ["1000", "mille"]
      ]
    }
  ];

  /* ---------------- État interne (réinitialisé à chaque ouverture) -------- */
  var etat = { mode: "liste", paquetId: null };

  function go(vue, ctx, m, pid) { etat.mode = m; etat.paquetId = pid || null; rendre(vue, ctx); }

  /* ---------------- Vue : liste des paquets ------------------------------ */
  function vueListe(vue, ctx) {
    vue.appendChild(UI.enTete("Cartes de révision", "Crée des paquets de cartes (recto / verso) et révise-les à ton rythme. Idéal pour les mots, l'orthographe et les nombres."));

    vue.appendChild(UI.el(".btn-rangee", {}, [
      UI.el("button.btn", { text: "➕ Nouveau paquet", onclick: function () {
        editerPaquet(null, function (p) { var ps = charger(); ps.push(p); sauver(ps); go(vue, ctx, "editer", p.id); });
      }})
    ]));

    var paquets = charger();
    if (!paquets.length) {
      vue.appendChild(UI.vide("🃏", "Aucun paquet", "Crée le tien, ou pars d'un modèle ci-dessous."));
      vue.appendChild(UI.el("h2", { text: "Modèles prêts à l'emploi", style: "margin:1.4rem 0 .6rem" }));
      var grilleM = UI.el(".grille");
      MODELES.forEach(function (m) {
        var c = categorie(m.categorie);
        grilleM.appendChild(UI.el(".tuile", { onclick: function () {
          var p = { id: uid(), nom: m.nom, categorie: m.categorie, cartes: m.cartes.map(function (x) { return { id: uid(), recto: x[0], verso: x[1] }; }) };
          var ps = charger(); ps.push(p); sauver(ps); UI.toast("Modèle ajouté"); go(vue, ctx, "editer", p.id);
        }}, [
          UI.el("span.tuile-ic", { text: "🃏" }),
          UI.el("h3", { text: m.nom }),
          UI.el("p", { text: c.nom + " — " + m.cartes.length + " cartes" })
        ]));
      });
      vue.appendChild(grilleM);
      return;
    }

    var grille = UI.el(".grille");
    paquets.forEach(function (p) {
      var c = categorie(p.categorie);
      var tuile = UI.el(".carte", { style: "border-left:5px solid " + c.couleur }, [
        UI.el("div", { style: "font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:" + c.couleur, text: c.nom }),
        UI.el("h3", { text: p.nom, style: "margin:.2rem 0" }),
        UI.el("p.meta", { text: p.cartes.length + " carte" + (p.cartes.length > 1 ? "s" : "") }),
        UI.el(".btn-rangee", { style: "margin:.6rem 0 0" }, [
          UI.el("button.btn", { text: "Réviser", disabled: !p.cartes.length, onclick: function () { go(vue, ctx, "reviser", p.id); } }),
          UI.el("button.btn.secondaire", { text: "Modifier", onclick: function () { go(vue, ctx, "editer", p.id); } }),
          UI.el("button.btn.ghost", { text: "Supprimer", onclick: function () {
            UI.confirmer("Supprimer le paquet « " + p.nom + " » ?", { danger: true }).then(function (ok) {
              if (!ok) return;
              sauver(charger().filter(function (x) { return x.id !== p.id; })); go(vue, ctx, "liste");
            });
          }})
        ])
      ]);
      grille.appendChild(tuile);
    });
    vue.appendChild(grille);
  }

  /* ---------------- Modale : créer / renommer un paquet ------------------ */
  function editerPaquet(paquet, onOk) {
    var nom = UI.input({ value: paquet ? paquet.nom : "", placeholder: "ex. Mots de la semaine" });
    var sel = UI.select(CATEGORIES.map(function (c) { return { value: c.id, label: c.nom, selected: paquet && paquet.categorie === c.id }; }));
    UI.modal({
      titre: paquet ? "Renommer le paquet" : "Nouveau paquet",
      contenu: UI.el("div", {}, [UI.champ("Nom du paquet", nom), UI.champ("Catégorie", sel)]),
      texteOk: "Valider",
      onOk: function () {
        var n = nom.value.trim(); if (!n) return null;
        if (paquet) { paquet.nom = n; paquet.categorie = sel.value; var ps = charger(); sauver(ps.map(function (x) { return x.id === paquet.id ? paquet : x; })); return paquet; }
        return { id: uid(), nom: n, categorie: sel.value, cartes: [] };
      }
    }).then(function (res) { if (res && onOk) onOk(res); });
  }

  /* ---------------- Vue : édition des cartes ----------------------------- */
  function vueEditer(vue, ctx) {
    var p = paquetParId(etat.paquetId);
    if (!p) return go(vue, ctx, "liste");
    var c = categorie(p.categorie);

    vue.appendChild(UI.el("button.btn.ghost", { text: "← Tous les paquets", style: "margin-bottom:.8rem", onclick: function () { go(vue, ctx, "liste"); } }));
    vue.appendChild(UI.enTete(p.nom, c.nom + " — " + p.cartes.length + " carte" + (p.cartes.length > 1 ? "s" : "")));
    vue.appendChild(UI.el(".btn-rangee", {}, [
      UI.el("button.btn", { text: "Réviser", disabled: !p.cartes.length, onclick: function () { go(vue, ctx, "reviser", p.id); } }),
      UI.el("button.btn.secondaire", { text: "Renommer", onclick: function () { editerPaquet(p, function () { go(vue, ctx, "editer", p.id); }); } })
    ]));

    var recto = UI.input({ placeholder: "Recto (la question / le mot)" });
    var verso = UI.input({ placeholder: "Verso (la réponse)" });
    function ajouter() {
      if (!recto.value.trim() || !verso.value.trim()) { UI.toast("Remplis le recto et le verso"); return; }
      p.cartes.push({ id: uid(), recto: recto.value.trim(), verso: verso.value.trim() });
      sauver(charger().map(function (x) { return x.id === p.id ? p : x; }));
      go(vue, ctx, "editer", p.id);
    }
    vue.appendChild(UI.el(".carte", {}, [
      UI.champ("Recto", recto), UI.champ("Verso", verso),
      UI.el(".btn-rangee", { style: "margin-bottom:0" }, [UI.el("button.btn", { text: "➕ Ajouter la carte", onclick: ajouter })])
    ]));

    if (!p.cartes.length) { vue.appendChild(UI.el("p.aide", { text: "Ajoute ta première carte ci-dessus." })); return; }
    var liste = UI.el("ul.liste");
    p.cartes.forEach(function (carte) {
      liste.appendChild(UI.el("li.liste-item", {}, [
        UI.el("span.grow", {}, [UI.el("strong", { text: carte.recto }), document.createTextNode("  →  " + carte.verso)]),
        UI.el("button.btn.ghost", { text: "✕", "aria-label": "Supprimer la carte", onclick: function () {
          p.cartes = p.cartes.filter(function (x) { return x.id !== carte.id; });
          sauver(charger().map(function (x) { return x.id === p.id ? p : x; }));
          go(vue, ctx, "editer", p.id);
        }})
      ]));
    });
    vue.appendChild(liste);
  }

  /* ---------------- Vue : révision (carte qui se retourne) --------------- */
  function vueReviser(vue, ctx) {
    var p = paquetParId(etat.paquetId);
    if (!p || !p.cartes.length) return go(vue, ctx, "liste");

    var file = p.cartes.slice();
    // petit mélange déterministe à partir d'un décalage tournant
    for (var i = file.length - 1; i > 0; i--) { var j = (i * 7 + 3) % (i + 1); var t = file[i]; file[i] = file[j]; file[j] = t; }
    var pos = 0, sus = 0, aRevoir = [];

    vue.appendChild(UI.el("button.btn.ghost", { text: "← Quitter la révision", style: "margin-bottom:.8rem", onclick: function () { go(vue, ctx, "editer", p.id); } }));
    var enTete = UI.el("p.meta", { style: "text-align:center" });
    var zone = UI.el("div");
    vue.appendChild(enTete);
    vue.appendChild(zone);

    function afficherCarte() {
      UI.vider(zone);
      if (pos >= file.length) { return afficherBilan(); }
      var carte = file[pos];
      enTete.textContent = "Carte " + (pos + 1) + " / " + file.length;

      var retournee = false;
      var faceTxt = UI.el("div", { text: carte.recto, style: "font-size:1.8rem;font-weight:700;text-align:center;padding:2rem 1rem" });
      var indice = UI.el("p.aide", { text: "Appuie sur la carte pour voir la réponse", style: "text-align:center" });
      var carteEl = UI.el(".carte", { role: "button", tabindex: "0", style: "cursor:pointer;min-height:160px;display:flex;flex-direction:column;justify-content:center;border:2px solid var(--gris-clair)" }, [faceTxt, indice]);

      var actions = UI.el(".btn-rangee", { style: "justify-content:center;margin-top:1rem;display:none" });
      var btnSu = UI.el("button.btn", { text: "Je savais", onclick: function () { sus++; suivant(); } });
      var btnNon = UI.el("button.btn.secondaire", { text: "À revoir", onclick: function () { aRevoir.push(carte); suivant(); } });
      actions.appendChild(btnSu); actions.appendChild(btnNon);

      function retourner() {
        if (retournee) return;
        retournee = true;
        faceTxt.textContent = carte.verso;
        faceTxt.style.color = "var(--vert-fonce)";
        indice.style.display = "none";
        carteEl.style.borderColor = "var(--vert)";
        carteEl.style.cursor = "default";
        actions.style.display = "flex";
      }
      function suivant() { pos++; afficherCarte(); }
      carteEl.addEventListener("click", retourner);
      carteEl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); retourner(); } });

      zone.appendChild(carteEl);
      zone.appendChild(actions);
      carteEl.focus();
    }

    function afficherBilan() {
      enTete.textContent = "Terminé";
      var total = file.length;
      zone.appendChild(UI.el(".carte", { style: "text-align:center" }, [
        UI.el("div", { style: "font-size:2.4rem", text: aRevoir.length === 0 ? "🌟" : "👍" }),
        UI.el("h2", { text: sus + " / " + total + " su" + (sus > 1 ? "es" : "e"), style: "margin:.4rem 0" }),
        UI.el("p.meta", { text: aRevoir.length ? aRevoir.length + " carte" + (aRevoir.length > 1 ? "s" : "") + " à retravailler. C'est normal, on y revient." : "Bravo, tout est su pour aujourd'hui." })
      ]));
      var r = UI.el(".btn-rangee", { style: "justify-content:center" });
      if (aRevoir.length) {
        r.appendChild(UI.el("button.btn", { text: "Revoir celles à retravailler", onclick: function () {
          file = aRevoir.slice(); pos = 0; sus = 0; aRevoir = []; afficherCarte();
        }}));
      }
      r.appendChild(UI.el("button.btn.secondaire", { text: "Recommencer le paquet", onclick: function () { go(vue, ctx, "reviser", p.id); } }));
      r.appendChild(UI.el("button.btn.ghost", { text: "Retour", onclick: function () { go(vue, ctx, "editer", p.id); } }));
      zone.appendChild(r);
    }

    afficherCarte();
  }

  /* ---------------- Dispatcher ------------------------------------------- */
  function rendre(vue, ctx) {
    UI.vider(vue);
    if (etat.mode === "editer") return vueEditer(vue, ctx);
    if (etat.mode === "reviser") return vueReviser(vue, ctx);
    return vueListe(vue, ctx);
  }

  Boussole.registerTool({
    id: "flashcards", groupe: "tnd", titre: "Cartes de révision", icone: "🃏",
    desc: "Crée des paquets de cartes recto/verso et révise mots, orthographe ou nombres à ton rythme.",
    render: function (vue, ctx) {
      // À l'ouverture depuis le menu, on repart toujours de la liste.
      if (!ctx.arg) etat = { mode: "liste", paquetId: null };
      rendre(vue, ctx);
    }
  });
})();
