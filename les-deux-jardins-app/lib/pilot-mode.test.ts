import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { nonClinicalPilotMode, pilotStorageNotice } from "./pilot";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("mode local sans stockage clinique cloud", () => {
  it("est verrouillé par défaut", () => {
    expect(nonClinicalPilotMode).toBe(true);
    expect(pilotStorageNotice).toContain("Coffre local chiffré");
    expect(pilotStorageNotice).toContain("code pseudonymisé");
  });

  it("redirige les lectures et écritures vers le coffre local", () => {
    const data = source("lib/data.ts");
    expect(data.match(/if \(nonClinicalPilotMode\)/g)?.length).toBeGreaterThanOrEqual(8);
    expect(data).toContain('source: vault ? "local" : "demo"');
    expect(data).toContain("mutateLocalVault");
  });

  it("annonce clairement les limites dans le cockpit et les questionnaires", () => {
    expect(source("app/cockpit/page.tsx")).toContain("Coffre local chiffré");
    expect(source("app/cockpit/page.tsx")).toContain("Code pseudonymisé uniquement");
    expect(source("app/questionnaires/page.tsx")).toContain("Les résultats peuvent être reliés");
  });

  it("ne bloque pas l'accès pilote sur une MFA indisponible", () => {
    expect(source("components/ProfessionalGate.tsx")).toContain(
      '!nonClinicalPilotMode && aal !== "aal2"'
    );
    expect(source("app/login/page.tsx")).toContain(
      'router.push(nonClinicalPilotMode ? "/cockpit" : "/mfa")'
    );
    expect(source("app/mfa/page.tsx")).toContain(
      'router.replace(user ? "/cockpit" : "/login")'
    );
  });
});
