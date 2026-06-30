/* Mon parcours d'apprentissage (métacognition) — fil guidé en 4 temps :
   Je choisis · Je teste · Je m'évalue · Je garde.
   S'appuie sur les cartes de révision et les cartes mentales déjà en place.
   Les traces sont gardées en local (localStorage). */
(function () {
  "use strict";

  var CLE = "meta_sessions";
  var compteur = 0;
  function uid() { return "ms" + Date.now().toString(36) + (compteur++).toString(36); }
  function charger() { return Store.lire(CLE, []); }
  function sauver(v) { Store.ecrire(CLE, v); }

  var STRATEGIES = ["Lire et relire", "Faire des cartes de révision", "Faire une carte mentale", "M'entraîner avec des exercices", "Expliquer à quelqu'un", "Autre"];

  var etat = { mode: "accueil", step: 0, data: null };
  function nouveau() { return { objectif: "", strategie: STRATEGIES[1], teste: false, confiance: 3, difficile: "", aRetenir: "" }; }
  function go(vue, mode, step) { etat.mode = mode; if (step != null) etat.step = step; rendre(vue); }

  /* ---------------- Accueil ---------------- */
  function vueAccueil(vue) {
    vue.appendChild(UI.enTete("Mon parcours d'apprentissage", "Apprendre à apprendre, en 4 temps : je choisis, je teste, je m'évalue, je garde. À ton rythme, sans note."));
    vue.appendChild(UI.el(".btn-rangee", {}, [
      UI.el("button.btn", { text: "🚀 Commencer un parcours", onclick: function () { etat.data = nouveau(); go(vue, "parcours", 0); } })
    ]));

    var sessions = charger().slice().reverse();
    if (!sessions.length) {
      vue.appendChild(UI.el("p.aide", { text: "Tes traces apparaîtront ici : ce que tu as appris et ce qui marche pour toi." }));
      return;
    }
    vue.appendChild(UI.el("h2", { text: "Mes traces", style: "margin:1.4rem 0 .6rem" }));
    var liste = UI.el("ul.liste");
    sessions.forEach(function (s) {
      liste.appendChild(UI.el("li.liste-item", {}, [
        UI.el("div.grow", {}, [
          UI.el("strong", { text: s.objectif || "Sans titre" }),
          UI.el("div.meta", { text: UI.dateFr(s.date) + " · " + s.strategie + " · confiance " + s.confiance + "/5" }),
          s.aRetenir ? UI.el("div", { text: "À retenir : " + s.aRetenir, style: "font-size:.92rem;margin-top:.2rem" }) : null
        ]),
        UI.el("button.btn.ghost", { text: "✕", "aria-label": "Supprimer la trace", onclick: function () {
          sauver(charger().filter(function (x) { return x.id !== s.id; })); go(vue, "accueil");
        }})
      ]));
    });
    vue.appendChild(liste);
  }

  /* ---------------- Stepper ---------------- */
  var ETAPES = [
    { cle: "choisis", titre: "Je choisis", icone: "🎯" },
    { cle: "teste", titre: "Je teste", icone: "🛠️" },
    { cle: "evalue", titre: "Je m'évalue", icone: "🔍" },
    { cle: "garde", titre: "Je garde", icone: "💾" }
  ];

  function barreEtapes(step) {
    var b = UI.el("div", { style: "display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem" });
    ETAPES.forEach(function (e, i) {
      var actif = i === step, fait = i < step;
      b.appendChild(UI.el("div", {
        text: e.icone + " " + e.titre,
        style: "padding:.35rem .7rem;border-radius:999px;font-size:.85rem;font-weight:600;" +
          (actif ? "background:var(--vert);color:#fff" : fait ? "background:var(--vert-clair);color:var(--vert-fonce)" : "background:#eee;color:#999")
      }));
    });
    return b;
  }

  function vueParcours(vue) {
    var d = etat.data, step = etat.step;
    vue.appendChild(UI.el("button.btn.ghost", { text: "← Quitter", style: "margin-bottom:.6rem", onclick: function () { go(vue, "accueil"); } }));
    vue.appendChild(barreEtapes(step));

    var corps = UI.el("div");
    vue.appendChild(corps);

    if (step === 0) {
      var obj = UI.input({ value: d.objectif, placeholder: "ex. Les tables de multiplication, la leçon d'histoire…" });
      obj.addEventListener("input", function () { d.objectif = obj.value; });
      var strat = UI.select(STRATEGIES.map(function (s) { return { value: s, label: s, selected: s === d.strategie }; }));
      strat.addEventListener("change", function () { d.strategie = strat.value; });
      corps.appendChild(UI.enTete("🎯 Je choisis", "Qu'est-ce que je veux apprendre ou réviser, et comment ?"));
      corps.appendChild(UI.el(".carte", {}, [UI.champ("Ce que je veux apprendre", obj), UI.champ("Comment je vais m'y prendre", strat)]));
    } else if (step === 1) {
      corps.appendChild(UI.enTete("🛠️ Je teste", "Maintenant, je m'entraîne pour de vrai. Ouvre un outil si besoin, puis reviens cocher."));
      corps.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("a.btn.secondaire", { href: "#/flashcards", text: "Ouvrir les cartes de révision" }),
        UI.el("a.btn.secondaire", { href: "#/carte-mentale", text: "Ouvrir une carte mentale" })
      ]));
      var chk = UI.el("input", { type: "checkbox" });
      chk.checked = d.teste;
      chk.addEventListener("change", function () { d.teste = chk.checked; });
      corps.appendChild(UI.el("label", { style: "display:flex;gap:.5rem;align-items:center;font-weight:600;margin-top:.8rem" }, [chk, document.createTextNode("Je me suis entraîné·e")]));
      corps.appendChild(UI.el("p.aide", { text: "Astuce : pour garder ta progression, reviens ici par ce parcours plutôt qu'en rouvrant l'outil depuis le menu." }));
    } else if (step === 2) {
      corps.appendChild(UI.enTete("🔍 Je m'évalue", "Sans me juger : qu'est-ce que je sais déjà, qu'est-ce qui reste difficile ?"));
      var note = UI.el("div", { style: "display:flex;gap:.5rem;margin:.3rem 0 1rem" });
      [1, 2, 3, 4, 5].forEach(function (v) {
        var btn = UI.el("button", { text: String(v), style: "width:44px;height:44px;border-radius:10px;border:2px solid var(--gris-clair);font-size:1.1rem;font-weight:700;cursor:pointer;background:" + (d.confiance === v ? "var(--vert)" : "#fff") + ";color:" + (d.confiance === v ? "#fff" : "#333") });
        btn.addEventListener("click", function () { d.confiance = v; go(vue, "parcours", 2); });
        note.appendChild(btn);
      });
      var diff = UI.textarea({ value: d.difficile, placeholder: "Ce qui reste difficile (facultatif)…", style: "min-height:70px" });
      diff.addEventListener("input", function () { d.difficile = diff.value; });
      corps.appendChild(UI.el(".carte", {}, [
        UI.el("label", { text: "À quel point je me sens sûr·e ? (1 = pas du tout, 5 = très sûr·e)", style: "font-weight:600;display:block;margin-bottom:.3rem" }),
        note,
        UI.champ("Ce qui reste difficile", diff)
      ]));
    } else if (step === 3) {
      var garder = UI.textarea({ value: d.aRetenir, placeholder: "Ce que je veux retenir, ou la stratégie qui a marché pour moi…", style: "min-height:80px" });
      garder.addEventListener("input", function () { d.aRetenir = garder.value; });
      corps.appendChild(UI.enTete("💾 Je garde", "Je note ce que je retiens. Ça construit ma façon d'apprendre, rien que pour moi."));
      corps.appendChild(UI.el(".carte", {}, [
        UI.el("p.meta", { text: "Objectif : " + (d.objectif || "—") + " · " + d.strategie + " · confiance " + d.confiance + "/5" }),
        UI.champ("Ce que je garde", garder)
      ]));
    }

    // Navigation
    var nav = UI.el(".btn-rangee", { style: "margin-top:1rem" });
    if (step > 0) nav.appendChild(UI.el("button.btn.secondaire", { text: "← Précédent", onclick: function () { go(vue, "parcours", step - 1); } }));
    if (step < 3) {
      nav.appendChild(UI.el("button.btn", { text: "Suivant →", onclick: function () {
        if (step === 0 && !d.objectif.trim()) { UI.toast("Écris d'abord ce que tu veux apprendre"); return; }
        go(vue, "parcours", step + 1);
      }}));
    } else {
      nav.appendChild(UI.el("button.btn", { text: "✓ Garder cette trace", onclick: function () {
        var s = Object.assign({ id: uid(), date: new Date().toISOString() }, d);
        var v = charger(); v.push(s); sauver(v);
        UI.toast("Trace gardée. Bravo !");
        go(vue, "accueil");
      }}));
    }
    vue.appendChild(nav);
  }

  function rendre(vue) {
    UI.vider(vue);
    if (etat.mode === "parcours") return vueParcours(vue);
    return vueAccueil(vue);
  }

  Boussole.registerTool({
    id: "metacognition", groupe: "meta", titre: "Mon parcours d'apprentissage", icone: "🎓",
    desc: "Apprendre à apprendre en 4 temps : je choisis, je teste, je m'évalue, je garde.",
    render: function (vue, ctx) {
      if (!ctx.arg) etat = { mode: "accueil", step: 0, data: null };
      rendre(vue);
    }
  });
})();
