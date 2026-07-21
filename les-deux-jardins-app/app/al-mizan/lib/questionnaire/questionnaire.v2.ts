import type { Questionnaire, Item, Section } from "./types";

// Échelle Likert 0-3 (identifiants stables, indépendants du texte).
const LIKERT = {
  id: "likert_frequency_0_3",
  type: "single_choice" as const,
  ordered: true,
  options: [
    { id: "never", value: 0, label: "Jamais" },
    { id: "sometimes", value: 1, label: "Parfois" },
    { id: "often", value: 2, label: "Souvent" },
    { id: "almost_always", value: 3, label: "Presque toujours" },
  ],
};

// Fabrique d'item pour alléger l'écriture.
function item(
  id: string,
  section_id: string,
  dimension: string,
  prompt: string,
  extra?: Partial<Item>
): Item {
  return {
    id,
    section_id,
    prompt,
    scale_id: LIKERT.id,
    required: false,
    allow_skip: true,
    reference_period: "en ce moment",
    scoring: { dimension, weight: 1, reverse_scored: false },
    content: { skip_label: "Je préfère ne pas répondre", reassurance: "Il n'y a pas de bonne ou de mauvaise réponse." },
    sensitivity: "low",
    ...extra,
  };
}

// Seuils standards pour une section de 4 items (0..12).
function thresholds4() {
  return [
    { id: "low" as const, min: 0, max: 3 },
    { id: "moderate" as const, min: 4, max: 6 },
    { id: "high" as const, min: 7, max: 9 },
    { id: "very_high" as const, min: 10, max: 12 },
  ];
}
function section(id: string, label: string, purpose: string, order: number, item_ids: string[]): Section {
  return {
    id,
    label,
    purpose,
    order,
    progress: { current: order, total: 6, label: `Bloc ${order} sur 6` },
    scoring: { method: "weighted_sum", minimum_answered: 3, missing_answer_strategy: "prorate", thresholds: thresholds4() },
    item_ids,
  };
}

// ─── ITEMS (6 blocs × 4) ───
const ITEMS: Item[] = [
  // 1. État du jour
  item("etat_1", "etat", "etat", "Je me sens fatiguée dès le matin."),
  item("etat_2", "etat", "etat", "J'ai du mal à me concentrer sur ce que je fais."),
  item("etat_3", "etat", "etat", "Je me sens à plat, sans ressort."),
  item("etat_4", "etat", "etat", "Les tâches simples me demandent un gros effort."),

  // 2. Blocages
  item("bloc_1", "blocages", "blocages", "Je remets à plus tard des choses importantes."),
  item("bloc_2", "blocages", "blocages", "Je ne sais pas par quel bout commencer."),
  item("bloc_3", "blocages", "blocages", "Je reste bloquée, comme paralysée, devant ce que j'ai à faire."),
  item("bloc_4", "blocages", "blocages", "J'évite certaines tâches parce qu'elles me font peur."),

  // 3. Pression et inquiétude (id technique : anxiete)
  item("anx_1", "anxiete", "anxiete", "Je crains de mal faire.", { content: { skip_label: "Je préfère ne pas répondre", helper_text: "Cette question explore la peur de l'erreur ou du jugement.", reassurance: "Il n'y a pas de bonne ou de mauvaise réponse." } }),
  item("anx_2", "anxiete", "anxiete", "Je repense en boucle à ce qui pourrait arriver."),
  item("anx_3", "anxiete", "anxiete", "Je me sens tendue, sous pression."),
  item("anx_4", "anxiete", "anxiete", "Je m'inquiète pour des choses que je ne contrôle pas."),

  // 4. Régulation émotionnelle
  item("reg_1", "regulation", "regulation", "Mes émotions montent très vite."),
  item("reg_2", "regulation", "regulation", "J'ai du mal à me calmer une fois contrariée."),
  item("reg_3", "regulation", "regulation", "Je réagis plus fort que je ne le voudrais.", { sensitivity: "moderate" }),
  item("reg_4", "regulation", "regulation", "Mes émotions me semblent difficiles à comprendre."),

  // 5. Surcharge émotionnelle
  item("surc_1", "surcharge", "surcharge", "Je me sens débordée par tout ce que je porte.", { sensitivity: "moderate" }),
  item("surc_2", "surcharge", "surcharge", "J'ai besoin de me couper de tout.", { sensitivity: "moderate" }),
  item("surc_3", "surcharge", "surcharge", "Je me sens au bord de craquer.", { sensitivity: "high" }),
  item("surc_4", "surcharge", "surcharge", "C'est trop, je ne sais plus quoi faire.", { sensitivity: "high" }),

  // 6. Charge de travail
  item("charge_1", "charge", "charge", "J'ai plus de choses à faire que de temps disponible."),
  item("charge_2", "charge", "charge", "Ma liste de tâches ne diminue jamais."),
  item("charge_3", "charge", "charge", "Je travaille sans vraie pause."),
  item("charge_4", "charge", "charge", "Je remets mes propres besoins après tout le reste."),
];

const SECTIONS: Section[] = [
  section("etat", "État du jour", "Observer l'énergie et la disponibilité du moment.", 1, ["etat_1", "etat_2", "etat_3", "etat_4"]),
  section("blocages", "Ce qui freine", "Explorer l'évitement, la difficulté à démarrer.", 2, ["bloc_1", "bloc_2", "bloc_3", "bloc_4"]),
  section("anxiete", "Pression et inquiétude", "Explorer la peur, l'anticipation, la tension et la rumination.", 3, ["anx_1", "anx_2", "anx_3", "anx_4"]),
  section("regulation", "Vagues émotionnelles", "Observer l'intensité et la régulation des émotions.", 4, ["reg_1", "reg_2", "reg_3", "reg_4"]),
  section("surcharge", "Trop-plein", "Repérer la surcharge et le besoin de soutien.", 5, ["surc_1", "surc_2", "surc_3", "surc_4"]),
  section("charge", "Charge du quotidien", "Observer le volume de ce qui est à porter.", 6, ["charge_1", "charge_2", "charge_3", "charge_4"]),
];

export const QUESTIONNAIRE: Questionnaire = {
  questionnaire_id: "fonctionnement_jour_v2",
  version: "2.0.0",
  language: "fr",
  status: "draft",
  title: "Où en êtes-vous aujourd'hui ?",
  disclaimer: "Cet outil soutient l'observation de soi et ne constitue pas un diagnostic médical.",
  scales: [LIKERT],
  items: ITEMS,
  sections: SECTIONS,
  routes: {
    SUPPORT_IMMEDIATE: { id: "SUPPORT_IMMEDIATE", kind: "support", title: "Besoin de soutien" },
    SUPPORT_ROUTE: { id: "SUPPORT_ROUTE", kind: "support", title: "Un temps pour souffler" },
    OVERLOAD_SUPPORT: { id: "OVERLOAD_SUPPORT", kind: "support", title: "Alléger la charge" },
    DYSREGULATION_SUPPORT: { id: "DYSREGULATION_SUPPORT", kind: "support", title: "Revenir au calme" },
    ANXIETY_SUPPORT: { id: "ANXIETY_SUPPORT", kind: "support", title: "Relâcher la pression" },
    BLOCKAGE_SUPPORT: { id: "BLOCKAGE_SUPPORT", kind: "support", title: "Une première petite étape" },
    WORKLOAD_SUPPORT: { id: "WORKLOAD_SUPPORT", kind: "support", title: "Prioriser en douceur" },
    SUMMARY: { id: "SUMMARY", kind: "summary", title: "Ce que vos réponses montrent aujourd'hui" },
  },
  // Du plus protecteur au moins protecteur.
  route_priority: [
    "SUPPORT_IMMEDIATE",
    "SUPPORT_ROUTE",
    "OVERLOAD_SUPPORT",
    "DYSREGULATION_SUPPORT",
    "ANXIETY_SUPPORT",
    "BLOCKAGE_SUPPORT",
    "WORKLOAD_SUPPORT",
    "SUMMARY",
  ],
  default_route: "SUMMARY",
  branching_rules: [
    {
      id: "protective_immediate",
      priority: 100,
      enabled: true,
      when: {
        any: [
          { fact: "section_score", section_id: "surcharge", operator: "gte", value: 10 },
          { fact: "answer", item_id: "surc_4", operator: "gte", value: 3 },
        ],
      },
      then: { action: "go_to", target: "SUPPORT_IMMEDIATE" },
      fallback: { action: "continue" },
    },
    {
      id: "support_general",
      priority: 90,
      enabled: true,
      when: {
        any: [
          { fact: "section_score", section_id: "regulation", operator: "gte", value: 10 },
          { fact: "section_score", section_id: "anxiete", operator: "gte", value: 10 },
        ],
      },
      then: { action: "go_to", target: "SUPPORT_ROUTE" },
      fallback: { action: "continue" },
    },
    {
      id: "overload",
      priority: 80,
      enabled: true,
      when: { all: [{ fact: "section_score", section_id: "surcharge", operator: "gte", value: 7 }] },
      then: { action: "go_to", target: "OVERLOAD_SUPPORT" },
      fallback: { action: "continue" },
    },
    {
      id: "dysregulation",
      priority: 70,
      enabled: true,
      when: { all: [{ fact: "section_score", section_id: "regulation", operator: "gte", value: 7 }] },
      then: { action: "go_to", target: "DYSREGULATION_SUPPORT" },
      fallback: { action: "continue" },
    },
    {
      id: "anxiety",
      priority: 60,
      enabled: true,
      when: { all: [{ fact: "section_score", section_id: "anxiete", operator: "gte", value: 7 }] },
      then: { action: "go_to", target: "ANXIETY_SUPPORT" },
      fallback: { action: "continue" },
    },
    {
      id: "blockage",
      priority: 50,
      enabled: true,
      when: { all: [{ fact: "section_score", section_id: "blocages", operator: "gte", value: 7 }] },
      then: { action: "go_to", target: "BLOCKAGE_SUPPORT" },
      fallback: { action: "continue" },
    },
    {
      id: "workload",
      priority: 40,
      enabled: true,
      when: { all: [{ fact: "section_score", section_id: "charge", operator: "gte", value: 7 }] },
      then: { action: "go_to", target: "WORKLOAD_SUPPORT" },
      fallback: { action: "continue" },
    },
  ],
};
