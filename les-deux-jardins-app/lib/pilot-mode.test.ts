import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { nonClinicalPilotMode, pilotStorageNotice } from "./pilot";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("mode pilote sans données cliniques", () => {
  it("est verrouillé par défaut", () => {
    expect(nonClinicalPilotMode).toBe(true);
    expect(pilotStorageNotice).toContain("sans sauvegarde");
    expect(pilotStorageNotice).toContain("code fictif");
  });

  it("court-circuite les lectures et écritures Supabase", () => {
    const data = source("lib/data.ts");
    expect(data.match(/if \(nonClinicalPilotMode\)/g)?.length).toBeGreaterThanOrEqual(8);
    expect(data).toContain('return { clients: [], source: "demo" }');
  });

  it("annonce clairement les limites dans le cockpit et les questionnaires", () => {
    expect(source("app/cockpit/page.tsx")).toContain("Mode pilote sans sauvegarde");
    expect(source("app/cockpit/page.tsx")).toContain("Code fictif uniquement");
    expect(source("app/questionnaires/page.tsx")).toContain("Résultat non sauvegardé");
  });
});
