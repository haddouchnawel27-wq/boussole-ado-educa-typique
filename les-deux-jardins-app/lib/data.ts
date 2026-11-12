// Couche de données : Supabase si configuré ET connectée, sinon données de démo.
// L'app fonctionne toujours ; brancher Supabase = coller 2 clés (voir SETUP-SUPABASE.md).
import { supabase, supabaseEnabled } from "./supabase";
import { demoClients } from "./demo";
import { nonClinicalPilotMode } from "./pilot";
import { activeLocalVaultScope, mutateLocalVault, readLocalVault } from "./local-vault";
import type { Client, QResponse, Seance, Synthese } from "./types";

export type { QResponse } from "./types";

export type Source = "supabase" | "local" | "demo";

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
    bilanCloture: (c.bilan_cloture as Client["bilanCloture"]) ?? undefined,
    seances,
    engagements: (c.engagements as string[]) ?? [],
    synthese,
  };
}

const emptySynthese = (duaIdx = 0): Synthese => ({ status: "vierge", sections: [], boussole: "", semaine: "", duaIdx });

async function authenticatedScope(): Promise<string | null> {
  if (!supabaseEnabled || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

async function localScope(): Promise<string | null> {
  // Le coffre ouvert reste la source de vérité pendant un rafraîchissement
  // invisible de Supabase. La saisie ne dépend donc plus d'un aller-retour auth.
  return activeLocalVaultScope() ?? authenticatedScope();
}

/** Charge les accompagnées : Supabase (si connectée), sinon démo. Ne casse jamais. */
export async function getClients(): Promise<{ clients: Client[]; source: Source }> {
  if (nonClinicalPilotMode) {
    const scope = await localScope();
    const vault = scope ? readLocalVault(scope) : null;
    return { clients: vault?.clients ?? [], source: vault ? "local" : "demo" };
  }
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
  if (nonClinicalPilotMode) return null;
  if (!supabaseEnabled || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

/** Crée une accompagnée en base. Renvoie son id, ou null si hors-ligne. */
export async function createClientDb(nom: string, intention: string): Promise<string | null> {
  if (nonClinicalPilotMode) {
    const scope = await localScope();
    if (!scope) return null;
    const id = crypto.randomUUID();
    const client: Client = {
      id,
      nom,
      initiale: nom.charAt(0).toUpperCase(),
      etape: 1,
      consentement: false,
      intention,
      rdv: "",
      bilan: { histoire: "", schemas: "", neuro: "", spirituel: "" },
      seances: [],
      engagements: [],
      synthese: emptySynthese(),
    };
    const ok = await mutateLocalVault(scope, (draft) => { draft.clients.push(client); });
    return ok ? id : null;
  }
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
  patch: { intention?: string; rdv?: string; consentement?: boolean; etape?: number; bilan?: Client["bilan"]; bilan_cloture?: Client["bilanCloture"]; engagements?: string[] }
): Promise<boolean> {
  if (nonClinicalPilotMode) {
    const scope = await localScope();
    if (!scope) return false;
    return mutateLocalVault(scope, (draft) => {
      const client = draft.clients.find((item) => item.id === clientId);
      if (!client) return;
      if (patch.intention !== undefined) client.intention = patch.intention;
      if (patch.rdv !== undefined) client.rdv = patch.rdv;
      if (patch.consentement !== undefined) client.consentement = patch.consentement;
      if (patch.etape !== undefined) client.etape = patch.etape;
      if (patch.bilan !== undefined) client.bilan = patch.bilan;
      if (patch.engagements !== undefined) client.engagements = patch.engagements;
      if (patch.bilan_cloture !== undefined && !client.bilanCloture?.praticienneValidation.valideAt) {
        client.bilanCloture = patch.bilan_cloture;
      }
    });
  }
  if (!supabase) return false;
  // .select() renvoie les lignes réellement modifiées : si 0 ligne (RLS, mauvais id,
  // session expirée), on le sait et on ne prétend PAS que c'est enregistré.
  const { data, error } = await supabase.from("clients").update(patch).eq("id", clientId).select("id");
  return !error && Array.isArray(data) && data.length > 0;
}

/** Ajoute une séance en base. */
export async function addSeanceDb(clientId: string, s: Seance): Promise<boolean> {
  if (nonClinicalPilotMode) {
    const scope = await localScope();
    if (!scope) return false;
    return mutateLocalVault(scope, (draft) => {
      const client = draft.clients.find((item) => item.id === clientId);
      if (client) client.seances.push(s);
    });
  }
  if (!supabase) return false;
  const { data, error } = await supabase.from("seances").insert({
    client_id: clientId,
    date: s.date,
    meteo: s.meteo,
    notes: s.notes,
    axes: s.axes,
  }).select("id");
  return !error && Array.isArray(data) && data.length > 0;
}

/** Supprime définitivement une accompagnée (et, par cascade, ses séances/synthèses/réponses). */
export async function deleteClientDb(clientId: string): Promise<boolean> {
  if (nonClinicalPilotMode) {
    const scope = await localScope();
    if (!scope) return false;
    return mutateLocalVault(scope, (draft) => {
      draft.clients = draft.clients.filter((item) => item.id !== clientId);
      delete draft.questionnaireResponses[clientId];
    });
  }
  if (!supabase) return false;
  const { data, error } = await supabase.from("clients").delete().eq("id", clientId).select("id");
  return !error && Array.isArray(data) && data.length > 0;
}

/** Récupère les réponses de questionnaires reliées à une accompagnée (plus récentes d'abord). */
export async function getQuestionnaireResponsesDb(clientId: string): Promise<QResponse[]> {
  if (nonClinicalPilotMode) {
    const scope = await localScope();
    const vault = scope ? readLocalVault(scope) : null;
    return vault?.questionnaireResponses[clientId] ?? [];
  }
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
  if (nonClinicalPilotMode) {
    const scope = await localScope();
    if (!scope) return false;
    const response: QResponse = {
      id: crypto.randomUUID(),
      questionnaireId,
      answers,
      score,
      scoreMax,
      date: new Date().toLocaleDateString("fr-FR"),
    };
    return mutateLocalVault(scope, (draft) => {
      draft.questionnaireResponses[clientId] = [
        response,
        ...(draft.questionnaireResponses[clientId] ?? []),
      ];
    });
  }
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
  if (nonClinicalPilotMode) {
    const scope = await localScope();
    if (!scope) return false;
    return mutateLocalVault(scope, (draft) => {
      const client = draft.clients.find((item) => item.id === clientId);
      if (client) client.synthese = syn;
    });
  }
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
    const { data, error } = await supabase.from("syntheses").update(payload).eq("id", (existing as Record<string, unknown>).id as string).select("id");
    return !error && Array.isArray(data) && data.length > 0;
  }
  const { data, error } = await supabase.from("syntheses").insert(payload).select("id");
  return !error && Array.isArray(data) && data.length > 0;
}
