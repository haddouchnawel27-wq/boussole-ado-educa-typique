/* Organisateur de tâches : lister, prioriser et suivre les tâches.
   Soutient les fonctions exécutives (planification, initiation, organisation). */
(function () {
  "use strict";

  var PRIORITES = {
    haute: { nom: "Important", emoji: "🔴", ordre: 0 },
    moyenne: { nom: "Moyen", emoji: "🟠", ordre: 1 },
    basse: { nom: "Plus tard", emoji: "🟢", ordre: 2 }
  };

  function clef(ctx) { return ctx.profil ? ctx.profil.id : "_general"; }

  Boussole.registerTool({
    id: "organisateur", groupe: "tnd", titre: "Organisateur de tâches", icone: "✅",
    desc: "Lister, prioriser et cocher ses tâches : un cerveau externe pour s'organiser sans surcharge.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Organisateur de tâches", (ctx.profil ? "Tâches de " + ctx.profil.prenom + ". " : "") + "On sort tout de sa tête, on classe par priorité, et on avance une tâche à la fois."));

      var pid = clef(ctx);
      function taches() {
        return Store.taches.filtre(function (t) { return t.profilId === pid; })
          .sort(function (a, b) { return (a.fait - b.fait) || (PRIORITES[a.priorite].ordre - PRIORITES[b.priorite].ordre) || (new Date(a.cree) - new Date(b.cree)); });
      }

      // Formulaire d'ajout
      var texte = UI.input({ placeholder: "Nouvelle tâche (ex. Réviser la leçon de maths)" });
      var prio = UI.select(Object.keys(PRIORITES).map(function (k) { return { value: k, label: PRIORITES[k].emoji + " " + PRIORITES[k].nom, selected: k === "moyenne" }; }));
      function ajouter() {
        if (!texte.value.trim()) return;
        Store.taches.ajouter({ profilId: pid, texte: texte.value.trim(), priorite: prio.value, fait: false });
        texte.value = ""; rendre();
      }
      texte.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); ajouter(); } });

      vue.appendChild(UI.el(".carte", {}, [
        UI.champ("Ajouter une tâche", texte),
        UI.el("div", { style: "display:flex;gap:.6rem;align-items:flex-end;flex-wrap:wrap" }, [
          UI.el("div", { style: "flex:1;min-width:140px" }, [UI.champ("Priorité", prio)]),
          UI.el("button.btn", { text: "+ Ajouter", onclick: ajouter, style: "margin-bottom:1rem" })
        ])
      ]));

      var zone = UI.el("div");
      vue.appendChild(zone);

      function rendre() {
        UI.vider(zone);
        var liste = taches();
        var actives = liste.filter(function (t) { return !t.fait; });
        var faites = liste.filter(function (t) { return t.fait; });

        if (!liste.length) { zone.appendChild(UI.vide("✅", "Aucune tâche", "Ajoutez une première tâche ci-dessus.")); return; }

        if (actives.length) {
          var prog = Math.round(faites.length / liste.length * 100);
          zone.appendChild(UI.el("p", {}, [UI.el("span.pilule", { text: "À faire : " + actives.length + " · Terminé : " + faites.length + " (" + prog + "%)" })]));
        }
        var ul = UI.el("ul.liste");
        actives.forEach(function (t) { ul.appendChild(ligne(t)); });
        zone.appendChild(ul);

        if (faites.length) {
          zone.appendChild(UI.el("h2", { text: "✔️ Terminées", style: "margin:1.2rem 0 .5rem" }));
          var ulf = UI.el("ul.liste");
          faites.forEach(function (t) { ulf.appendChild(ligne(t)); });
          zone.appendChild(ulf);
        }
      }

      function ligne(t) {
        var item = UI.el("li.liste-item", { style: t.fait ? "opacity:.6" : "" }, [
          UI.el("button.btn.ghost", { text: t.fait ? "✅" : "⬜", "aria-label": "Cocher", onclick: function () { Store.taches.majParId(t.id, { fait: !t.fait }); rendre(); } }),
          UI.el("span", { text: PRIORITES[t.priorite].emoji, title: PRIORITES[t.priorite].nom }),
          UI.el("span.grow", { text: t.texte, style: t.fait ? "text-decoration:line-through" : "" }),
          UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () { Store.taches.supprimer(t.id); rendre(); } })
        ]);
        return item;
      }

      rendre();
    }
  });
})();
