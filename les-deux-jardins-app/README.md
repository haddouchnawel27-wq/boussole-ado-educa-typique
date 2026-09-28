# 🌿 Les Deux Jardins — application (build réel)

App **Next.js 14 + TypeScript + Tailwind** de l'écosystème *Jannat al Qulûb 🌸 & Educa Typique 🌱*.
Socle **Jalon 0** : app-shell, design system (thème v1), moteur de double mode Universel ⇄ Islamique.

## Mode actuellement autorisé

- usage individuel par Nawel sur son ordinateur ;
- connexion praticienne obligatoire ;
- dossiers pseudonymisés sauvegardés automatiquement dans ce navigateur ;
- protection technique locale automatique, sans phrase supplémentaire à saisir ;
- aucune lecture ni écriture de données cliniques dans Supabase ;
- aucune synchronisation entre appareils ;
- le stockage clinique cloud reste verrouillé tant que le chantier HDS/RGPD
  n'a pas été formellement validé.

> Graine du futur **dépôt privé dédié** (déployable sur Vercel). Voir `../_les-deux-jardins/` pour le
> brief, le design system, le registre complet et le plan technique.

## Démarrer
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run typecheck
```

## Structure
- `app/` — App Router (`layout.tsx`, `page.tsx` = accueil des deux jardins, `globals.css`).
- `components/` — composants UI (`ModeToggle`).
- `lib/mode.tsx` — moteur du double mode (persistant, surchargeable par hub).
- `tailwind.config.ts` — design tokens (voir `_les-deux-jardins/theme.css`).

## Prochaines étapes
- Polices self-hostées (Cormorant Garamond, Lato, Quicksand, Amiri).
- Cockpit praticienne (Jalon 1) : fiche client, parcours 7 étapes, moteur de questionnaires, synthèse « Pour toi ».
- Supabase (Auth, Postgres, RLS) — nécessite les clés de Nawel.
