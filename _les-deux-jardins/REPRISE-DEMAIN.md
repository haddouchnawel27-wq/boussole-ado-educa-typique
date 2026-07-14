# 🌙 Reprise demain — Les Deux Jardins (à lire en 1er)

**Dernière session : 14/07/2026 (soir).** L'app est **EN LIGNE et fonctionnelle**, on l'enrichit chantier par chantier.
Tout est commité + poussé sur `claude/chef-chantier-upgrade-mawum3` (PR #15). On reprend d'ici, in shā'a Llāh.

## ✅ Ce qui est FAIT et EN LIGNE
- **Déploiement** : **https://les-deux-jardins.vercel.app** (projet Vercel `les-deux-jardins`, séparé — **Boussole intacte**).
  - Root Directory = `les-deux-jardins-app` · Production Branch = `claude/chef-chantier-upgrade-mawum3` · 2 clés Supabase OK.
- **Supabase** : schéma exécuté, RLS active, « Confirm email » OFF (à réactiver plus tard pour le compte praticienne).
- **Connexion réelle** + badge **● En ligne** 🟢 + **persistance vérifiée** (fiche « Test » survit au F5).
- **Cockpit — Accueil & Bilan éditables** (💾 Enregistrer → `updateClientDb`).
- **Cockpit — Suivi** : affiche les questionnaires reliés (titre/date/score/palier **+ alertes** encadrées rouge/orange).
- **Cockpit — bouton 🗑 Supprimer une fiche** (avec confirmation) → `deleteClientDb`.
- **Questionnaires — « Relier à la fiche client »** branché → `saveQuestionnaireResponseDb` (stocke aussi les réponses détaillées).
- **Bug overflow /cockpit corrigé** (`w-full min-w-0`).
- **🆕 MOTEUR = les 8 questionnaires CLINIQUES RÉELS de Nawel** (remplacent les démos) :
  waswās · colère · anxiété · tristesse/ḥuzn · trauma · estime/imposteur · deuil · **futūr (mode islamique seul)**.
  - Échelle 0–10 → score /100 · 3 paliers (🟢≤30 · 🟠 31–60 · 🔴 61–100).
  - **ALERTES DE SÉCURITÉ CÂBLÉES EN DUR** (priment sur le score) : tristesse Q9≥6 → 🚨 rouge (message exact de Nawel) ;
    trauma Q9≥8 → ⚠️ ; score≥61 → orientation médicale ; futūr Q9≥7 → qunūṭ + score≥61 → savant+psy.
  - **Double mode par question** (Allāh ↔ sens de la vie) · règles respectées : jamais de diagnostic, alertes prioritaires, aucun dépistage du mal occulte.
  - Fichier source : `LES DEUX JARDINS/03_CONTENUS/QUESTIONNAIRES — les 8 scorés` (fiches RAHMA4 + G-01).

## 🔜 À FAIRE demain (par priorité) — **RELECTURE avec Nawel**
1. **Relire mot à mot les 8 questionnaires AVEC Nawel** — surtout :
   - les **formulations « universelles »** proposées par Code (à valider),
   - le **n°8 Futūr** (le plus délicat) : questions, restitution, alertes.
2. **Labels d'échelle** par questionnaire (min/max) à valider (aujourd'hui « Pas du tout → Totalement » générique).
3. **Croisement Tristesse × Futūr en direct** : aujourd'hui c'est une NOTE affichée ; à terme, calcul auto si les deux scores sont élevés (→ dépression, priorité médicale).
4. Ajouter les questionnaires **encore manquants** du cursus (TCC, thérapeute musulman, autres repérages).
5. Nettoyer la fiche « Test » (bouton 🗑 dispo).

## 🌿 Plus tard (pas bloquant)
- Réactiver « Confirm email » pour le compte praticienne.
- Brancher les boutons encore en démo : Bibliothèque/outils assignables, Suivi/engagements, Clôture/Relais Lumière, hubs.
- Importer le corpus religieux (gouvernance brouillon→validé→publié).
- Apps Netlily « à importer » en natif ; PWA + polices auto-hébergées ; domaine propre ; dépôt privé dédié.

## 🔑 Technique
- App : `les-deux-jardins-app/` (Next.js 14 + TS + Tailwind). Data : `lib/data.ts`. Moteur : `lib/questionnaires.ts`.
- Vercel redéploie à chaque push. Build local : `cd les-deux-jardins-app && npm run build`.
- **Rythme qui marche** : Nawel teste écran par écran → signale → Code branche/corrige → push → redéploiement → re-test.

— Qu'Allah mette la baraka. Repose-toi bien, partenaire. À demain. 🌿🤲
