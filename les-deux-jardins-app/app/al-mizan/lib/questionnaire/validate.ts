import { OPERATORS, type Questionnaire, type Scale } from "./types";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

function dupes(ids: string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dup.add(id);
    seen.add(id);
  }
  return [...dup];
}
function maxOptionValue(scale: Scale): number {
  return Math.max(...scale.options.map((o) => o.value));
}

export function validateQuestionnaire(q: Questionnaire): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const E = (m: string) => errors.push(m);
  const W = (m: string) => warnings.push(m);

  const scaleIds = new Set(q.scales.map((s) => s.id));
  const itemIds = new Set(q.items.map((i) => i.id));
  const sectionIds = new Set(q.sections.map((s) => s.id));
  const routeIds = new Set(Object.keys(q.routes));

  // 1. doublons
  for (const [label, list] of [
    ["échelle", q.scales.map((s) => s.id)],
    ["item", q.items.map((i) => i.id)],
    ["section", q.sections.map((s) => s.id)],
    ["règle", q.branching_rules.map((r) => r.id)],
  ] as const) {
    for (const d of dupes(list)) E(`Identifiant ${label} en double : « ${d} »`);
  }

  // 2. items : scale + section existent, cohérence section_id
  for (const it of q.items) {
    if (!scaleIds.has(it.scale_id)) E(`Item « ${it.id} » référence une échelle inexistante « ${it.scale_id} »`);
    if (!sectionIds.has(it.section_id)) E(`Item « ${it.id} » référence une section inexistante « ${it.section_id} »`);
    if (it.sensitivity === "high" && !it.allow_skip) E(`Item sensible « ${it.id} » doit être passable (allow_skip)`);
    if (it.required && it.allow_skip === false && it.sensitivity !== "low") {
      W(`Item « ${it.id} » : required + non passable sur un item sensible — à vérifier`);
    }
  }

  // 3. sections : items existent, appartenance, progression
  const itemToSection = new Map<string, string>();
  const orders = new Set<number>();
  for (const sec of q.sections) {
    if (sec.progress.total !== 6) E(`Section « ${sec.id} » : progress.total devrait être 6 (trouvé ${sec.progress.total})`);
    if (sec.progress.current !== sec.order) E(`Section « ${sec.id} » : progress.current (${sec.progress.current}) ≠ order (${sec.order})`);
    if (sec.progress.label !== `Bloc ${sec.order} sur 6`) E(`Section « ${sec.id} » : libellé de progression incorrect « ${sec.progress.label} »`);
    if (orders.has(sec.order)) E(`Ordre de section en double : ${sec.order}`);
    orders.add(sec.order);
    for (const iid of sec.item_ids) {
      if (!itemIds.has(iid)) E(`Section « ${sec.id} » référence un item inexistant « ${iid} »`);
      if (itemToSection.has(iid)) E(`Item « ${iid} » appartient à plusieurs sections`);
      itemToSection.set(iid, sec.id);
    }
    // seuils : couverture 0..maxScore sans trou ni chevauchement
    const maxScore = sec.item_ids.reduce((acc, iid) => {
      const it = q.items.find((x) => x.id === iid);
      if (!it) return acc;
      const sc = q.scales.find((s) => s.id === it.scale_id);
      return acc + (sc ? maxOptionValue(sc) * it.scoring.weight : 0);
    }, 0);
    const th = [...sec.scoring.thresholds].sort((a, b) => a.min - b.min);
    if (th.length === 0) E(`Section « ${sec.id} » : aucun seuil`);
    else {
      if (th[0].min !== 0) E(`Section « ${sec.id} » : le premier seuil doit commencer à 0`);
      if (th[th.length - 1].max !== maxScore) E(`Section « ${sec.id} » : le dernier seuil doit finir à ${maxScore} (trouvé ${th[th.length - 1].max})`);
      for (let i = 1; i < th.length; i++) {
        if (th[i].min !== th[i - 1].max + 1) E(`Section « ${sec.id} » : trou ou chevauchement de seuils entre ${th[i - 1].id} et ${th[i].id}`);
      }
    }
    if (sec.scoring.minimum_answered > sec.item_ids.length) E(`Section « ${sec.id} » : minimum_answered > nombre d'items`);
  }
  // tout item appartient à une section
  for (const it of q.items) {
    if (!itemToSection.has(it.id)) E(`Item « ${it.id} » n'est référencé par aucune section`);
    else if (itemToSection.get(it.id) !== it.section_id) E(`Item « ${it.id} » : section_id (${it.section_id}) ≠ section qui le contient (${itemToSection.get(it.id)})`);
  }

  // 4. règles : opérateurs, refs, fallback, cibles
  for (const r of q.branching_rules) {
    if (!r.fallback) E(`Règle « ${r.id} » sans fallback`);
    if (!routeIds.has(r.then.target)) E(`Règle « ${r.id} » : cible inexistante « ${r.then.target} »`);
    if (r.fallback?.action === "go_to" && r.fallback.target && !routeIds.has(r.fallback.target)) E(`Règle « ${r.id} » : cible de fallback inexistante « ${r.fallback.target} »`);
    const facts = [...(r.when.all ?? []), ...(r.when.any ?? [])];
    if (facts.length === 0) E(`Règle « ${r.id} » : condition vide`);
    for (const f of facts) {
      if (!OPERATORS.includes(f.operator)) E(`Règle « ${r.id} » : opérateur interdit « ${f.operator} »`);
      if (f.fact === "section_score" && (!f.section_id || !sectionIds.has(f.section_id))) E(`Règle « ${r.id} » : section inexistante « ${f.section_id} »`);
      if (f.fact === "answer" && (!f.item_id || !itemIds.has(f.item_id))) E(`Règle « ${r.id} » : item inexistant « ${f.item_id} »`);
    }
  }

  // 5. routes / priorité / défaut
  if (!routeIds.has(q.default_route)) E(`Route par défaut inexistante « ${q.default_route} »`);
  for (const t of q.route_priority) if (!routeIds.has(t)) E(`route_priority référence une route inexistante « ${t} »`);
  for (const r of q.branching_rules) {
    if (!q.route_priority.includes(r.then.target)) E(`Cible « ${r.then.target} » (règle ${r.id}) absente de route_priority`);
  }
  // aucune cible de règle ne doit être une section (empêche une boucle de navigation)
  for (const r of q.branching_rules) {
    if (sectionIds.has(r.then.target)) E(`Règle « ${r.id} » cible une section (${r.then.target}) — risque de boucle`);
  }

  return { ok: errors.length === 0, errors, warnings };
}
