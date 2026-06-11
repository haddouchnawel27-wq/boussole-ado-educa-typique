/* Séquenceur de tâches — découper une activité en étapes avec pictogrammes */
(function () {
  "use strict";

  var PICTOS = ["🪥","🚿","👕","🍽️","🎒","📚","✏️","🧹","🛏️","🧦","👟","🧼","🚽","🍎","💧","🐕","🗑️","📱","💻","🎮","⚽","🎨","🎵","😴","🧘","🚲","🛒","🧴","🪒","🦷"];

  function editerSequence(seq, onValide) {
    var nom = UI.input({ value: seq ? seq.nom : "", placeholder: "ex. Routine du matin" });
    var etapes = (seq && seq.etapes ? seq.etapes.slice() : []).map(function (e) { return Object.assign({}, e); });

    var listeEl = UI.el(".liste", { style: "margin:.5rem 0" });
    function redessiner() {
      UI.vider(listeEl);
      etapes.forEach(function (et, i) {
        listeEl.appendChild(UI.el(".liste-item", {}, [
          UI.el("span", { text: et.picto, style: "font-size:1.6rem" }),
          UI.el("span.grow", { text: et.texte }),
          UI.el("button.btn.ghost", { text: "▲", "aria-label": "Monter", disabled: i === 0, onclick: function () {
            var t = etapes[i - 1]; etapes[i - 1] = etapes[i]; etapes[i] = t; redessiner();
          }}),
          UI.el("button.btn.ghost", { text: "✕", "aria-label": "Retirer", onclick: function () { etapes.splice(i, 1); redessiner(); } })
        ]));
      });
      if (!etapes.length) listeEl.appendChild(UI.el("p.aide", { text: "Ajoutez des étapes ci-dessous." }));
    }
    redessiner();

    var picChoisi = PICTOS[0];
    var grillePic = UI.el(".emo-grille", { style: "grid-template-columns:repeat(auto-fill,minmax(48px,1fr));gap:.3rem" });
    PICTOS.forEach(function (p) {
      var b = UI.el("button.emo-btn", { style: "padding:.4rem", text: p, onclick: function () {
        picChoisi = p; grillePic.querySelectorAll(".emo-btn").forEach(function (x) { x.classList.remove("choisi"); }); b.classList.add("choisi");
      }});
      if (p === picChoisi) b.classList.add("choisi");
      grillePic.appendChild(b);
    });
    var texteEtape = UI.input({ placeholder: "Décrire l'étape (ex. Se brosser les dents)" });
    function ajouter() {
      if (!texteEtape.value.trim()) return;
      etapes.push({ picto: picChoisi, texte: texteEtape.value.trim() });
      texteEtape.value = ""; redessiner();
    }
    texteEtape.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); ajouter(); } });

    var contenu = UI.el("div", {}, [
      UI.champ("Nom de la séquence", nom),
      UI.el("label", { text: "Étapes", style: "font-weight:600;display:block;margin-bottom:.3rem" }),
      listeEl,
      UI.el("hr", { style: "border:0;border-top:1px solid #eee;margin:1rem 0" }),
      UI.el("label", { text: "Pictogramme", style: "font-weight:600;display:block;margin-bottom:.3rem" }),
      grillePic,
      UI.el(".btn-rangee", { style: "margin-bottom:0" }, [texteEtape, UI.el("button.btn.secondaire", { text: "+ Ajouter l'étape", onclick: ajouter })])
    ]);

    UI.modal({
      titre: seq ? "Modifier la séquence" : "Nouvelle séquence", contenu: contenu, texteOk: "Enregistrer",
      onOk: function () {
        if (!nom.value.trim()) { UI.toast("Donnez un nom"); return false; }
        if (!etapes.length) { UI.toast("Ajoutez au moins une étape"); return false; }
        onValide({ nom: nom.value.trim(), etapes: etapes });
        return true;
      }
    });
  }

  function jouer(vue, seq, ctx) {
    UI.vider(vue);
    vue.appendChild(UI.el("a.retour", { href: "#/sequenceur", text: "← Toutes les séquences" }));
    vue.appendChild(UI.enTete(seq.nom, "Coche chaque étape une fois faite. Bravo à chaque pas ! 🎉"));

    var faites = {};
    var barre = UI.el("div", { style: "height:14px;background:#e5e7eb;border-radius:99px;overflow:hidden;margin:1rem 0" }, [
      UI.el("div", { style: "height:100%;width:0;background:#3a7d6e;transition:width .3s", id: "progress" })
    ]);
    vue.appendChild(barre);

    var liste = UI.el(".liste", { style: "gap:.7rem" });
    function majProgress() {
      var n = Object.keys(faites).filter(function (k) { return faites[k]; }).length;
      vue.querySelector("#progress").style.width = (n / seq.etapes.length * 100) + "%";
      if (n === seq.etapes.length) UI.toast("🎉 Séquence terminée, bravo !");
    }
    seq.etapes.forEach(function (et, i) {
      var item = UI.el(".etape", {}, [
        UI.el("span.etape-num", { text: i + 1 }),
        UI.el("span.etape-pic", { text: et.picto }),
        UI.el("span.etape-txt", { text: et.texte }),
        UI.el("span", { text: "⬜", style: "font-size:1.6rem", "aria-hidden": "true" })
      ]);
      item.addEventListener("click", function () {
        faites[i] = !faites[i];
        item.classList.toggle("faite", faites[i]);
        item.lastChild.textContent = faites[i] ? "✅" : "⬜";
        majProgress();
      });
      liste.appendChild(item);
    });
    vue.appendChild(liste);
  }

  Boussole.registerTool({
    id: "sequenceur", groupe: "tnd", titre: "Séquenceur de tâches", icone: "🪜",
    desc: "Découpez une activité en étapes illustrées. Le jeune avance pas à pas et coche.",
    render: function (vue, ctx) {
      if (ctx.arg) {
        var s = Store.sequences.parId(ctx.arg);
        if (s) return jouer(vue, s, ctx);
      }
      vue.appendChild(UI.enTete("Séquenceur de tâches", "Transformez une routine en suite d'étapes claires et illustrées. Réduit la charge mentale et l'oubli."));
      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "➕ Nouvelle séquence", onclick: function () {
          editerSequence(null, function (d) { Store.sequences.ajouter(d); Boussole.naviguer("sequenceur"); });
        }})
      ]));

      var seqs = Store.sequences.tout();
      if (!seqs.length) {
        // Proposer des modèles
        vue.appendChild(UI.vide("🪜", "Aucune séquence", "Créez-en une, ou partez d'un modèle ci-dessous."));
        var modeles = [
          { nom: "Routine du matin", etapes: [["⏰","Se réveiller"],["🚽","Aller aux toilettes"],["👕","S'habiller"],["🍽️","Prendre le petit-déjeuner"],["🪥","Se brosser les dents"],["🎒","Préparer le sac"]] },
          { nom: "Routine du soir", etapes: [["🍽️","Dîner"],["🚿","Prendre une douche"],["👕","Mettre le pyjama"],["🪥","Se brosser les dents"],["📚","Lire un peu"],["😴","Dormir"]] },
          { nom: "Faire ses devoirs", etapes: [["📱","Ranger le téléphone"],["📚","Sortir le matériel"],["✏️","Faire un exercice"],["💧","Boire / pause"],["✅","Vérifier"],["🎒","Ranger le sac"]] }
        ];
        var grille = UI.el(".grille");
        modeles.forEach(function (m) {
          grille.appendChild(UI.el(".tuile", { onclick: function () {
            Store.sequences.ajouter({ nom: m.nom, etapes: m.etapes.map(function (e) { return { picto: e[0], texte: e[1] }; }) });
            UI.toast("Modèle ajouté"); Boussole.naviguer("sequenceur");
          }}, [
            UI.el("span.tuile-ic", { text: m.etapes[0][0] }),
            UI.el("h3", { text: m.nom }),
            UI.el("p", { text: m.etapes.length + " étapes — cliquer pour ajouter" })
          ]));
        });
        vue.appendChild(grille);
        return;
      }

      var liste = UI.el("ul.liste");
      seqs.forEach(function (s) {
        liste.appendChild(UI.el("li.liste-item", {}, [
          UI.el("span", { text: s.etapes[0] ? s.etapes[0].picto : "🪜", style: "font-size:1.6rem" }),
          UI.el("div.grow", {}, [UI.el("strong", { text: s.nom }), UI.el("div.meta", { text: s.etapes.length + " étapes" })]),
          UI.el("a.btn", { href: "#/sequenceur/" + s.id, text: "▶️ Lancer" }),
          UI.el("button.btn.ghost", { text: "✏️", "aria-label": "Modifier", onclick: function () {
            editerSequence(s, function (d) { Store.sequences.majParId(s.id, d); Boussole.naviguer("sequenceur"); });
          }}),
          UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () {
            UI.confirmer("Supprimer « " + s.nom + " » ?", { danger: true, texteOk: "Supprimer" }).then(function (ok) { if (ok) { Store.sequences.supprimer(s.id); Boussole.naviguer("sequenceur"); } });
          }})
        ]));
      });
      vue.appendChild(liste);
    }
  });
})();
