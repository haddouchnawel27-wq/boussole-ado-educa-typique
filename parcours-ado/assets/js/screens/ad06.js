/* ===========================================================================
   AD-06 — « Mes relations »
   ---------------------------------------------------------------------------
   Programme 2. D'après le plan : les 3 regards (ce que je ressens / ce que
   l'autre pourrait vivre / le regard extérieur), poser une limite, dire non,
   demander une explication, et repérer une relation qui fait du mal.
   Garde-fous : « comprendre n'est pas excuser » ; un secret imposé n'est jamais
   un secret à garder ; tu as le droit de dire non, de partir, d'en parler.
   Aucun score, aucun diagnostic ; données privées et chiffrées.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  var LIMITES = [
    { id: "non", t: "« Non, je n'ai pas envie — et je n'ai pas à me justifier. »" },
    { id: "pourquoi", t: "« J'ai besoin de comprendre pourquoi avant de dire oui. »" },
    { id: "pasok", t: "« Ça, ça ne me va pas. On peut faire autrement ? »" },
    { id: "temps", t: "« Je te réponds plus tard — je ne décide pas maintenant. »" },
    { id: "insistance", t: "« Ma réponse ne change pas, même si tu redemandes. »" },
    { id: "sortie", t: "« Si je veux partir, j'envoie notre mot à un adulte de confiance — et il vient, sans questions ce soir-là. »" }
  ];
  function limite(id) { return LIMITES.filter(function (l) { return l.id === id; })[0]; }

  var DN = [
    { id: "d1", t: "Je sais dire non sans me sentir coupable." },
    { id: "d2", t: "Quand quelqu'un insiste, je finis souvent par céder.", inv: true }
  ];

  var SIGNES = [
    "On me demande de garder des secrets vis-à-vis de mes parents.",
    "On me pousse à m'éloigner de mes amis ou de ma famille.",
    "On me couvre de compliments ou de cadeaux d'un coup, sans raison.",
    "Mon « non » n'est pas respecté ; on insiste jusqu'à ce que je cède.",
    "On me demande des photos de moi.",
    "Je me sens souvent rabaissé·e, ou mal, après avoir parlé à cette personne.",
    "On me fait croire que « personne d'autre ne me comprend ».",
    "J'ai peur de cette personne, ou peur de lui dire non."
  ];

  /* ---------- État ---------- */
  var B = null, chargé = false;
  function vide() { return { situation: "", ressens: "", autre: "", exterieur: "", limiteFav: null, dn: {}, signes: [] }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.situation = d.situation || ""; b.ressens = d.ressens || ""; b.autre = d.autre || ""; b.exterieur = d.exterieur || "";
      b.limiteFav = d.limiteFav || null; b.dn = d.dn || {}; b.signes = Array.isArray(d.signes) ? d.signes : [];
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("relations-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }
  function pip05(key, cur) {
    var s = "";
    for (var v = 0; v <= 5; v++) {
      s += '<button class="pip" role="button" aria-pressed="' + (cur === v) + '" data-a6="pip" data-key="' + key + '" data-val="' + v + '" aria-label="' + v + ' sur 5">' +
        '<span class="lib" style="font-size:1rem;font-weight:800;color:var(--texte)">' + v + '</span></button>';
    }
    return '<div class="echelle" role="group">' + s + '</div>';
  }
  function itemEchelle(item) {
    var cur = B.dn[item.id];
    return '<div class="q-bloc" style="margin:1.1rem 0"><div class="q-titre" style="font-size:1rem;font-weight:600">' +
      esc(item.t) + (cur === "passe" ? ' <span class="mini-note">· passée</span>' : '') + '</div>' +
      pip05(item.id, typeof cur === "number" ? cur : -1) +
      '<button class="lien-doux" data-a6="passe" data-key="' + item.id + '" style="font-size:0.8rem;margin-top:0.3rem">je passe</button></div>';
  }

  /* ===========================================================================
     Écrans
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (B.ressens || B.signes.length || B.limiteFav);
    return entete("Programme 2 · AD-06", "🤝 Mes relations",
      "Une bonne relation respecte ton « non », tes limites, et ne te demande jamais de te cacher.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">Ce qu\'on va faire</span>' +
        '<p>Regarder une situation <strong>à trois niveaux</strong> pour y voir clair, s\'entraîner à <strong>poser une limite</strong>, et apprendre à <strong>repérer une relation qui fait du mal</strong>.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-a6="nav" data-to="ad06-regards">Reprendre →</button><button class="btn btn-ligne" data-a6="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-a6="nav" data-to="ad06-regards">Commencer →</button>') +
      '</div>';
  }

  function renderRegards() {
    return entete("AD-06 · 1 sur 3", "Les 3 regards", "Une situation qui te tracasse avec quelqu'un ? Regarde-la de trois façons — ça aide à décider plus juste.") +
      '<div class="carte">' +
        '<label class="q-titre" for="r-situation" style="display:block;margin-bottom:0.4rem">La situation <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<textarea id="r-situation" class="saisie" rows="2" placeholder="Ce qui s\'est passé, en deux mots…">' + esc(B.situation) + '</textarea>' +
      '</div>' +
      '<div class="carte"><div class="q-titre" style="color:var(--sarcelle)">👁️ Ce que MOI je ressens</div>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Dans mon corps, dans ma tête — vraiment.</p>' +
        '<textarea id="r-ressens" class="saisie" rows="2" placeholder="Moi, je ressens…">' + esc(B.ressens) + '</textarea></div>' +
      '<div class="carte"><div class="q-titre" style="color:var(--sarcelle)">🫥 Ce que l\'AUTRE pourrait vivre</div>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Comprendre ce que l\'autre vit ne veut pas dire lui donner raison, ni accepter ce qui te fait du mal.</p>' +
        '<textarea id="r-autre" class="saisie" rows="2" placeholder="L\'autre pourrait ressentir/penser…">' + esc(B.autre) + '</textarea></div>' +
      '<div class="carte"><div class="q-titre" style="color:var(--sarcelle)">🔭 Le regard EXTÉRIEUR</div>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Si quelqu\'un de neutre voyait la scène, qu\'est-ce qu\'il remarquerait ?</p>' +
        '<textarea id="r-ext" class="saisie" rows="2" placeholder="Vu de l\'extérieur…">' + esc(B.exterieur) + '</textarea></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a6="save-go" data-to="ad06-limites">Continuer →</button>' +
        '<button class="btn btn-doux" data-a6="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  function renderLimites() {
    var chips = LIMITES.map(function (l) {
      var on = B.limiteFav === l.id;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a6="limite" data-val="' + l.id + '" style="font-size:0.9rem;text-align:left">' + esc(l.t) + '</button>';
    }).join("");
    return entete("AD-06 · 2 sur 3", "Poser une limite, dire non", "Des phrases prêtes à l'emploi. Choisis-en une à garder sous la main — reformule avec tes mots.") +
      '<div class="carte"><div class="jetons" style="flex-direction:column;align-items:stretch" role="group">' + chips + '</div></div>' +
      '<div class="carte" style="background:transparent;box-shadow:none;padding:0"><p class="mini-note" style="margin-bottom:0.5rem">Et pour toi, en ce moment : <strong>0</strong> = pas du tout moi · <strong>5</strong> = carrément moi.</p></div>' +
      '<div class="carte">' + DN.map(itemEchelle).join("") + '</div>' +
      '<div class="encadre beige"><p>Dire non, c\'est un droit — pas une méchanceté. Et une limite qu\'on répète finit par se faire respecter.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-a6="nav" data-to="ad06-regards">← Retour</button>' +
        '<button class="btn btn-plein" data-a6="save-go" data-to="ad06-reperer">Continuer →</button>' +
      '</div>';
  }

  function renderReperer() {
    var jetons = SIGNES.map(function (s) {
      var on = B.signes.indexOf(s) !== -1;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a6="signe" data-val="' + esc(s) + '" style="text-align:left">' + esc(s) + '</button>';
    }).join("");
    return entete("AD-06 · 3 sur 3", "Repérer ce qui fait du mal", "Une relation qui fait du mal, ça peut ressembler à ça. Coche ce que tu reconnais — sans jugement.") +
      '<div class="carte"><div class="jetons" style="flex-direction:column;align-items:stretch" role="group">' + jetons + '</div></div>' +
      '<div class="encadre lavande"><span class="titre">La règle du secret</span>' +
        '<p>Une surprise, ça se révèle un jour. Mais <strong>un secret qu\'on t\'oblige à garder pour toujours</strong>, surtout vis-à-vis de tes parents, ce n\'est pas un secret : <strong>c\'est un piège</strong>. Tu as le droit d\'en parler — toujours.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-a6="nav" data-to="ad06-limites">← Retour</button>' +
        '<button class="btn btn-magenta" data-a6="finaliser">✨ Voir ce que ça me dit</button>' +
      '</div>';
  }

  function renderNotice() {
    var lim = limite(B.limiteFav);
    var nSignes = B.signes.length;
    var regardsRemplis = [B.ressens, B.autre, B.exterieur].filter(function (x) { return (x || "").trim(); }).length;

    var regardsHTML = regardsRemplis
      ? '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Mes 3 regards</h2>' +
        (B.ressens.trim() ? '<p>👁️ <strong>Moi :</strong> ' + esc(B.ressens.trim()) + '</p>' : "") +
        (B.autre.trim() ? '<p>🫥 <strong>L\'autre :</strong> ' + esc(B.autre.trim()) + '</p>' : "") +
        (B.exterieur.trim() ? '<p>🔭 <strong>De l\'extérieur :</strong> ' + esc(B.exterieur.trim()) + '</p>' : "") +
        '<p class="mini-note" style="margin-top:0.5rem">Regarder à trois niveaux t\'aide à décider plus juste — sans te trahir.</p></div>'
      : "";

    var limHTML = lim
      ? '<div class="encadre menthe"><span class="titre">🛡️ Ma phrase à garder</span><p>' + esc(lim.t) + '</p></div>' : "";

    var alerteHTML = nSignes
      ? '<div class="encadre lavande"><span class="titre">Ce que tu as coché mérite attention</span>' +
        '<p>Tu as reconnu <strong>' + nSignes + ' signe' + (nSignes > 1 ? "s" : "") + '</strong>. Ça ne veut pas dire que tout est grave — mais ça vaut le coup d\'en parler à un adulte de confiance. <strong>Tu n\'as rien fait de mal.</strong> Tu peux demander de l\'aide, même sans tout expliquer d\'un coup.</p>' +
        '<button class="btn btn-magenta btn-petit" data-act="aide" style="margin-top:0.6rem">🆘 Voir les numéros d\'aide</button></div>'
      : "";

    return entete("AD-06 · Mes relations", "🤝 Mes relations", "À toi, et à personne d'autre.") +
      '<div class="carte"><div class="encadre lavande" style="margin:0"><span class="titre">À retenir</span>' +
        '<p>Une bonne relation <strong>respecte ton non</strong>, tes limites, et ne te demande jamais de te cacher. Tu as le droit de dire non, de partir, et d\'en parler.</p></div></div>' +
      regardsHTML + limHTML + alerteHTML +
      '<div class="encadre beige"><p class="mini-note">Ce n\'est pas un diagnostic. Tu choisis si tu veux en parler, et à qui.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a6="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-a6="imprimer">🖨️ Garder en PDF</button>' +
        '<button class="btn btn-doux" data-a6="refaire">↺ Recommencer</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a6]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    bindText("r-situation", "situation"); bindText("r-ressens", "ressens");
    bindText("r-autre", "autre"); bindText("r-ext", "exterieur");
  }
  function bindText(id, key) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", function () { B[key] = el.value; });
  }

  function action(b) {
    var type = b.getAttribute("data-a6");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { enregistrerNotice(); sauver(); toast("C'est gardé 🤝"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("relations-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("relations-brouillon", B); go("ad06-regards"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); enregistrerNotice(); go("ad06-notice"); return; }
    if (type === "limite") { var v = b.getAttribute("data-val"); B.limiteFav = (B.limiteFav === v ? null : v); render(); return; }
    if (type === "pip") { B.dn[b.getAttribute("data-key")] = parseInt(b.getAttribute("data-val"), 10); render(); return; }
    if (type === "passe") { B.dn[b.getAttribute("data-key")] = "passe"; render(); return; }
    if (type === "signe") {
      var s = b.getAttribute("data-val"), i = B.signes.indexOf(s);
      if (i === -1) B.signes.push(s); else B.signes.splice(i, 1);
      render(); return;
    }
  }

  function enregistrerNotice() {
    Vault.ecrire("relations-notice", { date: MEM.auj(), limiteFav: B.limiteFav || null, nbSignes: B.signes.length });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("relations-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("ad06", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("ad06-regards", { render: renderRegards, bind: bindCommun });
    MEM.register("ad06-limites", { render: renderLimites, bind: bindCommun });
    MEM.register("ad06-reperer", { render: renderReperer, bind: bindCommun });
    MEM.register("ad06-notice", { render: renderNotice, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
