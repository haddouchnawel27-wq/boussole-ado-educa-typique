import { describe, it, expect } from "vitest";
import { QUESTIONNAIRE } from "./questionnaire.v2";
import { validateQuestionnaire } from "./validate";
import { sectionScore, decideRoute, allScores } from "./engine";
import type { Answers, Questionnaire } from "./types";

function ans(map: Record<string, string>): Answers {
  return map;
}
const A3 = "almost_always"; // 3
const A2 = "often"; // 2
const A0 = "never"; // 0

describe("validation du questionnaire de référence", () => {
  it("ne renvoie aucune erreur", () => {
    const r = validateQuestionnaire(QUESTIONNAIRE);
    if (!r.ok) console.error(r.errors);
    expect(r.errors).toEqual([]);
    expect(r.ok).toBe(true);
  });
  it("a bien 6 sections et une échelle Likert 0-3", () => {
    expect(QUESTIONNAIRE.sections).toHaveLength(6);
    expect(QUESTIONNAIRE.scales[0].options.map((o) => o.value)).toEqual([0, 1, 2, 3]);
  });
});

describe("scoring", () => {
  it("score maximum -> seuil very_high", () => {
    const s = sectionScore(QUESTIONNAIRE, "anxiete", ans({ anx_1: A3, anx_2: A3, anx_3: A3, anx_4: A3 }));
    expect(s.score).toBe(12);
    expect(s.thresholdId).toBe("very_high");
    expect(s.complete).toBe(true);
  });
  it("score nul -> seuil low", () => {
    const s = sectionScore(QUESTIONNAIRE, "anxiete", ans({ anx_1: A0, anx_2: A0, anx_3: A0, anx_4: A0 }));
    expect(s.score).toBe(0);
    expect(s.thresholdId).toBe("low");
  });
  it("réponses manquantes : prorata au-dessus du minimum", () => {
    // 3 réponses « souvent » (2) = 6 ; prorata sur 4 items = round(6/3*4)=8 -> high
    const s = sectionScore(QUESTIONNAIRE, "anxiete", ans({ anx_1: A2, anx_2: A2, anx_3: A2 }));
    expect(s.answered).toBe(3);
    expect(s.prorated).toBe(true);
    expect(s.score).toBe(8);
    expect(s.thresholdId).toBe("high");
  });
  it("trop peu de réponses -> pas de score", () => {
    const s = sectionScore(QUESTIONNAIRE, "anxiete", ans({ anx_1: A3, anx_2: A3 }));
    expect(s.noScore).toBe(true);
    expect(s.score).toBeNull();
  });
  it("une réponse passée ne vaut pas zéro", () => {
    // 3 réponses à 3 (=9), la 4e passée -> answered 3, prorata round(9/3*4)=12 (et non (9+0)=9)
    const s = sectionScore(QUESTIONNAIRE, "anxiete", ans({ anx_1: A3, anx_2: A3, anx_3: A3 }));
    expect(s.score).toBe(12);
  });
});

describe("branching — route la plus protectrice d'abord", () => {
  it("surcharge très élevée -> SUPPORT_IMMEDIATE (prioritaire sur overload)", () => {
    const d = decideRoute(QUESTIONNAIRE, ans({ surc_1: A3, surc_2: A3, surc_3: A3, surc_4: A3 }));
    expect(d.route).toBe("SUPPORT_IMMEDIATE");
  });
  it("anxiété élevée seule -> ANXIETY_SUPPORT", () => {
    const d = decideRoute(QUESTIONNAIRE, ans({ anx_1: A3, anx_2: A2, anx_3: A2, anx_4: A2 })); // 9 -> high
    expect(d.route).toBe("ANXIETY_SUPPORT");
  });
  it("blocages élevés + charge élevée -> le plus protecteur (BLOCKAGE avant WORKLOAD)", () => {
    const d = decideRoute(
      QUESTIONNAIRE,
      ans({ bloc_1: A3, bloc_2: A2, bloc_3: A2, bloc_4: A2, charge_1: A3, charge_2: A2, charge_3: A2, charge_4: A2 })
    );
    expect(d.route).toBe("BLOCKAGE_SUPPORT");
  });
  it("tout bas -> route par défaut SUMMARY", () => {
    const d = decideRoute(QUESTIONNAIRE, ans({ anx_1: A0, anx_2: A0, anx_3: A0, anx_4: A0 }));
    expect(d.route).toBe("SUMMARY");
    expect(d.matchedRuleId).toBeNull();
  });
  it("aucune réponse fiable -> SUMMARY (pas de score => pas de règle)", () => {
    const d = decideRoute(QUESTIONNAIRE, ans({}));
    expect(d.route).toBe("SUMMARY");
  });
});

describe("le validateur détecte les erreurs", () => {
  function clone(): Questionnaire {
    return structuredClone(QUESTIONNAIRE);
  }
  it("opérateur interdit", () => {
    const q = clone();
    (q.branching_rules[0].when.any as any)[0].operator = "between";
    const r = validateQuestionnaire(q);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("opérateur interdit"))).toBe(true);
  });
  it("cible de route inexistante", () => {
    const q = clone();
    q.branching_rules[0].then.target = "NULLE_PART";
    const r = validateQuestionnaire(q);
    expect(r.errors.some((e) => e.includes("cible inexistante"))).toBe(true);
  });
  it("trou dans les seuils", () => {
    const q = clone();
    q.sections[0].scoring.thresholds[1].min = 5; // crée un trou (low finit à 3, moderate commence à 5)
    const r = validateQuestionnaire(q);
    expect(r.errors.some((e) => e.includes("trou ou chevauchement"))).toBe(true);
  });
  it("règle sans fallback", () => {
    const q = clone();
    delete (q.branching_rules[0] as any).fallback;
    const r = validateQuestionnaire(q);
    expect(r.errors.some((e) => e.includes("sans fallback"))).toBe(true);
  });
  it("item sensible non passable", () => {
    const q = clone();
    const it = q.items.find((x) => x.id === "surc_4")!;
    it.allow_skip = false;
    const r = validateQuestionnaire(q);
    expect(r.errors.some((e) => e.includes("doit être passable"))).toBe(true);
  });
});
