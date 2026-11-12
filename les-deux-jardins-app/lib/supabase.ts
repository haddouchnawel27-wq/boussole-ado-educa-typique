import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lit les clés depuis l'environnement (.env.local). Tant qu'elles ne sont pas
// renseignées, l'app fonctionne en mode démo (aucune casse).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anon);
export const supabase: SupabaseClient | null = supabaseEnabled ? createClient(url as string, anon as string) : null;
