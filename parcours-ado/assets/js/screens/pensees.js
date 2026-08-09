/* ===========================================================================
   « Démêler mes pensées » — biais cognitifs adaptés ado (compagnon d'AD-07)
   ---------------------------------------------------------------------------
   Adaptation ado du support pro « Biais cognitifs » (Educa Typique) :
   • Le catalogue des pensées pièges (11), en mots d'ado + question corrective.
   • La grille d'analyse TCC transformée en outil doux et réutilisable :
     fait brut → ce que mon esprit a ajouté → émotion (0-10) → corps →
     réaction → le piège → preuves pour/contre → réponse plus juste →
     « que dirais-tu à un·e pote ? ».
   Garde-fous : aucun diagnostic, aucune étiquette, aucun score de « gravité ».
   « Je passe » implicite (tout optionnel). Filet de sécurité si ça pèse fort.
   100 % local et chiffré (capEduca.ado.*). Se partage seulement via AD-11.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  /* Pensées pièges (biais adaptés ado) + exemple + question corrective */
  var PIEGES = [
    { id: "toutrien", lib: "Tout ou rien", ex: "« C'est soit parfait, soit nul. »", q: "Et si la vérité était au milieu ? À combien sur 10, honnêtement ?" },
    { id: "cata", lib: "Le pire va arriver", ex: "« Ça va forcément mal finir. »", q: "Le pire est-il vraiment probable, ou seulement redouté ?" },
    { id: "lecture", lib: "Lire dans les pensées", ex: "« Ils me trouvent nul·le. »", q: "Qu'est-ce que je sais vraiment, et qu'est-ce que j'imagine ?" },
    { id: "toujours", lib: "« Toujours / jamais »", ex: "« J'échoue à chaque fois. »", q: "C'est ce cas précis, ou vraiment « toujours » ?" },
    { id: "filtre", lib: "Ne voir que le négatif", ex: "« Je ne retiens que ce qui a raté. »", q: "Qu'est-ce qui a marché, même un peu ?" },
    { id: "faute", lib: "Tout est ma faute", ex: "« Si ça a raté, c'est moi. »", q: "Quelle part est vraiment à moi, parmi tout ce qui a joué ?" },
    { id: "ressenti", lib: "Je le sens, donc c'est vrai", ex: "« Je me sens nul·le, donc je le suis. »", q: "Ce que je ressens prouve-t-il ce qui est réel ?" },
    { id: "confirmation", lib: "Je ne vois que ce qui confirme", ex: "« Je cherche les preuves que j'avais raison. »", q: "Qu'est-ce qui, honnêtement, va CONTRE mon idée ?" },
    { id: "ancrage", lib: "La première impression colle", ex: "« Ma toute première idée me bloque encore. »", q: "Ma première impression me pilote-t-elle encore sans raison ?" },
    { id: "halo", lib: "Un détail = tout", ex: "« Un truc rate, donc tout est nul. »", q: "Est-ce que je juge le tout à partir d'un seul détail ?" },
    { id: "minipos", lib: "Je minimise ce qui est bien", ex: "« Ce que je réussis, ça compte pas. »", q: "Si c'était la réussite d'un·e pote, est-ce que je la minimiserais ?" }
  ];
  function piege(id) { return PIEGES.filter(function (p) { return p.id === id; })[0]; }
  var CORPS = ["cœur rapide", "gorge serrée", "ventre noué", "chaleur au visage",
    "envie de pleurer", "tête qui tourne", "mains moites", "boule au ventre"];

  /* ---------- État ---------- */
  var B = null, chargé = false;
  function vide() {
    return { fait: "", pensee: "", emotion: "", intensite: null, corps: [], reaction: "",
      piege: null, pour: "", contre: "", juste: "", pote: "" };
  }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.fait = d.fait || ""; b.pensee = d.pensee || ""; b.emotion = d.emotion || "";
      b.intensite = typeof d.intensite === "number" ? d.intensite : null;
      b.corps = Array.isArray(d.corps) ? d.corps : [];
      b.reaction = d.reaction || ""; b.piege = d.piege || null;
      b.pour = d.pour || ""; b.contre = d.contre || ""; b.juste = d.juste || ""; b.pote = d.pote || "";
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("pensees-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }
  function pip010(cur) {
    var s = "";
    for (var v = 0; v <= 10; v++) {
      s += '<button class="pip" role="button" aria-pressed="' + (cur === v) + '" data-pe="intensite" data-val="' + v + '" aria-label="' + v + ' sur 10">' +
        '<span class="lib" style="font-size:0.95rem;font-weight:800;color:var(--texte)">' + v + '</span></button>';
    }
    return '<div class="echelle echelle--mood" role="group" aria-label="Intensité sur 10">' + s + '</div>';
  }
  function multiCorps() {
    return '<div class="jetons" role="group">' + CORPS.map(function (o) {
      return '<button class="jeton" role="button" aria-pressed="' + (B.corps.indexOf(o) !== -1) + '" data-pe="corps" data-val="' + esc(o) + '">' + esc(o) + '</button>';
    }).join("") + '</div>';
  }

  /* ===========================================================================
     Intro
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (B.fait || B.pensee || B.piege || B.juste);
    return entete("Programme 2 · Bonus", "🧶 Démêler mes pensées",
      "Quand une pensée tourne en boucle et fait mal, on peut la démêler doucement — séparer ce qui s'est vraiment passé de ce que le cerveau a ajouté.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">Bon à savoir</span>' +
        '<p>Ton cerveau prend des <strong>raccourcis</strong> pour aller vite. Parfois il se trompe et fait passer une <strong>interprétation</strong> pour la réalité. Ce ne sont pas des « défauts » : tout le monde en a. Les repérer, ça s\'apprend.</p></div>' +
        '<div class="encadre lavande"><p>Il n\'y a rien à réussir ici, et aucune pensée n\'est « honteuse ». On observe, on démêle, à ton rythme.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-pe="nav" data-to="pensees-moment">Reprendre →</button><button class="btn btn-ligne" data-pe="recommencer">Nouvelle pensée</button>'
          : '<button class="btn btn-plein" data-pe="nav" data-to="pensees-moment">Démêler une pensée →</button>') +
        '<button class="btn btn-doux" data-pe="nav" data-to="pensees-catalogue">Voir les pensées pièges</button>' +
      '</div>';
  }

  /* ===========================================================================
     Catalogue (psychoéducation, lecture seule)
     =========================================================================== */
  function renderCatalogue() {
    var cartes = PIEGES.map(function (p) {
      return '<div class="carte"><div class="q-titre" style="font-size:1rem;margin-bottom:0.2rem">' + esc(p.lib) + '</div>' +
        '<p class="mini-note" style="margin:0 0 0.5rem;font-style:italic">' + esc(p.ex) + '</p>' +
        '<div class="encadre ciel" style="margin:0"><p><strong>La question qui aide :</strong> ' + esc(p.q) + '</p></div></div>';
    }).join("");
    return entete("Pensées pièges", "🔎 Les pensées pièges", "Ces petites phrases automatiques qui déforment la réalité. En connaître les noms, ça aide à les repérer plus vite.") +
      cartes +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-pe="nav" data-to="pensees-moment">Démêler une pensée →</button>' +
        '<button class="btn btn-doux" data-pe="nav" data-to="pensees">← Retour</button>' +
      '</div>';
  }

  /* ===========================================================================
     Étape 1 — Le moment
     =========================================================================== */
  function renderMoment() {
    return entete("Démêler · 1 sur 2", "Le moment", "On décrit d'abord, sans juger. Tu peux tout laisser vide sauf ce qui te vient.") +
      '<div class="carte">' +
        '<label class="q-titre" for="pe-fait" style="display:block;margin-bottom:0.3rem">📷 Le fait brut</label>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Ce qu\'une caméra aurait filmé — sans interprétation.</p>' +
        '<textarea id="pe-fait" class="saisie" rows="2" data-pe-champ="fait" placeholder="Ce qui s\'est passé, vraiment…">' + esc(B.fait) + '</textarea>' +
      '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="pe-pensee" style="display:block;margin-bottom:0.3rem">💭 Ce que mon esprit a ajouté</label>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">La pensée qui a surgi tout de suite.</p>' +
        '<textarea id="pe-pensee" class="saisie" rows="2" data-pe-champ="pensee" placeholder="La phrase qui m\'est passée par la tête…">' + esc(B.pensee) + '</textarea>' +
      '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="pe-emotion" style="display:block;margin-bottom:0.3rem">💗 Mon émotion</label>' +
        '<input id="pe-emotion" class="saisie" type="text" data-pe-champ="emotion" placeholder="Ex. peur, colère, honte, tristesse…" value="' + esc(B.emotion) + '" />' +
        '<p class="q-aide" style="margin:0.7rem 0 0.3rem">Son intensité, sur 10 :</p>' +
        pip010(typeof B.intensite === "number" ? B.intensite : -1) +
      '</div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.15rem">🫀 Dans mon corps</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Ce que j\'ai senti <span style="color:var(--texte-doux)">(plusieurs possibles)</span>.</p>' +
        multiCorps() + '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="pe-reaction" style="display:block;margin-bottom:0.3rem">➡️ Ce que j\'ai fait (ou eu envie de faire)</label>' +
        '<textarea id="pe-reaction" class="saisie" rows="2" data-pe-champ="reaction" placeholder="Ma réaction…">' + esc(B.reaction) + '</textarea>' +
      '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-pe="save-go" data-to="pensees-demeler">Continuer →</button>' +
        '<button class="btn btn-doux" data-pe="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  /* ===========================================================================
     Étape 2 — Je démêle
     =========================================================================== */
  function renderDemeler() {
    var chips = PIEGES.map(function (p) {
      var on = B.piege === p.id;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-pe="piege" data-val="' + p.id + '" style="font-size:0.9rem">' + esc(p.lib) + '</button>';
    }).join("");
    var pSel = piege(B.piege);
    return entete("Démêler · 2 sur 2", "Je démêle", "Maintenant, on regarde la pensée avec un peu de recul. Elle a le droit d'exister — on vérifie juste si elle dit vrai.") +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">Quel piège reconnais-tu, là ?</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Choisis-en un (ou aucun).</p>' +
        '<div class="jetons" role="group">' + chips + '</div>' +
        (pSel ? '<div class="encadre ciel" style="margin-top:0.9rem"><span class="titre">' + esc(pSel.ex) + '</span><p><strong>La question qui aide :</strong> ' + esc(pSel.q) + '</p></div>' : "") +
      '</div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.5rem">⚖️ Le procès de la pensée</div>' +
        '<label class="mini-note" for="pe-pour" style="display:block;margin-bottom:0.2rem">Les preuves POUR (ce qui la soutient)</label>' +
        '<textarea id="pe-pour" class="saisie" rows="2" data-pe-champ="pour" placeholder="Ce qui donne raison à la pensée…">' + esc(B.pour) + '</textarea>' +
        '<label class="mini-note" for="pe-contre" style="display:block;margin:0.6rem 0 0.2rem">Les preuves CONTRE (ce qui la fragilise)</label>' +
        '<textarea id="pe-contre" class="saisie" rows="2" data-pe-champ="contre" placeholder="Ce qui va contre la pensée…">' + esc(B.contre) + '</textarea>' +
      '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="pe-juste" style="display:block;margin-bottom:0.3rem">🌤️ Une lecture plus juste</label>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Ni fausse-positive, ni cruelle. Juste plus vraie, et plus douce.</p>' +
        '<textarea id="pe-juste" class="saisie" rows="3" data-pe-champ="juste" placeholder="Si je regarde les faits, une version plus juste serait…">' + esc(B.juste) + '</textarea>' +
      '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="pe-pote" style="display:block;margin-bottom:0.3rem">💬 Et à un·e pote ?</label>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Si un·e ami·e vivait exactement ça, tu lui dirais quoi ?</p>' +
        '<textarea id="pe-pote" class="saisie" rows="2" data-pe-champ="pote" placeholder="Ce que je dirais à un·e pote…">' + esc(B.pote) + '</textarea>' +
      '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-pe="nav" data-to="pensees-moment">← Retour</button>' +
        '<button class="btn btn-magenta" data-pe="finaliser">✨ Voir ma pensée démêlée</button>' +
      '</div>';
  }

  /* ===========================================================================
     Bilan
     =========================================================================== */
  function renderBilan() {
    var pSel = piege(B.piege);
    var fort = typeof B.intensite === "number" && B.intensite >= 8;

    var avant = (B.pensee || "").trim()
      ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.4rem">La pensée de départ</h2>' +
        '<p style="font-style:italic">« ' + esc(B.pensee.trim()) + ' »</p>' +
        (pSel ? '<div class="encadre ciel" style="margin-top:0.6rem"><span class="titre">Le piège : ' + esc(pSel.lib.toLowerCase()) + '</span><p><strong>Ma parade :</strong> ' + esc(pSel.q) + '</p></div>' : "") + '</div>'
      : "";

    var justeHTML = (B.juste || "").trim()
      ? '<div class="encadre menthe"><span class="titre">🌤️ Ma lecture plus juste</span><p>« ' + esc(B.juste.trim()) + ' »</p></div>'
      : "";
    var poteHTML = (B.pote || "").trim()
      ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.4rem">Ce que je dirais à un·e pote</h2>' +
        '<p style="font-style:italic">« ' + esc(B.pote.trim()) + ' »</p>' +
        '<p class="mini-note" style="margin-top:0.5rem">Cette douceur-là, tu as le droit de te l\'offrir à toi aussi. C\'est la même personne qui la mérite.</p></div>'
      : "";

    var contreHTML = (B.contre || "").trim()
      ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.4rem">Ce qui fragilise la pensée</h2><p>' + esc(B.contre.trim()) + '</p></div>'
      : "";

    var fortHTML = fort
      ? '<div class="encadre lavande"><span class="titre">Un mot, juste pour toi</span><p>Cette émotion est <strong>forte</strong> en ce moment. Démêler aide, mais si ça pèse trop ou trop souvent, tu n\'as pas à porter ça seul·e — parles-en à quelqu\'un de confiance. Ce n\'est pas se plaindre, c\'est prendre soin de toi.</p>' +
        '<button class="btn btn-magenta btn-petit" data-act="aide" style="margin-top:0.6rem">🆘 Voir les numéros d\'aide</button></div>'
      : "";

    return entete("Ma pensée démêlée", "🧶 Ma pensée démêlée", "Une photo de maintenant. La pensée de départ n'était pas « la vérité » — juste une hypothèse à vérifier.") +
      '<div class="carte"><div class="encadre lavande" style="margin:0"><span class="titre">À retenir</span>' +
        '<p>Un fait, c\'est ce qui s\'est passé. Une pensée, c\'est ce que mon cerveau en a fait. Les deux ne sont pas pareils — et ça change tout.</p></div></div>' +
      avant + (justeHTML ? '<div class="carte">' + justeHTML + '</div>' : "") + contreHTML + poteHTML + fortHTML +
      '<div class="encadre beige"><p class="mini-note">Ce n\'est pas un diagnostic. C\'est un entraînement — plus tu démêles, plus ça devient rapide. Tu choisis si tu veux le partager, et avec qui.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-pe="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-pe="imprimer">🖨️ Garder en PDF</button>' +
        '<button class="btn btn-doux" data-pe="refaire">↺ Nouvelle pensée</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-pe]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    root.querySelectorAll('[data-pe-champ]').forEach(function (el) {
      el.addEventListener("input", function () { B[el.getAttribute("data-pe-champ")] = el.value; });
    });
  }
  function action(b) {
    var type = b.getAttribute("data-pe");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { enregistrerNotice(); sauver(); toast("C'est gardé 🧶"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("pensees-brouillon", B); go("pensees-moment"); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("pensees-brouillon", B); go("pensees-moment"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); enregistrerNotice(); go("pensees-bilan"); return; }
    if (type === "piege") { var v = b.getAttribute("data-val"); B.piege = (B.piege === v ? null : v); render(); return; }
    if (type === "intensite") { B.intensite = parseInt(b.getAttribute("data-val"), 10); render(); return; }
    if (type === "corps") {
      var c = b.getAttribute("data-val"), i = B.corps.indexOf(c);
      if (i === -1) B.corps.push(c); else B.corps.splice(i, 1);
      render(); return;
    }
  }

  function enregistrerNotice() {
    var pSel = piege(B.piege);
    if (!pSel && !(B.juste || "").trim()) { Vault.ecrire("pensees-notice", null); return; }
    Vault.ecrire("pensees-notice", {
      date: MEM.auj(),
      piege: pSel ? pSel.lib : null,
      juste: (B.juste || "").trim() || null
    });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("pensees-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("pensees", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("pensees-catalogue", { render: renderCatalogue, bind: bindCommun });
    MEM.register("pensees-moment", { render: renderMoment, bind: bindCommun });
    MEM.register("pensees-demeler", { render: renderDemeler, bind: bindCommun });
    MEM.register("pensees-bilan", { render: renderBilan, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
