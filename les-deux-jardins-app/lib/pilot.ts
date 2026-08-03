/**
 * Verrou transitoire de protection.
 *
 * Par défaut, Les Deux Jardins n'accède à aucune donnée clinique Supabase et
 * n'en écrit aucune. Le stockage clinique ne pourra être réactivé qu'avec la
 * valeur explicite `NEXT_PUBLIC_LDJ_CLINICAL_STORAGE=enabled`, après validation
 * de l'hébergement, des contrats et du cadre de protection des données.
 */
export const nonClinicalPilotMode =
  process.env.NEXT_PUBLIC_LDJ_CLINICAL_STORAGE !== "enabled";

export const pilotStorageNotice =
  "Coffre local chiffré : les dossiers sont conservés uniquement dans ce navigateur sur cet ordinateur. Ils ne sont ni synchronisés ni envoyés vers Supabase. Utilise un code pseudonymisé sans nom, coordonnées ou initiales.";
