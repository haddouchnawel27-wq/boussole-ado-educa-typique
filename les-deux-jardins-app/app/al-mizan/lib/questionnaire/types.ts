// ════════════════════════════════════════════════════════════
// Al Mizan — modèle de données du questionnaire adaptatif
// Déclaratif : aucune condition n'est du code JS (pas d'eval).
// ════════════════════════════════════════════════════════════

export const OPERATORS = [
  "equals",
  "not_equals",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "not_in",
  "answered",
  "unanswered",
] as const;
export type Operator = (typeof OPERATORS)[number];

export interface ScaleOption {
  id: string;
  value: number;
  label: string;
}
export interface Scale {
  id: string;
  type: "single_choice";
  ordered: boolean;
  options: ScaleOption[];
}

export type Sensitivity = "low" | "moderate" | "high";

export interface Item {
  id: string;
  section_id: string;
  prompt: string;
  scale_id: string;
  required: boolean;
  allow_skip: boolean;
  reference_period: string;
  scoring: { dimension: string; weight: number; reverse_scored: boolean };
  content: { helper_text?: string; reassurance?: string; skip_label: string };
  sensitivity: Sensitivity;
}

export interface Threshold {
  id: "low" | "moderate" | "high" | "very_high";
  min: number;
  max: number;
}
export type MissingStrategy = "prorate" | "no_score" | "partial_score";

export interface Section {
  id: string;
  label: string; // libellé utilisateur (moins médicalisant)
  purpose: string;
  order: number;
  progress: { current: number; total: number; label: string };
  scoring: {
    method: "weighted_sum";
    minimum_answered: number;
    missing_answer_strategy: MissingStrategy;
    thresholds: Threshold[];
  };
  item_ids: string[];
}

export interface Fact {
  fact: "section_score" | "answer";
  section_id?: string;
  item_id?: string;
  operator: Operator;
  value?: number | string | (number | string)[];
}
export interface Condition {
  all?: Fact[];
  any?: Fact[];
}
export interface Rule {
  id: string;
  priority: number;
  enabled: boolean;
  when: Condition;
  then: { action: "go_to"; target: string };
  fallback: { action: "continue" | "go_to"; target?: string };
}

export interface RouteDef {
  id: string;
  kind: "start" | "assessment" | "support" | "summary";
  title: string;
}

export interface Questionnaire {
  questionnaire_id: string;
  version: string;
  language: string;
  status: "draft" | "published";
  title: string;
  disclaimer: string;
  scales: Scale[];
  items: Item[];
  sections: Section[];
  branching_rules: Rule[];
  routes: Record<string, RouteDef>;
  route_priority: string[]; // du plus protecteur au moins protecteur
  default_route: string;
}

// Réponses de l'utilisatrice : item_id -> id d'option (ou null = passé)
export type Answers = Record<string, string | null>;
