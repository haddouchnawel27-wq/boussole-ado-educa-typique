// « Graine du jour » — une phrase douce qui tourne chaque jour.
// Choix déterministe par jour (même graine toute la journée, pas de hasard).
// Ton universel et apaisant, sans injonction.

export const GRAINES: string[] = [
  "Vous n'avez pas à tout porter aujourd'hui. Juste ce pas-ci.",
  "Ce que vous ressentez a le droit d'exister, sans avoir à se justifier.",
  "Se reposer n'est pas abandonner. C'est aussi prendre soin.",
  "Un petit geste vaut mieux qu'un grand projet remis à demain.",
  "Vous avez déjà traversé des jours difficiles. Celui-ci aussi passera.",
  "La douceur envers soi n'est pas un luxe, c'est un besoin.",
  "Il n'y a rien à réussir ici. Juste à observer, avec bienveillance.",
  "Respirer un instant, c'est déjà revenir à soi.",
  "Vos limites ne sont pas des faiblesses. Elles vous protègent.",
  "Un jour à la fois. Parfois, une heure à la fois. C'est suffisant.",
  "Ce qui pousse lentement pousse souvent plus solide.",
  "Vous méritez la même patience que vous offririez à une amie.",
  "Nommer ce que l'on ressent, c'est déjà commencer à l'apaiser.",
  "Le calme ne s'exige pas. Il s'invite, doucement.",
];

// Numéro du jour dans l'année → index stable.
export function graineDuJour(d: Date = new Date()): string {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const jour = Math.floor(diff / 86400000);
  return GRAINES[jour % GRAINES.length];
}
