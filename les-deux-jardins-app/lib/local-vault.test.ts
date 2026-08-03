import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createLocalVault,
  exportLocalVault,
  localVaultExists,
  localVaultIsUnlocked,
  lockLocalVault,
  mutateLocalVault,
  readLocalVault,
  unlockLocalVault,
} from "./local-vault";

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
});
