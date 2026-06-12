/* Roue des émotions — 24 émotions, sans représentation humaine.
   On clique une émotion, on la nomme, et on reçoit une piste d'apaisement. */
(function () {
  "use strict";

  // valence: + (agréable), - (désagréable), ~ (mixte/neutre)
  var EMOTIONS = [
    { n: "Joie", c: "#F2C84B", v: "+" }, { n: "Excitation", c: "#F4B63E", v: "+" },
    { n: "Fierté", c: "#5B8DEF", v: "+" }, { n: "Motivation", c: "#EE8A3E", v: "+" },
    { n: "Tendresse", c: "#F39BC2", v: "+" }, { n: "Amour", c: "#E86A9A", v: "+" },
    { n: "Soulagement", c: "#7FC8F0", v: "+" }, { n: "Calme", c: "#8ED9D2", v: "+" },
    { n: "Surprise", c: "#F6D04E", v: "~" }, { n: "Timidité", c: "#F4C9A8", v: "~" },
    { n: "Confusion", c: "#B79CE0", v: "~" }, { n: "Ennui", c: "#A9B86B", v: "~" },
    { n: "Fatigue", c: "#9DB0C2", v: "-" }, { n: "Stress", c: "#EE8A3E", v: "-" },
    { n: "Anxiété", c: "#5FBDB4", v: "-" }, { n: "Peur", c: "#3FA9A0", v: "-" },
    { n: "Tristesse", c: "#5B8DEF", v: "-" }, { n: "Déception", c: "#7E93AC", v: "-" },
    { n: "Solitude", c: "#3F5C9A", v: "-" }, { n: "Rejet", c: "#8A8F9C", v: "-" },
    { n: "Honte", c: "#E7A6C0", v: "-" }, { n: "Culpabilité", c: "#C85BA0", v: "-" },
    { n: "Colère", c: "#E2553F", v: "-" }, { n: "Frustration", c: "#E2723F", v: "-" },
    { n: "Jalousie", c: "#6FA84B", v: "-" }, { n: "Dégoût", c: "#7FA83F", v: "-" }
  ];

  var AIDE = {
    "+": "Savoure ce moment 💛. Tu peux le noter pour t'en souvenir, ou le partager.",
    "~": "C'est une émotion mélangée, c'est normal. Respire un peu et observe ce qui se passe en toi.",
    "-": "Cette émotion est difficile. Elle a le droit d'être là. On peut s'apaiser ensemble."
  };

  Boussole.registerTool({
    id: "roue-emotions", groupe: "tcc", titre: "Roue des émotions", icone: "🎡",
    desc: "Une roue de 24 émotions pour affiner le vocabulaire et nommer précisément ce qu'on ressent.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Roue des émotions", "Tourne autour de la roue, choisis l'émotion qui te ressemble le plus. Plus on nomme finement, mieux on se comprend."));

      var N = EMOTIONS.length, cx = 200, cy = 200, rOut = 190, rIn = 70;
      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 400 400");
      svg.setAttribute("class", "timer-cercle");
      svg.style.maxWidth = "440px";
      svg.setAttribute("role", "group");
      svg.setAttribute("aria-label", "Roue des émotions");

      function pt(a, r) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }

      var carte = UI.el(".carte", { style: "margin-top:1rem;min-height:90px" }, [
        UI.el("p.aide", { text: "👆 Choisis une émotion sur la roue." })
      ]);

      EMOTIONS.forEach(function (e, i) {
        var a0 = (Math.PI * 2 * i / N) - Math.PI / 2;
        var a1 = (Math.PI * 2 * (i + 1) / N) - Math.PI / 2;
        var p0 = pt(a0, rOut), p1 = pt(a1, rOut), p2 = pt(a1, rIn), p3 = pt(a0, rIn);
        var d = "M" + p0[0] + "," + p0[1] +
          " A" + rOut + "," + rOut + " 0 0 1 " + p1[0] + "," + p1[1] +
          " L" + p2[0] + "," + p2[1] +
          " A" + rIn + "," + rIn + " 0 0 0 " + p3[0] + "," + p3[1] + " Z";
        var seg = document.createElementNS(ns, "path");
        seg.setAttribute("d", d);
        seg.setAttribute("fill", e.c);
        seg.setAttribute("stroke", "#fff");
        seg.setAttribute("stroke-width", "2");
        seg.style.cursor = "pointer";
        seg.setAttribute("tabindex", "0");
        seg.setAttribute("role", "button");
        seg.setAttribute("aria-label", e.n);
        function choisir() {
          svg.querySelectorAll("path").forEach(function (x) { x.setAttribute("opacity", "0.55"); });
          seg.setAttribute("opacity", "1");
          UI.vider(carte);
          carte.appendChild(UI.el("div", { style: "display:flex;align-items:center;gap:.6rem;flex-wrap:wrap" }, [
            UI.el("span", { style: "width:26px;height:26px;border-radius:50%;background:" + e.c + ";display:inline-block" }),
            UI.el("h3", { text: e.n, style: "margin:0" })
          ]));
          carte.appendChild(UI.el("p", { text: AIDE[e.v] }));
          var actions = UI.el(".btn-rangee", { style: "margin-bottom:0" });
          if (e.v === "-") {
            actions.appendChild(UI.el("a.btn.secondaire", { href: "#/respiration", text: "🫁 Respirer" }));
            actions.appendChild(UI.el("a.btn.secondaire", { href: "#/ancrage", text: "🧰 M'ancrer" }));
          }
          actions.appendChild(UI.el("button.btn", { text: "💾 Noter ce ressenti", onclick: function () {
            Store.emotions.ajouter({ profilId: ctx.profil ? ctx.profil.id : null, emotion: e.n, emoji: "🎡", intensite: null, note: "via la roue des émotions" });
            UI.toast("Ressenti noté 💛");
          }}));
          carte.appendChild(actions);
        }
        seg.addEventListener("click", choisir);
        seg.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); choisir(); } });
        // étiquette
        var am = (a0 + a1) / 2, lp = pt(am, (rOut + rIn) / 2);
        var t = document.createElementNS(ns, "text");
        t.setAttribute("x", lp[0]); t.setAttribute("y", lp[1]);
        t.setAttribute("font-size", "9"); t.setAttribute("font-weight", "700");
        t.setAttribute("text-anchor", "middle"); t.setAttribute("dominant-baseline", "middle");
        t.setAttribute("fill", "#2d3436"); t.style.pointerEvents = "none";
        var deg = am * 180 / Math.PI;
        if (deg > 90 && deg < 270) deg += 180;
        t.setAttribute("transform", "rotate(" + deg + " " + lp[0] + " " + lp[1] + ")");
        t.textContent = e.n;
        svg.appendChild(seg); svg.appendChild(t);
      });

      // moyeu central (cerveau, sans humain)
      var hub = document.createElementNS(ns, "circle");
      hub.setAttribute("cx", cx); hub.setAttribute("cy", cy); hub.setAttribute("r", rIn - 4);
      hub.setAttribute("fill", "#fff"); hub.setAttribute("stroke", "#e8dff0"); hub.setAttribute("stroke-width", "2");
      svg.appendChild(hub);
      var hubT = document.createElementNS(ns, "text");
      hubT.setAttribute("x", cx); hubT.setAttribute("y", cy); hubT.setAttribute("font-size", "34");
      hubT.setAttribute("text-anchor", "middle"); hubT.setAttribute("dominant-baseline", "central");
      hubT.style.pointerEvents = "none"; hubT.textContent = "🧠";
      svg.appendChild(hubT);

      vue.appendChild(UI.el(".timer-wrap", {}, [svg]));
      vue.appendChild(carte);
    }
  });
})();
