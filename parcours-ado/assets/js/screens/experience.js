/* ===========================================================================
   « J'expérimente » — micro-expériences (Carnet section 9 / spec OUTIL 10)
   ---------------------------------------------------------------------------
   Le « passage à l'action réel » : remplacer les suppositions par de vraies
   petites expériences (interviewer un pro, observer un métier, mini-projet…).
   Garde-fous :
   • Petites étapes concrètes, à son rythme ; aucune obligation.
   • Les ressources externes (Onisep…) restent des liens que l'ado CHOISIT
     d'ouvrir, idéalement avec un adulte de confiance. 100 % local.
   • Privé par défaut ; partage seulement via AD-11.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  var TYPES = [
    { id: "interview", emo: "🎙️", lib: "Interviewer un adulte sur son métier" },
    { id: "observer", emo: "👀", lib: "Observer un métier (une journée, un stage)" },
    { id: "immersion", emo: "🎥", lib: "Regarder une immersion / une vidéo métier" },
    { id: "projet", emo: "🔨", lib: "Faire un mini-projet perso" },
    { id: "question", emo: "✉️", lib: "Poser une question à un pro" }
  ];
  function typeOf(id) { return TYPES.filter(function (t) { return t.id === id; })[0]; }

  /* ---------- État ---------- */
  var B = null, chargé = false, seq = 0;
  function vide() { return { liste: [], form: { quoi: "", comment: null, avecqui: "" } }; }
  function assainir(d) {
    var b = vide();
    if (d && typeof d === "object") {
      b.liste = Array.isArray(d.liste) ? d.liste.filter(function (x) { return x && typeof x === "object"; }) : [];
      if (d.form && typeof d.form === "object") {
        b.form.quoi = d.form.quoi || ""; b.form.comment = d.form.comment || null; b.form.avecqui = d.form.avecqui || "";
      }
    }
    return b;
  }
  function sauver() { if (B) Vault.ecrire("experience-brouillon", B); }
  function newId() { seq += 1; return "x" + seq + "-" + B.liste.length; }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }

  /* ===========================================================================
     Écran — Intro
     =========================================================================== */
  function renderIntro() {
    var reprise = B && B.liste.length;
    return entete("L'étape d'après · Orientation", "🧪 J'expérimente",
      "La vraie clé de l'orientation : arrêter de deviner, et aller voir pour de vrai. Une petite expérience en dit plus que dix tests.") +
      '<div class="carte">' +
        '<div class="encadre menthe"><span class="titre">L\'idée</span>' +
        '<p>Tu choisis un truc qui t\'intrigue, tu tentes une <strong>petite expérience</strong> (parler à quelqu\'un, observer, essayer), puis tu notes ce que tu en as pensé. Pas besoin que ce soit grand — juste réel.</p></div>' +
        '<div class="encadre beige"><p class="mini-note">À faire à ton rythme, souvent avec un adulte de confiance pour t\'aider à organiser. Rien n\'est obligatoire.</p></div>' +
      '</div>' +
      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-ex="nav" data-to="experience-plan">' + (reprise ? "Reprendre →" : "Commencer →") + '</button>' +
      '</div>';
  }

  /* ===========================================================================
     Écran — Plan + suivi
     =========================================================================== */
  function carteExp(x) {
    var t = typeOf(x.comment);
    var tete = (t ? t.emo + " " : "🧪 ") + esc(x.quoi || "Mon expérience");
    var meta = [];
    if (t) meta.push(esc(t.lib));
    if ((x.avecqui || "").trim()) meta.push(esc(x.avecqui.trim()));
    var metaHTML = meta.length ? '<p class="mini-note" style="margin:0.2rem 0 0.5rem">' + meta.join(" · ") + '</p>' : "";

    var corps;
    if (x.statut === "faite") {
      corps = '<span class="etat" style="background:rgba(123,211,160,.2);color:var(--menthe-2,#3f8a5f)">✓ fait</span>' +
        '<label class="q-titre" for="ex-ap-' + x.id + '" style="display:block;margin:0.6rem 0 0.3rem;font-size:0.95rem">Ce que j\'en retiens</label>' +
        '<textarea id="ex-ap-' + x.id + '" class="saisie" rows="2" data-ex-apres="' + x.id + '" placeholder="Ça m\'a donné envie / ça m\'a refroidi / j\'ai appris que…">' + esc(x.apres || "") + '</textarea>';
    } else {
      corps = '<span class="etat plus-tard">à faire</span>' +
        '<div style="margin-top:0.5rem"><button class="btn btn-ligne btn-petit" data-ex="fait" data-id="' + x.id + '">C\'est fait ✓</button></div>';
    }
    return '<div class="carte"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem">' +
      '<div class="q-titre" style="font-size:1rem">' + tete + '</div>' +
      '<button class="lien-doux" data-ex="suppr" data-id="' + x.id + '" aria-label="Retirer" style="font-size:1.1rem;line-height:1">✕</button></div>' +
      metaHTML + corps + '</div>';
  }

  function renderPlan() {
    var f = B.form;
    var typeChips = '<div class="jetons" role="group">' + TYPES.map(function (t) {
      var on = f.comment === t.id;
      return '<button class="jeton" role="button" aria-pressed="' + on + '" data-ex="type" data-val="' + t.id + '">' + t.emo + ' ' + esc(t.lib) + '</button>';
    }).join("") + '</div>';

    var liste = B.liste.length
      ? B.liste.map(carteExp).join("")
      : '<p class="mini-note">Aucune expérience pour l\'instant. Ajoute-en une ci-dessus — même toute petite. 🌱</p>';

    var peutAjouter = (f.quoi || "").trim().length > 0;

    return entete("J'expérimente · mon plan", "🧪 Mes petites expériences", "Prépares-en une, tente-la, puis reviens noter ce que tu en as pensé.") +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.5rem">➕ Ma prochaine expérience</h2>' +
        '<label class="q-titre" for="ex-quoi" style="display:block;margin-bottom:0.3rem;font-size:0.95rem">Qu\'est-ce que je veux explorer ?</label>' +
        '<textarea id="ex-quoi" class="saisie" rows="2" data-ex-form="quoi" placeholder="Ex. comprendre le métier d\'infirmier·e, tester le montage vidéo…">' + esc(f.quoi) + '</textarea>' +
        '<div class="q-titre" style="margin:0.7rem 0 0.3rem;font-size:0.95rem">Comment ?</div>' + typeChips +
        '<label class="q-titre" for="ex-avecqui" style="display:block;margin:0.7rem 0 0.3rem;font-size:0.95rem">Avec qui / quand ? <span style="font-weight:400;color:var(--texte-doux)">(optionnel)</span></label>' +
        '<input id="ex-avecqui" class="saisie" type="text" data-ex-form="avecqui" placeholder="Ex. mon oncle, samedi prochain" value="' + esc(f.avecqui) + '" />' +
        '<div style="margin-top:0.8rem"><button class="btn btn-plein btn-petit" data-ex="ajouter"' + (peutAjouter ? "" : " disabled") + '>Ajouter à ma liste</button></div>' +
      '</div>' +

      '<h2 style="font-size:1.05rem;margin:1.4rem 0 0.2rem">📋 Mes expériences</h2>' +
      liste +

      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.3rem">🔎 Où trouver des idées (avec un adulte)</h2>' +
        '<p class="q-aide" style="margin-bottom:0.5rem">Des ressources sérieuses — tu choisis d\'y aller, l\'app ne t\'y envoie jamais toute seule.</p>' +
        '<ul style="margin:0;padding-left:1.1rem;display:flex;flex-direction:column;gap:0.35rem;font-size:0.95rem">' +
        '<li><strong>Onisep</strong> — fiches métiers &amp; vidéos « métiers en immersion ».</li>' +
        '<li><strong>L\'Étudiant</strong> — témoignages, journées portes ouvertes.</li>' +
        '<li><strong>Ton avenir / CIO</strong> — un conseiller peut t\'aider à organiser un stage d\'observation.</li>' +
        '</ul>' +
        '<p class="mini-note" style="margin-top:0.5rem">Liste indicative, à revérifier avec un adulte.</p></div>' +

      '<div class="actions-bas">' +
        '<button class="btn btn-plein" data-ex="save-accueil">Enregistrer &amp; revenir</button>' +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-ex]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
    root.querySelectorAll('[data-ex-form]').forEach(function (el) {
      el.addEventListener("input", function () { B.form[el.getAttribute("data-ex-form")] = el.value; });
    });
    root.querySelectorAll('[data-ex-apres]').forEach(function (el) {
      el.addEventListener("input", function () {
        var id = el.getAttribute("data-ex-apres");
        var it = B.liste.filter(function (x) { return x.id === id; })[0];
        if (it) it.apres = el.value;
      });
    });
  }

  function action(b) {
    var type = b.getAttribute("data-ex");
    if (type === "nav") { go(b.getAttribute("data-to")); return; }
    if (type === "save-accueil") { enregistrerNotice(); sauver(); toast("C'est gardé 🧪"); go("accueil"); return; }
    if (type === "type") {
      var v = b.getAttribute("data-val");
      B.form.comment = (B.form.comment === v ? null : v); render(); return;
    }
    if (type === "ajouter") {
      var q = (B.form.quoi || "").trim();
      if (!q) { toast("Écris d'abord ce que tu veux explorer."); return; }
      B.liste.unshift({ id: newId(), quoi: q, comment: B.form.comment, avecqui: (B.form.avecqui || "").trim(), statut: "prevue", apres: "" });
      B.form = { quoi: "", comment: null, avecqui: "" };
      sauver(); toast("Ajouté à ta liste 🌱"); render(); return;
    }
    if (type === "fait") {
      var it = B.liste.filter(function (x) { return x.id === b.getAttribute("data-id"); })[0];
      if (it) it.statut = "faite"; sauver(); render(); return;
    }
    if (type === "suppr") {
      B.liste = B.liste.filter(function (x) { return x.id !== b.getAttribute("data-id"); });
      sauver(); render(); return;
    }
  }

  function enregistrerNotice() {
    var prevues = B.liste.filter(function (x) { return x.statut !== "faite"; }).map(function (x) { return x.quoi; }).filter(Boolean);
    var faites = B.liste.filter(function (x) { return x.statut === "faite"; }).map(function (x) {
      return { quoi: x.quoi, apres: (x.apres || "").trim() || null };
    });
    if (!prevues.length && !faites.length) { Vault.ecrire("experience-notice", null); return; }
    Vault.ecrire("experience-notice", { date: MEM.auj(), prevues: prevues.slice(0, 8), faites: faites.slice(0, 8) });
  }

  function chargerUneFois() {
    if (chargé) return; chargé = true;
    Vault.lire("experience-brouillon").then(function (d) { B = assainir(d); render(); }).catch(function () { B = vide(); });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    if (!B) B = vide();
    MEM.register("experience", { enter: chargerUneFois, render: function () { if (!B) B = vide(); return renderIntro(); }, bind: bindCommun });
    MEM.register("experience-plan", { render: renderPlan, bind: bindCommun });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
