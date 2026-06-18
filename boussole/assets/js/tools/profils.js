/* Fiches des jeunes accompagnés (suivi praticienne) */
(function () {
  "use strict";

  function formulaire(profil, onValide) {
    var prenom = UI.input({ value: profil ? profil.prenom : "", placeholder: "Prénom ou initiales", required: true });
    var age = UI.input({ type: "number", min: 3, max: 25, value: profil ? profil.age || "" : "", placeholder: "ex. 14" });
    var tags = UI.input({ value: profil ? (profil.tags || []).join(", ") : "", placeholder: "TDAH, dyslexie, anxiété…" });
    var notes = UI.textarea({ value: profil ? profil.notes || "" : "", placeholder: "Contexte, objectifs d'accompagnement, points d'attention…" });

    var contenu = UI.el("div", {}, [
      UI.champ("Prénom / initiales *", prenom, "Vous pouvez n'utiliser que des initiales pour préserver l'anonymat."),
      UI.champ("Âge", age),
      UI.champ("Profil (mots-clés)", tags, "Séparez par des virgules."),
      UI.champ("Notes de suivi", notes)
    ]);

    UI.modal({
      titre: profil ? "Modifier la fiche" : "Nouvelle fiche jeune",
      contenu: contenu,
      texteOk: "Enregistrer",
      onOk: function () {
        if (!prenom.value.trim()) { UI.toast("Le prénom est obligatoire"); return false; }
        var data = {
          prenom: prenom.value.trim(),
          age: age.value ? parseInt(age.value, 10) : null,
          tags: tags.value.split(",").map(function (t) { return t.trim(); }).filter(Boolean),
          notes: notes.value.trim()
        };
        onValide(data);
        return true;
      }
    });
  }

  Boussole.registerTool({
    id: "profils", groupe: "pro", titre: "Fiches des jeunes", icone: "👤",
    desc: "Créez et suivez des fiches anonymisées : profil, objectifs, notes de séance.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Fiches des jeunes", "Reliez chaque outil à un jeune pour centraliser émotions, jetons et suivis. Données privées, sur cet appareil."));

      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "➕ Nouvelle fiche", onclick: function () {
          formulaire(null, function (data) {
            var p = Store.profils.ajouter(data);
            Boussole.setProfilActif(p.id);
            UI.toast("Fiche créée");
            Boussole.naviguer("profils");
          });
        }})
      ]));

      var profils = Store.profils.tout();
      if (!profils.length) {
        vue.appendChild(UI.vide("📋", "Aucune fiche pour l'instant", "Créez une première fiche pour commencer le suivi."));
        return;
      }

      var liste = UI.el("ul.liste");
      profils.forEach(function (p) {
        var nbEmo = Store.emotions.filtre(function (e) { return e.profilId === p.id; }).length;
        var nbHum = Store.humeurs.filtre(function (h) { return h.profilId === p.id; }).length;
        var item = UI.el("li.liste-item", {}, [
          UI.el("span", { style: "font-size:1.6rem", text: "🧑" }),
          UI.el("div.grow", {}, [
            UI.el("strong", { text: p.prenom + (p.age ? " · " + p.age + " ans" : "") }),
            UI.el("div.meta", { text: (p.tags && p.tags.length ? p.tags.join(" · ") + " — " : "") + nbEmo + " émotions, " + nbHum + " humeurs notées" }),
            p.notes ? UI.el("div.meta", { text: p.notes }) : null
          ]),
          UI.el("button.btn.secondaire", { text: "Sélectionner", onclick: function () {
            Boussole.setProfilActif(p.id); UI.toast(p.prenom + " sélectionné·e"); Boussole.naviguer("accueil");
          }}),
          UI.el("button.btn.ghost", { text: "✏️", "aria-label": "Modifier", onclick: function () {
            formulaire(p, function (data) { Store.profils.majParId(p.id, data); Boussole.rafraichirSelectProfil(); UI.toast("Fiche mise à jour"); Boussole.naviguer("profils"); });
          }}),
          UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () {
            UI.confirmer("Supprimer la fiche de " + p.prenom + " ? Les données liées resteront mais ne seront plus rattachées.", { danger: true, texteOk: "Supprimer" }).then(function (ok) {
              if (ok) { Store.profils.supprimer(p.id); if (Boussole.profilActif() && Boussole.profilActif().id === p.id) Boussole.setProfilActif(null); Boussole.rafraichirSelectProfil(); Boussole.naviguer("profils"); }
            });
          }})
        ]);
        liste.appendChild(item);
      });
      vue.appendChild(liste);
    }
  });
})();
