import { describe, expect, it } from "vitest";
import { labelsForMode } from "./mode-labels";

describe("libellés des deux modes", () => {
  it("garde le mode universel professionnel et religieusement neutre", () => {
    const labels = Object.values(labelsForMode("universel")).join(" ");

    expect(labels).toContain("Espace professionnel");
    expect(labels).toContain("Accompagnement psychologique");
    expect(labels).not.toMatch(/Jannat|Qulûb|Allāh|sakīna|baraka|fiṭra/i);
  });

  it("conserve l’identité psycho-spirituelle sur choix explicite", () => {
    const labels = labelsForMode("islamique");

    expect(labels.cockpitBrand).toBe("Jannat al Qulûb");
    expect(labels.hero).toContain("sakīna");
  });
});
