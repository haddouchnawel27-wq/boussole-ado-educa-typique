/* ===========================================================================
   ÉTINCELLE — Module Orientation (étape FINALE du parcours)
   ---------------------------------------------------------------------------
   Fidèle au spec `docs/module-orientation-etincelle.md`.
   Ordre §7.6 : Portrait chinois (ET-06) → Intelligences (ET-01) →
   Intérêts RIASEC (ET-02) → Style d'apprentissage (ET-03) →
   Métacognition (ET-04, pont AD-03) → « Ma boussole d'orientation » (ET-05).

   Rails NON négociables tenus ici :
   • Jamais de mise en échec : « je ne sais pas encore » partout, feedback
     toujours positif, aucun écran « aucun résultat ».
   • Aucun verdict : RIASEC = socle sérieux présenté en FACETTES qui se
     combinent ; Gardner / styles = exploration LUDIQUE, préférences, jamais
     mesure ni identité (« conditions d'accès », pas « je suis visuel »).
   • Profil « éclaté » valorisé (plusieurs pics = richesse).
   • Restitution « Ma boussole » = 1re personne, PRIVÉE, au conditionnel ouvert
     (« semble actuellement », « tu pourrais explorer ») + UNE petite action.
   • Métacognition : on RELIT le coffre AD-03 (fenêtre d'or, commande fragile),
     on ne re-demande pas.
   • Ressources externes = liens que l'ado CHOISIT d'ouvrir, « plus tard, avec
     un adulte de confiance ». Aucun appel réseau automatique. 100 % local.
   • Partage uniquement via AD-11 (Centre de partage), jamais automatique.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  /* ---------- Contenu ---------- */

  // ET-06 · Portrait chinois (entrée ludique, tout optionnel)
  var PORTRAIT = [
    { id: "animal", emo: "🦊", lib: "Si j'étais un animal…", ph: "lequel ? et pourquoi ?" },
    { id: "lieu", emo: "🏞️", lib: "Si j'étais un lieu, un paysage…", ph: "lequel ? et pourquoi ?" },
    { id: "objet", emo: "🎒", lib: "Si j'étais un objet…", ph: "lequel ? et pourquoi ?" },
    { id: "pouvoir", emo: "✨", lib: "Si j'avais un super-pouvoir…", ph: "lequel ? et pourquoi ?" },
    { id: "metier", emo: "🎬", lib: "Un métier qui me fait rêver (même impossible)…", ph: "lequel ? et pourquoi ?" }
  ];

  // ET-01 · Intelligences multiples (Gardner) — LUDIQUE
  var INTEL = [
    { id: "logicomath", emo: "🧩", t: "Comprendre comment marchent les choses, les chiffres, les énigmes" },
    { id: "linguistique", emo: "✍️", t: "Jouer avec les mots : lire, raconter, expliquer, écrire" },
    { id: "interperso", emo: "🤝", t: "Sentir les autres, être à l'aise en groupe, comprendre les gens" },
    { id: "intraperso", emo: "🧭", t: "Me connaître, comprendre ce que je ressens et pourquoi" },
    { id: "kinesthesique", emo: "🛠️", t: "Bouger, bricoler, faire avec mes mains, le sport" },
    { id: "musicale", emo: "🎵", t: "Les sons, les rythmes, la musique" },
    { id: "spatiale", emo: "🎨", t: "Les images, l'espace : dessiner, m'orienter, imaginer en 3D" },
    { id: "naturaliste", emo: "🌿", t: "La nature, les animaux, observer le vivant" }
  ];
  var INTEL_LIB = {
    logicomath: "comprendre & résoudre", linguistique: "les mots", interperso: "le contact",
    intraperso: "te connaître", kinesthesique: "faire avec tes mains", musicale: "les sons & rythmes",
    spatiale: "les images & l'espace", naturaliste: "le vivant & la nature"
  };

  // ET-02 · Intérêts RIASEC (Holland) — SOCLE validé
  var RIASEC = [
    { id: "realiste", lettre: "R", lib: "Réaliste", t: "Réparer, construire, bricoler, travailler dehors ou avec des machines" },
    { id: "investigateur", lettre: "I", lib: "Investigateur", t: "Chercher, comprendre, analyser, résoudre des problèmes" },
    { id: "artistique", lettre: "A", lib: "Artistique", t: "Créer, imaginer, t'exprimer — l'art sous toutes ses formes" },
    { id: "social", lettre: "S", lib: "Social", t: "Aider, accompagner, transmettre, être avec les autres" },
    { id: "entreprenant", lettre: "E", lib: "Entreprenant", t: "Convaincre, organiser, entraîner, lancer des projets" },
    { id: "conventionnel", lettre: "C", lib: "Conventionnel", t: "Organiser, classer, la précision, les choses bien rangées" }
  ];
  var RIASEC_LIB = {
    realiste: "Réaliste (faire, réparer)", investigateur: "Investigateur (chercher, comprendre)",
    artistique: "Artistique (créer, imaginer)", social: "Social (aider, transmettre)",
    entreprenant: "Entreprenant (convaincre, lancer)", conventionnel: "Conventionnel (organiser, préciser)"
  };
  // Familles de métiers (généralistes, au pluriel, jamais « le » métier)
  var UNIVERS = {
    realiste: ["les métiers manuels et techniques", "le travail de terrain, dehors", "l'artisanat"],
    investigateur: ["les sciences", "la santé", "l'informatique et le numérique", "la recherche"],
    artistique: ["l'art et le design", "la création", "la communication"],
    social: ["l'éducation", "le soin et l'aide aux autres", "le social"],
    entreprenant: ["le commerce", "l'entrepreneuriat", "le marketing et la communication"],
    conventionnel: ["la gestion et la finance", "le droit", "l'organisation et l'administration"]
  };

  // ET-03 · Style d'apprentissage — « conditions d'accès », pas une identité
  var COMPRIS = ["quand j'écoute", "quand je vois / on me montre", "quand j'essaie moi-même",
    "quand j'en parle", "quand je lis", "quand je note ou dessine"];
  var CONCENTRE = ["au calme", "avec un fond sonore / musique", "en pouvant bouger un peu",
    "avec un cadre clair", "avec de la liberté", "sur des temps courts"];

  // ET-04 · Métacognition — mise en situation « porte d'entrée »
  var PORTE = [
    { v: "notice", t: "Je lis la notice, étape par étape" },
    { v: "video", t: "Je regarde une vidéo ou les images" },
    { v: "essai", t: "J'essaie direct, quitte à tâtonner" },
    { v: "montre", t: "Je demande à quelqu'un de me montrer" }
  ];
  var PORTE_LIB = {
    notice: "en suivant les étapes écrites", video: "en voyant / en images",
    essai: "en essayant par toi-même", montre: "en te faisant montrer"
  };

  // Pont AD-03 : libellés des fenêtres d'or
  var FEN = { matin: "le matin", midi: "en fin de matinée", aprem: "l'après-midi", soir: "le soir" };

  /* ---------- État ---------- */
  var B = null, chargé = false, bilanAD3 = null;
  function vide() {
    return { portrait: {}, intel: {}, riasec: {}, compris: [], concentre: [],
      besoinBlocage: "", porte: null, action: "" };
  }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.portrait = d.portrait && typeof d.portrait === "object" ? d.portrait : {};
      b.intel = d.intel && typeof d.intel === "object" ? d.intel : {};
      b.riasec = d.riasec && typeof d.riasec === "object" ? d.riasec : {};
      b.compris = Array.isArray(d.compris) ? d.compris : [];
      b.concentre = Array.isArray(d.concentre) ? d.concentre : [];
      b.besoinBlocage = d.besoinBlocage || "";
      b.porte = d.porte || null;
      b.action = d.action || "";
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("orientation-brouillon", B); }

  /* ---------- Composants ---------- */
  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }
  function echelle15(grp, id, cur) {
    var s = "";
    for (var v = 1; v <= 5; v++) {
      s += '<button class="pip" role="button" aria-pressed="' + (cur === v) + '" data-et="pip" data-grp="' + grp + '" data-key="' + id + '" data-val="' + v + '" aria-label="' + v + ' sur 5">' +
        '<span class="lib" style="font-size:1rem;font-weight:800;color:var(--texte)">' + v + '</span></button>';
    }
    return '<div class="echelle echelle--mood" role="group">' + s + '</div>';
  }
  function itemNote(grp, item) {
    var o = (grp === "intel" ? B.intel : B.riasec);
    var cur = o[item.id];
    var pas = cur === "pas";
    var tete = (item.emo ? item.emo + " " : "") + (item.lettre ? "" : "") + esc(item.t || item.lib);
    return '<div class="q-bloc" style="margin:1.05rem 0"><div class="q-titre" style="font-size:1rem;font-weight:600">' +
      tete + (pas ? ' <span class="mini-note">· je ne sais pas encore</span>' : '') + '</div>' +
      echelle15(grp, item.id, typeof cur === "number" ? cur : -1) +
      '<button class="lien-doux" data-et="pas" data-grp="' + grp + '" data-key="' + item.id + '" style="font-size:0.8rem;margin-top:0.3rem">je ne sais pas encore</button></div>';
  }
  function multi(grp, options, arr) {
    return '<div class="jetons" role="group">' + options.map(function (o) {
      return '<button class="jeton" role="button" aria-pressed="' + (arr.indexOf(o) !== -1) + '" data-et="multi" data-grp="' + grp + '" data-val="' + esc(o) + '">' + esc(o) + '</button>';
    }).join("") + '</div>';
  }
  function legende(txt) { return '<p class="mini-note" style="margin-bottom:0.5rem">' + txt + '</p>'; }

  /* ---------- Calculs (facettes, jamais verdict) ---------- */
  function classement(o) {
    // renvoie [{id, v}] triés décroissant, uniquement valeurs numériques
    var arr = [];
    for (var k in o) { if (typeof o[k] === "number") arr.push({ id: k, v: o[k] }); }
    arr.sort(function (a, b) { return b.v - a.v; });
    return arr;
  }
  function topFacettes(o, seuil, max) {
    return classement(o).filter(function (x) { return x.v >= (seuil || 4); }).slice(0, max || 3);
  }

  /* ===========================================================================
     Écran — Intro
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (Object.keys(B.intel).length || Object.keys(B.riasec).length ||
      Object.keys(B.portrait).length || B.compris.length);
    return entete("L'étape d'après · Orientation", "🧭 Ma boussole d'orientation",
      "La dernière étape : maintenant que tu te connais mieux, on regarde tout doucement où tu as envie d'aller.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">Comment on va faire</span>' +
        '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.45rem">' +
        '<li>🎲 On commence en douceur (un petit portrait chinois), puis on explore ce qui t\'allume.</li>' +
        '<li>🌈 <strong>Aucun test, aucune note, aucun verdict.</strong> On cherche des <strong>pistes</strong>, pas « le » métier.</li>' +
        '<li>⏸️ « <strong>Je ne sais pas encore</strong> » est possible partout. Tu peux t\'arrêter et reprendre quand tu veux.</li>' +
        '<li>🔒 Tout reste <strong>privé</strong>, sur cet appareil. Tu partages seulement si tu le décides.</li>' +
        '</ul></div>' +
        '<div class="encadre lavande"><p class="mini-note">Un profil qui « ne rentre pas dans une case », avec des envies très différentes, ce n\'est pas un problème : <strong>c\'est une richesse</strong>. On ne te rangera nulle part de force.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-et="nav" data-to="et-portrait">Reprendre →</button><button class="btn btn-ligne" data-et="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-et="nav" data-to="et-portrait">Commencer →</button>') +
      '</div>';
  }

  /* ===========================================================================
     ET-06 — Portrait chinois (entrée ludique)
     =========================================================================== */
  function renderPortrait() {
    var champs = PORTRAIT.map(function (p) {
      return '<div class="carte"><label class="q-titre" for="pt-' + p.id + '" style="display:block;margin-bottom:0.4rem">' +
        p.emo + ' ' + esc(p.lib) + '</label>' +
        '<textarea id="pt-' + p.id + '" class="saisie" rows="2" data-pt="' + p.id + '" placeholder="' + esc(p.ph) + '">' + esc(B.portrait[p.id] || "") + '</textarea></div>';
    }).join("");
    return entete("Orientation · 1 sur 6", "🎲 Portrait chinois", "Pour s'échauffer, sans se prendre la tête. Il n'y a pas de bonne réponse — laisse venir ce qui te vient. Tu peux tout laisser vide.") +
      champs +
      '<div class="encadre beige"><p class="mini-note">Ces réponses restent à toi. Elles servent juste à ouvrir des portes — jamais à te définir.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-et="save-go" data-to="et-intel">Continuer →</button>' +
        '<button class="btn btn-doux" data-et="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  /* ===========================================================================
     ET-01 — Intelligences multiples (ludique)
     =========================================================================== */
  function renderIntel() {
    return entete("Orientation · 2 sur 6", "🌈 Mes façons d'être intelligent·e", "Il y a plein de manières d'être intelligent·e — pas seulement les notes à l'école. On explore les tiennes, juste pour mieux te connaître.") +
      '<div class="carte" style="background:transparent;box-shadow:none;padding:0">' +
        legende("Sur chaque ligne : <strong>1</strong> = ce n\'est pas trop mon truc · <strong>5</strong> = c\'est carrément mon truc. C\'est un jeu, pas une mesure.") + '</div>' +
      '<div class="carte">' + INTEL.map(function (it) { return itemNote("intel", it); }).join("") + '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-et="nav" data-to="et-portrait">← Retour</button>' +
        '<button class="btn btn-plein" data-et="save-go" data-to="et-riasec">Continuer →</button>' +
      '</div>';
  }

  /* ===========================================================================
     ET-02 — Intérêts RIASEC (socle validé)
     =========================================================================== */
  function renderRiasec() {
    return entete("Orientation · 3 sur 6", "🧲 Ce qui m'attire", "Six grandes familles d'activités. Pas « es-tu doué·e » — juste : est-ce que ça t'attire, est-ce que tu t'y sens bien ?") +
      '<div class="carte" style="background:transparent;box-shadow:none;padding:0">' +
        legende("<strong>1</strong> = ça ne m\'attire pas · <strong>5</strong> = ça m\'attire beaucoup. Plusieurs familles peuvent te parler à la fois, c\'est même fréquent.") + '</div>' +
      '<div class="carte">' + RIASEC.map(function (it) {
        return itemNote("riasec", { id: it.id, t: it.lib + " — " + it.t });
      }).join("") + '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-et="nav" data-to="et-intel">← Retour</button>' +
        '<button class="btn btn-plein" data-et="save-go" data-to="et-apprend">Continuer →</button>' +
      '</div>';
  }

  /* ===========================================================================
     ET-03 — Style d'apprentissage (conditions d'accès)
     =========================================================================== */
  function renderApprend() {
    return entete("Orientation · 4 sur 6", "🔑 Comment j'apprends le mieux", "Pas une étiquette (« je suis comme ci »), plutôt tes conditions d'accès : ce qui t'aide à comprendre et à te concentrer.") +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">Je comprends le mieux…</h2>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Plusieurs réponses possibles.</p>' +
        multi("compris", COMPRIS, B.compris) + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">Pour me concentrer, j\'ai besoin…</h2>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Plusieurs réponses possibles.</p>' +
        multi("concentre", CONCENTRE, B.concentre) + '</div>' +
      '<div class="encadre beige"><p class="mini-note">Ce ne sont pas des cases fixes : ça peut changer selon le moment et la matière. C\'est ton <strong>mode d\'emploi</strong>, pas ta définition.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-et="nav" data-to="et-riasec">← Retour</button>' +
        '<button class="btn btn-plein" data-et="save-go" data-to="et-metacog">Continuer →</button>' +
      '</div>';
  }

  /* ===========================================================================
     ET-04 — Métacognition (pont AD-03)
     =========================================================================== */
  function renderMetacog() {
    var pontHTML = "";
    if (bilanAD3 && (bilanAD3.fenetre || bilanAD3.fragile)) {
      var L = [];
      if (bilanAD3.fenetre && FEN[bilanAD3.fenetre]) L.push('tu es souvent le plus disponible <strong>' + FEN[bilanAD3.fenetre] + '</strong>');
      if (bilanAD3.fragile) L.push('ta commande la plus fragile en ce moment, c\'est <strong>« ' + esc(bilanAD3.fragile) + ' »</strong>');
      pontHTML = '<div class="encadre ciel"><span class="titre">Ce que ton « Mode d\'emploi de Moi » disait déjà</span>' +
        '<p>D\'après ton bilan (AD-03), ' + L.join(", et ") + '. On s\'en resert ici — pas besoin de le refaire.</p></div>';
    } else {
      pontHTML = '<div class="encadre beige"><p class="mini-note">Astuce : si tu fais d\'abord « Mode d\'emploi de Moi » (AD-03), cette étape se personnalise toute seule avec ce que tu y as découvert. Mais ce n\'est pas obligatoire.</p></div>';
    }

    var porteChips = '<div class="jetons" role="group">' + PORTE.map(function (p) {
      var on = B.porte === p.v;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-et="porte" data-val="' + p.v + '">' + esc(p.t) + '</button>';
    }).join("") +
      '<button class="jeton" role="button" aria-pressed="' + (B.porte === "inconnu") + '" data-et="porte" data-val="inconnu">Je ne sais pas encore</button></div>';

    return entete("Orientation · 5 sur 6", "🧠 Comment je fonctionne", "La partie la plus utile : pas seulement ce que tu aimes, mais comment ton cerveau s'y prend. Ça aide à trouver des filières faites pour toi.") +
      pontHTML +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">🪑 Petite mise en situation</h2>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Tu dois monter un meuble tout neuf. Spontanément, tu fais quoi ?</p>' +
        porteChips +
        '<p class="mini-note" style="margin-top:0.6rem">Ça révèle ta « porte d\'entrée » : la façon dont tu comprends le plus facilement. Aucune n\'est meilleure qu\'une autre.</p></div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="et-blocage" style="display:block;margin-bottom:0.4rem">Quand je bloque sur quelque chose, ce qui m\'aide le plus, c\'est… <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">On ne parle pas de « défaut » : juste de ce dont tu as <strong>besoin</strong> pour repartir.</p>' +
        '<textarea id="et-blocage" class="saisie" rows="2" placeholder="Ce qui m\'aide quand je coince…">' + esc(B.besoinBlocage) + '</textarea></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-et="nav" data-to="et-apprend">← Retour</button>' +
        '<button class="btn btn-magenta" data-et="finaliser">✨ Voir ma boussole</button>' +
      '</div>';
  }

  /* ===========================================================================
     ET-05 — « Ma boussole d'orientation » (restitution)
     =========================================================================== */
  function barre(pct, coul) {
    return '<div class="score-bar-bg" style="height:9px;margin:0.2rem 0 0.7rem"><div class="score-bar-fill" style="width:' + pct + '%;background:' + (coul || "var(--sarcelle)") + '"></div></div>';
  }

  function renderBoussole() {
    // 1) Ce qui m'allume : intelligences hautes + portrait
    var intelTop = topFacettes(B.intel, 4, 3);
    var allumeHTML;
    if (intelTop.length) {
      var libs = intelTop.map(function (x) { return "<strong>" + esc(INTEL_LIB[x.id] || x.id) + "</strong>"; });
      allumeHTML = '<p>En ce moment, ce qui a l\'air de t\'allumer le plus, c\'est du côté de ' + libs.join(", ") + '. Ce sont des <strong>forces</strong> : des points d\'appui, pas des cases.</p>';
    } else {
      allumeHTML = '<p>Tu n\'as pas encore fait ressortir « une » façon dominante — et c\'est parfaitement ok. Ça se découvre en essayant des choses. Tes réponses restent précieuses telles quelles.</p>';
    }
    var portraitBits = [];
    if ((B.portrait.animal || "").trim()) portraitBits.push("un animal");
    if ((B.portrait.pouvoir || "").trim()) portraitBits.push("un super-pouvoir");
    if ((B.portrait.metier || "").trim()) portraitBits.push("un métier de rêve");
    var portraitHTML = portraitBits.length
      ? '<p class="mini-note">Ton portrait chinois t\'a fait choisir ' + esc(portraitBits.join(", ")) + '. Relis tes « pourquoi » : ils parlent de toi, souvent mieux qu\'un test.</p>'
      : "";

    // 2) Mes couleurs d'intérêts : RIASEC en facettes (barres)
    var riClass = classement(B.riasec);
    var couleursHTML;
    if (riClass.length) {
      var maxV = riClass[0].v;
      couleursHTML = riClass.map(function (x) {
        var pct = Math.round((x.v / 5) * 100);
        var fort = x.v === maxV;
        return '<div style="margin-bottom:0.15rem"><div style="display:flex;justify-content:space-between;font-size:0.9rem;font-weight:600">' +
          '<span>' + esc(RIASEC_LIB[x.id] || x.id) + '</span><span class="mini-note">' + x.v + '/5</span></div>' +
          barre(pct, fort ? "var(--magenta)" : "var(--sarcelle)") + '</div>';
      }).join("");
      couleursHTML = '<p class="q-aide" style="margin-bottom:0.6rem">Ce ne sont pas un classement-verdict : ce sont des <strong>facettes qui se combinent</strong>. Tu es sûrement un mélange.</p>' + couleursHTML;
    } else {
      couleursHTML = '<p>Tu as choisi « je ne sais pas encore » pour les familles d\'intérêts — tu pourras y revenir. Explorer, c\'est déjà avancer.</p>';
    }

    // 3) Comment j'apprends : compris/concentre + pont AD-03 + porte
    var apprBits = [];
    if (B.compris.length) apprBits.push('tu comprends le mieux <strong>' + esc(B.compris.slice(0, 3).join(", ")) + '</strong>');
    if (B.porte && B.porte !== "inconnu" && PORTE_LIB[B.porte]) apprBits.push('face au concret, ta porte d\'entrée est <strong>' + esc(PORTE_LIB[B.porte]) + '</strong>');
    if (B.concentre.length) apprBits.push('pour te concentrer, tu as besoin <strong>' + esc(B.concentre.slice(0, 3).join(", ")) + '</strong>');
    var apprHTML = apprBits.length ? '<p>' + apprBits.join(". ").replace(/^./, function (c) { return c.toUpperCase(); }) + '.</p>' : '<p class="mini-note">Tu n\'as pas encore précisé comment tu apprends le mieux — c\'est une piste à explorer, ça change tout pour choisir une filière.</p>';
    var pontHTML = "";
    if (bilanAD3 && (bilanAD3.fenetre || bilanAD3.fragile)) {
      var P = [];
      if (bilanAD3.fenetre && FEN[bilanAD3.fenetre]) P.push('tu es plus disponible <strong>' + FEN[bilanAD3.fenetre] + '</strong>');
      if (bilanAD3.fragile) P.push('ta commande fragile, c\'est <strong>« ' + esc(bilanAD3.fragile) + ' »</strong>');
      pontHTML = '<p class="mini-note">D\'après ton « Mode d\'emploi de Moi » : ' + P.join(", et ") + '. 👉 Les formats qui reposent beaucoup sur ce point fragile risquent de te coûter — privilégie ceux qui te laissent <strong>enregistrer, relire, manipuler, avancer à ton rythme</strong>.</p>';
    }
    var blocageHTML = (B.besoinBlocage || "").trim()
      ? '<p class="mini-note">Quand tu bloques, ce qui t\'aide : <em>' + esc(B.besoinBlocage.trim()) + '</em>. C\'est un <strong>besoin</strong> légitime — pas un défaut. Garde-le en tête pour choisir un environnement qui te le permet.</p>'
      : "";

    // 4) Des univers à explorer (pluriel, « à explorer »)
    var uniTop = topFacettes(B.riasec, 3, 3);
    var univers = [];
    uniTop.forEach(function (x) { (UNIVERS[x.id] || []).forEach(function (u) { if (univers.indexOf(u) === -1) univers.push(u); }); });
    univers = univers.slice(0, 6);
    var universHTML = univers.length
      ? '<p>À ta place, je regarderais du côté de : <strong>' + univers.map(esc).join("</strong>, <strong>") + '</strong>. Au pluriel, et toujours « <strong>à explorer</strong> » — pas « c\'est ça et rien d\'autre ».</p>'
      : '<p>On n\'a pas encore assez d\'éléments pour proposer des univers — reviens quand tu auras exploré les familles d\'intérêts. Rien ne presse.</p>';

    return entete("Orientation · Ma boussole", "🧭 Ma boussole d'orientation", "Une photo de maintenant, à la première personne. À toi, et à personne d'autre.") +
      '<div class="carte"><div class="encadre lavande" style="margin:0"><span class="titre">À lire d\'abord</span>' +
        '<p>Ce n\'est <strong>pas</strong> un verdict sur « le » métier de ta vie. C\'est une boussole : elle montre des <strong>directions possibles</strong>, que tu es libre d\'explorer, à ton rythme. Tout peut évoluer — et c\'est normal.</p></div></div>' +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">✨ Ce qui m\'allume</h2>' + allumeHTML + portraitHTML + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">🎨 Mes couleurs d\'intérêts</h2>' + couleursHTML + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">🔑 Comment j\'apprends le mieux</h2>' + apprHTML + pontHTML + blocageHTML + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">🌍 Des univers à explorer</h2>' + universHTML + '</div>' +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.3rem">👣 Ma prochaine petite action</h2>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">UNE seule, réaliste, cette semaine (ex. « regarder tel univers sur Onisep avec un adulte »).</p>' +
        '<textarea id="et-action" class="saisie" rows="2" placeholder="Ma petite action…">' + esc(B.action) + '</textarea></div>' +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.3rem">🔎 À explorer plus tard (avec un adulte de confiance)</h2>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Des ressources sérieuses pour aller plus loin — l\'app ne t\'y envoie jamais toute seule, c\'est toi qui choisis d\'y aller.</p>' +
        '<ul style="margin:0;padding-left:1.1rem;display:flex;flex-direction:column;gap:0.35rem;font-size:0.95rem">' +
        '<li><strong>Onisep</strong> — métiers &amp; formations (service public).</li>' +
        '<li><strong>L\'Étudiant</strong> — fiches métiers, tests, orientation.</li>' +
        '<li><strong>Ton avenir / CIO</strong> — un conseiller d\'orientation près de chez toi.</li>' +
        '</ul>' +
        '<p class="mini-note" style="margin-top:0.5rem">Liste indicative (à revérifier avec un adulte). Ce module te <strong>prépare</strong> à ces ressources — il ne les remplace pas.</p></div>' +

      '<div class="encadre menthe"><p>Un profil aux envies variées n\'est pas « éparpillé » : c\'est une <strong>palette</strong>. Tu choisis si tu veux partager cette boussole, et avec qui — depuis le <strong>Centre de partage</strong>.</p></div>' +

      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-et="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-et="imprimer">🖨️ Garder en PDF</button>' +
        '<button class="btn btn-doux" data-et="refaire">↺ Recommencer</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-et]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    root.querySelectorAll('[data-pt]').forEach(function (t) {
      t.addEventListener("input", function () { B.portrait[t.getAttribute("data-pt")] = t.value; });
    });
    var bl = document.getElementById("et-blocage");
    if (bl) bl.addEventListener("input", function () { B.besoinBlocage = bl.value; });
    var ac = document.getElementById("et-action");
    if (ac) ac.addEventListener("input", function () { B.action = ac.value; });
  }

  function action(b) {
    var type = b.getAttribute("data-et");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { enregistrerNotice(); sauver(); toast("Ta boussole est gardée 🧭"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("orientation-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("orientation-brouillon", B); go("et-portrait"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); enregistrerNotice(); go("et-boussole"); return; }

    if (type === "pip") {
      var o = b.getAttribute("data-grp") === "intel" ? B.intel : B.riasec;
      o[b.getAttribute("data-key")] = parseInt(b.getAttribute("data-val"), 10); render(); return;
    }
    if (type === "pas") {
      var o2 = b.getAttribute("data-grp") === "intel" ? B.intel : B.riasec;
      o2[b.getAttribute("data-key")] = "pas"; render(); return;
    }
    if (type === "multi") {
      var arr = b.getAttribute("data-grp") === "compris" ? B.compris : B.concentre;
      var v = b.getAttribute("data-val"), i = arr.indexOf(v);
      if (i === -1) arr.push(v); else arr.splice(i, 1);
      render(); return;
    }
    if (type === "porte") {
      var pv = b.getAttribute("data-val");
      B.porte = (B.porte === pv ? null : pv); render(); return;
    }
  }

  function enregistrerNotice() {
    var intelTop = topFacettes(B.intel, 4, 3).map(function (x) { return INTEL_LIB[x.id] || x.id; });
    var riTop = topFacettes(B.riasec, 3, 3).map(function (x) { return x.id; });
    var univers = [];
    riTop.forEach(function (id) { (UNIVERS[id] || []).forEach(function (u) { if (univers.indexOf(u) === -1) univers.push(u); }); });
    Vault.ecrire("orientation-notice", {
      date: MEM.auj(),
      allume: intelTop,
      couleurs: riTop.map(function (id) { return RIASEC_LIB[id] || id; }),
      apprend: B.compris.slice(0, 3),
      porte: B.porte && PORTE_LIB[B.porte] ? PORTE_LIB[B.porte] : null,
      univers: univers.slice(0, 6),
      action: (B.action || "").trim() || null
    });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("orientation-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
    Vault.lire("bilan-notice").then(function (d) { bilanAD3 = d || null; }).catch(function () { bilanAD3 = null; });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("etincelle", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("et-portrait", { render: renderPortrait, bind: bindCommun });
    MEM.register("et-intel", { render: renderIntel, bind: bindCommun });
    MEM.register("et-riasec", { render: renderRiasec, bind: bindCommun });
    MEM.register("et-apprend", { render: renderApprend, bind: bindCommun });
    MEM.register("et-metacog", { render: renderMetacog, bind: bindCommun });
    MEM.register("et-boussole", { render: renderBoussole, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
