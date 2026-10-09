// ════════════════════════════════════════════════════════════
// S'organiser — « Vider, trier, avancer » (outil charge mentale).
// 3 temps : vider sa tête → trier sans pression → séquencer une tâche.
// 100% local. « Jamais de retard, jamais de culpabilité. »
// ════════════════════════════════════════════════════════════

export type ColId = "aujourdhui" | "semaine" | "plustard";

export interface Etape {
  texte: string;
  faite: boolean;
}
export interface Tache {
  id: string;
  texte: string;
  col: ColId | null;
  etapes: Etape[];
}

export const COLS: { id: ColId; nom: string }[] = [
  { id: "aujourdhui", nom: "Aujourd'hui" },
  { id: "semaine", nom: "Cette semaine" },
  { id: "plustard", nom: "Plus tard" },
];

const KEY = "almizan.sequenceur.v1";

function canStore(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}
export function loadTaches(): Tache[] {
  if (!canStore()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed?.taches) ? parsed.taches : [];
  } catch {
    return [];
  }
}
export function saveTaches(taches: Tache[]): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ taches }));
  } catch {
    /* quota / navigation privée */
  }
}
export function uid(): string {
  return "t" + Date.now().toString(36) + Math.floor(Math.random() * 1e5).toString(36);
}
