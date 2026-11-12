/* ===========================================================================
   AD-03 — « Mode d'emploi de Moi » : le bilan métacognitif (V1)
   ---------------------------------------------------------------------------
   Fidèle au DOSSIER v0.2 (Nawel — Educa Typique). Périmètre V1 :
   Volet 1 « Où j'en suis » + Volet 2 « Mon pilotage » + la Notice (1re personne).
   Garde-fous tenus : ce n'est pas un test · pas de bonne réponse · « je passe »
   sur chaque item · aucune étiquette (« en ce moment », jamais « je suis ») ·
   l'ado voit sa Notice avant tout adulte · 100 % local et chiffré.
   Les items sont formulés à la 1re personne ; certains sont inversés au calcul
   (l'ado ne voit jamais cette mécanique).
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  /* ---------- Contenu (items du DOSSIER v0.2) ---------- */
  var VOLET1 = {
    titre: "Où j'en suis",
    sous: "Mon élan, mon regard sur moi, mes appuis.",
    blocs: [
      { nom: "Mon élan", dim: "elan", items: [
        { id: "e1", t: "Je sais pourquoi je fais ce que je fais en cours." },
        { id: "e2", t: "J'ai des objectifs qui sont vraiment les miens, pas seulement ceux qu'on attend de moi." },
        { id: "e3", t: "Il y a des moments où j'ai du plaisir à apprendre quelque chose." },
        { id: "e4", t: "Quand je commence un travail, je vais jusqu'au bout." },
        { id: "e5", t: "Je remets à plus tard des choses que je pourrais faire maintenant.", inv: true }
      ] },
      { nom: "Mon regard sur moi", dim: "regard", items: [
        { id: "r1", t: "Quand je réussis quelque chose, je me dis que c'est grâce à moi." },
        { id: "r2", t: "Quand je rate, je me parle comme je parlerais à un ami." },
        { id: "r3", t: "Je vois que je progresse, même un peu." },
        { id: "r4", t: "Ce que je sais bien faire, je suis capable de le nommer." },
        { id: "r5", t: "Je me sens capable d'y arriver si on me laisse le temps." },
        { id: "r6", t: "Je me dis souvent que je suis nul.", inv: true }
      ] },
      { nom: "Mes appuis", dim: "appuis", items: [
        { id: "p1", t: "Je me sens à ma place dans mon groupe, ma classe." },
        { id: "p2", t: "Dans ma journée, il y a des choses que je choisis vraiment." },
        { id: "p3", t: "Il y a au moins un adulte à qui je peux dire que je galère." },
        { id: "p4", t: "Je sais ce qui compte vraiment pour moi dans la vie." }
      ] }
    ]
  };

  var ENERGIE = [
    { k: "matin", lib: "Le matin (jusqu'à 10 h)" },
    { k: "midi", lib: "De 10 h à midi" },
    { k: "aprem", lib: "De 14 h à 16 h" },
    { k: "soir", lib: "Le soir (18 h-20 h)" }
  ];
  var ATT_DUREE = ["moins de 5 min", "10 min", "20 min", "30 min", "45 min et plus"];
  var ATT_SORT = ["une notification", "le bruit", "mes propres pensées", "la faim", "l'ennui", "quelqu'un qui parle"];
  var ATT_RAMENE = ["bouger", "boire", "changer de matière", "un minuteur", "quelqu'un à côté", "rien ne marche"];
  var ATT_CONSCIENCE = ["tout de suite", "après quelques minutes", "très tard", "jamais, c'est quelqu'un qui me le dit"];

  var COMMANDES = [
    { id: "c1", t: "Je m'y mets sans qu'on ait besoin de me le répéter.", simple: "démarrer" },
    { id: "c2", t: "Quand on me donne une consigne en trois étapes, je retiens tout.", simple: "garder les consignes en tête" },
    { id: "c3", t: "Je retrouve mes affaires quand j'en ai besoin.", simple: "retrouver mes affaires" },
    { id: "c4", t: "Je sais par quoi commencer devant un gros travail.", simple: "savoir par quoi commencer" },
    { id: "c5", t: "Quand le plan change, je m'adapte.", simple: "m'adapter quand le plan change" },
    { id: "c6", t: "Je réponds ou j'agis avant d'avoir réfléchi.", simple: "réfléchir avant d'agir", inv: true },
    { id: "c7", t: "Je relis mon travail avant de le rendre.", simple: "me relire" },
    { id: "c8", t: "Quand je bloque, je change de stratégie au lieu d'insister.", simple: "changer de stratégie" },
    { id: "c9", t: "J'estime plutôt bien le temps que va me prendre un travail.", simple: "estimer le temps" },
    { id: "c10", t: "Je découpe les gros travaux en plus petits morceaux.", simple: "découper les gros travaux" }
  ];

  var STRESS = [
    { id: "s1", t: "Je stresse quand je ne maîtrise pas ce qui se passe.", lib: "ne pas maîtriser ce qui se passe", parade: "reprendre une petite part de contrôle — ce que je peux décider, même minuscule." },
    { id: "s2", t: "Je stresse quand je ne sais pas à l'avance comment ça va se passer.", lib: "ne pas savoir à l'avance comment ça va se passer", parade: "me faire décrire le déroulé à l'avance, étape par étape." },
    { id: "s3", t: "Je stresse quand c'est nouveau, quand je ne l'ai jamais fait.", lib: "la nouveauté", parade: "faire une première fois « pour de faux », sans enjeu." },
    { id: "s4", t: "Je stresse quand j'ai peur d'avoir l'air nul devant les autres.", lib: "le regard des autres", parade: "préparer une phrase de secours, et viser « fait » plutôt que « parfait »." }
  ];

  var CARBURANT = [
    { id: "z1", t: "Je m'endors facilement le soir." },
    { id: "z2", t: "Je me réveille reposé le matin." },
    { id: "z3", t: "J'ai un écran dans la main dans l'heure qui précède mon endormissement.", inv: true }
  ];
  var TEL = ["dans ma main", "sur le bureau", "dans la pièce mais loin", "dans une autre pièce"];

  /* ---------- État en mémoire ---------- */
  var B = null;
  var chargé = false;

  function vide() {
    return { v1: {}, v2: { energie: {}, att: { sort: [], ramene: [] }, cmd: {}, stress: {}, carb: {} } };
  }
  function assainir(d) {
    var b = vide();
    if (!d || typeof d !== "object") return b;
    if (d.v1) b.v1 = d.v1;
    if (d.v2) {
      b.v2.energie = d.v2.energie || {};
      b.v2.cmd = d.v2.cmd || {};
      b.v2.stress = d.v2.stress || {};
      b.v2.carb = d.v2.carb || {};
      b.v2.att = { sort: (d.v2.att && d.v2.att.sort) || [], ramene: (d.v2.att && d.v2.att.ramene) || [],
        duree: d.v2.att && d.v2.att.duree, conscience: d.v2.att && d.v2.att.conscience };
    }
    return b;
  }
  function sauverBrouillon() { if (B) Vault.ecrire("bilan-brouillon", B); }

  /* ---------- Rendu des composants ---------- */
  function pip05(grp, key, cur) {
    var pips = "";
    for (var v = 0; v <= 5; v++) {
      var on = cur === v;
      pips += '<button class="pip" role="button" aria-pressed="' + on + '" data-a3="pip" data-grp="' + grp + '" data-key="' + key + '" data-val="' + v + '" aria-label="' + v + ' sur 5">' +
        '<span class="lib" style="font-size:1rem;font-weight:800;color:var(--texte)">' + v + '</span></button>';
    }
    return '<div class="echelle" role="group">' + pips + '</div>';
  }
  function itemEchelle(grp, item) {
    var cur = obj(grp)[item.id];
    var passee = cur === "passe";
    return '<div class="q-bloc" style="margin:1.1rem 0">' +
      '<div class="q-titre" style="font-size:1rem;font-weight:600">' + esc(item.t) +
      (passee ? ' <span class="mini-note">· passée</span>' : '') + '</div>' +
      pip05(grp, item.id, typeof cur === "number" ? cur : -1) +
      '<button class="lien-doux" data-a3="passe" data-grp="' + grp + '" data-key="' + item.id + '" style="font-size:0.8rem;margin-top:0.3rem">je passe cette question</button>' +
      '</div>';
  }
  function jetonsSingle(grp, key, options, cur) {
    return '<div class="jetons" role="group">' + options.map(function (o) {
      var on = cur === o;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a3="single" data-grp="' + grp + '" data-key="' + key + '" data-val="' + esc(o) + '">' + esc(o) + '</button>';
    }).join("") + '</div>';
  }
  function jetonsMulti(grp, key, options, arr) {
    return '<div class="jetons" role="group">' + options.map(function (o) {
      var on = arr.indexOf(o) !== -1;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a3="multi" data-grp="' + grp + '" data-key="' + key + '" data-val="' + esc(o) + '">' + esc(o) + '</button>';
    }).join("") + '</div>';
  }
  function obj(grp) {
    switch (grp) {
      case "v1": return B.v1;
      case "energie": return B.v2.energie;
      case "cmd": return B.v2.cmd;
      case "stress": return B.v2.stress;
      case "carb": return B.v2.carb;
      default: return {};
    }
  }
  function legende05() {
    return '<p class="mini-note" style="margin-bottom:0.5rem">Sur chaque phrase : <strong>0</strong> = pas du tout moi · <strong>5</strong> = carrément moi. Il n\'y a pas de bonne réponse.</p>';
  }
  function entete(rubrique, titre, intro) {
    return '<div class="entete-ecran">' +
      '<div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rubrique) + '</span>' +
      '<h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }

  /* ===========================================================================
     ÉCRAN — Intro
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (Object.keys(B.v1).length || Object.keys(B.v2.cmd).length || Object.keys(B.v2.energie).length);
    return entete("Programme 1 · AD-03", "🧭 Mode d'emploi de Moi",
      "Un petit questionnaire sur toi, pour toi. À la fin, tu repars avec ta Notice : ton mode d'emploi, écrit avec tes réponses.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">Avant de commencer</span>' +
        '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.45rem">' +
        '<li>✅ <strong>Ce n\'est pas un test.</strong> Il n\'y a ni note, ni bonne réponse.</li>' +
        '<li>⏸️ <strong>Tu peux passer</strong> n\'importe quelle question.</li>' +
        '<li>🔒 <strong>Tu vois ta Notice en premier</strong>, avant tout adulte. Tu choisis ensuite quoi partager.</li>' +
        '<li>💾 Tu peux <strong>t\'arrêter et reprendre</strong> plus tard : ce que tu remplis est gardé.</li>' +
        '</ul></div>' +
        '<p class="mini-note">Compte environ 15 minutes. Deux parties : <strong>Où j\'en suis</strong>, puis <strong>Mon pilotage</strong>.</p>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-a3="nav" data-to="ad03-v1">Reprendre où j\'en étais →</button>' +
            '<button class="btn btn-ligne" data-a3="recommencer">Recommencer à zéro</button>'
          : '<button class="btn btn-plein" data-a3="nav" data-to="ad03-v1">Commencer →</button>') +
      '</div>';
  }

  /* ===========================================================================
     ÉCRAN — Volet 1
     =========================================================================== */
  function renderV1() {
    var blocs = VOLET1.blocs.map(function (bl) {
      return '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.2rem">' + esc(bl.nom) + '</h2>' +
        bl.items.map(function (it) { return itemEchelle("v1", it); }).join("") + '</div>';
    }).join("");
    return entete("AD-03 · Partie 1 sur 2", "Où j'en suis", VOLET1.sous) +
      '<div class="carte" style="background:transparent;box-shadow:none;padding:0">' + legende05() + '</div>' +
      blocs +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a3="save-go" data-to="ad03-v2">Continuer vers « Mon pilotage » →</button>' +
        '<button class="btn btn-doux" data-a3="save-quitter">Quitter (je garde ma progression)</button>' +
      '</div>';
  }

  /* ===========================================================================
     ÉCRAN — Volet 2
     =========================================================================== */
  function renderV2() {
    var energie = ENERGIE.map(function (m) {
      return '<div class="q-bloc" style="margin:0.9rem 0"><div class="q-titre" style="font-size:0.98rem;font-weight:600">' + esc(m.lib) + '</div>' +
        pip05("energie", m.k, typeof B.v2.energie[m.k] === "number" ? B.v2.energie[m.k] : -1) + '</div>';
    }).join("");

    var cmds = COMMANDES.map(function (it) { return itemEchelle("cmd", it); }).join("");
    var stress = STRESS.map(function (it) { return itemEchelle("stress", it); }).join("");
    var carb = CARBURANT.map(function (it) { return itemEchelle("carb", it); }).join("");

    return entete("AD-03 · Partie 2 sur 2", "Mon pilotage", "Mon énergie, mon attention, mes commandes, mon carburant.") +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">🔋 Ma courbe d\'énergie</h2>' +
        '<p class="mini-note" style="margin-bottom:0.4rem">Ce n\'est pas un score, c\'est un tracé : à quel niveau je suis à chaque moment.</p>' + energie + '</div>' +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.6rem">🎯 Mon attention</h2>' +
        '<div class="q-bloc" style="margin:0 0 1rem"><div class="q-titre" style="font-size:0.98rem">Je tiens sur un travail scolaire sans décrocher pendant :</div>' +
          jetonsSingle("att-duree", "duree", ATT_DUREE, B.v2.att.duree) + '</div>' +
        '<div class="q-bloc" style="margin:0 0 1rem"><div class="q-titre" style="font-size:0.98rem">Ce qui me sort de ma tâche <span style="font-weight:400;color:var(--texte-doux)">(plusieurs possibles)</span> :</div>' +
          jetonsMulti("att-sort", "sort", ATT_SORT, B.v2.att.sort) + '</div>' +
        '<div class="q-bloc" style="margin:0 0 1rem"><div class="q-titre" style="font-size:0.98rem">Ce qui me ramène <span style="font-weight:400;color:var(--texte-doux)">(plusieurs possibles)</span> :</div>' +
          jetonsMulti("att-ramene", "ramene", ATT_RAMENE, B.v2.att.ramene) + '</div>' +
        '<div class="q-bloc" style="margin:0"><div class="q-titre" style="font-size:0.98rem">Je me rends compte que j\'ai décroché :</div>' +
          jetonsSingle("att-conscience", "conscience", ATT_CONSCIENCE, B.v2.att.conscience) + '</div>' +
      '</div>' +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">🎛️ Mes commandes</h2>' + legende05() + cmds + '</div>' +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">⚡ Ce qui déclenche mon stress</h2>' + legende05() + stress + '</div>' +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">🌙 Mon carburant</h2>' + legende05() + carb +
        '<div class="q-bloc" style="margin:0.6rem 0 0"><div class="q-titre" style="font-size:0.98rem">Quand je travaille, mon téléphone est :</div>' +
          jetonsSingle("carb-tel", "tel", TEL, B.v2.carb.tel) + '</div>' +
      '</div>' +

      '<div class="actions-bas">' +
        '<button class="btn btn-magenta" data-a3="finaliser">✨ Voir ma Notice</button>' +
        '<button class="btn btn-doux" data-a3="save-quitter">Quitter (je garde ma progression)</button>' +
      '</div>';
  }

  /* ===========================================================================
     Calcul de la Notice
     =========================================================================== */
  function corr(v, inv) { return typeof v === "number" ? (inv ? 5 - v : v) : null; }
  function moyenne(vals) { return vals.length ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : null; }

  function calculerNotice() {
    // V1 : jauges élan / regard / appuis
    var jauges = {};
    VOLET1.blocs.forEach(function (bl) {
      var vals = bl.items.map(function (it) { return corr(B.v1[it.id], it.inv); }).filter(function (x) { return x !== null; });
      jauges[bl.dim] = moyenne(vals);
    });
    var jaugeBasse = null, minVal = 99;
    ["elan", "regard", "appuis"].forEach(function (d) {
      if (jauges[d] !== null && jauges[d] < minVal) { minVal = jauges[d]; jaugeBasse = d; }
    });

    // Forces : items positifs (non inversés) cotés 4-5, formulés à la 1re personne
    var forces = [];
    VOLET1.blocs.forEach(function (bl) {
      bl.items.forEach(function (it) { if (!it.inv && typeof B.v1[it.id] === "number" && B.v1[it.id] >= 4) forces.push(it.t); });
    });
    COMMANDES.forEach(function (it) { if (!it.inv && typeof B.v2.cmd[it.id] === "number" && B.v2.cmd[it.id] >= 4) forces.push(it.t); });

    // V2 : fenêtre d'or (énergie max)
    var fenetre = null, maxE = -1;
    ENERGIE.forEach(function (m) { var v = B.v2.energie[m.k]; if (typeof v === "number" && v > maxE) { maxE = v; fenetre = m; } });

    // Commande la plus fragile (corrigée la plus basse)
    var fragile = null, minC = 99;
    COMMANDES.forEach(function (it) { var v = corr(B.v2.cmd[it.id], it.inv); if (v !== null && v < minC) { minC = v; fragile = it; } });

    // Déclencheur de stress dominant (le plus haut)
    var declencheur = null, maxS = -1;
    STRESS.forEach(function (it) { var v = B.v2.stress[it.id]; if (typeof v === "number" && v > maxS) { maxS = v; declencheur = it; } });

    return { jauges: jauges, jaugeBasse: jaugeBasse, forces: forces, fenetre: fenetre, fragile: fragile, declencheur: declencheur };
  }

  /* ===========================================================================
     ÉCRAN — Notice
     =========================================================================== */
  var LIB_JAUGE = { elan: "mon élan", regard: "mon regard sur moi", appuis: "mes appuis" };
  var PHRASE_BASSE = {
    elan: "Un élan bas, ce n'est presque jamais de la flemme : c'est souvent un regard sur moi qui s'est abîmé, ou un appui qui me manque.",
    regard: "Ça veut souvent dire que je suis plus dur·e avec moi que je ne le serais avec un·e ami·e.",
    appuis: "Ce n'est pas un défaut : ça veut dire qu'un appui me manque en ce moment, et qu'un appui, ça se construit."
  };

  function jaugeBarre(val) {
    var pct = val === null ? 0 : Math.round((val / 5) * 100);
    return '<div class="score-bar-bg" style="height:9px;margin:0.25rem 0 0.7rem"><div class="score-bar-fill" style="width:' + pct + '%;background:var(--sarcelle)"></div></div>';
  }

  function renderNotice() {
    var n = calculerNotice();

    var forcesHTML = n.forces.length
      ? '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.35rem">' +
        n.forces.slice(0, 6).map(function (f) { return '<li>✔️ ' + esc(f) + '</li>'; }).join("") + '</ul>'
      : '<p>Aujourd\'hui tu n\'as coché aucun point en « carrément moi » — et c\'est ok. On cherchera ensemble tes appuis : ils sont là, même quand on ne les voit pas tout de suite.</p>';

    var jaugesHTML = ["elan", "regard", "appuis"].map(function (d) {
      var v = n.jauges[d];
      return '<div style="margin-bottom:0.3rem"><strong>' + esc(LIB_JAUGE[d].replace("mon ", "").replace("mes ", "").replace("ma ", "")) + '</strong>' +
        (v === null ? ' <span class="mini-note">· non renseigné</span>' : '') + jaugeBarre(v) + '</div>';
    }).join("");

    var basseHTML = n.jaugeBasse
      ? '<p>En ce moment, ma jauge la plus basse, c\'est <strong>' + esc(LIB_JAUGE[n.jaugeBasse]) + '</strong>. ' + esc(PHRASE_BASSE[n.jaugeBasse]) + '</p>'
      : '';

    var v2HTML = "";
    if (n.fenetre) v2HTML += '<p>🔋 Je suis le plus disponible <strong>' + esc(n.fenetre.lib.toLowerCase()) + '</strong>. C\'est là que je gagne à mettre ce qui est difficile, pas ce qui est facile.</p>';
    if (n.fragile) v2HTML += '<p>🎛️ Ma commande la plus fragile en ce moment, c\'est <strong>« ' + esc(n.fragile.simple) + ' »</strong>. Ce n\'est pas une fatalité : c\'est justement là qu\'un petit outil change tout.</p>';
    if (n.declencheur) v2HTML += '<p>⚡ Ce qui déclenche le plus mon stress : <strong>' + esc(n.declencheur.lib) + '</strong>. Une piste à tester : ' + esc(n.declencheur.parade) + '</p>';
    if (!v2HTML) v2HTML = '<p class="mini-note">Tu n\'as pas rempli la partie « Mon pilotage » — tu peux y revenir quand tu veux.</p>';

    return entete("AD-03 · Ma Notice", "📘 Ma Notice", "Ton mode d'emploi, écrit avec tes réponses. Il est à toi.") +

      '<div class="carte">' +
        '<span class="ruban" style="background:var(--menthe);color:var(--charbon)">Ce sur quoi je peux compter</span>' +
        forcesHTML +
      '</div>' +

      '<div class="carte">' +
        '<h2 style="font-size:1.05rem;margin-bottom:0.6rem">Où j\'en suis</h2>' +
        jaugesHTML + basseHTML +
      '</div>' +

      '<div class="carte">' +
        '<h2 style="font-size:1.05rem;margin-bottom:0.6rem">Mon pilotage</h2>' +
        v2HTML +
      '</div>' +

      '<div class="encadre lavande">' +
        '<span class="titre">Ce que cette Notice n\'est pas</span>' +
        '<p>Ce n\'est pas un diagnostic et ça ne me met aucune étiquette. C\'est une photo de <strong>maintenant</strong> — et « maintenant », ça change. Je choisis si je veux la partager, et avec qui.</p>' +
      '</div>' +

      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-nav="accueil">Revenir à l\'accueil</button>' +
        '<button class="btn btn-ligne" data-a3="imprimer">🖨️ Imprimer / garder en PDF</button>' +
        '<button class="btn btn-doux" data-a3="refaire">↺ Refaire le bilan</button>' +
      '</div>';
  }

  /* ===========================================================================
     Liaison des événements (spécifique AD-03)
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a3]').forEach(function (b) {
      b.addEventListener("click", function () { action(b); });
    });
  }

  function action(b) {
    var type = b.getAttribute("data-a3");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauverBrouillon(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauverBrouillon(); toast("Progression gardée 💾"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("bilan-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("bilan-brouillon", B); go("ad03-v1"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauverBrouillon(); enregistrerNotice(); go("ad03-notice"); return; }

    if (type === "pip") {
      obj(b.getAttribute("data-grp"))[b.getAttribute("data-key")] = parseInt(b.getAttribute("data-val"), 10);
      render(); return;
    }
    if (type === "passe") {
      obj(b.getAttribute("data-grp"))[b.getAttribute("data-key")] = "passe";
      render(); return;
    }
    if (type === "single") {
      var g = b.getAttribute("data-grp"), val = b.getAttribute("data-val");
      if (g === "att-duree") B.v2.att.duree = (B.v2.att.duree === val ? undefined : val);
      else if (g === "att-conscience") B.v2.att.conscience = (B.v2.att.conscience === val ? undefined : val);
      else if (g === "carb-tel") B.v2.carb.tel = (B.v2.carb.tel === val ? undefined : val);
      render(); return;
    }
    if (type === "multi") {
      var key = b.getAttribute("data-grp") === "att-sort" ? "sort" : "ramene";
      var arr = B.v2.att[key], v = b.getAttribute("data-val"), i = arr.indexOf(v);
      if (i === -1) arr.push(v); else arr.splice(i, 1);
      render(); return;
    }
  }

  function enregistrerNotice() {
    var n = calculerNotice();
    var resume = {
      date: MEM.auj(),
      jaugeBasse: n.jaugeBasse,
      fenetre: n.fenetre ? n.fenetre.k : null,
      fragile: n.fragile ? n.fragile.simple : null,
      declencheur: n.declencheur ? n.declencheur.lib : null,
      nbForces: n.forces.length
    };
    Vault.ecrire("bilan-notice", resume);
  }

  /* ---------- Chargement du brouillon (une fois) ---------- */
  function chargerUneFois() {
    if (chargé) return;
    chargé = true;
    Vault.lire("bilan-brouillon").then(function (d) {
      B = assainir(d);
      render();
    }).catch(function () { B = vide(); });
  }

  /* ===========================================================================
     Enregistrement des écrans
     =========================================================================== */
  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();

    MEM.register("ad03", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("ad03-v1", { render: renderV1, bind: bindCommun });
    MEM.register("ad03-v2", { render: renderV2, bind: bindCommun });
    MEM.register("ad03-notice", { render: renderNotice, bind: bindCommun });
  }

  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
