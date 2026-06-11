/* ============================================================
   Boussole — couche de stockage local (localStorage)
   Aucune donnée ne quitte l'appareil.
   ============================================================ */
(function () {
  "use strict";

  var PREFIX = "boussole.v1.";

  function lire(cle, defaut) {
    try {
      var brut = localStorage.getItem(PREFIX + cle);
      return brut === null ? defaut : JSON.parse(brut);
    } catch (e) {
      console.warn("Boussole: lecture impossible", cle, e);
      return defaut;
    }
  }

  function ecrire(cle, valeur) {
    try {
      localStorage.setItem(PREFIX + cle, JSON.stringify(valeur));
      return true;
    } catch (e) {
      console.warn("Boussole: écriture impossible", cle, e);
      return false;
    }
  }

  function supprimer(cle) {
    localStorage.removeItem(PREFIX + cle);
  }

  // Identifiant court unique
  function id() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // --- Collections génériques (tableaux d'objets) ---
  function collection(nom) {
    return {
      tout: function () { return lire(nom, []); },
      filtre: function (fn) { return lire(nom, []).filter(fn); },
      parId: function (id) { return lire(nom, []).filter(function (x) { return x.id === id; })[0]; },
      ajouter: function (obj) {
        var arr = lire(nom, []);
        obj.id = obj.id || id();
        obj.cree = obj.cree || new Date().toISOString();
        arr.push(obj);
        ecrire(nom, arr);
        return obj;
      },
      majParId: function (id, modifs) {
        var arr = lire(nom, []);
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            Object.keys(modifs).forEach(function (k) { arr[i][k] = modifs[k]; });
            ecrire(nom, arr);
            return arr[i];
          }
        }
        return null;
      },
      supprimer: function (id) {
        ecrire(nom, lire(nom, []).filter(function (x) { return x.id !== id; }));
      },
      ecraser: function (arr) { ecrire(nom, arr); }
    };
  }

  // --- Export / Import / Réinitialisation (RGPD : maîtrise des données) ---
  function exporterTout() {
    var donnees = {};
    for (var i = 0; i < localStorage.length; i++) {
      var cle = localStorage.key(i);
      if (cle.indexOf(PREFIX) === 0) {
        donnees[cle.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(cle));
      }
    }
    return { app: "Boussole", version: 1, exporte: new Date().toISOString(), donnees: donnees };
  }

  function importerTout(paquet) {
    if (!paquet || !paquet.donnees) throw new Error("Fichier invalide");
    Object.keys(paquet.donnees).forEach(function (cle) {
      ecrire(cle, paquet.donnees[cle]);
    });
  }

  function effacerTout() {
    var aSupprimer = [];
    for (var i = 0; i < localStorage.length; i++) {
      var cle = localStorage.key(i);
      if (cle.indexOf(PREFIX) === 0) aSupprimer.push(cle);
    }
    aSupprimer.forEach(function (c) { localStorage.removeItem(c); });
  }

  window.Store = {
    lire: lire,
    ecrire: ecrire,
    supprimer: supprimer,
    id: id,
    collection: collection,
    exporterTout: exporterTout,
    importerTout: importerTout,
    effacerTout: effacerTout,
    // Collections nommées de l'application
    profils: collection("profils"),
    humeurs: collection("humeurs"),
    emotions: collection("emotions"),
    pensees: collection("pensees"),
    jetonsEvts: collection("jetonsEvts"),
    recompenses: collection("recompenses"),
    sequences: collection("sequences"),
    emploisDuTemps: collection("emploisDuTemps"),
    plansSecurite: collection("plansSecurite"),
    abc: collection("abc"),
    gratitudes: collection("gratitudes")
  };
})();
