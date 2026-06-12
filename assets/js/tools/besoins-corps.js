/* Cartes des besoins (CNV) + carte des sensations corporelles.
   Illustration « mascotte cerveau », sans aucune représentation humaine. */
(function () {
  "use strict";

  var BESOINS = [
    { e: "😴", t: "Me reposer" }, { e: "🤝", t: "De l'aide" }, { e: "🫂", t: "Du réconfort" },
    { e: "🛡️", t: "Me sentir en sécurité" }, { e: "🎮", t: "Jouer / m'amuser" }, { e: "🤫", t: "Du calme" },
    { e: "👂", t: "Être écouté·e" }, { e: "🏃", t: "Bouger" }, { e: "🍎", t: "Manger / boire" },
    { e: "💡", t: "Comprendre" }, { e: "⏳", t: "Du temps" }, { e: "🧩", t: "Faire seul·e" },
    { e: "❤️", t: "Me sentir aimé·e" }, { e: "👏", t: "Être encouragé·e" }, { e: "🌳", t: "Être tranquille" },
    { e: "🗣️", t: "M'exprimer" }
  ];

  // Zones corporelles (sur une mascotte cerveau, pas un humain)
  var ZONES = [
    { id: "tete", t: "Dans ma tête", x: 130, y: 70 },
    { id: "gorge", t: "Dans ma gorge", x: 130, y: 138 },
    { id: "poitrine", t: "Dans ma poitrine", x: 130, y: 175 },
    { id: "ventre", t: "Dans mon ventre", x: 130, y: 215 },
    { id: "mains", t: "Dans mes mains", x: 60, y: 195 },
    { id: "jambes", t: "Dans mes jambes", x: 130, y: 270 }
  ];

  function mascotteSVG(selection, onToggle) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 260 320");
    svg.style.maxWidth = "280px"; svg.style.width = "100%";
    svg.setAttribute("role", "group"); svg.setAttribute("aria-label", "Carte des sensations (mascotte cerveau)");
    svg.innerHTML =
      // corps
      '<rect x="95" y="150" width="70" height="80" rx="34" fill="#BDEAD7"/>' +
      // bras
      '<rect x="55" y="160" width="42" height="20" rx="10" fill="#8ED9D2"/>' +
      '<rect x="163" y="160" width="42" height="20" rx="10" fill="#8ED9D2"/>' +
      // jambes + chaussures
      '<rect x="108" y="225" width="16" height="45" rx="8" fill="#7ac7bd"/>' +
      '<rect x="136" y="225" width="16" height="45" rx="8" fill="#7ac7bd"/>' +
      '<ellipse cx="112" cy="278" rx="20" ry="12" fill="#fff" stroke="#cfe9e3"/>' +
      '<ellipse cx="148" cy="278" rx="20" ry="12" fill="#fff" stroke="#cfe9e3"/>' +
      // tête (cerveau)
      '<ellipse cx="130" cy="78" rx="62" ry="56" fill="#CFEFE6"/>' +
      '<path d="M85 60 q10 -16 28 -10 q14 -14 32 -2 q18 -6 22 12 q14 8 4 24 q6 16 -12 18 q-8 14 -26 6 q-16 10 -30 -4 q-18 0 -16 -18 q-12 -12 -2 -26 z" fill="#BDE4DA"/>' +
      // yeux (pas humain : style mascotte)
      '<circle cx="113" cy="78" r="9" fill="#fff"/><circle cx="147" cy="78" r="9" fill="#fff"/>' +
      '<circle cx="114" cy="79" r="4.5" fill="#2d3a44"/><circle cx="148" cy="79" r="4.5" fill="#2d3a44"/>' +
      '<path d="M118 98 q12 9 24 0" stroke="#2d3a44" stroke-width="3" fill="none" stroke-linecap="round"/>';
    ZONES.forEach(function (z) {
      var g = document.createElementNS(ns, "circle");
      g.setAttribute("cx", z.x); g.setAttribute("cy", z.y); g.setAttribute("r", 15);
      g.setAttribute("fill", selection[z.id] ? "#F39BC2" : "rgba(243,155,194,.25)");
      g.setAttribute("stroke", "#F39BC2"); g.setAttribute("stroke-width", "2");
      g.style.cursor = "pointer"; g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
      g.setAttribute("aria-label", z.t + (selection[z.id] ? " (sélectionné)" : ""));
      function tog() { onToggle(z); }
      g.addEventListener("click", tog);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tog(); } });
      svg.appendChild(g);
    });
    return svg;
  }

  Boussole.registerTool({
    id: "besoins-corps", groupe: "tcc", titre: "Besoins & sensations", icone: "🫧",
    desc: "Cartes des besoins (CNV) et carte des sensations corporelles, pour ceux qui verbalisent peu.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Mes besoins & mes sensations", "Quand c'est dur de mettre des mots : montre où ça se ressent dans le corps, et ce dont tu as besoin."));

      // --- Sensations corporelles ---
      vue.appendChild(UI.el("h2", { text: "🫧 Où est-ce que je le ressens ?", style: "margin:.6rem 0" }));
      var selZones = {};
      var holder = UI.el("div", { style: "text-align:center" });
      var recapZones = UI.el("p.aide", { style: "text-align:center" });
      function dessine() {
        UI.vider(holder);
        holder.appendChild(mascotteSVG(selZones, function (z) { selZones[z.id] = !selZones[z.id]; dessine(); }));
        var actifs = ZONES.filter(function (z) { return selZones[z.id]; }).map(function (z) { return z.t.toLowerCase(); });
        recapZones.textContent = actifs.length ? "Je le ressens : " + actifs.join(", ") + "." : "Touche les zones colorées sur la mascotte.";
      }
      dessine();
      vue.appendChild(UI.el(".carte", {}, [holder, recapZones]));

      // --- Cartes des besoins ---
      vue.appendChild(UI.el("h2", { text: "💗 De quoi ai-je besoin maintenant ?", style: "margin:1.4rem 0 .6rem" }));
      var selBesoins = {};
      var recap = UI.el(".carte", { style: "background:var(--vert-clair);min-height:54px" }, [UI.el("p.aide", { text: "Choisis un ou plusieurs besoins." })]);
      var grille = UI.el(".emo-grille");
      BESOINS.forEach(function (b) {
        var btn = UI.el("button.emo-btn", {}, [UI.el("span.visage", { text: b.e }), UI.el("span", { text: b.t })]);
        btn.addEventListener("click", function () {
          selBesoins[b.t] = !selBesoins[b.t];
          btn.classList.toggle("choisi", selBesoins[b.t]);
          var actifs = Object.keys(selBesoins).filter(function (k) { return selBesoins[k]; });
          UI.vider(recap);
          recap.appendChild(actifs.length
            ? UI.el("p", { html: "👉 <strong>J'ai besoin de : " + actifs.join(", ").toLowerCase() + ".</strong>" })
            : UI.el("p.aide", { text: "Choisis un ou plusieurs besoins." }));
        });
        grille.appendChild(btn);
      });
      vue.appendChild(grille);
      vue.appendChild(recap);
    }
  });
})();
