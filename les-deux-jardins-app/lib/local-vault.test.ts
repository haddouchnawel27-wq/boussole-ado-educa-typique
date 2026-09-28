import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createLocalVault,
  ensureAutomaticLocalVault,
  exportLocalVault,
  localVaultExists,
  localVaultIsUnlocked,
  lockLocalVault,
  mutateLocalVault,
  readLocalVault,
  unlockLocalVault,
} from "./local-vault";
import type { Client } from "./types";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("coffre local chiffré", () => {
  const scope = "praticienne-test";

  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: new MemoryStorage() },
    });
    lockLocalVault();
  });

  afterEach(() => {
    lockLocalVault();
    Reflect.deleteProperty(globalThis, "window");
  });

  it("chiffre, verrouille et rouvre avec la bonne phrase secrète", async () => {
    const passphrase = "une phrase locale solide";
    await createLocalVault(scope, passphrase);
    expect(localVaultExists(scope)).toBe(true);
    expect(localVaultIsUnlocked(scope)).toBe(true);

    await mutateLocalVault(scope, (draft) => {
      draft.questionnaireResponses.dossier12 = [{
        id: "r1",
        questionnaireId: "contenu-secret",
        score: 4,
        scoreMax: 10,
        answers: { q1: 4 },
        date: "03/08/2026",
      }];
    });

    const encrypted = exportLocalVault(scope) ?? "";
    expect(encrypted).not.toContain("contenu-secret");
    lockLocalVault();
    expect(readLocalVault(scope)).toBeNull();

    await expect(unlockLocalVault(scope, "mauvaise phrase secrète")).rejects.toThrow();
    await unlockLocalVault(scope, passphrase);
    expect(readLocalVault(scope)?.questionnaireResponses.dossier12[0].questionnaireId).toBe("contenu-secret");
  });

  it("ouvre automatiquement la sauvegarde locale sans demander de phrase", async () => {
    await ensureAutomaticLocalVault(scope);
    expect(localVaultExists(scope)).toBe(true);
    expect(localVaultIsUnlocked(scope)).toBe(true);
    lockLocalVault();
    await ensureAutomaticLocalVault(scope);
    expect(localVaultIsUnlocked(scope)).toBe(true);
  });

  it("retrouve après actualisation l'anamnèse, l'analyse et la pré-formulation d'un dossier fictif", async () => {
    await ensureAutomaticLocalVault(scope);
    const fictional: Client = {
      id: "jardin-fictif", nom: "Jardin test", initiale: "J", etape: 4,
      consentement: true, intention: "Test sans donnée réelle", rdv: "",
      bilan: {
        histoire: "", schemas: "", neuro: "", spirituel: "",
        anamnese: { s1_motif: "Situation entièrement fictive" },
        etatDesLieux: "Pré-formulation fictive à relire",
        cartographie: "Régulation · contexte",
        hypotheses: "[Proposée] piste fictive",
        analysis: {
          version: 1, door: "jannat", generatedAt: "2026-08-03T10:00:00.000Z",
          inputSummary: "Situation entièrement fictive", formulationStatus: "a_revoir",
          hypotheses: [{
            id: "jannat-test", door: "jannat", domain: "Test", title: "Piste fictive",
            rationale: "Uniquement pour tester la continuité.", supports: ["donnée fictive"], nuances: [], missing: [], alternatives: [],
            axes: ["vérifier"], protocols: [], priority: "explore", decision: "retained", practitionerNote: "confirmé pour le test", source: "test",
          }],
        },
      },
      seances: [], engagements: [], synthese: { status: "vierge", sections: [], boussole: "", semaine: "", duaIdx: 0 },
    };
    await mutateLocalVault(scope, (draft) => { draft.clients.push(fictional); });
    lockLocalVault();
    await ensureAutomaticLocalVault(scope);

    const restored = readLocalVault(scope)?.clients.find((client) => client.id === "jardin-fictif");
    expect(restored?.bilan.anamnese?.s1_motif).toBe("Situation entièrement fictive");
    expect(restored?.bilan.analysis?.hypotheses[0].decision).toBe("retained");
    expect(restored?.bilan.etatDesLieux).toContain("Pré-formulation fictive");
  });
});
