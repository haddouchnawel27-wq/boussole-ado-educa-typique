/* Boîte à outils dys : confort de lecture (police, taille, espacement,
   couleur de fond apaisante, règle de lecture qui suit le curseur). */
(function () {
  "use strict";

  var TEINTES = [
    { nom: "Aucune", bg: "#ffffff" },
    { nom: "Crème", bg: "#fbf3df" },
    { nom: "Pêche", bg: "#fde8d9" },
    { nom: "Bleu", bg: "#dcecf7" },
    { nom: "Vert", bg: "#dff0e4" },
    { nom: "Rose", bg: "#fbe4ee" },
    { nom: "Gris", bg: "#e9e9ee" }
  ];

  var EXEMPLE = "Colle ici un texte (leçon, énoncé, consigne…) puis ajuste l'affichage pour le rendre plus confortable à lire. Tu peux activer la règle de lecture pour suivre ligne par ligne.";

  Boussole.registerTool({
    id: "dys", groupe: "tnd", titre: "Boîte à outils dys", icone: "🔤",
    desc: "Confort de lecture : police adaptée, espacement, couleur de fond et règle de lecture.",
    render: function (vue) {
      vue.appendChild(UI.enTete("Boîte à outils dys", "Collez un texte, puis adaptez son affichage pour faciliter la lecture (dyslexie, fatigue visuelle)."));

      var etat = { police: false, taille: 20, interligne: 1.8, lettres: 0.04, mots: 0.16, teinte: "#fbf3df", regle: false };

      var saisie = UI.textarea({ value: EXEMPLE, placeholder: "Collez votre texte ici…", style: "min-height:90px" });
      var zone = UI.el("div", { tabindex: "0", style: "position:relative;padding:1.2rem;border-radius:12px;border:1px solid var(--gris-clair);white-space:pre-wrap;overflow:hidden" });
      var regle = UI.el("div", { style: "position:absolute;left:0;right:0;height:2.2em;background:rgba(58,125,110,.18);border-top:2px solid #3a7d6e;border-bottom:2px solid #3a7d6e;pointer-events:none;display:none" });

      function appliquer() {
        zone.textContent = saisie.value || "";
        zone.appendChild(regle);
        zone.style.background = etat.teinte;
        zone.style.fontFamily = etat.police ? '"Comic Sans MS","Trebuchet MS",Verdana,sans-serif' : "inherit";
        zone.style.fontSize = etat.taille + "px";
        zone.style.lineHeight = etat.interligne;
        zone.style.letterSpacing = etat.lettres + "em";
        zone.style.wordSpacing = etat.mots + "em";
        regle.style.display = etat.regle ? "block" : "none";
        regle.style.height = (etat.interligne * 1.1) + "em";
      }
      saisie.addEventListener("input", appliquer);

      zone.addEventListener("mousemove", function (e) {
        if (!etat.regle) return;
        var r = zone.getBoundingClientRect();
        regle.style.top = (e.clientY - r.top - regle.offsetHeight / 2) + "px";
      });
      zone.addEventListener("touchmove", function (e) {
        if (!etat.regle || !e.touches[0]) return;
        var r = zone.getBoundingClientRect();
        regle.style.top = (e.touches[0].clientY - r.top - regle.offsetHeight / 2) + "px";
      }, { passive: true });

      // Contrôles
      function curseur(label, min, max, pas, val, onCh) {
        var input = UI.el("input", { type: "range", min: min, max: max, step: pas, value: val, style: "width:100%" });
        input.addEventListener("input", function () { onCh(parseFloat(input.value)); appliquer(); });
        return UI.el(".champ", { style: "margin-bottom:.6rem" }, [UI.el("label", { text: label }), input]);
      }

      var chkPolice = UI.el("input", { type: "checkbox" });
      chkPolice.addEventListener("change", function () { etat.police = chkPolice.checked; appliquer(); });
      var chkRegle = UI.el("input", { type: "checkbox" });
      chkRegle.addEventListener("change", function () { etat.regle = chkRegle.checked; appliquer(); });

      var teintes = UI.el(".btn-rangee");
      TEINTES.forEach(function (t) {
        var b = UI.el("button", { title: t.nom, "aria-label": "Fond " + t.nom, style: "width:38px;height:38px;border-radius:50%;border:2px solid " + (etat.teinte === t.bg ? "#3a7d6e" : "#ccc") + ";background:" + t.bg + ";cursor:pointer" });
        b.addEventListener("click", function () { etat.teinte = t.bg; teintes.querySelectorAll("button").forEach(function (x) { x.style.borderColor = "#ccc"; }); b.style.borderColor = "#3a7d6e"; appliquer(); });
        teintes.appendChild(b);
      });

      var controles = UI.el(".carte", {}, [
        UI.el("label", { style: "display:flex;gap:.5rem;align-items:center;font-weight:600;margin-bottom:.6rem" }, [chkPolice, document.createTextNode("Police adaptée « dys »")]),
        UI.el("label", { style: "display:flex;gap:.5rem;align-items:center;font-weight:600;margin-bottom:.8rem" }, [chkRegle, document.createTextNode("Règle de lecture (suit le curseur)")]),
        curseur("Taille du texte", 14, 40, 1, etat.taille, function (v) { etat.taille = v; }),
        curseur("Interligne", 1.2, 3, 0.1, etat.interligne, function (v) { etat.interligne = v; }),
        curseur("Espacement des lettres", 0, 0.3, 0.01, etat.lettres, function (v) { etat.lettres = v; }),
        curseur("Espacement des mots", 0, 0.6, 0.02, etat.mots, function (v) { etat.mots = v; }),
        UI.el("label", { text: "Couleur de fond", style: "font-weight:600;display:block;margin:.3rem 0" }),
        teintes
      ]);

      vue.appendChild(UI.champ("Votre texte", saisie));
      vue.appendChild(controles);
      vue.appendChild(UI.el("h2", { text: "Aperçu", style: "margin:1.2rem 0 .5rem" }));
      vue.appendChild(zone);
      appliquer();
    }
  });
})();
