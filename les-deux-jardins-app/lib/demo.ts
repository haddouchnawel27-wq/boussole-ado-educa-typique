import type { Client, Dua, Meteo, Step } from "./types";

export const STEPS: Step[] = [
  { k: "accueil", n: 1, t: "Accueil" },
  { k: "bilan", n: 2, t: "Bilan / anamnèse" },
  { k: "evaluer", n: 3, t: "Évaluer" },
  { k: "formuler", n: 4, t: "Formuler" },
  { k: "cibler", n: 5, t: "Cibler" },
  { k: "seances", n: 6, t: "Séances" },
  { k: "outils", n: 7, t: "Bibliothèque" },
  { k: "synthese", n: 8, t: "Synthèse « Pour toi »" },
  { k: "suivi", n: 9, t: "Suivi" },
  { k: "cloture", n: 10, t: "Clôture" },
  { k: "cr", n: 11, t: "CR (compte-rendu)" },
];

export const METEO: Record<Meteo, { cls: string; label: string }> = {
  beau: { cls: "bg-[rgba(91,138,91,.16)] text-[#4d7a4d]", label: "Beau fixe" },
  voile: { cls: "bg-[rgba(94,127,140,.16)] text-[#4f6f7c]", label: "Voilé" },
  averse: { cls: "bg-[rgba(192,138,46,.16)] text-[#a5751f]", label: "Averses" },
  orage: { cls: "bg-[rgba(196,80,90,.16)] text-[#a94b54]", label: "Orageux" },
};

// Invocations RÉELLES issues du « Guide du'ā » (Voie Chifā) — chacune avec sa source.
export const DUAS: Dua[] = [
  {
    etat: "Apaisement · déposer le contrôle (tawakkul)",
    ar: "حَسْبِيَ اللَّٰهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ",
    ph: "Ḥasbiya Llāhu lā ilāha illā Huwa, ʿalayhi tawakkaltu",
    fr: "Allāh me suffit ; il n'y a de divinité que Lui. En Lui je place ma confiance.",
    src: "Coran, at-Tawba (9:129)",
    source_type: "quran", reference: "Coran, at-Tawba (9:129)", verification_status: "verified", verified_by: "Nawel", verified_at: "2026-08-01T00:00:00+02:00",
  },
  {
    etat: "Charge, stress · ce qui semble difficile",
    ar: "اللَّٰهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا",
    ph: "Allāhumma lā sahla illā mā jaʿaltahu sahlan",
    fr: "Ô Allāh, rien n'est facile sauf ce que Tu rends facile.",
    src: "Invocation prophétique (rapportée par Ibn Ḥibbān)",
    source_type: "hadith", reference: "Ibn Ḥibbān", verification_status: "verified", verified_by: "Nawel", verified_at: "2026-08-01T00:00:00+02:00",
  },
  {
    etat: "Fatigue, découragement, impuissance",
    ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّٰهِ",
    ph: "Lā ḥawla wa lā quwwata illā bi-Llāh",
    fr: "Il n'y a ni force ni puissance si ce n'est par Allāh.",
    src: "Hadith (al-Bukhārī, Muslim) — « trésor du Paradis »",
    source_type: "hadith", reference: "al-Bukhārī, Muslim", verification_status: "verified", verified_by: "Nawel", verified_at: "2026-08-01T00:00:00+02:00",
  },
];

export const LIBRARY: { nm: string; ds: string; type: "clin" | "spir"; relig?: boolean; source_type: "validated_corpus"; reference: string; verification_status: "verified"; verified_by: string; verified_at: string }[] = [
  { nm: "Ancrage 5-4-3-2-1", ds: "Régulation express par les sens", type: "clin", source_type: "validated_corpus", reference: "Référentiel clinique", verification_status: "verified", verified_by: "équipe clinique", verified_at: "2026-08-01" },
  { nm: "Respiration apaisante", ds: "Cohérence cardiaque guidée", type: "clin", source_type: "validated_corpus", reference: "Référentiel clinique", verification_status: "verified", verified_by: "équipe clinique", verified_at: "2026-08-01" },
  { nm: "Fenêtre de tolérance", ds: "Repérer haut / bas d'activation", type: "clin", source_type: "validated_corpus", reference: "Référentiel clinique", verification_status: "verified", verified_by: "équipe clinique", verified_at: "2026-08-01" },
  { nm: "Module invocations (du'ā)", ds: "Adab & conditions — corpus validé", type: "spir", relig: true, source_type: "validated_corpus", reference: "Guide du'ā Voie Chifā", verification_status: "verified", verified_by: "Nawel", verified_at: "2026-08-01" },
];

export function demoClients(): Client[] {
  return [
    {
      id: "amina",
      nom: "Amina",
      initiale: "A",
      etape: 5,
      consentement: true,
      intention: "Retrouver de l'apaisement et de la clarté dans mon rôle de mère, sans culpabiliser.",
      rdv: "Jeu. 10 juil · 14h00 (Zoom)",
      bilan: {
        histoire: "Mère de 2 enfants (dont un TDAH). Charge mentale élevée depuis la rentrée.",
        schemas: "Tendance au perfectionnisme ; auto-critique forte.",
        neuro: "Se reconnaît des traits neuro-atypiques (hypersensibilité, hyperfocus).",
        spirituel: "Cherche à relier son cheminement intérieur à sa foi, avec douceur.",
      },
      seances: [
        { date: "26 juin", meteo: "averse", notes: "Semaine difficile : conflits aux devoirs, sentiment de débordement. A identifié le moment déclencheur (17h-18h).", axes: "Poser un rituel de transition avant les devoirs." },
        { date: "3 juil", meteo: "voile", notes: "A testé le rituel de transition 3 soirs sur 5. Moins de cris. Reste la fatigue du vendredi.", axes: "Renforcer l'auto-compassion ; alléger le vendredi." },
      ],
      engagements: ["Rituel de transition 5 min avant les devoirs", "Une pause « pour moi » le vendredi"],
      synthese: { status: "vierge", sections: [], boussole: "", semaine: "", duaIdx: 0 },
    },
    {
      id: "sara",
      nom: "Sara",
      initiale: "S",
      etape: 2,
      consentement: false,
      intention: "Sortir de l'épuisement et retrouver un cadre.",
      rdv: "À planifier",
      bilan: { histoire: "Auto-entrepreneuse, en surcharge. Sommeil perturbé.", schemas: "—", neuro: "—", spirituel: "—" },
      seances: [],
      engagements: [],
      synthese: { status: "vierge", sections: [], boussole: "", semaine: "", duaIdx: 0 },
    },
    {
      id: "leila",
      nom: "Leïla",
      initiale: "L",
      etape: 6,
      consentement: true,
      intention: "Consolider les acquis et préparer l'autonomie.",
      rdv: "Mar. 15 juil · 11h00",
      bilan: { histoire: "Fin de parcours, nette amélioration de la régulation.", schemas: "Schémas assouplis.", neuro: "—", spirituel: "Ancrage spirituel stabilisant." },
      seances: [{ date: "1 juil", meteo: "beau", notes: "Séance sereine, bilan très positif.", axes: "Préparer la clôture." }],
      engagements: ["Maintenir la routine du matin"],
      synthese: { status: "vierge", sections: [], boussole: "", semaine: "", duaIdx: 0 },
    },
  ];
}
