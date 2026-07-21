// Moteur générique de questionnaires — Les Deux Jardins.
// 10 questions × 0–10 = score /100. 3 paliers. Restitution DOUCE, JAMAIS un diagnostic.
//
// TROIS RÈGLES NON NÉGOCIABLES (fiche Nawel) :
//  ① Jamais de diagnostic : on affiche un NIVEAU et une ORIENTATION, jamais un nom de trouble.
//  ② Les ALERTES priment sur le score (câblées en dur) : un score "léger" + alerte = URGENCE.
//  ③ Aucun questionnaire ne dépiste le mal occulte. Le différentiel se fait en séance.

export interface Question {
  id: string;
  texte: string; // formulation commune (fallback)
  texteI?: string; // surcharge mode islamique
  texteU?: string; // surcharge mode universel
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export interface Band {
  upTo: number; // borne haute du ratio (score/100)
  titre: string;
  texte: string;
}

// Alerte de sécurité : se déclenche sur une question précise OU sur le score total.
export interface Alert {
  level: "rouge" | "orange";
  titre: string;
  message: string;
  questionId?: string; // déclencheur : une question…
  minValue?: number; // …dont la valeur atteint ce seuil
  whenScoreAtLeast?: number; // OU déclencheur sur le score total
}

export interface Questionnaire {
  id: string;
  titre: string;
  univers: "educa" | "jannat";
  islamicOnly?: boolean; // n'apparaît qu'en mode islamique
  introU: string;
  introI: string;
  note?: string; // note toujours affichée dans la restitution (ex. croisement)
  questions: Question[];
  bands: Band[];
  alerts?: Alert[];
}

const ECH = { min: 0, max: 10, minLabel: "Pas du tout", maxLabel: "Totalement" };

// Paliers communs aux 8 (0–30 léger · 31–60 modéré · 61–100 élevé). Restitution douce.
const BANDS3: Band[] = [
  { upTo: 0.30, titre: "🟢 Niveau léger", texte: "Ce que tu traverses reste, aujourd'hui, d'intensité légère. On peut agir en douceur et en prévention, avec quelques outils simples, avant que ça pèse davantage." },
  { upTo: 0.60, titre: "🟠 Niveau modéré", texte: "L'intensité est modérée : cela mérite un accompagnement structuré, à ton rythme. Tu n'as pas à attendre que ça empire pour être soutenue." },
  { upTo: 1.01, titre: "🔴 Niveau élevé — un appui médical est recommandé", texte: "L'intensité est élevée en ce moment. En parler à ta praticienne ET à un médecin est la meilleure façon de t'alléger. Ce n'est pas un verdict — c'est une invitation à être bien entourée." },
];

// Alerte commune : score élevé → orientation médicale.
const ALERT_MED61: Alert = {
  level: "orange",
  titre: "Orientation médicale recommandée",
  message: "Le niveau est élevé : il est recommandé d'en parler aussi à un médecin, sans tarder. L'accompagnement ne remplace ni un bilan, ni un avis médical.",
  whenScoreAtLeast: 61,
};

export const QUESTIONNAIRES: Questionnaire[] = [
  // 1 ───────── WASWĀS / PENSÉES INTRUSIVES
  {
    id: "waswas",
    titre: "Waswās / pensées intrusives",
    univers: "jannat",
    introU: "Un repère sur les pensées non voulues qui s'imposent malgré toi. Il n'y a rien de honteux ici — réponds spontanément.",
    introI: "بِإِذْنِ اللّٰه — un repère sur le waswās. Ces pensées ne sont pas un péché : c'est une épreuve. Réponds en confiance, sans te juger.",
    questions: [
      { id: "w1", texte: "Des pensées répétitives, non voulues, s'imposent à moi.", ...ECH, minLabel: "Jamais", maxLabel: "En permanence" },
      { id: "w2", texte: "Je doute d'avoir bien fait les choses.", texteI: "Je doute de ma prière ou de mes ablutions.", texteU: "Je doute d'avoir bien fait les choses.", ...ECH },
      { id: "w3", texte: "Je refais mes gestes par peur qu'ils soient mal faits.", texteI: "Je refais mes actes religieux par peur qu'ils soient invalides.", texteU: "Je refais mes gestes par peur qu'ils soient mal faits.", ...ECH },
      { id: "w4", texte: "Je me sens mentalement épuisée par ces pensées.", ...ECH },
      { id: "w5", texte: "J'ai honte de ce que je pense.", texteI: "J'ai honte — j'ai peur d'être impie.", texteU: "J'ai honte de ce que je pense.", ...ECH },
      { id: "w6", texte: "Ces pensées perturbent ma concentration.", texteI: "Ces pensées perturbent ma concentration dans la prière.", texteU: "Ces pensées perturbent ma concentration dans mes tâches.", ...ECH },
      { id: "w7", texte: "J'évite certaines situations par peur de ces pensées.", ...ECH },
      { id: "w8", texte: "Je m'isole à cause de ça.", ...ECH },
      { id: "w9", texte: "J'ai du mal à passer à autre chose.", ...ECH },
      { id: "w10", texte: "Ça impacte mon quotidien.", ...ECH },
    ],
    bands: BANDS3,
    alerts: [ALERT_MED61],
  },

  // 2 ───────── COLÈRE
  {
    id: "colere",
    titre: "Colère",
    univers: "jannat",
    introU: "Un repère sur la colère : sa fréquence, son intensité, ses traces. Aucun jugement — juste une photo honnête.",
    introI: "Un repère sur la colère (ghaḍab). Aucun jugement : la colère est humaine, on regarde seulement comment elle se manifeste chez toi.",
    questions: [
      { id: "c1", texte: "La fréquence de mes colères (par semaine).", ...ECH, minLabel: "Jamais", maxLabel: "Très souvent" },
      { id: "c2", texte: "L'intensité de mes colères (de légère à explosive).", ...ECH, minLabel: "Légère", maxLabel: "Explosive" },
      { id: "c3", texte: "Il m'arrive de crier ou de dire des mots qui dépassent ma pensée.", ...ECH },
      { id: "c4", texte: "Mon corps m'alerte (chaleur, palpitations, tension).", ...ECH },
      { id: "c5", texte: "Je rumine après l'épisode.", ...ECH },
      { id: "c6", texte: "Ça impacte mes relations proches.", ...ECH },
      { id: "c7", texte: "Je culpabilise après.", ...ECH },
      { id: "c8", texte: "Ça m'éloigne de ce qui me fait du bien.", texteI: "Ça m'éloigne de la prière, du dhikr.", texteU: "Ça m'éloigne de ce qui me fait du bien.", ...ECH },
      { id: "c9", texte: "J'ai du mal à me contrôler malgré mes efforts.", ...ECH },
      { id: "c10", texte: "J'ai des regrets importants.", ...ECH },
    ],
    bands: BANDS3,
    alerts: [ALERT_MED61],
  },

  // 3 ───────── ANXIÉTÉ / STRESS CHRONIQUE
  {
    id: "anxiete",
    titre: "Anxiété / stress chronique",
    univers: "jannat",
    introU: "Un repère sur l'inquiétude et la tension qui durent. Réponds selon ces dernières semaines.",
    introI: "Un repère sur l'anxiété (qalaq) et le stress qui s'installent. Réponds selon ces dernières semaines, avec douceur envers toi.",
    questions: [
      { id: "ax1", texte: "Je m'inquiète en permanence.", ...ECH, minLabel: "Jamais", maxLabel: "En permanence" },
      { id: "ax2", texte: "Je me fais du souci pour ce que je ne contrôle pas.", ...ECH },
      { id: "ax3", texte: "Mon corps est tendu (oppression, souffle court).", ...ECH },
      { id: "ax4", texte: "Je fabrique des scénarios catastrophiques.", ...ECH },
      { id: "ax5", texte: "Mon sommeil est perturbé.", ...ECH },
      { id: "ax6", texte: "J'évite des situations.", ...ECH },
      { id: "ax7", texte: "J'ai des crises d'angoisse (peur de mourir).", ...ECH },
      { id: "ax8", texte: "Ça bloque mes actions et mes décisions.", ...ECH },
      { id: "ax9", texte: "Je suis épuisée par cette alerte permanente.", ...ECH },
      { id: "ax10", texte: "Ça met de la distance avec ce qui m'apaise.", texteI: "Ça met de la distance avec Allāh, avec la prière.", texteU: "Ça met de la distance avec ce qui m'apaise.", ...ECH },
    ],
    bands: BANDS3,
    alerts: [ALERT_MED61],
  },

  // 4 ───────── TRISTESSE / ḤUZN  (⚠️ ALERTE)
  {
    id: "tristesse",
    titre: "Tristesse / ḥuzn",
    univers: "jannat",
    introU: "Un repère sur la tristesse quand elle s'installe et pèse. Ce que tu ressens compte — réponds au plus juste.",
    introI: "Un repère sur la tristesse, le ḥuzn, quand il s'installe. Le Prophète ﷺ lui-même a connu des années de tristesse : tu n'as pas à en avoir honte.",
    questions: [
      { id: "t1", texte: "Une tristesse profonde et durable.", ...ECH },
      { id: "t2", texte: "Plus rien ne me fait plaisir.", ...ECH },
      { id: "t3", texte: "Un vide, un engourdissement émotionnel.", ...ECH },
      { id: "t4", texte: "Je pleure sans cause.", ...ECH },
      { id: "t5", texte: "Des pensées négatives sur moi (nulle, inutile, invisible).", ...ECH },
      { id: "t6", texte: "Je m'isole.", ...ECH },
      { id: "t7", texte: "Les tâches simples me sont difficiles.", ...ECH },
      { id: "t8", texte: "Je suis fatiguée même après avoir dormi.", ...ECH },
      { id: "t9", texte: "« Tout ça ne sert à rien. »", ...ECH },
      { id: "t10", texte: "Ça affecte mon sens de la vie.", texteI: "Ça affecte ma foi et ma relation à Allāh.", texteU: "Ça affecte mon sens de la vie.", ...ECH },
    ],
    bands: BANDS3,
    alerts: [
      {
        level: "rouge",
        titre: "Ce signal passe avant le score",
        message: "Ce que tu décris demande à être entendu par un médecin, sans attendre. Parles-en aujourd'hui à ta praticienne.",
        questionId: "t9",
        minValue: 6,
      },
      ALERT_MED61,
    ],
  },

  // 5 ───────── TRAUMATISME / CHOC ÉMOTIONNEL
  {
    id: "trauma",
    titre: "Traumatisme / choc émotionnel",
    univers: "jannat",
    introU: "Un repère sur les traces d'un événement difficile. Si, en répondant, tu te sens submergée, arrête-toi. Tu n'es pas obligée d'aller plus loin seule — on en parlera ensemble.",
    introI: "Un repère sur les traces d'un choc, بِإِذْنِ اللّٰه. Si, en répondant, tu te sens submergée, arrête-toi. Tu n'es pas obligée d'aller plus loin seule — on en parlera ensemble.",
    questions: [
      { id: "tr1", texte: "Des flashbacks, des images qui s'imposent.", ...ECH },
      { id: "tr2", texte: "Je réagis fort à certaines situations ou certains lieux.", ...ECH },
      { id: "tr3", texte: "J'évite des sujets, des lieux, des personnes.", ...ECH },
      { id: "tr4", texte: "Mon corps se met en alerte tout seul.", ...ECH },
      { id: "tr5", texte: "Des cauchemars.", ...ECH },
      { id: "tr6", texte: "Il m'arrive de me sentir loin, comme spectatrice de moi-même.", ...ECH },
      { id: "tr7", texte: "Le passé s'impose dans mes relations actuelles.", ...ECH },
      { id: "tr8", texte: "Une émotion forte (colère, tristesse, honte) reste liée à l'événement.", ...ECH },
      { id: "tr9", texte: "J'ai l'impression que je ne pourrai jamais m'en sortir.", ...ECH },
      { id: "tr10", texte: "Ça affecte le sentiment d'être aimable.", texteI: "Ça affecte le sentiment d'être aimée d'Allāh.", texteU: "Ça affecte le sentiment d'être aimable.", ...ECH },
    ],
    bands: BANDS3,
    alerts: [
      {
        level: "orange",
        titre: "Vigilance renforcée",
        message: "Un sentiment d'impasse est présent : à évaluer avec soin en séance (niveau de désespoir), sans le laisser sans parole.",
        questionId: "tr9",
        minValue: 8,
      },
      ALERT_MED61,
    ],
  },

  // 6 ───────── ESTIME DE SOI / IMPOSTEUR
  {
    id: "estime",
    titre: "Estime de soi / syndrome de l'imposteur",
    univers: "jannat",
    introU: "Un repère sur le regard que tu portes sur toi. Réponds avec honnêteté et douceur — surtout de la douceur.",
    introI: "Un repère sur le regard que tu portes sur toi. Rappelle-toi : Allāh t'a créée dans la meilleure des formes. Réponds avec douceur.",
    questions: [
      { id: "e1", texte: "« Je ne mérite pas. »", ...ECH },
      { id: "e2", texte: "Une voix critique intérieure très forte.", ...ECH },
      { id: "e3", texte: "Un sentiment d'imposture.", ...ECH },
      { id: "e4", texte: "J'ai du mal à recevoir un compliment.", ...ECH },
      { id: "e5", texte: "Je me sabote.", ...ECH },
      { id: "e6", texte: "J'éprouve de l'aversion, du mépris envers moi.", ...ECH },
      { id: "e7", texte: "Je suis plus sévère envers moi qu'envers les autres.", ...ECH },
      { id: "e8", texte: "J'évite d'être « découverte ».", ...ECH },
      { id: "e9", texte: "Je cherche l'approbation en permanence.", ...ECH },
      { id: "e10", texte: "Ça affecte ma relation aux autres.", texteI: "Ça affecte ma relation à Allāh.", texteU: "Ça affecte ma relation aux autres.", ...ECH },
    ],
    bands: BANDS3,
    alerts: [ALERT_MED61],
  },

  // 7 ───────── DEUIL / PERTE
  {
    id: "deuil",
    titre: "Deuil / perte",
    univers: "jannat",
    introU: "Un repère sur une perte qui pèse encore. Le deuil n'a pas d'horaire — réponds au plus près de ce que tu vis.",
    introI: "Un repère sur une perte. « Innā li-Llāhi wa innā ilayhi rājiʿūn. » Le deuil n'a pas d'horaire — réponds au plus près de ce que tu vis.",
    questions: [
      { id: "d1", texte: "La perte occupe encore mon esprit.", ...ECH },
      { id: "d2", texte: "Une douleur vive quand j'y pense.", ...ECH },
      { id: "d3", texte: "J'ai du mal à accepter que ce soit définitif.", ...ECH },
      { id: "d4", texte: "De la colère (envers moi ou les autres).", texteI: "De la colère (envers moi, les autres, ou Allāh).", texteU: "De la colère (envers moi ou les autres).", ...ECH },
      { id: "d5", texte: "De la culpabilité liée à la perte.", ...ECH },
      { id: "d6", texte: "J'ai du mal à me projeter.", ...ECH },
      { id: "d7", texte: "J'ai du mal à reparler de la personne / de ce que j'ai perdu.", ...ECH },
      { id: "d8", texte: "Je m'isole (socialement, spirituellement).", ...ECH },
      { id: "d9", texte: "« Je ne devrais plus souffrir — mais je souffre. »", ...ECH },
      { id: "d10", texte: "Ma confiance en la vie en est modifiée.", texteI: "Ma foi et ma confiance en Allāh en sont modifiées.", texteU: "Ma confiance en la vie en est modifiée.", ...ECH },
    ],
    bands: BANDS3,
    alerts: [ALERT_MED61],
  },

  // 8 ───────── FAIBLESSE DE FOI / FUTŪR  (mode islamique UNIQUEMENT)
  {
    id: "futur",
    titre: "Faiblesse de foi / futūr (فتور)",
    univers: "jannat",
    islamicOnly: true,
    introU: "",
    introI: "Un repère sur les creux de la foi (futūr). Ce n'est pas un jugement : l'iman fluctue pour tous. Réponds en confiance — la porte du retour est toujours ouverte.",
    note: "🔗 Croisement important : si ce questionnaire ET celui de la Tristesse / ḥuzn sont tous deux élevés, il s'agit très probablement d'une dépression (priorité médicale) et non d'un futūr. Ce repère ne dépiste jamais le mal occulte : le différentiel se fait en séance.",
    questions: [
      { id: "f1", texte: "Ma pratique est devenue mécanique — j'accomplis, mais sans goût.", ...ECH },
      { id: "f2", texte: "J'ai délaissé ce que je faisais en plus (dhikr, sunan, lectures).", ...ECH },
      { id: "f3", texte: "Je me sens distante du Coran — il ne me touche plus comme avant.", ...ECH },
      { id: "f4", texte: "Je repousse mes actes d'adoration, je procrastine.", ...ECH },
      { id: "f5", texte: "Des questionnements me traversent sur des choses que je ne remettais pas en cause.", ...ECH },
      { id: "f6", texte: "Je culpabilise — mais ça ne change rien, et ça recommence.", ...ECH },
      { id: "f7", texte: "Je me sens épuisée spirituellement (j'en ai trop fait, ou trop porté).", ...ECH },
      { id: "f8", texte: "Je n'ai plus de compagnonnage qui me rappelle Allāh.", ...ECH },
      { id: "f9", texte: "« Allāh ne m'aime plus », ou « Allāh m'a abandonnée » — « je ne suis pas digne de Son amour ».", ...ECH },
      { id: "f10", texte: "Il y a eu un événement (épreuve, trahison, blessure) après lequel le goût est parti.", ...ECH },
    ],
    bands: [
      { upTo: 0.30, titre: "🟢 Un léger creux", texte: "L'iman fluctue. Tu es dans un creux léger — le Prophète ﷺ a parlé de la futūr : toute action a un pic, et tout pic a un creux. Ce n'est pas la fin de ta foi, c'est un passage. La porte du retour est ouverte." },
      { upTo: 0.60, titre: "🟠 Un creux installé", texte: "L'iman fluctue. Tu es dans un creux qui dure — le Prophète ﷺ a parlé de la futūr : toute action a un pic, et tout pic a un creux. Ce n'est pas la fin de ta foi, c'est un passage. La porte du retour est ouverte." },
      { upTo: 1.01, titre: "🔴 Un creux profond — à accompagner", texte: "L'iman fluctue, et tu traverses un creux profond. Ce n'est pas la fin de ta foi : c'est un passage, et la porte du retour reste grande ouverte. Ce creux mérite d'être accompagné — vers un savant pour les questionnements, et vers un suivi si l'épuisement est là." },
    ],
    alerts: [
      {
        level: "orange",
        titre: "Désespoir de la miséricorde (qunūṭ) — à ne jamais laisser sans parole",
        message: "Ce sentiment (« Allāh ne veut plus de moi ») se travaille en séance, avec beaucoup de douceur. La miséricorde d'Allāh dépasse tout — la porte du retour reste ouverte.",
        questionId: "f9",
        minValue: 7,
      },
      {
        level: "orange",
        titre: "Orientation : les deux, pas l'un ou l'autre",
        message: "Niveau élevé : orientation vers un savant (pour les questionnements) ET un suivi psy (pour l'épuisement) — les deux ensemble.",
        whenScoreAtLeast: 61,
      },
    ],
  },
];

/** Texte d'une question selon le mode (islamique / universel), avec repli sur `texte`. */
export function questionText(qq: Question, islamic: boolean): string {
  return islamic ? qq.texteI ?? qq.texte : qq.texteU ?? qq.texte;
}

export interface Evaluation {
  score: number;
  scoreMax: number;
  ratio: number;
  band: Band;
  alerts: Alert[];
}

/** Évalue un questionnaire : score, palier, ET alertes de sécurité (rouge d'abord). */
export function evaluate(q: Questionnaire, answers: Record<string, number>): Evaluation {
  const scoreMax = q.questions.reduce((s, qq) => s + qq.max, 0);
  const score = q.questions.reduce((s, qq) => s + (answers[qq.id] ?? 0), 0);
  const ratio = scoreMax > 0 ? score / scoreMax : 0;
  const band = q.bands.find((b) => ratio <= b.upTo) ?? q.bands[q.bands.length - 1];
  const alerts = (q.alerts ?? []).filter((a) => {
    if (a.whenScoreAtLeast !== undefined && score >= a.whenScoreAtLeast) return true;
    if (a.questionId !== undefined && a.minValue !== undefined) return (answers[a.questionId] ?? 0) >= a.minValue;
    return false;
  });
  alerts.sort((a, b) => (a.level === "rouge" ? 0 : 1) - (b.level === "rouge" ? 0 : 1));
  return { score, scoreMax, ratio, band, alerts };
}

/** Compat : score simple (sans alertes). */
export function scoreOf(q: Questionnaire, answers: Record<string, number>) {
  const { score, scoreMax, ratio, band } = evaluate(q, answers);
  return { score, scoreMax, ratio, band };
}

/** Recompose titre + palier + alertes depuis des réponses déjà enregistrées. */
export function evaluateStored(questionnaireId: string, answers: Record<string, number>) {
  const q = QUESTIONNAIRES.find((x) => x.id === questionnaireId);
  if (!q) return null;
  return { titre: q.titre, ...evaluate(q, answers) };
}

/** Compat : titre + palier depuis un score déjà enregistré (sans les réponses détaillées). */
export function bandForScore(questionnaireId: string, score: number, scoreMax: number) {
  const q = QUESTIONNAIRES.find((x) => x.id === questionnaireId);
  if (!q) return null;
  const ratio = scoreMax > 0 ? score / scoreMax : 0;
  const band = q.bands.find((b) => ratio <= b.upTo) ?? q.bands[q.bands.length - 1];
  return { titre: q.titre, band, ratio };
}
