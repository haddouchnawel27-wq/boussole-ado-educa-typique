import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("architecture strictement professionnelle", () => {
  it("ne réintroduit pas de hubs familiaux sur l’accueil", () => {
    const home = source("app/page.tsx");

    expect(home).toContain("Application réservée aux praticiennes");
    expect(home).not.toContain('href={`/hub/');
    expect(home).not.toContain("Hub Parents");
    expect(home).not.toContain("Hub Professionnels");
  });

  it("redirige les anciennes routes de hubs vers le cockpit", () => {
    expect(source("app/hub/[slug]/page.tsx")).toContain('redirect("/cockpit")');
    expect(source("app/jardin/[slug]/page.tsx")).toContain('redirect("/cockpit")');
  });

  it("ne propose plus l’inscription libre dans l’interface", () => {
    const login = source("app/login/page.tsx");

    expect(login).not.toContain("signUp(");
    expect(login).toContain("praticiennes autorisées");
  });
});
