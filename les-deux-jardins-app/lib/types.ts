// Modèle de données du cockpit (démo locale — miroir du futur schéma Supabase).
export type Meteo = "beau" | "voile" | "averse" | "orage";

export interface Seance {
  date: string;
  meteo: Meteo;
  notes: string;
  axes: string;
}

export interface SyntheseSection {
  t: string;
  x: string;
}

export interface Synthese {
  status: "vierge" | "brouillon" | "valide";
  sections: SyntheseSection[];
  boussole: string;
  semaine: string;
  duaIdx: number;
}

export interface Client {
  id: string;
  nom: string;
  initiale: string;
  etape: number;
  consentement: boolean;
  intention: string;
  rdv: string;
  bilan: { histoire: string; schemas: string; neuro: string; spirituel: string; stabilise?: boolean };
  seances: Seance[];
  engagements: string[];
  synthese: Synthese;
}

export interface Dua {
  etat: string;
  ar: string;
  ph: string;
  fr: string;
  src: string;
}

export interface Step {
  k: string;
  n: number;
  t: string;
}
