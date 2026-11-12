import type { BilanCloture, SrcaState } from "./types";

export const EMPTY_SRCA: SrcaState = {
  securite: false,
  regulation: false,
  continuite: false,
  alliance: false,
  conduiteTenirEffectuee: false,
};

export const SRCA_PROTECTED_STEPS = new Set([
  "evaluer", "formuler", "cibler", "seances", "outils", "synthese", "suivi", "cloture", "cr",
]);

export function guardedClinicalStep(requestedStep: string, canEvaluate: boolean): string {
  return SRCA_PROTECTED_STEPS.has(requestedStep) && !canEvaluate ? "bilan" : requestedStep;
}

export function srcaAfterRiskFieldChange(key: string, state: SrcaState | undefined): SrcaState | undefined {
  if (key !== "s3_suicide" && key !== "s9_qunut") return state;
  return { ...(state ?? EMPTY_SRCA), securite: false, conduiteTenirEffectuee: false };
}

export function hasSuicideAlert(anamnese?: Record<string, string>): boolean {
  const a = anamnese ?? {};
  return ["Idées actuelles", "Tentative passée", "Tentative récente"].includes(a.s3_suicide) ||
    ["Présent", "Envahissant — urgence"].includes(a.s9_qunut);
}

export function srcaReadiness(anamnese: Record<string, string> | undefined, state: SrcaState | undefined) {
  const srca = state ?? EMPTY_SRCA;
  const redAlert = hasSuicideAlert(anamnese);
  const safetyCanBeAssessed = !redAlert || srca.conduiteTenirEffectuee;
  const allChecked = srca.securite && srca.regulation && srca.continuite && srca.alliance;
  return {
    redAlert,
    safetyCanBeAssessed,
    canEvaluate: allChecked && safetyCanBeAssessed,
  };
}

export function validateBilanCloture(bilan: BilanCloture): string[] {
  const errors: string[] = [];
  if (!bilan.demandeInitiale.trim()) errors.push("La demande initiale est requise.");
  if (!bilan.objectifs.length || bilan.objectifs.some((o) => !o.texte.trim())) errors.push("Au moins un objectif renseigné est requis.");
  if (!bilan.dateCloture) errors.push("La date de clôture est requise.");
  if (bilan.autonomieRelais.relaisNecessaire && !bilan.autonomieRelais.notes.trim()) errors.push("Le relais nécessaire doit être documenté.");
  if (bilan.reorientation.necessaire && !bilan.reorientation.details.trim()) errors.push("La réorientation doit être documentée.");
  return errors;
}
