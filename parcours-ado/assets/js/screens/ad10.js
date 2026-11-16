/* ===========================================================================
   AD-10 — « Ma demande d'accompagnement »
   ---------------------------------------------------------------------------
   Programme 3. D'après le plan : ce qui me préoccupe, depuis quand, ce que j'ai
   essayé, ce qui m'aide, ce que je ne veux pas, avec qui je voudrais parler.
   Sortie : une Carte de demande, relue et VALIDÉE par l'ado.
   Garde-fous : à son rythme, rien n'est envoyé, l'ado reste maître du partage
   (le choix de partage se fait dans AD-11). Aucun score. Données chiffrées.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  var DEPUIS = ["quelques jours", "quelques semaines", "plusieurs mois", "je ne sais plus trop"];
  var PASVEUX = ["qu'on en parle à toute la famille", "qu'on dramatise", "qu'on décide à ma place",
    "qu'on me force à raconter les détails", "qu'on me juge", "autre"];
  var AVECQUI = ["un parent", "un·e prof", "l'infirmière scolaire", "un·e psychologue",
    "un·e adulte de confiance", "je ne sais pas encore"];

  /* ---------- État ---------- */
  var B = null, chargé = false;
  function vide() { return { preoccupe: "", depuis: null, essaye: "", aide: "", pasVeux: [], avecQui: [], validee: false }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.preoccupe = d.preoccupe || ""; b.depuis = d.depuis || null; b.essaye = d.essaye || "";
      b.aide = d.aide || ""; b.pasVeux = Array.isArray(d.pasVeux) ? d.pasVeux : [];
      b.avecQui = Array.isArray(d.avecQui) ? d.avecQui : []; b.validee = !!d.validee;
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("demande-brouillon", B); }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }
  function single(grp, options, cur) {
    return '<div class="jetons" role="group">' + options.map(function (o) {
      return '<button class="jeton" role="button" aria-pressed="' + (cur === o) + '" data-a10="single" data-grp="' + grp + '" data-val="' + esc(o) + '">' + esc(o) + '</button>';
    }).join("") + '</div>';
  }
  function multi(grp, options, arr) {
    return '<div class="jetons" style="flex-direction:column;align-items:stretch" role="group">' + options.map(function (o) {
      return '<button class="jeton" role="button" aria-pressed="' + (arr.indexOf(o) !== -1) + '" data-a10="multi" data-grp="' + grp + '" data-val="' + esc(o) + '" style="text-align:left">' + esc(o) + '</button>';
    }).join("") + '</div>';
  }

  /* ===========================================================================
     Écrans
     =========================================================================== */
  function renderIntro() {
    var reprise = B && (B.preoccupe || B.avecQui.length || B.depuis);
    return entete("Programme 3 · AD-10", "✉️ Ma demande d'accompagnement",
      "Mettre des mots sur ce dont tu as besoin — à ton rythme. Demander de l'aide, ce n'est pas être faible : c'est bien se connaître.") +
      '<div class="carte"><div class="encadre menthe"><span class="titre">Comment ça marche</span>' +
        '<p>Tu remplis ce que tu veux (tu peux tout laisser vide), et à la fin tu obtiens une <strong>carte</strong> que <strong>toi</strong> tu relis et valides. Rien n\'est envoyé : c\'est toi qui décides quoi en faire.</p></div></div>' +
      '<div class="actions-bas">' +
        (reprise
          ? '<button class="btn btn-plein" data-a10="nav" data-to="ad10-form">Reprendre →</button><button class="btn btn-ligne" data-a10="recommencer">Recommencer</button>'
          : '<button class="btn btn-plein" data-a10="nav" data-to="ad10-form">Commencer →</button>') +
      '</div>';
  }

  function renderForm() {
    return entete("AD-10 · Ma demande", "Dire ce dont j'ai besoin", "Réponds à ce que tu veux. Il n'y a pas de bonne réponse.") +
      '<div class="carte">' +
        '<label class="q-titre" for="d-preoccupe" style="display:block;margin-bottom:0.4rem">Ce qui me préoccupe, en ce moment</label>' +
        '<textarea id="d-preoccupe" class="saisie" rows="3" placeholder="Avec tes mots, même en vrac…">' + esc(B.preoccupe) + '</textarea></div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.5rem">Depuis quand ?</div>' + single("depuis", DEPUIS, B.depuis) + '</div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="d-essaye" style="display:block;margin-bottom:0.4rem">Ce que j\'ai déjà essayé <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<textarea id="d-essaye" class="saisie" rows="2" placeholder="Ce que tu as tenté, même si ça n\'a pas marché…">' + esc(B.essaye) + '</textarea></div>' +
      '<div class="carte">' +
        '<label class="q-titre" for="d-aide" style="display:block;margin-bottom:0.4rem">Ce qui m\'aide / me fait du bien <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<textarea id="d-aide" class="saisie" rows="2" placeholder="Ce qui te soulage un peu…">' + esc(B.aide) + '</textarea></div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">Ce dont je n\'ai PAS envie</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">Important : c\'est ton cadre. (plusieurs possibles)</p>' + multi("pasVeux", PASVEUX, B.pasVeux) + '</div>' +
      '<div class="carte"><div class="q-titre" style="margin-bottom:0.3rem">Avec qui j\'aimerais en parler</div>' +
        '<p class="q-aide" style="margin-bottom:0.6rem">(plusieurs possibles, ou « je ne sais pas encore »)</p>' + multi("avecQui", AVECQUI, B.avecQui) + '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-magenta" data-a10="finaliser">✨ Voir ma carte</button>' +
        '<button class="btn btn-doux" data-a10="save-quitter">Quitter (je garde tout)</button>' +
      '</div>';
  }

  function ligne(label, val) {
    return val ? '<p style="margin:0 0 0.5rem"><strong style="color:var(--sarcelle)">' + esc(label) + '</strong><br>' + esc(val) + '</p>' : "";
  }

  function renderCarte() {
    var pasVeux = B.pasVeux.length ? B.pasVeux.join(", ") : "";
    var avecQui = B.avecQui.length ? B.avecQui.join(", ") : "";
    var vide = !(B.preoccupe.trim() || B.depuis || B.essaye.trim() || B.aide.trim() || pasVeux || avecQui);

    var carte = '<div class="carte" id="carte-demande">' +
      '<span class="ruban" style="background:var(--lavande);color:var(--charbon)">Ma carte de demande</span>' +
      (vide
        ? '<p class="mini-note">Ta carte est encore vide. Tu peux revenir la remplir quand tu te sens prêt·e — il n\'y a aucune urgence.</p>'
        : ligne("Ce qui me préoccupe", B.preoccupe.trim()) +
          ligne("Depuis", B.depuis) +
          ligne("Ce que j'ai déjà essayé", B.essaye.trim()) +
          ligne("Ce qui m'aide", B.aide.trim()) +
          ligne("Ce dont je n'ai pas envie", pasVeux) +
          ligne("J'aimerais en parler avec", avecQui)) +
      '</div>';

    return entete("AD-10 · Ma carte", "✉️ Ma carte de demande", "Relis-la. C'est toi qui la valides — et toi seul·e décides quoi en faire.") +
      carte +
      '<div class="carte">' +
        '<button class="jeton" role="button" aria-pressed="' + B.validee + '" data-a10="valider" style="width:100%;text-align:left;font-size:0.98rem">' +
          (B.validee ? "✅ " : "☐ ") + 'Cette carte me convient, elle dit bien ce que je ressens.</button>' +
        '<p class="mini-note" style="margin-top:0.7rem">Tu choisiras <strong>plus tard</strong>, dans le <strong>Centre de partage</strong>, si tu veux la montrer à quelqu\'un (un parent, un·e pro…) — et quoi exactement. Par défaut, tout reste privé.</p>' +
      '</div>' +
      '<div class="encadre beige"><p class="mini-note">💛 Demander de l\'aide, c\'est déjà prendre soin de toi. Et si tu veux parler à quelqu\'un tout de suite : ' +
        '<button class="lien-doux" data-act="aide" style="padding:0">voir les numéros d\'aide</button>.</p></div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-a10="save-accueil">Enregistrer &amp; revenir</button>' +
        '<button class="btn btn-ligne" data-a10="imprimer">🖨️ Imprimer ma carte</button>' +
        '<button class="btn btn-doux" data-a10="nav" data-to="ad10-form">Modifier</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a10]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    bindText("d-preoccupe", "preoccupe"); bindText("d-essaye", "essaye"); bindText("d-aide", "aide");
  }
  function bindText(id, key) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", function () { B[key] = el.value; });
  }
  function arrOf(grp) { return grp === "pasVeux" ? B.pasVeux : B.avecQui; }

  function action(b) {
    var type = b.getAttribute("data-a10");
    if (type === "nav") { sauver(); go(b.getAttribute("data-to")); return; }
    if (type === "save-quitter") { sauver(); toast("C'est gardé 💾"); go("accueil"); return; }
    if (type === "save-accueil") { sauver(); enregistrerNotice(); toast("Ta carte est gardée ✉️"); go("accueil"); return; }
    if (type === "recommencer") { B = vide(); Vault.ecrire("demande-brouillon", B); render(); return; }
    if (type === "imprimer") { window.print(); return; }
    if (type === "finaliser") { sauver(); go("ad10-carte"); return; }
    if (type === "single") {
      var g = b.getAttribute("data-grp"), val = b.getAttribute("data-val");
      if (g === "depuis") B.depuis = (B.depuis === val ? null : val);
      render(); return;
    }
    if (type === "multi") {
      var arr = arrOf(b.getAttribute("data-grp")), v = b.getAttribute("data-val"), i = arr.indexOf(v);
      if (i === -1) arr.push(v); else arr.splice(i, 1);
      render(); return;
    }
    if (type === "valider") { B.validee = !B.validee; sauver(); render(); return; }
  }

  function enregistrerNotice() {
    Vault.ecrire("demande-notice", { date: MEM.auj(), validee: B.validee, avecQui: B.avecQui.slice() });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("demande-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("ad10", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("ad10-form", { render: renderForm, bind: bindCommun });
    MEM.register("ad10-carte", { render: renderCarte, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
