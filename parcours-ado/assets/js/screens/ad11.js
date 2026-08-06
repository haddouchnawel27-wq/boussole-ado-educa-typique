/* ===========================================================================
   AD-11 — « Centre de partage »
   ---------------------------------------------------------------------------
   Programme 3. Clé de voûte de la confidentialité (plan §AD-11) :
   • Chaque restitution a une visibilité EXPLICITE : privé / parent /
     praticienne / les deux.
   • Le partage est DÉSACTIVÉ PAR DÉFAUT (tout est privé au départ).
   • L'ado choisit le destinataire et voit un APERÇU avant export.
   • Le parent ne reçoit JAMAIS les réponses brutes automatiquement — on partage
     des restitutions curées (pas les réponses item par item), et uniquement sur
     décision de l'ado. Rien n'est envoyé : l'ado imprime / montre.
   =========================================================================== */
(function (global) {
  "use strict";
  var esc, toast, go, render;

  /* Libellés pour rendre les restitutions lisibles (curées, pas de brut). */
  var VAL = { liberte: "Liberté", securite: "Sécurité", famille: "Famille", amitie: "Amitié", justice: "Justice", creativite: "Créativité", reussite: "Réussite", argent: "Argent", entraide: "Entraide", respect: "Respect", aventure: "Aventure", stabilite: "Stabilité", connaissance: "Connaissance", spiritualite: "Spiritualité", nature: "Nature", reconnaissance: "Reconnaissance", autonomie: "Autonomie", courage: "Courage", transmission: "Transmission", equilibre: "Équilibre" };
  var EMO = { colere: "Colère", peur: "Peur", tristesse: "Tristesse", honte: "Honte", frustration: "Frustration", anxiete: "Anxiété", injustice: "Sentiment d'injustice", deception: "Déception", jalousie: "Jalousie", joie: "Joie" };
  var DOMN = { tdah: "attention & impulsivité", hpi: "fonctionnement intense", top: "opposition & autorité", tsa: "social & sensoriel", dys: "apprentissages", anxiete: "anxiété & stress" };
  var JAUGE = { elan: "mon élan", regard: "mon regard sur moi", appuis: "mes appuis" };
  var FEN = { matin: "le matin", midi: "de 10 h à midi", aprem: "de 14 h à 16 h", soir: "le soir" };
  var PIEGE = { toutrien: "tout ou rien", cata: "le pire va arriver", lecture: "lire dans les pensées", toujours: "« toujours / jamais »", filtre: "ne voir que le négatif", faute: "tout est ma faute", ressenti: "je le sens donc c'est vrai" };
  var LIM = { non: "« Non, je n'ai pas envie. »", pourquoi: "« J'ai besoin de comprendre pourquoi avant de dire oui. »", pasok: "« Ça, ça ne me va pas. On peut faire autrement ? »", temps: "« Je te réponds plus tard. »", insistance: "« Ma réponse ne change pas, même si tu redemandes. »", sortie: "« Si je veux partir, j'envoie notre mot à un adulte de confiance. »" };

  function lst(arr, map) { return (arr || []).map(function (x) { return map ? (map[x] || x) : x; }).join(", "); }

  /* Restitutions partageables : titre + clé Vault source + constructeur de texte curé. */
  var RESTIT = [
    { id: "bilan", titre: "Mode d'emploi de Moi", src: "bilan-notice", build: function (o) {
      var L = [];
      if (o.jaugeBasse) L.push("En ce moment, ma jauge la plus basse : " + (JAUGE[o.jaugeBasse] || o.jaugeBasse) + ".");
      if (o.fenetre) L.push("Je suis le plus disponible : " + (FEN[o.fenetre] || o.fenetre) + ".");
      if (o.fragile) L.push("Ma commande la plus fragile : « " + o.fragile + " ».");
      if (o.declencheur) L.push("Ce qui déclenche le plus mon stress : " + o.declencheur + ".");
      return L.length ? L.join("\n") : null;
    } },
    { id: "emotions", titre: "Mes émotions", src: "emotions-notice", build: function (o) {
      var L = [];
      if (o.emotion && EMO[o.emotion]) L.push("Mon émotion la plus fréquente : " + EMO[o.emotion] + ".");
      if (o.signaux && o.signaux.length) L.push("Mes signaux d'alerte : " + lst(o.signaux) + ".");
      if (o.redescendre && o.redescendre.length) L.push("Ce qui m'aide à redescendre : " + lst(o.redescendre) + ".");
      return L.length ? L.join("\n") : null;
    } },
    { id: "valeurs", titre: "Mes valeurs", src: "valeurs-notice", build: function (o) {
      var L = [];
      if (o.top3 && o.top3.length) L.push("Mes valeurs essentielles : " + lst(o.top3, VAL) + ".");
      if (o.difficile) L.push("Une valeur parfois difficile à respecter : " + (VAL[o.difficile] || o.difficile) + ".");
      if (o.action) L.push("Une action alignée : " + o.action);
      return L.length ? L.join("\n") : null;
    } },
    { id: "profil", titre: "Ce qui me ressemble", src: "profil-notice", build: function (o) {
      if (!o.reconnus || !o.reconnus.length) return null;
      return "Ce que je reconnais dans mon fonctionnement : " + lst(o.reconnus, DOMN) + ".\n(Ce n'est pas un diagnostic — des pistes pour mieux me comprendre.)";
    } },
    { id: "relations", titre: "Mes relations", src: "relations-notice", build: function (o) {
      var L = [];
      if (o.limiteFav && LIM[o.limiteFav]) L.push("Ma phrase pour poser une limite : " + LIM[o.limiteFav]);
      if (o.nbSignes) L.push("J'ai repéré des signes, dans une relation, qui méritent qu'on en parle.");
      return L.length ? L.join("\n") : null;
    } },
    { id: "confiance", titre: "Reprendre confiance", src: "confiance-notice", build: function (o) {
      var L = [];
      if (o.piege && PIEGE[o.piege]) L.push("Ma pensée piège du moment : " + PIEGE[o.piege] + ".");
      if (o.preuve) L.push("Ma preuve que j'avance : " + o.preuve);
      if (o.defi) L.push("Mon petit défi : " + o.defi);
      return L.length ? L.join("\n") : null;
    } },
    { id: "quotidien", titre: "Mon quotidien & mes forces", src: "quotidien-notice", build: function (o) {
      var L = [];
      if (o.forces && o.forces.length) L.push("Mes forces : " + lst(o.forces) + ".");
      if (o.interets && o.interets.length) L.push("Mes intérêts : " + lst(o.interets) + ".");
      if (o.objectif) L.push("Ce que j'aimerais améliorer : " + o.objectif);
      return L.length ? L.join("\n") : null;
    } },
    { id: "demande", titre: "Ma demande d'accompagnement", src: "demande-brouillon", build: function (o) {
      var L = [];
      if ((o.preoccupe || "").trim()) L.push("Ce qui me préoccupe : " + o.preoccupe.trim());
      if (o.depuis) L.push("Depuis : " + o.depuis);
      if ((o.essaye || "").trim()) L.push("Ce que j'ai déjà essayé : " + o.essaye.trim());
      if ((o.aide || "").trim()) L.push("Ce qui m'aide : " + o.aide.trim());
      if (o.pasVeux && o.pasVeux.length) L.push("Ce dont je n'ai pas envie : " + lst(o.pasVeux) + ".");
      if (o.avecQui && o.avecQui.length) L.push("J'aimerais en parler avec : " + lst(o.avecQui) + ".");
      return L.length ? L.join("\n") : null;
    } },
    { id: "orientation", titre: "Ma boussole d'orientation", src: "orientation-notice", build: function (o) {
      var L = [];
      if (o.allume && o.allume.length) L.push("Ce qui m'allume : " + lst(o.allume) + ".");
      if (o.couleurs && o.couleurs.length) L.push("Mes couleurs d'intérêts (facettes qui se combinent) : " + lst(o.couleurs) + ".");
      if (o.apprend && o.apprend.length) L.push("Comment j'apprends le mieux : " + lst(o.apprend) + ".");
      if (o.porte) L.push("Ma porte d'entrée face au concret : " + o.porte + ".");
      if (o.univers && o.univers.length) L.push("Des univers à explorer (au pluriel, sans verdict) : " + lst(o.univers) + ".");
      if (o.action) L.push("Ma prochaine petite action : " + o.action);
      return L.length ? L.join("\n") + "\n(Ce n'est pas un verdict de métier — des directions à explorer, à mon rythme.)" : null;
    } },
    { id: "experience", titre: "J'expérimente", src: "experience-notice", build: function (o) {
      var L = [];
      if (o.prevues && o.prevues.length) L.push("Des expériences que je veux tenter : " + lst(o.prevues) + ".");
      if (o.faites && o.faites.length) {
        L.push("Des expériences déjà faites :");
        o.faites.forEach(function (f) { L.push("• " + f.quoi + (f.apres ? " — ce que j'en retiens : " + f.apres : "")); });
      }
      return L.length ? L.join("\n") : null;
    } },
    { id: "pensees", titre: "Démêler mes pensées", src: "pensees-notice", build: function (o) {
      var L = [];
      if (o.piege) L.push("Une pensée piège que je repère en ce moment : " + o.piege + ".");
      if (o.juste) L.push("Ma lecture plus juste : " + o.juste);
      return L.length ? L.join("\n") + "\n(Un entraînement à séparer les faits de ce que mon cerveau ajoute — pas un diagnostic.)" : null;
    } }
  ];

  var CIBLES = { parent: "mon parent", praticienne: "une praticienne" };

  /* ---------- État ---------- */
  var data = null;       // { restitId: texte lisible | null }
  var reglages = null;   // { restitId: 'prive'|'parent'|'praticienne'|'deux' }
  var chargé = false;
  var cible = "parent";  // pour l'aperçu

  function sauverReglages() { Vault.ecrire("partage-reglages", reglages); }

  function partagéAvec(id, dest) {
    var v = reglages[id] || "prive";
    return v === dest || v === "deux";
  }

  function entete(rub, titre, intro) {
    return '<div class="entete-ecran"><div class="fil"><button class="lien-doux" data-nav="accueil">← Accueil</button></div>' +
      '<span class="ruban">' + esc(rub) + '</span><h1>' + esc(titre) + '</h1>' +
      (intro ? '<p class="intro">' + esc(intro) + '</p>' : '') + '</div>';
  }

  /* ===========================================================================
     Écran principal
     =========================================================================== */
  var OPTS = [
    { v: "prive", lib: "🔒 Privé" },
    { v: "parent", lib: "👪 Parent" },
    { v: "praticienne", lib: "🧑‍⚕️ Praticienne" },
    { v: "deux", lib: "👪 🧑‍⚕️ Les deux" }
  ];

  function renderMain() {
    var dispo = RESTIT.filter(function (r) { return data[r.id]; });

    if (!dispo.length) {
      return entete("Programme 3 · AD-11", "🔀 Centre de partage", "Ici, tu choisis ce que tu veux partager, et avec qui.") +
        '<div class="carte"><p>Tu n\'as encore rempli <strong>aucune fiche</strong> à partager. Fais quelques étapes du parcours (Mode d\'emploi de Moi, Mes valeurs, Ma demande d\'accompagnement…), puis reviens ici.</p></div>' +
        '<div class="actions-bas"><button class="btn btn-plein" data-nav="accueil">Retour à l\'accueil</button></div>';
    }

    var cartes = dispo.map(function (r) {
      var cur = reglages[r.id] || "prive";
      var seg = '<div class="segments" role="group" style="flex-wrap:wrap;gap:4px">' + OPTS.map(function (o) {
        return '<button data-a11="vis" data-key="' + r.id + '" data-val="' + o.v + '" aria-pressed="' + (cur === o.v) + '" style="font-size:0.78rem">' + o.lib + '</button>';
      }).join("") + '</div>';
      return '<div class="carte"><div class="q-titre" style="font-size:1rem;margin-bottom:0.5rem">' + esc(r.titre) + '</div>' + seg + '</div>';
    }).join("");

    var nParent = dispo.filter(function (r) { return partagéAvec(r.id, "parent"); }).length;
    var nPrat = dispo.filter(function (r) { return partagéAvec(r.id, "praticienne"); }).length;

    return entete("Programme 3 · AD-11", "🔀 Centre de partage",
      "Tout est privé par défaut. Tu choisis, fiche par fiche, ce que tu veux montrer — et à qui.") +
      '<div class="carte"><div class="encadre menthe"><span class="titre">La règle</span>' +
        '<p>Rien n\'est envoyé automatiquement. Tes parents ne voient <strong>jamais</strong> tes réponses toutes seules. Tu vois un <strong>aperçu</strong> avant, et c\'est toi qui montres ou imprimes.</p></div></div>' +
      cartes +
      '<div class="carte"><h2 style="font-size:1.05rem;margin-bottom:0.6rem">Voir ce que je partagerais</h2>' +
        '<div class="actions-bas" style="margin-top:0">' +
        '<button class="btn btn-plein" data-a11="apercu" data-cible="parent">👪 Aperçu pour mon parent (' + nParent + ')</button>' +
        '<button class="btn btn-ligne" data-a11="apercu" data-cible="praticienne">🧑‍⚕️ Aperçu pour une praticienne (' + nPrat + ')</button>' +
        '</div></div>' +
      '<div class="encadre beige"><p class="mini-note">Tu peux changer d\'avis à tout moment : remets une fiche en 🔒 Privé quand tu veux.</p></div>';
  }

  /* ===========================================================================
     Écran aperçu (par destinataire)
     =========================================================================== */
  function renderApercu() {
    var libCible = CIBLES[cible] || cible;
    var items = RESTIT.filter(function (r) { return data[r.id] && partagéAvec(r.id, cible); });

    var corps;
    if (!items.length) {
      corps = '<div class="carte"><p>Tu n\'as choisi de partager <strong>aucune fiche</strong> avec ' + esc(libCible) + ' pour l\'instant. Reviens en arrière pour en sélectionner, ou garde tout privé — c\'est ton droit.</p></div>';
    } else {
      corps = '<div class="carte" id="doc-partage">' +
        '<span class="ruban" style="background:var(--lavande);color:var(--charbon)">Pour ' + esc(libCible) + '</span>' +
        items.map(function (r) {
          return '<div style="margin-bottom:0.9rem"><strong style="color:var(--sarcelle)">' + esc(r.titre) + '</strong>' +
            '<p style="white-space:pre-wrap;margin:0.2rem 0 0">' + esc(data[r.id]) + '</p></div>';
        }).join("") +
        '<p class="mini-note" style="margin-top:0.4rem;border-top:1px solid var(--trait);padding-top:0.6rem">Partagé volontairement par l\'adolescent·e via « Mode d\'Emploi de Moi » — Educa Typique. Ce document ne remplace aucun avis professionnel.</p>' +
        '</div>';
    }

    return entete("AD-11 · Aperçu", "👀 Aperçu — pour " + libCible, "Voilà exactement ce que la personne verrait. Rien de plus.") +
      corps +
      (items.length ? '<div class="encadre ciel"><p>C\'est bien ce que tu veux montrer ? <strong>Rien n\'est envoyé.</strong> Tu peux l\'imprimer, ou simplement montrer cet écran — quand tu veux, si tu veux.</p></div>' : "") +
      '<div class="actions-bas">' +
        '<button class="btn btn-ligne" data-a11="retour">← Modifier mes choix</button>' +
        (items.length ? '<button class="btn btn-plein" data-a11="imprimer">🖨️ Imprimer pour ' + esc(libCible) + '</button>' : '') +
      '</div>';
  }

  /* ===========================================================================
     Événements
     =========================================================================== */
  function bindCommun() {
    var root = document.getElementById("contenu");
    if (!root) return;
    root.querySelectorAll('[data-a11]').forEach(function (b) { b.addEventListener("click", function () { action(b); }); });
  }

  function action(b) {
    var type = b.getAttribute("data-a11");
    if (type === "vis") {
      reglages[b.getAttribute("data-key")] = b.getAttribute("data-val");
      sauverReglages(); render(); return;
    }
    if (type === "apercu") { cible = b.getAttribute("data-cible"); go("ad11-apercu"); return; }
    if (type === "retour") { go("ad11"); return; }
    if (type === "imprimer") { window.print(); return; }
  }

  /* ---------- Chargement (une fois) ---------- */
  function chargerUneFois() {
    if (chargé) return; chargé = true;
    var lectures = RESTIT.map(function (r) {
      return Vault.lire(r.src).then(function (o) { return { id: r.id, txt: o ? r.build(o) : null }; }).catch(function () { return { id: r.id, txt: null }; });
    });
    lectures.push(Vault.lire("partage-reglages").then(function (rg) { return { id: "__reglages", txt: rg }; }).catch(function () { return { id: "__reglages", txt: null }; }));
    Promise.all(lectures).then(function (res) {
      data = {}; var rg = {};
      res.forEach(function (x) {
        if (x.id === "__reglages") { rg = x.txt || {}; return; }
        data[x.id] = x.txt;
      });
      reglages = rg;
      render();
    });
  }

  function init() {
    esc = MEM.esc; toast = MEM.toast; go = MEM.go; render = MEM.render;
    MEM.register("ad11", {
      enter: chargerUneFois,
      render: function () { return data ? renderMain() : '<div class="entete-ecran"><h1>🔀 Centre de partage</h1><p class="intro">Chargement…</p></div>'; },
      bind: bindCommun
    });
    MEM.register("ad11-apercu", {
      render: function () { return data ? renderApercu() : ""; },
      bind: bindCommun
    });
  }
  if (global.MEM && global.MEM.register) init();
  else global.addEventListener("DOMContentLoaded", init);
})(window);
