// ════════════════════════════════════════════════════════════
// Al Mizan — données de DÉMONSTRATION (mode découverte)
// Toujours VIRTUELLES : jamais écrites dans le stockage réel de l'utilisatrice.
// Servent uniquement à illustrer les écrans avant la première utilisation.
// ════════════════════════════════════════════════════════════
import type { CheckIn } from "./storage";

// Génère des check-ins d'exemple sur les derniers jours (dates relatives).
export function demoCheckIns(): CheckIn[] {
  const vals = [
    { energie: 4, humeur: 5, clarte: 4, elan: 3 },
    { energie: 6, humeur: 6, clarte: 5, elan: 5 },
    { energie: 5, humeur: 4, clarte: 4, elan: 4 },
    { energie: 7, humeur: 7, clarte: 6, elan: 6 },
    { energie: 3, humeur: 4, clarte: 3, elan: 2 },
    { energie: 6, humeur: 6, clarte: 6, elan: 5 },
    { energie: 8, humeur: 7, clarte: 7, elan: 7 },
  ];
  const out: CheckIn[] = [];
  for (let i = 0; i < vals.length; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (vals.length - 1 - i));
    out.push({
      schema: 1,
      id: "demo-" + i,
      date: d.toISOString(),
      ...vals[i],
    });
  }
  return out;
}

// Série de démo = nombre de jours consécutifs illustrés.
export const DEMO_STREAK = 7;
