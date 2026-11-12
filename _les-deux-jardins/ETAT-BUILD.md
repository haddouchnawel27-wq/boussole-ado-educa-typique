# 🏗️ État du build réel — Les Deux Jardins (app Next.js)

_Mis à jour le 7 juil 2026 (soir). Le vrai code vit dans `../les-deux-jardins-app/` (Next.js 14 + TS + Tailwind)._

## ✅ Fait aujourd'hui (vrai code, build vérifié, poussé)
| Route / élément | Contenu |
|---|---|
| Socle | app-shell, design system (thème v1), **moteur de double mode** Universel⇄Islamique (persistant) |
| `/` | Accueil des deux jardins + 4 cartes de hub cliquables |
| `/cockpit` | **Cockpit praticienne** : fiche client, parcours 7 étapes (accueil→clôture), séances + météo émotionnelle, bibliothèque, **synthèse « Pour toi »** (brouillon→validé) + **invocation réelle sourcée** |
| `/apps` | **Mes applications** : registre vivant des 16 apps Netlify + statuts + questionnaires (« le grand rattachement ») |
| `/questionnaires` | **Moteur générique** : 1 structure = N questionnaires, scoring + restitution douce (jamais un diagnostic) |
| `/hub/[slug]` | **4 hubs** (Parents/Enfants/Ados/Pro), pages pilotées par données, charte par univers |
| Navigation | **Barre unifiée** sur toutes les pages (liens + mode) → app cohérente et navigable |

Piliers respectés : aucun diagnostic (disclaimers), contenu religieux jamais inventé + sourcé + « à valider »,
transmission douce, « la guérison appartient à Allāh » (islamique), identité crème lin.

## ⏳ Reste à faire
- **Brancher Supabase** (Auth/Postgres/RLS) — nécessite les clés de Nawel → persistance des vraies données.
- **Déployer sur Vercel** (compte Nawel) + **dépôt privé dédié** (aujourd'hui l'app vit dans ce dépôt, à extraire).
- **Importer les questionnaires réels** (repérages TND, 8 profils, anamnèse) dans le moteur — contenu à valider.
- **Rendre les apps « à importer » natives** une par une (voir `REGISTRE-COMPLET.md` = checklist).
- **PWA** (installable + hors-ligne) : manifest + service worker + icônes.
- **Polices self-hostées** (Cormorant Garamond, Lato, Quicksand, Amiri) — aujourd'hui équivalents système.
- **Espace praticienne à accès restreint** (rôles + code).

## ▶️ Démarrer l'app localement
```bash
cd les-deux-jardins-app && npm install && npm run dev   # http://localhost:3000
```

## Note
L'app est développée dans `les-deux-jardins-app/` du dépôt actuel pour avancer sans friction ;
elle sera **extraite vers son dépôt privé** quand Nawel branchera Vercel/Supabase.
