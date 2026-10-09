// ════════════════════════════════════════════════════════════
// Boussole intérieure — bilan doux en 5 axes.
// Ce n'est pas une note : c'est un reflet, pour voir où poser son attention.
// 100% local, aucun jugement, aucune mesure de la foi.
// ════════════════════════════════════════════════════════════

export const ECHELLE = ["Pas du tout", "Un peu", "Moyennement", "Beaucoup", "Tout à fait"];

export interface Item {
  t: string;
  r: boolean; // reformulation « inversée » : approuver signale une zone tendue
}

export interface Axe {
  nom: string;
  court: string;
  sub: string;
  items: Item[];
  interp: { bas: string; moyen: string; haut: string };
}

export const AXES: Axe[] = [
  {
    nom: "Équilibre du corps",
    court: "Corps",
    sub: "Sommeil, énergie, alimentation, mouvement.",
    items: [
      { t: "Je dors assez et mon sommeil me repose.", r: false },
      { t: "J'ai de l'énergie pour traverser mes journées.", r: false },
      { t: "Il m'arrive de sauter des repas ou de manger de façon irrégulière.", r: true },
      { t: "Je bouge ou je marche autant que j'en aurais besoin.", r: false },
    ],
    interp: {
      bas: "Ton corps réclame de l'attention : le sommeil, l'énergie ou les repas semblent fragilisés. C'est souvent le premier levier — quelques repères simples peuvent déjà tout alléger.",
      moyen: "Ton équilibre corporel tient, avec des zones à consolider. Une régularité un peu plus tenue (sommeil, repas, mouvement) suffirait à gagner en stabilité.",
      haut: "Ton corps est un appui : de bonnes habitudes te soutiennent déjà. C'est une base solide sur laquelle le reste peut s'adosser.",
    },
  },
  {
    nom: "Équilibre émotionnel",
    court: "Émotions",
    sub: "Accueillir et réguler ce qui se vit en soi.",
    items: [
      { t: "J'arrive à reconnaître et nommer ce que je ressens.", r: false },
      { t: "Mes émotions me submergent plus que je ne le voudrais.", r: true },
      { t: "Quand une émotion forte monte, je sais m'apaiser.", r: false },
      { t: "Je garde mes émotions pour moi jusqu'à ce qu'elles débordent.", r: true },
    ],
    interp: {
      bas: "Les émotions semblent parfois te déborder ou rester enfermées. Apprendre à les nommer et à les accueillir, doucement, peut te rendre beaucoup d'air.",
      moyen: "Tu sais reconnaître ce qui te traverse, même si certaines vagues restent difficiles à apaiser. Un ou deux outils de régulation renforceraient cet équilibre.",
      haut: "Tu accueilles et régules bien ce qui se vit en toi. C'est une ressource précieuse, à honorer.",
    },
  },
  {
    nom: "Stress & rapport au regard",
    court: "Stress",
    sub: "Face à la pression, à l'évaluation, au jugement.",
    items: [
      { t: "L'idée d'être jugé(e) ou évalué(e) me tend à l'avance.", r: true },
      { t: "Avant un rendez-vous important, l'anticipation m'envahit.", r: true },
      { t: "Je me sens capable de traverser les moments de pression.", r: false },
      { t: "Le regard des autres pèse sur ce que je pense de moi.", r: true },
    ],
    interp: {
      bas: "C'est ici que ça se tend le plus : l'anticipation et la peur du regard pèsent. Ce n'est pas une fatalité — ce nœud se travaille, et des appuis concrets existent.",
      moyen: "Le stress est présent sans t'envahir en permanence. Des rituels courts avant les moments sensibles pourraient désamorcer l'anticipation.",
      haut: "Tu traverses la pression avec une bonne solidité intérieure. Le regard des autres n'a pas le dernier mot sur toi — c'est un bel ancrage.",
    },
  },
  {
    nom: "Lien & entourage",
    court: "Lien",
    sub: "Soutien, appartenance, qualité des liens.",
    items: [
      { t: "Je peux compter sur des personnes de confiance.", r: false },
      { t: "Je me sens seul(e) face à mes épreuves.", r: true },
      { t: "Je me sens à ma place dans mes liens (famille, amis).", r: false },
      { t: "J'évite de demander de l'aide, même quand j'en aurais besoin.", r: true },
    ],
    interp: {
      bas: "Le sentiment de solitude ou la difficulté à demander de l'aide ressort. Nourrir un lien de confiance, oser tendre la main, peut changer beaucoup.",
      moyen: "Tu as des liens sur lesquels t'appuyer, avec parfois une réserve à demander. Cultiver ces appuis renforcerait ton sentiment d'être portée.",
      haut: "Tu te sens entourée et à ta place dans tes liens. Ce soutien est une richesse — un vrai socle dans l'épreuve.",
    },
  },
  {
    nom: "Ancrage spirituel",
    court: "Ancrage",
    sub: "Ressenti d'appui intérieur — jamais une mesure de la foi.",
    items: [
      { t: "Dans mes moments difficiles, l'évocation d'Allāh (dhikr) m'apaise.", r: false },
      { t: "Je ressens de la sakīna — une tranquillité intérieure — au moins par moments.", r: false },
      { t: "Face à l'épreuve, j'ai du mal à m'en remettre à Allāh (tawakkul).", r: true },
      { t: "Ma foi me donne du sens et un appui dans le quotidien.", r: false },
    ],
    interp: {
      bas: "L'appui spirituel semble moins accessible en ce moment — cela arrive dans les traversées difficiles, et ne dit rien de la valeur de ta foi. Renouer un petit geste régulier (un dhikr, un instant de calme) peut rouvrir la sakīna.",
      moyen: "Ta foi t'offre un appui, présent par moments. L'ancrer dans un rendez-vous quotidien, même bref, en ferait une ressource plus stable dans la tempête.",
      haut: "Ton ancrage spirituel est vivant : le dhikr t'apaise, la sakīna t'habite, le tawakkul te porte. C'est un appui profond — protège-le, il porte le reste.",
    },
  },
];

// Score d'un axe → pourcentage 0-100 (plus haut = plus d'appui).
export function scoreAxe(reps: number[], axe: Axe, offset: number): number {
  let somme = 0;
  for (let i = 0; i < axe.items.length; i++) {
    const v = reps[offset + i];
    const val = axe.items[i].r ? 4 - v : v; // items inversés
    somme += val;
  }
  const max = axe.items.length * 4;
  return Math.round((somme / max) * 100);
}

export function niveau(pct: number): "bas" | "moyen" | "haut" {
  if (pct < 45) return "bas";
  if (pct < 67) return "moyen";
  return "haut";
}

export interface Bilan {
  scores: number[];  // un pourcentage par axe (même ordre que AXES)
  global: number;    // moyenne
  iMax: number;      // axe le plus haut (appui)
  iMin: number;      // axe le plus bas (zone tendue)
}

export function calculerBilan(reps: number[]): Bilan {
  const scores = AXES.map((a, idx) => scoreAxe(reps, a, idx * 4));
  const global = Math.round(scores.reduce((s, x) => s + x, 0) / scores.length);
  let iMax = 0, iMin = 0;
  scores.forEach((s, i) => {
    if (s > scores[iMax]) iMax = i;
    if (s < scores[iMin]) iMin = i;
  });
  return { scores, global, iMax, iMin };
}
