# 📔 Carnet « À la découverte de moi » — concept (version ado)

> Concept pédagogique fourni par Nawel (Educa Typique). Conservé ici comme
> **document de référence**. Ce carnet confirme, section par section,
> l'architecture de l'app « Mode d'Emploi de Moi ».

## Vision
Un compagnon de découverte de soi : identité, forces, mode d'apprentissage,
émotions, orientation. Le but n'est **pas** de trouver un métier tout de suite,
mais de construire progressivement un projet de vie aligné avec ses talents et
ses valeurs.

## Structure proposée (10 sections) → où ça vit dans l'app

| # | Section du carnet | Couverture dans l'app |
|---|---|---|
| 1 | Qui suis-je ? (histoire, arbre de vie, portrait) | AD-01 · AD-03 · Portrait chinois (Étincelle ET-06) |
| 2 | Comment je fonctionne ? (intelligences, apprentissage, personnalité) | AD-03 · Étincelle ET-01/ET-03/ET-04 |
| 3 | Mes super-pouvoirs (forces, talents, qualités) | AD-09 · « Ce qui m'allume » (Étincelle) |
| 4 | **Mon cerveau en action** (défis créatifs, logiques, orga) | **`screens/cerveau.js`** (ajouté) |
| 5 | Mes émotions (météo intérieure, besoins, régulation) | AD-04 |
| 6 | Mes relations (famille, amis, réseaux, communication) | AD-06 |
| 7 | Mes passions (exploration de 100+ activités) | AD-09 · RIASEC (Étincelle) — en partie |
| 8 | Le monde des métiers (à partir des envies) | Étincelle ET-05 (univers par envies, pas par profession) |
| 9 | **J'expérimente** (défis, immersions, rencontres pro) | **`screens/experience.js`** (ajouté) |
| 10 | Mon projet de vie (vision, valeurs, aspirations, étapes) | Étincelle (boussole + action) · AD-10 |

## Écosystème visé (et la frontière des deux audiences)
- **Carnet illustré pour l'ado** = l'app « Mode d'Emploi de Moi » elle-même.
- **Guide pour parents / accompagnants** = côté **Les Deux Jardins**, PAS dans
  l'app ado (mur de consentement).
- **Rapport personnalisé** = côté ado « Ma boussole d'orientation » (1re
  personne, privé) ; toute lecture pro passe par AD-11 (consentement explicite).
- **Défis mensuels** = piste récurrente possible (non implémentée).

## Ce qui a été ajouté suite à ce concept
- **`cerveau.js`** — « Mon cerveau en action » : 5 défis ludiques (pensée
  divergente, logique, organisation). Réponses **privées**, **aucun score**,
  aucune mesure d'originalité (garde-fou spec §9.4). Restitution = renforcement
  positif. Placé en bonus du **Programme 1**.
- **`experience.js`** — « J'expérimente » : mini-expériences (interviewer,
  observer, immersion, mini-projet, question à un pro) avec **suivi** (prévu →
  fait → « ce que j'en retiens »). Relais externes en opt-in « avec un adulte ».
  Placé dans **« L'étape d'après »**, juste après l'Orientation.
- Fiches ajoutées à **AD-11** : « J'expérimente » (partage possible, privé par
  défaut). Les défis créatifs restent **privés**, non partagés automatiquement.

## Pistes restantes (optionnelles)
- Section 7 « 100+ passions » : enrichir AD-09 / RIASEC avec un catalogue plus
  large d'activités si utile.
- « Défis mensuels » de l'écosystème : à réfléchir (rappels, suivi dans le temps).

---
_Ce document est un concept de départ. Il pourra nourrir un ouvrage papier
(200-250 pages) — hors périmètre de l'app, mais cohérent avec elle._
