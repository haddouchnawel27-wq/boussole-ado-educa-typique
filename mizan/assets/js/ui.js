/* ============================================================
   Mîzân — helpers d'interface (création DOM, toast, modal)
   Léger, sans dépendance.
   ============================================================ */
(function () {
  "use strict";

  // el("button.classe", {props}, [enfants]) — crée un élément.
  function el(selecteur, props, enfants) {
    var parts = String(selecteur).split(/(?=[.#])/);
    var tag = parts[0] && parts[0][0] !== "." && parts[0][0] !== "#" ? parts.shift() : "div";
    var node = document.createElement(tag);
    parts.forEach(function (p) {
      if (p[0] === ".") node.classList.add(p.slice(1));
      else if (p[0] === "#") node.id = p.slice(1);
    });
    props = props || {};
    Object.keys(props).forEach(function (k) {
      if (k === "text") node.textContent = props[k];
      else if (k === "html") node.innerHTML = props[k];
      else if (k === "onclick") node.addEventListener("click", props[k]);
      else if (k === "dataset") Object.keys(props[k]).forEach(function (d) { node.dataset[d] = props[k][d]; });
      else if (k === "style") node.setAttribute("style", props[k]);
      else if (props[k] === true) node.setAttribute(k, "");
      else if (props[k] !== false && props[k] != null) node.setAttribute(k, props[k]);
    });
    (enfants || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function vider(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

  function enTete(titre, sous) {
    return el(".entete", {}, [
      el("h1", { text: titre }),
      sous ? el("p.sous", { text: sous }) : null
    ]);
  }

  function carte(enfants) { return el(".carte", {}, enfants); }

  function input(props) { return el("input.champ-input", props || {}); }

  function champ(label, control) {
    return el("label.champ", {}, [label ? el("span.champ-label", { text: label }) : null, control]);
  }

  var toastTimer = null;
  function toast(message) {
    var t = document.getElementById("toast");
    t.textContent = message;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  function modal(opts) {
    var root = document.getElementById("modal-root");
    vider(root);
    var corps = el(".modal", {}, [
      el("h2", { text: opts.titre || "" }),
      opts.message ? el("p", { text: opts.message }) : null
    ]);
    if (opts.contenu) corps.appendChild(opts.contenu);
    var pied = el(".modal-pied");
    if (opts.annuler) {
      pied.appendChild(el("button.btn.ghost", {
        text: opts.texteAnnuler || "Annuler",
        onclick: function () { vider(root); }
      }));
    }
    if (opts.texteOk) {
      pied.appendChild(el("button.btn", {
        text: opts.texteOk,
        onclick: function () { if (!opts.onOk || opts.onOk() !== false) vider(root); }
      }));
    }
    corps.appendChild(pied);
    var overlay = el(".modal-overlay", { onclick: function (e) { if (e.target === overlay) vider(root); } }, [corps]);
    root.appendChild(overlay);
  }

  function fermerModal() { vider(document.getElementById("modal-root")); }

  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  function dateFr(iso) {
    var d = new Date(iso);
    return d.getDate() + " " + MOIS[d.getMonth()];
  }
  function dateHeureFr(iso) {
    var d = new Date(iso);
    return dateFr(iso) + " · " + String(d.getHours()).padStart(2, "0") + "h" + String(d.getMinutes()).padStart(2, "0");
  }

  window.UI = {
    el: el, vider: vider, enTete: enTete, carte: carte, input: input, champ: champ,
    toast: toast, modal: modal, fermerModal: fermerModal, dateFr: dateFr, dateHeureFr: dateHeureFr
  };
})();
