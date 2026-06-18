/* Boîte à émotions 6-12 ans — version enfant, douce et ludique.
   Coin spirituel optionnel (ancrage islamique), activable/désactivable. */
(function () {
  "use strict";

  var EMOTIONS = [
    {
      id: "joie", emoji: "😄", nom: "Content·e / Joyeux·se",
      validation: "Youpi, c'est une belle émotion ! Profite de ce bon moment 💛",
      aides: [
        { emoji: "🤲", texte: "Dire merci pour ce moment" },
        { emoji: "🎨", texte: "Dessiner ce qui me rend heureux·se" },
        { emoji: "🫶", texte: "Partager ma joie avec quelqu'un" }
      ],
      spirituel: { translit: "Al-hamdou li-Llâh", sens: "Toute louange à Dieu — pour dire merci quand je suis content·e." }
    },
    {
      id: "triste", emoji: "😢", nom: "Triste",
      validation: "C'est normal d'être triste parfois. Tes larmes ont le droit de couler 💙",
      aides: [
        { emoji: "🫂", texte: "Demander un câlin" },
        { emoji: "🗣️", texte: "En parler à un adulte que j'aime" },
        { emoji: "🎨", texte: "Dessiner ou écrire ma tristesse" },
        { emoji: "🫁", texte: "Respirer doucement", route: "respiration" }
      ],
      spirituel: { translit: "Innâ li-Llâhi… et : « après la difficulté vient la facilité »", sens: "Sourate 94 : Inna ma‘a-l-‘usri yusrâ — un réconfort doux : ça va aller." }
    },
    {
      id: "colere", emoji: "😠", nom: "Fâché·e / En colère",
      validation: "La colère, ça arrive à tout le monde. Elle veut juste te dire quelque chose. On va la calmer ensemble 🔥➡️💧",
      aides: [
        { emoji: "🐢", texte: "Faire la tortue : se mettre tout doux dans sa coquille" },
        { emoji: "💧", texte: "Boire un verre d'eau" },
        { emoji: "👊", texte: "Serrer fort les poings puis relâcher" },
        { emoji: "🫁", texte: "Souffler comme un dragon", route: "respiration" }
      ],
      spirituel: { translit: "A‘ûdhou bi-Llâhi mina-sh-shaytâni-r-rajîm", sens: "Quand la colère monte : on dit cette parole, on s'assoit, et on boit un peu d'eau (conseil du Prophète ﷺ)." }
    },
    {
      id: "peur", emoji: "😨", nom: "Peur",
      validation: "Avoir peur, c'est ta façon de te protéger. Tu n'es pas seul·e, je suis là 💙",
      aides: [
        { emoji: "🔦", texte: "Allumer une lumière / chercher du réconfort" },
        { emoji: "🧸", texte: "Serrer mon doudou ou un objet rassurant" },
        { emoji: "🗣️", texte: "Dire ma peur à un adulte de confiance" },
        { emoji: "🫁", texte: "Respirer comme un ballon", route: "respiration" }
      ],
      spirituel: { translit: "Hasbounâ-Llâhou wa ni‘ma-l-wakîl", sens: "Dieu nous suffit, quel excellent protecteur — une parole qui rassure le cœur." }
    },
    {
      id: "stress", emoji: "😟", nom: "Inquiet·e / Stressé·e",
      validation: "Ton cœur bat un peu vite ? On va le calmer tout doucement 🌿",
      aides: [
        { emoji: "🌬️", texte: "Sentir la fleur, souffler la bougie", route: "respiration" },
        { emoji: "✋", texte: "Toucher 5 choses autour de moi (5-4-3-2-1)", route: "ancrage" },
        { emoji: "📝", texte: "Écrire ce qui m'inquiète" }
      ],
      spirituel: { translit: "Lâ hawla wa lâ qouwwata illâ bi-Llâh", sens: "Il n'y a de force qu'en Dieu — pour relâcher ce qui ne dépend pas de moi." }
    },
    {
      id: "fatigue", emoji: "🥱", nom: "Fatigué·e",
      validation: "Ton corps a besoin de repos, et c'est très bien de l'écouter 😴",
      aides: [
        { emoji: "🛌", texte: "M'allonger et me reposer" },
        { emoji: "💧", texte: "Boire de l'eau" },
        { emoji: "🤫", texte: "Faire une pause au calme" }
      ],
      spirituel: { translit: "Bismi-Llâh", sens: "Au nom de Dieu — une parole douce avant de se reposer." }
    }
  ];

  function coinActif() { return Store.lire("coinSpirituel", false); }

  Boussole.registerTool({
    id: "boite-enfant", groupe: "enfants", titre: "Boîte à émotions (enfant)", icone: "🧸",
    desc: "Pour les 6-12 ans : reconnaître ses émotions et trouver un geste apaisant, en douceur.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Comment va ton cœur aujourd'hui ? 💛", "Choisis le visage qui te ressemble le plus en ce moment."));

      // Ressource complémentaire : la Boîte à bobo émotionnel (universelle)
      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("a.btn.secondaire", { href: "https://boite-a-bobo-emotionnel-6-12-univ.netlify.app/", target: "_blank", rel: "noopener", text: "🩹 Ouvrir la Boîte à bobo émotionnel ↗" })
      ]));

      // Réglage : coin spirituel (pour la praticienne)
      var ligneReglage = UI.el(".carte", { style: "display:flex;align-items:center;gap:.6rem;justify-content:space-between;flex-wrap:wrap" });
      var chk = UI.el("input", { type: "checkbox", checked: coinActif() });
      chk.addEventListener("change", function () { Store.ecrire("coinSpirituel", chk.checked); Boussole.naviguer("boite-enfant"); });
      ligneReglage.appendChild(UI.el("label", { style: "display:flex;align-items:center;gap:.5rem;font-weight:600", "for": "" }, [chk, document.createTextNode("🤲 Afficher le « coin du cœur » (ancrage spirituel)")]));
      ligneReglage.appendChild(UI.el("span.meta", { text: "Réglage praticienne — adaptable" }));
      vue.appendChild(ligneReglage);

      var zone = UI.el("div", { style: "margin-top:1rem" });
      var grille = UI.el(".emo-grille");
      EMOTIONS.forEach(function (e) {
        var b = UI.el("button.emo-btn", { style: "padding:1.2rem .5rem" }, [
          UI.el("span.visage", { text: e.emoji, style: "font-size:3rem" }),
          UI.el("span", { text: e.nom, style: "font-weight:600" })
        ]);
        b.addEventListener("click", function () { montrer(e); });
        grille.appendChild(b);
      });
      vue.appendChild(grille);
      vue.appendChild(zone);

      function montrer(e) {
        UI.vider(zone);
        var carte = UI.el(".carte", { style: "border:2px solid var(--vert);background:var(--vert-clair)" });
        carte.appendChild(UI.el("div", { style: "font-size:3.5rem;text-align:center", text: e.emoji }));
        carte.appendChild(UI.el("p", { style: "font-size:1.2rem;text-align:center;font-weight:600", text: e.validation }));

        carte.appendChild(UI.el("h3", { text: "✨ Ce qui peut t'aider :", style: "margin:.8rem 0 .4rem" }));
        var liste = UI.el(".grille", { style: "grid-template-columns:repeat(auto-fill,minmax(160px,1fr))" });
        e.aides.forEach(function (a) {
          var el = UI.el(a.route ? "a.tuile" : "div.tuile", a.route ? { href: "#/" + a.route } : {}, [
            UI.el("span.tuile-ic", { text: a.emoji }),
            UI.el("p", { text: a.texte, style: "color:var(--ardoise);font-weight:600;margin:0" })
          ]);
          liste.appendChild(el);
        });
        carte.appendChild(liste);

        if (coinActif() && e.spirituel) {
          carte.appendChild(UI.el(".carte", { style: "margin-top:1rem;background:#fff;border-color:#e6d9c2" }, [
            UI.el("h3", { text: "🤲 Le coin du cœur", style: "margin:0 0 .4rem" }),
            UI.el("p", { style: "font-weight:700;font-size:1.1rem;margin:0", text: "« " + e.spirituel.translit + " »" }),
            UI.el("p.meta", { style: "margin:.3rem 0 0", text: e.spirituel.sens })
          ]));
        }

        // Lien vers l'enregistrement émotionnel "grand"
        carte.appendChild(UI.el(".btn-rangee", { style: "margin:1rem 0 0" }, [
          UI.el("button.btn.secondaire", { text: "↩️ Choisir une autre émotion", onclick: function () { UI.vider(zone); window.scrollTo(0, 0); } })
        ]));
        zone.appendChild(carte);
        zone.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
})();
