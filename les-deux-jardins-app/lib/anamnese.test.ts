import { describe, expect, it } from "vitest";
import {
  anamneseAlerts,
  anamneseFieldLabel,
  anamneseForMode,
  verifiedReligiousContent,
} from "./anamnese";

describe("anamnèse selon le mode", () => {
  it("masque les sections et champs islamiques en mode universel", () => {
    const sections = anamneseForMode(false);
    const keys = sections.map((section) => section.key);
    const fieldKeys = sections.flatMap((section) => section.fields.map((field) => field.key));

    expect(keys).not.toContain("s4");
    expect(keys).not.toContain("s8");
    expect(fieldKeys).not.toContain("s9_tawakkul");
    expect(fieldKeys).toContain("s9_qunut");
  });

  it("conserve le parcours psycho-spirituel complet en mode islamique", () => {
    const sections = anamneseForMode(true);
    const keys = sections.map((section) => section.key);
    const fieldKeys = sections.flatMap((section) => section.fields.map((field) => field.key));

    expect(keys).toContain("s4");
    expect(keys).toContain("s8");
    expect(fieldKeys).toContain("s9_tawakkul");
    expect(sections.find((section) => section.key === "s4")?.titre).toContain("Parcours et posture spirituels");
    expect(sections.find((section) => section.key === "s8")?.titre).toContain("Ressources, pratiques et rappels spirituels");
  });

  it("emploie un libellé neutre en mode universel", () => {
    const field = anamneseForMode(false)
      .flatMap((section) => section.fields)
      .find((item) => item.key === "s9_qunut");

    expect(field).toBeDefined();
    expect(anamneseFieldLabel(field!, false)).toBe("Présence de désespoir ?");
    expect(anamneseFieldLabel(field!, true)).toContain("qunūṭ");
  });
});

describe("alertes de sécurité", () => {
  it("demande une évaluation immédiate pour des idées suicidaires actuelles", () => {
    const alerts = anamneseAlerts({ s3_suicide: "Idées actuelles" });

    expect(alerts).toHaveLength(1);
    expect(alerts[0].titre).toContain("Risque suicidaire");
    expect(alerts[0].message).toContain("15");
  });

  it("signale le désespoir sans l'assimiler à une faiblesse de foi", () => {
    const alerts = anamneseAlerts({ s9_qunut: "Envahissant — urgence" });

    expect(alerts).toHaveLength(1);
    expect(alerts[0].titre).toContain("Risque suicidaire");
    expect(alerts[0].message).toContain("3114");
  });

  it("fusionne les deux déclencheurs dans une seule alerte", () => {
    expect(anamneseAlerts({ s3_suicide: "Idées actuelles", s9_qunut: "Présent" })).toHaveLength(1);
  });
});

describe("traçabilité religieuse", () => {
  it("n'affiche que les contenus explicitement vérifiés et tracés", () => {
    const base = { source_type: "quran" as const, reference: "9:129", verified_by: "Nawel", verified_at: "2026-08-01" };
    const result = verifiedReligiousContent([
      { ...base, verification_status: "verified" as const },
      { ...base, verification_status: "pending" as const },
      { ...base, verification_status: "excluded" as const },
    ]);
    expect(result).toHaveLength(1);
  });
});
