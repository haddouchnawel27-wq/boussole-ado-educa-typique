/* Carnet de pensées — restructuration cognitive (colonnes de Beck) */
(function () {
  "use strict";

  var DISTORSIONS = [
    "Tout ou rien (noir/blanc)", "Généralisation (« toujours », « jamais »)",
    "Filtre négatif", "Disqualification du positif", "Conclusions hâtives / lecture de pensée",
    "Catastrophisme", "Raisonnement émotionnel", "Devrais / il faut",
    "Étiquetage", "Personnalisation / culpabilité"
  ];

  Boussole.registerTool({
    id: "pensees", groupe: "tcc", titre: "Carnet de pensées", icone: "💭",
    desc: "Restructuration cognitive façon TCC : situation → pensée → émotion → pensée alternative.",
    render: function (vue, ctx) {
      if (ctx.arg === "nouveau" || ctx.arg === "") {
        // par défaut on montre la liste ; le formulaire s'ouvre via bouton
      }
      vue.appendChild(UI.enTete("Carnet de pensées", "Un outil TCC pour prendre du recul : repérer la pensée automatique, l'émotion, puis chercher une pensée plus juste et aidante."));

      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "➕ Nouvelle analyse", onclick: function () { ouvrirFormulaire(ctx); } })
      ]));

      var liste = Store.pensees.filtre(function (p) { return !ctx.profil || p.profilId === ctx.profil.id; }).slice().reverse();
      if (!liste.length) {
        vue.appendChild(UI.vide("💭", "Aucune analyse pour l'instant", "Lancez une première analyse de pensée."));
        return;
      }
      var ul = UI.el("ul.liste");
      liste.forEach(function (p) {
        ul.appendChild(UI.el("li.liste-item", {}, [
          UI.el("div.grow", {}, [
            UI.el("strong", { text: p.situation || "(sans titre)" }),
            UI.el("div.meta", { text: "Pensée : « " + (p.pensee || "—") + " » · " + (p.emotion || "") + (p.intensiteAvant != null ? " " + p.intensiteAvant + "→" + (p.intensiteApres != null ? p.intensiteApres : "?") + "/10" : "") }),
            p.alternative ? UI.el("div.meta", { html: "💡 <em>" + p.alternative + "</em>" }) : null,
            UI.el("div.meta", { text: UI.dateFr(p.cree) })
          ]),
          UI.el("button.btn.ghost", { text: "✏️", "aria-label": "Modifier", onclick: function () { ouvrirFormulaire(ctx, p); } }),
          UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () {
            UI.confirmer("Supprimer cette analyse ?", { danger: true, texteOk: "Supprimer" }).then(function (ok) { if (ok) { Store.pensees.supprimer(p.id); Boussole.naviguer("pensees"); } });
          }})
        ]));
      });
      vue.appendChild(ul);
    }
  });

  function ouvrirFormulaire(ctx, p) {
    var situation = UI.textarea({ value: p ? p.situation : "", placeholder: "Quand ? Où ? Avec qui ? Que s'est-il passé ?" });
    var pensee = UI.textarea({ value: p ? p.pensee : "", placeholder: "Qu'est-ce qui m'a traversé l'esprit ?" });
    var emotion = UI.input({ value: p ? p.emotion : "", placeholder: "ex. anxiété, colère…" });
    var intAvant = UI.input({ type: "number", min: 0, max: 10, value: p ? p.intensiteAvant : "", placeholder: "0-10" });
    var preuvesPour = UI.textarea({ value: p ? p.preuvesPour : "", placeholder: "Faits qui soutiennent cette pensée" });
    var preuvesContre = UI.textarea({ value: p ? p.preuvesContre : "", placeholder: "Faits qui la nuancent ou la contredisent" });
    var alternative = UI.textarea({ value: p ? p.alternative : "", placeholder: "Une pensée plus juste, plus équilibrée et aidante" });
    var intApres = UI.input({ type: "number", min: 0, max: 10, value: p ? p.intensiteApres : "", placeholder: "0-10" });

    var distSel = (p && p.distorsions) ? p.distorsions.slice() : [];
    var distZone = UI.el(".emo-grille", { style: "grid-template-columns:1fr;gap:.3rem" });
    DISTORSIONS.forEach(function (d) {
      var actif = distSel.indexOf(d) >= 0;
      var b = UI.el("button.emo-btn", { text: d, style: "padding:.5rem;text-align:left;align-items:flex-start" });
      if (actif) b.classList.add("choisi");
      b.addEventListener("click", function () {
        var i = distSel.indexOf(d);
        if (i >= 0) { distSel.splice(i, 1); b.classList.remove("choisi"); } else { distSel.push(d); b.classList.add("choisi"); }
      });
      distZone.appendChild(b);
    });

    var contenu = UI.el("div", {}, [
      UI.champ("1. La situation", situation),
      UI.champ("2. La pensée automatique", pensee),
      UI.el(".btn-rangee", { style: "margin:0" }, [
        UI.el("div", { style: "flex:1" }, [UI.champ("3. Émotion", emotion)]),
        UI.el("div", { style: "width:110px" }, [UI.champ("Intensité avant", intAvant)])
      ]),
      UI.el("label", { text: "4. Distorsions repérées (optionnel)", style: "font-weight:600;display:block;margin:.3rem 0" }), distZone,
      UI.champ("5. Preuves POUR", preuvesPour),
      UI.champ("6. Preuves CONTRE", preuvesContre),
      UI.champ("7. Pensée alternative", alternative),
      UI.champ("8. Intensité de l'émotion APRÈS", intApres)
    ]);

    UI.modal({
      titre: p ? "Modifier l'analyse" : "Analyse de pensée", contenu: contenu, texteOk: "Enregistrer",
      onOk: function () {
        var data = {
          profilId: ctx.profil ? ctx.profil.id : null,
          situation: situation.value.trim(), pensee: pensee.value.trim(), emotion: emotion.value.trim(),
          intensiteAvant: intAvant.value !== "" ? parseInt(intAvant.value, 10) : null,
          intensiteApres: intApres.value !== "" ? parseInt(intApres.value, 10) : null,
          distorsions: distSel, preuvesPour: preuvesPour.value.trim(), preuvesContre: preuvesContre.value.trim(),
          alternative: alternative.value.trim()
        };
        if (p) Store.pensees.majParId(p.id, data); else Store.pensees.ajouter(data);
        UI.toast("Analyse enregistrée"); Boussole.naviguer("pensees"); return true;
      }
    });
  }
})();
