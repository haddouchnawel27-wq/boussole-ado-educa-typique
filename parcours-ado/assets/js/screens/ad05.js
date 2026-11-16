/* ===========================================================================
   AD-05 — « Mes valeurs »
   ---------------------------------------------------------------------------
   Fidèle à l'OUTIL 8 du cahier d'outils ado (tri 20 → ~10 → 5 → 3) + une touche
   de l'OUTIL 11 (« le conseil de mon futur moi ») en clôture.
   Garde-fous : la foi / spiritualité est une valeur possible parmi d'autres,
   JAMAIS imposée. Aucun score. « Je passe » possible (on peut ne pas remplir les
   réflexions). Données privées et chiffrées (capEduca.ado.*).
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  var VALEURS = [
    { id: "liberte", lib: "Liberté", emo: "🕊️" },
    { id: "securite", lib: "Sécurité", emo: "🛡️" },
    { id: "famille", lib: "Famille", emo: "🏡" },
    { id: "amitie", lib: "Amitié", emo: "🌻" },
    { id: "justice", lib: "Justice", emo: "⚖️" },
    { id: "creativite", lib: "Créativité", emo: "🎨" },
    { id: "reussite", lib: "Réussite", emo: "🏆" },
    { id: "argent", lib: "Argent", emo: "💶" },
    { id: "entraide", lib: "Entraide", emo: "💚" },
    { id: "respect", lib: "Respect", emo: "🎗️" },
    { id: "aventure", lib: "Aventure", emo: "🧭" },
    { id: "stabilite", lib: "Stabilité", emo: "⚓" },
    { id: "connaissance", lib: "Connaissance", emo: "📚" },
    { id: "spiritualite", lib: "Spiritualité", emo: "✨" },
    { id: "nature", lib: "Nature", emo: "🌿" },
    { id: "reconnaissance", lib: "Reconnaissance", emo: "🌟" },
    { id: "autonomie", lib: "Autonomie", emo: "🔑" },
    { id: "courage", lib: "Courage", emo: "🦁" },
    { id: "transmission", lib: "Transmission", emo: "🔥" },
    { id: "equilibre", lib: "Équilibre", emo: "☯️" }
  ];
  function val(id) { return VALEURS.filter(function (v) { return v.id === id; })[0]; }

  /* ---------- État ---------- */
  var B = null, chargé = false;
  function vide() { return { large: [], cinq: [], trois: [], pourquoi: "", difficile: null, action: "" }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.large = Array.isArray(d.large) ? d.large : [];
      b.cinq = (Array.isArray(d.cinq) ? d.cinq : []).filter(function (x) { return b.large.indexOf(x) !== -1; });
      b.trois = (Array.isArray(d.trois) ? d.trois : []).filter(function (x) { return b.cinq.indexOf(x) !== -1; });
      b.pourquoi = d.pourquoi || ""; b.difficile = d.difficile || null; b.action = d.action || "";
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("valeurs-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }
  function chips(options, selection, dataAttr) {
    return '<div class="jetons" role="group">' + options.map(function (id) {
      var v = val(id), on = selection.indexOf(id) !== -1;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a5="' + dataAttr + '" data-val="' + id + '" style="font-size:0.95rem">' + v.emo + ' ' + esc(v.lib) + '</button>';
    }).join("") + '</div>';
  }

  /* ===========================================================================
     Écrans
     =========================================================================== */
  function renderIntro() {
    var reprise = B && B.large.length;
    return entete("Programme 1 · AD-05", "⭐ Mes valeurs",
      "Tes valeurs, c'est ta boussole intérieure : ce qui compte vraiment pour toi. Pas ce qui « devrait » compter.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">Comment ça marche</span>' +
        '<p>Tu vas partir d\'une liste, garder celles qui te parlent, puis les resserrer jusqu\'à <strong>ton top 3</strong>. Il n\'y a pas de bonne réponse.</p></div>' +
        '<div class="encadre beige"><p class="mini-note">La <strong>spiritualité / la foi</strong> est une valeur possible dans la liste — comme les autres. Tu la gardes si elle compte pour toi, tu la laisses sinon. C\'est ton choix, à toi seul·e.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-a5="nav" data-to="ad05-large">Reprendre →</button><button class="btn btn-ligne" data-a5="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-a5="nav" data-to="ad05-large">Commencer →</button>') +
      '</div>';
  }

  function renderLarge() {
    var n = B.large.length;
    return entete("AD-05 · Étape 1 sur 3", "Ce qui me parle", "Choisis toutes les valeurs qui comptent pour toi — vise une dizaine, sans te forcer.") +
      '<div class="carte">' + chips(VALEURS.map(function (v) { return v.id; }), B.large, "large") +
        '<p class="mini-note" style="margin-top:0.8rem">' + n + ' sélectionnée' + (n > 1 ? "s" : "") + '.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a5="save-go" data-to="ad05-cinq"' + (n < 3 ? " disabled" : "") + '>Continuer →</button>' +
        '<button class="btn btn-doux" data-a5="save-quitter">Quitter (je garde tout)</button>' +
      '</div>' + (n < 3 ? '<p class="hint">Choisis-en au moins 3 pour continuer.</p>' : "");
  }

  function renderCinq() {
    var n = B.cinq.length;
    return entete("AD-05 · Étape 2 sur 3", "Mes 5 plus importantes", "Parmi celles que tu as gardées, lesquelles comptent le plus ? (jusqu'à 5)") +
      '<div class="carte">' + chips(B.large, B.cinq, "cinq") +
        '<p class="mini-note" style="margin-top:0.8rem">' + n + ' sur 5 max.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-a5="nav" data-to="ad05-large">← Retour</button>' +
        '<button class="btn btn-plein" data-a5="save-go" data-to="ad05-trois"' + (n < 3 ? " disabled" : "") + '>Continuer →</button>' +
      '</div>' + (n < 3 ? '<p class="hint">Garde au moins 3 valeurs.</p>' : "");
  }

  function renderTrois() {
    var n = B.trois.length;
    return entete("AD-05 · Étape 3 sur 3", "Mon top 3", "Le podium : les 3 valeurs les plus essentielles pour toi en ce moment.") +
      '<div class="carte">' + chips(B.cinq, B.trois, "trois") +
        '<p class="mini-note" style="margin-top:0.8rem">' + n + ' sur 3 max.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-a5="nav" data-to="ad05-cinq">← Retour</button>' +
        '<button class="btn btn-magenta" data-a5="finaliser"' + (n < 1 ? " disabled" : "") + '>✨ Voir ma boussole</button>' +
      '</div>' + (n < 1 ? '<p class="hint">Choisis au moins 1 valeur.</p>' : "");
  }

  function renderNotice() {
    var top = B.trois.map(function (id) { var v = val(id); return v.emo + " " + esc(v.lib); }).join(" · ");
    var spiritu = B.trois.indexOf("spiritualite") !== -1;
    var difOptions = B.trois.length ? B.trois : B.cinq;

    var difficileChips = '<div class="jetons" role="group">' + difOptions.map(function (id) {
      var v = val(id), on = B.difficile === id;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-a5="difficile" data-val="' + id + '">' + v.emo + ' ' + esc(v.lib) + '</button>';
    }).join("") + '</div>';

    return entete("AD-05 · Ma boussole", "🧭 Ma boussole de valeurs", "Ce qui te guide, en ce moment. À toi.") +
      '<div class="carte" style="text-align:center">' +
        '<span class="ruban" style="background:var(--jaune);color:var(--charbon)">Mon top 3</span>' +
        '<p style="font-size:1.25rem;font-family:var(--font-titre);font-weight:700;color:var(--sarcelle);margin:0.3rem 0">' + (top || "—") + '</p>' +
        (spiritu ? '<p class="mini-note">Tu as choisi la spiritualité parmi tes valeurs — c\'est un repère qui t\'appartient.</p>' : "") +
      '</div>' +

      '<div class="carte">' +
        '<label class="q-titre" for="v-pourquoi" style="display:block;margin-bottom:0.4rem">Pourquoi ces valeurs comptent pour moi <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<textarea id="v-pourquoi" class="saisie" rows="3" placeholder="Comme tu le sens…">' + esc(B.pourquoi) + '</textarea>' +
      '</div>' +

      '<div class="carte">' +
        '<div class="q-titre" style="margin-bottom:0.3rem">Une valeur parfois difficile à respecter, en ce moment ?</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Sans jugement — juste pour en avoir conscience.</p>' +
        difficileChips +
      '</div>' +

      '<div class="carte">' +
        '<div class="q-titre" style="margin-bottom:0.3rem">🔮 Le conseil de mon futur moi</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Une petite action, cette semaine, en accord avec une de tes valeurs.</p>' +
        '<textarea id="v-action" class="saisie" rows="2" placeholder="Ma petite action…">' + esc(B.action) + '</textarea>' +
      '</div>' +

      '<div class="encadre menthe"><p>Tes valeurs ne sont pas une case qui t\'enferme : ce sont une <strong>boussole</strong>. Elles peuvent évoluer, et c\'est normal. Tu choisis si tu veux les partager, et avec qui.</p></div>' +

      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a5="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-a5="imprimer">🖨️ Garder en PDF</button>' +
        '<button class="btn btn-doux" data-a5="refaire">↺ Recommencer</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a5]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    var pq = document.getElementById("v-pourquoi");
    if (pq) pq.addEventListener("input", function () { B.pourquoi = pq.value; });
    var ac = document.getElementById("v-action");
    if (ac) ac.addEventListener("input", function () { B.action = ac.value; });
  }

  function toggle(arr, v, max) {
    var i = arr.indexOf(v);
    if (i !== -1) { arr.splice(i, 1); return true; }
    if (max && arr.length >= max) { toast("Tu peux en garder " + max + " au maximum."); return false; }
    arr.push(v); return true;
  }

  function action(b) {
    var type = b.getAttribute("data-a5");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-go") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { enregistrerNotice(); sauver(); toast("Ta boussole est gardée ⭐"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("valeurs-brouillon", B); render(); return; }
    if (type === "refaire") { B = vide(); Vault.ecrire("valeurs-brouillon", B); go("ad05-large"); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); enregistrerNotice(); go("ad05-notice"); return; }

    if (type === "large") {
      toggle(B.large, b.getAttribute("data-val"), 12);
      // retirer des sous-sélections si on déselectionne
      B.cinq = B.cinq.filter(function (x) { return B.large.indexOf(x) !== -1; });
      B.trois = B.trois.filter(function (x) { return B.cinq.indexOf(x) !== -1; });
      render(); return;
    }
    if (type === "cinq") {
      toggle(B.cinq, b.getAttribute("data-val"), 5);
      B.trois = B.trois.filter(function (x) { return B.cinq.indexOf(x) !== -1; });
      render(); return;
    }
    if (type === "trois") { toggle(B.trois, b.getAttribute("data-val"), 3); render(); return; }
    if (type === "difficile") {
      var v = b.getAttribute("data-val");
      B.difficile = (B.difficile === v ? null : v); render(); return;
    }
  }

  function enregistrerNotice() {
    Vault.ecrire("valeurs-notice", {
      date: MEM.auj(), top3: B.trois.slice(), difficile: B.difficile || null, action: (B.action || "").trim() || null
    });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("valeurs-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("ad05", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("ad05-large", { render: renderLarge, bind: bindCommun });
    MEM.register("ad05-cinq", { render: renderCinq, bind: bindCommun });
    MEM.register("ad05-trois", { render: renderTrois, bind: bindCommun });
    MEM.register("ad05-notice", { render: renderNotice, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
