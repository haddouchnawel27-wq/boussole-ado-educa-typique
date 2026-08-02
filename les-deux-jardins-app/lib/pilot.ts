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
  "Mode pilote sans sauvegarde : utilise uniquement un code fictif sans lien avec l’identité. N’écris ni initiales, ni nom, ni coordonnées, ni dates exactes, ni récit clinique ou autre donnée sensible. Les saisies disparaissent au rechargement.";
