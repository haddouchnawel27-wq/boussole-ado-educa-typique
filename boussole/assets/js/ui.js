/* ============================================================
   Boussole — helpers d'interface (création DOM, modal, toast)
   ============================================================ */
(function () {
  "use strict";

  // Création d'élément concise : el("div.maClasse#monId", { attrs }, [enfants])
  function el(selecteur, attrs, enfants) {
    var parts = selecteur.split(/(?=[.#])/);
    var tag = parts[0] && parts[0][0] !== "." && parts[0][0] !== "#" ? parts[0] : "div";
    var node = document.createElement(tag);
    parts.forEach(function (p) {
      if (p[0] === ".") node.classList.add(p.slice(1));
      else if (p[0] === "#") node.id = p.slice(1);
    });
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "html") node.innerHTML = v;
        else if (k === "text") node.textContent = v;
        else if (k === "onclick" || k.indexOf("on") === 0 && typeof v === "function") {
          node.addEventListener(k.slice(2), v);
        } else if (k === "dataset") {
          Object.keys(v).forEach(function (d) { node.dataset[d] = v[d]; });
        } else if (k in node && k !== "list") {
          try { node[k] = v; } catch (e) { node.setAttribute(k, v); }
        } else {
          node.setAttribute(k, v);
        }
      });
    }
    (enfants || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function vider(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function toast(message, duree) {
    var t = document.getElementById("toast");
    t.textContent = message;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.hidden = true; }, duree || 2600);
  }

  // Modal générique. champs optionnels -> renvoie une promesse de confirmation.
  function modal(opts) {
    return new Promise(function (resolve) {
      var racine = document.getElementById("modal-root");
      var corps = el(".modal", { role: "dialog", "aria-modal": "true" });
      if (opts.titre) corps.appendChild(el("h3", { text: opts.titre }));
      if (opts.message) corps.appendChild(el("p", { text: opts.message }));
      if (opts.contenu) corps.appendChild(opts.contenu);

      function fermer(val) { vider(racine); document.removeEventListener("keydown", esc); resolve(val); }
      function esc(e) { if (e.key === "Escape") fermer(null); }
      document.addEventListener("keydown", esc);

      var actions = el(".btn-rangee", { style: "margin-bottom:0;justify-content:flex-end" });
      if (opts.annuler !== false) {
        actions.appendChild(el("button.btn.ghost", { text: opts.texteAnnuler || "Annuler", onclick: function () { fermer(null); } }));
      }
      actions.appendChild(el("button.btn" + (opts.danger ? ".danger" : ""), {
        text: opts.texteOk || "Valider",
        onclick: function () { fermer(opts.onOk ? opts.onOk() : true); }
      }));
      corps.appendChild(actions);

      var overlay = el(".modal-overlay", { onclick: function (e) { if (e.target === overlay) fermer(null); } }, [corps]);
      racine.appendChild(overlay);
      var premier = corps.querySelector("input, textarea, select, button");
      if (premier) premier.focus();
    });
  }

  function confirmer(message, opts) {
    opts = opts || {};
    return modal({ titre: opts.titre || "Confirmer", message: message, texteOk: opts.texteOk || "Oui", danger: opts.danger });
  }

  // Petit champ de formulaire
  function champ(label, control, aide) {
    var c = el(".champ", {}, [el("label", { text: label }), control]);
    if (aide) c.appendChild(el("div.aide", { text: aide }));
    return c;
  }

  function input(attrs) { return el("input", Object.assign({ type: "text" }, attrs || {})); }
  function textarea(attrs) { return el("textarea", attrs || {}); }
  function select(options, attrs) {
    var s = el("select", attrs || {});
    options.forEach(function (o) {
      s.appendChild(el("option", { value: o.value, text: o.label, selected: o.selected }));
    });
    return s;
  }

  // Format date FR court
  function dateFr(iso) {
    try { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); }
    catch (e) { return iso; }
  }
  function dateHeureFr(iso) {
    try { return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return iso; }
  }

  // Téléchargement d'un fichier (JSON, texte…)
  function telecharger(nomFichier, contenu, type) {
    var blob = new Blob([contenu], { type: type || "application/json" });
    var url = URL.createObjectURL(blob);
    var a = el("a", { href: url, download: nomFichier });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // Bloc « état vide »
  function vide(emoji, titre, sous) {
    return el(".vide", {}, [
      el("span.emoji", { text: emoji }),
      el("p", { html: "<strong>" + titre + "</strong>" }),
      sous ? el("p", { text: sous }) : null
    ]);
  }

  // En-tête de vue avec lien retour
  function enTete(titre, sousTitre) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el("h1.vue-titre", { text: titre }));
    if (sousTitre) frag.appendChild(el("p.vue-soustitre", { text: sousTitre }));
    return frag;
  }

  window.UI = {
    el: el, vider: vider, toast: toast, modal: modal, confirmer: confirmer,
    champ: champ, input: input, textarea: textarea, select: select,
    dateFr: dateFr, dateHeureFr: dateHeureFr, telecharger: telecharger,
    vide: vide, enTete: enTete
  };
})();
