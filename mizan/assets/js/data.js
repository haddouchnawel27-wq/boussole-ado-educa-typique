/* ============================================================
   Mîzân — contenus & moteur de recommandations
   Ton : chaleureux, clair, non culpabilisant, non clinique.
   Ces contenus sont un soutien à la compréhension de soi —
   ils ne remplacent ni un diagnostic, ni un suivi médical.
   ============================================================ */
(function () {
  "use strict";

  // ---- Les 4 dimensions du check-in (échelle 1 → 5) ----
  // Volontairement courtes pour ne pas alourdir le rituel quotidien.
  var DIMENSIONS = [
    { cle: "energie", nom: "Énergie", emoji: "🔋", bas: "Vidée", haut: "Pleine d'élan" },
    { cle: "humeur", nom: "Humeur", emoji: "🌤️", bas: "Lourde", haut: "Légère" },
    { cle: "clarte", nom: "Clarté mentale", emoji: "🧠", bas: "Brouillard", haut: "Limpide" },
    { cle: "elan", nom: "Élan d'agir", emoji: "🚀", bas: "À l'arrêt", haut: "En mouvement" }
  ];

  // ---- Zones rouges enrichies ----
  // Contextes traversés qui changent le rapport au travail et à l'énergie.
  // L'utilisatrice peut en cocher pour adapter ses recommandations.
  var ZONES = [
    {
      id: "premenstruel", nom: "Phase prémenstruelle", emoji: "🌙", couleur: "#8a6bb0",
      intro: "Les jours qui précèdent les règles, l'énergie, l'humeur et la tolérance à la frustration peuvent chuter. Ce n'est pas un manque de volonté : c'est physiologique.",
      signes: ["Irritabilité, hypersensibilité", "Fatigue inhabituelle", "Doute sur tout (y compris ton projet)", "Besoin de te replier"],
      cequiaide: ["Alléger volontairement la charge sur ces jours", "Reporter les décisions importantes", "Tâches mécaniques plutôt que créatives", "Plus de douceur et de repos"],
      aeviter: ["Te juger sur ta productivité", "Lancer un gros projet pile maintenant", "Prendre tes pensées noires pour des vérités"],
      soutien: "Ton cycle n'efface pas tes compétences. Ce passage à vide est temporaire — ta valeur, elle, ne baisse pas.",
      recos: ["Garde aujourd'hui 1 seule priorité, la plus simple.", "Note ce que tu ressens : tu reliras la régularité du cycle.", "Programme du repos comme un vrai rendez-vous."]
    },
    {
      id: "fatigue", nom: "Fatigue", emoji: "😴", couleur: "#4a7fa5",
      intro: "Quand le corps est fatigué, le cerveau exécutif (planifier, décider, prioriser) fonctionne au ralenti. Forcer coûte plus que ça ne rapporte.",
      signes: ["Difficulté à démarrer", "Tout paraît une montagne", "Irritabilité, larmes faciles", "Envie de tout repousser"],
      cequiaide: ["Réduire la liste à l'essentiel", "Découper en micro-étapes de 5 min", "Bouger un peu, t'hydrater", "Accepter une journée « minimum »"],
      aeviter: ["Empiler les cafés pour tenir", "Te comparer à tes bons jours", "Culpabiliser de ralentir"],
      soutien: "Ralentir n'est pas abandonner. C'est entretenir la machine pour qu'elle dure.",
      recos: ["Choisis 1 micro-action de 5 minutes, juste pour amorcer.", "Autorise-toi une vraie pause sans écran.", "Repousse sans culpabilité ce qui peut attendre demain."]
    },
    {
      id: "reprise", nom: "Reprise progressive", emoji: "🌱", couleur: "#3a7d6e",
      intro: "Après une pause (maladie, vacances, creux), reprendre à 100 % d'un coup mène souvent au mur. La reprise se fait par paliers.",
      signes: ["Sensation d'être « rouillée »", "Peur de ne plus y arriver", "Envie d'aller trop vite pour rattraper"],
      cequiaide: ["Recommencer petit et régulier", "Une seule chose remise en route par jour", "Célébrer chaque redémarrage"],
      aeviter: ["Vouloir « rattraper » tout le retard", "Reprendre tous les fronts en même temps"],
      soutien: "Tu ne repars pas de zéro : tu repars de l'expérience. Chaque petit pas recompte.",
      recos: ["Reprends UN seul chantier aujourd'hui.", "Fixe-toi un objectif volontairement modeste.", "Note ce qui a redémarré, même minuscule."]
    },
    {
      id: "surcharge", nom: "Surcharge", emoji: "🌀", couleur: "#e26d5c",
      intro: "Trop de choses, en même temps, dans la tête. La surcharge mentale brouille les priorités et fige l'action (on tourne en rond).",
      signes: ["Tête qui « bourdonne »", "Impossible de choisir par quoi commencer", "Tout semble urgent", "Sommeil agité"],
      cequiaide: ["Vider la tête sur papier", "Trier : aujourd'hui / cette semaine / plus tard", "Déléguer ou supprimer", "Une chose à la fois"],
      aeviter: ["Tout garder en tête", "Le multitâche", "Dire oui par réflexe"],
      soutien: "Tu n'as pas un problème de capacité, mais un problème de volume. On allège, on ne te répare pas.",
      recos: ["Écris TOUT ce qui occupe ta tête, sans filtre.", "Entoure les 3 choses vraiment pour aujourd'hui.", "Choisis 1 chose à supprimer ou reporter."]
    },
    {
      id: "burnout", nom: "Épuisement (burn-out)", emoji: "🔥", couleur: "#c0392b",
      intro: "L'épuisement professionnel n'est pas « un coup de mou ». C'est une fatigue profonde, physique et émotionnelle, qui ne passe pas avec une nuit de sommeil. Elle mérite d'être prise au sérieux.",
      signes: ["Épuisement qui persiste au repos", "Cynisme, perte de sens", "Sentiment d'inefficacité", "Le corps lâche (douleurs, infections)"],
      cequiaide: ["Lever le pied pour de vrai", "Parler à un professionnel", "Réduire drastiquement les engagements", "Te rappeler que ce n'est pas une faiblesse"],
      aeviter: ["Pousser encore « juste un peu »", "Rester seule avec ça", "Croire que ça passera tout seul"],
      soutien: "Tu n'es pas paresseuse ni faible. Ton corps tire un signal d'alarme légitime. Le ralentissement est un soin, pas un échec.",
      consulter: true,
      recos: ["Aujourd'hui, vise le strict minimum vital, rien de plus.", "Identifie UNE charge que tu peux déposer cette semaine.", "Si l'épuisement dure, parles-en à un médecin ou un pro."]
    },
    {
      id: "depression", nom: "Humeur dépressive", emoji: "🌧️", couleur: "#34495e",
      intro: "Quand l'élan vital s'éteint durablement, ce n'est pas de la fainéantise. La perte d'envie, de plaisir et d'énergie sont des symptômes — pas des défauts de caractère.",
      signes: ["Plus d'envie ni de plaisir", "Tout demande un effort immense", "Pensées sombres, dévalorisation", "Sommeil et appétit perturbés"],
      cequiaide: ["Micro-objectifs très, très petits", "Garder un lien social, même minime", "Lumière, mouvement doux", "Demander de l'aide tôt"],
      aeviter: ["T'isoler complètement", "Te juger sur ton rendement", "Attendre d'aller « au bout »"],
      soutien: "Le fait que ce soit dur ne dit rien de ta valeur. Tu mérites du soutien dès maintenant, pas seulement quand ce sera grave.",
      consulter: true,
      recos: ["Choisis une seule action minuscule (te lever, t'habiller, un message).", "Préviens une personne de confiance de comment tu vas.", "Si ça dure plus de 2 semaines, consulte un professionnel."]
    },
    {
      id: "postpartum", nom: "Post-partum", emoji: "🍼", couleur: "#e29578",
      intro: "Après une naissance, le corps, les hormones et le sommeil sont bouleversés. Vouloir « reprendre comme avant » est irréaliste — et injuste envers toi.",
      signes: ["Fatigue extrême", "Émotions en montagnes russes", "Charge mentale énorme", "Culpabilité de ne pas « assurer »"],
      cequiaide: ["Revoir tes attentes à la baisse", "Accepter et demander de l'aide", "Protéger des micro-temps pour toi", "Surveiller le baby-blues qui s'installe"],
      aeviter: ["Te comparer à ton ancien rythme", "Porter seule la charge mentale", "Ignorer une tristesse persistante"],
      soutien: "Tu traverses l'un des plus grands bouleversements d'une vie. Faire « peu » en ce moment, c'est déjà énorme.",
      consulter: true,
      recos: ["Réduis tes objectifs pro au strict choisi, sans culpabilité.", "Délègue ou reporte une tâche aujourd'hui.", "Tristesse qui s'installe ? Parles-en à une sage-femme/un médecin."]
    },
    {
      id: "menopause", nom: "Ménopause / périménopause", emoji: "🔆", couleur: "#d4a373",
      intro: "Les variations hormonales peuvent agir sur l'énergie, le sommeil, la mémoire et l'humeur. Ce n'est ni « dans la tête », ni une fatalité : ça se comprend et s'accompagne.",
      signes: ["Sommeil perturbé, bouffées de chaleur", "Mémoire et concentration en dents de scie", "Humeur plus changeante", "Fatigue nouvelle"],
      cequiaide: ["Adapter le rythme aux jours « avec » et « sans »", "Soigner le sommeil", "En parler sans tabou", "Mouvement régulier"],
      aeviter: ["Minimiser ce que tu vis", "T'en vouloir pour les oublis", "Garder un rythme d'il y a 10 ans"],
      soutien: "Ton corps change, ton expérience grandit. Tu as le droit d'ajuster ta façon de travailler à cette nouvelle saison.",
      recos: ["Cale les tâches exigeantes sur tes heures les plus claires.", "Note tes jours « avec énergie » pour repérer ton rythme.", "Sommeil difficile durable ? Un professionnel peut aider."]
    },
    {
      id: "deuil", nom: "Séparation / deuil", emoji: "🕊️", couleur: "#6b7280",
      intro: "Une perte (rupture, décès, fin d'un cycle de vie) mobilise énormément d'énergie psychique, même quand on « fait comme si ». Le travail passe forcément au second plan, c'est normal.",
      signes: ["Vagues d'émotion imprévisibles", "Concentration difficile", "Fatigue, corps lourd", "Perte de sens temporaire"],
      cequiaide: ["Baisser fortement les attentes", "Garder un cadre minimal et doux", "Accepter les vagues sans lutter", "Du lien, du soutien"],
      aeviter: ["T'obliger à « être forte »", "Décider de gros changements à chaud", "T'isoler"],
      soutien: "Faire son deuil, c'est un travail à part entière. Ralentir le reste n'est pas une faiblesse, c'est une nécessité.",
      recos: ["Garde un cadre minimal aujourd'hui : 1 chose, en douceur.", "Laisse de la place aux émotions, sans te forcer.", "Appuie-toi sur une personne de confiance."]
    },
    {
      id: "preaccouchement", nom: "Préaccouchement", emoji: "🤰", couleur: "#ddb892",
      intro: "Les dernières semaines de grossesse demandent au corps une énergie immense. Préparer la transition de ton activité, sans héroïsme, est un acte de lucidité.",
      signes: ["Fatigue croissante", "Concentration plus difficile", "Besoin de ralentir", "Envie de « tout boucler » par anticipation"],
      cequiaide: ["Anticiper et déléguer", "Mettre en pause ce qui peut l'être", "Préparer un message d'absence serein", "Écouter les signaux du corps"],
      aeviter: ["Vouloir tout finir d'un coup", "Prendre de nouveaux engagements", "Ignorer la fatigue"],
      soutien: "Tu prépares un grand passage. Lever le pied maintenant, c'est prendre soin de deux personnes.",
      recos: ["Liste ce qui DOIT être bouclé vs. ce qui peut attendre ton retour.", "Délègue ou reporte une tâche dès aujourd'hui.", "Prépare un mot d'absence simple et sans justification."]
    }
  ];

  // ---- Recommandations génériques par dimension basse ----
  var RECOS_DIM = {
    energie: [
      "Vise une seule chose aujourd'hui, la plus légère.",
      "Découpe ta tâche en étapes de 5 minutes.",
      "Bois un grand verre d'eau et bouge 2 minutes avant de t'y mettre."
    ],
    humeur: [
      "Commence par une action qui te fait du bien, pas la plus « utile ».",
      "Note une chose, même petite, qui a été ok aujourd'hui.",
      "Accorde-toi de la douceur : tu n'as pas à être au top pour avancer."
    ],
    clarte: [
      "Vide ta tête sur papier avant de décider quoi que ce soit.",
      "Choisis UNE priorité, range le reste pour plus tard.",
      "Évite les décisions importantes tant que le brouillard est là."
    ],
    elan: [
      "Amorce avec une micro-action de 2 minutes (juste démarrer).",
      "Relie la tâche à ton « pourquoi » : à quoi elle sert pour toi ?",
      "Promets-toi le droit d'arrêter après 10 minutes — souvent, l'élan vient."
    ]
  };

  // ---- Bibliothèque psychoéducative courte ----
  var BIBLIO = [
    {
      id: "charge-mentale", titre: "La charge mentale, c'est quoi ?", emoji: "🧺", duree: "2 min",
      paras: [
        "La charge mentale, c'est tout ce que ton cerveau retient « au cas où » : penser à, anticiper, ne pas oublier. Invisible, mais épuisant.",
        "Elle sature la mémoire de travail — l'espace qui sert à réfléchir et décider. Résultat : on se sent débordée alors qu'on n'a « rien fait ».",
        "La sortir de ta tête (l'écrire, la déléguer, la planifier) libère de la puissance de cerveau pour ce qui compte vraiment."
      ]
    },
    {
      id: "energie-cyclique", titre: "Ton énergie n'est pas linéaire", emoji: "🔄", duree: "2 min",
      paras: [
        "On attend de soi la même énergie chaque jour. Mais l'énergie est cyclique : selon le sommeil, les hormones, le stress, les saisons.",
        "Travailler « contre » son rythme coûte très cher. Travailler « avec » (tâches exigeantes les bons jours, tâches mécaniques les jours bas) change tout.",
        "Suivre ton énergie sur plusieurs semaines te révèle TON rythme — pas celui des autres."
      ]
    },
    {
      id: "procrastination", titre: "Procrastiner = un problème d'émotion", emoji: "⏳", duree: "2 min",
      paras: [
        "On croit que procrastiner est un manque de discipline. En réalité, c'est souvent une émotion qu'on évite : peur de mal faire, ennui, surcharge.",
        "Le cerveau fuit l'inconfort lié à la tâche, pas la tâche elle-même.",
        "La clé n'est pas « plus de volonté », mais réduire l'inconfort : rendre la première étape ridiculement petite, et accueillir l'émotion au lieu de lutter."
      ]
    },
    {
      id: "perfectionnisme", titre: "Le perfectionnisme qui bloque", emoji: "🎯", duree: "2 min",
      paras: [
        "Le perfectionnisme promet la sécurité (« si c'est parfait, on ne pourra rien me reprocher »). Mais il fige : on n'ose pas finir, ni montrer.",
        "« Fait » vaut mieux que « parfait » : un projet imparfait qui existe sert plus qu'un projet parfait qui reste dans ta tête.",
        "Vise le « assez bien pour aujourd'hui ». Tu pourras toujours améliorer ensuite."
      ]
    },
    {
      id: "mode-crise", titre: "Quand tout déborde : le mode crise", emoji: "🆘", duree: "1 min",
      paras: [
        "Certains jours, ce n'est pas le moment de « bien faire » : c'est le moment de traverser.",
        "En mode crise, l'objectif n'est plus de produire, mais de te stabiliser : respirer, réduire les stimulations, te poser une seule micro-action.",
        "Tu n'as rien à prouver dans ces moments. Mettre l'activité en pause est une décision sage, pas un échec."
      ]
    },
    {
      id: "valeur-rendement", titre: "Ta valeur n'est pas ton rendement", emoji: "💛", duree: "1 min",
      paras: [
        "L'entrepreneuriat pousse à confondre ce qu'on fait et ce qu'on vaut. Un jour « peu productif » devient « je ne vaux rien ».",
        "Ta valeur ne fluctue pas avec ta to-do list. Elle est stable, même les jours où tu ne produis rien.",
        "Se le rappeler, c'est se protéger de l'épuisement et des décisions prises sous la honte."
      ]
    }
  ];

  // ---- Moteur : état du jour ----
  function moyenne(checkin) {
    var s = 0, n = 0;
    DIMENSIONS.forEach(function (d) { if (typeof checkin[d.cle] === "number") { s += checkin[d.cle]; n++; } });
    return n ? s / n : 0;
  }

  function etatDuJour(checkin) {
    var m = moyenne(checkin);
    if (m >= 4.2) return { score: m, label: "Belle énergie", emoji: "🌞", couleur: "#3a7d6e", message: "Profite de cette journée : c'est le moment d'avancer sur ce qui compte." };
    if (m >= 3.2) return { score: m, label: "Plutôt ok", emoji: "🌤️", couleur: "#4a7fa5", message: "Tu as de quoi avancer en douceur. Inutile d'en faire trop." };
    if (m >= 2.2) return { score: m, label: "Journée fragile", emoji: "🌥️", couleur: "#e8a33d", message: "Allège la barre aujourd'hui. Faire peu et bien, c'est déjà avancer." };
    return { score: m, label: "Jour bas", emoji: "🌧️", couleur: "#e26d5c", message: "Ce n'est pas le jour pour te pousser. Prends soin de toi en priorité." };
  }

  // ---- Moteur : recommandations adaptées au check-in ----
  function recommander(checkin) {
    var zonesChoisies = (checkin.zones || []).map(zoneParId).filter(Boolean);
    var recos = [];
    var priorites = [];

    // 1) Zones rouges cochées : prioritaires
    zonesChoisies.forEach(function (z) {
      (z.recos || []).forEach(function (r) { recos.push({ texte: r, source: z.nom, emoji: z.emoji }); });
    });

    // 2) Dimension la plus basse
    var basse = DIMENSIONS.slice().filter(function (d) { return typeof checkin[d.cle] === "number"; })
      .sort(function (a, b) { return checkin[a.cle] - checkin[b.cle]; })[0];
    if (basse && checkin[basse.cle] <= 3) {
      RECOS_DIM[basse.cle].forEach(function (r) { recos.push({ texte: r, source: basse.nom, emoji: basse.emoji }); });
    }

    // 3) Priorités du jour (1 à 3 selon l'état)
    var etat = etatDuJour(checkin);
    var nb = etat.score >= 4.2 ? 3 : etat.score >= 3.2 ? 2 : 1;
    var modeles = [
      "Avancer un peu sur ce qui compte le plus pour toi",
      "Boucler une chose en attente (pour la sortir de ta tête)",
      "T'accorder un vrai temps de récupération"
    ];
    if (etat.score < 2.2) modeles = ["Traverser la journée en douceur — c'est l'objectif principal"];
    for (var i = 0; i < nb; i++) priorites.push(modeles[i]);

    // 4) Message de soutien contextualisé
    var soutien = etat.message;
    if (zonesChoisies.length) soutien = zonesChoisies[0].soutien;

    // Dédoublonnage léger des recos, max 4
    var vues = {}, propres = [];
    recos.forEach(function (r) { if (!vues[r.texte]) { vues[r.texte] = 1; propres.push(r); } });
    return { priorites: priorites, recos: propres.slice(0, 4), soutien: soutien, etat: etat, zones: zonesChoisies };
  }

  function zoneParId(id) { return ZONES.filter(function (z) { return z.id === id; })[0]; }

  // ---- Zone rouge supplémentaire : choc émotionnel ----
  // (Inspirée des ressources « Se remettre d'un choc émotionnel ».)
  ZONES.push({
    id: "choc", nom: "Choc émotionnel", emoji: "💔", couleur: "#7f8c8d",
    intro: "Un choc émotionnel (perte, rupture, mauvaise nouvelle, événement bouleversant) est une réaction intense et NORMALE. Le corps et l'esprit ont besoin de temps pour encaisser — ce n'est pas le moment de « performer ».",
    signes: ["Engourdissement, sensation d'irréalité", "Cœur qui s'emballe, sommeil perturbé", "Difficulté à se concentrer, à décider", "Vagues d'émotion imprévisibles"],
    cequiaide: ["Réduire au strict minimum les exigences", "Sommeil, douceur, nature", "Du lien : ne pas rester seule", "S'autoriser à ne rien décider d'important"],
    aeviter: ["Te forcer à « faire comme si »", "Prendre de grandes décisions à chaud", "T'isoler complètement"],
    soutien: "Ce que tu traverses est une réaction humaine normale à un événement anormal. Sois patiente et douce avec toi : la traversée prend le temps qu'elle prend.",
    consulter: true,
    recos: ["Aujourd'hui : juste prendre soin de ton corps (manger, dormir, respirer).", "Reporte toute décision importante à plus tard.", "Si les symptômes s'installent dans le temps, fais-toi accompagner."]
  });

  // ---- Bibliothèque émotions : comprendre les 6 émotions de base ----
  // Cadre : émotion = signal utile (déclencheur → fonction). Source d'inspiration :
  // « Gérer ses émotions » & le tableau du processus émotionnel.
  var EMOTIONS = [
    { id: "colere", nom: "La colère", emoji: "🌋", couleur: "#e26d5c",
      declencheur: "Une frustration, une injustice ressentie, une limite franchie.",
      fonction: "Elle signale qu'une de tes limites ou de tes valeurs n'a pas été respectée. Elle te donne l'énergie de te défendre ou de poser un cadre.",
      aide: ["Mettre une pause AVANT d'agir ou d'écrire (l'impulsion retombe en quelques minutes)", "Bouger, respirer, boire de l'eau fraîche", "Identifier la limite touchée : « de quoi ai-je besoin ? »", "Reporter la réponse à tête reposée"] },
    { id: "peur", nom: "La peur", emoji: "⚡", couleur: "#4a7fa5",
      declencheur: "Un danger ou une menace, réels ou anticipés (peur de l'échec, du jugement).",
      fonction: "Elle augmente ta vigilance pour te protéger. En entrepreneuriat, elle pointe souvent un enjeu qui compte vraiment pour toi.",
      aide: ["Distinguer le danger réel de l'anticipation (« qu'est-ce qui est vrai MAINTENANT ? »)", "Découper l'action redoutée en un tout petit premier pas", "Respiration lente pour calmer le corps", "Te rappeler tes réussites passées face à la peur"] },
    { id: "tristesse", nom: "La tristesse", emoji: "🌧️", couleur: "#6b7280",
      declencheur: "Une perte, une déception, un manque de reconnaissance.",
      fonction: "Elle appelle du soutien et invite à l'introspection. Elle ralentit pour permettre de digérer ce qui fait mal.",
      aide: ["Accueillir l'émotion sans lutter (elle passe par vagues)", "Réduire les exigences le temps de traverser", "Chercher du lien, parler à une personne de confiance", "Mouvement doux, lumière, sommeil"] },
    { id: "honte", nom: "La honte", emoji: "🙈", couleur: "#8a6bb0",
      declencheur: "Le sentiment de ne pas être à la hauteur, la peur du jugement, un écart à ses valeurs.",
      fonction: "Bien dosée, elle nous relie à nos valeurs. Excessive, elle paralyse et pousse à se cacher — surtout chez les entrepreneures perfectionnistes.",
      aide: ["Distinguer « j'ai fait une erreur » de « je suis nulle »", "Parler de la honte la désamorce (elle se nourrit du secret)", "Se rappeler que personne ne réussit sans rater", "Revenir à l'action concrète, petite et faisable"] },
    { id: "joie", nom: "La joie", emoji: "☀️", couleur: "#e8a33d",
      declencheur: "Un succès, une reconnaissance, un moment partagé, un sens retrouvé.",
      fonction: "Elle récompense, recharge et renforce les liens. Elle nourrit la motivation et la créativité — un carburant, pas un luxe.",
      aide: ["La savourer pleinement, même pour les petites victoires", "La noter (gratitude) pour la cultiver", "La partager avec ses proches", "S'en servir pour amorcer les tâches exigeantes"] },
    { id: "amour", nom: "L'amour / l'attachement", emoji: "💛", couleur: "#e29578",
      declencheur: "Un lien, de la tendresse, de l'admiration pour une personne, une cause, un projet.",
      fonction: "Il nourrit les relations, donne du sens et un sentiment de sécurité. C'est souvent le « pourquoi » profond derrière ton activité.",
      aide: ["Relier ton travail à ce que tu aimes profondément", "Prendre soin de tes liens autant que de tes tâches", "Repérer l'attachement excessif (dépendance au regard des autres)", "Cultiver la bienveillance envers toi-même aussi"] }
  ];

  // ---- Hygiène de vie : leviers concrets de soutien à l'humeur ----
  var HYGIENE = [
    { titre: "Sommeil", emoji: "🌙", texte: "Le sommeil régule les émotions. Un coucher régulier, sans écran, et une tisane apaisante (camomille, tilleul, mélisse) aident le corps à récupérer." },
    { titre: "Bouger", emoji: "🚶‍♀️", texte: "Même 30 min de marche libèrent des endorphines et font baisser le cortisol (hormone du stress). L'activité douce vaut mieux que rien." },
    { titre: "Assiette", emoji: "🥗", texte: "Magnésium (amandes, chocolat noir, épinards), oméga-3 (poissons gras, lin) et tryptophane (œufs, dattes, banane) soutiennent l'humeur. On limite l'excès de café et de sucre." },
    { titre: "Lien", emoji: "🤝", texte: "Partager ce qu'on traverse avec une personne de confiance allège la charge. S'entourer de bienveillance et limiter les relations qui épuisent." }
  ];

  // ---- Couche spirituelle OPTIONNELLE (désactivée par défaut) ----
  // Respecte le choix de l'utilisatrice : n'apparaît que si elle l'active.
  // Inspirée des ressources transmises (Coran, Sounna, du'a de réconfort).
  var SPIRITUEL = {
    intro: "Un appui spirituel facultatif, dans la tradition de la patience (sabr) et de la confiance en Dieu (tawakkul). À activer seulement si cela te fait du bien.",
    rappels: [
      { ref: "Sourate Ash-Sharh (94:5-6)", texte: "« Certes, avec la difficulté vient la facilité. »", note: "Les épreuves ne sont pas éternelles." },
      { ref: "Sourate Al-Baqarah (2:286)", texte: "« Allah n'impose à aucune âme une charge supérieure à sa capacité. »", note: "Ce que tu portes est à ta mesure, même quand c'est lourd." },
      { ref: "Sourate Ar-Ra'd (13:28)", texte: "« N'est-ce pas par le rappel d'Allah que se tranquillisent les cœurs ? »", note: "Le dhikr apaise le cœur agité." },
      { ref: "Du'a de l'apaisement", texte: "« Allahumma la sahla illa ma ja'altahu sahla… » — Ô Allah, il n'y a de facile que ce que Tu rends facile.", note: "À répéter quand une tâche paraît une montagne." },
      { ref: "Du'a de la confiance", texte: "« Hasbiya Allah wa ni'ma al-wakil » — Allah me suffit, Il est le meilleur garant.", note: "Pour relâcher ce qui ne dépend pas de toi." }
    ],
    hadith: "« L'affaire du croyant est étonnante : tout ce qui lui arrive est un bien. » (Muslim) — patience dans l'épreuve, gratitude dans le bonheur."
  };

  // ---- Les 6 biais cognitifs (TCCI · Voie Chifâ, méthode en 5 étapes) ----
  // Un biais n'est PAS un défaut moral : c'est un raccourci mental.
  var BIAIS = [
    { id: "catastrophisme", famille: "Menace & certitude", nom: "Le catastrophisme", emoji: "🌪️",
      desc: "L'esprit saute au pire scénario et le vit déjà comme réel. Une difficulté gérable devient un danger énorme.",
      exemple: "« Si je me trompe, c'est grave. » → anxiété → évitement → la peur se renforce.",
      piste: "Reviens au fait brut : qu'est-ce qui est vrai, là, maintenant ? Le pire imaginé n'est pas advenu." },
    { id: "prediction", famille: "Menace & certitude", nom: "La prédiction négative", emoji: "🔮",
      desc: "Une certitude d'échec posée sur l'avenir : « je vais échouer, c'est sûr. » Or nul ne connaît l'avenir.",
      exemple: "« À quoi bon ? » → on cesse de se préparer → l'échec devient plus probable (prophétie auto-réalisatrice).",
      piste: "Remplace « je vais échouer » par « je ne connais pas le résultat ; je fais ma part, et je remets l'issue. »" },
    { id: "lecture", famille: "Social & relation", nom: "La lecture de pensée", emoji: "💭",
      desc: "Croire savoir ce que l'autre pense — en mal — sans aucune preuve. Un silence devient un jugement.",
      exemple: "« Il me juge. » → retrait ou attaque → la relation se dégrade réellement.",
      piste: "Seul le réel sait. Et si l'autre était juste fatigué, pressé, préoccupé ? Vérifie avant de conclure." },
    { id: "personnalisation", famille: "Social & relation", nom: "La personnalisation", emoji: "🎯",
      desc: "Rapporter à soi tout ce qui arrive de négatif : « c'est à cause de moi », même pour ce qui ne dépend pas de soi.",
      exemple: "Un rendez-vous annulé → « c'est moi le problème » → rumination → l'estime s'érode.",
      piste: "Liste les autres causes possibles (fatigue, agenda, imprévu de l'autre). Tu n'es pas le centre de tout." },
    { id: "toutourien", famille: "Rigidité & auto-jugement", nom: "La pensée tout ou rien", emoji: "⚫⚪",
      desc: "Parfait ou nul, sans entre-deux. Or la vraie vie se déroule presque entièrement dans la nuance.",
      exemple: "« Si ce n'est pas parfait, c'est nul. » → abandon d'un projet pourtant en bonne voie.",
      piste: "Vise le « assez bien pour aujourd'hui ». Fait vaut mieux que parfait. Le perfectionnisme fabrique l'inachevé." },
    { id: "exigences", famille: "Rigidité & auto-jugement", nom: "Les exigences tyranniques", emoji: "⛓️",
      desc: "« Je devrais », « il faut », « je dois absolument » — même quand le corps crie sa fatigue. Un règlement intérieur impitoyable.",
      exemple: "« Je dois tout faire. » → on continue malgré l'épuisement → risque de burn-out.",
      piste: "Cette voix n'est pas toi : souvent un héritage. Un héritage, ça se trie. L'effort juste respecte tes limites." }
  ];

  // ---- Les 5 questions de clarification (clarifier ≠ se rassurer) ----
  var QUESTIONS_CLARIF = [
    "Quel est le fait exact ? (ce qu'une caméra aurait filmé, sans interprétation)",
    "Quelle est mon interprétation ? (la pensée mot pour mot)",
    "Quelles preuves la soutiennent, ou la contredisent ?",
    "Quelle lecture plus nuancée est plausible ?",
    "Cette pensée m'aide-t-elle à agir, ou me bloque-t-elle ?"
  ];

  // Articles supplémentaires (TCCI, dissonance, trauma, neuroplasticité)
  BIBLIO.push(
    {
      id: "biais", titre: "Les 6 biais cognitifs (et comment les repérer)", emoji: "🧩", duree: "3 min",
      paras: [
        "Un biais cognitif n'est pas un défaut moral, ni un manque de foi : c'est un raccourci mental que l'esprit prend sous stress, fatigue, ou insécurité. Le voir sans honte, c'est déjà commencer à s'en libérer.",
        "Trois familles : la MENACE & CERTITUDE (catastrophisme, prédiction négative) ; le SOCIAL & RELATION (lecture de pensée, personnalisation) ; la RIGIDITÉ & AUTO-JUGEMENT (pensée tout ou rien, exigences tyranniques).",
        "Le journal des pensées (méthode en 5 étapes) te permet de les attraper un par un, dans le quotidien — c'est là, dans les petites situations, que le changement commence."
      ]
    },
    {
      id: "methode5", titre: "La méthode en 5 étapes", emoji: "🪜", duree: "2 min",
      paras: [
        "Ce n'est ni de la pensée positive, ni de l'auto-suggestion. On ne se répète pas « je vais réussir » : on OBSERVE, et c'est le réel qui parle.",
        "1) Le fait exact (sans interprétation). 2) La pensée, mot pour mot. 3) L'émotion, cotée de 0 à 10. 4) Le comportement (ce que j'ai fait ou évité). 5) La conséquence sur ma vie.",
        "Répétée d'une situation à l'autre, cette chaîne rend le biais visible — et la prise de conscience vient d'elle-même. Clarifier n'est pas se rassurer : c'est trouver une pensée plus juste, plus précise, qui permet d'agir."
      ]
    },
    {
      id: "dissonance", titre: "La dissonance : quand quelque chose tire à contre-sens", emoji: "🧭", duree: "2 min",
      paras: [
        "La dissonance, c'est la tension inconfortable quand deux choses qui t'habitent ne s'accordent pas : une valeur et un comportement, deux loyautés, l'image de toi et la façon dont tu agis.",
        "Ce malaise n'est pas un défaut : c'est un signal. Il pointe presque toujours un endroit où tes actes et tes valeurs profondes se sont éloignés.",
        "Pour l'apaiser, en douceur : NOMMER (« qu'est-ce qui, en moi, tire en deux sens ? »), DISTINGUER (ma valeur réelle vs. le comportement qui s'en éloigne), RÉALIGNER (un petit pas concret pour que mes actes rejoignent ce qui compte). La cohérence se reconstruit geste après geste."
      ]
    },
    {
      id: "trauma", titre: "Le trauma et le cerveau : ce n'est pas une faiblesse", emoji: "🧠", duree: "3 min",
      paras: [
        "Un trauma est une vraie blessure, pas un défaut de caractère. Face à un danger, le cerveau bascule en « voie rapide » (amygdale, instinct de survie) et déconnecte le cerveau conscient : c'est un mécanisme de protection.",
        "Les causes les plus fréquentes ne sont pas spectaculaires : ce sont souvent le rejet répété, la solitude, la négligence affective, les invalidations. Ces « traumas silencieux » laissent des traces réelles.",
        "Conséquences fréquentes : mémoire fragmentée, difficulté à mettre des mots, souffrance qui semble toujours présente. Le silence n'est pas un choix, c'est un symptôme.",
        "Bonne nouvelle : grâce à la neuroplasticité, le cerveau peut se reconstruire. Un accompagnement adapté (TCC, EMDR, thérapie des chocs…) peut renouer ce que le trauma a abîmé. Si tu te reconnais ici, fais-toi accompagner : tu le mérites."
      ]
    },
    {
      id: "neuroplasticite", titre: "Tu peux changer : la neuroplasticité", emoji: "🌱", duree: "2 min",
      paras: [
        "Longtemps, on a cru le cerveau adulte figé. Faux : il se remodèle toute la vie. Chaque expérience, chaque pensée répétée laisse une trace physique. « Les neurones qui s'activent ensemble se connectent ensemble. »",
        "Cela veut dire que tes schémas de pensée les plus anciens ne sont pas une fatalité : à force de petites répétitions régulières, une lecture plus juste peut devenir, elle aussi, automatique.",
        "Le changement est graduel, irrégulier, jamais parfait — il y aura des jours de rechute, et ce n'est pas un retour à zéro. Le repère n'est pas la perfection, mais la constance des petits pas. Tes trois alliés : la répétition espacée, le sommeil, et un climat émotionnel bienveillant envers toi-même."
      ]
    }
  );

  BIBLIO.push(
    {
      id: "radar", titre: "Le radar de perception : entre l'événement et toi", emoji: "📡", duree: "2 min",
      paras: [
        "Entre un événement et ton émotion, il y a toujours un filtre : ta perception. L'enchaînement est ÉVÉNEMENT → PERCEPTION → ÉMOTION → PENSÉE. Ce n'est pas l'événement qui te fait souffrir, mais la lecture que tu en fais.",
        "Ton cerveau fonctionne en trois étages : l'archaïque (survie, respiration), le limbique (émotions, mémoire affective) et le néocortex (réflexion). Sous le coup d'une émotion forte, le limbique prend le dessus et le raisonnement passe au second plan — c'est normal, pas un défaut.",
        "Le levier de changement n'est donc pas « se forcer à penser positif », mais ajuster la PERCEPTION. Le même retard d'un client peut se lire « il me méprise » ou « il a eu un imprévu ». Changer la lecture change l'émotion — et c'est exactement le travail du journal des pensées."
      ]
    },
    {
      id: "discipline", titre: "Discipline douce : l'effet cumulé plutôt que le pic de motivation", emoji: "🌊", duree: "2 min",
      paras: [
        "La motivation est un pic : intense, puis ça retombe — et on s'en veut. La discipline douce, elle, mise sur de tout petits gestes réguliers. Ce n'est pas se tyranniser : c'est se rendre les choses faciles et constantes.",
        "C'est l'effet cumulé : une micro-action répétée vaut bien plus qu'un grand élan suivi d'un long arrêt. « Les œuvres les plus aimées sont les plus constantes, même modestes. » Ton cerveau, lui aussi, renforce ce que tu répètes.",
        "Et quand l'émotion déborde : RELATIVISE (imagine le pire scénario réaliste — souvent il est survivable, et ça dédramatise) et repère la SPIRALE (tristesse → découragement → désespoir). Plus tôt tu la nommes, plus tôt tu peux la couper avec une micro-action ou un appui."
      ]
    }
  );

  window.Data = {
    DIMENSIONS: DIMENSIONS, ZONES: ZONES, BIBLIO: BIBLIO,
    EMOTIONS: EMOTIONS, HYGIENE: HYGIENE, SPIRITUEL: SPIRITUEL,
    BIAIS: BIAIS, QUESTIONS_CLARIF: QUESTIONS_CLARIF,
    etatDuJour: etatDuJour, recommander: recommander, moyenne: moyenne, zoneParId: zoneParId
  };
})();
