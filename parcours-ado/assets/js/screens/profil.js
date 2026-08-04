/* ===========================================================================
   « Ce qui me ressemble » — auto-reconnaissance du fonctionnement (ex-Questionnaire TND)
   ---------------------------------------------------------------------------
   Adaptation privée du questionnaire TND d'Educa Typique, recadrée aux rails :
   • AUCUN score, AUCUN niveau (« Signes marqués »), AUCUN diagnostic.
   • AUCUN appel réseau / clé API : 100 % local et chiffré (capEduca.ado.*).
   • Auto-reconnaissance (« ça me ressemble »), restitution QUALITATIVE.
   • Domaines de fonctionnement seulement (TDAH, HPI, TOP, TSA, DYS, anxiété).
     Pas de checklist auto-mutilation / idées noires / alimentation en libre
     service : à la place, un bloc bienveillant « si ça pèse au moral » qui
     oriente vers l'aide (3114) et vers un·e pro.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  var DOMS = [
    { id: "tdah", titre: "Attention & impulsivité", emo: "⚡",
      aide: "des routines courtes, un minuteur visible, découper les tâches, et bouger entre deux.",
      msg: "Tu reconnais plusieurs choses côté attention et impulsivité : une tête qui va vite, qui se lasse vite, qui réagit avant d'avoir réfléchi. Ce n'est pas de la paresse — c'est un mode de fonctionnement qui a juste besoin des bons outils.",
      questions: [
        "J'ai du mal à rester concentré·e sur quelque chose qui ne m'intéresse pas",
        "J'oublie facilement mes affaires, mes devoirs ou les consignes",
        "Je laisse beaucoup de choses à moitié finies",
        "Je me laisse distraire par la moindre chose autour de moi",
        "Je parle ou j'agis sans vraiment réfléchir avant",
        "J'ai du mal à attendre ou à rester tranquille longtemps",
        "Je m'organise vraiment difficilement (cartable, planning, agenda…)",
        "Ma motivation change énormément selon ce qui m'intéresse ou pas",
        "J'ai l'impression que ma tête tourne en permanence, même au calme"
      ] },
    { id: "hpi", titre: "Fonctionnement intense", emo: "🌟",
      aide: "de la nouveauté et du sens, des défis à ta hauteur, et des espaces où tes idées sont vraiment entendues.",
      msg: "Tu fonctionnes avec une tête qui capte beaucoup, va très vite et a besoin de sens pour s'engager. L'ennui est un vrai obstacle, et le sentiment d'être incompris·e aussi — c'est épuisant de faire semblant d'être « comme tout le monde ».",
      questions: [
        "Je comprends très vite quand quelque chose m'intéresse vraiment",
        "Je m'ennuie vite quand les tâches sont trop répétitives ou trop simples",
        "Je pose souvent des questions auxquelles les autres ne pensent pas",
        "Je ressens les injustices très intensément — pour moi et pour les autres",
        "Je remets en question les règles qui ne me semblent pas logiques",
        "Je me sens souvent incompris·e par les gens de mon âge",
        "J'ai des passions très intenses sur lesquelles je peux rester des heures",
        "Je suis épuisé·e de faire semblant d'être « comme tout le monde »"
      ] },
    { id: "top", titre: "Opposition & autorité", emo: "🔥",
      aide: "qu'on t'explique le pourquoi des règles, et qu'on te laisse une vraie marge de choix.",
      msg: "Tu as du mal avec les règles qui te semblent arbitraires et les situations où tu n'as pas ton mot à dire. Ce n'est pas du « mauvais caractère » — souvent, c'est un fort besoin de justice et une réactivité émotionnelle intense. Et ça, ça se travaille.",
      questions: [
        "Je discute ou conteste souvent les règles qu'on me donne",
        "J'ai du mal à accepter un « non » sans explication",
        "Je m'énerve facilement quand on me demande quelque chose",
        "Je cherche souvent à avoir le dernier mot",
        "Quand quelque chose tourne mal, c'est souvent la faute des autres selon moi",
        "Je suis souvent irritable ou susceptible",
        "Je peux être rancunier·e quand je me sens traité·e injustement"
      ] },
    { id: "tsa", titre: "Social & sensoriel", emo: "🌐",
      aide: "de la prévisibilité, des routines stables, des pauses au calme, et du temps seul·e pour recharger.",
      msg: "Certaines choses suggèrent que les interactions, l'imprévu et les changements sont particulièrement coûteux pour toi. Tu as peut-être besoin de bien plus de stabilité, de prévisibilité et d'espace que les gens autour de toi.",
      questions: [
        "Je comprends mal ce que les gens veulent dire « entre les lignes »",
        "Les interactions en groupe sont très épuisantes pour moi",
        "J'ai besoin de routines très stables pour me sentir bien",
        "Les changements imprévus me perturbent vraiment fort",
        "Mes intérêts sont très spécifiques et prennent beaucoup de place",
        "Je suis très sensible à certains bruits, lumières ou textures",
        "J'ai souvent l'impression de « jouer un rôle » pour être comme les autres",
        "Je préfère souvent être seul·e plutôt qu'en groupe"
      ] },
    { id: "dys", titre: "Apprentissages", emo: "📚",
      aide: "des aménagements (temps en plus, oral, outils numériques) — tes résultats écrits ne disent pas tout ce que tu sais.",
      msg: "Tes réponses indiquent des difficultés d'apprentissage qui vont au-delà de la motivation : lire, écrire, les maths te demandent un effort disproportionné. Un bilan spécialisé pourrait dire précisément ce qui se passe et débloquer des aménagements concrets.",
      questions: [
        "Je lis lentement et dois relire plusieurs fois pour comprendre",
        "J'ai beaucoup de fautes d'orthographe malgré mes efforts",
        "Mon écriture est peu lisible ou j'écris très lentement",
        "Je me fatigue vite quand j'écris à la main",
        "J'ai du mal en mathématiques (calcul, tables, problèmes)",
        "Prendre des notes en écoutant en même temps est très difficile",
        "Mes résultats écrits ne reflètent pas du tout ce que je sais vraiment"
      ] },
    { id: "anxiete", titre: "Anxiété & stress", emo: "😰",
      aide: "apprendre à faire redescendre (respiration, ancrage), préparer et décomposer, et en parler à quelqu'un.",
      msg: "L'anxiété semble prendre pas mal de place : inquiétudes, stress avant les évaluations, ruminations. C'est épuisant — et c'est vraiment quelque chose qui se travaille, tu n'as pas à faire avec toute seule.",
      questions: [
        "Je m'inquiète souvent pour beaucoup de choses en même temps",
        "J'ai peur de mal faire ou d'être jugé·e par les autres",
        "Avant les contrôles ou évaluations, je suis très stressé·e",
        "J'évite certaines situations parce qu'elles m'angoissent trop",
        "J'ai des maux de ventre, de tête ou d'autres douleurs liées au stress",
        "Je rumine — je repense en boucle à des situations passées",
        "J'ai du mal à m'endormir parce que ma tête ne s'arrête pas"
      ] }
  ];
  function dom(id) { return DOMS.filter(function (d) { return d.id === id; })[0]; }

  /* ---------- État ---------- */
  var B = null, chargé = false, idx = 0;
  function vide() { var o = {}; DOMS.forEach(function (d) { o[d.id] = []; }); return { sel: o }; }
  function assainir(d) {
    var b = vide();
    if (d && d.sel) DOMS.forEach(function (dm) { if (Array.isArray(d.sel[dm.id])) b.sel[dm.id] = d.sel[dm.id]; });
    return b;
  }
  function sauver() { if (B) Vault.ecrire("profil-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }

  /* ===========================================================================
     Écrans
     =========================================================================== */
  function renderIntro() {
    var reprise = B && DOMS.some(function (d) { return B.sel[d.id].length; });
    return entete("Programme 1 · Bonus", "🧩 Ce qui me ressemble",
      "Une façon de mieux comprendre ton fonctionnement. Pas pour te ranger dans une case — pour trouver ce qui t'aide.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">Comment ça marche</span>' +
        '<p>Tu coches simplement les phrases qui <strong>te ressemblent</strong>. À la fin, tu vois ce qui revient chez toi et <strong>ce qui peut aider</strong>.</p></div>' +
        '<div class="encadre beige"><p class="mini-note">⚠️ Ce n\'est <strong>pas un test</strong> et ça ne pose <strong>aucun diagnostic</strong>. Il n\'y a ni note, ni « niveau ». C\'est juste pour toi — et tu choisis si tu veux en parler à un·e pro.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-ap="start">Reprendre →</button><button class="btn btn-ligne" data-ap="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-ap="start">Commencer →</button>') +
      '</div>';
  }

  function renderQ() {
    var d = DOMS[idx];
    var sel = B.sel[d.id];
    var jetons = d.questions.map(function (q, i) {
      var on = sel.indexOf(i) !== -1;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-ap="q" data-i="' + i + '" style="text-align:left">' + (on ? "✓ " : "") + esc(q) + '</button>';
    }).join("");
    var dernier = idx === DOMS.length - 1;
    return entete("Ce qui me ressemble · " + (idx + 1) + " sur " + DOMS.length, d.emo + " " + d.titre,
      "Coche ce qui te ressemble. Rien, un peu, beaucoup — comme c'est vrai pour toi.") +
      '<div class="carte"><div class="jetons" style="flex-direction:column;align-items:stretch" role="group">' + jetons + '</div></div>' +
      '<div class="actions-bas">' +
        (idx > 0 ? '<button class="btn btn-ligne" data-ap="prev">← Précédent</button>' : '') +
        (dernier
          ? '<button class="btn btn-magenta" data-ap="finaliser">✨ Voir ce qui me ressemble</button>'
          : '<button class="btn btn-plein" data-ap="next">Suivant →</button>') +
      '</div>' +
      '<div class="actions-bas" style="margin-top:0.6rem"><button class="btn btn-doux btn-bloc" data-ap="save-quitter">Quitter (je garde tout)</button></div>';
  }

  function renderNotice() {
    // domaine « reconnu » = au moins 40 % des phrases cochées
    var reconnus = DOMS.filter(function (d) {
      return B.sel[d.id].length >= Math.ceil(d.questions.length * 0.4);
    });

    var corps = reconnus.length
      ? reconnus.map(function (d) {
        return '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.4rem">' + d.emo + ' ' + esc(d.titre) + '</h2>' +
          '<p>' + esc(d.msg) + '</p>' +
          '<div class="encadre ciel" style="margin-bottom:0"><p><strong>Ce qui peut aider :</strong> ' + esc(d.aide) + '</p></div></div>';
      }).join("")
      : '<div class="carte"><p>Tu n\'as pas coché grand-chose de marqué aujourd\'hui — et c\'est très bien. Si quelque chose te préoccupe quand même sur ton fonctionnement, tu peux en parler à un adulte de confiance ou à un·e pro.</p></div>';

    return entete("Ce qui me ressemble", "🧩 Ce qui me ressemble", "À toi, et à personne d'autre.") +
      '<div class="carte"><div class="encadre lavande" style="margin:0"><span class="titre">À retenir</span>' +
        '<p>Ce ne sont pas des étiquettes. Fonctionner différemment, ça se comprend, ça s\'accompagne — et ça peut devenir une force. Ce n\'est pas un diagnostic : en parler à un·e pro aide à y voir clair.</p></div></div>' +
      corps +
      '<div class="encadre lavande"><span class="titre">💛 Et si ça pèse au moral ?</span>' +
        '<p>Parfois, ce n\'est pas qu\'une question de fonctionnement : la tristesse, le vide, des pensées noires, un rapport compliqué à la nourriture… ça peut peser fort. Tu n\'as pas à porter ça tout·e seul·e. Parles-en à un adulte de confiance, et si tu veux quelqu\'un tout de suite, les numéros ci-dessous sont gratuits et confidentiels.</p>' +
        '<button class="btn btn-magenta btn-petit" data-act="aide" style="margin-top:0.6rem">🆘 Voir les numéros d\'aide</button></div>' +
      '<div class="encadre beige"><p class="mini-note">Rien n\'est envoyé nulle part : tes réponses restent sur ton appareil. Tu choisis si tu veux les partager, et avec qui.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-ap="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-ap="imprimer">🖨️ Garder en PDF</button>' +
        '<button class="btn btn-doux" data-ap="refaire">↺ Recommencer</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-ap]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
  }

  function action(b) {
    var type = b.getAttribute("data-ap");
    if (type === "start") { idx = 0; go("profil-q"); return; }
    if (type === "recommencer") { B = vide(); idx = 0; Vault.ecrire("profil-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); idx = 0; Vault.ecrire("profil-brouillon", B); go("profil-q"); return; }
    if (type === "prev") { if (idx > 0) idx--; render(); return; }
    if (type === "next") { if (idx < DOMS.length - 1) idx++; sauver(); render(); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { sauver(); enregistrerNotice(); toast("C'est gardé 🧩"); go("accueil"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); enregistrerNotice(); go("profil-notice"); return; }
    if (type === "q") {
      var d = DOMS[idx], i = parseInt(b.getAttribute("data-i"), 10), arr = B.sel[d.id], p = arr.indexOf(i);
      if (p === -1) arr.push(i); else arr.splice(p, 1);
      render(); return;
    }
  }

  function enregistrerNotice() {
    var reconnus = DOMS.filter(function (d) { return B.sel[d.id].length >= Math.ceil(d.questions.length * 0.4); }).map(function (d) { return d.id; });
    Vault.ecrire("profil-notice", { date: MEM.auj(), reconnus: reconnus });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("profil-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("profil", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("profil-q", { render: renderQ, bind: bindCommun });
    MEM.register("profil-notice", { render: renderNotice, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
