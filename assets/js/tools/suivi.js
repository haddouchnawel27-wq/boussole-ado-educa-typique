/* Dossier de suivi consolidé d'un jeune :
   frise chronologique de tout ce qui est noté + notes de séance + objectifs. */
(function () {
  "use strict";

  var FILTRES = [
    { type: "tout", label: "Tout", icone: "🗂️" },
    { type: "humeur", label: "Humeurs", icone: "📈" },
    { type: "emotion", label: "Émotions", icone: "🌡️" },
    { type: "pensee", label: "Pensées", icone: "💭" },
    { type: "abc", label: "Comportements", icone: "🔍" },
    { type: "jeton", label: "Jetons", icone: "⭐" },
    { type: "note", label: "Notes", icone: "📝" }
  ];

  Boussole.registerTool({
    id: "suivi", groupe: "pro", titre: "Dossier de suivi", icone: "🗂️",
    desc: "Vue d'ensemble par jeune : frise chronologique, notes de séance, objectifs et synthèse imprimable.",
    render: function (vue, ctx) {
      if (!ctx.profil) {
        vue.appendChild(UI.enTete("Dossier de suivi", ""));
        vue.appendChild(UI.el(".alerte", {}, [document.createTextNode("Sélectionnez un jeune en haut de l'écran pour afficher son dossier. ")]));
        vue.appendChild(UI.el("a.btn", { href: "#/profils", text: "Choisir un jeune" }));
        return;
      }
      var p = ctx.profil, pid = p.id;
      vue.appendChild(UI.enTete("Dossier — " + p.prenom, "Tout l'accompagnement de " + p.prenom + " réuni. Idéal pour préparer ou conclure une séance."));

      // --- Synthèse rapide ---
      var humeurs = Store.humeurs.filtre(function (h) { return h.profilId === pid; });
      var derH = humeurs.slice().sort(function (a, b) { return new Date(b.cree) - new Date(a.cree); })[0];
      var NIV_EMO = ["", "😞", "🙁", "😐", "🙂", "😄"];
      var solde = Store.jetonsEvts.filtre(function (j) { return j.profilId === pid; }).reduce(function (s, j) { return s + j.montant; }, 0);
      var nbEmo = Store.emotions.filtre(function (e) { return e.profilId === pid; }).length;
      var journal = Store.journalDuJeune(pid);

      var stats = UI.el(".grille", { style: "grid-template-columns:repeat(auto-fill,minmax(150px,1fr))" });
      [
        { ic: derH ? NIV_EMO[derH.niveau] : "📈", t: derH ? "Dernière humeur" : "Aucune humeur", v: derH ? UI.dateFr(derH.cree) : "—" },
        { ic: "🌡️", t: "Émotions notées", v: nbEmo },
        { ic: "⭐", t: "Solde de jetons", v: solde },
        { ic: "🗂️", t: "Événements", v: journal.length }
      ].forEach(function (s) {
        stats.appendChild(UI.el(".carte", { style: "text-align:center" }, [
          UI.el("div", { style: "font-size:1.8rem", text: s.ic }),
          UI.el("div", { style: "font-size:1.4rem;font-weight:800", text: String(s.v) }),
          UI.el("div.meta", { text: s.t })
        ]));
      });
      vue.appendChild(stats);

      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "📝 Ajouter une note de séance", onclick: function () { ajouterNote(pid); } }),
        UI.el("button.btn.secondaire", { text: "🎯 Ajouter un objectif", onclick: function () { ajouterObjectif(pid); } }),
        UI.el("button.btn.ghost", { text: "🖨️ Imprimer la synthèse", onclick: function () { window.print(); } })
      ]));

      // --- Objectifs ---
      var objs = Store.objectifs.filtre(function (o) { return o.profilId === pid; });
      vue.appendChild(UI.el("h2", { text: "🎯 Objectifs d'accompagnement", style: "margin:1.2rem 0 .5rem" }));
      if (!objs.length) {
        vue.appendChild(UI.el("p.aide", { text: "Aucun objectif défini. Co-construisez-les avec le jeune." }));
      } else {
        var ulo = UI.el("ul.liste");
        objs.forEach(function (o) {
          ulo.appendChild(UI.el("li.liste-item" + (o.atteint ? ".etape" : ""), { class: o.atteint ? "liste-item faite" : "liste-item" }, [
            UI.el("button.btn.ghost", { text: o.atteint ? "✅" : "⬜", "aria-label": "Basculer l'objectif", onclick: function () { Store.objectifs.majParId(o.id, { atteint: !o.atteint }); Boussole.naviguer("suivi"); } }),
            UI.el("div.grow", {}, [UI.el("strong", { text: o.texte, style: o.atteint ? "text-decoration:line-through;color:var(--gris)" : "" }), UI.el("div.meta", { text: (o.atteint ? "Atteint" : "En cours") + " · créé le " + UI.dateFr(o.cree) })]),
            UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () { Store.objectifs.supprimer(o.id); Boussole.naviguer("suivi"); } })
          ]));
        });
        vue.appendChild(ulo);
      }

      // --- Frise chronologique avec filtres ---
      vue.appendChild(UI.el("h2", { text: "🕓 Frise chronologique", style: "margin:1.4rem 0 .5rem" }));
      var filtreActif = "tout";
      var chips = UI.el(".btn-rangee");
      var zone = UI.el("div");
      function rendreFrise() {
        UI.vider(chips);
        FILTRES.forEach(function (f) {
          chips.appendChild(UI.el("button.btn" + (f.type === filtreActif ? "" : ".ghost"), { style: "padding:.4rem .8rem;font-size:.9rem", text: f.icone + " " + f.label, onclick: function () { filtreActif = f.type; rendreFrise(); } }));
        });
        UI.vider(zone);
        var liste = journal.filter(function (it) { return filtreActif === "tout" || it.type === filtreActif; });
        if (!liste.length) { zone.appendChild(UI.el("p.aide", { text: "Rien à afficher pour ce filtre." })); return; }
        var ul = UI.el("ul.liste");
        liste.slice(0, 100).forEach(function (it) {
          ul.appendChild(UI.el("li.liste-item", {}, [
            UI.el("span", { text: it.icone, style: "font-size:1.5rem" }),
            UI.el("div.grow", {}, [
              UI.el("strong", { text: it.titre }),
              it.detail ? UI.el("div.meta", { text: it.detail }) : null,
              UI.el("div.meta", { text: UI.dateHeureFr(it.date) })
            ]),
            it.outil ? UI.el("a.btn.ghost", { href: "#/" + it.outil, text: "Ouvrir", style: "font-size:.85rem" }) : null
          ]));
        });
        zone.appendChild(ul);
      }
      vue.appendChild(chips);
      vue.appendChild(zone);
      rendreFrise();
    }
  });

  function ajouterNote(pid) {
    var titre = UI.input({ placeholder: "Titre (optionnel) — ex. Séance du jour" });
    var texte = UI.textarea({ placeholder: "Observations, ressenti, points travaillés, à suivre…" });
    UI.modal({
      titre: "Note de séance", contenu: UI.el("div", {}, [UI.champ("Titre", titre), UI.champ("Note", texte)]), texteOk: "Enregistrer",
      onOk: function () {
        if (!texte.value.trim()) { UI.toast("Écrivez la note"); return false; }
        Store.notes.ajouter({ profilId: pid, titre: titre.value.trim(), texte: texte.value.trim() });
        UI.toast("Note enregistrée"); Boussole.naviguer("suivi"); return true;
      }
    });
  }

  function ajouterObjectif(pid) {
    var texte = UI.input({ placeholder: "ex. Identifier 3 déclencheurs de colère" });
    UI.modal({
      titre: "Nouvel objectif", contenu: UI.champ("Objectif", texte), texteOk: "Ajouter",
      onOk: function () {
        if (!texte.value.trim()) { UI.toast("Décrivez l'objectif"); return false; }
        Store.objectifs.ajouter({ profilId: pid, texte: texte.value.trim(), atteint: false });
        UI.toast("Objectif ajouté"); Boussole.naviguer("suivi"); return true;
      }
    });
  }
})();
