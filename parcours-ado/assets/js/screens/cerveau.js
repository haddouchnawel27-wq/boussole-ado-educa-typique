/* ===========================================================================
   « Mon cerveau en action » — défis créatifs (Carnet, section 4)
   ---------------------------------------------------------------------------
   Petits défis ludiques de pensée divergente / logique / organisation.
   Garde-fous (spec §9.4) :
   • AUCUN score, aucune bonne réponse, aucune mesure d'originalité (subjectif).
   • Réponses ouvertes, stockées PRIVÉES et chiffrées, jamais analysées.
   • « Je passe » implicite : tout est optionnel, on peut tout laisser vide.
   • Restitution = renforcement positif, jamais un jugement.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  var DEFIS = [
    { id: "trombone", emo: "📎", t: "À quoi peut servir un trombone, à part tenir des feuilles ? Trouve le plus d'idées possibles.", ph: "Vas-y, même les idées farfelues…" },
    { id: "objet", emo: "💡", t: "Invente un objet qui n'existe pas et qui réglerait un petit tracas de ta journée.", ph: "Il ferait quoi, ton objet ?" },
    { id: "ecole", emo: "🏫", t: "Si tu pouvais changer UNE seule chose dans ton collège ou ton lycée, ce serait quoi ?", ph: "Ton idée…" },
    { id: "histoire", emo: "🔗", t: "Relie ces trois mots en une mini-histoire : un renard, une clé, un orage.", ph: "Une ou deux phrases suffisent…" },
    { id: "heure", emo: "⏱️", t: "Tu as une heure et cinq choses à faire. Tu t'y prends comment ?", ph: "Ta façon de t'organiser…" }
  ];

  var PREFERE = [
    { id: "imaginer", emo: "💭", lib: "Imaginer, inventer" },
    { id: "resoudre", emo: "🧩", lib: "Résoudre une colle" },
    { id: "organiser", emo: "🗂️", lib: "Organiser, planifier" },
    { id: "raconter", emo: "📖", lib: "Raconter une histoire" },
    { id: "ameliorer", emo: "🛠️", lib: "Améliorer les choses" }
  ];
  var PREF_MOT = {
    imaginer: "imaginer et inventer", resoudre: "résoudre des énigmes", organiser: "organiser",
    raconter: "raconter des histoires", ameliorer: "améliorer ce qui t'entoure"
  };

  /* ---------- État ---------- */
  var B = null, chargé = false;
  function vide() { return { defis: {}, prefere: null }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.defis = d.defis && typeof d.defis === "object" ? d.defis : {};
      b.prefere = d.prefere || null;
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("cerveau-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }

  /* ===========================================================================
     Écran — Intro
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (Object.keys(B.defis).length || B.prefere);
    return entete("Programme 1 · Bonus", "🧠 Mon cerveau en action",
      "Cinq petits défis pour t'amuser et voir ton cerveau tourner. Pas de note, pas de bonne réponse — juste toi, tes idées.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">La règle du jeu</span>' +
        '<p>Il n\'y a <strong>rien à réussir</strong>. On ne mesure rien, on ne compare rien. Tes réponses restent <strong>privées</strong>. Tu peux tout laisser vide et juste lire — c\'est ok aussi.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-cv="nav" data-to="cerveau-jeu">Reprendre →</button><button class="btn btn-ligne" data-cv="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-cv="nav" data-to="cerveau-jeu">Je me lance →</button>') +
      '</div>';
  }

  /* ===========================================================================
     Écran — Les défis
     =========================================================================== */
  function renderJeu() {
    var blocs = DEFIS.map(function (d) {
      return '<div class="carte"><label class="q-titre" for="cv-' + d.id + '" style="display:block;margin-bottom:0.4rem">' +
        d.emo + ' ' + esc(d.t) + '</label>' +
        '<textarea id="cv-' + d.id + '" class="saisie" rows="3" data-cv-champ="' + d.id + '" placeholder="' + esc(d.ph) + '">' + esc(B.defis[d.id] || "") + '</textarea></div>';
    }).join("");

    var prefChips = '<div class="jetons" role="group">' + PREFERE.map(function (p) {
      var on = B.prefere === p.id;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-cv="prefere" data-val="' + p.id + '">' + p.emo + ' ' + esc(p.lib) + '</button>';
    }).join("") + '</div>';

    return entete("Mon cerveau · les défis", "🎲 À toi de jouer", "Prends ceux qui te tentent, laisse les autres. Aucun ordre, aucune pression.") +
      blocs +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">Dans tout ça, qu\'est-ce que tu as préféré ?</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Juste pour repérer ce qui te fait vibrer — pas une case définitive.</p>' +
        prefChips + '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-magenta" data-cv="finaliser">✨ Ce que ça dit de moi</button>' +
        '<button class="btn btn-doux" data-cv="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  /* ===========================================================================
     Écran — Restitution (positive, sans score)
     =========================================================================== */
  function renderBilan() {
    var faits = DEFIS.filter(function (d) { return (B.defis[d.id] || "").trim(); }).length;
    var prefLib = B.prefere && PREF_MOT[B.prefere] ? PREF_MOT[B.prefere] : null;

    var motHTML = prefLib
      ? '<p>On dirait que ton cerveau aime particulièrement <strong>' + esc(prefLib) + '</strong>. C\'est une <strong>force</strong> : garde-la en tête, elle peut te guider vers ce qui te plaît vraiment.</p>'
      : '<p>Tu n\'as pas choisi de préféré — pas grave du tout. Ce qui compte, c\'est que tu aies laissé ton cerveau s\'amuser un peu.</p>';

    var faitsHTML = faits
      ? '<p class="mini-note">Tu as relevé <strong>' + faits + '</strong> défi' + (faits > 1 ? "s" : "") + '. Ces idées sont à toi — tu peux y revenir, les compléter, ou t\'en servir plus tard.</p>'
      : '<p class="mini-note">Tu as surtout lu, cette fois — et c\'est parfaitement ok. Les défis t\'attendent quand tu veux.</p>';

    return entete("Mon cerveau · ce que ça dit", "🧠 Mon cerveau, en vrai", "Aucune note, aucun classement. Juste un petit miroir bienveillant.") +
      '<div class="carte">' + motHTML + faitsHTML + '</div>' +
      '<div class="encadre lavande"><p>Il n\'y a pas « une » bonne façon d\'être intelligent·e. Trouver plein d\'idées, en approfondir une seule, tout organiser ou tout imaginer : ce sont juste <strong>des manières différentes</strong>, toutes utiles.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-cv="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-doux" data-cv="refaire">↺ Recommencer</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-cv]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    root.querySelectorAll('[data-cv-champ]').forEach(function (t) {
      t.addEventListener("input", function () { B.defis[t.getAttribute("data-cv-champ")] = t.value; });
    });
  }
  function action(b) {
    var type = b.getAttribute("data-cv");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { sauver(); toast("C'est gardé 🧠"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("cerveau-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("cerveau-brouillon", B); go("cerveau-jeu"); return; }
    if (type === "finaliser") { sauver(); go("cerveau-bilan"); return; }
    if (type === "prefere") {
      var v = b.getAttribute("data-val");
      B.prefere = (B.prefere === v ? null : v); render(); return;
    }
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("cerveau-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("cerveau", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("cerveau-jeu", { render: renderJeu, bind: bindCommun });
    MEM.register("cerveau-bilan", { render: renderBilan, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
