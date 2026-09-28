import { describe, expect, it } from "vitest";
import { EMPTY_SRCA, guardedClinicalStep, hasSuicideAlert, srcaAfterRiskFieldChange, srcaReadiness, validateBilanCloture } from "./clinical-rules";

describe("verrou S·R·C·A", () => {
  it("exige les quatre critères avant Évaluer", () => {
    expect(srcaReadiness({}, { ...EMPTY_SRCA, securite: true, regulation: true, continuite: true }).canEvaluate).toBe(false);
    expect(srcaReadiness({}, { ...EMPTY_SRCA, securite: true, regulation: true, continuite: true, alliance: true }).canEvaluate).toBe(true);
  });
  it("exige le relais puis une sécurité cochée manuellement en présence d'une alerte", () => {
    const ana = { s3_suicide: "Tentative passée" };
    expect(hasSuicideAlert(ana)).toBe(true);
    expect(srcaReadiness(ana, { ...EMPTY_SRCA, securite: true, regulation: true, continuite: true, alliance: true }).canEvaluate).toBe(false);
    expect(srcaReadiness(ana, { ...EMPTY_SRCA, conduiteTenirEffectuee: true, securite: true, regulation: true, continuite: true, alliance: true }).canEvaluate).toBe(true);
  });
  it("ramène une URL d'étape protégée au Bilan", () => {
    expect(guardedClinicalStep("cloture", false)).toBe("bilan");
    expect(guardedClinicalStep("evaluer", true)).toBe("evaluer");
  });
  it("réinitialise Sécurité et la conduite à tenir quand un déclencheur change", () => {
    const ready = { ...EMPTY_SRCA, securite: true, conduiteTenirEffectuee: true };
    expect(srcaAfterRiskFieldChange("s3_suicide", ready)).toMatchObject({ securite: false, conduiteTenirEffectuee: false });
    expect(srcaAfterRiskFieldChange("s9_qunut", ready)).toMatchObject({ securite: false, conduiteTenirEffectuee: false });
  });
});

describe("bilan de clôture", () => {
  it("refuse une clôture incomplète", () => {
    expect(validateBilanCloture({ demandeInitiale: "", objectifs: [], ressourcesMobilisees: [], outilsConserves: [], autonomieRelais: { notes: "", relaisNecessaire: true }, reorientation: { necessaire: false, details: "" }, dateCloture: "", praticienneValidation: { nom: "", valideAt: "" } })).toHaveLength(4);
  });
});
