// Anamnèse structurée native (miroir fidèle de l'outil « Voie Chifa »).
// ~70 items, 10 sections. Stockée dans la fiche (colonne bilan.anamnese : clé → valeur).
// Jamais un diagnostic : un recueil structuré. Les alertes priment toujours sur le reste.

export type AnaFieldType = "text" | "long" | "choice" | "scale";

export interface AnaField {
  key: string; // unique dans toute l'anamnèse (préfixe s1_… s10_)
  label: string;
  type: AnaFieldType;
  options?: string[]; // pour "choice"
  minLabel?: string; // pour "scale" (0)
  maxLabel?: string; // pour "scale" (10)
  star?: boolean; // ⭐ repère spirituel
  danger?: boolean; // 🚨 item sensible
  islamicOnly?: boolean;
  universalLabel?: string;
}

export interface AnaSection {
  key: string;
  titre: string;
  fields: AnaField[];
  islamicOnly?: boolean;
}

export const ANAMNESE: AnaSection[] = [
  {
    key: "s1",
    titre: "1 · Identité & motif de consultation",
    fields: [
      { key: "s1_initiales", label: "Initiales (confidentialité)", type: "text" },
      { key: "s1_age", label: "Âge", type: "text" },
      { key: "s1_genre", label: "Genre", type: "choice", options: ["Femme", "Homme", "Autre / préfère ne pas dire"] },
      { key: "s1_famille", label: "Situation familiale", type: "choice", options: ["Célibataire", "En couple", "Marié·e", "Divorcé·e / séparé·e", "Veuf·ve"] },
      { key: "s1_enfants", label: "Enfants (nombre + âges)", type: "text" },
      { key: "s1_profession", label: "Situation professionnelle (si utile pour la demande)", type: "text" },
      { key: "s1_reperes_interculturels", label: "Repères culturels, familiaux, linguistiques ou spirituels dont la personne souhaite que l'on tienne compte", type: "long" },
      { key: "s1_pressions_sociales", label: "Attentes, pressions ou interdits sociaux / familiaux vécus", type: "long" },
      { key: "s1_mandats", label: "Rôles, loyautés ou mandats générationnels / sociaux ressentis", type: "long" },
      { key: "s1_decalage_culturel", label: "Migration, discrimination, décalage culturel ou isolement éventuels (si la personne souhaite en parler)", type: "long" },
      { key: "s1_motif", label: "Motif principal de consultation", type: "long" },
      { key: "s1_depuis", label: "Depuis combien de temps ces difficultés ?", type: "text" },
      { key: "s1_attentes", label: "Attentes de la thérapie", type: "text" },
      { key: "s1_source", label: "Comment avez-vous trouvé le cabinet ?", type: "text" },
    ],
  },
  {
    key: "s2",
    titre: "2 · Antécédents médicaux",
    fields: [
      { key: "s2_chroniques", label: "Maladies chroniques actuelles", type: "long" },
      { key: "s2_hospit", label: "Hospitalisations passées", type: "long" },
      { key: "s2_chirurgies", label: "Chirurgies", type: "long" },
      { key: "s2_allergies", label: "Allergies (médicaments, alimentaires)", type: "text" },
      { key: "s2_traitements", label: "Traitements actuels (avec dosage)", type: "long" },
      { key: "s2_bilan", label: "Dernier bilan biologique (date + résultats notables)", type: "long" },
      { key: "s2_cycle", label: "Cycle / hormonal (régulier ? troubles ? contraception ?)", type: "long" },
      { key: "s2_grossesse", label: "Grossesse en cours ou récente ?", type: "choice", options: ["Non", "En cours", "Récente <1 an", "N/A"] },
    ],
  },
  {
    key: "s3",
    titre: "3 · Antécédents psy / psychiatriques",
    fields: [
      { key: "s3_suivis", label: "Suivis psy antérieurs (psychologue, psychiatre, autre)", type: "long" },
      { key: "s3_hospit", label: "Hospitalisations psy", type: "long" },
      { key: "s3_psychotropes", label: "Traitements psychotropes (actuels ou anciens)", type: "long" },
      { key: "s3_diagnostics", label: "Diagnostic(s) psy déjà posé(s)", type: "text" },
      { key: "s3_suicide", label: "Tentatives de suicide ou idées suicidaires", type: "choice", danger: true, options: ["Jamais", "Idées passagères passées", "Idées actuelles", "Tentative passée", "Tentative récente"] },
      { key: "s3_famille", label: "ATCD psy dans la famille", type: "long" },
    ],
  },
  {
    key: "s4",
    titre: "4 · Antécédents spirituels & parcours de foi",
    islamicOnly: true,
    fields: [
      { key: "s4_parcours", label: "Parcours de foi", type: "choice", options: ["Née musulmane, pratique stable", "Née musulmane, pratique tardive", "Reconvertie", "Conversion à l'âge adulte"] },
      { key: "s4_prieres", label: "Régularité prières (5 par jour)", type: "scale", minLabel: "Jamais", maxLabel: "Toujours 5/5" },
      { key: "s4_coran", label: "Régularité lecture Coran", type: "choice", options: ["Quotidien", "Plusieurs fois/sem", "Hebdo", "Rare", "Jamais"] },
      { key: "s4_adhkar", label: "Adhkâr matin/soir", type: "choice", options: ["Quotidien", "Souvent", "Parfois", "Rarement", "Jamais"] },
      { key: "s4_trauma", label: "Trauma religieux (rigorisme blessant, secte, communauté toxique)", type: "long" },
      { key: "s4_crise", label: "Crise de foi vécue", type: "long" },
      { key: "s4_roqya", label: "Pratique roqya antérieure (qui, pour quoi, durée, résultat)", type: "long" },
      { key: "s4_sentiment", label: "Sentiment actuel par rapport à Allāh", type: "long" },
    ],
  },
  {
    key: "s5",
    titre: "5 · Histoire de vie & attachement",
    fields: [
      { key: "s5_enfance", label: "Comment décrivez-vous votre enfance ?", type: "choice", options: ["Heureuse", "Mixte", "Difficile", "Très difficile / traumatique"] },
      { key: "s5_pere", label: "Relation au père (enfance + actuelle)", type: "long" },
      { key: "s5_mere", label: "Relation à la mère (enfance + actuelle)", type: "long" },
      { key: "s5_fratrie", label: "Fratrie (rang, relations)", type: "long" },
      { key: "s5_trauma", label: "Trauma majeurs (deuils, violences, accidents, agressions sexuelles)", type: "long" },
      { key: "s5_etapes", label: "Étapes-clés de la vie (mariage, divorce, déménagement, conversion…)", universalLabel: "Étapes-clés de la vie (mariage, séparation, deuil, déménagement…)", type: "long" },
    ],
  },
  {
    key: "s6",
    titre: "6 · Mode de vie actuel",
    fields: [
      { key: "s6_sommeil_h", label: "Sommeil — heures par nuit en moyenne", type: "text" },
      { key: "s6_sommeil_q", label: "Qualité du sommeil", type: "scale", minLabel: "Très mauvaise", maxLabel: "Excellente" },
      { key: "s6_alim", label: "Alimentation — équilibrée et régulière ?", type: "scale", minLabel: "Pas du tout", maxLabel: "Très" },
      { key: "s6_sport", label: "Activité physique (jours par semaine)", type: "text" },
      { key: "s6_ecrans", label: "Écrans (heures par jour hors travail)", type: "text" },
      { key: "s6_nature", label: "Sorties nature / lumière du jour", type: "choice", options: ["Quotidien", "Plusieurs fois/sem", "Hebdo", "Rare", "Jamais"] },
      { key: "s6_cafe", label: "Café (tasses/j)", type: "text" },
      { key: "s6_tabac", label: "Tabac", type: "choice", options: ["Non", "Ex-fumeuse", "Occasionnel", "Régulier", "Important"] },
      { key: "s6_alcool", label: "Alcool / drogues", type: "long" },
    ],
  },
  {
    key: "s7",
    titre: "7 · Relations actuelles",
    fields: [
      { key: "s7_couple_q", label: "Couple — qualité actuelle", type: "scale", minLabel: "Très mauvaise", maxLabel: "Excellente" },
      { key: "s7_couple", label: "Couple — points-clés (conflits, intimité, projets)", type: "long" },
      { key: "s7_enfants", label: "Relation aux enfants", type: "long" },
      { key: "s7_famille", label: "Relations famille élargie (parents, beaux-parents, fratrie)", type: "long" },
      { key: "s7_amis", label: "Réseau d'amis et soutien social", type: "scale", minLabel: "Aucun", maxLabel: "Très fort" },
      { key: "s7_communaute", label: "Communauté / mosquée / halaqa", universalLabel: "Réseau communautaire, associatif ou spirituel si pertinent", type: "long" },
    ],
  },
  {
    key: "s8",
    titre: "8 · Spiritualité actuelle (pratique vivante)",
    islamicOnly: true,
    fields: [
      { key: "s8_khoushou", label: "Présence dans la prière (khoushou')", type: "scale", minLabel: "Aucune", maxLabel: "Forte" },
      { key: "s8_coran", label: "Lien actuel au Coran", type: "scale", minLabel: "Distant", maxLabel: "Très vivant" },
      { key: "s8_adhkar", label: "Adhkâr matin/soir maintenus ?", type: "scale", minLabel: "Jamais", maxLabel: "Tous les jours" },
      { key: "s8_mosquee", label: "Fréquence mosquée / halaqa", type: "choice", options: ["Quotidien", "Hebdo", "Mensuel", "Rare", "Jamais"] },
      { key: "s8_sadaqa", label: "Sadaqa régulière ?", type: "choice", options: ["Quotidienne", "Hebdo", "Mensuel", "Occasionnelle", "Rare"] },
      { key: "s8_noms", label: "Beaux Noms d'Allāh travaillés / médités", type: "long", star: true },
      { key: "s8_ressources", label: "Ressources spirituelles utilisées (lives, livres, podcasts)", type: "long" },
    ],
  },
  {
    key: "s9",
    titre: "9 · Évaluation symptômes globaux (subjectif)",
    fields: [
      { key: "s9_souffrance", label: "Niveau de souffrance global", type: "scale", minLabel: "Aucune", maxLabel: "Insupportable" },
      { key: "s9_anxiete", label: "Anxiété / angoisse", type: "scale", minLabel: "Aucune", maxLabel: "Constante" },
      { key: "s9_tristesse", label: "Tristesse / ḥuzn", universalLabel: "Tristesse", type: "scale", minLabel: "Aucune", maxLabel: "Profonde" },
      { key: "s9_colere", label: "Colère / irritabilité", type: "scale", minLabel: "Aucune", maxLabel: "Constante" },
      { key: "s9_espoir", label: "Espoir / rajā'", universalLabel: "Espoir", type: "scale", star: true, minLabel: "Aucun", maxLabel: "Très présent" },
      { key: "s9_sakina", label: "Paix intérieure (sakīna)", universalLabel: "Paix intérieure", type: "scale", minLabel: "Aucune", maxLabel: "Très bonne" },
      { key: "s9_tawakkul", label: "Confiance en Allāh (tawakkul)", type: "scale", star: true, islamicOnly: true, minLabel: "Difficile", maxLabel: "Très forte" },
      { key: "s9_qunut", label: "Présence de désespoir (qunūṭ) ?", universalLabel: "Présence de désespoir ?", type: "choice", danger: true, options: ["Aucun", "Passager", "Présent", "Envahissant — urgence"] },
    ],
  },
  {
    key: "s10",
    titre: "10 · Demande, objectifs & engagement",
    fields: [
      { key: "s10_pourquoi", label: "Pourquoi maintenant ? (élément déclencheur)", type: "long" },
      { key: "s10_essaye", label: "Qu'avez-vous déjà essayé ? Qu'est-ce qui a aidé ?", type: "long" },
      { key: "s10_objectif", label: "Objectif principal de la thérapie", type: "long" },
      { key: "s10_engagement", label: "Engagement personnel dans la démarche", type: "scale", minLabel: "Très faible", maxLabel: "Total" },
      { key: "s10_obstacles", label: "Obstacles potentiels (temps, finances, soutien…)", type: "long" },
      { key: "s10_autres", label: "Autres choses importantes à savoir", type: "long" },
    ],
  },
];

export interface AnaAlert {
  level: "rouge";
  titre: string;
  message: string;
}

export function anamneseForMode(islamic: boolean): AnaSection[] {
  return ANAMNESE
    .filter((section) => islamic || !section.islamicOnly)
    .map((section) => ({
      ...section,
      fields: section.fields.filter((field) => islamic || !field.islamicOnly),
    }));
}

export function anamneseFieldLabel(field: AnaField, islamic: boolean): string {
  return islamic ? field.label : field.universalLabel ?? field.label;
}

export function anamneseSectionTitle(section: AnaSection, index: number, islamic: boolean): string {
  if (islamic) return section.titre;
  return `${index + 1} · ${section.titre.replace(/^\d+\s*·\s*/, "")}`;
}

/**
 * Alertes de sécurité de l'anamnèse — priment sur tout le reste.
 *  1) Item suicide (§3) : idées actuelles / tentative passée / tentative récente.
 *  2) Désespoir qunūṭ (§9) : « Présent » ou « Envahissant — urgence ».
 */
export function anamneseAlerts(a: Record<string, string> | undefined): AnaAlert[] {
  const out: AnaAlert[] = [];
  const v = a ?? {};
  if (["Idées actuelles", "Tentative récente"].includes(v.s3_suicide)) {
    out.push({ level: "rouge", titre: "Risque suicidaire actuel signalé (section 3)", message: "Interrompre le questionnaire, évaluer immédiatement la sécurité et appliquer le protocole d'urgence ou d'orientation adapté." });
  } else if (v.s3_suicide === "Tentative passée") {
    out.push({ level: "rouge", titre: "Antécédent suicidaire signalé (section 3)", message: "Explorer le risque actuel en priorité et prévoir l'orientation adaptée." });
  }
  if (["Présent", "Envahissant — urgence"].includes(v.s9_qunut)) {
    out.push({ level: "rouge", titre: "Désespoir signalé (section 9)", message: "Évaluer la sécurité et le risque suicidaire en priorité avant de poursuivre l'accompagnement." });
  }
  return out;
}

/** Repères spirituels à afficher côte à côte dans le CR (aucun verdict, juste les 3 valeurs). */
export function reperesSpirituels(a: Record<string, string> | undefined): { espoir: string; tawakkul: string; qunut: string } {
  const v = a ?? {};
  return {
    espoir: v.s9_espoir ?? "",
    tawakkul: v.s9_tawakkul ?? "",
    qunut: v.s9_qunut ?? "",
  };
}
