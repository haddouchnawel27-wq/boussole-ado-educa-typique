/* ===========================================================================
   vault.js — Coffre local privé de l'espace Ado
   ---------------------------------------------------------------------------
   • Espace de noms isolé : capEduca.ado.*  (jamais mélangé avec la Boussole).
   • Les données sensibles ne quittent JAMAIS l'appareil (aucun réseau).
   • Chiffrement réel AES-GCM 256 bits, clé dérivée du CODE PERSONNEL de l'ado
     via PBKDF2 (SHA-256, 150 000 itérations). Le code n'est jamais stocké.
   • Sans le code, les données ne sont pas déchiffrables : c'est voulu (privé).
     Un « tout effacer » reste toujours possible.
   • Repli : sur un contexte non sécurisé (file://) où crypto.subtle est absent,
     on stocke en clair mais on le signale (Vault.chiffrementActif() === false).
   =========================================================================== */
(function (global) {
  "use strict";

  var NS = "capEduca.ado.";
  var K_SALT = NS + "salt";
  var K_VERIF = NS + "verifier";
  var K_META = NS + "meta";
  var K_PREFS = NS + "prefs";        // préférences NON sensibles (thème, dys…), en clair
  var D_PREFIX = NS + "data.";       // enregistrements de données (chiffrés)
  var JETON = "capEduca-ado-verifier-v1";

  var subtle = (global.crypto && global.crypto.subtle) ? global.crypto.subtle : null;
  var cle = null;        // CryptoKey en mémoire après déverrouillage
  var ouvert = false;

  /* ---------- utilitaires binaires ---------- */
  function enc(str) { return new TextEncoder().encode(str); }
  function dec(buf) { return new TextDecoder().decode(buf); }
  function toB64(buf) {
    var b = new Uint8Array(buf), s = "";
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  }
  function fromB64(str) {
    var s = atob(str), a = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a;
  }
  function alea(n) {
    var a = new Uint8Array(n);
    if (global.crypto && global.crypto.getRandomValues) global.crypto.getRandomValues(a);
    return a;
  }

  /* ---------- dérivation de clé ---------- */
  function deriverCle(code, salt) {
    return subtle.importKey("raw", enc(code), { name: "PBKDF2" }, false, ["deriveKey"])
      .then(function (base) {
        return subtle.deriveKey(
          { name: "PBKDF2", salt: salt, iterations: 150000, hash: "SHA-256" },
          base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
      });
  }

  function chiffrer(texte) {
    if (!subtle || !cle) return Promise.resolve({ p: texte }); // repli clair
    var iv = alea(12);
    return subtle.encrypt({ name: "AES-GCM", iv: iv }, cle, enc(texte))
      .then(function (ct) { return { iv: toB64(iv), ct: toB64(ct) }; });
  }
  function dechiffrer(rec) {
    if (rec && rec.p !== undefined) return Promise.resolve(rec.p); // repli clair
    if (!subtle || !cle) return Promise.reject(new Error("verrouille"));
    return subtle.decrypt({ name: "AES-GCM", iv: fromB64(rec.iv) }, cle, fromB64(rec.ct))
      .then(function (buf) { return dec(buf); });
  }

  /* ---------- API publique ---------- */
  var Vault = {

    /* Un code personnel a-t-il déjà été créé sur cet appareil ? */
    existe: function () {
      return !!(localStorage.getItem(K_META) || localStorage.getItem(K_VERIF));
    },

    chiffrementActif: function () { return !!subtle; },
    estOuvert: function () { return ouvert; },

    /* Création du code personnel (premier lancement). */
    creer: function (code) {
      var salt = alea(16);
      var meta = { creeLe: new Date().toISOString(), chiffre: !!subtle };
      if (!subtle) {
        // repli non sécurisé : on garde un vérificateur simple (non cryptographique)
        localStorage.setItem(K_SALT, toB64(salt));
        localStorage.setItem(K_VERIF, JSON.stringify({ p: JETON }));
        localStorage.setItem(K_META, JSON.stringify(meta));
        ouvert = true;
        return Promise.resolve(true);
      }
      return deriverCle(code, salt).then(function (k) {
        cle = k;
        return chiffrer(JETON);
      }).then(function (rec) {
        localStorage.setItem(K_SALT, toB64(salt));
        localStorage.setItem(K_VERIF, JSON.stringify(rec));
        localStorage.setItem(K_META, JSON.stringify(meta));
        ouvert = true;
        return true;
      });
    },

    /* Déverrouillage avec le code : renvoie true si le code est correct. */
    ouvrir: function (code) {
      var saltRaw = localStorage.getItem(K_SALT);
      var verifRaw = localStorage.getItem(K_VERIF);
      if (!saltRaw || !verifRaw) return Promise.resolve(false);
      var verif = JSON.parse(verifRaw);
      if (!subtle) { // repli clair
        ouvert = true;
        return Promise.resolve(true);
      }
      var salt = fromB64(saltRaw);
      return deriverCle(code, salt).then(function (k) {
        cle = k;
        return dechiffrer(verif);
      }).then(function (val) {
        if (val === JETON) { ouvert = true; return true; }
        cle = null; return false;
      }).catch(function () { cle = null; return false; });
    },

    /* Verrouiller : oublie la clé en mémoire (« Quitter pour aujourd'hui »). */
    fermer: function () { cle = null; ouvert = false; },

    /* Écrire un enregistrement (objet JSON) — chiffré. */
    ecrire: function (nom, valeur) {
      return chiffrer(JSON.stringify(valeur)).then(function (rec) {
        localStorage.setItem(D_PREFIX + nom, JSON.stringify(rec));
        return true;
      });
    },

    /* Lire un enregistrement — renvoie l'objet, ou null. */
    lire: function (nom) {
      var raw = localStorage.getItem(D_PREFIX + nom);
      if (!raw) return Promise.resolve(null);
      var rec;
      try { rec = JSON.parse(raw); } catch (e) { return Promise.resolve(null); }
      return dechiffrer(rec).then(function (txt) {
        try { return JSON.parse(txt); } catch (e) { return null; }
      }).catch(function () { return null; });
    },

    /* Préférences NON sensibles (thème, confort dys…) — en clair, lisibles
       avant déverrouillage pour afficher l'écran de garde dans le bon thème. */
    lirePrefs: function () {
      try { return JSON.parse(localStorage.getItem(K_PREFS)) || {}; }
      catch (e) { return {}; }
    },
    ecrirePrefs: function (prefs) {
      localStorage.setItem(K_PREFS, JSON.stringify(prefs || {}));
    },

    /* Tout effacer (données + code). Les préférences peuvent être conservées. */
    reset: function (garderPrefs) {
      var aSupprimer = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(NS) === 0) {
          if (garderPrefs && k === K_PREFS) continue;
          aSupprimer.push(k);
        }
      }
      aSupprimer.forEach(function (k) { localStorage.removeItem(k); });
      cle = null; ouvert = false;
    },

    /* Exporter toutes les données déchiffrées (pour sauvegarde par l'ado). */
    exporter: function () {
      var noms = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(D_PREFIX) === 0) noms.push(k.slice(D_PREFIX.length));
      }
      return Promise.all(noms.map(function (nom) {
        return Vault.lire(nom).then(function (v) { return { nom: nom, valeur: v }; });
      })).then(function (paires) {
        var sortie = { app: "mode-emploi-de-moi", exporteLe: new Date().toISOString(), donnees: {} };
        paires.forEach(function (p) { sortie.donnees[p.nom] = p.valeur; });
        return sortie;
      });
    }
  };

  global.Vault = Vault;
})(window);
