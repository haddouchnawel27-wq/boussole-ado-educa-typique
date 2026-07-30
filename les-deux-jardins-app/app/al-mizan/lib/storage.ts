// ════════════════════════════════════════════════════════════
// Al Mizan — service de stockage (100 % local, encapsulé)
// Rien ne quitte l'appareil. Chaque entrée porte sa version de schéma.
// ════════════════════════════════════════════════════════════

export const SCHEMA_VERSION = 1;

export type Mode = "demo" | "real";

export interface Profile {
  schema: number;
  onboarded: boolean;
  mode: Mode;
  name: string; // "" = aucun prénom
  useName: boolean;
  consent: boolean;
  createdAt: string;
}

export interface CheckIn {
  schema: number;
  id: string;
  date: string; // ISO
  energie: number; // 0-10
  humeur: number; // 0-10
  clarte: number; // 0-10
  elan: number; // 0-10
  contextes?: string[]; // ce qui colore la journée (facultatif)
  note?: string;
}

// Journal des pensées — accompagnement TCC en 5 temps, tout en douceur.
export interface Thought {
  schema: number;
  id: string;
  date: string; // ISO
  situation: string;   // 1. Ce qui s'est passé
  pensee: string;      // 2. La pensée automatique
  emotion: string;     // 3. Ce que ça a fait ressentir
  intensite: number;   // 3b. Intensité 0-10
  regard: string;      // 4. Un regard plus juste
  apres: string;       // 5. Comment je me sens après
}

const K_PROFILE = "almizan.profile.v1";
const K_CHECKINS = "almizan.checkins.v1";
const K_THOUGHTS = "almizan.thoughts.v1";

// ---- utilitaires sûrs (SSR + quotas) ----
function canStore(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}
function read<T>(key: string, fallback: T): T {
  if (!canStore()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown): boolean {
  if (!canStore()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // quota / navigation privée
  }
}
function uid(): string {
  // pas de Math.random critique : suffisant pour un id local
  return "c-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e6).toString(36);
}

// ---- Profil ----
export function getProfile(): Profile | null {
  const p = read<Profile | null>(K_PROFILE, null);
  if (!p) return null;
  // migration de schéma (place réservée pour de futures versions)
  if (p.schema !== SCHEMA_VERSION) return { ...p, schema: SCHEMA_VERSION };
  return p;
}
export function saveProfile(p: Profile): boolean {
  return write(K_PROFILE, { ...p, schema: SCHEMA_VERSION });
}

// ---- Check-ins (réels uniquement) ----
export function getCheckIns(): CheckIn[] {
  const list = read<CheckIn[]>(K_CHECKINS, []);
  return Array.isArray(list) ? list : [];
}
export function addCheckIn(
  data: Pick<CheckIn, "energie" | "humeur" | "clarte" | "elan"> & { contextes?: string[]; note?: string }
): { ok: boolean; entry?: CheckIn } {
  const entry: CheckIn = {
    schema: SCHEMA_VERSION,
    id: uid(),
    date: new Date().toISOString(),
    energie: data.energie,
    humeur: data.humeur,
    clarte: data.clarte,
    elan: data.elan,
    contextes: data.contextes && data.contextes.length ? data.contextes : undefined,
    note: data.note?.trim() || undefined,
  };
  const list = getCheckIns();
  list.push(entry);
  const ok = write(K_CHECKINS, list);
  return ok ? { ok, entry } : { ok: false };
}
export function updateCheckIn(id: string, patch: Partial<Omit<CheckIn, "id" | "schema">>): boolean {
  const list = getCheckIns();
  const i = list.findIndex((c) => c.id === id);
  if (i < 0) return false;
  list[i] = { ...list[i], ...patch };
  return write(K_CHECKINS, list);
}
export function deleteCheckIn(id: string): boolean {
  const list = getCheckIns().filter((c) => c.id !== id);
  return write(K_CHECKINS, list);
}

// ---- Pensées (journal TCC — réelles uniquement) ----
export function getThoughts(): Thought[] {
  const list = read<Thought[]>(K_THOUGHTS, []);
  return Array.isArray(list) ? list : [];
}
export function addThought(
  data: Pick<Thought, "situation" | "pensee" | "emotion" | "intensite" | "regard" | "apres">
): { ok: boolean; entry?: Thought } {
  const entry: Thought = {
    schema: SCHEMA_VERSION,
    id: uid(),
    date: new Date().toISOString(),
    situation: data.situation.trim(),
    pensee: data.pensee.trim(),
    emotion: data.emotion.trim(),
    intensite: data.intensite,
    regard: data.regard.trim(),
    apres: data.apres.trim(),
  };
  const list = getThoughts();
  list.unshift(entry); // la plus récente en tête
  const ok = write(K_THOUGHTS, list);
  return ok ? { ok, entry } : { ok: false };
}
export function deleteThought(id: string): boolean {
  const list = getThoughts().filter((t) => t.id !== id);
  return write(K_THOUGHTS, list);
}

// ---- Export / suppression (RGPD-friendly) ----
export function exportAll(): string {
  return JSON.stringify(
    { app: "Al Mizan Al Qalb", schema: SCHEMA_VERSION, exportedAt: new Date().toISOString(), profile: getProfile(), checkins: getCheckIns(), thoughts: getThoughts() },
    null,
    2
  );
}
export function deleteAllData(): void {
  if (!canStore()) return;
  try {
    window.localStorage.removeItem(K_PROFILE);
    window.localStorage.removeItem(K_CHECKINS);
    window.localStorage.removeItem(K_THOUGHTS);
  } catch {
    /* rien à faire */
  }
}

// ---- Série (jours consécutifs avec au moins un check-in) ----
export function computeStreak(list: CheckIn[]): number {
  if (list.length === 0) return 0;
  const days = new Set(list.map((c) => c.date.slice(0, 10)));
  let streak = 0;
  const d = new Date();
  // tolère « aujourd'hui pas encore fait » : on part d'aujourd'hui, sinon d'hier
  const today = d.toISOString().slice(0, 10);
  if (!days.has(today)) d.setDate(d.getDate() - 1);
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}
