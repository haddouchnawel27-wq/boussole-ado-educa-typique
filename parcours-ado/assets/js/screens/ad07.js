/* ===========================================================================
   AD-07 — « Reprendre confiance »
   ---------------------------------------------------------------------------
   Programme 2. S'appuie sur le plan (erreur/échec/identité, perfectionnisme,
   comparaison, efforts invisibles, discours intérieur, petit défi, preuve de
   progression) + le doc « Biais cognitifs » (pensées pièges + questions
   correctives, « que dirais-tu à un·e ami·e ? »).
   Garde-fous : jamais d'étiquette ni de score ; « se tromper ≠ ma valeur » ;
   « je passe » possible ; données privées et chiffrées (capEduca.ado.*).
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  /* Pensées pièges (biais adaptés ado) + question corrective */
  var PIEGES = [
    { id: "toutrien", lib: "Tout ou rien", ex: "« C'est soit parfait, soit nul. »", q: "Et si la vérité était au milieu ? À combien sur 10, honnêtement ?" },
    { id: "cata", lib: "Le pire va arriver", ex: "« Ça va forcément mal finir. »", q: "Le pire est-il vraiment probable, ou seulement redouté ?" },
    { id: "lecture", lib: "Lire dans les pensées", ex: "« Ils me trouvent nul·le. »", q: "Qu'est-ce que je sais vraiment, et qu'est-ce que j'imagine ?" },
    { id: "toujours", lib: "« Toujours / jamais »", ex: "« J'échoue à chaque fois. »", q: "C'est ce cas précis, ou vraiment « toujours » ?" },
    { id: "filtre", lib: "Ne voir que le négatif", ex: "« Je ne retiens que ce qui a raté. »", q: "Qu'est-ce qui a marché, même un peu ?" },
    { id: "faute", lib: "Tout est ma faute", ex: "« Si ça a raté, c'est moi. »", q: "Quelle part est vraiment à moi, parmi tout ce qui a joué ?" },
    { id: "ressenti", lib: "Je le sens, donc c'est vrai", ex: "« Je me sens nul·le, donc je le suis. »", q: "Ce que je ressens prouve-t-il ce qui est réel ?" }
  ];
  function piege(id) { return PIEGES.filter(function (p) { return p.id === id; })[0]; }

  var ITEMS = [
    { id: "i1", t: "Quand je rate, je me parle comme je parlerais à un·e ami·e." },
    { id: "i2", t: "Pour moi, si ce n'est pas parfait, ça ne vaut rien.", inv: true },
    { id: "i3", t: "Je me compare aux autres et j'en sors souvent dévalorisé·e.", inv: true },
    { id: "i4", t: "Je remarque les efforts que je fais, même quand ça ne se voit pas." },
    { id: "i5", t: "Une erreur, pour moi, ça veut dire que je suis nul·le.", inv: true }
  ];

  /* ---------- État ---------- */
  var B = null, chargé = false;
  function vide() { return { situation: "", piege: null, ami: "", items: {}, preuve: "", defi: "" }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.situation = d.situation || ""; b.piege = d.piege || null; b.ami = d.ami || "";
      b.items = d.items || {}; b.preuve = d.preuve || ""; b.defi = d.defi || "";
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("confiance-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }
  function pip05(key, cur) {
    var s = "";
    for (var v = 0; v <= 5; v++) {
      s += '<button class="pip" role="button" aria-pressed="' + (cur === v) + '" data-a7="pip" data-key="' + key + '" data-val="' + v + '" aria-label="' + v + ' sur 5">' +
        '<span class="lib" style="font-size:1rem;font-weight:800;color:var(--texte)">' + v + '</span></button>';
    }
    return '<div class="echelle" role="group">' + s + '</div>';
  }
  function itemEchelle(item) {
    var cur = B.items[item.id];
    var passee = cur === "passe";
    return '<div class="q-bloc" style="margin:1.1rem 0"><div class="q-titre" style="font-size:1rem;font-weight:600">' +
      esc(item.t) + (passee ? ' <span class="mini-note">· passée</span>' : '') + '</div>' +
      pip05(item.id, typeof cur === "number" ? cur : -1) +
      '<button class="lien-doux" data-a7="passe" data-key="' + item.id + '" style="font-size:0.8rem;margin-top:0.3rem">je passe</button></div>';
  }

  /* ===========================================================================
     Écrans
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (B.piege || Object.keys(B.items).length || B.preuve);
    return entete("Programme 2 · AD-07", "🌱 Reprendre confiance",
      "La confiance, ce n'est pas un truc qu'on a ou qu'on n'a pas. Ça se construit, petit à petit. Et tu n'es pas tes erreurs.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">L\'idée</span>' +
        '<p>On va repérer les <strong>pensées pièges</strong> qui te tirent vers le bas, apprendre à leur répondre, et finir par <strong>une petite preuve que tu avances</strong>.</p></div>' +
        '<div class="encadre lavande"><p>Se tromper fait partie d\'apprendre. Ça ne dit <strong>rien</strong> de ta valeur.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-a7="nav" data-to="ad07-pensees">Reprendre →</button><button class="btn btn-ligne" data-a7="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-a7="nav" data-to="ad07-pensees">Commencer →</button>') +
      '</div>';
  }

  function renderPensees() {
    var chips = PIEGES.map(function (p) {
      var on = B.piege === p.id;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a7="piege" data-val="' + p.id + '" style="font-size:0.92rem">' + esc(p.lib) + '</button>';
    }).join("");
    var pSel = piege(B.piege);
    return entete("AD-07 · 1 sur 3", "Mes pensées pièges", "Ces petites phrases automatiques qui font mal — tout le monde en a. Les repérer, c'est déjà reprendre la main.") +
      '<div class="carte">' +
        '<label class="q-titre" for="c-situation" style="display:block;margin-bottom:0.4rem">Une situation récente où tu t\'es senti·e nul·le ? <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<textarea id="c-situation" class="saisie" rows="2" placeholder="Ce qui s\'est passé, en deux mots…">' + esc(B.situation) + '</textarea>' +
      '</div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">Quelle pensée piège te ressemble le plus, là ?</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Choisis-en une (ou aucune).</p>' +
        '<div class="jetons" role="group">' + chips + '</div>' +
        (pSel ? '<div class="encadre ciel" style="margin-top:0.9rem"><span class="titre">' + esc(pSel.ex) + '</span><p><strong>La question qui aide :</strong> ' + esc(pSel.q) + '</p></div>' : "") +
      '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="c-ami" style="display:block;margin-bottom:0.4rem">Et si un·e pote vivait exactement ça, tu lui dirais quoi ?</label>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Souvent, on est bien plus doux avec les autres qu\'avec soi.</p>' +
        '<textarea id="c-ami" class="saisie" rows="2" placeholder="Ce que je dirais à un·e ami·e…">' + esc(B.ami) + '</textarea>' +
      '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a7="save-go" data-to="ad07-regard">Continuer →</button>' +
        '<button class="btn btn-doux" data-a7="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  function renderRegard() {
    return entete("AD-07 · 2 sur 3", "Mon regard sur moi", "Pas de bonne réponse. Juste pour voir où tu en es.") +
      '<div class="carte" style="background:transparent;box-shadow:none;padding:0"><p class="mini-note" style="margin-bottom:0.5rem">Sur chaque phrase : <strong>0</strong> = pas du tout moi · <strong>5</strong> = carrément moi.</p></div>' +
      '<div class="carte">' + ITEMS.map(itemEchelle).join("") + '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-a7="nav" data-to="ad07-pensees">← Retour</button>' +
        '<button class="btn btn-plein" data-a7="save-go" data-to="ad07-defi">Continuer →</button>' +
      '</div>';
  }

  function renderDefi() {
    return entete("AD-07 · 3 sur 3", "Ma preuve, mon défi", "On termine par du concret — parce que la confiance vient en faisant, pas en attendant.") +
      '<div class="carte">' +
        '<label class="q-titre" for="c-preuve" style="display:block;margin-bottom:0.4rem">🌟 Ma preuve de progression</label>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Une chose qui va un peu mieux qu\'avant, ou une petite victoire récente. Même minuscule.</p>' +
        '<textarea id="c-preuve" class="saisie" rows="2" placeholder="Ce qui a un peu progressé…">' + esc(B.preuve) + '</textarea>' +
      '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="c-defi" style="display:block;margin-bottom:0.4rem">🎯 Mon petit défi réaliste</label>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Un tout petit pas, faisable cette semaine. Petit = tenable.</p>' +
        '<textarea id="c-defi" class="saisie" rows="2" placeholder="Mon défi de la semaine…">' + esc(B.defi) + '</textarea>' +
      '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-a7="nav" data-to="ad07-regard">← Retour</button>' +
        '<button class="btn btn-magenta" data-a7="finaliser">✨ Voir ce que ça me dit</button>' +
      '</div>';
  }

  function renderNotice() {
    var pSel = piege(B.piege);
    var dur = (typeof B.items.i5 === "number" && B.items.i5 >= 4) || (typeof B.items.i2 === "number" && B.items.i2 >= 4);

    var piegeHTML = pSel
      ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Ma pensée piège repérée</h2>' +
        '<p>En ce moment, c\'est <strong>' + esc(pSel.lib.toLowerCase()) + '</strong> ' + esc(pSel.ex) + '</p>' +
        '<div class="encadre ciel"><p><strong>Ma parade :</strong> ' + esc(pSel.q) + '</p></div></div>'
      : "";

    var amiHTML = (B.ami || "").trim()
      ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Ce que je dirais à un·e pote</h2>' +
        '<p style="font-style:italic">« ' + esc(B.ami.trim()) + ' »</p>' +
        '<p class="mini-note" style="margin-top:0.5rem">Ce que tu dirais à un·e ami·e, tu as le droit de te le dire à toi aussi. C\'est la même personne qui mérite de la douceur.</p></div>'
      : "";

    var preuveHTML = (B.preuve || "").trim()
      ? '<div class="encadre menthe"><span class="titre">🌟 Ma preuve que j\'avance</span><p>« ' + esc(B.preuve.trim()) + ' » — garde-la en tête les jours où tu doutes.</p></div>' : "";
    var defiHTML = (B.defi || "").trim()
      ? '<div class="encadre jaune"><span class="titre">🎯 Mon défi de la semaine</span><p>« ' + esc(B.defi.trim()) + ' » — petit, donc tenable. Une seule fois suffit à commencer.</p></div>' : "";

    var durHTML = dur
      ? '<div class="encadre lavande"><span class="titre">Un mot, juste pour toi</span><p>Tu sembles très dur·e avec toi en ce moment. Cette voix qui dit « tu es nul·le », ce n\'est pas la vérité — c\'est une pensée piège qui parle fort. Si elle prend trop de place, parles-en à quelqu\'un de confiance. Tu n\'as pas à la croire.</p>' +
        '<button class="btn btn-magenta btn-petit" data-act="aide" style="margin-top:0.6rem">🆘 Voir les numéros d\'aide</button></div>' : "";

    return entete("AD-07 · Ma bulle de confiance", "🌱 Reprendre confiance", "À toi, et à personne d'autre.") +
      '<div class="carte"><div class="encadre lavande" style="margin:0"><span class="titre">À retenir</span>' +
        '<p>Se tromper fait partie d\'apprendre. Ça ne dit <strong>rien</strong> de ta valeur. La confiance se muscle, un petit pas à la fois.</p></div></div>' +
      piegeHTML + amiHTML +
      (preuveHTML || defiHTML ? '<div class="carte">' + preuveHTML + defiHTML + '</div>' : "") +
      durHTML +
      '<div class="encadre beige"><p class="mini-note">Ce n\'est pas un diagnostic. C\'est une photo de maintenant — et ça change. Tu choisis si tu veux la partager, et avec qui.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a7="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-a7="imprimer">🖨️ Garder en PDF</button>' +
        '<button class="btn btn-doux" data-a7="refaire">↺ Recommencer</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a7]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    bindText("c-situation", "situation");
    bindText("c-ami", "ami");
    bindText("c-preuve", "preuve");
    bindText("c-defi", "defi");
  }
  function bindText(id, key) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", function () { B[key] = el.value; });
  }

  function action(b) {
    var type = b.getAttribute("data-a7");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { enregistrerNotice(); sauver(); toast("C'est gardé 🌱"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("confiance-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("confiance-brouillon", B); go("ad07-pensees"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); enregistrerNotice(); go("ad07-notice"); return; }
    if (type === "piege") { var v = b.getAttribute("data-val"); B.piege = (B.piege === v ? null : v); render(); return; }
    if (type === "pip") { B.items[b.getAttribute("data-key")] = parseInt(b.getAttribute("data-val"), 10); render(); return; }
    if (type === "passe") { B.items[b.getAttribute("data-key")] = "passe"; render(); return; }
  }

  function enregistrerNotice() {
    Vault.ecrire("confiance-notice", {
      date: MEM.auj(), piege: B.piege || null,
      preuve: (B.preuve || "").trim() || null, defi: (B.defi || "").trim() || null
    });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("confiance-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("ad07", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("ad07-pensees", { render: renderPensees, bind: bindCommun });
    MEM.register("ad07-regard", { render: renderRegard, bind: bindCommun });
    MEM.register("ad07-defi", { render: renderDefi, bind: bindCommun });
    MEM.register("ad07-notice", { render: renderNotice, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
