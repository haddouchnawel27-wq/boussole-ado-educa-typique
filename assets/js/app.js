/* ============================================================
   Boussole — application : registre d'outils, navigation, routeur
   ============================================================ */
(function () {
  "use strict";

  var outils = [];
  var groupes = [
    { id: "accueil", nom: "" },
    { id: "ressources", nom: "Mes applications" },
    { id: "tnd", nom: "TND · Dys · Neuropédagogie" },
    { id: "meta", nom: "Apprendre à apprendre" },
    { id: "tcc", nom: "TCC · Émotions" },
    { id: "enfants", nom: "Enfants (6-12 ans)" },
    { id: "secours", nom: "Secourisme santé mentale" },
    { id: "spirituel", nom: "Coin spiritualité" },
    { id: "pro", nom: "Suivi & réglages" }
  ];

  // ---- Public visé (tranche d'âge) ----
  // Chaque outil indique à quels publics il s'adresse. Un outil absent de la
  // table est visible par défaut côté enfant ET ado. Une liste vide = réservé
  // au mode praticienne (qui, lui, voit toujours tout).
  var AUDIENCE = {
    // Enfants (6-12) — visuel, pictogrammes, jeu
    "boite-enfant": ["enfant"],
    "jetons": ["enfant"],
    "jeux-fe": ["enfant"],
    // Communs 6-12 et 12-18
    "timer": ["enfant", "ado"],
    "sequenceur": ["enfant", "ado"],
    "edt": ["enfant", "ado"],
    "dys": ["enfant", "ado"],
    "flashcards": ["enfant", "ado"],
    "carte-mentale": ["enfant", "ado"],
    "aide-ecrire": ["enfant", "ado"],
    "apprendre": ["enfant", "ado"],
    "metacognition": ["enfant", "ado"],
    "emotions": ["enfant", "ado"],
    "roue-emotions": ["enfant", "ado"],
    "respiration": ["enfant", "ado"],
    "gratitude": ["enfant", "ado"],
    "ancrage": ["enfant", "ado"],
    "spiritualite": ["enfant", "ado"],
    "reglages": ["enfant", "ado"],
    // Ados (12-18) — introspection, mots, autonomie
    "hub": ["ado"],
    "pomodoro": ["ado"],
    "organisateur": ["ado"],
    "profil-neuro": ["ado"],
    "besoins-corps": ["ado"],
    "humeur": ["ado"],
    "pensees": ["ado"],
    "securite": ["ado"],
    // Outils praticienne — visibles uniquement en mode « tout voir »
    "abc": [],
    "modeles-pro": [],
    "personnalisation": [],
    "profils": [],
    "suivi": []
  };

  var PUBLICS = [
    { id: "enfant", court: "Enfant", detail: "6-12 ans" },
    { id: "ado", court: "Ado", detail: "12-18 ans" },
    { id: "parent", court: "Parent", detail: "vue famille" },
    { id: "pro", court: "Praticienne", detail: "tout voir" }
  ];

  function publicActif() { return Store.lire("publicActif", null); }
  function setPublicActif(id) {
    Store.ecrire("publicActif", id || null);
    rafraichirSelectPublic();
    construireNav();
  }
  function publicEffectif() { return publicActif() || "ado"; } // défaut = vue ADO (jamais « tout voir » par défaut) — sécurité 3 espaces

  // Un outil est-il visible pour la tranche d'âge en cours ?
  function outilVisible(o) {
    if (!o) return false;
    if (o.id === "accueil") return true;
    var pub = publicEffectif();
    if (pub === "pro") return true; // mode praticienne : tout
    var aud = AUDIENCE.hasOwnProperty(o.id) ? AUDIENCE[o.id] : ["enfant", "ado"];
    // Parent : voit tous les outils enfants ET ados (pour accompagner),
    // mais pas les outils réservés à la praticienne (audience vide).
    if (pub === "parent") return aud.indexOf("enfant") >= 0 || aud.indexOf("ado") >= 0;
    return aud.indexOf(pub) >= 0;
  }

  // Le coin spiritualité est masqué tant que la praticienne ne l'a pas activé.
  function spiritualiteActive() { return Store.lire("coinSpiritualite", false); }

  // Un outil : { id, groupe, titre, icone, desc, render(vue, ctx), accueil:true/false }
  function registerTool(def) { outils.push(def); }

  function outilParId(id) {
    return outils.filter(function (o) { return o.id === id; })[0];
  }

  // ---- Profil actif (jeune accompagné) ----
  function profilActifId() { return Store.lire("profilActif", null); }
  function setProfilActif(id) { Store.ecrire("profilActif", id); rafraichirSelectProfil(); }
  function profilActif() {
    var id = profilActifId();
    return id ? Store.profils.parId(id) : null;
  }

  function rafraichirSelectProfil() {
    var sel = document.getElementById("profil-actif");
    UI.vider(sel);
    var profils = Store.profils.tout();
    sel.appendChild(UI.el("option", { value: "", text: profils.length ? "— Aucun jeune sélectionné —" : "— Ajouter un jeune —" }));
    profils.forEach(function (p) {
      sel.appendChild(UI.el("option", { value: p.id, text: p.prenom + (p.age ? " (" + p.age + " ans)" : ""), selected: p.id === profilActifId() }));
    });
  }

  function rafraichirSelectPublic() {
    var sel = document.getElementById("public-actif");
    if (!sel) return;
    UI.vider(sel);
    if (!publicActif()) {
      sel.appendChild(UI.el("option", { value: "", text: "— Pour qui ? —", selected: true, disabled: true }));
    }
    PUBLICS.forEach(function (p) {
      sel.appendChild(UI.el("option", {
        value: p.id,
        text: p.court + " · " + p.detail,
        selected: p.id === publicActif()
      }));
    });
  }

  // ---- Écran de bienvenue : « Pour qui ouvre-t-on Boussole ? » ----
  function ecranChoixPublic(vue) {
    vue.appendChild(UI.enTete(
      "Pour qui ouvre-t-on Boussole ?",
      "Choisissez la tranche d'âge : le menu s'adaptera pour rester clair et apaisant. Vous pourrez en changer à tout moment, en haut de l'écran."
    ));
    var grille = UI.el(".grille");
    var cartes = [
      { id: "enfant", ic: "🧒", masc: "neuroo", titre: "Un enfant", desc: "6-12 ans — outils visuels, pictogrammes, en douceur.", accent: "#3FB8AF", soft: "#DBF3F0" },
      { id: "ado", ic: "🧑", masc: "noury", titre: "Un·e ado", desc: "12-18 ans — émotions, pensées, autonomie.", accent: "#E07BAA", soft: "#FCE4EF" },
      { id: "parent", ic: "👪", masc: "maman", titre: "Un parent", desc: "Accompagner mon enfant : tous les outils enfants et ados.", accent: "#F0996B", soft: "#FFE7DA" },
      { id: "pro", ic: "🧭", masc: "educa", titre: "Moi, praticienne", desc: "Accès complet : tous les outils, fiches et suivi.", accent: "#9B7AD8", soft: "#EEE6FB" }
    ];
    cartes.forEach(function (c) {
      grille.appendChild(UI.el("a.tuile", { href: "#/accueil", style: "border:2px solid " + c.soft, onclick: function (e) {
        e.preventDefault();
        setPublicActif(c.id);
        naviguer("accueil");
        routerVers();
      }}, [
        UI.el("span.tuile-ic.masc", { "aria-hidden": "true", style: "background:" + c.soft }, [
          UI.el("img", { src: "assets/img/mascotte-" + c.masc + ".png", alt: "", loading: "lazy" })
        ]),
        UI.el("h3", { text: c.titre }),
        UI.el("p", { text: c.desc })
      ]));
    });
    vue.appendChild(grille);
  }

  // ---- Favoris & récents ----
  function favoris() { return Store.lire("favoris", []); }
  function estFavori(id) { return favoris().indexOf(id) >= 0; }
  function toggleFavori(id) {
    var f = favoris(); var i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
    Store.ecrire("favoris", f); return i < 0;
  }
  function recents() {
    return Store.lire("recents", []).map(outilParId).filter(Boolean);
  }
  function noterRecent(id) {
    if (id === "accueil") return;
    var r = Store.lire("recents", []).filter(function (x) { return x !== id; });
    r.unshift(id);
    Store.ecrire("recents", r.slice(0, 6));
  }

  // ---- Construction de la navigation ----
  function construireNav() {
    var conteneur = document.getElementById("nav-groups");
    UI.vider(conteneur);

    // Champ de recherche
    var recherche = UI.el("input", { type: "search", placeholder: "🔍 Rechercher un outil…", "aria-label": "Rechercher un outil", style: "width:100%;padding:.55rem .7rem;border:1px solid var(--gris-clair);border-radius:10px;margin-bottom:.8rem;font-size:.95rem;font-family:inherit" });
    recherche.addEventListener("input", function () {
      var q = recherche.value.trim().toLowerCase();
      document.querySelectorAll("#nav-groups .nav-link").forEach(function (a) {
        var t = (a.textContent || "").toLowerCase();
        a.style.display = (!q || t.indexOf(q) >= 0) ? "" : "none";
      });
      document.querySelectorAll("#nav-groups .nav-group").forEach(function (grp) {
        var visibles = grp.querySelectorAll('.nav-link:not([style*="display: none"])').length;
        grp.style.display = visibles ? "" : "none";
      });
    });
    conteneur.appendChild(recherche);

    // Tant qu'aucune tranche d'âge n'est choisie, on garde le menu épuré :
    // l'écran de bienvenue invite d'abord à choisir « Pour qui ? ».
    if (!publicActif()) return;

    groupes.forEach(function (g) {
      if (g.id === "spirituel" && !spiritualiteActive()) return;
      var liste = outils.filter(function (o) { return o.groupe === g.id && outilVisible(o); });
      if (!liste.length) return;
      var bloc = UI.el(".nav-group");
      if (g.nom) bloc.appendChild(UI.el("h2", { text: g.nom }));
      liste.forEach(function (o) {
        bloc.appendChild(UI.el("a.nav-link", {
          href: "#/" + o.id, dataset: { outil: o.id }
        }, [
          UI.el("span.ic", { text: o.icone, "aria-hidden": "true" }),
          UI.el("span", { text: o.titre })
        ]));
      });
      conteneur.appendChild(bloc);
    });
  }

  function marquerActif(id) {
    document.querySelectorAll(".nav-link").forEach(function (a) {
      a.classList.toggle("actif", a.dataset.outil === id);
    });
  }

  // ---- Garde « espace praticienne » (décision 22/07/2026) ----
  // Les 5 outils pro deviennent accessibles uniquement derrière un code.
  // ⚠️ NON DESTRUCTIF : aucune donnée n'est supprimée ni déplacée — c'est une
  // simple porte sur le routeur. Le code n'est JAMAIS stocké en clair : on ne
  // garde que son empreinte SHA-256 et on compare les empreintes.
  var PRO_VERROUILLES = ["profils", "suivi", "abc", "modeles-pro", "personnalisation"];
  // Empreinte du code praticienne. Code PROVISOIRE « mizan2026 » — à remplacer
  // par le vrai code choisi par Nawel (je recalcule l'empreinte avant déploiement).
  var CODE_PRATICIENNE_SHA256 = "320ddc16d29bfc2d27d54e282a27ea1862477fe94d782057858d7829a809ba1d";

  function proDeverrouille() { try { return sessionStorage.getItem("boussole.pro.ouvert") === "1"; } catch (e) { return false; } }
  function ouvrirSessionPro() { try { sessionStorage.setItem("boussole.pro.ouvert", "1"); } catch (e) { /* session verrouillée : on ré-affichera le code */ } }
  function empreinteSha256(txt) {
    var enc = new TextEncoder().encode(txt);
    return crypto.subtle.digest("SHA-256", enc).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function ecranProVerrouille(vue, outil) {
    document.title = "Espace praticienne — Boussole";
    marquerActif(outil.id);
    document.body.classList.remove("menu-ouvert");
    var input = UI.input({ type: "password", placeholder: "Code praticienne" });
    input.setAttribute("autocomplete", "off");
    var erreur = UI.el("p.pro-lock-err", { text: "", role: "alert" });
    function tenter() {
      var val = (input.value || "").trim();
      if (!val) { input.focus(); return; }
      empreinteSha256(val).then(function (h) {
        if (h === CODE_PRATICIENNE_SHA256) { ouvrirSessionPro(); routerVers(); }
        else { erreur.textContent = "Code incorrect. Réessayez."; input.value = ""; input.focus(); }
      }).catch(function () { erreur.textContent = "Vérification impossible sur ce navigateur."; });
    }
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); tenter(); } });
    vue.appendChild(UI.el(".pro-lock", {}, [
      UI.el("div.pro-lock-ic", { text: "🔒", "aria-hidden": "true" }),
      UI.el("h1", { text: "Espace praticienne" }),
      UI.el("p.pro-lock-sub", { text: "Cet outil est réservé à la praticienne. Entrez votre code pour y accéder — vos dossiers restent intacts sur cet appareil." }),
      UI.champ("Code praticienne", input),
      erreur,
      UI.el("button.btn", { text: "Ouvrir mon espace", onclick: tenter }),
      UI.el("p.pro-lock-note", { text: "Le code déverrouille les outils pro pour cette session. Rien n'est envoyé sur internet." })
    ]));
    setTimeout(function () { input.focus(); }, 50);
  }

  // ---- Routeur (hash) ----
  function routerVers() {
    var hash = location.hash.replace(/^#\/?/, "") || "accueil";
    var id = hash.split("/")[0];
    var arg = hash.split("/").slice(1).join("/");
    var outil = outilParId(id) || outilParId("accueil");
    var vue = document.getElementById("vue");
    UI.vider(vue);

    // Premier lancement : tant qu'aucune tranche d'âge n'est choisie, on
    // présente l'écran de bienvenue (sauf si on vise déjà cet écran).
    if (!publicActif()) {
      marquerActif("accueil");
      document.body.classList.remove("menu-ouvert");
      document.title = "Boussole";
      ecranChoixPublic(vue);
      window.scrollTo(0, 0);
      return;
    }

    // Garde praticienne : outils pro derrière un code (aucune donnée touchée).
    if (PRO_VERROUILLES.indexOf(outil.id) >= 0 && !proDeverrouille()) {
      ecranProVerrouille(vue, outil);
      window.scrollTo(0, 0);
      return;
    }

    marquerActif(outil.id);
    noterRecent(outil.id);
    document.body.classList.remove("menu-ouvert");
    document.getElementById("contenu").focus();
    document.title = (outil.titre ? outil.titre + " — " : "") + "Boussole";
    try {
      outil.render(vue, { profil: profilActif(), arg: arg, naviguer: naviguer, refreshProfils: rafraichirSelectProfil });
    } catch (e) {
      console.error(e);
      vue.appendChild(UI.el("p", { text: "Une erreur est survenue dans cet outil : " + e.message }));
    }
    window.scrollTo(0, 0);
  }

  function naviguer(route) { location.hash = "#/" + route; }

  // ---- API publique pour la liste des outils (page d'accueil) ----
  function tousLesOutils() {
    return outils.filter(function (o) { return o.id !== "accueil"; });
  }
  function nomGroupe(id) {
    var g = groupes.filter(function (x) { return x.id === id; })[0];
    return g ? g.nom : "";
  }

  // ---- Démarrage ----
  function start() {
    rafraichirSelectPublic();
    construireNav();
    rafraichirSelectProfil();

    var selPublic = document.getElementById("public-actif");
    if (selPublic) {
      selPublic.addEventListener("change", function (e) {
        setPublicActif(e.target.value || null);
        naviguer("accueil");
        routerVers();
      });
    }

    document.getElementById("profil-actif").addEventListener("change", function (e) {
      if (!e.target.value) {
        if (Store.profils.tout().length === 0) { naviguer("profils"); return; }
      }
      setProfilActif(e.target.value || null);
      routerVers();
    });

    var btnMenu = document.getElementById("btn-menu");
    btnMenu.addEventListener("click", function () {
      var ouvert = document.body.classList.toggle("menu-ouvert");
      btnMenu.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
    document.getElementById("backdrop").addEventListener("click", function () {
      document.body.classList.remove("menu-ouvert");
    });

    // Préférences d'accessibilité et personnalisation au chargement
    Boussole.appliquerAccessibilite();
    Boussole.appliquerPerso();

    window.addEventListener("hashchange", routerVers);
    routerVers();
  }

  function outilParIdPublic(id) { return outilParId(id); }

  window.Boussole = {
    registerTool: registerTool,
    tousLesOutils: tousLesOutils,
    outilParId: outilParIdPublic,
    nomGroupe: nomGroupe,
    naviguer: naviguer,
    profilActif: profilActif,
    setProfilActif: setProfilActif,
    rafraichirSelectProfil: rafraichirSelectProfil,
    favoris: favoris,
    estFavori: estFavori,
    toggleFavori: toggleFavori,
    recents: recents,
    spiritualiteActive: spiritualiteActive,
    publicActif: publicActif,
    setPublicActif: setPublicActif,
    outilVisible: outilVisible,
    majNav: construireNav,
    start: start,
    // définis dans accessibilite.js / personnalisation.js, valeurs par défaut sûres ici
    appliquerAccessibilite: function () {},
    appliquerPerso: function () {},
    perso: function () { return Store.lire("perso", {}); }
  };
})();
