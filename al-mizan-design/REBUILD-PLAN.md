# 🌸 Al Mizan Al Qalb — Plan de reconstruction

> Décision (21/07) : **reconstruction propre** (pas un rustine sur le prototype).
> Cahier des charges fourni par Nawel/Ronron. Ce document = la base validée avant de coder.

## 0. Constat — pourquoi reconstruire

L'app actuelle (`al-mizan/index.html`, 2 Mo) est un **paquet généré d'un bloc** (export d'artifact) :
- aucune feuille de style — **tout est en style « inline »** sur chaque élément ;
- un mini-langage maison (`{{ }}`, `<sc-if>`) — pas du React standard ;
- construite comme une **maquette de téléphone à taille fixe** (`width: 390px` figé) → **cause racine du débordement** responsive.

⇒ Non maintenable, non testable, non accessible en l'état. On repart sur une vraie app structurée.

## 1. Architecture retenue

**Al Mizan devient une zone de l'app Next.js existante** `les-deux-jardins-app/` (route `/al-mizan`).
- ✅ Réutilise la stack déjà en place : **Next.js 14 + TypeScript + Tailwind**, déployée sur Vercel.
- ✅ Pas de 2ᵉ chaîne de build à maintenir · déploiement automatique.
- ✅ Rapatrie Al Mizan dans l'écosystème « Les Deux Jardins ».
- ℹ️ Publication finale : soit `les-deux-jardins.vercel.app/al-mizan`, soit un domaine dédié (`jannatalqalb.fr`) — **à décider au déploiement**.
- ⚠️ **Source à vérifier** : l'app en ligne `al-mizan-al-qalb.netlify.app` est un déploiement Netlify séparé. À la fin, on décide où pointer les utilisatrices (Vercel vs Netlify).

## 2. Identité visuelle à préserver (non négociable)

**Palette**
| Rôle | Couleur |
|---|---|
| Titres / vert sauge | `#4A554A` · secondaires `#8A9789` `#677465` |
| Texte foncé | `#3B2B23` · texte doux `#8C7C70` `#5E4D42` |
| Or (accents, progression) | `#B8954F` `#D8B77A` `#ECDCBF` |
| Terracotta / rose (Respirer, soutien) | `#C88E7F` `#A96B5B` |
| Fonds crème | `#FCFAF4` `#F6F0E6` `#EFE6D6` · bordures sable `#E8DDD1` `#DACDBC` |

**Typographies** : *Cormorant Garamond* (serif, titres) + *Jost* (sans, texte).
**Ton** : rassurant, doux, non culpabilisant, non médicalisant, jardin & progression, aucune injonction.
**Mouvement** : ambiances lentes ; respecter `prefers-reduced-motion`.

## 3. Les 5 espaces (navigation à conserver)

1. **Aujourd'hui** — état du jour, salutation, série (« jours que tu reviens à toi »), check-in.
2. **Tendances** — courbes par dimension (énergie, humeur, clarté, élan), jamais une note unique.
3. **Jardin** — métaphore de progression.
4. **Pensées** — journal TCC en 5 étapes (fait · pensée · émotion · comportement · lecture plus juste).
5. **Espace** — réglages, données, confidentialité, export/suppression.

## 4. Règles de fond (garde-fous)

- **Jamais un diagnostic** — vocabulaire d'observation (« niveau observé aujourd'hui », « signal invitant à ralentir »), jamais « trouble/pathologie/crise confirmée ».
- **Données 100 % locales**, chiffrables si elles quittent l'appareil ; consentement ; export + suppression ; rien de sensible dans les logs/URL/notifications.
- **Moteur de questionnaire déclaratif** (JSON) — **aucun `eval`**, branching par règles priorisées, route la plus protectrice d'abord.
- **Accessibilité** : sémantique (`header/main/nav/footer`), `aria-current`, labels, focus visible, cible 44×44, modal avec focus-trap, `aria-live`. Objectif Lighthouse ≥ 90 (a11y / SEO / bonnes pratiques).
- **Responsive** : fluide de **320 à 1440 px**, aucun scroll horizontal, titres en `clamp()`, `min-width:0` sur les enfants flex/grid.

## 5. Feuille de route (phases — validation à chaque fin de phase)

- **Phase 1 — Fondation & responsive** : squelette `/al-mizan`, design tokens (palette/typo), **coquille d'app fluide** (fini le 390 px figé) + navigation 5 espaces, HTML sémantique. → captures 320/390/768/1280.
- **Phase 2 — Accessibilité** : clavier complet, check-in accessible (sliders nommés), modal focus-trap, métadonnées SEO/PWA.
- **Phase 3 — Données & onboarding** : mode démo séparé, onboarding (prénom facultatif, confidentialité, démo/vide), états vides, service de stockage.
- **Phase 4 — Questionnaire** : `questionnaire.schema.json` + `questionnaire.v2.json` + validateur + moteur de branching sans `eval` (6 blocs, seuils, réponses manquantes).
- **Phase 5 — Parcours adaptatifs** : routes de soutien (les plus protectrices d'abord), synthèse par dimension, tendances.
- **Phase 6 — Sécurité & tests** : export/suppression, confidentialité/consentement, tests (unitaires + Playwright + axe), monitoring sans données sensibles.

### À la fin de chaque phase : fichiers modifiés · problèmes corrigés · tests exécutés + résultats · reste à faire · décisions à valider.

---
*Réf. : cahier des charges Nawel/Ronron · identité extraite du prototype `al-mizan/index.html` le 21/07.*
