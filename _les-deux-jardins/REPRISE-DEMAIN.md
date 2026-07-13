# 🌙 Reprise demain — Les Deux Jardins (à lire en 1er)

**Dernière session : 13/07/2026 (soir).** Grosse avancée : l'app est **EN LIGNE et fonctionnelle**.
Tout est commité + poussé sur `claude/chef-chantier-upgrade-mawum3` (PR #15). On reprend d'ici, in shā'a Llāh.

## ✅ Ce qui est FAIT et vérifié EN LIGNE aujourd'hui
- **Déploiement** : app en ligne → **https://les-deux-jardins.vercel.app** (projet Vercel `les-deux-jardins`, séparé — **Boussole intacte** sur son propre projet).
  - Root Directory = `les-deux-jardins-app` · Production Branch = `claude/chef-chantier-upgrade-mawum3` · 2 clés Supabase enregistrées.
- **Supabase** : schéma exécuté, RLS active, « Confirm email » désactivé (à réactiver plus tard pour le compte praticienne).
- **Connexion réelle** : signup/login praticienne OK → badge **● En ligne** 🟢.
- **Persistance vérifiée** : fiche « Test » créée → survit au F5 ✅ (mā shā'a Llāh).
- **Cockpit — Accueil & Bilan éditables** : intention, RDV, consentement (bouton), histoire/schémas/neuro/spirituel + bouton 💾 Enregistrer → `updateClientDb`.
- **Questionnaires — « Relier à la fiche client » branché** : choix de l'accompagnée → sauvegarde `questionnaire_responses` → `saveQuestionnaireResponseDb`.
- **Bug overflow /cockpit corrigé** : `w-full min-w-0` sur le `<main>` (colonne 1fr).
- **Moteur de questionnaires** : 5 modules — Boussole d'entrée, Charge mentale, + 🆕 Anamnèse, Biais cognitifs & schémas, Dépendance affective.

## 🔜 À FAIRE demain (par priorité)
1. **Relire/ajuster les 3 nouveaux questionnaires AVEC Nawel** — les mots (questions ET restitutions) doivent porter SA voix/clinique (contenu = 1ʳᵉ proposition à valider). Ajouter ceux qui manquent de son cursus (TCC, thérapeute musulman, autres repérages).
2. **Ré-afficher les réponses de questionnaires reliées** dans la fiche de l'accompagnée (Cockpit) — aujourd'hui on les enregistre mais on ne les remontre pas encore côté fiche.
3. **Supprimer une accompagnée** (bouton à ajouter au Cockpit — n'existe pas encore) → pour nettoyer la fiche « Test ».
4. **Continuer à débusquer les boutons « démo »** non branchés : Bibliothèque/outils assignables, Suivi/engagements, Clôture/Relais Lumière, hubs.

## 🌿 Plus tard (pas bloquant)
- Réactiver « Confirm email » pour le compte praticienne.
- Importer les vrais contenus du corpus (religieux : gouvernance brouillon→validé→publié, validation humaine).
- Rendre natives les apps Netlify « à importer » ; PWA + polices auto-hébergées.
- Renommer proprement le domaine ; extraire l'app vers un dépôt privé dédié.

## 🔑 Infos techniques
- App : `les-deux-jardins-app/` (Next.js 14 + TS + Tailwind). Couche data : `lib/data.ts` (Supabase si connectée, sinon démo).
- Vercel redéploie automatiquement à chaque push sur la branche. Build local : `cd les-deux-jardins-app && npm run build`.
- **Rythme qui marche très bien** : Nawel teste écran par écran → signale un bouton qui ne marche pas → on le branche (code + push) → Vercel redéploie → elle re-teste.

## Garde-fous toujours actifs
Aucun diagnostic · contenu religieux jamais inventé, sourcé, « à valider » · transmission douce · 100 % de son corpus.

— Qu'Allah mette la baraka dans la suite. À demain. 🌿
