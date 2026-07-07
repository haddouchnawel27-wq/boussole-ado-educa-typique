// Moteur générique de questionnaires : une structure de données = N questionnaires.
// Absorbe repérages, profils, bilans, anamnèse… Résultat = score + restitution DOUCE (jamais un diagnostic).
export interface Question {
  id: string;
  texte: string;
  min: number; // valeur basse (ex. 0)
  max: number; // valeur haute (ex. 4)
  minLabel: string;
  maxLabel: string;
}

export interface Band {
  upTo: number; // borne haute du ratio (0..1) pour cette bande
  titre: string;
  texte: string;
}

export interface Questionnaire {
  id: string;
  titre: string;
  univers: "educa" | "jannat";
  introU: string; // mode universel
  introI: string; // mode islamique
  questions: Question[];
  bands: Band[]; // restitution par paliers de ratio (score/scoreMax)
}

const ECH = { min: 0, max: 4, minLabel: "Pas du tout", maxLabel: "Tout à fait" };
const FREQ = { min: 0, max: 4, minLabel: "Jamais", maxLabel: "Tout le temps" };

export const QUESTIONNAIRES: Questionnaire[] = [
  {
    id: "boussole-entree",
    titre: "Boussole d'entrée — clarification",
    univers: "jannat",
    introU:
      "Un petit repère de départ, à froid. Il ne mesure rien de définitif : il t'aide, et aide ta praticienne, à voir d'où tu pars. Réponds spontanément.",
    introI:
      "Un petit repère de départ, à froid, بِإِذْنِ اللّٰه. Il ne juge pas et ne diagnostique rien : il éclaire d'où tu pars, avec douceur. Réponds spontanément.",
    questions: [
      { id: "apaisement", texte: "En ce moment, je me sens intérieurement apaisée.", ...ECH },
      { id: "clarte", texte: "J'y vois clair sur ce que je veux changer.", ...ECH },
      { id: "energie", texte: "J'ai l'énergie d'avancer, même à petits pas.", ...ECH },
      { id: "soutien", texte: "Je me sens soutenue autour de moi.", ...ECH },
      { id: "sens", texte: "Je garde un sens, un cap, malgré les difficultés.", ...ECH },
    ],
    bands: [
      { upTo: 0.35, titre: "Une période lourde à traverser", texte: "Tu portes beaucoup en ce moment. C'est justement le bon moment pour être accompagnée — un pas à la fois, sans te juger. On commencera par alléger, pas par « réparer »." },
      { upTo: 0.65, titre: "Des appuis, et des points à renforcer", texte: "Tu as déjà des ressources, et certaines zones demandent du soutien. On va s'appuyer sur ce qui tient pour consolider ce qui vacille." },
      { upTo: 1.01, titre: "De belles ressources déjà présentes", texte: "Tu arrives avec de vrais appuis intérieurs. L'accompagnement servira surtout à clarifier, affiner, et t'aider à tenir ton cap dans la durée." },
    ],
  },
  {
    id: "charge-mentale",
    titre: "Thermomètre de la charge mentale (maman)",
    univers: "educa",
    introU:
      "Pour mettre un chiffre sur une intuition (« je porte trop »). Aucune bonne ou mauvaise réponse — juste une photo de ta semaine.",
    introI:
      "Pour mettre un chiffre sur une intuition (« je porte trop »). Aucune bonne ou mauvaise réponse — juste une photo de ta semaine, sans culpabilité.",
    questions: [
      { id: "tete", texte: "J'ai la tête pleine de listes et de choses à ne pas oublier.", ...FREQ },
      { id: "repos", texte: "Même au repos, je n'arrive pas vraiment à décrocher.", ...FREQ },
      { id: "seule", texte: "J'ai l'impression de tout gérer seule.", ...FREQ },
      { id: "irritable", texte: "Je me sens à fleur de peau, vite débordée.", ...FREQ },
    ],
    bands: [
      { upTo: 0.35, titre: "Charge tenue", texte: "Ta charge mentale reste dans le vert cette semaine. On garde les bons appuis qui te permettent de souffler." },
      { upTo: 0.65, titre: "Charge à surveiller", texte: "La charge monte. C'est le moment de poser une ou deux limites concrètes, et de t'accorder une vraie pause « pour toi »." },
      { upTo: 1.01, titre: "Charge élevée — tu mérites du soutien", texte: "Tu portes beaucoup, et ça se voit dans les chiffres. Déléguer une seule chose, ou en parler en séance, allégera déjà le poids. Tu n'as pas à tout porter seule." },
    ],
  },
];

export function scoreOf(q: Questionnaire, answers: Record<string, number>) {
  const scoreMax = q.questions.reduce((s, qq) => s + qq.max, 0);
  const score = q.questions.reduce((s, qq) => s + (answers[qq.id] ?? 0), 0);
  const ratio = scoreMax > 0 ? score / scoreMax : 0;
  const band = q.bands.find((b) => ratio <= b.upTo) ?? q.bands[q.bands.length - 1];
  return { score, scoreMax, ratio, band };
}
