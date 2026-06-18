/* Profil neuro-cognitif : évaluation par domaines + graphique radar + synthèse.
   Outil de soutien à l'observation clinique — ne pose pas de diagnostic. */
(function () {
  "use strict";

  var DOMAINES = [
    { cle: "attention", nom: "Attention / Concentration", court: "Attention" },
    { cle: "memoire", nom: "Mémoire", court: "Mémoire" },
    { cle: "executif", nom: "Fonctions exécutives (organisation, planification)", court: "Fct. exécutives" },
    { cle: "langage_oral", nom: "Langage oral", court: "Langage oral" },
    { cle: "langage_ecrit", nom: "Langage écrit (lecture, orthographe)", court: "Langage écrit" },
    { cle: "logique", nom: "Logique / Raisonnement", court: "Logique" },
    { cle: "motricite", nom: "Motricité / Graphisme", court: "Motricité" },
    { cle: "social", nom: "Habiletés sociales / Émotions", court: "Social / Émo." }
  ];
  var MAX = 5; // 0 = grand besoin de soutien, 5 = point fort

  function clef(ctx) { return ctx.profil ? ctx.profil.id : "_general"; }

  function charger(pid) {
    var p = Store.profilsNeuro.filtre(function (x) { return x.profilId === pid; })[0];
    if (!p) p = Store.profilsNeuro.ajouter({ profilId: pid, scores: {}, notes: {}, observations: "" });
    return p;
  }

  function radar(scores) {
    var ns = "http://www.w3.org/2000/svg";
    var W = 460, H = 420, cx = W / 2, cy = H / 2 + 6, R = 150;
    var n = DOMAINES.length;
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("width", "100%"); svg.style.maxWidth = "480px";
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Graphique radar du profil neuro-cognitif");

    function pt(i, r) {
      var a = (Math.PI * 2 * i / n) - Math.PI / 2;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }
    // Toiles concentriques
    for (var g = 1; g <= MAX; g++) {
      var d = "";
      for (var i = 0; i < n; i++) { var p = pt(i, R * g / MAX); d += (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1) + " "; }
      d += "Z";
      var poly = document.createElementNS(ns, "path");
      poly.setAttribute("d", d); poly.setAttribute("fill", "none"); poly.setAttribute("stroke", "#e0e0e0"); poly.setAttribute("stroke-width", "1");
      svg.appendChild(poly);
    }
    // Axes + libellés
    DOMAINES.forEach(function (dom, i) {
      var p = pt(i, R), pl = pt(i, R + 26);
      var line = document.createElementNS(ns, "line");
      line.setAttribute("x1", cx); line.setAttribute("y1", cy); line.setAttribute("x2", p[0]); line.setAttribute("y2", p[1]);
      line.setAttribute("stroke", "#e0e0e0"); svg.appendChild(line);
      var t = document.createElementNS(ns, "text");
      t.setAttribute("x", pl[0]); t.setAttribute("y", pl[1]); t.setAttribute("font-size", "11"); t.setAttribute("font-weight", "600");
      t.setAttribute("text-anchor", pl[0] < cx - 10 ? "end" : (pl[0] > cx + 10 ? "start" : "middle"));
      t.setAttribute("fill", "#2d3436"); t.textContent = dom.court; svg.appendChild(t);
    });
    // Tracé des scores
    var dd = "";
    DOMAINES.forEach(function (dom, i) {
      var v = scores[dom.cle] != null ? scores[dom.cle] : 0;
      var p = pt(i, R * v / MAX);
      dd += (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1) + " ";
    });
    dd += "Z";
    var aire = document.createElementNS(ns, "path");
    aire.setAttribute("d", dd); aire.setAttribute("fill", "rgba(42,157,143,.28)"); aire.setAttribute("stroke", "#2a9d8f"); aire.setAttribute("stroke-width", "2.5");
    svg.appendChild(aire);
    DOMAINES.forEach(function (dom, i) {
      var v = scores[dom.cle] != null ? scores[dom.cle] : 0;
      var p = pt(i, R * v / MAX);
      var c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", p[0]); c.setAttribute("cy", p[1]); c.setAttribute("r", 4); c.setAttribute("fill", "#21806f");
      svg.appendChild(c);
    });
    return UI.el(".chart-wrap", { style: "display:flex;justify-content:center" }, [svg]);
  }

  Boussole.registerTool({
    id: "profil-neuro", groupe: "tnd", titre: "Profil neuro-cognitif", icone: "🧠",
    desc: "Cartographier forces et besoins par domaine (attention, mémoire, fonctions exécutives…) avec un graphique radar.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Profil neuro-cognitif", (ctx.profil ? "Profil de " + ctx.profil.prenom + ". " : "Sélectionnez un jeune en haut pour un profil nominatif. ") + "Évaluez chaque domaine de 0 (grand besoin de soutien) à 5 (point fort)."));
      vue.appendChild(UI.el(".alerte", {}, [UI.el("strong", { text: "Repère d'observation : " }), document.createTextNode("cet outil aide à visualiser un profil et à dialoguer. Il ne remplace pas un bilan ni un diagnostic.")]));

      var pid = clef(ctx);
      var data = charger(pid);

      var zoneRadar = UI.el("div");
      function majRadar() { UI.vider(zoneRadar); zoneRadar.appendChild(radar(data.scores)); }
      majRadar();
      vue.appendChild(zoneRadar);

      // Curseurs par domaine
      DOMAINES.forEach(function (dom) {
        var val = data.scores[dom.cle] != null ? data.scores[dom.cle] : 0;
        var valeurTxt = UI.el("span.pilule", { text: val + "/" + MAX });
        var echelle = UI.el(".echelle");
        for (var i = 0; i <= MAX; i++) {
          (function (k) {
            var b = UI.el("button", { text: k });
            if (k === val) b.classList.add("choisi");
            b.addEventListener("click", function () {
              data.scores[dom.cle] = k;
              Store.profilsNeuro.majParId(data.id, { scores: data.scores });
              echelle.querySelectorAll("button").forEach(function (x) { x.classList.remove("choisi"); });
              b.classList.add("choisi"); valeurTxt.textContent = k + "/" + MAX;
              majRadar();
            });
            echelle.appendChild(b);
          })(i);
        }
        var note = UI.input({ value: data.notes[dom.cle] || "", placeholder: "Observation (optionnel)…" });
        note.addEventListener("change", function () { data.notes[dom.cle] = note.value.trim(); Store.profilsNeuro.majParId(data.id, { notes: data.notes }); });
        vue.appendChild(UI.el(".carte", { style: "margin-bottom:.8rem" }, [
          UI.el("div", { style: "display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem" }, [
            UI.el("strong", { text: dom.nom }), valeurTxt
          ]),
          echelle,
          UI.el("div", { style: "margin-top:.6rem" }, [note])
        ]));
      });

      var obs = UI.textarea({ value: data.observations || "", placeholder: "Forces à valoriser, aménagements proposés, pistes d'accompagnement…" });
      obs.addEventListener("change", function () { Store.profilsNeuro.majParId(data.id, { observations: obs.value.trim() }); });
      vue.appendChild(UI.champ("Synthèse & pistes d'accompagnement", obs));

      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "🖨️ Imprimer le profil", onclick: function () { window.print(); } })
      ]));
    }
  });
})();
