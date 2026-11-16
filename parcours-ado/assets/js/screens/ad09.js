/* ===========================================================================
   AD-09 — « Mon quotidien & mes forces »
   ---------------------------------------------------------------------------
   Programme 3. D'après le plan : ma semaine réaliste, sommeil, organisation,
   argent, autonomie, forces, intérêts, progression. (L'orientation à proprement
   parler est l'étape finale, séparée.)
   « Ma zone de forces, d'intérêts et de progression. »
   Garde-fous : aucun score, aucun jugement, « je passe » ; données chiffrées.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  var QITEMS = [
    { id: "q1", t: "Je dors assez pour être en forme la plupart du temps." },
    { id: "q2", t: "J'arrive à m'organiser pour mes devoirs et mes affaires." },
    { id: "q3", t: "Je gère mon temps entre écrans, travail et repos." },
    { id: "q4", t: "Je me débrouille seul·e pour les petites choses du quotidien." },
    { id: "q5", t: "Je fais attention à un peu d'argent (économiser, ne pas tout dépenser)." }
  ];
  var PESE = ["le manque de sommeil", "les devoirs / le travail", "l'organisation", "le temps d'écran", "les relations", "le stress", "autre"];
  var BIEN = ["le sport / bouger", "mes ami·es", "créer (dessin, musique, écrire…)", "être un peu seul·e", "la nature / les animaux", "les jeux", "autre"];
  var FORCES = ["comprendre vite", "créer / imaginer", "aider / écouter", "me lancer / agir", "organiser", "être persévérant·e", "remarquer les détails", "faire rire", "m'adapter"];
  var INTERETS = ["créativité", "sport", "sciences", "nature / animaux", "musique", "cuisine", "jeux / numérique", "technologie", "aider les autres", "lecture", "voyages", "entreprendre"];

  /* ---------- État ---------- */
  var B = null, chargé = false;
  function vide() { return { items: {}, pese: [], bien: [], forces: [], interets: [], progres: "", objectif: "" }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.items = d.items || {};
      ["pese", "bien", "forces", "interets"].forEach(function (k) { if (Array.isArray(d[k])) b[k] = d[k]; });
      b.progres = d.progres || ""; b.objectif = d.objectif || "";
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("quotidien-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }
  function pip05(key, cur) {
    var s = "";
    for (var v = 0; v <= 5; v++) {
      s += '<button class="pip" role="button" aria-pressed="' + (cur === v) + '" data-a9="pip" data-key="' + key + '" data-val="' + v + '" aria-label="' + v + ' sur 5">' +
        '<span class="lib" style="font-size:1rem;font-weight:800;color:var(--texte)">' + v + '</span></button>';
    }
    return '<div class="echelle" role="group">' + s + '</div>';
  }
  function itemEchelle(item) {
    var cur = B.items[item.id];
    return '<div class="q-bloc" style="margin:1.1rem 0"><div class="q-titre" style="font-size:1rem;font-weight:600">' +
      esc(item.t) + (cur === "passe" ? ' <span class="mini-note">· passée</span>' : '') + '</div>' +
      pip05(item.id, typeof cur === "number" ? cur : -1) +
      '<button class="lien-doux" data-a9="passe" data-key="' + item.id + '" style="font-size:0.8rem;margin-top:0.3rem">je passe</button></div>';
  }
  function multi(grp, options, arr) {
    return '<div class="jetons" role="group">' + options.map(function (o) {
      return '<button class="jeton" role="button" aria-pressed="' + (arr.indexOf(o) !== -1) + '" data-a9="multi" data-grp="' + grp + '" data-val="' + esc(o) + '">' + esc(o) + '</button>';
    }).join("") + '</div>';
  }
  function arrOf(grp) { return grp === "pese" ? B.pese : grp === "bien" ? B.bien : grp === "forces" ? B.forces : B.interets; }

  /* ===========================================================================
     Écrans
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (Object.keys(B.items).length || B.forces.length || B.progres);
    return entete("Programme 3 · AD-09", "🧩 Mon quotidien & mes forces",
      "Un regard sur ta vraie semaine — pas une version parfaite — et sur ce que tu sais faire.") +
      '<div class="carte"><div class="encadre menthe"><span class="titre">Ce qu\'on va faire</span>' +
        '<p>D\'abord ton <strong>quotidien</strong> (sommeil, organisation, ce qui pèse et ce qui fait du bien), puis ta <strong>zone de forces, d\'intérêts et de progression</strong>.</p></div></div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-a9="nav" data-to="ad09-quotidien">Reprendre →</button><button class="btn btn-ligne" data-a9="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-a9="nav" data-to="ad09-quotidien">Commencer →</button>') +
      '</div>';
  }

  function renderQuotidien() {
    return entete("AD-09 · 1 sur 2", "Ma semaine réaliste", "Comme c'est vraiment, sans te juger.") +
      '<div class="carte" style="background:transparent;box-shadow:none;padding:0"><p class="mini-note" style="margin-bottom:0.5rem"><strong>0</strong> = pas du tout moi · <strong>5</strong> = carrément moi.</p></div>' +
      '<div class="carte">' + QITEMS.map(itemEchelle).join("") + '</div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">Ce qui me pèse le plus, en ce moment</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">(plusieurs possibles)</p>' + multi("pese", PESE, B.pese) + '</div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">Ce qui me fait du bien</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">(plusieurs possibles)</p>' + multi("bien", BIEN, B.bien) + '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a9="save-go" data-to="ad09-forces">Mes forces →</button>' +
        '<button class="btn btn-doux" data-a9="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  function renderForces() {
    return entete("AD-09 · 2 sur 2", "Ma zone de forces & d'intérêts", "Ce que tu sais faire, ce qui t'attire, et ce que tu veux faire grandir.") +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">💪 Mes forces</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Ce que tu fais bien (même si tu doutes). Plusieurs possibles.</p>' + multi("forces", FORCES, B.forces) + '</div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">✨ Mes intérêts</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Ce qui t\'attire, ce qui te fait perdre la notion du temps.</p>' + multi("interets", INTERETS, B.interets) + '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="q-progres" style="display:block;margin-bottom:0.4rem">📈 Une chose où j\'ai progressé récemment <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<textarea id="q-progres" class="saisie" rows="2" placeholder="Même une petite chose…">' + esc(B.progres) + '</textarea></div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="q-objectif" style="display:block;margin-bottom:0.4rem">🎯 Une chose que j\'aimerais améliorer ou apprendre</label>' +
        '<textarea id="q-objectif" class="saisie" rows="2" placeholder="Mon envie du moment…">' + esc(B.objectif) + '</textarea></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-a9="nav" data-to="ad09-quotidien">← Retour</button>' +
        '<button class="btn btn-magenta" data-a9="finaliser">✨ Voir ma synthèse</button>' +
      '</div>';
  }

  function renderNotice() {
    var pese = B.pese.slice(0, 4), bien = B.bien.slice(0, 4);
    var forces = B.forces.slice(0, 6), interets = B.interets.slice(0, 6);
    var sommeilBas = typeof B.items.q1 === "number" && B.items.q1 <= 1;

    var semaineHTML = (pese.length || bien.length)
      ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Ma semaine</h2>' +
        (pese.length ? '<p>Ce qui me pèse : <strong>' + pese.map(esc).join("</strong>, <strong>") + '</strong>.</p>' : "") +
        (bien.length ? '<p>Ce qui me fait du bien : <strong>' + bien.map(esc).join("</strong>, <strong>") + '</strong> — pense à en garder chaque semaine, exprès.</p>' : "") +
        (sommeilBas ? '<div class="encadre ciel" style="margin-bottom:0"><p>Le <strong>sommeil</strong> a l\'air un peu court en ce moment. C\'est souvent le premier levier : mieux dormir change l\'humeur, la concentration et l\'énergie.</p></div>' : "") +
        '</div>' : "";

    var forcesHTML = (forces.length || interets.length)
      ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Ma zone de forces & d\'intérêts</h2>' +
        (forces.length ? '<p>💪 <strong>Mes forces :</strong> ' + forces.map(esc).join(", ") + '.</p>' : "") +
        (interets.length ? '<p>✨ <strong>Ce qui m\'attire :</strong> ' + interets.map(esc).join(", ") + '.</p>' : "") +
        '<p class="mini-note" style="margin-top:0.5rem">Garde ça précieusement : tes forces et tes intérêts sont une boussole pour plus tard — on s\'en resservira à l\'étape orientation.</p></div>' : "";

    var progHTML = ((B.progres || "").trim() || (B.objectif || "").trim())
      ? '<div class="carte">' +
        ((B.progres || "").trim() ? '<div class="encadre menthe" style="margin:0 0 0.6rem"><span class="titre">📈 Ma progression</span><p>« ' + esc(B.progres.trim()) + ' » — garde-la en tête les jours de doute.</p></div>' : "") +
        ((B.objectif || "").trim() ? '<div class="encadre jaune" style="margin:0"><span class="titre">🎯 Mon envie du moment</span><p>« ' + esc(B.objectif.trim()) + ' » — un petit pas à la fois, ça se construit.</p></div>' : "") +
        '</div>' : "";

    return entete("AD-09 · Ma synthèse", "🧩 Mon quotidien & mes forces", "À toi, et à personne d'autre.") +
      '<div class="carte"><div class="encadre lavande" style="margin:0"><span class="titre">À retenir</span>' +
        '<p>Ta vie quotidienne n\'a pas à être parfaite. Repérer ce qui te pèse, ce qui te fait du bien, et ce que tu sais faire — c\'est déjà avancer.</p></div></div>' +
      semaineHTML + forcesHTML + progHTML +
      '<div class="encadre beige"><p class="mini-note">Rien n\'est envoyé nulle part. Tu choisis si tu veux partager ça, et avec qui.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a9="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-a9="imprimer">🖨️ Garder en PDF</button>' +
        '<button class="btn btn-doux" data-a9="refaire">↺ Recommencer</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a9]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    var pr = document.getElementById("q-progres");
    if (pr) pr.addEventListener("input", function () { B.progres = pr.value; });
    var ob = document.getElementById("q-objectif");
    if (ob) ob.addEventListener("input", function () { B.objectif = ob.value; });
  }

  function action(b) {
    var type = b.getAttribute("data-a9");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { sauver(); enregistrerNotice(); toast("C'est gardé 🧩"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("quotidien-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("quotidien-brouillon", B); go("ad09-quotidien"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); enregistrerNotice(); go("ad09-notice"); return; }
    if (type === "pip") { B.items[b.getAttribute("data-key")] = parseInt(b.getAttribute("data-val"), 10); render(); return; }
    if (type === "passe") { B.items[b.getAttribute("data-key")] = "passe"; render(); return; }
    if (type === "multi") {
      var arr = arrOf(b.getAttribute("data-grp")), v = b.getAttribute("data-val"), i = arr.indexOf(v);
      if (i === -1) arr.push(v); else arr.splice(i, 1);
      render(); return;
    }
  }

  function enregistrerNotice() {
    Vault.ecrire("quotidien-notice", {
      date: MEM.auj(), forces: B.forces.slice(), interets: B.interets.slice(),
      objectif: (B.objectif || "").trim() || null
    });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("quotidien-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("ad09", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("ad09-quotidien", { render: renderQuotidien, bind: bindCommun });
    MEM.register("ad09-forces", { render: renderForces, bind: bindCommun });
    MEM.register("ad09-notice", { render: renderNotice, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
