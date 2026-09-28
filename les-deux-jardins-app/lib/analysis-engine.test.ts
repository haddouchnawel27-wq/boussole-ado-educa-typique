import { describe, expect, it } from "vitest";
import { buildAnalysisPacket, formulationFromAnalysis, generateAnalysisDraft } from "./analysis-engine";
import type { Client } from "./types";

function fictionalClient(): Client {
  return {
    id: "fictional-1", nom: "Jardin test", initiale: "J", etape: 2, consentement: true,
    intention: "Retrouver un équilibre après plusieurs changements", rdv: "",
    bilan: {
      histoire: "", schemas: "", neuro: "Fatigue attentionnelle à observer", spirituel: "",
      anamnese: {
        s1_motif: "Surcharge et culpabilité", s1_mandats: "Doit tout porter sans demander d'aide",
        s5_etapes: "Changement professionnel récent", s6_sommeil_q: "3", s9_anxiete: "7",
        s9_tristesse: "4", s10_objectif: "Retrouver une organisation soutenable", s4_sentiment: "Cherche un apaisement",
      },
    },
    seances: [], engagements: [], synthese: { status: "vierge", sections: [], boussole: "", semaine: "", duaIdx: 0 },
  };
}

describe("moteur d'analyse commun", () => {
  it("transporte réellement l'anamnèse vers le paquet d'analyse", () => {
    const packet = buildAnalysisPacket(fictionalClient(), [], false);
    expect(packet).toContain("Surcharge et culpabilité");
    expect(packet).toContain("Changement professionnel récent");
  });

  it("propose des pistes sans les retenir automatiquement", () => {
    const draft = generateAnalysisDraft(fictionalClient(), [], "jannat", false);
    expect(draft.hypotheses.length).toBeGreaterThan(2);
    expect(draft.hypotheses.every((item) => item.decision === "proposed")).toBe(true);
    expect(draft.formulationStatus).toBe("a_revoir");
  });

  it("n'ajoute la lecture spirituelle Jannat que dans le mode islamique", () => {
    const universal = generateAnalysisDraft(fictionalClient(), [], "jannat", false);
    const islamic = generateAnalysisDraft(fictionalClient(), [], "jannat", true);
    expect(universal.hypotheses.some((item) => item.domain.includes("spiritualité"))).toBe(false);
    expect(islamic.hypotheses.some((item) => item.domain.includes("spiritualité"))).toBe(true);
  });

  it("crée une pré-formulation modifiable depuis les décisions de la praticienne", () => {
    const draft = generateAnalysisDraft(fictionalClient(), [], "educa", false);
    draft.hypotheses[0].decision = "retained";
    draft.hypotheses[0].practitionerNote = "À croiser avec le sommeil";
    const form = formulationFromAnalysis(draft);
    expect(form.hypotheses).toContain("[Retenue]");
    expect(form.hypotheses).toContain("À croiser avec le sommeil");
    expect(form.cartographie.length).toBeGreaterThan(20);
  });
});
