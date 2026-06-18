/* Journal ABC — analyse fonctionnelle du comportement (coaching parental) */
(function () {
  "use strict";

  Boussole.registerTool({
    id: "abc", groupe: "pro", titre: "Journal ABC (comportement)", icone: "🔍",
    desc: "Grille Antécédent → Comportement → Conséquence pour comprendre et accompagner un comportement.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Journal ABC", "Observer pour comprendre : qu'est-ce qui précède le comportement (A), le comportement (B), ce qui suit (C). Un outil clé pour les parents et l'accompagnement TND."));

      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "➕ Nouvelle observation", onclick: function () { ouvrir(ctx); } })
      ]));

      var liste = Store.abc.filtre(function (o) { return !ctx.profil || o.profilId === ctx.profil.id; }).slice().reverse();
      if (!liste.length) { vue.appendChild(UI.vide("🔍", "Aucune observation", "Notez une première situation pour repérer les déclencheurs et les fonctions du comportement.")); return; }

      var ul = UI.el("ul.liste");
      liste.forEach(function (o) {
        ul.appendChild(UI.el("li.liste-item", {}, [
          UI.el("div.grow", {}, [
            UI.el("strong", { text: o.comportement }),
            UI.el("div.meta", { html: "<strong>A :</strong> " + (o.antecedent || "—") + " · <strong>C :</strong> " + (o.consequence || "—") }),
            o.fonction ? UI.el("div.meta", { html: "🎯 Fonction probable : " + o.fonction }) : null,
            UI.el("div.meta", { text: UI.dateHeureFr(o.cree) })
          ]),
          UI.el("button.btn.ghost", { text: "✏️", "aria-label": "Modifier", onclick: function () { ouvrir(ctx, o); } }),
          UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () { UI.confirmer("Supprimer cette observation ?", { danger: true, texteOk: "Supprimer" }).then(function (ok) { if (ok) { Store.abc.supprimer(o.id); Boussole.naviguer("abc"); } }); } })
        ]));
      });
      vue.appendChild(ul);
    }
  });

  function ouvrir(ctx, o) {
    var antecedent = UI.textarea({ value: o ? o.antecedent : "", placeholder: "Que s'est-il passé juste avant ? Où ? Avec qui ? Quelle demande ?" });
    var comportement = UI.textarea({ value: o ? o.comportement : "", placeholder: "Décrire le comportement observable, sans interprétation." });
    var consequence = UI.textarea({ value: o ? o.consequence : "", placeholder: "Que s'est-il passé juste après ? Réactions de l'entourage ?" });
    var fonction = UI.select([
      { value: "", label: "— À déterminer —" },
      { value: "Obtenir de l'attention", label: "Obtenir de l'attention" },
      { value: "Échapper à une tâche/situation", label: "Échapper à une tâche/situation" },
      { value: "Obtenir un objet/une activité", label: "Obtenir un objet/une activité" },
      { value: "Stimulation sensorielle / auto-régulation", label: "Stimulation sensorielle / auto-régulation" }
    ], {});
    if (o && o.fonction) fonction.value = o.fonction;
    var idee = UI.textarea({ value: o ? o.idee : "", placeholder: "Aménagement, comportement alternatif à enseigner, réponse de l'adulte…" });

    UI.modal({
      titre: o ? "Modifier l'observation" : "Nouvelle observation ABC",
      contenu: UI.el("div", {}, [
        UI.champ("A — Antécédent (avant)", antecedent),
        UI.champ("B — Comportement", comportement),
        UI.champ("C — Conséquence (après)", consequence),
        UI.champ("Fonction probable", fonction, "À quoi « sert » le comportement pour le jeune ?"),
        UI.champ("Piste d'accompagnement", idee)
      ]),
      texteOk: "Enregistrer",
      onOk: function () {
        if (!comportement.value.trim()) { UI.toast("Décrivez le comportement"); return false; }
        var data = { profilId: ctx.profil ? ctx.profil.id : null, antecedent: antecedent.value.trim(), comportement: comportement.value.trim(), consequence: consequence.value.trim(), fonction: fonction.value, idee: idee.value.trim() };
        if (o) Store.abc.majParId(o.id, data); else Store.abc.ajouter(data);
        UI.toast("Observation enregistrée"); Boussole.naviguer("abc"); return true;
      }
    });
  }
})();
