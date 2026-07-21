import type { Answers, Condition, Fact, Operator, Questionnaire, Scale } from "./types";

function optionValue(scale: Scale, optionId: string | null | undefined): number | undefined {
  if (!optionId) return undefined;
  return scale.options.find((o) => o.id === optionId)?.value;
}
function maxValue(scale: Scale): number {
  return Math.max(...scale.options.map((o) => o.value));
}

export interface SectionScore {
  sectionId: string;
  noScore: boolean;
  score: number | null;
  answered: number;
  total: number;
  complete: boolean;
  thresholdId: string | null;
  prorated: boolean;
}

export function sectionScore(q: Questionnaire, sectionId: string, answers: Answers): SectionScore {
  const section = q.sections.find((s) => s.id === sectionId);
  if (!section) return { sectionId, noScore: true, score: null, answered: 0, total: 0, complete: false, thresholdId: null, prorated: false };
  const total = section.item_ids.length;
  let sum = 0;
  let answered = 0;
  for (const iid of section.item_ids) {
    const it = q.items.find((x) => x.id === iid);
    if (!it) continue;
    const scale = q.scales.find((s) => s.id === it.scale_id)!;
    const v = optionValue(scale, answers[iid]);
    if (v === undefined) continue;
    const val = it.scoring.reverse_scored ? maxValue(scale) - v : v;
    sum += val * it.scoring.weight;
    answered++;
  }
  if (answered === 0 || answered < section.scoring.minimum_answered) {
    return { sectionId, noScore: true, score: null, answered, total, complete: false, thresholdId: null, prorated: false };
  }
  let score = sum;
  let prorated = false;
  if (answered < total && section.scoring.missing_answer_strategy === "prorate") {
    score = Math.round((sum / answered) * total);
    prorated = true;
  }
  const th = section.scoring.thresholds.find((t) => score >= t.min && score <= t.max);
  return { sectionId, noScore: false, score, answered, total, complete: answered === total, thresholdId: th ? th.id : null, prorated };
}

export function allScores(q: Questionnaire, answers: Answers): SectionScore[] {
  return q.sections.map((s) => sectionScore(q, s.id, answers));
}

function cmp(op: Operator, a: number, b: number): boolean {
  switch (op) {
    case "equals": return a === b;
    case "not_equals": return a !== b;
    case "gt": return a > b;
    case "gte": return a >= b;
    case "lt": return a < b;
    case "lte": return a <= b;
    default: return false;
  }
}

export function evalFact(q: Questionnaire, f: Fact, answers: Answers): boolean {
  if (f.fact === "section_score") {
    const s = sectionScore(q, f.section_id!, answers);
    if (s.noScore || s.score === null) return false; // pas de score fiable => la règle ne se déclenche pas
    if (typeof f.value === "number") return cmp(f.operator, s.score, f.value);
    return false;
  }
  // fact === "answer"
  const it = q.items.find((x) => x.id === f.item_id);
  if (!it) return false;
  const scale = q.scales.find((s) => s.id === it.scale_id)!;
  const raw = answers[f.item_id!];
  const v = optionValue(scale, raw);
  if (f.operator === "answered") return v !== undefined;
  if (f.operator === "unanswered") return v === undefined;
  if (v === undefined) return false;
  if (f.operator === "in" || f.operator === "not_in") {
    const arr = Array.isArray(f.value) ? f.value : [];
    const inSet = arr.some((x) => x === v || x === raw);
    return f.operator === "in" ? inSet : !inSet;
  }
  if (typeof f.value === "number") return cmp(f.operator, v, f.value);
  return false;
}

export function evalCondition(q: Questionnaire, cond: Condition, answers: Answers): boolean {
  if (cond.all && cond.all.length) {
    if (!cond.all.every((f) => evalFact(q, f, answers))) return false;
  }
  if (cond.any && cond.any.length) {
    if (!cond.any.some((f) => evalFact(q, f, answers))) return false;
  }
  // condition vide => vrai (rarement utile)
  return true;
}

export interface RouteDecision {
  route: string;
  reason: string;
  matchedRuleId: string | null;
}

// Applique la règle la PLUS PROTECTRICE : tri par priorité décroissante,
// puis, à priorité égale, par l'ordre route_priority. Aucun code évalué.
export function decideRoute(q: Questionnaire, answers: Answers): RouteDecision {
  const matches = q.branching_rules
    .filter((r) => r.enabled)
    .filter((r) => evalCondition(q, r.when, answers));
  if (matches.length === 0) {
    return { route: q.default_route, reason: "aucune règle déclenchée — route par défaut", matchedRuleId: null };
  }
  const prio = (target: string) => {
    const i = q.route_priority.indexOf(target);
    return i < 0 ? Number.MAX_SAFE_INTEGER : i;
  };
  matches.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return prio(a.then.target) - prio(b.then.target);
  });
  const chosen = matches[0];
  return { route: chosen.then.target, reason: `règle « ${chosen.id} » (priorité ${chosen.priority})`, matchedRuleId: chosen.id };
}
