/* ============================================================
   Jannat Al Qalb — couche de stockage local (localStorage)
   100% local : aucune donnée ne quitte l'appareil.
   ============================================================ */
(function () {
  "use strict";

  var PREFIX = "jannatalqalb.v1.";

  function lire(cle, defaut) {
    try {
      var brut = localStorage.getItem(PREFIX + cle);
      return brut === null ? defaut : JSON.parse(brut);
    } catch (e) {
      console.warn("Jannat Al Qalb : lecture impossible", cle, e);
      return defaut;
    }
  }

  function ecrire(cle, valeur) {
    try {
      localStorage.setItem(PREFIX + cle, JSON.stringify(valeur));
      return true;
    } catch (e) {
      console.warn("Jannat Al Qalb : écriture impossible", cle, e);
      return false;
    }
  }

  function supprimer(cle) { localStorage.removeItem(PREFIX + cle); }

  function id() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // --- Collection générique (tableau d'objets datés) ---
  function collection(nom) {
    return {
      tout: function () { return lire(nom, []); },
      filtre: function (fn) { return lire(nom, []).filter(fn); },
      parId: function (i) { return lire(nom, []).filter(function (x) { return x.id === i; })[0]; },
      ajouter: function (obj) {
        var arr = lire(nom, []);
        obj.id = obj.id || id();
        obj.cree = obj.cree || new Date().toISOString();
        arr.push(obj);
        ecrire(nom, arr);
        return obj;
      },
      majParId: function (i, modifs) {
        var arr = lire(nom, []);
        for (var k = 0; k < arr.length; k++) {
          if (arr[k].id === i) {
            Object.keys(modifs).forEach(function (m) { arr[k][m] = modifs[m]; });
            ecrire(nom, arr);
            return arr[k];
          }
        }
        return null;
      },
      supprimer: function (i) {
        ecrire(nom, lire(nom, []).filter(function (x) { return x.id !== i; }));
      },
      ecraser: function (arr) { ecrire(nom, arr); }
    };
  }

  // --- Export / Import / Réinitialisation (maîtrise des données) ---
  function exporterTout() {
    var donnees = {};
    for (var i = 0; i < localStorage.length; i++) {
      var cle = localStorage.key(i);
      if (cle.indexOf(PREFIX) === 0) {
        donnees[cle.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(cle));
      }
    }
    return { app: "Jannat Al Qalb", version: 1, exporte: new Date().toISOString(), donnees: donnees };
  }

  function importerTout(paquet) {
    if (!paquet || !paquet.donnees) throw new Error("Fichier invalide");
    Object.keys(paquet.donnees).forEach(function (cle) { ecrire(cle, paquet.donnees[cle]); });
  }

  function effacerTout() {
    var aSupprimer = [];
    for (var i = 0; i < localStorage.length; i++) {
      var cle = localStorage.key(i);
      if (cle.indexOf(PREFIX) === 0) aSupprimer.push(cle);
    }
    aSupprimer.forEach(function (c) { localStorage.removeItem(c); });
  }

  // --- Helpers de dates (clé du jour, fenêtres glissantes) ---
  function cleJour(d) {
    d = d ? new Date(d) : new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  window.Store = {
    lire: lire, ecrire: ecrire, supprimer: supprimer, id: id,
    collection: collection,
    exporterTout: exporterTout, importerTout: importerTout, effacerTout: effacerTout,
    cleJour: cleJour,
    // Collections de l'app V1
    checkins: collection("checkins"),
    pensees: collection("pensees")
  };

  // ---- Préférences (rappels doux, prénom, langue, thème) ----
  Store.prefs = function () {
    return lire("prefs", { prenom: "", rappelActif: false, rappelHeure: "09:00", langue: "fr", themeAuto: true });
  };
  Store.majPrefs = function (modifs) {
    var p = Store.prefs();
    Object.keys(modifs).forEach(function (k) { p[k] = modifs[k]; });
    ecrire("prefs", p);
    return p;
  };

  // ---- Check-in du jour ----
  Store.checkinDuJour = function (d) {
    var cle = cleJour(d);
    return Store.checkins.filtre(function (c) { return c.date === cle; }).slice(-1)[0] || null;
  };
})();
