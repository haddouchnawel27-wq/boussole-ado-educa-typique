// ════════════════════════════════════════════════════════════
// Espace « Comprendre & régler » — contenus psychoéducatifs.
// Portés fidèlement depuis l'Al Mizan original. Aucun diagnostic ;
// des repères pour mieux se comprendre, en douceur.
// ════════════════════════════════════════════════════════════

// ---------- Mini-audit « Mon mode d'organisation » (12 points) ----------
export const ORGA_SCALE = ["Pas du tout", "Plutôt non", "Moyennement", "Plutôt oui", "Tout à fait"];

export interface OrgaQ { t: string; rev: boolean }
export interface OrgaCat { key: string; label: string; emoji: string; qs: OrgaQ[] }

export const ORGA_CATS: OrgaCat[] = [
  { key: "mentale", label: "Charge mentale", emoji: "🧠", qs: [
    { t: "Je pense à mon activité en dehors de mes horaires de travail.", rev: true },
    { t: "J'ai l'impression de devoir tout retenir seule.", rev: true },
    { t: "L'administratif me fatigue rapidement.", rev: true },
  ] },
  { key: "orga", label: "Organisation", emoji: "🗂️", qs: [
    { t: "Je sais distinguer l'urgent de l'important.", rev: false },
    { t: "J'ai un système simple pour noter, suivre et retrouver mes informations.", rev: false },
    { t: "Mes outils m'aident plus qu'ils ne m'encombrent.", rev: false },
  ] },
  { key: "energie", label: "Énergie", emoji: "🌿", qs: [
    { t: "Je connais mes moments de meilleure concentration.", rev: false },
    { t: "Mon organisation tient même quand je suis fatiguée.", rev: false },
    { t: "Je récupère correctement après une période intense.", rev: false },
  ] },
  { key: "posture", label: "Posture d'indépendante", emoji: "🧭", qs: [
    { t: "Je me sens souvent seule à prendre les décisions.", rev: true },
    { t: "Je culpabilise quand je ralentis.", rev: true },
    { t: "Je sais poser des limites à mon activité.", rev: false },
  ] },
];

export interface OrgaTier { min: number; key: string; label: string; color: string; summary: string; advice: string[] }
// Score /60. Plus haut = plus faible surcharge.
export const ORGA_GLOBAL: OrgaTier[] = [
  { min: 48, key: "faible", label: "Surcharge faible", color: "#5C7355",
    summary: "Ton fonctionnement est globalement stable. Garde tes repères et surveille les périodes ponctuelles d'accumulation.",
    advice: ["Maintiens tes routines actuelles", "Planifie un point hebdo de 20 min", "Repère tôt les signes d'accumulation (fatigue, irritabilité)"] },
  { min: 36, key: "moderee", label: "Surcharge modérée", color: "#7E6229",
    summary: "Ton organisation tient, mais elle te demande de l'énergie régulièrement. Quelques ajustements ciblés peuvent te soulager vite.",
    advice: ["Clarifie 3 priorités par semaine", "Rassemble tes notes dans un seul outil", "Automatise une tâche admin récurrente"] },
  { min: 24, key: "elevee", label: "Surcharge élevée", color: "#8C4A38",
    summary: "Ton système te coûte beaucoup d'effort mental. La priorité : simplifier et externaliser tes informations.",
    advice: ["Choisis un seul outil central", "Limite ta to-do du jour à 3 actions", "Automatise ou délègue l'administratif"] },
  { min: 0, key: "tres", label: "Surcharge très élevée", color: "#8C4A38",
    summary: "Ton niveau de surcharge paraît important. Réduis dès maintenant les sollicitations et protège tes temps de récupération.",
    advice: ["Mets en pause les tâches non essentielles", "Externalise ou demande de l'aide pour l'administratif", "Installe une routine de déconnexion stricte"] },
];

// ---------- Fiches & zones « Comprendre » ----------
export interface FicheCard { e: string; t: string; a: string; b?: string; c: string }
export interface FicheSection { h: string; items: string[] }
export interface Fiche {
  id: string;
  emoji: string;
  titre: string;
  sous: string;
  tag?: string;
  intro: string;
  cards?: FicheCard[];
  sections?: FicheSection[];
  cta?: string;
  note?: string;
}

export const FICHES: Fiche[] = [
  {
    id: "emotions", emoji: "🫧", titre: "Tes émotions", sous: "déclencheur · fonction · ce qui aide",
    intro: "Les émotions ne sont pas tes ennemies : ce sont des messagères. Chacune porte un besoin. Les écouter — sans t'y noyer — t'aide à comprendre ce qui se joue, souvent là où se trouve le nœud.",
    cards: [
      { e: "🔥", t: "Colère", a: "Déclencheur : une limite franchie, une injustice.", b: "Fonction : protéger ce qui compte pour toi.", c: "Ce qui aide : nommer le besoin derrière, respirer avant d'agir." },
      { e: "😨", t: "Peur", a: "Déclencheur : un danger perçu, connu ou imaginé.", b: "Fonction : te mettre en sécurité.", c: "Ce qui aide : distinguer danger réel / supposé, revenir au corps." },
      { e: "💧", t: "Tristesse", a: "Déclencheur : une perte, un manque.", b: "Fonction : ralentir, intégrer, faire le deuil.", c: "Ce qui aide : t'autoriser à pleurer, demander du réconfort." },
      { e: "🫥", t: "Honte", a: "Déclencheur : se sentir « pas à la hauteur ».", b: "Fonction : préserver le lien aux autres.", c: "Ce qui aide : te rappeler — ressentir ≠ être. En parler à une personne sûre." },
      { e: "☀️", t: "Joie", a: "Déclencheur : un besoin nourri.", b: "Fonction : signaler ce qui est bon pour toi.", c: "Ce qui aide : savourer, prolonger, remercier (al-ḥamdu lillāh)." },
      { e: "🤍", t: "Amour", a: "Déclencheur : un lien, une présence.", b: "Fonction : relier, prendre soin.", c: "Ce qui aide : l'exprimer, et le recevoir sans avoir à le mériter." },
    ],
  },
  {
    id: "biais", emoji: "🪞", titre: "Les 6 biais", sous: "repérer les pièges de pensée",
    intro: "Les biais sont des raccourcis de pensée qui déforment la réalité. Les repérer, ce n'est pas se juger — c'est retrouver une lecture plus juste. Clarifier n'est pas se rassurer.",
    cards: [
      { e: "🌩️", t: "Catastrophisme", a: "Imaginer le pire scénario comme s'il était certain.", c: "Recadrage : « Quelle est l'issue la plus probable, pas la plus effrayante ? »" },
      { e: "🔮", t: "Prédiction", a: "Croire qu'on connaît déjà l'avenir.", c: "Recadrage : « Je ne peux pas le savoir — restons aux faits d'aujourd'hui. »" },
      { e: "🧠", t: "Lecture de pensée", a: "Supposer ce que l'autre pense de toi.", c: "Recadrage : « Ai-je une preuve, ou seulement une interprétation ? »" },
      { e: "🎯", t: "Personnalisation", a: "Tout ramener à soi, se sentir responsable de tout.", c: "Recadrage : « Quelle est ma part réelle ? Quelles autres causes existent ? »" },
      { e: "⚫", t: "Tout-ou-rien", a: "Voir en noir ou blanc, tout réussi ou tout raté.", c: "Recadrage : « Où est la nuance, le “en partie” ? »" },
      { e: "⛓️", t: "Les exigences", a: "Les « je dois », « il faut » rigides envers toi-même.", c: "Recadrage : « Et si je remplaçais “je dois” par “j'aimerais” ? »" },
    ],
  },
  {
    id: "charge", emoji: "🧩", titre: "Charge mentale", sous: "alléger sans culpabiliser",
    intro: "La charge mentale, c'est le poids invisible de devoir tout penser, anticiper et retenir — souvent pour les autres. Elle fatigue avant même d'agir. La nommer, c'est déjà l'alléger.",
    sections: [
      { h: "Tu la reconnais à…", items: ["une tête qui ne s'arrête jamais, même au repos", "des oublis, des « il faut que je pense à… » en boucle", "une fatigue dès le réveil", "de l'irritabilité quand une demande de plus arrive"] },
      { h: "Ce qui aide vraiment", items: ["externaliser : tout déposer au même endroit (carnet, note), fini la mémoire", "déléguer pour de vrai — ou supprimer une tâche", "t'autoriser un « non » qui te protège", "un seul système simple, pas dix outils"] },
    ],
    cta: "Fais ton mini-bilan « Mon mode d'organisation » pour cibler ta priorité d'allègement.",
  },
  {
    id: "hygiene", emoji: "🌙", titre: "Hygiène de vie", sous: "sommeil · assiette · mouvement · lien",
    intro: "Le corps est un dépôt (amāna) que l'on honore avec douceur. Voici des repères de bien-être, mêlant bon sens et médecine prophétique — proposés avec douceur, jamais imposés.",
    sections: [
      { h: "🌙 Sommeil", items: ["se coucher tôt, peu après le ‘ishā, et se lever léger", "la sieste courte (qaylūla) en début d'après-midi répare", "dormir sur le côté droit, en état de pureté (wuḍū)", "repère moderne : couper les écrans avant le coucher, une heure régulière", "une tisane apaisante (camomille, tilleul, mélisse) aide le corps à récupérer"] },
      { h: "🍯 Assiette", items: ["la règle des tiers : « un tiers pour la nourriture, un tiers pour la boisson, un tiers pour le souffle » — ne pas manger à satiété", "commencer par Bismillāh, manger doucement, de la main droite", "des appuis cités : dattes, miel, eau, huile d'olive, graine de nigelle (ḥabba sawdā)", "repère moderne : des repas à heures régulières, sans écran", "soutiens de l'humeur : magnésium (amandes, épinards), oméga-3 (poissons gras, lin), tryptophane (œufs, dattes, banane) ; limite l'excès de café et de sucre"] },
      { h: "🚶‍♀️ Mouvement", items: ["bouger chaque jour, même un peu — la marche d'abord", "le corps aime le mouvement régulier plus que l'effort rare", "s'étirer, respirer, prendre l'air", "même 30 min de marche libèrent des endorphines et font baisser le cortisol (hormone du stress)"] },
      { h: "🤍 Lien", items: ["entretenir les liens (ṣilat ar-raḥim) apaise le cœur", "un contact sincère par jour suffit à rompre l'isolement", "demander de l'aide n'est pas une faiblesse"] },
    ],
    note: "Repères de bien-être inspirés de la médecine prophétique — ils ne remplacent ni un avis ni un suivi médical.",
  },
];

// ---------- Zones de turbulences (moments de vie) ----------
export const ZONES: Fiche[] = [
  { id: "premenstruel", emoji: "🌙", titre: "Phase prémenstruelle", sous: "", tag: "Cycle",
    intro: "Les jours qui précèdent les règles, l'énergie, l'humeur et la tolérance à la frustration baissent. Ce n'est pas « toi en moins bien » — c'est ton corps qui demande plus de douceur.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["irritabilité, sensibilité à fleur de peau", "fatigue, besoin de te replier", "pensées plus sombres que d'habitude"] },
      { h: "Ce qui aide", items: ["baisser tes attentes : ton corps travaille", "repos, chaleur, sucres lents", "reporter les décisions lourdes si tu peux"] },
      { h: "Ce qu'on évite de s'imposer", items: ["t'en demander autant qu'un autre jour", "prendre chaque émotion pour une vérité"] },
    ],
    note: "Ce passage revient, et il repart. Note tes jours bas sur ton cycle : tu t'y prépareras avec plus de tendresse." },
  { id: "fatigue", emoji: "😴", titre: "Fatigue", sous: "", tag: "Corps",
    intro: "Quand le corps est fatigué, le cerveau exécutif (planifier, décider, prioriser) tourne au ralenti. Ce n'est pas un manque de volonté.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["difficulté à te concentrer, à choisir", "tout paraît plus lourd", "irritabilité"] },
      { h: "Ce qui aide", items: ["une vraie pause, sans dette ni culpabilité", "réduire la liste à l'essentiel", "de l'eau, un repas, de l'air"] },
      { h: "Ce qu'on évite de s'imposer", items: ["compenser par plus de café et de pression", "te juger pour ton ralentissement"] },
    ],
    note: "Se reposer n'est pas perdre du temps : c'est réparer l'outil avec lequel tu travailles." },
  { id: "reprise", emoji: "🌱", titre: "Reprise progressive", sous: "", tag: "Transition",
    intro: "Après une pause (maladie, vacances, creux), reprendre à 100 % d'un coup mène souvent au mur. Le corps a besoin d'une rampe, pas d'une marche.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["impression d'être « rouillée »", "découragement devant ce qui s'est accumulé"] },
      { h: "Ce qui aide", items: ["reprendre à 60 %, pas à 100 %", "une seule priorité le premier jour", "célébrer les petits redémarrages"] },
      { h: "Ce qu'on évite de s'imposer", items: ["vouloir rattraper tout le retard en une fois"] },
    ],
    note: "Recommencer doucement, c'est déjà recommencer." },
  { id: "surcharge", emoji: "🧩", titre: "Surcharge", sous: "", tag: "Mental",
    intro: "Trop de choses, en même temps, dans la tête. La surcharge mentale brouille les priorités et fatigue avant même d'agir.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["tête saturée, pensées qui tournent", "oublis, sensation de courir partout"] },
      { h: "Ce qui aide", items: ["vider ta tête sur papier", "une seule chose à la fois", "un « non » qui te protège"] },
      { h: "Ce qu'on évite de s'imposer", items: ["ajouter un outil de plus", "tout vouloir tenir de mémoire"] },
    ],
    note: "Tu n'as pas à tout porter en même temps. Pose, trie, respire." },
  { id: "burnout", emoji: "🔥", titre: "Épuisement (burn-out)", sous: "", tag: "Sensible",
    intro: "L'épuisement professionnel n'est pas « un coup de mou ». C'est une fatigue profonde — physique, mentale, émotionnelle — qui s'installe quand on a trop donné, trop longtemps.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["un épuisement que le repos ne soulage plus", "détachement, perte de sens", "le moindre effort devient une montagne"] },
      { h: "Ce qui aide", items: ["ralentir vraiment, pas juste « un peu »", "oser demander de l'aide", "te faire accompagner par un professionnel"] },
      { h: "Ce qu'on évite de s'imposer", items: ["serrer les dents et continuer comme avant"] },
    ],
    note: "Le burn-out se soigne, et tu n'as pas à le traverser seule. En parler à un médecin ou un professionnel est une étape juste." },
  { id: "depression", emoji: "🌧️", titre: "Humeur dépressive", sous: "", tag: "Sensible",
    intro: "Quand l'élan vital s'éteint durablement, ce n'est pas de la fainéantise. La perte d'envie, de plaisir, d'énergie est un signal à prendre au sérieux, avec douceur.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["plus d'envie, plus de plaisir", "fatigue constante, sommeil perturbé", "pensées sombres, dévalorisation"] },
      { h: "Ce qui aide", items: ["de tout petits pas, un seul par jour", "lumière, mouvement doux, lien", "un avis médical ou psychologique"] },
      { h: "Ce qu'on évite de s'imposer", items: ["te reprocher de « ne pas y arriver »"] },
    ],
    note: "Si cela dure ou s'aggrave, parles-en à un professionnel de santé — c'est un acte de courage. En cas de pensées suicidaires : 3114 (24h/24)." },
  { id: "postpartum", emoji: "🍼", titre: "Post-partum", sous: "", tag: "Maternité",
    intro: "Après une naissance, le corps, les hormones et le sommeil sont bouleversés. Vouloir « redevenir comme avant » tout de suite ajoute une pression dont tu n'as pas besoin.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["fatigue extrême, émotions en montagnes russes", "sentiment d'être dépassée, culpabilité"] },
      { h: "Ce qui aide", items: ["accepter l'aide, déléguer sans honte", "dormir quand le bébé dort", "te nourrir, t'hydrater, t'entourer"] },
      { h: "Ce qu'on évite de s'imposer", items: ["te comparer, viser la perfection"] },
    ],
    note: "Si la tristesse s'installe au-delà de quelques semaines, parles-en : la dépression post-partum se soigne très bien." },
  { id: "menopause", emoji: "🌸", titre: "Ménopause / périménopause", sous: "", tag: "Cycle",
    intro: "Les variations hormonales peuvent agir sur l'énergie, le sommeil, la mémoire et l'humeur. Ce n'est pas « dans ta tête » — c'est une vraie transition.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["bouffées, sommeil haché, fatigue", "irritabilité, baisse de moral", "sensation de moins te reconnaître"] },
      { h: "Ce qui aide", items: ["respecter ton nouveau rythme", "mouvement doux, alimentation qui soutient", "en parler à un médecin si besoin"] },
      { h: "Ce qu'on évite de s'imposer", items: ["nier ou minimiser ce que tu vis"] },
    ],
    note: "C'est un passage, pas une fin. Beaucoup de femmes y retrouvent une forme de liberté nouvelle." },
  { id: "deuil", emoji: "🤍", titre: "Séparation / deuil", sous: "", tag: "Sensible",
    intro: "Une perte (rupture, décès, fin d'un cycle de vie) mobilise énormément d'énergie psychique. Le deuil n'est pas linéaire, et il a son propre rythme.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["vagues de tristesse, parfois de colère", "fatigue, perte de repères", "besoin de te retirer"] },
      { h: "Ce qui aide", items: ["laisser venir les émotions, sans les forcer", "t'appuyer sur un lien sûr", "des rituels doux pour honorer la perte"] },
      { h: "Ce qu'on évite de s'imposer", items: ["te fixer un délai pour « aller mieux »"] },
    ],
    note: "On ne « tourne pas la page » : on apprend à vivre avec. Sois patiente avec toi. Qu'Allāh facilite." },
  { id: "preaccouchement", emoji: "🪺", titre: "Préaccouchement", sous: "", tag: "Maternité",
    intro: "Les dernières semaines de grossesse demandent au corps une énergie immense. Préparer la naissance, c'est aussi se préparer intérieurement, en douceur.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["fatigue, lourdeur, sommeil difficile", "impatience mêlée d'appréhension"] },
      { h: "Ce qui aide", items: ["ralentir, déléguer, te reposer souvent", "préparer l'essentiel, lâcher le reste", "respiration, ancrage, du‘a d'apaisement"] },
      { h: "Ce qu'on évite de s'imposer", items: ["vouloir tout contrôler et tout finir"] },
    ],
    note: "Ton corps sait. Fais-lui confiance, un souffle après l'autre." },
  { id: "choc", emoji: "⚡", titre: "Choc émotionnel", sous: "", tag: "Sensible",
    intro: "Un choc émotionnel (perte, rupture, mauvaise nouvelle, événement bouleversant) est une réaction normale à une situation anormale. Le corps et l'esprit ont besoin de temps pour absorber.",
    sections: [
      { h: "Ce que tu peux ressentir", items: ["sidération, sensation d'irréel", "émotions fortes — ou, au contraire, engourdissement", "sommeil et appétit perturbés"] },
      { h: "Ce qui aide", items: ["revenir au corps : respirer, t'ancrer (5-4-3-2-1)", "ne pas rester seule, parler", "reporter les grandes décisions"] },
      { h: "Ce qu'on évite de s'imposer", items: ["te forcer à « être forte » tout de suite"] },
    ],
    note: "Si les symptômes persistent ou t'envahissent, un accompagnement (psychologue) aide à traverser. Le mode « Respirer » est là à tout moment." },
];

// ---------- Mini-articles « Lectures & repères » ----------
export interface Article { id: string; emoji: string; titre: string; min: string; paras: string[] }

export const ARTICLES: Article[] = [
  { id: "charge-mentale", emoji: "🧩", titre: "La charge mentale, c'est quoi ?", min: "2 min", paras: [
    "La charge mentale, c'est le travail invisible de penser, organiser et anticiper — souvent pour les autres autant que pour soi. Elle ne se voit pas, mais elle épuise.",
    "La soulager, c'est externaliser (tout poser quelque part), déléguer pour de vrai, et accepter que « bien » suffit. Tu n'as pas à tout tenir de mémoire.",
  ] },
  { id: "energie", emoji: "🔋", titre: "Ton énergie n'est pas linéaire", min: "2 min", paras: [
    "Ton énergie suit des cycles — dans la journée, dans le mois, dans la vie. Vouloir être au même niveau en permanence, c'est lutter contre ta nature.",
    "Repère tes pics (souvent le matin) et tes creux. Place le plus exigeant sur tes pics, protège tes creux. Travailler avec ton énergie fatigue moins que de la forcer.",
  ] },
  { id: "procrastination", emoji: "⏳", titre: "Procrastiner = un problème d'émotion", min: "2 min", paras: [
    "On croit que procrastiner, c'est de la paresse. C'est presque toujours une émotion : peur d'échouer, de mal faire, ennui, ou tâche trop floue.",
    "La clé n'est pas plus de discipline, mais de réduire l'émotion : découper en un premier pas minuscule (2 minutes) et clarifier ce qu'on attend vraiment de toi.",
  ] },
  { id: "perfectionnisme", emoji: "🎯", titre: "Le perfectionnisme qui bloque", min: "2 min", paras: [
    "Le perfectionnisme promet l'excellence et livre la paralysie : tant que ce n'est pas parfait, on ne montre rien, on ne finit rien.",
    "« Fait » vaut mieux que « parfait ». Vise le « suffisamment bien », fixe une limite de temps, et rappelle-toi : l'imperfection rend humain et accessible.",
  ] },
  { id: "mode-crise", emoji: "🆘", titre: "Quand tout déborde : le mode crise", min: "1 min", paras: [
    "Certains jours, l'objectif n'est pas d'avancer, mais de traverser. C'est légitime.",
    "Reviens au corps : respire lentement, ancre-toi (5-4-3-2-1), fais une seule micro-action, contacte une personne sûre. Le bouton « Respirer », en haut, est là pour ça.",
  ] },
  { id: "valeur", emoji: "💛", titre: "Ta valeur n'est pas ton rendement", min: "1 min", paras: [
    "Tu n'es pas une machine à produire. Ta valeur ne se mesure pas à ta liste cochée.",
    "Un jour bas ne te rend pas moins digne. Tu vaux pour ce que tu es, pas pour ce que tu fais.",
  ] },
  { id: "art-biais", emoji: "🪞", titre: "Les 6 biais cognitifs", min: "3 min", paras: [
    "Nos pensées prennent des raccourcis qui déforment la réalité : catastrophisme, prédiction, lecture de pensée, personnalisation, tout-ou-rien, et les « je dois » rigides.",
    "Les repérer, ce n'est pas se juger — c'est retrouver une lecture plus juste. La fiche « Les 6 biais » les détaille avec un recadrage pour chacun.",
  ] },
  { id: "methode-5", emoji: "🪜", titre: "La méthode en 5 étapes", min: "2 min", paras: [
    "Pour démêler une pensée qui fait mal : 1) le fait exact · 2) la pensée mot pour mot · 3) l'émotion + son intensité · 4) le comportement · 5) la conséquence — puis une lecture plus juste.",
    "Clarifier n'est pas se rassurer : c'est regarder les faits en face. L'onglet « Pensées » te guide pas à pas.",
  ] },
  { id: "dissonance", emoji: "↔️", titre: "La dissonance : quand quelque chose tire à contre-sens", min: "2 min", paras: [
    "La dissonance, c'est l'inconfort de faire ou vivre quelque chose qui va contre tes valeurs profondes. Le corps le ressent avant la tête.",
    "Plutôt que de l'étouffer, écoute-la : qu'est-ce qui n'est pas aligné ? Souvent, elle pointe un ajustement nécessaire, à faire en douceur.",
  ] },
  { id: "trauma", emoji: "🧠", titre: "Le trauma et le cerveau : ce n'est pas une faiblesse", min: "3 min", paras: [
    "Face à un événement qui dépasse nos ressources, le cerveau bascule en survie. Les réactions (sidération, hypervigilance, évitement) ne sont pas des faiblesses : ce sont des protections.",
    "Le trauma se travaille, et le cerveau peut se réparer. Un accompagnement adapté aide à dénouer ce qui reste figé — tu n'as pas à le porter seule.",
  ] },
  { id: "neuroplasticite", emoji: "🔄", titre: "Tu peux changer : la neuroplasticité", min: "2 min", paras: [
    "Le cerveau n'est pas figé : il se remodèle avec ce qu'on répète. Chaque petit geste nouveau trace, peu à peu, un nouveau chemin.",
    "C'est pourquoi la régularité compte plus que l'intensité. Tu n'es pas condamnée à tes vieux schémas — tu peux, doucement, en créer d'autres.",
  ] },
  { id: "radar", emoji: "📡", titre: "Le radar de perception : entre l'événement et toi", min: "2 min", paras: [
    "Entre ce qui arrive et ce que tu ressens, il y a une étape invisible : ta lecture de l'événement. Ce n'est pas la situation qui crée l'émotion, mais le sens qu'on lui donne.",
    "Bonne nouvelle : cette lecture peut s'assouplir. Changer l'interprétation, c'est changer le ressenti — sans nier la réalité.",
  ] },
  { id: "discipline", emoji: "🌱", titre: "Discipline douce : l'effet cumulé", min: "2 min", paras: [
    "La motivation est un feu de paille. Ce qui transforme, c'est l'effet cumulé : un petit geste, répété, jour après jour.",
    "La discipline douce ne se fait pas à la cravache : elle s'appuie sur des habitudes minuscules, tenables, et sur la bienveillance quand on manque un jour.",
  ] },
];

// Score global de l'audit → palier (score /60).
export function tierFor(score: number): OrgaTier {
  for (const t of ORGA_GLOBAL) if (score >= t.min) return t;
  return ORGA_GLOBAL[ORGA_GLOBAL.length - 1];
}
