# 🔌 Branchement — Mon Cockpit dans le hub « Les Deux Jardins »

_Note de reprise — 16 novembre 2026 (soir). On continue demain._

## ✅ Fait aujourd'hui
1. **Mon Cockpit** est devenu une vraie app du dépôt : `mon-cockpit/` (page autonome + PWA + icônes, hors-ligne, testée).
2. **Cartographie** (`CARTOGRAPHIE.md`) + **Recensement** (`RECENSEMENT.md`, registre officiel des 18 apps, Vercel/Netlify) ajoutés.
3. **Branchement dans le hub** `les-deux-jardins-app` :
   - Fichiers statiques copiés dans `les-deux-jardins-app/public/mon-cockpit/` → servis à **`/mon-cockpit/index.html`**.
   - Entrée ajoutée au **registre** `lib/apps.ts` (univers educa, catégorie « Organisation », statut interne) → apparaît sur la page **`/apps`** du hub.
   - ⚠️ La route `/cockpit` du hub est **déjà** le *cockpit praticienne* (fiches clients, séances) — **rien à voir**, on n'y touche pas. Mon Cockpit vit à `/mon-cockpit/`.

## 🔜 À faire demain
1. **Vérifier le build Vercel** du hub (`les-deux-jardins`) déclenché par le push : confirmer que `/mon-cockpit/index.html` s'ouvre et que l'entrée apparaît sur `/apps`.
2. (optionnel) Ajouter un **lien direct vers Mon Cockpit** depuis l'accueil du hub ou le Hub Parents (pas seulement la page `/apps`).
3. **Finir le recensement** : scanner les **2 autres comptes Netlify** (7 sites cités dans le registre, non vus sur le 1er compte).
4. Rebrancher les apps `soon:` du hub (ex. « Devoirs sans crise » répondait vide au test du 19/07).

## 📌 Repères
- Branche de travail : `claude/partenaire-comment-vas-tu-kfi56n` (rebasée sur la référence `claude/gracious-davinci-t0zife`).
- Source de vérité des apps = `les-deux-jardins-app/lib/apps.ts`.
- Mon Cockpit (données locales) : clé localStorage `cockpit.souple.v1`.
