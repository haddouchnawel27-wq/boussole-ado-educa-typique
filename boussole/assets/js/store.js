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
    gratitudes: collection("gratitudes"),
    notes: collection("notes"),
    objectifs: collection("objectifs"),
    profilsNeuro: collection("profilsNeuro"),
    taches: collection("taches")
  };

  // --- Agrégation : frise de suivi unifiée d'un jeune ---
  // Fusionne tous les éléments datés (émotions, humeurs, pensées, ABC,
  // jetons, gratitude, notes) en une liste typée et triée du + récent au + ancien.
  function journalDuJeune(profilId) {
    var NIV = ["", "Très bas", "Bas", "Moyen", "Bien", "Très bien"];
    var NIV_EMO = ["", "😞", "🙁", "😐", "🙂", "😄"];
    var items = [];
    function pousser(arr, mapper) { arr.forEach(function (x) { if (profilId == null || x.profilId === profilId) items.push(mapper(x)); }); }

    pousser(window.Store.emotions.tout(), function (e) {
      return { type: "emotion", icone: e.emoji || "🌡️", date: e.cree, titre: e.emotion + " — " + e.intensite + "/10", detail: e.note || "", ref: e, outil: "emotions" };
    });
    pousser(window.Store.humeurs.tout(), function (h) {
      return { type: "humeur", icone: NIV_EMO[h.niveau] || "📈", date: h.cree, titre: "Humeur : " + (NIV[h.niveau] || h.niveau), detail: h.note || "", ref: h, outil: "humeur" };
    });
    pousser(window.Store.pensees.tout(), function (p) {
      return { type: "pensee", icone: "💭", date: p.cree, titre: "Pensée : " + (p.situation || "—"), detail: (p.alternative ? "💡 " + p.alternative : (p.pensee || "")), ref: p, outil: "pensees" };
    });
    pousser(window.Store.abc.tout(), function (o) {
      return { type: "abc", icone: "🔍", date: o.cree, titre: "Comportement : " + o.comportement, detail: o.fonction ? "Fonction : " + o.fonction : "", ref: o, outil: "abc" };
    });
    pousser(window.Store.jetonsEvts.tout(), function (j) {
      return { type: "jeton", icone: j.montant > 0 ? "⭐" : "🎁", date: j.cree, titre: (j.montant > 0 ? "+" : "") + j.montant + " jeton" + (Math.abs(j.montant) > 1 ? "s" : ""), detail: j.motif || "", ref: j, outil: "jetons" };
    });
    pousser(window.Store.gratitudes.tout(), function (g) {
      return { type: "gratitude", icone: "🌸", date: g.cree, titre: "Gratitude", detail: g.texte || "", ref: g, outil: "gratitude" };
    });
    pousser(window.Store.notes.tout(), function (n) {
      return { type: "note", icone: "📝", date: n.cree, titre: "Note de séance" + (n.titre ? " — " + n.titre : ""), detail: n.texte || "", ref: n, outil: "suivi" };
    });

    items.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    return items;
  }
  window.Store.journalDuJeune = journalDuJeune;
})();
