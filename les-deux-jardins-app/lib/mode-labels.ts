import type { Mode } from "./mode";

export const MODE_LABELS = {
  universel: {
    productSubtitle: "Espace professionnel",
    hero:
      "Un espace professionnel pour accueillir, évaluer, formuler et suivre — fondé sur les preuves, apaisant et respectueux de chaque parcours.",
    adultBrand: "Adultes et familles",
    adultKicker: "Accompagnement psychologique",
    adultTagline: "Comprendre, soutenir, réajuster",
    adultDescription:
      "Anamnèse, repères cliniques, formulation, objectifs, séances et restitutions dans un même suivi.",
    youthBrand: "Enfants, adolescents et parentalité",
    youthKicker: "Accompagnement neuro-éducatif",
    youthTagline: "Observer, adapter, soutenir",
    youthDescription:
      "Repères TND, émotions, apprentissages et parentalité, avec des outils adaptés au développement.",
    cockpitBrand: "Les Deux Jardins",
    synthesisBrand: "Les Deux Jardins",
    synthesisSubtitle: "Lettre d’accompagnement",
    adultGroup: "Accompagnement adulte",
    youthGroup: "Accompagnement neuro-éducatif",
  },
  islamique: {
    productSubtitle: "Accompagnement psycho-spirituel",
    hero:
      "Un même soin qui relie la maman, l’enfant, l’ado et le·la professionnel·le — porté par la sakīna, la baraka et le respect de la fiṭra.",
    adultBrand: "Jannat al Qulûb",
    adultKicker: "Le Jardin du cœur",
    adultTagline: "« Soigner les fleurs et les plantes »",
    adultDescription:
      "Côté maman, femme et adulte — accompagnement psycho-spirituel et suivi praticienne.",
    youthBrand: "Educa Typique",
    youthKicker: "Le Jardin des graines",
    youthTagline: "« Semer les petites graines »",
    youthDescription:
      "Côté enfant, ado et parentalité TND — la neuropédagogie au quotidien, du plus ludique au plus posé.",
    cockpitBrand: "Jannat al Qulûb",
    synthesisBrand: "Jannat al Qulûb",
    synthesisSubtitle: "Le Jardin du cœur",
    adultGroup: "Jannat al Qulûb — Le Jardin du cœur",
    youthGroup: "Educa Typique — Le Jardin des graines",
  },
} as const;

export function labelsForMode(mode: Mode) {
  return MODE_LABELS[mode];
}
