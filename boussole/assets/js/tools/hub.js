/* Mes applications — hub central vers les outils externes de la praticienne.
   Pré-rempli avec les applications existantes, entièrement modifiable. */
(function () {
  "use strict";

  // Liens fournis par défaut (modifiables/supprimables par l'utilisatrice).
  var PAR_DEFAUT = [
    { id: "def-secours", emoji: "🆘", titre: "Secours émotionnel ados", desc: "Premiers secours émotionnels pour adolescents", url: "https://secours-emotionnel-ados.netlify.app/" },
    { id: "def-emo612", emoji: "🧰", titre: "Boîte à outils émotions 6-12 ans", desc: "Gestion des émotions (approche islamique)", url: "https://boite-outil-emotions-6-12ans-isl.netlify.app/" },
    { id: "def-bobo", emoji: "🩹", titre: "Boîte à bobo émotionnel 6-12 ans", desc: "Apaiser les petits chagrins et émotions", url: "https://boite-a-bobo-emotionnel-6-12-univ.netlify.app/" },
    { id: "def-cognitif", emoji: "🧠", titre: "Mon profil cognitif", desc: "Construire le profil cognitif", url: "https://mon-profil-cognitif.netlify.app/" },
    { id: "def-neuroado", emoji: "🧩", titre: "Profil neuro ado", desc: "Profil neurodéveloppemental de l'adolescent", url: "https://profil-neuro-ado.netlify.app/" }
  ];

  // Liens par défaut retirés de l'application :
  //  - soit déjà couverts par un outil natif de Boussole (on évite les doublons) ;
  //  - soit des applications à part, distinctes de Boussole (ex. la Boîte neuro-pédagogique).
  // Ils sont aussi nettoyés des données déjà enregistrées sur l'appareil (migration douce).
  var RETIRES = ["def-emo612", "def-bobo", "def-cognitif", "def-neuroado", "def-neuroped"];

  function liens() {
    var perso = Store.lire("liens", null);
    if (perso === null) {
      var def = PAR_DEFAUT.filter(function (l) { return RETIRES.indexOf(l.id) < 0; });
      Store.ecrire("liens", def);
      return def;
    }
    // Migration douce : retire les anciens liens en double, sans toucher aux liens ajoutés par l'utilisatrice.
    var filtre = perso.filter(function (l) { return RETIRES.indexOf(l.id) < 0; });
    if (filtre.length !== perso.length) Store.ecrire("liens", filtre);
    return filtre;
  }
  function sauver(arr) { Store.ecrire("liens", arr); }

  function editer(lien, onValide) {
    var titre = UI.input({ value: lien ? lien.titre : "", placeholder: "Nom de l'outil" });
    var url = UI.input({ value: lien ? lien.url : "", placeholder: "https://…" });
    var desc = UI.input({ value: lien ? lien.desc : "", placeholder: "À quoi sert cet outil ?" });
    var emoji = UI.input({ value: lien ? lien.emoji : "🔗", placeholder: "🔗", style: "max-width:90px" });
    UI.modal({
      titre: lien ? "Modifier le lien" : "Ajouter une application",
      contenu: UI.el("div", {}, [
        UI.champ("Nom", titre), UI.champ("Adresse (URL)", url),
        UI.champ("Description", desc), UI.champ("Icône (emoji)", emoji)
      ]),
      texteOk: "Enregistrer",
      onOk: function () {
        if (!titre.value.trim() || !url.value.trim()) { UI.toast("Nom et adresse requis"); return false; }
        var u = url.value.trim();
        if (!/^https?:\/\//i.test(u)) u = "https://" + u;
        onValide({ titre: titre.value.trim(), url: u, desc: desc.value.trim(), emoji: emoji.value.trim() || "🔗" });
        return true;
      }
    });
  }

  Boussole.registerTool({
    id: "hub", groupe: "ressources", titre: "Mes applications", icone: "🔗",
    desc: "Tous vos outils réunis : accédez en un clic à vos applications d'accompagnement.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Mes applications", "Votre coach de poche : retrouvez ici tous vos outils d'accompagnement au même endroit. Les liens s'ouvrent dans un nouvel onglet. Vous pouvez en ajouter, modifier ou retirer."));

      vue.appendChild(UI.el(".btn-rangee", {}, [
        UI.el("button.btn", { text: "➕ Ajouter une application", onclick: function () {
          editer(null, function (d) { var arr = liens(); d.id = Store.id(); arr.push(d); sauver(arr); Boussole.naviguer("hub"); });
        }})
      ]));

      var arr = liens();
      if (!arr.length) {
        vue.appendChild(UI.vide("🔗", "Aucune application", "Ajoutez vos outils pour les retrouver ici."));
        return;
      }

      var grille = UI.el(".grille");
      arr.forEach(function (l) {
        var tuile = UI.el(".tuile", {}, [
          UI.el("span.tuile-ic", { text: l.emoji || "🔗", "aria-hidden": "true" }),
          UI.el("h3", { text: l.titre }),
          UI.el("p", { text: l.desc || "" }),
          UI.el(".btn-rangee", { style: "margin:.4rem 0 0" }, [
            UI.el("a.btn.secondaire", { href: l.url, target: "_blank", rel: "noopener", text: "Ouvrir ↗", onclick: function (e) { e.stopPropagation(); } }),
            UI.el("button.btn.ghost", { text: "✏️", "aria-label": "Modifier", onclick: function (e) {
              e.stopPropagation();
              editer(l, function (d) { Object.assign(l, d); sauver(arr); Boussole.naviguer("hub"); });
            }}),
            UI.el("button.btn.ghost", { text: "🗑️", "aria-label": "Retirer", onclick: function (e) {
              e.stopPropagation();
              UI.confirmer("Retirer « " + l.titre + " » de la liste ?", { danger: true, texteOk: "Retirer" }).then(function (ok) {
                if (ok) { sauver(arr.filter(function (x) { return x !== l; })); Boussole.naviguer("hub"); }
              });
            }})
          ])
        ]);
        tuile.addEventListener("click", function () { window.open(l.url, "_blank", "noopener"); });
        grille.appendChild(tuile);
      });
      vue.appendChild(grille);

      vue.appendChild(UI.el("p.aide", { style: "margin-top:1.2rem", text: "Astuce : ces applications restent hébergées de leur côté. Plus tard, je peux aussi recréer certains de ces outils directement dans Boussole pour un usage hors-ligne et un suivi centralisé." }));
    }
  });
})();
