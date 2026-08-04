# Mon Chargé de Com — cahier des charges consolidé V2

**Date :** 4 août 2026  
**Statut :** référence produit et technique

## 1. Promesse centrale

Mon Chargé de Com aide Nawel à passer d'une ressource ou d'une idée à un contenu
prêt à publier, sans ajouter de charge mentale. Si un blocage est présent,
l'application propose d'abord une régulation courte, puis une micro-action réaliste.

## 2. Canaux prioritaires

1. Telegram ;
2. WhatsApp ;
3. Instagram ;
4. Facebook ;
5. LinkedIn ;
6. TikTok.

La publication automatique n'est jamais imposée : l'utilisatrice relit, valide et
choisit le canal. Telegram et WhatsApp doivent toujours apparaître en premier.

## 3. Parcours principal

`sujet ou ressource → angle → accroche → plan → texte → CTA → variante → visuel → validation → planification → publication`

Parcours anti-blocage :

`check-in → score de blocage → régulation si nécessaire → micro-action → création`

La régulation peut comprendre : décharge émotionnelle, respiration, ancrage et
option spirituelle activable. Elle soutient la création mais ne la remplace pas.

## 4. Version locale disponible

- check-in et score de blocage ;
- respirations, ancrage et recentrage spirituel optionnel ;
- micro-actions selon l'énergie et le temps ;
- atelier guidé : angles, accroches, plans, CTA et hashtags ;
- bibliothèque intégrée de 24 sujets Educa Typique et Jannat al Qouloub ;
- import de ressources TXT, Markdown, CSV, JSON et HTML, ou collage direct ;
- six gabarits visuels natifs ;
- formats 1080 × 1350 et 1080 × 1080 ;
- export PNG, partage, Telegram, WhatsApp et passerelle manuelle Canva ;
- calendrier et statuts brouillon, prêt, prévu, publié ;
- préférences d'accessibilité et sauvegarde locale exportable.

Cette version fonctionne sans compte ni serveur. Elle n'effectue pas encore une
génération par IA, une veille en temps réel ou une analyse automatique des réseaux.

## 5. Bibliothèque de connaissances

La bibliothèque réunit trois niveaux distincts :

1. **Sujets intégrés** : thèmes de départ classés par univers et rubrique ;
2. **Ressources de Nawel** : notes, transcriptions et supports importés ;
3. **Créations** : idées, brouillons, publications et visuels.

Une ressource importée sert de matière de travail. Le système doit demander de la
synthétiser, la vérifier et la reformuler avant publication. Il ne doit pas la
présenter automatiquement comme un texte publiable ni reproduire un contenu tiers.

## 6. Phase connectée — stack retenue

- NestJS ;
- Prisma ;
- PostgreSQL ;
- Redis + BullMQ ;
- TypeScript strict ;
- authentification JWT avec jetons de renouvellement ;
- validation DTO ;
- tests unitaires et e2e.

Modules : `auth`, `users`, `preferences`, `checkins`, `blocking-sessions`,
`breathing-sessions`, `grounding-sessions`, `spiritual-sessions`, `content`,
`calendar`, `trends`, `analytics`, `library`, `ai`, `integrations`.

Entités : `User`, `UserPreferences`, `Checkin`, `BlockingSession`,
`BreathingSession`, `GroundingSession`, `SpiritualSession`, `ContentItem`,
`CalendarItem`, `Trend`, `LibraryItem`, `AnalyticsEvent`, `IntegrationAccount`.

## 7. Fonctions du moteur IA

- analyser le check-in et expliquer le niveau de blocage sans diagnostic ;
- recommander une régulation ou une micro-action ;
- travailler à partir d'un sujet et des ressources sélectionnées ;
- proposer hooks, angles, plan, texte, CTA et variantes ;
- adapter le ton à Educa Typique ou Jannat al Qouloub ;
- mémoriser les préférences explicitement validées ;
- résumer et scorer une tendance ;
- présenter les performances avec des explications simples.

Tout contenu reste un brouillon jusqu'à validation humaine.

## 8. API attendue

Les routes initialement définies sont conservées : authentification, profil et
préférences, check-ins, sessions de blocage et de régulation, contenu, calendrier,
tendances, analytics, bibliothèque et IA. Le module `integrations` ajoute :

- `GET /integrations`
- `POST /integrations/canva/connect`
- `DELETE /integrations/canva`
- `POST /integrations/canva/autofill`
- `POST /integrations/telegram/share`
- `POST /integrations/whatsapp/share`

Les deux dernières routes préparent un partage. Une publication automatique ou
un envoi à des destinataires exige une autorisation explicite et spécifique.

## 9. Canva

### Disponible immédiatement

L'application exporte le visuel PNG et ouvre Canva pour la finition manuelle.

### Phase connectée

La connexion réelle utilise OAuth, les API officielles Canva et des gabarits avec
champs remplissables. Le backend conserve les jetons de manière sécurisée, lance
la tâche d'autoremplissage et restitue l'URL du design. Aucun faux bouton ne doit
prétendre que cette connexion existe avant son installation réelle.

## 10. Ordre de réalisation

1. Stabiliser la version locale et sa bibliothèque ;
2. créer l'arborescence NestJS et le schéma Prisma ;
3. livrer auth, préférences, bibliothèque, contenu et calendrier ;
4. ajouter le moteur IA à partir des ressources choisies ;
5. connecter Canva ;
6. ajouter tendances et analytics ;
7. effectuer les tests unitaires, e2e et la recette utilisateur.

## 11. Règles non négociables

- Nawel garde toujours la décision éditoriale et la publication finale ;
- aucune ressource n'est envoyée à un service connecté sans information claire ;
- les données locales restent exportables et récupérables ;
- le mode local continue à fonctionner même quand le backend existe ;
- les contenus psychoéducatifs indiquent leurs limites et ne posent pas de diagnostic ;
- les sources et droits d'utilisation sont vérifiés avant publication.
