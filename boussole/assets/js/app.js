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
    { id: "tcc", nom: "TCC · Émotions" },
    { id: "enfants", nom: "Enfants (6-12 ans)" },
    { id: "secours", nom: "Secourisme santé mentale" },
    { id: "spirituel", nom: "Coin spiritualité" },
    { id: "pro", nom: "Suivi & réglages" }
  ];

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

    groupes.forEach(function (g) {
      if (g.id === "spirituel" && !spiritualiteActive()) return;
      var liste = outils.filter(function (o) { return o.groupe === g.id; });
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

  // ---- Routeur (hash) ----
  function routerVers() {
    var hash = location.hash.replace(/^#\/?/, "") || "accueil";
    var id = hash.split("/")[0];
    var arg = hash.split("/").slice(1).join("/");
    var outil = outilParId(id) || outilParId("accueil");
    var vue = document.getElementById("vue");
    UI.vider(vue);
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
    construireNav();
    rafraichirSelectProfil();

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
    majNav: construireNav,
    start: start,
    // définis dans accessibilite.js / personnalisation.js, valeurs par défaut sûres ici
    appliquerAccessibilite: function () {},
    appliquerPerso: function () {},
    perso: function () { return Store.lire("perso", {}); }
  };
})();
