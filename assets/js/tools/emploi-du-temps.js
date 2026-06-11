/* Emploi du temps visuel — planning journalier à pictogrammes */
(function () {
  "use strict";

  var JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  var PICTOS = ["🌅","🍽️","🏫","📚","✏️","🎨","⚽","🎵","🧩","🛁","😴","📺","🎮","🐕","🛒","👨‍👩‍👧","💊","🧘","🚌","🍎","🦷","🩺","🎂","🎉"];

  function clefProfil(ctx) { return ctx.profil ? ctx.profil.id : "_general"; }

  function chargerEDT(ctx) {
    var id = clefProfil(ctx);
    var e = Store.emploisDuTemps.filtre(function (x) { return x.profilId === id; })[0];
    if (!e) e = Store.emploisDuTemps.ajouter({ profilId: id, blocs: {} });
    return e;
  }

  function editerBloc(jour, bloc, onValide, onSuppr) {
    var heure = UI.input({ type: "text", value: bloc ? bloc.heure : "", placeholder: "ex. 08:00" });
    var titre = UI.input({ value: bloc ? bloc.titre : "", placeholder: "ex. École" });
    var pic = bloc ? bloc.picto : PICTOS[0];
    var grille = UI.el(".emo-grille", { style: "grid-template-columns:repeat(auto-fill,minmax(46px,1fr));gap:.3rem" });
    PICTOS.forEach(function (p) {
      var b = UI.el("button.emo-btn", { style: "padding:.35rem", text: p, onclick: function () { pic = p; grille.querySelectorAll(".emo-btn").forEach(function (x) { x.classList.remove("choisi"); }); b.classList.add("choisi"); } });
      if (p === pic) b.classList.add("choisi");
      grille.appendChild(b);
    });
    var contenu = UI.el("div", {}, [
      UI.champ("Heure", heure),
      UI.champ("Activité", titre),
      UI.el("label", { text: "Pictogramme", style: "font-weight:600;display:block;margin-bottom:.3rem" }), grille
    ]);
    if (bloc && onSuppr) {
      contenu.appendChild(UI.el(".btn-rangee", { style: "margin-bottom:0" }, [
        UI.el("button.btn.ghost.danger", { text: "🗑️ Supprimer ce créneau", onclick: function () { onSuppr(); document.querySelector(".modal-overlay") && document.getElementById("modal-root").firstChild.remove(); } })
      ]));
    }
    UI.modal({
      titre: (bloc ? "Modifier" : "Ajouter") + " — " + jour, contenu: contenu, texteOk: "Enregistrer",
      onOk: function () { if (!titre.value.trim()) { UI.toast("Indiquez l'activité"); return false; } onValide({ heure: heure.value.trim(), titre: titre.value.trim(), picto: pic }); return true; }
    });
  }

  Boussole.registerTool({
    id: "edt", groupe: "tnd", titre: "Emploi du temps visuel", icone: "📅",
    desc: "Planning hebdomadaire illustré et prévisible. Sécurise et structure la journée (TSA/TDAH).",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Emploi du temps visuel", ctx.profil ? "Planning de " + ctx.profil.prenom + ". Imprimable pour l'afficher à la maison." : "Planning général. Sélectionnez un jeune en haut pour un planning personnalisé."));

      var edt = chargerEDT(ctx);
      var jourActif = JOURS[Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, 6)];

      var onglets = UI.el(".btn-rangee");
      JOURS.forEach(function (j) {
        onglets.appendChild(UI.el("button.btn" + (j === jourActif ? "" : ".secondaire"), { text: j.slice(0, 3), onclick: function () { jourActif = j; rendre(); } }));
      });

      var zone = UI.el("div");
      function rendre() {
        UI.vider(onglets);
        JOURS.forEach(function (j) { onglets.appendChild(UI.el("button.btn" + (j === jourActif ? "" : ".secondaire"), { text: j.slice(0, 3), onclick: function () { jourActif = j; rendre(); } })); });
        UI.vider(zone);
        zone.appendChild(UI.el("h2", { text: jourActif, style: "margin:.5rem 0" }));
        var blocs = (edt.blocs[jourActif] || []).slice().sort(function (a, b) { return (a.heure || "").localeCompare(b.heure || ""); });
        var cont = UI.el(".edt-jour");
        if (!blocs.length) cont.appendChild(UI.el("p.aide", { text: "Aucune activité. Ajoutez-en une ci-dessous." }));
        blocs.forEach(function (b) {
          cont.appendChild(UI.el(".edt-bloc", { onclick: function () {
            editerBloc(jourActif, b, function (data) { Object.assign(b, data); Store.emploisDuTemps.majParId(edt.id, { blocs: edt.blocs }); rendre(); },
              function () { edt.blocs[jourActif] = edt.blocs[jourActif].filter(function (x) { return x !== b; }); Store.emploisDuTemps.majParId(edt.id, { blocs: edt.blocs }); rendre(); });
          }}, [
            UI.el("span.heure", { text: b.heure || "—" }),
            UI.el("span.pic", { text: b.picto }),
            UI.el("span.grow", { text: b.titre })
          ]));
        });
        zone.appendChild(cont);
        zone.appendChild(UI.el(".btn-rangee", {}, [
          UI.el("button.btn.secondaire", { text: "➕ Ajouter une activité", onclick: function () {
            editerBloc(jourActif, null, function (data) { if (!edt.blocs[jourActif]) edt.blocs[jourActif] = []; edt.blocs[jourActif].push(data); Store.emploisDuTemps.majParId(edt.id, { blocs: edt.blocs }); rendre(); });
          }}),
          UI.el("button.btn.ghost", { text: "🖨️ Imprimer la semaine", onclick: function () { window.print(); } })
        ]));
      }

      vue.appendChild(onglets);
      vue.appendChild(zone);
      rendre();
    }
  });
})();
