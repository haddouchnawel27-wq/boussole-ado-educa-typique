/* Boîte à outils dys — plusieurs aides de lecture, 100 % locales :
   1) Confort de lecture (police, espacement, teinte, règle de lecture)
   2) Lecture à voix haute (synthèse vocale du navigateur, suit le mot lu)
   3) Syllabes colorées (découpage automatique alterné). */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     Module 1 — Confort de lecture
  ---------------------------------------------------------- */
  var TEINTES = [
    { nom: "Aucune", bg: "#ffffff" },
    { nom: "Crème", bg: "#fbf3df" },
    { nom: "Pêche", bg: "#fde8d9" },
    { nom: "Bleu", bg: "#dcecf7" },
    { nom: "Vert", bg: "#dff0e4" },
    { nom: "Rose", bg: "#fbe4ee" },
    { nom: "Gris", bg: "#e9e9ee" }
  ];

  var EXEMPLE = "Colle ici un texte (leçon, énoncé, consigne…) puis ajuste l'affichage pour le rendre plus confortable à lire. Tu peux activer la règle de lecture pour suivre ligne par ligne.";

  function moduleConfort(racine) {
    var etat = { police: false, taille: 20, interligne: 1.8, lettres: 0.04, mots: 0.16, teinte: "#fbf3df", regle: false };

    var saisie = UI.textarea({ value: EXEMPLE, placeholder: "Collez votre texte ici…", style: "min-height:90px" });
    var zone = UI.el("div", { tabindex: "0", style: "position:relative;padding:1.2rem;border-radius:12px;border:1px solid var(--gris-clair);white-space:pre-wrap;overflow:hidden" });
    var regle = UI.el("div", { style: "position:absolute;left:0;right:0;height:2.2em;background:rgba(58,125,110,.18);border-top:2px solid #3a7d6e;border-bottom:2px solid #3a7d6e;pointer-events:none;display:none" });

    function appliquer() {
      zone.textContent = saisie.value || "";
      zone.appendChild(regle);
      zone.style.background = etat.teinte;
      zone.style.fontFamily = etat.police ? '"Comic Sans MS","Trebuchet MS",Verdana,sans-serif' : "inherit";
      zone.style.fontSize = etat.taille + "px";
      zone.style.lineHeight = etat.interligne;
      zone.style.letterSpacing = etat.lettres + "em";
      zone.style.wordSpacing = etat.mots + "em";
      regle.style.display = etat.regle ? "block" : "none";
      regle.style.height = (etat.interligne * 1.1) + "em";
    }
    saisie.addEventListener("input", appliquer);

    zone.addEventListener("mousemove", function (e) {
      if (!etat.regle) return;
      var r = zone.getBoundingClientRect();
      regle.style.top = (e.clientY - r.top - regle.offsetHeight / 2) + "px";
    });
    zone.addEventListener("touchmove", function (e) {
      if (!etat.regle || !e.touches[0]) return;
      var r = zone.getBoundingClientRect();
      regle.style.top = (e.touches[0].clientY - r.top - regle.offsetHeight / 2) + "px";
    }, { passive: true });

    function curseur(label, min, max, pas, val, onCh) {
      var input = UI.el("input", { type: "range", min: min, max: max, step: pas, value: val, style: "width:100%" });
      input.addEventListener("input", function () { onCh(parseFloat(input.value)); appliquer(); });
      return UI.el(".champ", { style: "margin-bottom:.6rem" }, [UI.el("label", { text: label }), input]);
    }

    var chkPolice = UI.el("input", { type: "checkbox" });
    chkPolice.addEventListener("change", function () { etat.police = chkPolice.checked; appliquer(); });
    var chkRegle = UI.el("input", { type: "checkbox" });
    chkRegle.addEventListener("change", function () { etat.regle = chkRegle.checked; appliquer(); });

    var teintes = UI.el(".btn-rangee");
    TEINTES.forEach(function (t) {
      var b = UI.el("button", { title: t.nom, "aria-label": "Fond " + t.nom, style: "width:38px;height:38px;border-radius:50%;border:2px solid " + (etat.teinte === t.bg ? "#3a7d6e" : "#ccc") + ";background:" + t.bg + ";cursor:pointer" });
      b.addEventListener("click", function () { etat.teinte = t.bg; teintes.querySelectorAll("button").forEach(function (x) { x.style.borderColor = "#ccc"; }); b.style.borderColor = "#3a7d6e"; appliquer(); });
      teintes.appendChild(b);
    });

    var controles = UI.el(".carte", {}, [
      UI.el("label", { style: "display:flex;gap:.5rem;align-items:center;font-weight:600;margin-bottom:.6rem" }, [chkPolice, document.createTextNode("Police adaptée « dys »")]),
      UI.el("label", { style: "display:flex;gap:.5rem;align-items:center;font-weight:600;margin-bottom:.8rem" }, [chkRegle, document.createTextNode("Règle de lecture (suit le curseur)")]),
      curseur("Taille du texte", 14, 40, 1, etat.taille, function (v) { etat.taille = v; }),
      curseur("Interligne", 1.2, 3, 0.1, etat.interligne, function (v) { etat.interligne = v; }),
      curseur("Espacement des lettres", 0, 0.3, 0.01, etat.lettres, function (v) { etat.lettres = v; }),
      curseur("Espacement des mots", 0, 0.6, 0.02, etat.mots, function (v) { etat.mots = v; }),
      UI.el("label", { text: "Couleur de fond", style: "font-weight:600;display:block;margin:.3rem 0" }),
      teintes
    ]);

    racine.appendChild(UI.champ("Votre texte", saisie));
    racine.appendChild(controles);
    racine.appendChild(UI.el("h2", { text: "Aperçu", style: "margin:1.2rem 0 .5rem" }));
    racine.appendChild(zone);
    appliquer();
  }

  /* ----------------------------------------------------------
     Module 2 — Lecture à voix haute (synthèse vocale)
  ---------------------------------------------------------- */
  function moduleVoix(racine) {
    if (!("speechSynthesis" in window)) {
      racine.appendChild(UI.el("p.aide", { text: "La lecture à voix haute n'est pas disponible sur ce navigateur. Essayez Chrome, Edge ou Safari." }));
      return;
    }
    var synth = window.speechSynthesis;
    synth.cancel();

    var saisie = UI.textarea({ value: "Colle un texte ici, puis appuie sur « Lire ». La lecture met en évidence chaque mot lu.", placeholder: "Colle le texte à lire…", style: "min-height:90px" });
    var zone = UI.el("div", { style: "padding:1rem;border-radius:12px;border:1px solid var(--gris-clair);line-height:2;font-size:1.2rem;background:#fbf3df" });

    var spans = [];
    function construireZone() {
      UI.vider(zone); spans = [];
      var txt = saisie.value || "";
      var re = /\S+|\s+/g, m;
      while ((m = re.exec(txt))) {
        var seg = m[0];
        if (/\S/.test(seg)) {
          var s = UI.el("span", { text: seg });
          s._start = m.index; s._end = m.index + seg.length;
          spans.push(s); zone.appendChild(s);
        } else {
          zone.appendChild(document.createTextNode(seg));
        }
      }
    }
    construireZone();
    saisie.addEventListener("input", construireZone);
    function clearHL() { spans.forEach(function (s) { s.style.background = ""; s.style.borderRadius = ""; }); }

    var selVoix = UI.el("select");
    function chargerVoix() {
      var vs = synth.getVoices().filter(function (v) { return /fr/i.test(v.lang); });
      if (!vs.length) vs = synth.getVoices();
      UI.vider(selVoix);
      vs.forEach(function (v) { selVoix.appendChild(UI.el("option", { value: v.name, text: v.name + " (" + v.lang + ")" })); });
      selVoix._voices = vs;
    }
    chargerVoix();
    if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = chargerVoix;

    var vitesse = 1;
    var rng = UI.el("input", { type: "range", min: 0.5, max: 1.5, step: 0.1, value: 1, style: "width:160px" });
    var lblVit = UI.el("span.aide", { text: "Vitesse : normale" });
    rng.addEventListener("input", function () {
      vitesse = parseFloat(rng.value);
      lblVit.textContent = "Vitesse : " + (vitesse < 0.9 ? "lente" : vitesse > 1.1 ? "rapide" : "normale");
    });

    function lire() {
      synth.cancel(); clearHL();
      var u = new SpeechSynthesisUtterance(saisie.value || "");
      u.lang = "fr-FR"; u.rate = vitesse;
      var vs = selVoix._voices || [];
      var chosen = vs.filter(function (v) { return v.name === selVoix.value; })[0];
      if (chosen) u.voice = chosen;
      u.onboundary = function (e) {
        if (e.name && e.name !== "word") return;
        clearHL();
        for (var i = 0; i < spans.length; i++) {
          if (e.charIndex >= spans[i]._start && e.charIndex < spans[i]._end) {
            spans[i].style.background = "rgba(58,125,110,.30)";
            spans[i].style.borderRadius = "4px";
            break;
          }
        }
      };
      u.onend = clearHL; u.onerror = clearHL;
      synth.speak(u);
    }

    var btnLire = UI.el("button.btn", { type: "button", text: "Lire", onclick: lire });
    var btnPause = UI.el("button.btn.secondaire", { type: "button", text: "Pause / Reprendre", onclick: function () {
      if (synth.speaking && !synth.paused) synth.pause();
      else if (synth.paused) synth.resume();
    }});
    var btnStop = UI.el("button.btn.ghost", { type: "button", text: "Stop", onclick: function () { synth.cancel(); clearHL(); } });

    racine.appendChild(UI.champ("Texte à lire", saisie));
    racine.appendChild(UI.el(".carte", {}, [
      UI.el("div", { style: "display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;margin-bottom:.8rem" }, [btnLire, btnPause, btnStop]),
      UI.champ("Voix", selVoix),
      UI.el("div", { style: "display:flex;gap:.8rem;align-items:center" }, [UI.el("label", { text: "Vitesse", style: "font-weight:600;margin:0" }), rng, lblVit])
    ]));
    racine.appendChild(UI.el("p.aide", { text: "La lecture utilise la voix de l'appareil : aucun texte n'est envoyé sur Internet." }));
    racine.appendChild(UI.el("h2", { text: "Lecture", style: "margin:1rem 0 .5rem" }));
    racine.appendChild(zone);
  }

  /* ----------------------------------------------------------
     Module 3 — Syllabes colorées
  ---------------------------------------------------------- */
  function estVoyelle(c) { return "aeiouyàâäéèêëîïôöùûüœæ".indexOf(c.toLowerCase()) >= 0; }

  // Découpage syllabique approximatif du français (aide à la lecture).
  function syllaber(mot) {
    var bas = mot.toLowerCase();
    var units = [];
    var digraphes = ["ch", "ph", "th", "gn", "qu", "gu"];
    var i = 0, n = mot.length;
    while (i < n) {
      if (estVoyelle(mot[i])) {
        var j = i; while (j < n && estVoyelle(mot[j])) j++;
        units.push({ type: "V", text: mot.slice(i, j) });
        i = j;
      } else {
        var two = bas.slice(i, i + 2);
        if (digraphes.indexOf(two) >= 0) { units.push({ type: "C", text: mot.slice(i, i + 2) }); i += 2; }
        else { units.push({ type: "C", text: mot.slice(i, i + 1) }); i += 1; }
      }
    }
    var nuclei = [];
    units.forEach(function (u, idx) { if (u.type === "V") nuclei.push(idx); });
    if (nuclei.length <= 1) return [mot];

    var breaks = {};
    function inseparable(prev, last) {
      if (last !== "l" && last !== "r") return false;
      return "bcdfgptv".indexOf(prev) >= 0 || prev === "ch" || prev === "ph" || prev === "th";
    }
    for (var k = 0; k < nuclei.length - 1; k++) {
      var a = nuclei[k], b = nuclei[k + 1];
      var m = b - a - 1;
      if (m === 0) breaks[b] = true;
      else if (m === 1) breaks[a + 1] = true;
      else {
        var last = units[b - 1].text.toLowerCase(), prev = units[b - 2].text.toLowerCase();
        if (inseparable(prev, last)) breaks[b - 2] = true;
        else breaks[b - 1] = true;
      }
    }
    var syls = [], cur = "";
    for (var idx = 0; idx < units.length; idx++) {
      if (breaks[idx]) { syls.push(cur); cur = ""; }
      cur += units[idx].text;
    }
    if (cur) syls.push(cur);
    return syls;
  }

  function moduleSyllabes(racine) {
    var couleurs = ["#c0392b", "#2471a3"];
    var saisie = UI.textarea({ value: "Tape un mot ou une phrase, puis regarde les syllabes se colorer.", placeholder: "Tape un texte…", style: "min-height:80px" });
    var zone = UI.el("div", { style: "padding:1rem 1.2rem;border-radius:12px;border:1px solid var(--gris-clair);font-size:1.7rem;line-height:2.2;background:#fff" });

    function rendre() {
      UI.vider(zone);
      var txt = saisie.value || "";
      var re = /[A-Za-zÀ-ÿœæ]+|[^A-Za-zÀ-ÿœæ]+/g, m;
      while ((m = re.exec(txt))) {
        var seg = m[0];
        if (/[A-Za-zÀ-ÿœæ]/.test(seg)) {
          syllaber(seg).forEach(function (s, ci) {
            zone.appendChild(UI.el("span", { text: s, style: "color:" + couleurs[ci % 2] + ";font-weight:700" }));
          });
        } else {
          zone.appendChild(document.createTextNode(seg));
        }
      }
    }
    saisie.addEventListener("input", rendre);

    var grosseur = UI.el("input", { type: "range", min: 18, max: 44, step: 1, value: 28, style: "width:160px" });
    grosseur.addEventListener("input", function () { zone.style.fontSize = grosseur.value + "px"; });

    racine.appendChild(UI.champ("Texte", saisie));
    racine.appendChild(UI.el(".carte", {}, [
      UI.el("div", { style: "display:flex;gap:.8rem;align-items:center" }, [UI.el("label", { text: "Taille", style: "font-weight:600;margin:0" }), grosseur])
    ]));
    racine.appendChild(UI.el("p.aide", { text: "Le découpage est automatique : il peut se tromper sur certains mots. À utiliser comme repère, pas comme règle." }));
    racine.appendChild(UI.el("h2", { text: "Syllabes", style: "margin:1rem 0 .5rem" }));
    racine.appendChild(zone);
    zone.style.fontSize = grosseur.value + "px";
    rendre();
  }

  /* ----------------------------------------------------------
     Outil : onglets
  ---------------------------------------------------------- */
  Boussole.registerTool({
    id: "dys", groupe: "tnd", titre: "Boîte à outils dys", icone: "🔤",
    desc: "Trois aides de lecture : voix haute, syllabes colorées et confort d'affichage.",
    render: function (vue) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();

      vue.appendChild(UI.enTete("Boîte à outils dys", "Plusieurs aides pour lire plus facilement. Tout se passe sur cet appareil, sans Internet ni compte."));

      var onglets = [
        { id: "confort", label: "Confort de lecture", rendu: moduleConfort },
        { id: "voix", label: "Lecture à voix haute", rendu: moduleVoix },
        { id: "syllabes", label: "Syllabes colorées", rendu: moduleSyllabes }
      ];

      var barre = UI.el(".btn-rangee", { role: "tablist", style: "flex-wrap:wrap;gap:.4rem;margin-bottom:1.1rem" });
      var corps = UI.el("div");

      function afficher(id) {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        UI.vider(corps);
        barre.querySelectorAll("button").forEach(function (b) {
          var on = b.dataset.tab === id;
          b.className = on ? "btn" : "btn ghost";
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        (onglets.filter(function (x) { return x.id === id; })[0]).rendu(corps);
      }

      onglets.forEach(function (o) {
        barre.appendChild(UI.el("button", { type: "button", role: "tab", dataset: { tab: o.id }, text: o.label, onclick: function () { afficher(o.id); } }));
      });

      vue.appendChild(barre);
      vue.appendChild(corps);
      afficher("confort");
    }
  });
})();
