// Les hubs, pilotés par données (un hub = une entrée). Chaque item peut être :
//  - href interne (route de l'app), href externe (app Netlify), ou "à venir".
export interface HubItem {
  nom: string;
  desc: string;
  href?: string;
  externe?: boolean;
  soon?: boolean;
  mode?: "u" | "i"; // visible seulement dans ce mode (sinon les deux)
}
export interface HubSection {
  titre: string;
  items: HubItem[];
}
export interface Hub {
  slug: string;
  univers: "educa" | "jannat";
  titre: string;
  kicker: string;
  taglineU: string;
  taglineI: string;
  sections: HubSection[];
}

export const HUBS: Record<string, Hub> = {
  parents: {
    slug: "parents",
    univers: "educa",
    titre: "Hub Parents",
    kicker: "Educa Typique · pour les mamans",
    taglineU: "Guides, workbooks et outils pour souffler, comprendre et accompagner — sans culpabiliser.",
    taglineI: "Guides, workbooks et outils pour souffler et accompagner, avec sakīna et sans culpabiliser.",
    sections: [
      {
        titre: "Comprendre & s'outiller",
        items: [
          { nom: "Parcours Clarté TND", desc: "La collection complète (guides, fiches, apps).", href: "https://boite-neuro-ped-univ.netlify.app/", externe: true },
          { nom: "Devoirs sans crise", desc: "Accompagner les devoirs sans conflit.", soon: true },
          { nom: "Dialoguer avec son ado", desc: "Reformuler, désamorcer, relier.", soon: true },
        ],
      },
      {
        titre: "Prendre soin de soi",
        items: [
          { nom: "Thermomètre de la charge mentale", desc: "Mettre un chiffre sur « je porte trop ».", href: "/questionnaires" },
          { nom: "Sortir du brouillard affectif", desc: "Workbook 4 fiches (dépendance affective).", soon: true },
        ],
      },
    ],
  },
  enfants: {
    slug: "enfants",
    univers: "educa",
    titre: "Hub Enfants",
    kicker: "Educa Typique · 3 · 5 · 12 ans",
    taglineU: "Émotions, histoires, jeux et routines — adaptés à chaque âge.",
    taglineI: "Émotions, histoires, jeux et routines — adaptés à chaque âge, dans la douceur.",
    sections: [
      {
        titre: "Au quotidien",
        items: [
          { nom: "Le coin du soir", desc: "Rituel d'endormissement (double mode).", href: "/hub/enfants" },
          { nom: "Coin des émotions", desc: "Nommer et apprivoiser les émotions.", soon: true },
        ],
      },
      {
        titre: "Petits maux",
        items: [
          { nom: "Hygiène de vie", desc: "Repères simples et fondés sur les preuves.", mode: "u", soon: true },
          { nom: "Médecine prophétique", desc: "Tradition prophétique — sourcée, jamais un remède médical.", mode: "i", soon: true },
        ],
      },
    ],
  },
  ados: {
    slug: "ados",
    univers: "educa",
    titre: "Hub Ados",
    kicker: "Educa Typique · 12-18 ans",
    taglineU: "Attention, sommeil, estime de soi, humeur — et rester safe en ligne.",
    taglineI: "Attention, sommeil, estime de soi, humeur — et rester safe en ligne, avec des repères.",
    sections: [
      {
        titre: "Mon équilibre",
        items: [
          { nom: "Journal d'humeur", desc: "Suivre son humeur, repérer les vagues.", soon: true },
          { nom: "Brise-glace", desc: "Petit outil pour démarrer une séance.", soon: true },
        ],
      },
      {
        titre: "Protection numérique",
        items: [
          { nom: "Bouclier — la série", desc: "Grooming, sextorsion, deepfakes, catfishing…", soon: true },
          { nom: "Premiers secours émotionnels", desc: "Que faire si… (cyberharcèlement, photo intime).", soon: true },
        ],
      },
    ],
  },
  pro: {
    slug: "pro",
    univers: "jannat",
    titre: "Hub Professionnels",
    kicker: "Jannat al Qulûb · praticiennes",
    taglineU: "Ton cockpit, tes protocoles, tes questionnaires — tout le parcours accompagné.",
    taglineI: "Ton cockpit, tes protocoles, tes invocations et questionnaires — tout le parcours, avec l'amāna.",
    sections: [
      {
        titre: "Mon atelier",
        items: [
          { nom: "Cockpit praticienne", desc: "Fiche client, parcours accueil→clôture, synthèse « Pour toi ».", href: "/cockpit" },
          { nom: "Moteur de questionnaires", desc: "Repérages, profils, bilans — reliés à la fiche.", href: "/questionnaires" },
          { nom: "Mes applications", desc: "Toutes tes apps, rattachées.", href: "/apps" },
        ],
      },
      {
        titre: "Transmettre",
        items: [
          { nom: "Bibliothèque de protocoles", desc: "Cliniques & spirituels, assignables.", soon: true },
          { nom: "Relais Lumière", desc: "Mécénat, tarif solidaire, Sadaqa.", soon: true },
        ],
      },
    ],
  },
};

export const HUB_SLUGS = Object.keys(HUBS);
