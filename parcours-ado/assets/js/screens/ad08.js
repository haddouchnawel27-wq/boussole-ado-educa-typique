/* ===========================================================================
   AD-08 — « Ma sécurité numérique »
   ---------------------------------------------------------------------------
   Programme 2. D'après le plan : harcèlement, cyberharcèlement, pression,
   sextorsion, diffusion d'images, manipulation, conservation des preuves,
   recours à un adulte. Bouton permanent « demander de l'aide sans tout
   expliquer » — il PRÉPARE une demande ; il ne déclenche ni diagnostic, ni
   surveillance secrète, ni alerte automatique cachée.
   ⚠️ Contenu 100 % générique + numéros vérifiés. N'intègre PAS la série
   « Bouclier / Inner Safe » (propriété d'un tiers).
   Aucun score, données privées et chiffrées (capEduca.ado.*).
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  var SITUATIONS = [
    "On me harcèle (moqueries, insultes, exclusion), en ligne ou en vrai.",
    "On me menace de diffuser une photo ou une vidéo de moi (ou on l'a déjà fait).",
    "Quelqu'un me fait du chantage pour que j'envoie des images ou de l'argent.",
    "Une image de moi circule sans mon accord.",
    "Quelqu'un me met la pression pour faire des choses que je ne veux pas.",
    "Je reçois des messages qui me mettent très mal à l'aise."
  ];

  var REFLEXES = [
    { t: "Ce n'est pas ta faute.", d: "Même si tu as envoyé quelque chose, même si tu es allé·e au rendez-vous. La faute est à celui qui manipule." },
    { t: "Ne cède pas au chantage.", d: "Ne paie pas, n'envoie pas plus. Ça ne s'arrête jamais en obéissant — au contraire." },
    { t: "Garde les preuves.", d: "Fais des captures d'écran (sans les rediffuser). Elles aideront un adulte ou le 3018." },
    { t: "Bloque et signale.", d: "Bloque la personne et signale le compte / le message dans l'appli." },
    { t: "Parles-en à un adulte de confiance.", d: "Tu n'as pas à gérer ça seul·e. Un parent, un prof, l'infirmière, un·e proche." },
    { t: "Appelle le 3018.", d: "Le numéro des violences numériques (harcèlement, images). Gratuit, confidentiel, anonyme." }
  ];

  var BESOINS = [
    "qu'on m'aide à faire supprimer une image",
    "que le harcèlement s'arrête",
    "parler à quelqu'un",
    "juste que quelqu'un de confiance soit au courant",
    "de l'aide pour bloquer / signaler"
  ];

  /* ---------- État ---------- */
  var B = null, chargé = false;
  function vide() { return { situations: [], besoins: [], aQui: "" }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.situations = Array.isArray(d.situations) ? d.situations : [];
      b.besoins = Array.isArray(d.besoins) ? d.besoins : [];
      b.aQui = d.aQui || "";
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("securite-num-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }

  /* ===========================================================================
     Écrans
     =========================================================================== */
  function renderIntro() {
    return entete("Programme 2 · AD-08", "🛡️ Ma sécurité numérique",
      "En ligne aussi, tu as des droits. Et quoi qu'il arrive, ce n'est jamais ta faute.") +
      '<div class="carte" style="border:2px solid var(--magenta)">' +
        '<h2 style="font-size:1.1rem;margin-bottom:0.3rem;color:var(--sarcelle)">😮‍💨 Tu as besoin d\'aide, là, tout de suite ?</h2>' +
        '<p class="mini-note" style="margin-bottom:0.7rem">Tu peux préparer une demande d\'aide <strong>sans avoir à tout raconter</strong>. Rien n\'est envoyé automatiquement — c\'est toi qui la montres, à qui tu veux.</p>' +
        '<button class="btn btn-magenta btn-bloc" data-a8="nav" data-to="ad08-carte">🆘 Demander de l\'aide sans tout expliquer</button>' +
      '</div>' +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">Ce qu\'on va voir</span>' +
        '<p>Reconnaître ce qui n\'est pas normal en ligne, avoir les bons réflexes, et savoir vers qui te tourner.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a8="nav" data-to="ad08-reperer">Commencer →</button>' +
      '</div>';
  }

  function renderReperer() {
    var jetons = SITUATIONS.map(function (s) {
      var on = B.situations.indexOf(s) !== -1;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a8="situation" data-val="' + esc(s) + '" style="text-align:left">' + esc(s) + '</button>';
    }).join("");
    return entete("AD-08 · 1 sur 2", "Ce qui n'est pas normal", "Coche si l'une de ces situations te concerne. Personne ne le verra — c'est juste pour toi.") +
      '<div class="carte"><div class="jetons" style="flex-direction:column;align-items:stretch" role="group">' + jetons + '</div></div>' +
      (B.situations.length
        ? '<div class="encadre lavande"><p><strong>Ce que tu vis a un nom, et ce n\'est pas ta faute.</strong> Tu n\'as pas à rester seul·e avec ça. La suite te donne les bons réflexes — et tu peux préparer une demande d\'aide quand tu veux.</p>' +
          '<button class="btn btn-magenta btn-petit" data-a8="nav" data-to="ad08-carte" style="margin-top:0.6rem">🆘 Préparer ma demande d\'aide</button></div>'
        : '') +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a8="save-go" data-to="ad08-reflexes">Les bons réflexes →</button>' +
        '<button class="btn btn-doux" data-a8="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  function renderReflexes() {
    var liste = REFLEXES.map(function (r) {
      return '<div class="encadre ciel" style="margin:0.5rem 0"><span class="titre">✅ ' + esc(r.t) + '</span><p>' + esc(r.d) + '</p></div>';
    }).join("");
    return entete("AD-08 · 2 sur 2", "Les bons réflexes", "Si quelque chose dérape en ligne, voilà quoi faire.") +
      '<div class="carte">' + liste + '</div>' +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">Deux règles simples, tout le temps</h2>' +
        '<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem">' +
        '<li>🔒 <strong>Aucune donnée perso</strong> à des inconnus : nom complet, adresse, établissement, quartier.</li>' +
        '<li>📸 <strong>Aucune image de toi que tu ne montrerais pas à ta classe.</strong> C\'est le test le plus simple.</li>' +
        '</ul>' +
        '<p class="mini-note" style="margin-top:0.7rem">Et rappelle-toi : un secret qu\'on t\'oblige à garder pour toujours, ce n\'est pas un secret — c\'est un piège.</p>' +
      '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-magenta" data-a8="nav" data-to="ad08-carte">🆘 Préparer ma demande d\'aide</button>' +
        '<button class="btn btn-ligne" data-nav="accueil">Retour à l\'accueil</button>' +
      '</div>';
  }

  function renderCarte() {
    var besoins = BESOINS.map(function (bz) {
      var on = B.besoins.indexOf(bz) !== -1;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a8="besoin" data-val="' + esc(bz) + '" style="text-align:left">' + esc(bz) + '</button>';
    }).join("");

    var lignesBesoins = B.besoins.length ? B.besoins.map(function (x) { return "• " + x; }).join("\n") : "• j'ai besoin d'aide";
    var message = "Bonjour,\nJ'ai un problème en ligne et j'ai besoin d'aide.\n" + lignesBesoins +
      "\nJe ne suis pas prêt·e à tout raconter maintenant — mais j'ai besoin qu'on m'aide.\nEst-ce que tu peux m'aider, s'il te plaît ?";

    return entete("AD-08 · Ma demande d'aide", "🆘 Demander de l'aide sans tout expliquer",
      "Tu prépares un petit message. Tu le montres à qui tu veux, quand tu veux. Rien n'est envoyé tout seul.") +
      '<div class="carte">' +
        '<div class="q-titre" style="margin-bottom:0.3rem">De quoi j\'aurais besoin ?</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Coche ce qui te parle (ou rien).</p>' +
        '<div class="jetons" style="flex-direction:column;align-items:stretch" role="group">' + besoins + '</div>' +
      '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="c-aqui" style="display:block;margin-bottom:0.4rem">À qui je pourrais le montrer ? <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<input id="c-aqui" class="saisie" placeholder="un parent, un prof, l\'infirmière, un·e proche…" value="' + esc(B.aQui) + '">' +
      '</div>' +
      '<div class="carte">' +
        '<span class="ruban" style="background:var(--menthe);color:var(--charbon)">Mon message prêt à montrer</span>' +
        '<p style="white-space:pre-wrap;background:var(--casse);border-radius:12px;padding:0.9rem 1rem;font-size:0.95rem">' + esc(message) + '</p>' +
        '<p class="mini-note">Tu peux l\'imprimer, ou juste montrer cet écran à la personne. Tu restes maître de ce que tu dis ensuite.</p>' +
      '</div>' +
      '<div class="encadre beige"><span class="titre">📞 Et si tu veux de l\'aide tout de suite</span>' +
        '<p><strong>3018</strong> — violences numériques, harcèlement, images. Gratuit et confidentiel.</p>' +
        '<button class="btn btn-magenta btn-petit" data-act="aide" style="margin-top:0.4rem">Voir tous les numéros</button></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a8="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-a8="imprimer">🖨️ Imprimer ma demande</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a8]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    var aq = document.getElementById("c-aqui");
    if (aq) aq.addEventListener("input", function () { B.aQui = aq.value; });
  }

  function action(b) {
    var type = b.getAttribute("data-a8");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { sauver(); toast("C'est gardé 🛡️"); go("accueil"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "situation") {
      var s = b.getAttribute("data-val"), i = B.situations.indexOf(s);
      if (i === -1) B.situations.push(s); else B.situations.splice(i, 1);
      render(); return;
    }
    if (type === "besoin") {
      var v = b.getAttribute("data-val"), j = B.besoins.indexOf(v);
      if (j === -1) B.besoins.push(v); else B.besoins.splice(j, 1);
      render(); return;
    }
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("securite-num-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("ad08", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("ad08-reperer", { render: renderReperer, bind: bindCommun });
    MEM.register("ad08-reflexes", { render: renderReflexes, bind: bindCommun });
    MEM.register("ad08-carte", { render: renderCarte, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
