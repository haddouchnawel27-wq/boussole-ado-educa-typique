/* Thermomètre des émotions — nommer et mesurer l'intensité */
(function () {
  "use strict";

  var EMOTIONS = [
    { nom: "Joie", emoji: "😄" }, { nom: "Tristesse", emoji: "😢" },
    { nom: "Colère", emoji: "😠" }, { nom: "Peur", emoji: "😨" },
    { nom: "Stress", emoji: "😰" }, { nom: "Calme", emoji: "😌" },
    { nom: "Fatigue", emoji: "🥱" }, { nom: "Honte", emoji: "😳" },
    { nom: "Dégoût", emoji: "🤢" }, { nom: "Surprise", emoji: "😲" },
    { nom: "Fierté", emoji: "😎" }, { nom: "Frustration", emoji: "😤" },
    { nom: "Solitude", emoji: "🥺" }, { nom: "Excitation", emoji: "🤩" }
  ];

  Boussole.registerTool({
    id: "emotions", groupe: "tcc", titre: "Thermomètre des émotions", icone: "🌡️",
    desc: "Aider le jeune à nommer ce qu'il ressent et à en mesurer l'intensité (de 0 à 10).",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Thermomètre des émotions", "Mettre des mots sur ce qu'on ressent, c'est déjà commencer à l'apaiser. Choisis une émotion, puis son intensité."));

      var emoChoisie = null, intensite = null;
      var grille = UI.el(".emo-grille");
      EMOTIONS.forEach(function (e) {
        var b = UI.el("button.emo-btn", {}, [UI.el("span.visage", { text: e.emoji }), UI.el("span", { text: e.nom })]);
        b.addEventListener("click", function () {
          emoChoisie = e; grille.querySelectorAll(".emo-btn").forEach(function (x) { x.classList.remove("choisi"); }); b.classList.add("choisi");
        });
        grille.appendChild(b);
      });
      vue.appendChild(UI.el("h2", { text: "1. Qu'est-ce que tu ressens ?", style: "margin:.5rem 0" }));
      vue.appendChild(grille);

      vue.appendChild(UI.el("h2", { text: "2. À quel point ? (0 = un peu, 10 = énormément)", style: "margin:1.4rem 0 .5rem" }));
      var echelle = UI.el(".echelle");
      for (var i = 0; i <= 10; i++) {
        (function (n) {
          var b = UI.el("button", { text: n });
          b.addEventListener("click", function () { intensite = n; echelle.querySelectorAll("button").forEach(function (x) { x.classList.remove("choisi"); }); b.classList.add("choisi"); });
          echelle.appendChild(b);
        })(i);
      }
      vue.appendChild(echelle);

      var note = UI.textarea({ placeholder: "Que s'est-il passé ? (optionnel)" });
      vue.appendChild(UI.champ("3. Pour aller plus loin (optionnel)", note, "Décris la situation, l'endroit du corps où ça se ressent…"));

      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn.grand", { text: "💾 Enregistrer ce ressenti", onclick: function () {
          if (!emoChoisie) { UI.toast("Choisis une émotion"); return; }
          if (intensite === null) { UI.toast("Choisis l'intensité"); return; }
          Store.emotions.ajouter({ profilId: ctx.profil ? ctx.profil.id : null, emotion: emoChoisie.nom, emoji: emoChoisie.emoji, intensite: intensite, note: note.value.trim() });
          UI.toast("Ressenti enregistré 💛");
          Boussole.naviguer("emotions");
        }})
      ]));

      // Derniers ressentis du profil
      var liste = Store.emotions.filtre(function (e) { return !ctx.profil || e.profilId === ctx.profil.id; }).slice().reverse().slice(0, 8);
      if (liste.length) {
        vue.appendChild(UI.el("h2", { text: "Derniers ressentis", style: "margin:1.6rem 0 .5rem" }));
        var ul = UI.el("ul.liste");
        liste.forEach(function (e) {
          ul.appendChild(UI.el("li.liste-item", {}, [
            UI.el("span", { text: e.emoji, style: "font-size:1.6rem" }),
            UI.el("div.grow", {}, [UI.el("strong", { text: e.emotion + " — " + e.intensite + "/10" }), UI.el("div.meta", { text: (e.note ? e.note + " — " : "") + UI.dateHeureFr(e.cree) })]),
            UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Supprimer", onclick: function () { Store.emotions.supprimer(e.id); Boussole.naviguer("emotions"); } })
          ]));
        });
        vue.appendChild(ul);
      }
    }
  });
})();
