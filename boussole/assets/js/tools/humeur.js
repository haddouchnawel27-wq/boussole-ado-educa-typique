/* Suivi d'humeur — journal quotidien + graphique d'évolution */
(function () {
  "use strict";

  var NIVEAUX = [
    { v: 1, emoji: "😞", label: "Très bas" },
    { v: 2, emoji: "🙁", label: "Bas" },
    { v: 3, emoji: "😐", label: "Moyen" },
    { v: 4, emoji: "🙂", label: "Bien" },
    { v: 5, emoji: "😄", label: "Très bien" }
  ];

  function dessinerCourbe(humeurs) {
    var data = humeurs.slice().sort(function (a, b) { return new Date(a.cree) - new Date(b.cree); }).slice(-30);
    var W = Math.max(320, data.length * 38), H = 220, P = 30;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("width", "100%"); svg.style.minWidth = W + "px"; svg.style.maxWidth = "100%";
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Courbe d'humeur sur les " + data.length + " dernières mesures");

    var ns = "http://www.w3.org/2000/svg";
    // grille horizontale
    for (var n = 1; n <= 5; n++) {
      var y = H - P - (n - 1) / 4 * (H - 2 * P);
      var l = document.createElementNS(ns, "line");
      l.setAttribute("x1", P); l.setAttribute("x2", W - 8); l.setAttribute("y1", y); l.setAttribute("y2", y);
      l.setAttribute("stroke", "#eee");
      svg.appendChild(l);
      var t = document.createElementNS(ns, "text");
      t.setAttribute("x", 4); t.setAttribute("y", y + 4); t.setAttribute("font-size", "12"); t.textContent = NIVEAUX[n - 1].emoji;
      svg.appendChild(t);
    }
    function px(i) { return P + (data.length === 1 ? (W - 2 * P) / 2 : i / (data.length - 1) * (W - P - 16 - P) + 8); }
    function py(v) { return H - P - (v - 1) / 4 * (H - 2 * P); }

    if (data.length > 1) {
      var d = "";
      data.forEach(function (h, i) { d += (i === 0 ? "M" : "L") + px(i) + "," + py(h.niveau) + " "; });
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", d); path.setAttribute("fill", "none"); path.setAttribute("stroke", "#2a9d8f"); path.setAttribute("stroke-width", "3");
      svg.appendChild(path);
    }
    data.forEach(function (h, i) {
      var c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", px(i)); c.setAttribute("cy", py(h.niveau)); c.setAttribute("r", 6);
      c.setAttribute("fill", "#2a9d8f");
      var titre = document.createElementNS(ns, "title");
      titre.textContent = UI.dateFr(h.cree) + " — " + NIVEAUX[h.niveau - 1].label;
      c.appendChild(titre);
      svg.appendChild(c);
    });
    return UI.el(".chart-wrap", {}, [svg]);
  }

  Boussole.registerTool({
    id: "humeur", groupe: "tcc", titre: "Suivi d'humeur", icone: "📈",
    desc: "Journal d'humeur quotidien avec courbe d'évolution à relire en séance.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Suivi d'humeur", ctx.profil ? "Suivi de " + ctx.profil.prenom + "." : "Note l'humeur du jour. Sélectionne un jeune en haut pour un suivi nominatif."));

      var niveauChoisi = null;
      var grille = UI.el(".emo-grille");
      NIVEAUX.forEach(function (nv) {
        var b = UI.el("button.emo-btn", {}, [UI.el("span.visage", { text: nv.emoji }), UI.el("span", { text: nv.label })]);
        b.addEventListener("click", function () { niveauChoisi = nv.v; grille.querySelectorAll(".emo-btn").forEach(function (x) { x.classList.remove("choisi"); }); b.classList.add("choisi"); });
        grille.appendChild(b);
      });
      vue.appendChild(UI.el("h2", { text: "Comment je me sens aujourd'hui ?", style: "margin:.5rem 0" }));
      vue.appendChild(grille);
      var note = UI.input({ placeholder: "Un mot sur la journée ? (optionnel)" });
      vue.appendChild(UI.champ("", note));
      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn.grand", { text: "💾 Enregistrer", onclick: function () {
          if (!niveauChoisi) { UI.toast("Choisis une humeur"); return; }
          Store.humeurs.ajouter({ profilId: ctx.profil ? ctx.profil.id : null, niveau: niveauChoisi, note: note.value.trim() });
          UI.toast("Humeur enregistrée 💛");
          var niv = niveauChoisi;
          if (!Boussole.suggererApresHumeur(niv)) Boussole.naviguer("humeur");
        }})
      ]));

      var humeurs = Store.humeurs.filtre(function (h) { return !ctx.profil || h.profilId === ctx.profil.id; });
      if (humeurs.length) {
        vue.appendChild(UI.el("h2", { text: "Évolution", style: "margin:1.6rem 0 .5rem" }));
        vue.appendChild(dessinerCourbe(humeurs));

        var moy = (humeurs.reduce(function (s, h) { return s + h.niveau; }, 0) / humeurs.length).toFixed(1);
        vue.appendChild(UI.el("p", { style: "margin-top:.6rem" }, [
          UI.el("span.pilule", { text: humeurs.length + " mesures · moyenne " + moy + "/5" })
        ]));

        var ul = UI.el("ul.liste", { style: "margin-top:1rem" });
        humeurs.slice().reverse().slice(0, 10).forEach(function (h) {
          ul.appendChild(UI.el("li.liste-item", {}, [
            UI.el("span", { text: NIVEAUX[h.niveau - 1].emoji, style: "font-size:1.6rem" }),
            UI.el("div.grow", {}, [UI.el("strong", { text: NIVEAUX[h.niveau - 1].label }), UI.el("div.meta", { text: (h.note ? h.note + " — " : "") + UI.dateHeureFr(h.cree) })]),
            UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () { Store.humeurs.supprimer(h.id); Boussole.naviguer("humeur"); } })
          ]));
        });
        vue.appendChild(ul);
      }
    }
  });
})();
