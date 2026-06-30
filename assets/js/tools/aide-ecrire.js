/* Aide à l'écriture (dysorthographie / dyspraxie) — 4 modules locaux :
   1) Banque de mots fréquents (cliquables)
   2) Phrase modèle (structures à compléter)
   3) Correcteur simple (repère les pièges courants, hors-ligne)
   4) Clavier simplifié (grandes touches, ordre alphabétique).
   100 % local, aucune dépendance. */
(function () {
  "use strict";

  /* ---------- utilitaire : insérer du texte dans un champ ---------- */
  function inserer(champ, texte) {
    var deb = champ.selectionStart != null ? champ.selectionStart : champ.value.length;
    var fin = champ.selectionEnd != null ? champ.selectionEnd : champ.value.length;
    champ.value = champ.value.slice(0, deb) + texte + champ.value.slice(fin);
    var p = deb + texte.length;
    champ.selectionStart = champ.selectionEnd = p;
    champ.focus();
  }
  function copier(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { UI.toast("Copié"); }, function () { UI.toast("Copie impossible"); });
    } else { UI.toast("Copie non disponible"); }
  }

  /* ---------- Module 1 — Banque de mots ---------- */
  var BANQUES = [
    { nom: "Mots fréquents", mots: ["le", "la", "les", "un", "une", "des", "de", "du", "et", "est", "à", "a", "il", "elle", "je", "tu", "nous", "vous", "ils", "elles", "dans", "sur", "sous", "avec", "pour", "mais", "ou", "où", "ce", "cette", "mon", "ma", "mes", "son", "sa", "ses", "qui", "que", "quoi", "ne", "pas", "plus", "très", "bien"] },
    { nom: "Verbes utiles", mots: ["être", "avoir", "faire", "aller", "dire", "voir", "prendre", "venir", "vouloir", "pouvoir", "savoir", "mettre", "donner", "manger", "jouer", "regarder", "parler", "aimer", "finir", "partir", "écrire", "lire"] },
    { nom: "Mots de liaison", mots: ["d'abord", "ensuite", "puis", "enfin", "alors", "donc", "car", "parce que", "aussi", "pourtant", "cependant", "par exemple", "en effet", "c'est pourquoi"] },
    { nom: "Jours & mois", mots: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"] }
  ];

  function moduleBanque(racine) {
    var compo = UI.textarea({ placeholder: "Ton texte se construit ici…", style: "min-height:90px" });
    var rech = UI.el("input", { type: "search", placeholder: "🔍 Chercher un mot…", style: "width:100%;padding:.5rem;border:1px solid var(--gris-clair);border-radius:10px;margin:.4rem 0" });
    var blocs = UI.el("div");

    function dessiner() {
      UI.vider(blocs);
      var q = rech.value.trim().toLowerCase();
      BANQUES.forEach(function (b) {
        var mots = b.mots.filter(function (m) { return !q || m.indexOf(q) >= 0; });
        if (!mots.length) return;
        blocs.appendChild(UI.el("h2", { text: b.nom, style: "margin:1rem 0 .4rem;font-size:1.05rem" }));
        var rangee = UI.el(".btn-rangee", { style: "flex-wrap:wrap;gap:.35rem;margin-bottom:.2rem" });
        mots.forEach(function (m) {
          rangee.appendChild(UI.el("button.btn.secondaire", { text: m, style: "padding:.35rem .7rem;font-size:.95rem", onclick: function () {
            inserer(compo, (compo.value && !/\s$/.test(compo.value) ? " " : "") + m);
          }}));
        });
        blocs.appendChild(rangee);
      });
    }
    rech.addEventListener("input", dessiner);

    racine.appendChild(UI.champ("Mon texte", compo));
    racine.appendChild(UI.el(".btn-rangee", {}, [
      UI.el("button.btn.ghost", { text: "Copier le texte", onclick: function () { copier(compo.value); } }),
      UI.el("button.btn.ghost", { text: "Effacer", onclick: function () { compo.value = ""; compo.focus(); } })
    ]));
    racine.appendChild(rech);
    racine.appendChild(UI.el("p.aide", { text: "Touche un mot pour l'ajouter à ton texte." }));
    racine.appendChild(blocs);
    dessiner();
  }

  /* ---------- Module 2 — Phrase modèle ---------- */
  var FRAMES = [
    { nom: "Phrase simple", champs: [["Qui ?", "Le chat"], ["fait quoi ?", "dort"], ["où ?", "sur le canapé"]] },
    { nom: "Décrire", champs: [["Qui / quoi ?", "Ma sœur"], ["est comment ?", "gentille et drôle"]] },
    { nom: "Raconter", champs: [["Quand ?", "Hier"], ["Qui ?", "nous"], ["a fait quoi ?", "sommes allés au parc"], ["pourquoi ?", "pour jouer"]] }
  ];

  function moduleFrame(racine) {
    var sel = UI.select(FRAMES.map(function (f, i) { return { value: String(i), label: f.nom }; }), { style: "padding:.4rem;border:1px solid var(--gris-clair);border-radius:10px" });
    var zoneChamps = UI.el("div");
    var resultat = UI.el("div", { style: "font-size:1.3rem;font-weight:600;color:var(--vert-fonce);padding:1rem;background:#fbf3df;border-radius:12px;min-height:2.2rem" });
    var inputs = [];

    function assembler() {
      var bouts = inputs.map(function (inp) { return inp.value.trim(); }).filter(Boolean);
      var phrase = bouts.join(" ");
      if (phrase) { phrase = phrase.charAt(0).toUpperCase() + phrase.slice(1); if (!/[.!?]$/.test(phrase)) phrase += "."; }
      resultat.textContent = phrase || "Complète les cases pour former ta phrase.";
    }
    function construire() {
      var f = FRAMES[parseInt(sel.value, 10)];
      UI.vider(zoneChamps); inputs = [];
      f.champs.forEach(function (c) {
        var inp = UI.input({ placeholder: "ex. " + c[1] });
        inp.addEventListener("input", assembler);
        inputs.push(inp);
        zoneChamps.appendChild(UI.champ(c[0], inp));
      });
      assembler();
    }
    sel.addEventListener("change", construire);

    racine.appendChild(UI.champ("Type de phrase", sel));
    racine.appendChild(UI.el("p.aide", { text: "Remplis chaque case avec un petit bout : la phrase se forme toute seule en bas." }));
    racine.appendChild(zoneChamps);
    racine.appendChild(UI.el("h2", { text: "Ta phrase", style: "margin:1rem 0 .5rem" }));
    racine.appendChild(resultat);
    racine.appendChild(UI.el(".btn-rangee", { style: "margin-top:.6rem" }, [
      UI.el("button.btn.ghost", { text: "Copier la phrase", onclick: function () { copier(resultat.textContent); } })
    ]));
    construire();
  }

  /* ---------- Module 3 — Correcteur simple ---------- */
  var HOMOPHONES = [["a", "à"], ["et", "est"], ["ou", "où"], ["son", "sont"], ["ces", "ses"], ["on", "ont"], ["la", "là"], ["ce", "se"]];

  function analyser(txt) {
    var f = [];
    if (/[ \t]{2,}/.test(txt)) f.push("Plusieurs espaces de suite.");
    if (/\s[,.]/.test(txt)) f.push("Une espace avant une virgule ou un point (à coller au mot).");
    if (/[,.][A-Za-zÀ-ÿ]/.test(txt)) f.push("Il manque une espace après une virgule ou un point.");
    var dup = txt.match(/\b([A-Za-zÀ-ÿ]+)\s+\1\b/i);
    if (dup) f.push("Mot répété : « " + dup[1] + " ».");
    var tr = txt.trim();
    if (tr && /^[a-zà-ÿ]/.test(tr)) f.push("La première lettre devrait être une majuscule.");
    if (tr && !/[.!?…]$/.test(tr)) f.push("Il manque un point à la fin.");
    HOMOPHONES.forEach(function (h) {
      var re = new RegExp("\\b(" + h[0] + "|" + h[1] + ")\\b", "i");
      if (re.test(txt)) f.push("Homophone à vérifier : « " + h[0] + " / " + h[1] + " » (les deux existent, choisis le bon).");
    });
    return f;
  }
  function nettoyer(txt) {
    var s = txt.replace(/[ \t]{2,}/g, " ").replace(/\s+([,.])/g, "$1").replace(/([,.])([A-Za-zÀ-ÿ])/g, "$1 $2");
    s = s.replace(/\b([A-Za-zÀ-ÿ]+)(\s+)\1\b/gi, "$1");
    s = s.replace(/(^\s*|[.!?…]\s+)([a-zà-ÿ])/g, function (_, p, c) { return p + c.toUpperCase(); });
    s = s.trim();
    if (s && !/[.!?…]$/.test(s)) s += ".";
    return s;
  }

  function moduleCorrecteur(racine) {
    var saisie = UI.textarea({ value: "le chat dort  sur le canapé il a froid", placeholder: "Colle ton texte ici…", style: "min-height:90px" });
    var liste = UI.el("ul.liste");
    var propre = UI.el("div", { style: "padding:.8rem;background:#dff0e4;border-radius:12px;white-space:pre-wrap" });

    function maj() {
      UI.vider(liste);
      var f = analyser(saisie.value);
      if (!f.length) liste.appendChild(UI.el("li.liste-item", { text: "Rien de suspect repéré. Bravo !" }));
      else f.forEach(function (m) { liste.appendChild(UI.el("li.liste-item", {}, [UI.el("span", { text: "⚠️ ", "aria-hidden": "true" }), document.createTextNode(m)])); });
      propre.textContent = nettoyer(saisie.value);
    }
    saisie.addEventListener("input", maj);

    racine.appendChild(UI.champ("Ton texte", saisie));
    racine.appendChild(UI.el("p.aide", { text: "Vérification locale et simple : elle repère des pièges fréquents, mais ne corrige pas tout. Le dernier mot te revient." }));
    racine.appendChild(UI.el("h2", { text: "Points à vérifier", style: "margin:1rem 0 .5rem" }));
    racine.appendChild(liste);
    racine.appendChild(UI.el("h2", { text: "Version nettoyée (espaces, majuscule, point)", style: "margin:1.2rem 0 .5rem" }));
    racine.appendChild(propre);
    racine.appendChild(UI.el(".btn-rangee", { style: "margin-top:.6rem" }, [
      UI.el("button.btn.ghost", { text: "Copier la version nettoyée", onclick: function () { copier(propre.textContent); } })
    ]));
    maj();
  }

  /* ---------- Module 4 — Clavier simplifié ---------- */
  function moduleClavier(racine) {
    var compo = UI.textarea({ placeholder: "Écris ici avec le clavier…", style: "min-height:90px;font-size:1.2rem" });
    var maj = { on: false };

    var rangees = [
      ["a", "b", "c", "d", "e", "f", "g"],
      ["h", "i", "j", "k", "l", "m", "n"],
      ["o", "p", "q", "r", "s", "t", "u"],
      ["v", "w", "x", "y", "z"],
      ["é", "è", "à", "ê", "ç", "â", "î", "ô", "ù"]
    ];

    var clavier = UI.el("div", { style: "margin-top:.6rem" });
    function touche(label, val, large) {
      return UI.el("button.btn.secondaire", {
        text: label,
        style: "min-width:" + (large ? "auto" : "44px") + ";height:48px;font-size:1.2rem;padding:0 " + (large ? "1rem" : ".4rem") + ";margin:2px",
        onclick: function () { inserer(compo, val()); }
      });
    }
    function dessinerClavier() {
      UI.vider(clavier);
      rangees.forEach(function (r) {
        var ligne = UI.el("div", { style: "display:flex;flex-wrap:wrap;justify-content:center" });
        r.forEach(function (l) {
          ligne.appendChild(touche(maj.on ? l.toUpperCase() : l, function () { return maj.on ? l.toUpperCase() : l; }));
        });
        clavier.appendChild(ligne);
      });
      var bas = UI.el("div", { style: "display:flex;flex-wrap:wrap;justify-content:center;margin-top:.2rem" });
      var btnMaj = UI.el("button.btn", { text: maj.on ? "Maj ●" : "Maj ○", style: "height:48px;margin:2px;padding:0 1rem", onclick: function () { maj.on = !maj.on; dessinerClavier(); } });
      bas.appendChild(btnMaj);
      bas.appendChild(touche("'", function () { return "'"; }, true));
      bas.appendChild(touche(",", function () { return ", "; }, true));
      bas.appendChild(touche(".", function () { return ". "; }, true));
      bas.appendChild(touche("Espace", function () { return " "; }, true));
      bas.appendChild(UI.el("button.btn.ghost", { text: "⌫ Effacer", style: "height:48px;margin:2px;padding:0 1rem", onclick: function () {
        var p = compo.selectionStart;
        if (p > 0) { compo.value = compo.value.slice(0, p - 1) + compo.value.slice(compo.selectionEnd); compo.selectionStart = compo.selectionEnd = p - 1; }
        compo.focus();
      }}));
      clavier.appendChild(bas);
    }
    dessinerClavier();

    racine.appendChild(UI.champ("Ce que j'écris", compo));
    racine.appendChild(UI.el(".btn-rangee", {}, [
      UI.el("button.btn.ghost", { text: "Copier", onclick: function () { copier(compo.value); } }),
      UI.el("button.btn.ghost", { text: "Tout effacer", onclick: function () { compo.value = ""; compo.focus(); } })
    ]));
    racine.appendChild(UI.el("p.aide", { text: "Grandes touches dans l'ordre de l'alphabet, plus les lettres accentuées." }));
    racine.appendChild(clavier);
  }

  /* ---------- Onglets ---------- */
  Boussole.registerTool({
    id: "aide-ecrire", groupe: "tnd", titre: "Aide à l'écriture", icone: "✍️",
    desc: "Banque de mots, phrases modèles, correcteur simple et clavier à grandes touches.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Aide à l'écriture", "Des coups de pouce pour écrire plus facilement. Tout reste sur cet appareil."));
      var onglets = [
        { id: "banque", label: "Banque de mots", rendu: moduleBanque },
        { id: "phrase", label: "Phrase modèle", rendu: moduleFrame },
        { id: "correcteur", label: "Correcteur simple", rendu: moduleCorrecteur },
        { id: "clavier", label: "Clavier simplifié", rendu: moduleClavier }
      ];
      var barre = UI.el(".btn-rangee", { role: "tablist", style: "flex-wrap:wrap;gap:.4rem;margin-bottom:1.1rem" });
      var corps = UI.el("div");
      function afficher(id) {
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
      afficher("banque");
    }
  });
})();
