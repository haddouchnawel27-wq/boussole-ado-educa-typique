import { describe, expect, it } from "vitest";
import {
  anamneseAlerts,
  anamneseFieldLabel,
  anamneseForMode,
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
    expect(alerts[0].titre).toContain("actuel");
    expect(alerts[0].message).toContain("immédiatement");
  });

  it("signale le désespoir sans l'assimiler à une faiblesse de foi", () => {
    const alerts = anamneseAlerts({ s9_qunut: "Envahissant — urgence" });

    expect(alerts).toHaveLength(1);
    expect(alerts[0].titre).toBe("Désespoir signalé (section 9)");
    expect(alerts[0].message).toContain("sécurité");
  });
});
