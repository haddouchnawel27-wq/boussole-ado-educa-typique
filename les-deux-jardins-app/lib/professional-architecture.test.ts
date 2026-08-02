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
    expect(login).toContain('router.push("/mfa")');
  });

  it("exige une session MFA AAL2 dans l’interface et dans les politiques RLS", () => {
    const gate = source("components/ProfessionalGate.tsx");
    const mfa = source("app/mfa/page.tsx");
    const policy = source("supabase/migrations/20260801170000_require_mfa_aal2.sql");

    expect(gate).toContain('aal !== "aal2"');
    expect(mfa).toContain("challengeAndVerify");
    expect(mfa).toContain("refreshMfa");
    expect(policy.match(/as restrictive for all to authenticated/g)).toHaveLength(5);
    expect(policy.match(/auth\.jwt\(\)->>'aal'/g)?.length).toBeGreaterThanOrEqual(5);
  });

  it("protège aussi le cockpit et synchronise l'URL en cas de verrou clinique", () => {
    const cockpit = source("app/cockpit/page.tsx");

    expect(cockpit).toContain("<ProfessionalGate><Cockpit /></ProfessionalGate>");
    expect(cockpit).toContain("window.history.replaceState");
    expect(cockpit).toContain('query.set("etape", safeStep)');
  });
});
