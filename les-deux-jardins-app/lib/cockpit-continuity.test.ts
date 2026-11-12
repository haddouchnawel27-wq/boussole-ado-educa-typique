import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("continuité de saisie du cockpit", () => {
  it("ne démonte pas l'utilisatrice pendant un simple renouvellement de session", () => {
    const auth = source("lib/auth.tsx");

    expect(auth).toContain('event === "SIGNED_OUT"');
    expect(auth).toContain("checkMfa(false)");
    expect(auth).not.toContain("setUser(session?.user ?? null)");
  });

  it("conserve le dossier actif et autosauvegarde l'anamnèse", () => {
    const cockpit = source("app/cockpit/page.tsx");

    expect(cockpit).toContain("const currentClient = r.clients.find");
    expect(cockpit).toContain("Anamnèse enregistrée automatiquement");
    expect(cockpit).toContain('step !== "bilan"');
    expect(cockpit).not.toContain("Enregistrer avant de changer d'étape ?");
  });

  it("fait réellement avancer le bouton de prochaine étape vers l'anamnèse", () => {
    const cockpit = source("app/cockpit/page.tsx");

    expect(cockpit).toContain("Compléter l’anamnèse et valider S·R·C·A");
    expect(cockpit).toContain('onClick: () => goToStep("bilan")');
    expect(cockpit).toContain('id="cockpit-panel"');
    expect(cockpit).not.toContain('{ label: "Compléter l\'accueil", onClick: () => goToStep("accueil") }');
  });

  it("utilise le coffre déjà ouvert sans dépendre d'un nouvel aller-retour auth", () => {
    const data = source("lib/data.ts");
    const vault = source("lib/local-vault.ts");

    expect(data).toContain("activeLocalVaultScope() ?? authenticatedScope()");
    expect(vault).toContain("export function activeLocalVaultScope");
  });
});
