/* Plan de sécurité personnalisé — secourisme en santé mentale */
(function () {
  "use strict";

  var CHAMPS = [
    { cle: "signaux", label: "1. Mes signaux d'alerte", aide: "Pensées, émotions, sensations qui montrent que ça ne va pas (ex. je m'isole, je ne dors plus).", multi: true },
    { cle: "strategies", label: "2. Ce que je peux faire seul·e pour aller mieux", aide: "Activités d'apaisement (musique, marcher, respiration, dessiner…).", multi: true },
    { cle: "personnes", label: "3. Personnes qui me font du bien", aide: "À qui je peux parler ou que je peux rejoindre (nom + contact).", multi: true },
    { cle: "adultes", label: "4. Adultes de confiance à contacter", aide: "Parent, proche, professionnel… avec leur numéro.", multi: true },
    { cle: "raisons", label: "5. Mes raisons de tenir bon", aide: "Ce qui compte pour moi, ce qui me donne de l'espoir.", multi: true },
    { cle: "securiser", label: "6. Rendre mon environnement plus sûr", aide: "Ce que je peux mettre à distance dans les moments difficiles.", multi: true }
  ];

  var URGENCES = [
    { nom: "3114 — Numéro national de prévention du suicide", detail: "Gratuit, 24h/24, 7j/7 (France)", tel: "3114" },
    { nom: "Fil Santé Jeunes", detail: "0 800 235 236 — gratuit, anonyme (12-25 ans)", tel: "0800235236" },
    { nom: "SAMU", detail: "15 — urgence médicale", tel: "15" },
    { nom: "Urgences européennes", detail: "112", tel: "112" }
  ];

  function clef(ctx) { return ctx.profil ? ctx.profil.id : "_general"; }

  Boussole.registerTool({
    id: "securite", groupe: "secours", titre: "Plan de sécurité", icone: "🆘",
    desc: "Construire avec le jeune un plan personnalisé : signaux d'alerte, ressources, contacts d'urgence.",
    render: function (vue, ctx) {
      vue.appendChild(UI.enTete("Plan de sécurité", "À co-construire avec le jeune dans un moment calme, pour savoir quoi faire quand ça va mal. À imprimer et garder sur soi."));

      vue.appendChild(UI.el(".alerte.urgence", {}, [
        UI.el("strong", { text: "⚠️ En cas de danger immédiat : " }),
        document.createTextNode("ce plan ne remplace pas les secours. Contactez le 3114, le 15 ou le 112.")
      ]));

      var pid = clef(ctx);
      var plan = Store.plansSecurite.filtre(function (p) { return p.profilId === pid; })[0];
      if (!plan) plan = Store.plansSecurite.ajouter({ profilId: pid, valeurs: {} });

      CHAMPS.forEach(function (c) {
        var ta = UI.textarea({ value: plan.valeurs[c.cle] || "", placeholder: "Une idée par ligne…" });
        ta.addEventListener("change", function () { plan.valeurs[c.cle] = ta.value; Store.plansSecurite.majParId(plan.id, { valeurs: plan.valeurs }); UI.toast("Enregistré"); });
        vue.appendChild(UI.champ(c.label, ta, c.aide));
      });

      vue.appendChild(UI.el("h2", { text: "Numéros d'urgence (France)", style: "margin:1.4rem 0 .5rem" }));
      var ul = UI.el("ul.liste");
      URGENCES.forEach(function (u) {
        ul.appendChild(UI.el("li.liste-item", {}, [
          UI.el("span", { text: "📞", style: "font-size:1.4rem" }),
          UI.el("div.grow", {}, [UI.el("strong", { text: u.nom }), UI.el("div.meta", { text: u.detail })]),
          UI.el("a.btn.secondaire", { href: "tel:" + u.tel, text: "Appeler" })
        ]));
      });
      vue.appendChild(ul);

      vue.appendChild(UI.el(".btn-rangee", { style: "margin-top:1.2rem" }, [
        UI.el("button.btn", { text: "🖨️ Imprimer le plan", onclick: function () { window.print(); } })
      ]));
    }
  });
})();
