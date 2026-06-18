/* Jeux de fonctions exécutives : inhibition (Stroop), mémoire de travail
   (séquence) et flexibilité (changement de règle). Sans représentation humaine. */
(function () {
  "use strict";

  var COULEURS = [
    { nom: "ROUGE", hex: "#E2553F" }, { nom: "BLEU", hex: "#5B8DEF" },
    { nom: "VERT", hex: "#5fa040" }, { nom: "JAUNE", hex: "#E0A92B" },
    { nom: "VIOLET", hex: "#8a6bb0" }
  ];

  // ---------- Inhibition : Stroop ----------
  function jeuStroop(zone) {
    UI.vider(zone);
    zone.appendChild(UI.el("p", { html: "<strong>🛑 Inhibition (Stroop)</strong> — Clique sur la <u>COULEUR de l'encre</u>, surtout pas sur le mot écrit !" }));
    var score = 0, essais = 0, max = 12, courant = null;
    var affMot = UI.el("div", { style: "font-size:3rem;font-weight:900;text-align:center;margin:1rem 0;min-height:3.6rem" });
    var boutons = UI.el(".btn-rangee", { style: "justify-content:center" });
    var infos = UI.el("p.aide", { style: "text-align:center" });

    function nouvelle() {
      if (essais >= max) { fin(); return; }
      var mot = COULEURS[Math.floor(Math.random() * COULEURS.length)];
      var encre = COULEURS[Math.floor(Math.random() * COULEURS.length)];
      courant = encre;
      affMot.textContent = mot.nom; affMot.style.color = encre.hex;
      infos.textContent = "Manche " + (essais + 1) + " / " + max + " · Score : " + score;
    }
    function repondre(c) {
      essais++;
      if (c.nom === courant.nom) { score++; UI.toast("✅"); } else { UI.toast("❌ c'était l'encre " + courant.nom); }
      nouvelle();
    }
    function fin() {
      affMot.textContent = "🎉"; affMot.style.color = "#2a9d8f";
      infos.innerHTML = "<strong>Terminé !</strong> Score : " + score + " / " + max;
      UI.vider(boutons);
      boutons.appendChild(UI.el("button.btn", { text: "↺ Rejouer", onclick: function () { jeuStroop(zone); } }));
    }
    COULEURS.forEach(function (c) {
      boutons.appendChild(UI.el("button.btn", { text: c.nom, style: "background:" + c.hex, onclick: function () { repondre(c); } }));
    });
    zone.appendChild(affMot); zone.appendChild(boutons); zone.appendChild(infos);
    nouvelle();
  }

  // ---------- Mémoire de travail : séquence (type Simon) ----------
  function jeuMemoire(zone) {
    UI.vider(zone);
    zone.appendChild(UI.el("p", { html: "<strong>🧠 Mémoire de travail</strong> — Regarde la séquence qui s'allume, puis reproduis-la dans le même ordre." }));
    var pads = COULEURS.slice(0, 4);
    var sequence = [], pos = 0, niveau = 0, actif = false;
    var grille = UI.el("div", { style: "display:grid;grid-template-columns:1fr 1fr;gap:.6rem;max-width:300px;margin:1rem auto" });
    var info = UI.el("p.aide", { style: "text-align:center" });
    var cases = pads.map(function (c, i) {
      var b = UI.el("button", { style: "height:90px;border-radius:14px;border:none;background:" + c.hex + ";opacity:.55;cursor:pointer", "aria-label": c.nom });
      b.addEventListener("click", function () { if (actif) clic(i); });
      grille.appendChild(b); return b;
    });
    function flash(i) {
      return new Promise(function (r) {
        cases[i].style.opacity = "1";
        setTimeout(function () { cases[i].style.opacity = ".55"; setTimeout(r, 180); }, 420);
      });
    }
    function jouerSeq() {
      actif = false; info.textContent = "Regarde bien…";
      var p = Promise.resolve();
      sequence.forEach(function (i) { p = p.then(function () { return flash(i); }); });
      p.then(function () { actif = true; pos = 0; info.textContent = "À toi ! Niveau " + niveau; });
    }
    function suivant() { niveau++; sequence.push(Math.floor(Math.random() * 4)); jouerSeq(); }
    function clic(i) {
      if (i === sequence[pos]) {
        pos++;
        if (pos >= sequence.length) { actif = false; UI.toast("✅ Bravo !"); setTimeout(suivant, 700); }
      } else {
        actif = false; info.innerHTML = "<strong>Oups !</strong> Tu as atteint le niveau " + niveau + ". 👏";
        boutons.firstChild.textContent = "↺ Recommencer";
      }
    }
    var boutons = UI.el(".btn-rangee", { style: "justify-content:center" }, [
      UI.el("button.btn", { text: "▶️ Démarrer", onclick: function () { sequence = []; niveau = 0; suivant(); } })
    ]);
    zone.appendChild(grille); zone.appendChild(info); zone.appendChild(boutons);
  }

  // ---------- Flexibilité : changement de règle ----------
  function jeuFlex(zone) {
    UI.vider(zone);
    var formes = [{ e: "🟦", couleur: "bleu", forme: "carre" }, { e: "🔴", couleur: "rouge", forme: "rond" },
                  { e: "🟨", couleur: "jaune", forme: "carre" }, { e: "🟢", couleur: "vert", forme: "rond" }];
    var regle = "couleur", score = 0, essais = 0, max = 10, courant;
    var consigne = UI.el("p", { style: "text-align:center;font-weight:700" });
    var aff = UI.el("div", { style: "font-size:3rem;text-align:center;margin:.6rem 0" });
    var boutons = UI.el(".btn-rangee", { style: "justify-content:center" });
    var info = UI.el("p.aide", { style: "text-align:center" });
    zone.appendChild(UI.el("p", { html: "<strong>🔄 Flexibilité mentale</strong> — La règle change ! Classe selon ce qui est demandé." }));
    zone.appendChild(consigne); zone.appendChild(aff); zone.appendChild(boutons); zone.appendChild(info);

    function nouvelle() {
      if (essais >= max) {
        aff.textContent = "🎉"; consigne.textContent = "Terminé !"; info.innerHTML = "<strong>Score : " + score + " / " + max + "</strong>";
        UI.vider(boutons); boutons.appendChild(UI.el("button.btn", { text: "↺ Rejouer", onclick: function () { jeuFlex(zone); } })); return;
      }
      regle = Math.random() < 0.45 ? (regle === "couleur" ? "forme" : "couleur") : regle;
      consigne.textContent = "👉 Classe par : " + (regle === "couleur" ? "COULEUR 🎨" : "FORME ⬛");
      courant = formes[Math.floor(Math.random() * formes.length)];
      aff.textContent = courant.e;
      info.textContent = "Manche " + (essais + 1) + " / " + max + " · Score : " + score;
    }
    function repondre(val) {
      essais++;
      var bon = regle === "couleur" ? courant.couleur : courant.forme;
      if (val === bon) { score++; UI.toast("✅"); } else { UI.toast("❌"); }
      nouvelle();
    }
    UI.vider(boutons);
    [["bleu","Bleu"],["rouge","Rouge"],["jaune","Jaune"],["vert","Vert"],["carre","Carré"],["rond","Rond"]].forEach(function (o) {
      boutons.appendChild(UI.el("button.btn.secondaire", { text: o[1], onclick: function () { repondre(o[0]); } }));
    });
    nouvelle();
  }

  Boussole.registerTool({
    id: "jeux-fe", groupe: "tnd", titre: "Jeux des fonctions exécutives", icone: "🎮",
    desc: "Mini-jeux d'inhibition, de mémoire de travail et de flexibilité mentale.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Jeux des fonctions exécutives", "De petits défis pour muscler l'attention, l'inhibition, la mémoire de travail et la flexibilité — en s'amusant."));
      var zone = UI.el(".carte", { style: "min-height:220px" });
      var menu = UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "🛑 Inhibition (Stroop)", onclick: function () { jeuStroop(zone); } }),
        UI.el("button.btn.secondaire", { text: "🧠 Mémoire de travail", onclick: function () { jeuMemoire(zone); } }),
        UI.el("button.btn.secondaire", { text: "🔄 Flexibilité", onclick: function () { jeuFlex(zone); } })
      ]);
      vue.appendChild(menu);
      vue.appendChild(zone);
      zone.appendChild(UI.el("p.aide", { text: "Choisis un jeu ci-dessus pour commencer. 🎯" }));
    }
  });
})();
