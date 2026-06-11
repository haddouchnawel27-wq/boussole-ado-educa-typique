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
    { id: "secours", nom: "Secourisme santé mentale" },
    { id: "spirituel", nom: "Ancrage & spiritualité" },
    { id: "pro", nom: "Suivi & réglages" }
  ];

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

  // ---- Construction de la navigation ----
  function construireNav() {
    var conteneur = document.getElementById("nav-groups");
    UI.vider(conteneur);
    groupes.forEach(function (g) {
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

    // Préférences d'accessibilité au chargement
    Boussole.appliquerAccessibilite();

    window.addEventListener("hashchange", routerVers);
    routerVers();
  }

  window.Boussole = {
    registerTool: registerTool,
    tousLesOutils: tousLesOutils,
    nomGroupe: nomGroupe,
    naviguer: naviguer,
    profilActif: profilActif,
    setProfilActif: setProfilActif,
    rafraichirSelectProfil: rafraichirSelectProfil,
    start: start,
    // défini dans accessibilite.js, valeur par défaut sûre ici
    appliquerAccessibilite: function () {}
  };
})();
