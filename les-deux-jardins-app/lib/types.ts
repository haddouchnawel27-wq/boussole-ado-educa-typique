// Modèle de données du cockpit (démo locale — miroir du futur schéma Supabase).
export type Meteo = "beau" | "voile" | "averse" | "orage";

export interface Seance {
  date: string;
  meteo: Meteo;
  notes: string;
  axes: string;
}

export interface SyntheseSection {
  t: string;
  x: string;
}

export interface Synthese {
  status: "vierge" | "brouillon" | "valide";
  sections: SyntheseSection[];
  boussole: string;
  semaine: string;
  duaIdx: number;
}

export interface QResponse {
  id: string;
  questionnaireId: string;
  score: number;
  scoreMax: number;
  answers: Record<string, number>;
  date: string;
}

export type SrcaCriterion = "securite" | "regulation" | "continuite" | "alliance";
export type SrcaState = Record<SrcaCriterion, boolean> & {
  conduiteTenirEffectuee: boolean;
};

export type ObjectifClotureStatut = "atteint" | "partiellement_atteint" | "non_atteint";
export interface ObjectifCloture {
  id: string;
  texte: string;
  statut: ObjectifClotureStatut;
}
export interface BilanCloture {
  demandeInitiale: string;
  objectifs: ObjectifCloture[];
  ressourcesMobilisees: string[];
  outilsConserves: string[];
  autonomieRelais: { notes: string; relaisNecessaire: boolean };
  reorientation: { necessaire: boolean; details: string };
  dateCloture: string;
  praticienneValidation: { nom: string; valideAt: string };
}

export type AnalysisDoor = "jannat" | "educa";
export type HypothesisDecision = "proposed" | "retained" | "nuanced" | "pending" | "refuted";
export type AnalysisPriority = "explore" | "document" | "monitor" | "priority" | "orientation";

/**
 * Une carte proposée par le moteur commun. Elle reste une hypothèse de travail
 * tant que la praticienne ne l'a pas explicitement retenue ou nuancée.
 */
export interface AnalysisHypothesis {
  id: string;
  door: AnalysisDoor;
  domain: string;
  title: string;
  rationale: string;
  supports: string[];
  nuances: string[];
  missing: string[];
  alternatives: string[];
  axes: string[];
  protocols: string[];
  priority: AnalysisPriority;
  decision: HypothesisDecision;
  practitionerNote: string;
  source: string;
}

export interface AnalysisDraft {
  version: 1;
  door: AnalysisDoor;
  generatedAt: string;
  inputSummary: string;
  hypotheses: AnalysisHypothesis[];
  formulationStatus: "a_revoir" | "confirmee";
  formulationConfirmedAt?: string;
}

export interface Client {
  id: string;
  nom: string;
  initiale: string;
  etape: number;
  consentement: boolean;
  intention: string;
  rdv: string;
  bilan: {
    histoire: string;
    schemas: string;
    neuro: string;
    spirituel: string;
    // Étapes praticienne du Fil des Deux Jardins : champs de travail, jamais un diagnostic.
    etatDesLieux?: string;
    cartographie?: string;
    hypotheses?: string;
    objectifs?: string;
    stabilise?: boolean;
    // Anamnèse universelle native : 10 sections (clé → texte). Colonne JSON, rétro-compatible.
    anamnese?: Record<string, string>;
    // Scores d'appui 0-10 (sentiment d'être soutenue · relation à Allāh).
    scores?: { soutien?: number; relationAllah?: number };
    srca?: SrcaState;
    // Proposition issue du moteur commun ; jamais validée automatiquement.
    analysis?: AnalysisDraft;
  };
  bilanCloture?: BilanCloture;
  seances: Seance[];
  engagements: string[];
  synthese: Synthese;
}

export interface Dua {
  etat: string;
  ar: string;
  ph: string;
  fr: string;
  src: string;
  source_type: "quran" | "hadith" | "validated_corpus";
  reference: string;
  verification_status: "verified" | "pending" | "excluded";
  verified_by: string;
  verified_at: string;
}

export interface Step {
  k: string;
  n: number;
  t: string;
}
