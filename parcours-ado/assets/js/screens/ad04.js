/* ===========================================================================
   AD-04 — « Mes émotions »
   ---------------------------------------------------------------------------
   Fidèle au DOSSIER v0.2, Module Émotions (miroir Fiches 6 & 7).
   Principes tenus :
   • La HONTE est une émotion à part entière (jamais réduite, jamais honteuse).
   • On passe par le CORPS et le COMPORTEMENT — jamais « nomme ton émotion ».
   • « Je ne sais pas encore » et « je passe » disponibles partout.
   • Aucun score, aucun diagnostic. Restitution douce + phrase-cadre.
   • 100 % local et chiffré (capEduca.ado.*).
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  /* ---------- Contenu ---------- */
  var THERMO = [
    { id: "t1", t: "Je repère dans mon corps que ça monte, avant d'exploser." },
    { id: "t2", t: "Je passe de 0 à 100 très vite.", inv: true },
    { id: "t3", t: "Quand je monte, je peux demander une pause." },
    { id: "t4", t: "Une fois monté·e, je mets longtemps à redescendre.", inv: true }
  ];
  var SIGNES = ["cœur rapide", "gorge serrée", "ventre noué", "mâchoire serrée", "mains serrées",
    "chaleur au visage", "envie de pleurer", "envie de crier", "envie de fuir", "tête vide", "pensées qui tournent"];
  var REDESCENDRE = ["bouger, me défouler", "respirer lentement", "être un moment seul·e", "en parler",
    "écouter de la musique", "pleurer un coup", "boire de l'eau", "serrer un coussin"];

  var ROUE_B = [
    { id: "b1", t: "Je sais nommer ce que je ressens sur le moment." },
    { id: "b2", t: "Ma colère cache souvent autre chose." },
    { id: "b3", t: "Quand j'ai honte, ça sort en agressivité.", inv: true },
    { id: "b4", t: "Je sais dire ce dont j'ai besoin quand ça ne va pas." },
    { id: "b5", t: "Après un conflit, j'arrive à réparer." },
    { id: "b6", t: "Je dis « je m'en fiche » alors que ça me touche.", inv: true },
    { id: "b7", t: "Je fais semblant que ça va pour qu'on me laisse tranquille.", inv: true }
  ];

  var EMOTIONS = [
    { id: "colere", emo: "😠", lib: "Colère", besoin: "être entendu·e, qu'on respecte une limite" },
    { id: "peur", emo: "😨", lib: "Peur", besoin: "me sentir en sécurité, être rassuré·e" },
    { id: "tristesse", emo: "😢", lib: "Tristesse", besoin: "du réconfort, être consolé·e" },
    { id: "honte", emo: "😳", lib: "Honte", besoin: "être accueilli·e sans jugement, me sentir ok comme je suis" },
    { id: "frustration", emo: "😤", lib: "Frustration", besoin: "que ça avance, parfois un coup de main" },
    { id: "anxiete", emo: "😰", lib: "Anxiété", besoin: "du calme et de la prévisibilité" },
    { id: "injustice", emo: "😖", lib: "Sentiment d'injustice", besoin: "être reconnu·e, que ce soit réparé" },
    { id: "deception", emo: "😞", lib: "Déception", besoin: "du réconfort, réajuster mes attentes" },
    { id: "jalousie", emo: "😔", lib: "Jalousie", besoin: "être rassuré·e sur ma place" },
    { id: "joie", emo: "😄", lib: "Joie", besoin: "partager ce moment" }
  ];

  /* ---------- État ---------- */
  var B = null;
  var chargé = false;
  function vide() { return { thermo: {}, signes: [], redescendre: [], roue: {}, emotion: null }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.thermo = d.thermo || {};
      b.roue = d.roue || {};
      b.signes = Array.isArray(d.signes) ? d.signes : [];
      b.redescendre = Array.isArray(d.redescendre) ? d.redescendre : [];
      b.emotion = d.emotion || null;
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("emotions-brouillon", B); }

  /* ---------- Composants ---------- */
  function pip05(grp, key, cur) {
    var s = "";
    for (var v = 0; v <= 5; v++) {
      s += '<button class="pip" role="button" aria-pressed="' + (cur === v) + '" data-a4="pip" data-grp="' + grp + '" data-key="' + key + '" data-val="' + v + '" aria-label="' + v + ' sur 5">' +
        '<span class="lib" style="font-size:1rem;font-weight:800;color:var(--texte)">' + v + '</span></button>';
    }
    return '<div class="echelle" role="group">' + s + '</div>';
  }
  function itemEchelle(grp, item) {
    var cur = (grp === "thermo" ? B.thermo : B.roue)[item.id];
    var passee = cur === "passe";
    return '<div class="q-bloc" style="margin:1.1rem 0"><div class="q-titre" style="font-size:1rem;font-weight:600">' +
      esc(item.t) + (passee ? ' <span class="mini-note">· passée</span>' : '') + '</div>' +
      pip05(grp, item.id, typeof cur === "number" ? cur : -1) +
      '<button class="lien-doux" data-a4="passe" data-grp="' + grp + '" data-key="' + item.id + '" style="font-size:0.8rem;margin-top:0.3rem">je passe</button></div>';
  }
  function multi(grp, options, arr) {
    return '<div class="jetons" role="group">' + options.map(function (o) {
      return '<button class="jeton" role="button" aria-pressed="' + (arr.indexOf(o) !== -1) + '" data-a4="multi" data-grp="' + grp + '" data-val="' + esc(o) + '">' + esc(o) + '</button>';
    }).join("") + '</div>';
  }
  function legende05() {
    return '<p class="mini-note" style="margin-bottom:0.5rem">Sur chaque phrase : <strong>0</strong> = pas du tout moi · <strong>5</strong> = carrément moi. Il n\'y a pas de bonne réponse.</p>';
  }
  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }

  /* ===========================================================================
     Écran — Intro
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (Object.keys(B.thermo).length || B.signes.length || B.emotion);
    return entete("Programme 1 · AD-04", "🎭 Mes émotions",
      "Ici, on apprend à repérer et à nommer ce qui se passe dedans. Pas pour te juger — pour t'aider.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">Ce qu\'il faut savoir</span>' +
        '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.45rem">' +
        '<li>🌈 <strong>Aucune émotion n\'est interdite.</strong> La colère, la peur, la honte… toutes se ressentent, et c\'est normal.</li>' +
        '<li>🫀 On passe par <strong>ton corps</strong> et ce que tu fais, pas par « nomme ton émotion » à froid.</li>' +
        '<li>⏸️ Tu peux <strong>passer</strong>, ou choisir <strong>« je ne sais pas encore »</strong>.</li>' +
        '</ul></div>' +
        '<div class="encadre lavande"><span class="titre">Une phrase à garder</span>' +
        '<p>Toutes mes émotions sont <strong>entendables</strong>. Tous mes comportements ne sont pas <strong>acceptables</strong>. Les deux sont vrais en même temps.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-a4="nav" data-to="ad04-thermo">Reprendre →</button><button class="btn btn-ligne" data-a4="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-a4="nav" data-to="ad04-thermo">Commencer →</button>') +
      '</div>';
  }

  /* ===========================================================================
     Écran — Le thermomètre (ça monte / ça redescend)
     =========================================================================== */
  function renderThermo() {
    return entete("AD-04 · 1 sur 2", "Quand ça monte chez moi", "Comprendre comment la pression monte — et ce qui la fait redescendre.") +
      '<div class="carte" style="background:transparent;box-shadow:none;padding:0">' + legende05() + '</div>' +
      '<div class="carte">' + THERMO.map(function (it) { return itemEchelle("thermo", it); }).join("") + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">🫀 Mes signes quand ça monte</h2>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Ce que je sens dans mon corps <span style="color:var(--texte-doux)">(plusieurs possibles)</span>. Ce sont tes signaux d\'alerte.</p>' +
        multi("signes", SIGNES, B.signes) + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">🌬️ Ce qui m\'aide à redescendre</h2>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Ce qui marche pour toi <span style="color:var(--texte-doux)">(plusieurs possibles)</span>.</p>' +
        multi("redescendre", REDESCENDRE, B.redescendre) + '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a4="save-go" data-to="ad04-roue">Continuer →</button>' +
        '<button class="btn btn-doux" data-a4="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  /* ===========================================================================
     Écran — La roue (nommer)
     =========================================================================== */
  function renderRoue() {
    var chips = EMOTIONS.map(function (e) {
      var on = B.emotion === e.id;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a4="emotion" data-val="' + e.id + '" style="font-size:0.95rem">' + e.emo + ' ' + esc(e.lib) + '</button>';
    }).join("");
    var onSaisPas = B.emotion === "inconnu";
    return entete("AD-04 · 2 sur 2", "Nommer, c'est déjà apaiser", "Mettre un mot sur ce qu'on ressent, ça aide vraiment le cerveau à faire redescendre.") +
      '<div class="carte" style="background:transparent;box-shadow:none;padding:0">' + legende05() + '</div>' +
      '<div class="carte">' + ROUE_B.map(function (it) { return itemEchelle("roue", it); }).join("") + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.15rem">🎡 Mon émotion la plus fréquente, en ce moment</h2>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Celle qui revient le plus souvent ces temps-ci.</p>' +
        '<div class="jetons" role="group">' + chips +
          '<button class="jeton" role="button" aria-pressed="' + onSaisPas + '" data-a4="emotion" data-val="inconnu">🤍 Je ne sais pas encore</button>' +
        '</div>' +
        '<div class="encadre beige" style="margin-top:0.9rem"><p class="mini-note">La <strong>honte</strong> est une émotion comme les autres — la ressentir n\'a rien de honteux. Elle veut souvent dire « j\'ai eu peur de ne pas être à la hauteur du regard des autres ».</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-magenta" data-a4="finaliser">✨ Voir ce que ça me dit</button>' +
        '<button class="btn btn-doux" data-a4="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  /* ===========================================================================
     Écran — Restitution
     =========================================================================== */
  function renderNotice() {
    var emo = EMOTIONS.filter(function (e) { return e.id === B.emotion; })[0];
    var signaux = B.signes.slice(0, 5);
    var douxAides = B.redescendre.slice(0, 5);

    var signauxHTML = signaux.length
      ? '<p>Quand ça monte, ton corps t\'envoie souvent : <strong>' + signaux.map(esc).join("</strong>, <strong>") + '</strong>. Ce sont tes <strong>signaux d\'alerte</strong> : quand tu les sens, c\'est le moment de faire une pause, avant que ça déborde.</p>'
      : '<p class="mini-note">Tu n\'as pas coché de signaux du corps — tu peux y revenir quand tu veux. Les repérer, ça s\'apprend.</p>';

    var emoHTML = "";
    if (emo && emo.id !== "joie") emoHTML = '<p>En ce moment, l\'émotion qui revient le plus, c\'est <strong>' + emo.emo + ' ' + esc(emo.lib.toLowerCase()) + '</strong>. Derrière elle, il y a souvent un besoin : <strong>' + esc(emo.besoin) + '</strong>. Le nommer, c\'est déjà pouvoir le demander.</p>';
    else if (emo && emo.id === "joie") emoHTML = '<p>En ce moment, ce qui revient le plus, c\'est <strong>😄 la joie</strong> — tant mieux ! Ce qui va avec : <strong>' + esc(emo.besoin) + '</strong>.</p>';
    else emoHTML = '<p>Tu n\'es pas encore sûr·e de ton émotion la plus fréquente — et c\'est parfaitement ok. Ça se découvre avec le temps, en observant.</p>';

    var aidesHTML = douxAides.length
      ? '<p>🌬️ Ce qui t\'aide à redescendre : <strong>' + douxAides.map(esc).join("</strong>, <strong>") + '</strong>. Garde-les en tête — ce sont tes outils à toi.</p>'
      : '';

    // Note douce si escalade rapide (t2 inversé : valeur brute haute = monte vite)
    var monteVite = typeof B.thermo.t2 === "number" && B.thermo.t2 >= 4;
    var viteHTML = monteVite ? '<div class="encadre ciel"><p>Ça a l\'air de monter <strong>vite</strong> chez toi en ce moment. Raison de plus pour bien connaître tes premiers signaux : plus tu les repères tôt, plus la pause est facile.</p></div>' : "";

    var honteHTML = (B.emotion === "honte" || (typeof B.roue.b3 === "number" && B.roue.b3 >= 4))
      ? '<div class="encadre lavande"><span class="titre">Un mot sur la honte</span><p>La honte fait souvent sortir de la colère ou du repli — ce n\'est pas de la méchanceté, c\'est une émotion qui protège. Tu as le droit de la ressentir, et tu vaux bien plus que ce que tu crois dans ces moments-là.</p></div>'
      : "";

    return entete("AD-04 · Ce que ça me dit", "🎭 Mes émotions — ma photo", "À toi, et à personne d'autre.") +
      '<div class="carte"><div class="encadre lavande" style="margin:0"><span class="titre">Ma phrase-cadre</span>' +
        '<p>Toutes mes émotions sont <strong>entendables</strong>. Tous mes comportements ne sont pas <strong>acceptables</strong>.</p></div></div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Mes signaux d\'alerte</h2>' + signauxHTML + viteHTML + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Ce qui revient, et le besoin dessous</h2>' + emoHTML + honteHTML + '</div>' +
      (aidesHTML ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Ma trousse anti-débordement</h2>' + aidesHTML + '</div>' : '') +
      '<div class="encadre menthe"><p>Ce n\'est pas un diagnostic, et rien n\'est figé. C\'est une photo de <strong>maintenant</strong>, pour mieux te comprendre. Tu choisis si tu veux la partager, et avec qui.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-nav="accueil">Revenir à l\'accueil</button>' +
        '<button class="btn btn-ligne" data-a4="imprimer">🖨️ Garder en PDF</button>' +
        '<button class="btn btn-doux" data-a4="refaire">↺ Recommencer</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a4]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
  }
  function action(b) {
    var type = b.getAttribute("data-a4");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("emotions-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("emotions-brouillon", B); go("ad04-thermo"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); enregistrerNotice(); go("ad04-notice"); return; }
    if (type === "pip") {
      var o = b.getAttribute("data-grp") === "thermo" ? B.thermo : B.roue;
      o[b.getAttribute("data-key")] = parseInt(b.getAttribute("data-val"), 10); render(); return;
    }
    if (type === "passe") {
      var o2 = b.getAttribute("data-grp") === "thermo" ? B.thermo : B.roue;
      o2[b.getAttribute("data-key")] = "passe"; render(); return;
    }
    if (type === "multi") {
      var arr = b.getAttribute("data-grp") === "signes" ? B.signes : B.redescendre;
      var v = b.getAttribute("data-val"), i = arr.indexOf(v);
      if (i === -1) arr.push(v); else arr.splice(i, 1);
      render(); return;
    }
    if (type === "emotion") {
      var val = b.getAttribute("data-val");
      B.emotion = (B.emotion === val ? null : val); render(); return;
    }
  }

  function enregistrerNotice() {
    Vault.ecrire("emotions-notice", {
      date: MEM.auj(),
      emotion: B.emotion || null,
      signaux: B.signes.slice(0, 5),
      redescendre: B.redescendre.slice(0, 5)
    });
  }

  function chargerUneFois() {
    if (chargé) return;
    chargé = true;
    Vault.lire("emotions-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("ad04", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("ad04-thermo", { render: renderThermo, bind: bindCommun });
    MEM.register("ad04-roue", { render: renderRoue, bind: bindCommun });
    MEM.register("ad04-notice", { render: renderNotice, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
