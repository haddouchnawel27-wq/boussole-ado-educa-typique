/* Carte mentale — organiser ses idées visuellement autour d'un sujet central.
   Réutilisable : comprendre un texte (dyslexie), planifier sans écrire de
   longues phrases (dyspraxie), structurer une révision (métacognition).
   100 % local (localStorage), aucune dépendance. */
(function () {
  "use strict";

  var CLE = "cartes_mentales";
  var compteur = 0;
  function uid() { return "cm" + Date.now().toString(36) + (compteur++).toString(36); }
  function charger() { return Store.lire(CLE, []); }
  function sauver(v) { Store.ecrire(CLE, v); }
  function carteParId(id) { return charger().filter(function (c) { return c.id === id; })[0]; }
  function maj(carte) { sauver(charger().map(function (c) { return c.id === carte.id ? carte : c; })); }

  var COULEURS = ["#4a7fa5", "#3a7d6e", "#e26d5c", "#8a6bb0", "#e8a33d", "#0e9aa7"];

  var MODELES = [
    { titre: "Comprendre un texte", branches: [["Personnages", []], ["Lieux", []], ["Ce qui se passe", []], ["Ce que je retiens", []]] },
    { titre: "Préparer un exposé", branches: [["Introduction", []], ["Idée 1", []], ["Idée 2", []], ["Conclusion", []]] },
    { titre: "Réviser une leçon", branches: [["À savoir par cœur", []], ["À comprendre", []], ["Exemples", []], ["Mes questions", []]] }
  ];

  var etat = { mode: "liste", carteId: null };
  function go(vue, m, id) { etat.mode = m; etat.carteId = id || null; rendre(vue); }

  /* ---------------- Liste ---------------- */
  function vueListe(vue) {
    vue.appendChild(UI.enTete("Cartes mentales", "Pose tes idées autour d'un sujet, sans rédiger : un mot par bulle. Pratique pour comprendre, planifier ou réviser."));
    vue.appendChild(UI.el(".btn-rangee", {}, [
      UI.el("button.btn", { text: "➕ Nouvelle carte", onclick: function () {
        creerCarte(null, function (c) { var v = charger(); v.push(c); sauver(v); go(vue, "editer", c.id); });
      }})
    ]));

    var cartes = charger();
    if (!cartes.length) {
      vue.appendChild(UI.vide("🧠", "Aucune carte", "Crée la tienne, ou pars d'un modèle."));
      vue.appendChild(UI.el("h2", { text: "Modèles", style: "margin:1.4rem 0 .6rem" }));
      var g = UI.el(".grille");
      MODELES.forEach(function (m) {
        g.appendChild(UI.el(".tuile", { onclick: function () {
          var c = { id: uid(), titre: m.titre, branches: m.branches.map(function (b, i) { return { id: uid(), texte: b[0], couleur: COULEURS[i % COULEURS.length], idees: [] }; }) };
          var v = charger(); v.push(c); sauver(v); UI.toast("Modèle ajouté"); go(vue, "editer", c.id);
        }}, [
          UI.el("span.tuile-ic", { text: "🧠" }),
          UI.el("h3", { text: m.titre }),
          UI.el("p", { text: m.branches.length + " branches" })
        ]));
      });
      vue.appendChild(g);
      return;
    }

    var grille = UI.el(".grille");
    cartes.forEach(function (c) {
      grille.appendChild(UI.el(".carte", {}, [
        UI.el("h3", { text: c.titre, style: "margin:.1rem 0" }),
        UI.el("p.meta", { text: c.branches.length + " branche" + (c.branches.length > 1 ? "s" : "") }),
        UI.el(".btn-rangee", { style: "margin:.6rem 0 0" }, [
          UI.el("button.btn", { text: "Ouvrir", onclick: function () { go(vue, "editer", c.id); } }),
          UI.el("button.btn.ghost", { text: "Supprimer", onclick: function () {
            UI.confirmer("Supprimer la carte « " + c.titre + " » ?", { danger: true }).then(function (ok) {
              if (!ok) return; sauver(charger().filter(function (x) { return x.id !== c.id; })); go(vue, "liste");
            });
          }})
        ])
      ]));
    });
    vue.appendChild(grille);
  }

  function creerCarte(carte, onOk) {
    var t = UI.input({ value: carte ? carte.titre : "", placeholder: "ex. Le système solaire" });
    UI.modal({
      titre: carte ? "Renommer la carte" : "Nouvelle carte mentale",
      contenu: UI.champ("Sujet central", t),
      texteOk: "Valider",
      onOk: function () { var n = t.value.trim(); if (!n) return null; if (carte) { carte.titre = n; maj(carte); return carte; } return { id: uid(), titre: n, branches: [] }; }
    }).then(function (r) { if (r && onOk) onOk(r); });
  }

  /* ---------------- Éditeur ---------------- */
  function vueEditer(vue) {
    var c = carteParId(etat.carteId);
    if (!c) return go(vue, "liste");

    vue.appendChild(UI.el("button.btn.ghost", { text: "← Toutes les cartes", style: "margin-bottom:.8rem", onclick: function () { go(vue, "liste"); } }));
    vue.appendChild(UI.el(".btn-rangee", {}, [
      UI.el("button.btn.secondaire", { text: "Renommer le sujet", onclick: function () { creerCarte(c, function () { go(vue, "editer", c.id); }); } }),
      UI.el("button.btn.secondaire", { text: "Imprimer", onclick: function () { imprimer(c); } }),
      UI.el("button.btn", { text: "➕ Ajouter une branche", onclick: function () {
        c.branches.push({ id: uid(), texte: "Nouvelle idée", couleur: COULEURS[c.branches.length % COULEURS.length], idees: [] });
        maj(c); go(vue, "editer", c.id);
      }})
    ]));

    // Sujet central
    vue.appendChild(UI.el("div", { style: "text-align:center;margin:1.2rem 0" }, [
      UI.el("div", { text: c.titre, style: "display:inline-block;background:var(--vert);color:#fff;font-size:1.4rem;font-weight:700;padding:.8rem 1.6rem;border-radius:999px;box-shadow:var(--ombre)" })
    ]));
    if (c.branches.length) vue.appendChild(UI.el("div", { style: "width:2px;height:18px;background:var(--gris-clair);margin:0 auto" }));

    if (!c.branches.length) { vue.appendChild(UI.el("p.aide", { text: "Ajoute une première branche : un grand thème, en un ou deux mots." })); return; }

    var grille = UI.el("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin-top:.4rem" });
    c.branches.forEach(function (b) {
      var carteB = UI.el("div", { style: "border:2px solid " + b.couleur + ";border-radius:14px;overflow:hidden;background:#fff" });

      // En-tête de branche (titre éditable + couleur + suppression)
      var titreInput = UI.el("input", { value: b.texte, "aria-label": "Nom de la branche", style: "flex:1;border:0;background:transparent;color:#fff;font-weight:700;font-size:1.05rem;outline:none" });
      titreInput.addEventListener("change", function () { b.texte = titreInput.value.trim() || b.texte; maj(c); });
      var tete = UI.el("div", { style: "display:flex;align-items:center;gap:.4rem;background:" + b.couleur + ";padding:.5rem .7rem" }, [
        titreInput,
        UI.el("button", { text: "✕", title: "Supprimer la branche", "aria-label": "Supprimer la branche", style: "border:0;background:rgba(255,255,255,.25);color:#fff;border-radius:6px;cursor:pointer;width:24px;height:24px",
          onclick: function () { c.branches = c.branches.filter(function (x) { return x.id !== b.id; }); maj(c); go(vue, "editer", c.id); } })
      ]);
      carteB.appendChild(tete);

      // Idées
      var corps = UI.el("div", { style: "padding:.6rem .7rem" });
      b.idees.forEach(function (idee) {
        corps.appendChild(UI.el("div", { style: "display:flex;align-items:center;gap:.4rem;margin:.25rem 0" }, [
          UI.el("span", { text: "•", style: "color:" + b.couleur + ";font-weight:700" }),
          UI.el("span.grow", { text: idee.texte }),
          UI.el("button", { text: "✕", "aria-label": "Retirer", style: "border:0;background:transparent;color:var(--gris);cursor:pointer",
            onclick: function () { b.idees = b.idees.filter(function (x) { return x.id !== idee.id; }); maj(c); go(vue, "editer", c.id); } })
        ]));
      });
      var ajout = UI.el("input", { placeholder: "+ une idée…", style: "width:100%;margin-top:.3rem;padding:.35rem .5rem;border:1px dashed " + b.couleur + ";border-radius:8px" });
      ajout.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && ajout.value.trim()) { b.idees.push({ id: uid(), texte: ajout.value.trim() }); maj(c); go(vue, "editer", c.id); }
      });
      corps.appendChild(ajout);
      carteB.appendChild(corps);
      grille.appendChild(carteB);
    });
    vue.appendChild(grille);
    vue.appendChild(UI.el("p.aide", { text: "Astuce : tape ton idée puis appuie sur Entrée pour l'ajouter à la branche.", style: "margin-top:.8rem" }));
  }

  /* ---------------- Impression ---------------- */
  function imprimer(c) {
    var w = window.open("", "_blank");
    if (!w) { UI.toast("Autorise les fenêtres pop-up pour imprimer."); return; }
    var html = '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>' + c.titre + '</title><style>' +
      'body{font-family:Arial,sans-serif;margin:1.4cm;color:#222}h1{text-align:center;background:#3a7d6e;color:#fff;display:inline-block;padding:.5rem 1.2rem;border-radius:999px}' +
      '.wrap{text-align:center}.g{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:18px}' +
      '.b{border:2px solid #999;border-radius:12px;min-width:200px;text-align:left}.bt{color:#fff;font-weight:700;padding:6px 10px}.bc{padding:6px 10px}ul{margin:.3rem 0;padding-left:1.1rem}' +
      '</style></head><body><div class="wrap"><h1>' + esc(c.titre) + '</h1><div class="g">';
    c.branches.forEach(function (b) {
      html += '<div class="b"><div class="bt" style="background:' + b.couleur + '">' + esc(b.texte) + '</div><div class="bc"><ul>';
      b.idees.forEach(function (i) { html += '<li>' + esc(i.texte) + '</li>'; });
      if (!b.idees.length) html += '<li style="list-style:none;color:#aaa">…</li>';
      html += '</ul></div></div>';
    });
    html += '</div></div></body></html>';
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(function () { w.print(); }, 250);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]; }); }

  function rendre(vue) {
    UI.vider(vue);
    if (etat.mode === "editer") return vueEditer(vue);
    return vueListe(vue);
  }

  Boussole.registerTool({
    id: "carte-mentale", groupe: "tnd", titre: "Carte mentale", icone: "🗺️",
    desc: "Organise tes idées autour d'un sujet, en un mot par bulle. Pour comprendre, planifier ou réviser.",
    render: function (vue, ctx) {
      if (!ctx.arg) etat = { mode: "liste", carteId: null };
      rendre(vue);
    }
  });
})();
