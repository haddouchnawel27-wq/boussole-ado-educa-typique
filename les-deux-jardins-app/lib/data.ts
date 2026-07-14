// Couche de données : Supabase si configuré ET connectée, sinon données de démo.
// L'app fonctionne toujours ; brancher Supabase = coller 2 clés (voir SETUP-SUPABASE.md).
import { supabase, supabaseEnabled } from "./supabase";
import { demoClients } from "./demo";
import type { Client, Seance, Synthese } from "./types";

export type Source = "supabase" | "demo";

function rowToClient(c: Record<string, unknown>, seances: Seance[], synthese: Synthese): Client {
  const bilan = (c.bilan as Client["bilan"]) ?? { histoire: "", schemas: "", neuro: "", spirituel: "" };
  return {
    id: String(c.id),
    nom: String(c.nom ?? ""),
    initiale: String(c.nom ?? "?").charAt(0).toUpperCase(),
    etape: Number(c.etape ?? 1),
    consentement: Boolean(c.consentement),
    intention: String(c.intention ?? ""),
    rdv: String(c.rdv ?? ""),
    bilan,
    seances,
    engagements: (c.engagements as string[]) ?? [],
    synthese,
  };
}

const emptySynthese = (duaIdx = 0): Synthese => ({ status: "vierge", sections: [], boussole: "", semaine: "", duaIdx });

/** Charge les accompagnées : Supabase (si connectée), sinon démo. Ne casse jamais. */
export async function getClients(): Promise<{ clients: Client[]; source: Source }> {
  if (supabaseEnabled && supabase) {
    try {
      const sb = supabase;
      const { data: userData } = await sb.auth.getUser();
      if (userData?.user) {
        const { data: rows, error } = await sb.from("clients").select("*").order("created_at");
        if (!error) {
          const clients = await Promise.all(
            (rows ?? []).map(async (c) => {
              const cid = String((c as Record<string, unknown>).id);
              const { data: sRows } = await sb.from("seances").select("*").eq("client_id", cid).order("created_at");
              const seances: Seance[] = (sRows ?? []).map((s) => ({
                date: String((s as Record<string, unknown>).date ?? ""),
                meteo: ((s as Record<string, unknown>).meteo as Seance["meteo"]) ?? "voile",
                notes: String((s as Record<string, unknown>).notes ?? ""),
                axes: String((s as Record<string, unknown>).axes ?? ""),
              }));
              const { data: synth } = await sb.from("syntheses").select("*").eq("client_id", cid).maybeSingle();
              const synthese: Synthese = synth
                ? {
                    status: ((synth as Record<string, unknown>).status as Synthese["status"]) ?? "vierge",
                    sections: ((synth as Record<string, unknown>).sections as Synthese["sections"]) ?? [],
                    boussole: String((synth as Record<string, unknown>).boussole ?? ""),
                    semaine: String((synth as Record<string, unknown>).semaine ?? ""),
                    duaIdx: Number((synth as Record<string, unknown>).dua_idx ?? 0),
                  }
                : emptySynthese();
              return rowToClient(c as Record<string, unknown>, seances, synthese);
            })
          );
          return { clients, source: "supabase" };
        }
      }
    } catch {
      // silencieux : on retombe sur la démo
    }
  }
  return { clients: demoClients(), source: "demo" };
}

/** Vrai mode « en ligne » : Supabase configuré ET praticienne connectée. */
export async function liveUserId(): Promise<string | null> {
  if (!supabaseEnabled || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

/** Crée une accompagnée en base. Renvoie son id, ou null si hors-ligne. */
export async function createClientDb(nom: string, intention: string): Promise<string | null> {
  if (!supabase) return null;
  const uid = await liveUserId();
  if (!uid) return null;
  const { data, error } = await supabase
    .from("clients")
    .insert({ practitioner_id: uid, nom, intention, etape: 1 })
    .select("id")
    .single();
  if (error || !data) return null;
  return String((data as Record<string, unknown>).id);
}

/** Met à jour les champs d'accueil / bilan d'une accompagnée (intention, RDV, consentement, bilan…). */
export async function updateClientDb(
  clientId: string,
  patch: { intention?: string; rdv?: string; consentement?: boolean; etape?: number; bilan?: Client["bilan"]; engagements?: string[] }
): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("clients").update(patch).eq("id", clientId);
  return !error;
}

/** Ajoute une séance en base. */
export async function addSeanceDb(clientId: string, s: Seance): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("seances").insert({
    client_id: clientId,
    date: s.date,
    meteo: s.meteo,
    notes: s.notes,
    axes: s.axes,
  });
  return !error;
}

/** Supprime définitivement une accompagnée (et, par cascade, ses séances/synthèses/réponses). */
export async function deleteClientDb(clientId: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("clients").delete().eq("id", clientId);
  return !error;
}

export interface QResponse {
  id: string;
  questionnaireId: string;
  score: number;
  scoreMax: number;
  answers: Record<string, number>;
  date: string;
}

/** Récupère les réponses de questionnaires reliées à une accompagnée (plus récentes d'abord). */
export async function getQuestionnaireResponsesDb(clientId: string): Promise<QResponse[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("questionnaire_responses")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => {
    const rec = r as Record<string, unknown>;
    const created = String(rec.created_at ?? "");
    let date = created;
    try {
      date = new Date(created).toLocaleDateString("fr-FR");
    } catch {
      // on garde la valeur brute si le format échoue
    }
    return {
      id: String(rec.id),
      questionnaireId: String(rec.questionnaire_id ?? ""),
      score: Number(rec.score ?? 0),
      scoreMax: Number(rec.score_max ?? 0),
      answers: (rec.answers as Record<string, number>) ?? {},
      date,
    };
  });
}

/** Relie une réponse de questionnaire à une accompagnée (l'enregistre en base). */
export async function saveQuestionnaireResponseDb(
  clientId: string,
  questionnaireId: string,
  answers: Record<string, number>,
  score: number,
  scoreMax: number
): Promise<boolean> {
  if (!supabase) return false;
  const uid = await liveUserId();
  if (!uid) return false;
  const { error } = await supabase.from("questionnaire_responses").insert({
    client_id: clientId,
    practitioner_id: uid,
    questionnaire_id: questionnaireId,
    answers,
    score,
    score_max: scoreMax,
  });
  return !error;
}

/** Enregistre / met à jour la synthèse « Pour toi » d'une accompagnée. */
export async function saveSyntheseDb(clientId: string, syn: Synthese): Promise<boolean> {
  if (!supabase) return false;
  const { data: existing } = await supabase.from("syntheses").select("id").eq("client_id", clientId).maybeSingle();
  const payload = {
    client_id: clientId,
    status: syn.status,
    sections: syn.sections,
    boussole: syn.boussole,
    semaine: syn.semaine,
    dua_idx: syn.duaIdx,
    updated_at: new Date().toISOString(),
  };
  if (existing) {
    const { error } = await supabase.from("syntheses").update(payload).eq("id", (existing as Record<string, unknown>).id as string);
    return !error;
  }
  const { error } = await supabase.from("syntheses").insert(payload);
  return !error;
}
