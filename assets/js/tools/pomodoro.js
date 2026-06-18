/* Minuteur d'attention (type Pomodoro) : alterne temps de travail et pauses,
   pour soutenir l'attention et l'autorégulation (TDAH, fonctions exécutives). */
(function () {
  "use strict";

  Boussole.registerTool({
    id: "pomodoro", groupe: "tnd", titre: "Minuteur d'attention", icone: "🍅",
    desc: "Alterne des temps de travail courts et des pauses, pour soutenir l'attention.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Minuteur d'attention", "On travaille un temps court et défini, puis on s'accorde une pause. Idéal pour démarrer une tâche et tenir dans la durée."));

      var dureeTravail = 15, dureePause = 5, cyclesPrevus = 4;
      var phase = "pret"; // pret | travail | pause | fini
      var cycle = 0, restant = 0, timer = null;

      var titrePhase = UI.el("div", { style: "font-size:1.4rem;font-weight:800;text-align:center" });
      var affTemps = UI.el(".timer-temps", { style: "text-align:center" });
      var sousTexte = UI.el("p.aide", { style: "text-align:center" });
      var barre = UI.el("div", { style: "height:16px;background:#e5e7eb;border-radius:99px;overflow:hidden;margin:1rem 0" }, [
        UI.el("div", { id: "pb", style: "height:100%;width:0;transition:width .5s" })
      ]);

      function maj() {
        var m = Math.floor(restant / 60), s = restant % 60;
        affTemps.textContent = m + ":" + (s < 10 ? "0" : "") + s;
        var total = (phase === "pause" ? dureePause : dureeTravail) * 60;
        var pct = total ? (1 - restant / total) * 100 : 0;
        var pb = vue.querySelector("#pb");
        if (pb) { pb.style.width = pct + "%"; pb.style.background = phase === "pause" ? "#4a7fa5" : "#2a9d8f"; }
      }

      function bip() {
        try {
          var a = new (window.AudioContext || window.webkitAudioContext)();
          var o = a.createOscillator(), g = a.createGain();
          o.connect(g); g.connect(a.destination); o.type = "sine"; o.frequency.value = 600;
          g.gain.setValueAtTime(.15, a.currentTime); o.start();
          g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .8); o.stop(a.currentTime + .8);
        } catch (e) {}
      }

      function demarrerPhase(p) {
        phase = p;
        restant = (p === "pause" ? dureePause : dureeTravail) * 60;
        titrePhase.textContent = p === "pause" ? "☕ Pause" : "✏️ Au travail";
        sousTexte.textContent = "Séance " + (cycle + 1) + " sur " + cyclesPrevus;
        titrePhase.style.color = p === "pause" ? "#4a7fa5" : "#2a9d8f";
        maj();
      }

      function tic() {
        restant--;
        if (restant <= 0) {
          bip();
          if (phase === "travail") {
            cycle++;
            if (cycle >= cyclesPrevus) { terminer(); return; }
            demarrerPhase("pause"); UI.toast("Bravo ! Petite pause 🌿");
          } else {
            demarrerPhase("travail"); UI.toast("C'est reparti ✏️");
          }
          return;
        }
        maj();
      }

      var btn = UI.el("button.btn.grand", { text: "▶️ Démarrer" });
      function lancer() {
        if (timer) { clearInterval(timer); timer = null; btn.textContent = "▶️ Reprendre"; return; }
        if (phase === "pret" || phase === "fini") { cycle = 0; demarrerPhase("travail"); }
        timer = setInterval(tic, 1000); btn.textContent = "⏸️ Pause";
      }
      function terminer() {
        clearInterval(timer); timer = null; phase = "fini";
        titrePhase.textContent = "🎉 Terminé !"; titrePhase.style.color = "#e8a33d";
        sousTexte.textContent = cyclesPrevus + " séances accomplies. Beau travail !";
        affTemps.textContent = "✓"; btn.textContent = "↺ Recommencer";
      }
      btn.addEventListener("click", lancer);

      function reglage(label, val, options, onCh) {
        var sel = UI.select(options.map(function (o) { return { value: o, label: o + " min", selected: o === val }; }));
        sel.addEventListener("change", function () { onCh(parseInt(sel.value, 10)); });
        return UI.champ(label, sel);
      }

      vue.appendChild(UI.el(".carte", {}, [
        reglage("Temps de travail", dureeTravail, [5, 10, 15, 20, 25, 30], function (v) { dureeTravail = v; if (phase === "pret") { } }),
        reglage("Temps de pause", dureePause, [2, 3, 5, 10], function (v) { dureePause = v; }),
        (function () {
          var sel = UI.select([2, 3, 4, 5, 6].map(function (o) { return { value: o, label: o + " séances", selected: o === cyclesPrevus }; }));
          sel.addEventListener("change", function () { cyclesPrevus = parseInt(sel.value, 10); });
          return UI.champ("Nombre de séances", sel);
        })()
      ]));

      vue.appendChild(UI.el(".timer-wrap", {}, [titrePhase, affTemps, sousTexte, barre, btn]));

      demarrerPhase("travail"); phase = "pret"; titrePhase.textContent = "Prêt·e ?"; titrePhase.style.color = "var(--ardoise)"; sousTexte.textContent = "Règle tes durées, puis démarre.";
    }
  });
})();
