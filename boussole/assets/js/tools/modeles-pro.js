/* Modèles professionnels : anamnèse, plan d'accompagnement individualisé (PAI)
   et compte-rendu de séance. Remplissables, enregistrés par jeune, imprimables. */
(function () {
  "use strict";

  var MODELES = {
    anamnese: {
      titre: "Fiche d'anamnèse", icone: "📝",
      champs: [
        { c: "motif", l: "Motif de la consultation", t: "ta" },
        { c: "dev", l: "Histoire développementale (grossesse, langage, motricité, étapes)", t: "ta" },
        { c: "scol", l: "Scolarité (parcours, difficultés, aménagements en place)", t: "ta" },
        { c: "sante", l: "Santé (antécédents, sommeil, alimentation, sensorialité)", t: "ta" },
        { c: "famille", l: "Contexte familial", t: "ta" },
        { c: "comp", l: "Comportement & émotions", t: "ta" },
        { c: "forces", l: "Points forts & centres d'intérêt", t: "ta" },
        { c: "attentes", l: "Attentes de la famille", t: "ta" }
      ]
    },
    pai: {
      titre: "Plan d'accompagnement individualisé (PAI)", icone: "🎯",
      champs: [
        { c: "objectifs", l: "Objectifs prioritaires (1 à 3)", t: "ta" },
        { c: "appuis", l: "Forces sur lesquelles s'appuyer", t: "ta" },
        { c: "amenagements", l: "Aménagements proposés (maison / école)", t: "ta" },
        { c: "outils", l: "Outils & stratégies utilisés", t: "ta" },
        { c: "rythme", l: "Fréquence & durée de l'accompagnement", t: "in" },
        { c: "indicateurs", l: "Indicateurs de progrès", t: "ta" },
        { c: "revision", l: "Date de révision prévue", t: "in" }
      ]
    },
    compterendu: {
      titre: "Compte-rendu de séance", icone: "🗒️",
      champs: [
        { c: "date", l: "Date / n° de séance", t: "in" },
        { c: "objectif", l: "Objectif de la séance", t: "ta" },
        { c: "deroule", l: "Déroulé & activités", t: "ta" },
        { c: "observations", l: "Observations", t: "ta" },
        { c: "reussites", l: "Réussites à valoriser", t: "ta" },
        { c: "retravailler", l: "À retravailler", t: "ta" },
        { c: "maison", l: "À faire à la maison", t: "ta" },
        { c: "prochaine", l: "Note pour la prochaine séance", t: "ta" }
      ]
    }
  };

  function cle(type, pid) { return "modelePro." + type + "." + (pid || "_general"); }

  Boussole.registerTool({
    id: "modeles-pro", groupe: "pro", titre: "Modèles pro (anamnèse, PAI…)", icone: "📋",
    desc: "Fiche d'anamnèse, plan d'accompagnement individualisé et compte-rendu, remplissables et imprimables.",
    render: function (vue, ctx) {
      var pid = ctx.profil ? ctx.profil.id : null;
      vue.appendChild(UI.enTete("Modèles professionnels", (ctx.profil ? "Dossier de " + ctx.profil.prenom + ". " : "Sélectionnez un jeune en haut pour relier ces documents à son dossier. ") + "Tout s'enregistre automatiquement sur cet appareil."));

      var typeActif = "anamnese";
      var onglets = UI.el(".btn-rangee");
      var zone = UI.el("div");

      function rendre() {
        UI.vider(onglets);
        Object.keys(MODELES).forEach(function (k) {
          onglets.appendChild(UI.el("button.btn" + (k === typeActif ? "" : ".secondaire"), {
            text: MODELES[k].icone + " " + MODELES[k].titre.split(" (")[0],
            onclick: function () { typeActif = k; rendre(); }
          }));
        });

        var m = MODELES[typeActif];
        var data = Store.lire(cle(typeActif, pid), {});
        UI.vider(zone);

        var entete = UI.el(".carte", { style: "background:var(--vert-clair)" }, [
          UI.el("h2", { text: m.icone + " " + m.titre, style: "margin:.2em 0" }),
          UI.el("p.aide", { text: ctx.profil ? "Jeune : " + ctx.profil.prenom + (ctx.profil.age ? " · " + ctx.profil.age + " ans" : "") : "Document général (aucun jeune sélectionné)" })
        ]);
        zone.appendChild(entete);

        m.champs.forEach(function (ch) {
          var ctrl = ch.t === "ta" ? UI.textarea({ value: data[ch.c] || "" }) : UI.input({ value: data[ch.c] || "" });
          ctrl.addEventListener("change", function () {
            data[ch.c] = ctrl.value; Store.ecrire(cle(typeActif, pid), data); UI.toast("Enregistré");
          });
          zone.appendChild(UI.champ(ch.l, ctrl));
        });

        zone.appendChild(UI.el(".btn-rangee", {}, [
          UI.el("button.btn", { text: "🖨️ Imprimer ce document", onclick: function () { window.print(); } }),
          UI.el("button.btn.ghost", { text: "🗑️ Vider ce document", onclick: function () {
            UI.confirmer("Effacer le contenu de « " + m.titre + " » ?", { danger: true, texteOk: "Vider" }).then(function (ok) {
              if (ok) { Store.supprimer(cle(typeActif, pid)); rendre(); UI.toast("Document vidé"); }
            });
          }})
        ]));
      }

      vue.appendChild(onglets);
      vue.appendChild(zone);
      rendre();
    }
  });
})();
