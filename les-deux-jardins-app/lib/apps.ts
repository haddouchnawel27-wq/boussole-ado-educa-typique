// Registre vivant de TOUTES les applis (le hub le lit → rien n'est oublié).
// Miroir de _les-deux-jardins/REGISTRE-COMPLET.md. Statuts :
//  - "interne" : code dans l'écosystème (lien interne, hors-ligne à terme)
//  - "externe" : déployé sur Netlify → à importer (lien externe en attendant)
//  - "master"  : version de référence
export type Univers = "educa" | "jannat";
export type AppStatus = "interne" | "externe" | "master" | "cote";

export interface AppEntry {
  nom: string;
  url: string; // "#" si interne à venir
  univers: Univers;
  cat: string;
  status: AppStatus;
  questionnaire?: boolean;
  praticienne?: boolean;
  note?: string;
}

export const APPS: AppEntry[] = [
  // ---------- 🌷 EDUCA TYPIQUE ----------
  { nom: "Boussole (boîte à outils ados)", url: "https://haddouchnawel27-wq.github.io/boussole-ado-educa-typique/", univers: "educa", cat: "Boîte à outils", status: "interne" },
  { nom: "Boîte NeuroPed Universelle (MASTER)", url: "https://boite-neuro-ped-univ.netlify.app/", univers: "educa", cat: "Parcours Clarté TND", status: "master", note: "= version assemblée dans le dépôt" },
  { nom: "Mon profil cognitif", url: "https://mon-profil-cognitif.netlify.app/", univers: "educa", cat: "Profil", status: "externe", questionnaire: true },
  { nom: "Profil neuro ado", url: "https://profil-neuro-ado.netlify.app/", univers: "educa", cat: "Profil", status: "externe", questionnaire: true },
  { nom: "Décodeur de profil", url: "https://decodeur-profil-educa-typique.netlify.app/", univers: "educa", cat: "Profil", status: "externe", questionnaire: true },
  { nom: "Bilan émotionnel", url: "https://bilan-emotionnel.netlify.app/", univers: "educa", cat: "Bilan", status: "externe", questionnaire: true },
  { nom: "Secours émotionnel ados", url: "https://secours-emotionnel-ados.netlify.app/", univers: "educa", cat: "Premiers secours", status: "externe" },
  { nom: "Boîte à bobo émotionnel 6-12 (univ)", url: "https://boite-a-bobo-emotionnel-6-12-univ.netlify.app/", univers: "educa", cat: "Enfants", status: "externe" },
  { nom: "Anamnèse Educa Typique", url: "https://anamne-educa-typique.netlify.app/", univers: "educa", cat: "Anamnèse", status: "externe", questionnaire: true, praticienne: true },

  // ---------- 🌿 JANNAT AL QULÛB ----------
  { nom: "Boussole Voie Chifā", url: "https://boussole-voiechifa.netlify.app/", univers: "jannat", cat: "Boîte à outils", status: "externe" },
  { nom: "Boussole ado × Souffle & Lumière", url: "https://boussoleado-souffle-lumiere-voiechifa.netlify.app/", univers: "jannat", cat: "Boîte à outils", status: "externe" },
  { nom: "Boîte émotions 6-12 (ISL)", url: "https://boite-outil-emotions-6-12ans-isl.netlify.app/", univers: "jannat", cat: "Enfants", status: "externe" },
  { nom: "Référentiel Shifā complet", url: "https://referentielshifa-complet-voiechifa.netlify.app/", univers: "jannat", cat: "Référentiel", status: "externe" },
  { nom: "Schémas & traumas", url: "https://schemas-traumas-voiechifa.netlify.app/", univers: "jannat", cat: "Clinique", status: "externe" },
  { nom: "Anamnèses + comptes-rendus", url: "https://anamneses-cr-voiechifa.netlify.app/", univers: "jannat", cat: "Anamnèse / CR", status: "externe", questionnaire: true, praticienne: true },
  { nom: "Shifā décodeur + CR", url: "https://shifa-decodeur-voie-chifa-cr.netlify.app/", univers: "jannat", cat: "Décodeur / CR", status: "externe", questionnaire: true, praticienne: true },
  { nom: "Mon assistante Nawel", url: "https://mon-assistante-nawel.netlify.app/", univers: "jannat", cat: "Assistante", status: "externe", praticienne: true },

  // ---------- Mises de côté ----------
  { nom: "3 apps mises de côté (à préciser)", url: "#", univers: "educa", cat: "En pause", status: "cote", note: "« qu'on ne retouche pas pour l'instant »" },
];

export const STATUS_LABEL: Record<AppStatus, string> = {
  interne: "Dans l'écosystème",
  externe: "À importer (Netlify)",
  master: "Référence (master)",
  cote: "En pause",
};
