/* Time Timer visuel — minuteur circulaire qui « vide » le temps */
(function () {
  "use strict";

  Boussole.registerTool({
    id: "timer", groupe: "tnd", titre: "Time Timer visuel", icone: "⏱️",
    desc: "Minuteur visuel qui montre le temps qui passe. Idéal TDAH/TSA pour rendre le temps concret.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Time Timer visuel", "Le disque coloré se vide à mesure que le temps passe : le jeune « voit » le temps restant."));

      var dureeTotale = 5 * 60; // secondes
      var restant = dureeTotale;
      var enCours = false;
      var minuterie = null;

      var R = 130, C = 150;
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 300 300");
      svg.setAttribute("class", "timer-cercle");
      svg.setAttribute("role", "img");
      svg.innerHTML =
        '<circle cx="150" cy="150" r="140" fill="#fff" stroke="#e5e7eb" stroke-width="4"/>' +
        '<path id="secteur" fill="#e26d5c"/>' +
        '<circle cx="150" cy="150" r="' + R + '" fill="none" stroke="#2d3436" stroke-width="3"/>';
      var secteur = svg.querySelector("#secteur");

      function dessiner() {
        var frac = dureeTotale ? restant / dureeTotale : 0;
        var angle = frac * 2 * Math.PI;
        if (frac >= 0.9999) {
          secteur.setAttribute("d", "M150,150 m-" + R + ",0 a" + R + "," + R + " 0 1,0 " + (2 * R) + ",0 a" + R + "," + R + " 0 1,0 -" + (2 * R) + ",0");
        } else if (frac <= 0) {
          secteur.setAttribute("d", "");
        } else {
          var x = C + R * Math.sin(angle);
          var y = C - R * Math.cos(angle);
          var grand = angle > Math.PI ? 1 : 0;
          secteur.setAttribute("d", "M150,150 L150," + (C - R) + " A" + R + "," + R + " 0 " + grand + ",1 " + x + "," + y + " Z");
        }
      }

      var affTemps = UI.el(".timer-temps", { "aria-live": "polite" });
      function maj() {
        var m = Math.floor(restant / 60), s = restant % 60;
        affTemps.textContent = m + ":" + (s < 10 ? "0" : "") + s;
        svg.setAttribute("aria-label", "Temps restant " + m + " minutes " + s + " secondes");
        dessiner();
      }

      function tic() {
        restant--;
        if (restant <= 0) {
          restant = 0; maj(); arreter();
          UI.toast("⏰ Temps écoulé !"); bip();
          return;
        }
        maj();
      }
      function demarrer() { if (enCours || restant <= 0) return; enCours = true; minuterie = setInterval(tic, 1000); majBoutons(); }
      function arreter() { enCours = false; clearInterval(minuterie); majBoutons(); }
      function remettre(sec) { arreter(); dureeTotale = sec; restant = sec; maj(); }

      function bip() {
        try {
          var ctxA = new (window.AudioContext || window.webkitAudioContext)();
          var o = ctxA.createOscillator(), g = ctxA.createGain();
          o.connect(g); g.connect(ctxA.destination); o.frequency.value = 660; o.type = "sine";
          g.gain.setValueAtTime(0.15, ctxA.currentTime); o.start();
          g.gain.exponentialRampToValueAtTime(0.0001, ctxA.currentTime + 1);
          o.stop(ctxA.currentTime + 1);
        } catch (e) {}
      }

      var btnPlay = UI.el("button.btn.grand", { text: "▶️ Démarrer", onclick: function () { enCours ? arreter() : demarrer(); } });
      function majBoutons() { btnPlay.textContent = enCours ? "⏸️ Pause" : "▶️ Démarrer"; }

      var presets = UI.el(".btn-rangee", { style: "justify-content:center" });
      [1, 2, 5, 10, 15, 20, 30, 45].forEach(function (min) {
        presets.appendChild(UI.el("button.btn.secondaire", { text: min + " min", onclick: function () { remettre(min * 60); } }));
      });

      var perso = UI.input({ type: "number", min: 1, max: 120, placeholder: "min", style: "max-width:90px" });
      var champPerso = UI.el(".btn-rangee", { style: "justify-content:center;align-items:center" }, [
        UI.el("label", { text: "Durée personnalisée :", style: "font-weight:600" }),
        perso,
        UI.el("button.btn.ghost", { text: "Régler", onclick: function () {
          var v = parseInt(perso.value, 10); if (v > 0) remettre(v * 60);
        }})
      ]);

      vue.appendChild(UI.el(".timer-wrap", {}, [
        svg, affTemps,
        UI.el(".btn-rangee", { style: "justify-content:center" }, [
          btnPlay,
          UI.el("button.btn.ghost", { text: "↺ Réinitialiser", onclick: function () { remettre(dureeTotale); } })
        ]),
        presets, champPerso
      ]));

      maj();
    }
  });
})();
