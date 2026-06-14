/* ============================================================
   Al Mizan — application V1 (router + écrans)
   Flux cœur : check-in → état du jour → priorités → recommandations
   Interface épurée, sans émoticônes.
   ============================================================ */
(function () {
  "use strict";
  var el = UI.el;

  // ---------- Navigation (libellés seuls, sans icône) ----------
  var ONGLETS = [
    { id: "accueil", nom: "Aujourd'hui" },
    { id: "tendances", nom: "Tendances" },
    { id: "zones", nom: "Turbulences" },
    { id: "pensees", nom: "Mes pensées" },
    { id: "biblio", nom: "Ressources" },
    { id: "resume", nom: "Résumé" },
    { id: "reglages", nom: "Profil" }
  ];

  function construireNav() {
    var nav = document.getElementById("onglets");
    UI.vider(nav);
    ONGLETS.forEach(function (o) {
      nav.appendChild(el("a.onglet", { href: "#/" + o.id, dataset: { vue: o.id } }, [
        el("span.onglet-txt", { text: o.nom })
      ]));
    });
  }
  function marquerActif(id) {
    document.querySelectorAll(".onglet").forEach(function (a) {
      a.classList.toggle("actif", a.dataset.vue === id);
    });
  }

  function naviguer(route) { location.hash = "#/" + route; }

  // ---------- Routeur ----------
  var ECRANS = {};
  function router() {
    var hash = location.hash.replace(/^#\/?/, "") || "accueil";
    var parts = hash.split("/");
    var id = parts[0];
    var arg = parts.slice(1).join("/");
    var fn = ECRANS[id] || ECRANS.accueil;
    var vue = document.getElementById("vue");
    UI.vider(vue);
    marquerActif(ECRANS[id] ? id : "accueil");
    try { fn(vue, arg); } catch (e) {
      console.error(e);
      vue.appendChild(el("p", { text: "Une erreur est survenue : " + e.message }));
    }
    window.scrollTo(0, 0);
  }

  // ---------- Composant : carte recommandation ----------
  function blocReco(reco) {
    var b = Data.recommander(reco);
    var box = el(".carte.etat", { style: "border-left:5px solid " + b.etat.couleur });
    box.appendChild(el("div", {}, [
      el("strong.etat-label", { text: b.etat.label }),
      el("p.etat-msg", { text: b.soutien })
    ]));

    // Ligne d'équilibre (discrète, animée) — où tu te situes aujourd'hui
    var dot = el(".equilibre-dot", { style: "border-color:" + b.etat.couleur });
    box.appendChild(el(".equilibre", { "aria-hidden": "true" }, [dot]));
    var pct = Math.max(3, Math.min(97, (b.etat.score - 1) / 4 * 100));
    setTimeout(function () { dot.style.left = pct + "%"; }, 90);

    // Priorités
    box.appendChild(el("h3.bloc-titre", { text: "Tes priorités du jour" }));
    var ul = el("ul.priorites");
    b.priorites.forEach(function (p) { ul.appendChild(el("li", { text: p })); });
    box.appendChild(ul);

    // Recommandations adaptées
    if (b.recos.length) {
      box.appendChild(el("h3.bloc-titre", { text: "Idées adaptées à ton état" }));
      var ur = el("ul.recos");
      b.recos.forEach(function (r) {
        ur.appendChild(el("li", {}, [
          el("span.reco-tag", { text: r.source }),
          el("span", { text: r.texte })
        ]));
      });
      box.appendChild(ur);
    }

    // Appui spirituel optionnel
    if (Store.prefs().spirituel) box.appendChild(blocSpirituel(b));
    return box;
  }

  function blocSpirituel(contexte) {
    var sp = Data.SPIRITUEL;
    var idx = contexte && contexte.etat.score < 2.6 ? 0 : Math.floor(Math.random() * sp.rappels.length);
    var r = sp.rappels[idx];
    return el(".carte.spirituel", {}, [
      el("span.reco-tag", { text: "Appui spirituel" }),
      el("blockquote", { text: r.texte }),
      el("p.meta", { text: r.ref + (r.note ? " — " + r.note : "") })
    ]);
  }

  // ---------- Écran : Aujourd'hui (check-in + état du jour) ----------
  ECRANS.accueil = function (vue) {
    var prefs = Store.prefs();
    var salut = prefs.prenom ? "Bonjour " + prefs.prenom : "Bonjour";
    vue.appendChild(UI.enTete(salut, "Un instant pour faire le point, en douceur."));

    var dejaFait = Store.checkinDuJour();

    if (dejaFait) {
      vue.appendChild(blocReco(dejaFait));
      vue.appendChild(el(".btn-rangee", {}, [
        el("button.btn.secondaire", { text: "Refaire le check-in", onclick: function () { afficherFormulaire(vue, dejaFait); } }),
        el("button.btn.ghost", { text: "Voir mes tendances", onclick: function () { naviguer("tendances"); } })
      ]));
      vue.appendChild(rappelCrise());
      return;
    }
    afficherFormulaire(vue, null);
  };

  function afficherFormulaire(vue, existant) {
    UI.vider(vue);
    vue.appendChild(UI.enTete("Comment ça va, aujourd'hui ?", "Déplace chaque curseur selon ton ressenti. Il n'y a pas de bonne réponse."));

    var valeurs = {};
    Data.DIMENSIONS.forEach(function (d) {
      valeurs[d.cle] = existant && typeof existant[d.cle] === "number" ? existant[d.cle] : 3;
      var sortie = el("span.slider-val", { text: etiquette(d, valeurs[d.cle]) });
      var input = el("input.slider", { type: "range", min: 1, max: 5, step: 1, value: valeurs[d.cle], "aria-label": d.nom });
      input.addEventListener("input", function () {
        valeurs[d.cle] = parseInt(input.value, 10);
        sortie.textContent = etiquette(d, valeurs[d.cle]);
      });
      vue.appendChild(el(".champ-slider", {}, [
        el(".slider-tete", {}, [el("span", { text: d.nom }), sortie]),
        input,
        el(".slider-bornes", {}, [el("span", { text: d.bas }), el("span", { text: d.haut })])
      ]));
    });

    // Zones rouges (contextes)
    var zonesChoisies = (existant && existant.zones) ? existant.zones.slice() : [];
    vue.appendChild(el("h3.bloc-titre", { text: "Quelque chose pèse en ce moment ?" }));
    vue.appendChild(el("p.note", { text: "Facultatif — coche ce qui te concerne." }));
    var grilleZones = el(".zones-puces");
    Data.ZONES.forEach(function (z) {
      var actif = zonesChoisies.indexOf(z.id) >= 0;
      var puce = el("button.puce" + (actif ? ".active" : ""), { text: z.nom, "aria-pressed": actif });
      puce.addEventListener("click", function () {
        var i = zonesChoisies.indexOf(z.id);
        if (i >= 0) { zonesChoisies.splice(i, 1); puce.classList.remove("active"); puce.setAttribute("aria-pressed", "false"); }
        else { zonesChoisies.push(z.id); puce.classList.add("active"); puce.setAttribute("aria-pressed", "true"); }
      });
      grilleZones.appendChild(puce);
    });
    vue.appendChild(grilleZones);

    var note = UI.input({ placeholder: "Un mot sur ta journée ? (facultatif)" });
    vue.appendChild(UI.champ("", note));

    vue.appendChild(el(".btn-rangee", {}, [
      el("button.btn.grand", { text: "Valider mon check-in", onclick: function () {
        var obj = { date: Store.cleJour(), zones: zonesChoisies, note: note.value.trim() };
        Data.DIMENSIONS.forEach(function (d) { obj[d.cle] = valeurs[d.cle]; });
        if (existant) Store.checkins.supprimer(existant.id);
        Store.checkins.ajouter(obj);
        UI.toast("Check-in enregistré");
        naviguer("accueil");
        router();
      } })
    ]));
    vue.appendChild(rappelCrise());
  }

  function etiquette(d, v) {
    var mots = ["", "1 · " + d.bas, "2", "3", "4", "5 · " + d.haut];
    return mots[v];
  }

  // ---------- Mode crise (toujours accessible) ----------
  function rappelCrise() {
    return el(".rappel-crise", {}, [
      el("span", { text: "Besoin d'une pause, là, maintenant ?" }),
      el("button.btn.crise", { text: "Mode crise", onclick: ouvrirCrise })
    ]);
  }

  function ouvrirCrise() {
    var ov = el(".crise-espace", { role: "dialog", "aria-label": "Espace d'apaisement" });

    var orbe = el(".respi-orbe", { "aria-hidden": "true" });
    var phase = el("p.respi-phase", { text: "Inspire" });
    var consigne = el("p.respi-consigne", { text: "Laisse le cercle te guider : il grandit, tu inspires ; il s'apaise, tu souffles." });

    var liste = el("ul.liste-soignee.crise-liste");
    [
      "Inspire quatre secondes, souffle six secondes — cinq fois.",
      "Ancrage : cinq choses que tu vois, quatre que tu entends, trois que tu touches, deux que tu sens, une que tu goûtes.",
      "Un verre d'eau, un peu de frais, les épaules qui descendent.",
      "Une seule micro-action, la plus petite possible. Le reste attend.",
      "Un message à une personne de confiance peut suffire."
    ].forEach(function (t) { liste.appendChild(el("li", { text: t })); });

    ov.appendChild(el("button.crise-fermer", { text: "Revenir", onclick: fermer }));
    ov.appendChild(el("p.crise-titre", { text: "Un pas à la fois" }));
    ov.appendChild(el("p.crise-sous", { text: "On ne cherche pas à être productive. Juste à traverser la vague, en douceur." }));
    ov.appendChild(el(".respi", {}, [orbe, phase, consigne]));
    ov.appendChild(liste);
    if (Store.prefs().spirituel) {
      ov.appendChild(el(".carte.spirituel", { style: "max-width:30rem;width:100%;text-align:left" }, [
        el("blockquote", { text: "« Allahumma la sahla illa ma ja'altahu sahla » — Ô Allah, il n'y a de facile que ce que Tu rends facile." }),
        el("p.meta", { text: "Du'a de l'apaisement — à répéter doucement." })
      ]));
    }
    ov.appendChild(el("p.crise-urgence", { text: "Danger immédiat, ou pensées de te faire du mal ? Appelle le 3114 (prévention du suicide, 24h/24, gratuit) ou le 15." }));

    document.body.appendChild(ov);
    document.body.style.overflow = "hidden";
    var t0 = Date.now();
    var timer = setInterval(function () {
      var e = (Date.now() - t0) % 12000;
      phase.textContent = e < 4000 ? "Inspire" : (e < 6000 ? "Retiens" : "Souffle");
    }, 200);

    function fermer() {
      clearInterval(timer);
      document.body.style.overflow = "";
      if (ov.parentNode) ov.parentNode.removeChild(ov);
    }
  }

  // ---------- Écran : Tendances (courbes 7 / 30 jours) ----------
  ECRANS.tendances = function (vue) {
    vue.appendChild(UI.enTete("Tes tendances", "Ton énergie n'est pas linéaire. Observer ton rythme, sans te juger, t'aide à travailler avec toi."));
    var checks = Store.checkins.tout();
    if (checks.length < 2) {
      vue.appendChild(el(".carte", {}, [el("p", { text: "Encore un peu de patience : il faut au moins deux check-ins pour tracer une tendance. Reviens demain après ton point du jour." })]));
      return;
    }

    vue.appendChild(blocCourbe("7 derniers jours", 7, checks));
    vue.appendChild(blocCourbe("30 derniers jours", 30, checks));
    vue.appendChild(vueSimpleTendance(checks));
  };

  function moyenneParJour(checks, jours) {
    var now = new Date(); var map = {};
    checks.forEach(function (c) {
      var d = new Date(c.cree);
      var diff = Math.floor((now - d) / 86400000);
      if (diff < jours) {
        var k = c.date;
        (map[k] = map[k] || []).push(Data.moyenne(c));
      }
    });
    return Object.keys(map).sort().map(function (k) {
      var arr = map[k];
      return { date: k, valeur: arr.reduce(function (s, v) { return s + v; }, 0) / arr.length };
    });
  }

  function blocCourbe(titre, jours, checks) {
    var data = moyenneParJour(checks, jours);
    var wrap = el(".carte", {}, [el("h3.bloc-titre", { text: titre })]);
    if (data.length < 2) {
      wrap.appendChild(el("p.note", { text: "Pas encore assez de données sur cette période." }));
      return wrap;
    }
    var ns = "http://www.w3.org/2000/svg";
    var W = Math.max(300, data.length * 40), H = 200, P = 28;
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("width", "100%"); svg.style.maxWidth = "100%";
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", titre + " : moyenne de l'état général");
    for (var n = 1; n <= 5; n++) {
      var y = H - P - (n - 1) / 4 * (H - 2 * P);
      var l = document.createElementNS(ns, "line");
      l.setAttribute("x1", P); l.setAttribute("x2", W - 6); l.setAttribute("y1", y); l.setAttribute("y2", y);
      l.setAttribute("stroke", "#ece2d2"); svg.appendChild(l);
    }
    function px(i) { return P + (data.length === 1 ? (W - 2 * P) / 2 : i / (data.length - 1) * (W - 2 * P)); }
    function py(v) { return H - P - (v - 1) / 4 * (H - 2 * P); }
    var d = "";
    data.forEach(function (pt, i) { d += (i === 0 ? "M" : "L") + px(i) + "," + py(pt.valeur) + " "; });
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", d); path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#8a9882"); path.setAttribute("stroke-width", "2.5"); path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    data.forEach(function (pt, i) {
      var c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", px(i)); c.setAttribute("cy", py(pt.valeur)); c.setAttribute("r", 5);
      c.setAttribute("fill", Data.etatDuJour(crid(pt.valeur)).couleur);
      var t = document.createElementNS(ns, "title");
      t.textContent = UI.dateFr(pt.date) + " — " + pt.valeur.toFixed(1) + "/5";
      c.appendChild(t); svg.appendChild(c);
    });
    wrap.appendChild(el(".chart-wrap", {}, [svg]));
    var moy = (data.reduce(function (s, p) { return s + p.valeur; }, 0) / data.length).toFixed(1);
    wrap.appendChild(el("p", { style: "margin-top:.5rem" }, [el("span.pilule", { text: data.length + " jour(s) · moyenne " + moy + "/5" })]));
    return wrap;
  }
  function crid(v) { var o = {}; Data.DIMENSIONS.forEach(function (d) { o[d.cle] = v; }); return o; }

  function vueSimpleTendance(checks) {
    var d7 = moyenneParJour(checks, 7), d30 = moyenneParJour(checks, 30);
    function moy(a) { return a.length ? a.reduce(function (s, p) { return s + p.valeur; }, 0) / a.length : 0; }
    var m7 = moy(d7), m30 = moy(d30);
    var sens;
    if (!d30.length) sens = "Continue tes check-ins pour voir ta tendance se dessiner.";
    else if (m7 > m30 + 0.3) sens = "Ces sept derniers jours sont un peu plus lumineux que ton mois. Quelque chose te fait du bien — repère quoi.";
    else if (m7 < m30 - 0.3) sens = "Cette semaine est plus basse que ton mois. Sois douce avec toi et allège ce qui peut l'être.";
    else sens = "Ton état est plutôt stable en ce moment. La régularité, c'est déjà précieux.";
    return el(".carte.etat", {}, [
      el("strong.etat-label", { text: "Ce que disent tes courbes" }),
      el("p.etat-msg", { text: sens })
    ]);
  }

  // ---------- Écran : Zones rouges ----------
  ECRANS.zones = function (vue, arg) {
    if (arg) return ecranZoneDetail(vue, arg);
    vue.appendChild(UI.enTete("Zones de turbulences", "Des moments de vie qui changent ton rapport au travail et à l'énergie. Les comprendre, c'est arrêter de se juger."));
    var grille = el(".cartes-grille");
    Data.ZONES.forEach(function (z) {
      grille.appendChild(el("button.carte.zone-carte", { style: "border-top:4px solid " + z.couleur, onclick: function () { naviguer("zones/" + z.id); } }, [
        el("strong", { text: z.nom }),
        el("p.note", { text: z.intro.slice(0, 88) + "…" })
      ]));
    });
    vue.appendChild(grille);
  };

  function ecranZoneDetail(vue, id) {
    var z = Data.zoneParId(id);
    if (!z) { naviguer("zones"); return; }
    vue.appendChild(el("button.lien-retour", { text: "← Toutes les turbulences", onclick: function () { naviguer("zones"); } }));
    vue.appendChild(UI.enTete(z.nom, null));
    var c = el(".carte", { style: "border-top:4px solid " + z.couleur });
    c.appendChild(el("p", { text: z.intro }));
    c.appendChild(listeTitre("Ce que tu peux ressentir", z.signes));
    c.appendChild(listeTitre("Ce qui aide", z.cequiaide));
    c.appendChild(listeTitre("Ce qu'on évite de s'imposer", z.aeviter));
    c.appendChild(el(".carte.spirituel", { style: "margin-top:1rem" }, [
      el("span.reco-tag", { text: "Message pour toi" }),
      el("p", { text: z.soutien })
    ]));
    if (z.consulter) c.appendChild(el("p.note.alerte", { text: "Si cet état s'installe ou s'aggrave, ce n'est pas un échec d'aller voir un professionnel de santé. Tu mérites du soutien." }));
    vue.appendChild(c);
  }

  function listeTitre(titre, items) {
    var ul = el("ul.liste-soignee");
    items.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
    return el("div", {}, [el("h3.bloc-titre", { text: titre }), ul]);
  }

  // ---------- Écran : Ressources (bibliothèque + émotions) ----------
  ECRANS.biblio = function (vue, arg) {
    if (arg) return ecranArticle(vue, arg);
    vue.appendChild(UI.enTete("Comprendre ton fonctionnement", "De courtes lectures pour mieux te connaître : tes émotions, tes schémas, tes leviers."));

    vue.appendChild(el("h3.bloc-titre", { text: "Tes émotions et leurs messages" }));
    var ge = el(".cartes-grille");
    Data.EMOTIONS.forEach(function (em) {
      ge.appendChild(el("button.carte.zone-carte", { style: "border-top:4px solid " + em.couleur, onclick: function () { naviguer("biblio/emo-" + em.id); } }, [
        el("strong", { text: em.nom }),
        el("p.note", { text: em.fonction.slice(0, 78) + "…" })
      ]));
    });
    vue.appendChild(ge);

    vue.appendChild(el("h3.bloc-titre", { text: "Mini-articles" }));
    var gb = el(".cartes-grille");
    Data.BIBLIO.forEach(function (a) {
      gb.appendChild(el("button.carte.zone-carte", { onclick: function () { naviguer("biblio/art-" + a.id); } }, [
        el("strong", { text: a.titre }),
        el("p.note", { text: "Lecture · " + a.duree })
      ]));
    });
    vue.appendChild(gb);

    vue.appendChild(el("h3.bloc-titre", { text: "Hygiène de vie" }));
    var gh = el(".cartes-grille");
    Data.HYGIENE.forEach(function (h) {
      gh.appendChild(el(".carte", {}, [
        el("strong", { text: h.titre }),
        el("p.note", { text: h.texte })
      ]));
    });
    vue.appendChild(gh);
  };

  function ecranArticle(vue, arg) {
    vue.appendChild(el("button.lien-retour", { text: "← Retour", onclick: function () { naviguer("biblio"); } }));
    if (arg.indexOf("emo-") === 0) {
      var em = Data.EMOTIONS.filter(function (x) { return x.id === arg.slice(4); })[0];
      if (!em) return naviguer("biblio");
      vue.appendChild(UI.enTete(em.nom, null));
      var c = el(".carte", { style: "border-top:4px solid " + em.couleur });
      c.appendChild(el("h3.bloc-titre", { text: "Ce qui la déclenche" }));
      c.appendChild(el("p", { text: em.declencheur }));
      c.appendChild(el("h3.bloc-titre", { text: "À quoi elle sert" }));
      c.appendChild(el("p", { text: em.fonction }));
      c.appendChild(listeTitre("Ce qui aide à la traverser", em.aide));
      vue.appendChild(c);
      vue.appendChild(el("p.note", { text: "Une émotion n'est ni « bonne » ni « mauvaise » : c'est un signal. La comprendre, c'est reprendre du pouvoir sur ton fonctionnement." }));
    } else {
      var a = Data.BIBLIO.filter(function (x) { return x.id === arg.slice(4); })[0];
      if (!a) return naviguer("biblio");
      vue.appendChild(UI.enTete(a.titre, "Lecture · " + a.duree));
      var box = el(".carte");
      a.paras.forEach(function (p) { box.appendChild(el("p", { text: p })); });
      vue.appendChild(box);
    }
  }

  // ---------- Écran : Mes pensées (journal TCC, méthode 5 étapes) ----------
  ECRANS.pensees = function (vue, arg) {
    if (arg === "nouvelle") return formulairePensee(vue);
    vue.appendChild(UI.enTete("Mes pensées", "Attraper une pensée automatique, l'observer sans honte, et retrouver une lecture plus juste."));

    vue.appendChild(el(".btn-rangee", {}, [
      el("button.btn.grand", { text: "Observer une pensée", onclick: function () { naviguer("pensees/nouvelle"); } })
    ]));

    var rep = el(".carte");
    rep.appendChild(el("h3.bloc-titre", { text: "Les 6 biais, pour t'aider à repérer" }));
    var familles = {};
    Data.BIAIS.forEach(function (b) { (familles[b.famille] = familles[b.famille] || []).push(b); });
    Object.keys(familles).forEach(function (f) {
      rep.appendChild(el("p", {}, [el("strong", { text: f + " : " }), el("span", { text: familles[f].map(function (b) { return b.nom.replace(/^Les? /, ""); }).join(" · ") })]));
    });
    rep.appendChild(el("p.note", { text: "Un biais n'est pas un défaut moral : c'est un raccourci mental. L'observer suffit déjà à l'alléger." }));
    vue.appendChild(rep);

    var liste = Store.pensees.tout().slice().sort(function (a, b) { return new Date(b.cree) - new Date(a.cree); });
    if (liste.length) {
      vue.appendChild(el("h3.bloc-titre", { text: "Mes observations" }));
      liste.forEach(function (p) {
        var biais = p.biais ? Data.BIAIS.filter(function (b) { return b.id === p.biais; })[0] : null;
        vue.appendChild(el(".carte.pensee-item", {}, [
          el(".pensee-tete", {}, [
            el("span.meta", { text: UI.dateHeureFr(p.cree) }),
            biais ? el("span.reco-tag", { text: biais.nom }) : null
          ]),
          el("p", {}, [el("strong", { text: "Situation : " }), el("span", { text: p.situation || "—" })]),
          el("p", {}, [el("strong", { text: "Pensée : " }), el("span", { text: "« " + (p.pensee || "—") + " »" }), p.intensite ? el("span.pilule", { text: p.emotion + " " + p.intensite + "/10" }) : null]),
          p.alternative ? el("p.alt", {}, [el("strong", { text: "Lecture plus juste : " }), el("span", { text: p.alternative })]) : null,
          el("button.btn.ghost.mini", { text: "Retirer", "aria-label": "Supprimer", onclick: function () { Store.pensees.supprimer(p.id); naviguer("pensees"); router(); } })
        ]));
      });
    } else {
      vue.appendChild(el("p.note", { text: "Tu n'as pas encore observé de pensée. Quand une situation te secoue, viens la déposer ici, à tête reposée." }));
    }
  };

  function formulairePensee(vue) {
    vue.appendChild(el("button.lien-retour", { text: "← Mes pensées", onclick: function () { naviguer("pensees"); } }));
    vue.appendChild(UI.enTete("Observer une pensée", "Pas d'interprétation, pas de jugement. On note le réel, pas l'histoire qu'on se raconte."));

    function bloc(num, titre, aide, control) {
      return el(".carte.etape", {}, [
        el(".etape-num", { text: String(num) }),
        el("div.grow", {}, [el("strong", { text: titre }), aide ? el("p.note", { text: aide }) : null, control])
      ]);
    }

    var situation = UI.input({ placeholder: "Ex. : mon client a répondu en trois mots" });
    vue.appendChild(bloc(1, "Le fait exact", "Ce qu'une caméra aurait filmé, sans interprétation.", situation));

    var pensee = UI.input({ placeholder: "Ex. : « il me trouve nulle »" });
    vue.appendChild(bloc(2, "La pensée, mot pour mot", "La phrase exacte qui a traversé ton esprit.", pensee));

    var emotion = el("select.champ-input");
    ["Anxiété", "Tristesse", "Colère", "Honte", "Peur", "Frustration", "Découragement", "Culpabilité"].forEach(function (e) { emotion.appendChild(el("option", { text: e })); });
    var intensite = el("input.slider", { type: "range", min: 0, max: 10, step: 1, value: 5 });
    var valIntensite = el("span.slider-val", { text: "5/10" });
    intensite.addEventListener("input", function () { valIntensite.textContent = intensite.value + "/10"; });
    vue.appendChild(bloc(3, "L'émotion et son intensité", "Nomme-la, puis cote-la de 0 à 10.", el("div", {}, [
      el(".slider-tete", {}, [emotion, valIntensite]), intensite
    ])));

    var comportement = UI.input({ placeholder: "Ex. : je me suis repliée, j'ai évité de relancer" });
    vue.appendChild(bloc(4, "Le comportement", "Ce que tu as fait — ou évité de faire.", comportement));

    var consequence = UI.input({ placeholder: "Ex. : la relation s'est refroidie, je me suis dévalorisée" });
    vue.appendChild(bloc(5, "La conséquence", "L'impact sur ta vie, ta relation, ton estime.", consequence));

    vue.appendChild(el("h3.bloc-titre", { text: "Un biais à l'œuvre ?" }));
    vue.appendChild(el("p.note", { text: "Facultatif." }));
    var biaisChoisi = null;
    var grilleB = el(".zones-puces");
    Data.BIAIS.forEach(function (b) {
      var puce = el("button.puce", { text: b.nom.replace(/^Les? /, "") });
      puce.addEventListener("click", function () {
        if (biaisChoisi === b.id) { biaisChoisi = null; puce.classList.remove("active"); }
        else { biaisChoisi = b.id; grilleB.querySelectorAll(".puce").forEach(function (x) { x.classList.remove("active"); }); puce.classList.add("active"); }
        majAide();
      });
      grilleB.appendChild(puce);
    });
    vue.appendChild(grilleB);
    var aideBiais = el(".carte.spirituel", { style: "display:none" });
    vue.appendChild(aideBiais);
    function majAide() {
      var b = Data.BIAIS.filter(function (x) { return x.id === biaisChoisi; })[0];
      if (!b) { aideBiais.style.display = "none"; return; }
      UI.vider(aideBiais);
      aideBiais.appendChild(el("span.reco-tag", { text: b.nom }));
      aideBiais.appendChild(el("p", { text: b.desc }));
      aideBiais.appendChild(el("p.note", { text: b.piste }));
      aideBiais.style.display = "";
    }

    vue.appendChild(el("h3.bloc-titre", { text: "Clarifier : vers une lecture plus juste" }));
    var ulq = el("ul.liste-soignee");
    Data.QUESTIONS_CLARIF.forEach(function (q) { ulq.appendChild(el("li", { text: q })); });
    vue.appendChild(el(".carte", {}, [el("p.note", { text: "Clarifier n'est pas se rassurer (« tout ira bien »). C'est une pensée plus juste, plus précise, qui permet d'agir." }), ulq]));
    var alternative = el("textarea.champ-input", { rows: 3, placeholder: "Ex. : « Je ne sais pas ce qu'il pense. Sa réponse courte peut venir de sa fatigue. Je peux relancer simplement. »" });
    vue.appendChild(UI.champ("Ma lecture plus juste", alternative));

    vue.appendChild(el(".btn-rangee", {}, [
      el("button.btn.grand", { text: "Enregistrer", onclick: function () {
        if (!situation.value.trim() && !pensee.value.trim()) { UI.toast("Note au moins la situation et la pensée"); return; }
        Store.pensees.ajouter({
          situation: situation.value.trim(), pensee: pensee.value.trim(),
          emotion: emotion.value, intensite: parseInt(intensite.value, 10),
          comportement: comportement.value.trim(), consequence: consequence.value.trim(),
          biais: biaisChoisi, alternative: alternative.value.trim()
        });
        UI.toast("Pensée observée. Bravo pour ce pas.");
        naviguer("pensees"); router();
      } })
    ]));
  }

  // ---------- Écran : Résumé & export ----------
  ECRANS.resume = function (vue) {
    vue.appendChild(UI.enTete("Ton résumé", "Une synthèse à relire, à imprimer en PDF, ou à partager avec ton accompagnante."));
    var checks = Store.checkins.tout();
    if (!checks.length) {
      vue.appendChild(el(".carte", {}, [el("p", { text: "Ton résumé apparaîtra dès ton premier check-in." })]));
      return;
    }
    vue.appendChild(blocResumeHebdo(checks));
    vue.appendChild(el(".btn-rangee", {}, [
      el("button.btn.grand", { text: "Exporter en PDF", onclick: exporterPDF }),
      el("button.btn.secondaire", { text: "Exporter en CSV", onclick: exporterCSV })
    ]));
    vue.appendChild(el("p.note", { text: "Le PDF utilise l'impression de ton navigateur : choisis « Enregistrer en PDF » comme destination." }));
  };

  function statsPeriode(checks, jours) {
    var data = moyenneParJour(checks, jours);
    if (!data.length) return null;
    var m = data.reduce(function (s, p) { return s + p.valeur; }, 0) / data.length;
    return { nb: data.length, moy: m, etat: Data.etatDuJour(crid(m)) };
  }

  function blocResumeHebdo(checks) {
    var s7 = statsPeriode(checks, 7);
    var box = el(".carte");
    box.appendChild(el("h3.bloc-titre", { text: "Cette semaine en un coup d'œil" }));
    if (s7) {
      box.appendChild(el("p", {}, [el("span.pilule", { text: s7.nb + " check-in(s)" }), el("span.pilule", { text: "État moyen : " + s7.etat.label })]));
      var sommes = {}; var compte = 0;
      checks.forEach(function (c) {
        var diff = Math.floor((new Date() - new Date(c.cree)) / 86400000);
        if (diff < 7) { compte++; Data.DIMENSIONS.forEach(function (d) { sommes[d.cle] = (sommes[d.cle] || 0) + (c[d.cle] || 0); }); }
      });
      if (compte) {
        var classees = Data.DIMENSIONS.map(function (d) { return { d: d, v: sommes[d.cle] / compte }; }).sort(function (a, b) { return a.v - b.v; });
        var bas = classees[0], haut = classees[classees.length - 1];
        box.appendChild(el("p", { text: "Ce qui t'a le plus soutenue : " + haut.d.nom + ". Ce qui a le plus tiré sur toi : " + bas.d.nom + "." }));
      }
      var zc = {};
      checks.forEach(function (c) {
        var diff = Math.floor((new Date() - new Date(c.cree)) / 86400000);
        if (diff < 7) (c.zones || []).forEach(function (z) { zc[z] = (zc[z] || 0) + 1; });
      });
      var zk = Object.keys(zc).sort(function (a, b) { return zc[b] - zc[a]; });
      if (zk.length) {
        var noms = zk.slice(0, 3).map(function (k) { var z = Data.zoneParId(k); return z ? z.nom : k; });
        box.appendChild(el("p", { text: "Tu as traversé : " + noms.join(", ") + ". C'est important d'en tenir compte." }));
      }
    } else {
      box.appendChild(el("p", { text: "Pas de check-in sur les sept derniers jours. Reprends en douceur quand tu le sens." }));
    }
    return box;
  }

  function exporterCSV() {
    var checks = Store.checkins.tout().slice().sort(function (a, b) { return new Date(a.cree) - new Date(b.cree); });
    var entetes = ["date"].concat(Data.DIMENSIONS.map(function (d) { return d.nom; })).concat(["moyenne", "zones", "note"]);
    var lignes = [entetes.join(";")];
    checks.forEach(function (c) {
      var row = [c.date];
      Data.DIMENSIONS.forEach(function (d) { row.push(c[d.cle] || ""); });
      row.push(Data.moyenne(c).toFixed(2));
      row.push((c.zones || []).map(function (z) { var x = Data.zoneParId(z); return x ? x.nom : z; }).join(" / "));
      row.push((c.note || "").replace(/[;\n]/g, " "));
      lignes.push(row.join(";"));
    });
    telecharger("al-mizan-export.csv", "﻿" + lignes.join("\n"), "text/csv");
    UI.toast("Export CSV prêt");
  }

  function telecharger(nom, contenu, type) {
    var blob = new Blob([contenu], { type: type + ";charset=utf-8" });
    var a = el("a", { href: URL.createObjectURL(blob), download: nom });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function exporterPDF() {
    var checks = Store.checkins.tout();
    var s7 = statsPeriode(checks, 7), s30 = statsPeriode(checks, 30);
    var w = window.open("", "_blank");
    if (!w) { UI.toast("Autorise les fenêtres pop-up pour le PDF"); return; }
    var prefs = Store.prefs();
    var courbe7 = blocCourbe("7 derniers jours", 7, checks).querySelector("svg");
    var courbe30 = blocCourbe("30 derniers jours", 30, checks).querySelector("svg");
    var html = "<!DOCTYPE html><html lang='fr'><head><meta charset='utf-8'><title>Résumé — Al Mizan</title><style>" +
      "body{font-family:Georgia,'Times New Roman',serif;color:#34261f;max-width:760px;margin:24px auto;padding:0 16px;line-height:1.5}" +
      "h1{color:#5f6d5c;font-weight:600}h2{color:#5f6d5c;border-bottom:1px solid #e7ddd1;padding-bottom:4px;margin-top:28px;font-weight:600}" +
      ".pil{display:inline-block;background:#e9ede6;color:#5f6d5c;border-radius:999px;padding:3px 12px;margin:3px;font-size:14px;font-family:sans-serif}" +
      "svg{max-width:100%;border:1px solid #ece2d2;border-radius:10px;padding:8px}" +
      ".note{color:#897e72;font-size:13px;font-family:sans-serif}table{width:100%;border-collapse:collapse;font-size:13px;font-family:sans-serif}td,th{border:1px solid #e7ddd1;padding:5px 7px;text-align:left}" +
      "</style></head><body>";
    html += "<h1>Mon résumé — Al Mizan</h1>";
    html += "<p class='note'>" + (prefs.prenom ? prefs.prenom + " — " : "") + "Édité le " + new Date().toLocaleDateString("fr-FR") + "</p>";
    html += "<h2>Synthèse</h2><p>";
    if (s7) html += "<span class='pil'>7 j : " + s7.etat.label + " (" + s7.moy.toFixed(1) + "/5)</span>";
    if (s30) html += "<span class='pil'>30 j : " + s30.etat.label + " (" + s30.moy.toFixed(1) + "/5)</span>";
    html += "</p>";
    if (courbe7) html += "<h2>Tendance 7 jours</h2>" + courbe7.outerHTML;
    if (courbe30) html += "<h2>Tendance 30 jours</h2>" + courbe30.outerHTML;
    html += "<h2>Derniers check-ins</h2><table><tr><th>Date</th>" + Data.DIMENSIONS.map(function (d) { return "<th>" + d.nom + "</th>"; }).join("") + "<th>Moy.</th><th>Contexte</th></tr>";
    checks.slice().sort(function (a, b) { return new Date(b.cree) - new Date(a.cree); }).slice(0, 14).forEach(function (c) {
      html += "<tr><td>" + UI.dateFr(c.cree) + "</td>" + Data.DIMENSIONS.map(function (d) { return "<td>" + (c[d.cle] || "-") + "</td>"; }).join("") + "<td>" + Data.moyenne(c).toFixed(1) + "</td><td>" + (c.zones || []).map(function (z) { var x = Data.zoneParId(z); return x ? x.nom : z; }).join(", ") + "</td></tr>";
    });
    html += "</table>";
    html += "<p class='note' style='margin-top:24px'>Al Mizan est un outil de soutien à la compréhension de soi. Il ne remplace ni un diagnostic, ni un suivi médical ou psychologique.</p>";
    html += "</body></html>";
    w.document.write(html); w.document.close();
    setTimeout(function () { w.print(); }, 350);
  }

  // ---------- Écran : Profil ----------
  ECRANS.reglages = function (vue) {
    var prefs = Store.prefs();
    vue.appendChild(UI.enTete("Profil", "Tes données restent sur cet appareil. Tu en as la pleine maîtrise."));

    var prenom = UI.input({ value: prefs.prenom || "", placeholder: "Ton prénom (facultatif)" });
    prenom.addEventListener("change", function () { Store.majPrefs({ prenom: prenom.value.trim() }); UI.toast("Enregistré"); });
    vue.appendChild(el(".carte", {}, [UI.champ("Comment veux-tu être appelée ?", prenom)]));

    var carteRappel = el(".carte");
    carteRappel.appendChild(el("h3.bloc-titre", { text: "Rappel doux" }));
    carteRappel.appendChild(el("p.note", { text: "Une invitation bienveillante à faire ton point du jour. Jamais culpabilisant." }));
    carteRappel.appendChild(interrupteur("M'inviter chaque jour", prefs.rappelActif, function (v) {
      Store.majPrefs({ rappelActif: v });
      if (v) demanderNotif();
    }));
    var heure = el("input.champ-input", { type: "time", value: prefs.rappelHeure || "09:00" });
    heure.addEventListener("change", function () { Store.majPrefs({ rappelHeure: heure.value }); UI.toast("Heure du rappel : " + heure.value); });
    carteRappel.appendChild(UI.champ("À quelle heure ?", heure));
    vue.appendChild(carteRappel);

    var carteSpi = el(".carte");
    carteSpi.appendChild(el("h3.bloc-titre", { text: "Appui spirituel" }));
    carteSpi.appendChild(el("p.note", { text: Data.SPIRITUEL.intro }));
    carteSpi.appendChild(interrupteur("Activer les rappels spirituels", prefs.spirituel, function (v) { Store.majPrefs({ spirituel: v }); UI.toast(v ? "Activé" : "Désactivé"); }));
    vue.appendChild(carteSpi);

    var carteData = el(".carte");
    carteData.appendChild(el("h3.bloc-titre", { text: "Mes données" }));
    carteData.appendChild(el(".btn-rangee", {}, [
      el("button.btn.secondaire", { text: "Sauvegarder (JSON)", onclick: function () {
        telecharger("al-mizan-sauvegarde.json", JSON.stringify(Store.exporterTout(), null, 2), "application/json");
        UI.toast("Sauvegarde téléchargée");
      } }),
      el("button.btn.ghost", { text: "Tout effacer", onclick: function () {
        UI.modal({ titre: "Tout effacer ?", message: "Cette action supprime définitivement tous tes check-ins et réglages sur cet appareil.", annuler: true, texteAnnuler: "Annuler", texteOk: "Effacer", onOk: function () { Store.effacerTout(); UI.toast("Données effacées"); naviguer("accueil"); router(); } });
      } })
    ]));
    vue.appendChild(carteData);

    vue.appendChild(el("p.note", { style: "text-align:center;margin-top:1.5rem", text: "Al Mizan — outil de soutien à la compréhension de soi. Ne remplace ni un diagnostic, ni un suivi médical ou psychologique." }));
  };

  function interrupteur(label, actif, onChange) {
    var input = el("input", { type: "checkbox" });
    if (actif) input.checked = true;
    input.addEventListener("change", function () { onChange(input.checked); });
    return el("label.interrupteur", {}, [input, el("span.glissiere"), el("span", { text: label })]);
  }

  function demanderNotif() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") Notification.requestPermission();
  }

  // ---------- Accueil tout doux (première visite) ----------
  function bienvenue() {
    var corps = el("div");
    corps.appendChild(el("div", { style: "text-align:center;margin:.2rem 0 .8rem" }, [
      el("img", { src: "assets/img/al-mizan-mark.svg", alt: "Al Mizan", width: 72, height: 72 }),
      el("p", { style: "margin:.4rem 0 0;color:var(--or);font-weight:700;letter-spacing:.06em;font-size:.78rem", text: "ÉQUILIBRE INTÉRIEUR, CLARTÉ & SÉRÉNITÉ" })
    ]));
    corps.appendChild(el("p", { text: "Al Mizan, c'est ton espace à toi. Un petit rituel quotidien pour mieux te comprendre, sans te juger, et retrouver ton équilibre — un jour après l'autre." }));
    var etapes = el("ul.liste-soignee", { style: "margin:.7rem 0" });
    [
      "Chaque jour, un check-in d'une minute : où en es-tu, vraiment ?",
      "Al Mizan te répond : ton état du jour, une à trois priorités douces, des pistes adaptées.",
      "Au fil des jours, tu vois ton rythme se dessiner — sans pression de performance.",
      "Et quand une pensée te secoue, tu peux l'observer pour retrouver une lecture plus juste."
    ].forEach(function (t) { etapes.appendChild(el("li", { text: t })); });
    corps.appendChild(etapes);
    corps.appendChild(el("p.note", { text: "Tout reste sur ton appareil. Personne d'autre ne le voit. Aucune bonne ou mauvaise réponse — juste toi, en vérité." }));
    UI.modal({
      titre: "Bienvenue",
      contenu: corps,
      texteOk: "Commencer en douceur",
      annuler: false,
      onOk: function () { Store.majPrefs({ onboarded: true }); return true; }
    });
  }

  // ---------- Démarrage ----------
  function start() {
    construireNav();
    window.addEventListener("hashchange", router);
    verifierRappel();
    router();
    if (!Store.prefs().onboarded && !Store.checkins.tout().length) {
      setTimeout(bienvenue, 400);
    }
  }

  function verifierRappel() {
    var prefs = Store.prefs();
    if (!prefs.rappelActif || Store.checkinDuJour()) return;
    var now = new Date();
    var hm = (prefs.rappelHeure || "09:00").split(":");
    if (now.getHours() > parseInt(hm[0], 10) || (now.getHours() === parseInt(hm[0], 10) && now.getMinutes() >= parseInt(hm[1], 10))) {
      setTimeout(function () { UI.toast("Un petit moment pour ton check-in du jour ?"); }, 1200);
    }
  }

  window.AlMizan = { start: start, naviguer: naviguer, crise: ouvrirCrise };
})();
