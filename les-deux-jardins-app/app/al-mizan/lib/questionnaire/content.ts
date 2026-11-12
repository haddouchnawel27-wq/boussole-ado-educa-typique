// ════════════════════════════════════════════════════════════
// Al Mizan — contenus des écrans (soutien + synthèse)
// Ton : rassurant, non médicalisant, sans injonction, jamais un diagnostic.
// ════════════════════════════════════════════════════════════

export interface RouteContent {
  title: string;
  lines: string[];
  resources?: boolean; // affiche les ressources humaines (soutien immédiat)
  breathing?: boolean; // propose une respiration facultative
}

export const ROUTE_CONTENT: Record<string, RouteContent> = {
  SUPPORT_IMMEDIATE: {
    title: "Vous semblez porter beaucoup",
    lines: [
      "Vous n'avez pas besoin de tout analyser maintenant.",
      "Vous pouvez vous arrêter ici, revenir au calme, ou parler à une personne de confiance.",
      "Prendre soin de soi, c'est aussi demander du soutien.",
    ],
    resources: true,
  },
  SUPPORT_ROUTE: {
    title: "Un temps pour souffler",
    lines: [
      "Ce que vous portez est réel. Rien ne presse.",
      "Vous pouvez faire une pause, vous ancrer un instant, et réduire ce qui pèse.",
      "S'il n'y avait qu'une seule chose à faire là maintenant — une seule, facultative — laquelle vous ferait du bien ?",
    ],
    breathing: true,
  },
  OVERLOAD_SUPPORT: {
    title: "Alléger, pour l'instant",
    lines: [
      "Vos réponses évoquent un trop-plein. C'est un signal, pas un défaut.",
      "Passez en mode minimal : une seule chose à la fois, le reste peut attendre.",
      "Vous pouvez vous arrêter là quand vous voulez.",
    ],
  },
  DYSREGULATION_SUPPORT: {
    title: "Revenir doucement au calme",
    lines: [
      "Quand les émotions montent vite, revenir au corps aide souvent : les pieds au sol, un souffle plus lent.",
      "Repoussez les décisions non urgentes à plus tard.",
      "Personne ne vous demande de « vous calmer » — juste de vous accorder un moment.",
    ],
    breathing: true,
  },
  ANXIETY_SUPPORT: {
    title: "Relâcher un peu la pression",
    lines: [
      "L'inquiétude prend de la place aujourd'hui. C'est fréquent, et ça passe.",
      "Un souffle plus lent, un instant pour vous recentrer sur ce qui est là, maintenant.",
      "Vous n'avez rien à réussir dans ce moment.",
    ],
    breathing: true,
  },
  BLOCKAGE_SUPPORT: {
    title: "Une première toute petite étape",
    lines: [
      "Rester bloquée, ce n'est pas de la paresse — c'est souvent trop de choses en même temps.",
      "Choisissez UNE micro-étape, la plus petite possible. Juste commencer.",
      "Le reste suivra, ou pas. Aujourd'hui, une seule suffit.",
    ],
  },
  WORKLOAD_SUPPORT: {
    title: "Prioriser en douceur",
    lines: [
      "Il y a beaucoup à porter. On ne peut pas tout faire — et ce n'est pas grave.",
      "Que peut-on reporter, déléguer, ou retirer de la liste ?",
      "Garder une ou deux priorités, laisser respirer le reste.",
    ],
  },
  SUMMARY: {
    title: "Ce que vos réponses montrent aujourd'hui",
    lines: [
      "Voici un reflet de votre journée, domaine par domaine.",
      "C'est une aide à l'observation — ni une note, ni un diagnostic.",
    ],
  },
};

// Libellés de niveau (non médicalisants) par seuil.
export const THRESHOLD_LABEL: Record<string, { label: string; cls: string }> = {
  low: { label: "Léger", cls: "low" },
  moderate: { label: "Modéré", cls: "moderate" },
  high: { label: "Marqué", cls: "high" },
  very_high: { label: "Très présent", cls: "severe" },
};

// Une suggestion douce par domaine (utilisée dans la synthèse).
export const SECTION_SUGGESTION: Record<string, string> = {
  etat: "S'accorder un vrai temps de repos, sans culpabilité.",
  blocages: "Choisir une seule micro-étape pour amorcer.",
  anxiete: "Un souffle plus lent, revenir à l'instant présent.",
  regulation: "Revenir au corps avant de décider quoi que ce soit.",
  surcharge: "Retirer une seule chose de ce que vous portez aujourd'hui.",
  charge: "Reporter ou déléguer une tâche non essentielle.",
};

// Ressource de soutien (France) — présentée sans dramatisation.
export const SUPPORT_RESOURCE = {
  label: "Si vous vous sentez en détresse, vous pouvez parler à quelqu'un, à tout moment.",
  line: "3114 — numéro national de prévention (24h/24, gratuit, confidentiel).",
};
