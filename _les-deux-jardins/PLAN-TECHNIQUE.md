# ⚙️ Plan technique — Les Deux Jardins (build réel)

_Architecture visée : complète, performante, productive, et digne de l'amāna (sécurité des données)._

## 1. Stack
- **Front** : Next.js 14 (App Router) + TypeScript + Tailwind CSS. Rendu rapide (RSC), SEO, PWA installable.
- **Back** : Supabase (Postgres + Auth par rôles + **Row-Level Security** + Storage). Chiffrement au repos & en transit.
- **Hébergement** : Vercel (front) + Supabase (données). Dépôt **privé** dédié.
- **Contenu** : fichiers structurés (MDX/JSON) pour le corpus & les variantes de mode → édition facile sans redéploiement lourd.
- **Intégrations** (progressives) : Calendly (RDV), Zoom (séances), e-mail (envoi synthèses), export PDF, WhatsApp/Telegram (contact), Systeme.io (kits).

## 2. Modèle de données (Supabase) — le cœur productif
`practitioner · client/famille · enfant(3·5·12) · parcours(accueil→clôture) · séance(notes, météo) ·
questionnaire(type, schéma, mode) · réponse(reliée à la fiche) · protocole(clinique/spirituel, variantes) ·
workbook(assignable, statut) · synthèse "Pour toi"(brouillon→validé→envoyé) · ressource · invocation(sourcée) ·
relais_lumière`. Tout est **relié à la fiche client** → une personne circule d'un hub à l'autre sans ressaisie.

## 3. Le moteur « questionnaires » (générique, réutilisable)
Un **schéma JSON par questionnaire** (questions, échelles, scoring, restitution) rend TOUS tes questionnaires
natifs : repérages TND (ado/enfant/femme), 8 profils pro, diagnostic dys, bilans, anamnèse, candidature…
→ un seul moteur, N questionnaires, résultats **reliés à la fiche client**, exportables, en double mode.
Voir `REGISTRE-COMPLET.md` pour la liste exhaustive à couvrir.

## 4. Double mode (Universel ⇄ Islamique) — transversal
`mode: "universel" | "islamique"` persistant par utilisateur, surchargeable par hub. Un seul composant,
deux jeux de **contenus** (`content.universel` / `content.islamique`) + quelques tokens de thème.
Contenu religieux **jamais inventé**, **sourcé**, **validé par Nawel**, présenté **avec douceur**
(source repliée) — cf. `religion/CONSIGNES-cote-islamique.md` + `religion/PRINCIPE-UX-transmission-douce.md`.

## 5. Performance
RSC + streaming · images optimisées (next/image) · code-splitting par hub · cache & revalidation ·
polices self-hostées (le CSP interdit les CDN) · Lighthouse visé ≥ 95 · installable + hors-ligne (PWA).

## 6. Sécurité & éthique (l'amāna)
- Données psycho/santé **confidentielles** : RLS stricte (chaque praticienne ne voit que SES clientes),
  chiffrement, **journal d'accès**, droit à l'effacement, consentement explicite à l'accueil.
- **Aucun envoi automatique** de synthèse/message sans validation humaine.
- Aucun diagnostic ; disclaimers partout ; « la guérison appartient à Allāh » (mode islamique).
- Espace praticienne **à accès restreint** (rôles + code) ; corpus « Mal Occulte » isolé, hors-périmètre.

## 7. Feuille de route (un lièvre à la fois)
- **J0 — Socle** : app-shell « Les Deux Jardins » + design system (tokens) + moteur de mode + accueil. *(démarré)*
- **J1 — Cockpit praticienne (MVP)** : fiche client + parcours 7 étapes + météo + **moteur questionnaires**
  (anamnèse, candidature) + synthèse « Pour toi » (validation → PDF) + bibliothèque assignable.
- **J2 — Hub Parents** : Parcours Clarté TND + ressources.
- **J3 — Hub Enfants (3·5·12)** : petits maux (double mode, médecine prophétique) + coin du soir.
- **J4 — Hub Ados** : humeur, protection numérique (Bouclier), brise-glace.
- **J5 — Consolidation** : Relais Lumière, rappels, intégrations API, **import de TOUTES les apps/questionnaires**
  du `REGISTRE-COMPLET.md` (rien oublié).

## 8. Ce qui dépend de Nawel (pour brancher le réel)
Comptes/clés : **Supabase** (projet + clés), **Vercel** (déploiement), **Calendly/Zoom** (liens/API).
Sans elles, je construis **tout l'UI + la logique + données de démo** ; toi tu branches quand tu es prête.
