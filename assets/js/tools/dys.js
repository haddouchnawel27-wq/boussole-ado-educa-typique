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
     Module 3 bis — Photo → texte (OCR, dyslexie)
     L'image est lue DANS le navigateur (Tesseract.js / WASM) : elle
     n'est jamais envoyée sur un serveur. La bibliothèque se charge
     depuis Internet à la première utilisation.
  ---------------------------------------------------------- */
  function chargerTesseract(ok, err) {
    if (window.Tesseract) return ok();
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    s.onload = function () { ok(); };
    s.onerror = function () { err(); };
    document.head.appendChild(s);
  }

  function moduleOCR(racine) {
    racine.appendChild(UI.el("p.aide", { text: "Prends ou choisis une photo d'un texte (leçon, énoncé). Cap Educa le transforme en texte que tu peux lire, agrandir ou écouter. La photo reste sur cet appareil ; seule l'aide à la lecture se charge depuis Internet la première fois." }));

    var fichier = UI.el("input", { type: "file", accept: "image/*", capture: "environment", style: "margin:.4rem 0" });
    var apercu = UI.el("img", { alt: "Aperçu de la photo", style: "max-width:100%;max-height:240px;border-radius:10px;display:none;margin:.4rem 0" });
    var etat = UI.el("p.meta");
    var texte = UI.textarea({ placeholder: "Le texte lu apparaîtra ici…", style: "min-height:120px;font-size:1.1rem" });
    var dataURL = null;

    var btnLire = UI.el("button.btn", { type: "button", text: "Lire le texte de la photo", disabled: true });

    fichier.addEventListener("change", function () {
      var f = fichier.files && fichier.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        dataURL = r.result;
        apercu.src = dataURL; apercu.style.display = "block";
        btnLire.disabled = false; etat.textContent = "";
      };
      r.readAsDataURL(f);
    });

    btnLire.addEventListener("click", function () {
      if (!dataURL) return;
      btnLire.disabled = true;
      etat.textContent = "Préparation de la lecture…";
      chargerTesseract(function () {
        etat.textContent = "Lecture de l'image en cours…";
        window.Tesseract.recognize(dataURL, "fra", {
          logger: function (m) {
            if (m.status === "recognizing text") etat.textContent = "Lecture en cours… " + Math.round(m.progress * 100) + "%";
          }
        }).then(function (res) {
          texte.value = (res.data.text || "").replace(/\n{3,}/g, "\n\n").trim();
          etat.textContent = texte.value ? "Texte reconnu. Tu peux le corriger si besoin." : "Aucun texte n'a pu être lu sur cette image.";
          btnLire.disabled = false;
        }).catch(function () {
          etat.textContent = "La lecture a échoué. Vérifie ta connexion Internet et réessaie.";
          btnLire.disabled = false;
        });
      }, function () {
        etat.textContent = "Impossible de charger l'aide à la lecture (Internet nécessaire la première fois).";
        btnLire.disabled = false;
      });
    });

    function lireVoix() {
      if (!("speechSynthesis" in window) || !texte.value.trim()) { UI.toast("Rien à lire"); return; }
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(texte.value);
      u.lang = "fr-FR";
      window.speechSynthesis.speak(u);
    }

    racine.appendChild(UI.champ("Photo du texte", fichier));
    racine.appendChild(apercu);
    racine.appendChild(UI.el(".btn-rangee", {}, [btnLire]));
    racine.appendChild(etat);
    racine.appendChild(UI.el("h2", { text: "Texte lu", style: "margin:1rem 0 .5rem" }));
    racine.appendChild(texte);
    racine.appendChild(UI.el(".btn-rangee", { style: "margin-top:.4rem" }, [
      UI.el("button.btn.secondaire", { type: "button", text: "Lire à voix haute", onclick: lireVoix }),
      UI.el("button.btn.ghost", { type: "button", text: "Copier", onclick: function () {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texte.value).then(function () { UI.toast("Copié"); }, function () {});
      }}),
      UI.el("button.btn.ghost", { type: "button", text: "Arrêter la voix", onclick: function () { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } })
    ]));
  }

  /* ----------------------------------------------------------
     Module 4 — Numération (dyscalculie)
  ---------------------------------------------------------- */
  var U_MOTS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  var D_MOTS = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

  function frDeux(n) {
    if (n < 20) return U_MOTS[n];
    var t = Math.floor(n / 10), r = n % 10;
    if (t === 7 || t === 9) {
      var base = t === 7 ? "soixante" : "quatre-vingt";
      if (r === 0) return t === 7 ? "soixante-dix" : "quatre-vingt-dix";
      if (t === 7 && r === 1) return "soixante et onze";
      return base + "-" + U_MOTS[10 + r];
    }
    var b = D_MOTS[t];
    if (r === 0) return t === 8 ? "quatre-vingts" : b;
    if (r === 1 && t !== 8) return b + " et un";
    return b + "-" + U_MOTS[r];
  }

  function frNombre(n) {
    if (n === 0) return "zéro";
    var mots = [];
    var mil = Math.floor(n / 1000), reste = n % 1000;
    if (mil > 0) mots.push(mil === 1 ? "mille" : frDeux(mil) + " mille");
    var cent = Math.floor(reste / 100), r2 = reste % 100;
    if (cent > 0) mots.push(cent === 1 ? "cent" : U_MOTS[cent] + " cent" + (r2 === 0 ? "s" : ""));
    if (r2 > 0) mots.push(frDeux(r2));
    return mots.join(" ");
  }

  function moduleNumeration(racine) {
    var saisie = UI.el("input", { type: "number", min: 0, max: 9999, value: 234, style: "font-size:1.6rem;width:140px;text-align:center;padding:.4rem;border:1px solid var(--gris-clair);border-radius:10px" });

    var motsEl = UI.el("p", { style: "font-size:1.3rem;font-weight:600;color:var(--vert-fonce);margin:.2rem 0 0" });
    var tableWrap = UI.el("div", { style: "overflow-x:auto" });
    var blocsEl = UI.el("div", { style: "display:flex;flex-wrap:wrap;gap:1.2rem;align-items:flex-end" });
    var ligneEl = UI.el("div");

    function n() { return Math.max(0, Math.min(9999, parseInt(saisie.value, 10) || 0)); }

    function tableNumeration(val) {
      var s = String(val).padStart(4, "0").split("");
      var cols = [["Milliers", "#8a6bb0"], ["Centaines", "#e26d5c"], ["Dizaines", "#4a7fa5"], ["Unités", "#3a7d6e"]];
      var tr1 = UI.el("tr"), tr2 = UI.el("tr");
      cols.forEach(function (c, i) {
        tr1.appendChild(UI.el("th", { text: c[0], style: "padding:.4rem .7rem;font-size:.8rem;color:" + c[1] + ";border:1px solid var(--gris-clair);background:#fafafa" }));
        tr2.appendChild(UI.el("td", { text: s[i], style: "padding:.5rem .7rem;font-size:1.8rem;font-weight:700;text-align:center;border:1px solid var(--gris-clair);color:" + c[1] }));
      });
      return UI.el("table", { style: "border-collapse:collapse;margin:.3rem 0" }, [UI.el("thead", {}, [tr1]), UI.el("tbody", {}, [tr2])]);
    }

    function grilleCentaine() {
      var g = UI.el("div", { style: "display:grid;grid-template-columns:repeat(10,7px);grid-auto-rows:7px;gap:1px;padding:2px;background:#e26d5c;border-radius:3px" });
      for (var i = 0; i < 100; i++) g.appendChild(UI.el("div", { style: "background:#fde0d9" }));
      return g;
    }
    function barreDizaine() {
      var g = UI.el("div", { style: "display:grid;grid-template-columns:7px;grid-auto-rows:7px;gap:1px;padding:2px;background:#4a7fa5;border-radius:3px" });
      for (var i = 0; i < 10; i++) g.appendChild(UI.el("div", { style: "background:#dcecf7" }));
      return g;
    }
    function pointUnite() {
      return UI.el("div", { style: "width:11px;height:11px;border-radius:50%;background:#3a7d6e" });
    }

    function blocsBase10(val) {
      UI.vider(blocsEl);
      var mil = Math.floor(val / 1000), cent = Math.floor((val % 1000) / 100), diz = Math.floor((val % 100) / 10), uni = val % 10;
      var i;
      if (mil > 0) {
        var colMil = UI.el("div", { style: "display:flex;gap:.3rem" });
        for (i = 0; i < mil; i++) colMil.appendChild(UI.el("div", { text: "1000", style: "width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#fff;background:#8a6bb0;border-radius:4px" }));
        blocsEl.appendChild(colMil);
      }
      var colC = UI.el("div", { style: "display:flex;gap:.4rem" });
      for (i = 0; i < cent; i++) colC.appendChild(grilleCentaine());
      if (cent) blocsEl.appendChild(colC);
      var colD = UI.el("div", { style: "display:flex;gap:.4rem" });
      for (i = 0; i < diz; i++) colD.appendChild(barreDizaine());
      if (diz) blocsEl.appendChild(colD);
      var colU = UI.el("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem;max-width:60px" });
      for (i = 0; i < uni; i++) colU.appendChild(pointUnite());
      if (uni) blocsEl.appendChild(colU);
      if (!val) blocsEl.appendChild(UI.el("p.aide", { text: "Zéro : aucune unité à représenter." }));
    }

    function droiteNumerique(val) {
      UI.vider(ligneEl);
      var max = val <= 10 ? 10 : val <= 100 ? 100 : val <= 1000 ? 1000 : 10000;
      var pct = (val / max) * 100;
      var barre = UI.el("div", { style: "position:relative;height:4px;background:var(--gris-clair);border-radius:2px;margin:2.4rem .5rem 1.6rem" });
      [0, 0.25, 0.5, 0.75, 1].forEach(function (f) {
        barre.appendChild(UI.el("div", { style: "position:absolute;left:" + (f * 100) + "%;top:-4px;width:2px;height:12px;background:var(--gris);transform:translateX(-1px)" }));
        barre.appendChild(UI.el("div", { text: Math.round(f * max), style: "position:absolute;left:" + (f * 100) + "%;top:12px;font-size:.75rem;color:var(--gris);transform:translateX(-50%)" }));
      });
      var marqueur = UI.el("div", { style: "position:absolute;left:" + pct + "%;top:-10px;width:16px;height:16px;border-radius:50%;background:var(--ambre);border:2px solid #fff;box-shadow:var(--ombre);transform:translateX(-8px)" });
      var bulle = UI.el("div", { text: val, style: "position:absolute;left:" + pct + "%;top:-34px;background:var(--vert);color:#fff;font-weight:700;padding:.1rem .5rem;border-radius:8px;font-size:.9rem;transform:translateX(-50%)" });
      barre.appendChild(marqueur); barre.appendChild(bulle);
      ligneEl.appendChild(barre);
    }

    function maj() {
      var val = n();
      var mot = frNombre(val);
      motsEl.textContent = mot.charAt(0).toUpperCase() + mot.slice(1);
      UI.vider(tableWrap); tableWrap.appendChild(tableNumeration(val));
      blocsBase10(val);
      droiteNumerique(val);
    }
    saisie.addEventListener("input", maj);

    racine.appendChild(UI.el(".carte", {}, [
      UI.el("label", { text: "Écris un nombre (de 0 à 9999)", style: "font-weight:600;display:block;margin-bottom:.4rem" }),
      saisie, motsEl
    ]));
    racine.appendChild(UI.el("h2", { text: "Dans le tableau", style: "margin:1.2rem 0 .4rem" }));
    racine.appendChild(tableWrap);
    racine.appendChild(UI.el("h2", { text: "Avec des objets (base 10)", style: "margin:1.2rem 0 .4rem" }));
    racine.appendChild(UI.el("p.aide", { text: "Grand carré = 100, barre = 10, point = 1." }));
    racine.appendChild(blocsEl);
    racine.appendChild(UI.el("h2", { text: "Sur la droite numérique", style: "margin:1.4rem 0 .4rem" }));
    racine.appendChild(ligneEl);
    maj();
  }

  /* ----------------------------------------------------------
     Module 5 — Page d'écriture (dysgraphie / dyspraxie)
  ---------------------------------------------------------- */
  function moduleEcriture(racine) {
    var MODELES = {
      simples: { nom: "Lignes simples", h: 44, css: "background:linear-gradient(to bottom,transparent 41px,#9aa6a3 41px,#9aa6a3 43px,transparent 43px);" },
      large: { nom: "Interligne large", h: 64, css: "background:linear-gradient(to bottom,transparent 61px,#9aa6a3 61px,#9aa6a3 63px,transparent 63px);" },
      seyes: { nom: "Seyès simplifié", h: 48, css: "background:linear-gradient(to bottom,transparent 11px,#cfe0ee 11px,#cfe0ee 12px,transparent 12px,transparent 23px,#cfe0ee 23px,#cfe0ee 24px,transparent 24px,transparent 35px,#cfe0ee 35px,#cfe0ee 36px,transparent 36px,transparent 45px,#4a7fa5 45px,#4a7fa5 47px,transparent 47px);" },
      couleurs: { nom: "Lignes repères (3 couleurs)", h: 56, css: "background:linear-gradient(to bottom,transparent 9px,#4a7fa5 9px,#4a7fa5 11px,transparent 11px,transparent 31px,#e8a33d 31px,#e8a33d 32px,transparent 32px,transparent 51px,#3a7d6e 51px,#3a7d6e 53px,transparent 53px);" }
    };

    var presetSel = UI.select(Object.keys(MODELES).map(function (k) { return { value: k, label: MODELES[k].nom }; }), { style: "padding:.4rem;border:1px solid var(--gris-clair);border-radius:10px" });
    var nbInput = UI.el("input", { type: "number", min: 3, max: 30, value: 12, style: "width:70px;padding:.4rem;border:1px solid var(--gris-clair);border-radius:10px" });
    var modeleTxt = UI.input({ placeholder: "Mot ou phrase à recopier (facultatif)", style: "width:100%;padding:.5rem;border:1px solid var(--gris-clair);border-radius:10px" });

    var feuille = UI.el("div", { style: "border:1px solid var(--gris-clair);border-radius:10px;padding:1rem;background:#fff;max-height:420px;overflow:auto" });

    function construireFeuille(pourImpression) {
      var k = presetSel.value, m = MODELES[k];
      var nb = Math.max(3, Math.min(30, parseInt(nbInput.value, 10) || 12));
      var cible = pourImpression ? document.createElement("div") : feuille;
      UI.vider(cible);
      if (modeleTxt.value.trim()) {
        cible.appendChild(UI.el("div", { text: modeleTxt.value.trim(), style: "height:" + m.h + "px;line-height:" + m.h + "px;font-size:" + Math.round(m.h * 0.5) + "px;color:#b9c2c0;" + m.css }));
      }
      for (var i = 0; i < nb; i++) {
        cible.appendChild(UI.el("div", { style: "height:" + m.h + "px;" + m.css }));
      }
      return cible;
    }
    presetSel.addEventListener("change", function () { construireFeuille(false); });
    nbInput.addEventListener("input", function () { construireFeuille(false); });
    modeleTxt.addEventListener("input", function () { construireFeuille(false); });

    function imprimer() {
      var contenu = construireFeuille(true);
      var w = window.open("", "_blank");
      if (!w) { UI.toast("Autorise les fenêtres pop-up pour imprimer."); return; }
      w.document.write('<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Page d\'écriture</title>' +
        '<style>@media print{body{margin:1.4cm}} body{font-family:Arial,sans-serif} .l{margin:0}</style></head><body></body></html>');
      Array.prototype.forEach.call(contenu.children, function (child) {
        var d = w.document.createElement("div");
        d.setAttribute("style", child.getAttribute("style"));
        d.className = "l"; d.textContent = child.textContent || "";
        w.document.body.appendChild(d);
      });
      w.document.close(); w.focus();
      setTimeout(function () { w.print(); }, 250);
    }

    racine.appendChild(UI.el(".carte", {}, [
      UI.champ("Type de lignes", presetSel),
      UI.champ("Nombre de lignes", nbInput),
      UI.champ("Modèle à recopier", modeleTxt),
      UI.el(".btn-rangee", { style: "margin-bottom:0" }, [
        UI.el("button.btn", { type: "button", text: "Imprimer la page", onclick: imprimer })
      ])
    ]));
    racine.appendChild(UI.el("p.aide", { text: "Aperçu ci-dessous. Le bouton « Imprimer » ouvre une page propre, prête à imprimer." }));
    racine.appendChild(UI.el("h2", { text: "Aperçu", style: "margin:1rem 0 .5rem" }));
    racine.appendChild(feuille);
    construireFeuille(false);
  }

  /* ----------------------------------------------------------
     Module 6 — Calcul posé (étapes guidées, dyscalculie)
  ---------------------------------------------------------- */
  var PLACES = ["unités", "dizaines", "centaines", "milliers", "dix-milliers"];
  // Couleur par rang (0 = unités, à droite) — cohérent avec la Numération.
  var COUL_RANG = ["#3a7d6e", "#4a7fa5", "#e26d5c", "#8a6bb0", "#c0392b"];

  function chiffresDroite(n, largeur) {
    var s = String(n).split("").reverse(); // index 0 = unités
    while (s.length < largeur) s.push("");
    return s;
  }

  function moduleCalcul(racine) {
    var opSel = UI.select([{ value: "+", label: "Addition (+)" }, { value: "-", label: "Soustraction (−)" }], { style: "padding:.4rem;border:1px solid var(--gris-clair);border-radius:10px" });
    var aIn = UI.el("input", { type: "number", min: 0, max: 9999, value: 248, style: "width:110px;font-size:1.3rem;text-align:right;padding:.4rem;border:1px solid var(--gris-clair);border-radius:10px" });
    var bIn = UI.el("input", { type: "number", min: 0, max: 9999, value: 176, style: "width:110px;font-size:1.3rem;text-align:right;padding:.4rem;border:1px solid var(--gris-clair);border-radius:10px" });
    var chkRes = UI.el("input", { type: "checkbox" });

    var noteEl = UI.el("p.aide");
    var poseEl = UI.el("div", { style: "overflow-x:auto" });
    var etapesEl = UI.el("div");

    function caseChiffre(txt, rang, fort) {
      return UI.el("div", {
        text: txt,
        style: "width:2.4rem;height:2.8rem;display:flex;align-items:center;justify-content:center;font-size:1.7rem;font-weight:700;" +
          "color:" + (txt === "" ? "transparent" : COUL_RANG[rang] || "#333") + ";" + (fort ? "border-bottom:3px solid #333;" : "")
      });
    }

    function ligneCases(digits, prefix) {
      var row = UI.el("div", { style: "display:flex;justify-content:flex-end;align-items:center;gap:.2rem" });
      if (prefix !== undefined) row.appendChild(UI.el("div", { text: prefix, style: "width:1.6rem;text-align:center;font-size:1.6rem;font-weight:700;color:#555" }));
      else row.appendChild(UI.el("div", { style: "width:1.6rem" }));
      for (var i = digits.length - 1; i >= 0; i--) row.appendChild(caseChiffre(digits[i], i));
      return row;
    }

    function maj() {
      var a = Math.max(0, Math.min(9999, parseInt(aIn.value, 10) || 0));
      var b = Math.max(0, Math.min(9999, parseInt(bIn.value, 10) || 0));
      var op = opSel.value;
      noteEl.textContent = "";
      var x = a, y = b;
      if (op === "-" && b > a) { x = b; y = a; noteEl.textContent = "Comme on ne peut pas enlever un grand nombre d'un plus petit, on calcule la différence (le grand moins le petit)."; }
      var res = op === "+" ? x + y : x - y;
      var largeur = Math.max(String(x).length, String(y).length, String(res).length);

      var da = chiffresDroite(x, largeur), db = chiffresDroite(y, largeur), dr = chiffresDroite(res, largeur);

      UI.vider(poseEl);
      var bloc = UI.el("div", { style: "display:inline-block;background:#fff;border:1px solid var(--gris-clair);border-radius:12px;padding:1rem 1.2rem" });
      bloc.appendChild(ligneCases(da));
      bloc.appendChild(ligneCases(db, op === "+" ? "+" : "−"));
      bloc.appendChild(UI.el("div", { style: "height:3px;background:#333;margin:.2rem 0 .3rem" }));
      if (chkRes.checked) bloc.appendChild(ligneCases(dr));
      else bloc.appendChild(UI.el("p.aide", { text: "Coche « Montrer le résultat » pour vérifier.", style: "text-align:right;margin:.3rem 0 0" }));
      poseEl.appendChild(bloc);

      UI.vider(etapesEl);
      if (!chkRes.checked) return;
      etapesEl.appendChild(UI.el("h2", { text: "Les étapes", style: "margin:1.2rem 0 .5rem" }));
      var ol = UI.el("ol", { style: "padding-left:1.2rem;line-height:1.7" });
      var i, txt;
      if (op === "+") {
        var ret = 0;
        for (i = 0; i < largeur; i++) {
          var va = parseInt(da[i] || "0", 10), vb = parseInt(db[i] || "0", 10);
          var som = va + vb + ret;
          var ecrit = som % 10; var nret = Math.floor(som / 10);
          txt = "Les " + PLACES[i] + " : " + va + " + " + vb + (ret ? " + " + ret + " (retenue)" : "") + " = " + som + " → j'écris " + ecrit + (nret ? ", je retiens " + nret : "") + ".";
          ol.appendChild(UI.el("li", { text: txt }));
          ret = nret;
        }
        if (ret) ol.appendChild(UI.el("li", { text: "Il reste une retenue " + ret + ", je l'écris à gauche." }));
      } else {
        var emp = 0;
        for (i = 0; i < largeur; i++) {
          var na = parseInt(da[i] || "0", 10) - emp, nb = parseInt(db[i] || "0", 10);
          var note = "";
          if (na < nb) { na += 10; note = " (j'emprunte 10)"; var nemp = 1; } else { var nemp = 0; }
          txt = "Les " + PLACES[i] + " : " + na + note + " − " + nb + " = " + (na - nb) + ".";
          ol.appendChild(UI.el("li", { text: txt }));
          emp = nemp;
        }
      }
      etapesEl.appendChild(ol);
    }

    [aIn, bIn].forEach(function (el) { el.addEventListener("input", maj); });
    opSel.addEventListener("change", maj);
    chkRes.addEventListener("change", maj);

    racine.appendChild(UI.el(".carte", {}, [
      UI.champ("Opération", opSel),
      UI.el("div", { style: "display:flex;gap:.8rem;align-items:center;flex-wrap:wrap" }, [
        UI.el("label", { text: "Premier nombre", style: "font-weight:600;margin:0" }), aIn,
        UI.el("label", { text: "Deuxième nombre", style: "font-weight:600;margin:0" }), bIn
      ]),
      UI.el("label", { style: "display:flex;gap:.5rem;align-items:center;font-weight:600;margin-top:.8rem" }, [chkRes, document.createTextNode("Montrer le résultat et les étapes")])
    ]));
    racine.appendChild(noteEl);
    racine.appendChild(UI.el("h2", { text: "L'opération posée", style: "margin:1.1rem 0 .5rem" }));
    racine.appendChild(UI.el("p.aide", { text: "Chaque colonne a sa couleur : vert = unités, bleu = dizaines, corail = centaines, violet = milliers." }));
    racine.appendChild(poseEl);
    racine.appendChild(etapesEl);
    maj();
  }

  /* ----------------------------------------------------------
     Outil : onglets
  ---------------------------------------------------------- */
  Boussole.registerTool({
    id: "dys", groupe: "tnd", titre: "Boîte à outils dys", icone: "🔤",
    desc: "Aides dys : voix haute, photo → texte, syllabes, confort de lecture, numération, calcul et écriture.",
    render: function (vue) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();

      vue.appendChild(UI.enTete("Boîte à outils dys", "Plusieurs aides pour lire plus facilement. Tout se passe sur cet appareil, sans Internet ni compte."));

      var onglets = [
        { id: "confort", label: "Confort de lecture", rendu: moduleConfort },
        { id: "voix", label: "Lecture à voix haute", rendu: moduleVoix },
        { id: "syllabes", label: "Syllabes colorées", rendu: moduleSyllabes },
        { id: "ocr", label: "Photo → texte", rendu: moduleOCR },
        { id: "numeration", label: "Numération", rendu: moduleNumeration },
        { id: "calcul", label: "Calcul posé", rendu: moduleCalcul },
        { id: "ecriture", label: "Écriture", rendu: moduleEcriture }
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
