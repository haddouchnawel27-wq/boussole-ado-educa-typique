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
        if (!error && rows && rows.length > 0) {
          const clients = await Promise.all(
            rows.map(async (c) => {
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
