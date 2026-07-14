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
  {
    id: "anamnese-reperes",
    titre: "Anamnèse — repères de départ",
    univers: "jannat",
    introU:
      "Un tour d'horizon en douceur : ce qui, aujourd'hui, pèse encore ou demande de l'attention. Ce n'est pas un examen — juste une carte pour savoir par où commencer ensemble.",
    introI:
      "Un tour d'horizon en douceur, بِإِذْنِ اللّٰه : ce qui, aujourd'hui, pèse ou demande de l'attention. Pas un examen — une carte pour savoir par où commencer, avec bienveillance.",
    questions: [
      { id: "histoire", texte: "Mon histoire familiale ou mon enfance pèse encore sur mon présent.", ...ECH },
      { id: "evenements", texte: "Des événements marquants (deuils, ruptures, chocs) restent vifs en moi.", ...ECH },
      { id: "corps", texte: "Mon corps ou mon sommeil portent les traces du stress.", ...ECH },
      { id: "relations", texte: "Mes relations actuelles sont une source de tension.", ...ECH },
      { id: "appuis", texte: "Je me sens loin de mes appuis de sens (foi, valeurs, ressources).", ...ECH },
      { id: "elan", texte: "J'ai du mal à retrouver de l'élan au quotidien.", ...ECH },
    ],
    bands: [
      { upTo: 0.35, titre: "Un terrain plutôt apaisé", texte: "Peu de zones sont douloureuses aujourd'hui. On pourra avancer sereinement, en s'appuyant sur ce qui est déjà solide en toi." },
      { upTo: 0.65, titre: "Quelques zones à explorer ensemble", texte: "Certains domaines demandent de l'attention. On les prendra un par un, à ton rythme, sans tout remuer d'un coup." },
      { upTo: 1.01, titre: "Plusieurs appuis à reconstruire — en douceur", texte: "Plusieurs zones pèsent en même temps. C'est précieux de l'avoir nommé : on choisira d'abord la plus urgente à alléger, sans se presser. Tu n'es pas seule pour ça." },
    ],
  },
  {
    id: "biais-schemas",
    titre: "Biais cognitifs & schémas",
    univers: "jannat",
    introU:
      "Nos pensées prennent parfois des raccourcis qui nous font souffrir. Repérer ces habitudes, sans se juger, c'est déjà commencer à s'en libérer.",
    introI:
      "Nos pensées prennent parfois des raccourcis qui nous font souffrir. Les repérer sans se juger, c'est un premier pas vers l'apaisement, بِإِذْنِ اللّٰه.",
    questions: [
      { id: "toutrien", texte: "Je pense en « tout ou rien » : c'est parfait, ou c'est raté.", ...FREQ },
      { id: "catastrophe", texte: "J'imagine le pire, même sans preuve réelle.", ...FREQ },
      { id: "autocritique", texte: "Je me juge très durement quand je me trompe.", ...FREQ },
      { id: "perfection", texte: "Je crois devoir être parfaite pour être acceptée.", ...FREQ },
      { id: "lecture", texte: "Je suppose que les autres me jugent négativement.", ...FREQ },
      { id: "generalisation", texte: "Un échec devient vite « je suis nulle », en général.", ...FREQ },
    ],
    bands: [
      { upTo: 0.35, titre: "Des pensées plutôt souples", texte: "Tes schémas de pensée te laissent de la marge. On affinera juste quelques automatismes, pour gagner encore en liberté intérieure." },
      { upTo: 0.65, titre: "Quelques automatismes à assouplir", texte: "Certaines pensées reviennent souvent et te pèsent. La bonne nouvelle : une pensée n'est pas un fait. On apprendra à les repérer et à les nuancer." },
      { upTo: 1.01, titre: "Des schémas installés — et ça se travaille", texte: "Ces raccourcis de pensée sont fréquents et douloureux, mais ils s'assouplissent très bien avec de la pratique. Tu n'es pas « comme ça » : tu as pris des plis, et un pli, ça se déplie." },
    ],
  },
  {
    id: "dependance-affective",
    titre: "Dépendance affective",
    univers: "jannat",
    introU:
      "Aimer et avoir besoin des autres est sain. Parfois pourtant, le besoin de l'autre devient une source d'angoisse. Ce repère aide à situer où tu en es, sans étiquette.",
    introI:
      "Aimer et avoir besoin des autres est sain et humain. Parfois, le besoin de l'autre devient une angoisse. Ce repère t'aide à situer où tu en es, sans étiquette et sans jugement.",
    questions: [
      { id: "rassurance", texte: "J'ai besoin d'être rassurée souvent sur l'amour qu'on me porte.", ...FREQ },
      { id: "abandon", texte: "La peur d'être abandonnée ou rejetée m'influence beaucoup.", ...FREQ },
      { id: "decision", texte: "J'ai du mal à décider seule, sans l'approbation des autres.", ...FREQ },
      { id: "oubli", texte: "Je m'oublie pour garder le lien ou faire plaisir.", ...FREQ },
      { id: "humeur", texte: "Quand un proche est distant, mon humeur s'effondre.", ...FREQ },
      { id: "liens", texte: "Je reste dans des liens qui me font du mal, par peur de la solitude.", ...FREQ },
    ],
    bands: [
      { upTo: 0.35, titre: "Un lien à l'autre plutôt sécurisant", texte: "Tu sais t'appuyer sur les autres sans t'y perdre. On cultivera cette base sûre, précieuse pour toutes tes relations." },
      { upTo: 0.65, titre: "Un besoin de l'autre qui pèse parfois", texte: "Le besoin de rassurance prend parfois beaucoup de place. On travaillera à nourrir ta sécurité intérieure, pour aimer sans t'oublier." },
      { upTo: 1.01, titre: "Un attachement qui fait souffrir — ça s'apaise", texte: "La peur du rejet ou de la solitude pèse fort aujourd'hui. C'est un terrain qui se répare : en renforçant, pas à pas, ta valeur à tes propres yeux. Tu mérites des liens qui te reposent, pas qui t'angoissent." },
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

/** Retrouve titre + palier de restitution à partir d'un score déjà enregistré. */
export function bandForScore(questionnaireId: string, score: number, scoreMax: number) {
  const q = QUESTIONNAIRES.find((x) => x.id === questionnaireId);
  if (!q) return null;
  const ratio = scoreMax > 0 ? score / scoreMax : 0;
  const band = q.bands.find((b) => ratio <= b.upTo) ?? q.bands[q.bands.length - 1];
  return { titre: q.titre, band, ratio };
}
