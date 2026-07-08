# 🚀 Passation — finir le déploiement de « Les Deux Jardins » (Vercel + Supabase)

**But :** mettre l'app en ligne pour que Nawel l'utilise avec ses vraies données.
L'app (Next.js) est **déjà codée, complète et poussée**. Supabase est **déjà créé** (tables + clés).
Il reste : (A) déployer sur Vercel, (B) régler l'auth Supabase, (C) tester.

## Contexte technique (à connaître)
- **Dépôt GitHub** : `haddouchnawel27-wq/boussole-ado-educa-typique`
- **L'app est dans un SOUS-DOSSIER** : `les-deux-jardins-app/` (Next.js 14 + TypeScript + Tailwind)
- **⚠️ Branche** : le code est sur `claude/chef-chantier-upgrade-mawum3`.
  La branche par défaut du dépôt (`claude/gracious-davinci-t0zife`) **ne contient PAS** ce dossier.
- Les clés Supabase ne sont **pas** dans git (fichier `.env.local` ignoré) → il faut les **remettre dans Vercel**.

## Clés Supabase (à coller dans Vercel — publiques, sûres)
```
NEXT_PUBLIC_SUPABASE_URL=https://ofdtxysocckczsgmkkem.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZHR4eXNvY2NrY3pzZ21ra2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTEwNzcsImV4cCI6MjA5OTA4NzA3N30.H5F58E1UJQsKaiQgsbJSuQPvMBJUt-nKKPq6s1tHNvg
```

---

## A. Déployer sur Vercel
1. Vercel → **Import Git Repository** → **Continue with GitHub** → autoriser l'accès au dépôt
   `boussole-ado-educa-typique` (All repositories ou juste celui-ci).
2. Cliquer **Import** sur `boussole-ado-educa-typique`.
3. Sur l'écran **Configure Project**, régler AVANT de déployer :
   - **Root Directory** → cliquer **Edit** → choisir le dossier **`les-deux-jardins-app`**. *(CRITIQUE)*
   - **Framework Preset** : doit afficher **Next.js** (auto-détecté). Laisser Build/Output par défaut.
   - **Environment Variables** → ajouter les **2 variables** ci-dessus (nom + valeur, une par une).
4. Cliquer **Deploy**.

### ⚠️ A.bis — LE POINT QUI COINCE : la branche
Vercel déploie par défaut la **branche par défaut** du dépôt (`claude/gracious-davinci-t0zife`),
qui **n'a pas** le dossier `les-deux-jardins-app` → le 1er déploiement peut **échouer**
(« Root Directory does not exist » ou build raté). C'est normal. Correction :
1. Projet Vercel → **Settings → Git** → **Production Branch** → mettre **`claude/chef-chantier-upgrade-mawum3`** → **Save**.
2. Onglet **Deployments** → menu **…** du dernier déploiement → **Redeploy** (ou pousser un commit).
→ Cette fois le build réussit ✅. L'app est en ligne à une adresse type
   `https://boussole-ado-educa-typique-xxxx.vercel.app` (ou renommable dans Settings → Domains).

## B. Régler l'authentification Supabase (pour que la connexion marche)
Dans **Supabase → Authentication** :
1. **URL Configuration** → **Site URL** = l'URL Vercel obtenue ci-dessus.
   Ajouter aussi cette URL dans **Redirect URLs**.
2. **Providers → Email** → pour un 1er essai fluide, **désactiver « Confirm email »**
   (sinon il faut cliquer un lien reçu par mail avant de pouvoir se connecter).
   *(On pourra le réactiver plus tard.)*

## C. Tester (le moment de vérité)
1. Ouvrir l'URL Vercel → cliquer **« Se connecter »** (en haut à droite) → **« Créer mon compte »**.
2. Entrer **nom + e-mail + mot de passe** → créer le compte → (confirmer le mail si l'option est restée active).
3. Se connecter → aller sur **Cockpit**. Le petit badge doit afficher **« ● En ligne »** (et non « Démo »).
4. Cliquer **« + Nouvelle accompagnée »** → saisir un prénom → **rafraîchir la page (F5)** :
   la fiche est **toujours là** = **✅ sauvegarde réelle réussie, mā shā'a Llāh**.

## Dépannage
- **Badge « Démo » alors que connectée** → les 2 variables d'env Vercel manquent/mal saisies,
  OU le déploiement n'est pas sur la bonne branche → revérifier A.3 et A.bis, puis **Redeploy**.
- **Build échoue** → vérifier que **Root Directory = `les-deux-jardins-app`** et **Production Branch =
  `claude/chef-chantier-upgrade-mawum3`**.
- **Connexion refusée / e-mail non confirmé** → désactiver « Confirm email » (étape B.2) ou cliquer le lien reçu.
- Après TOUT changement d'env var ou de branche dans Vercel → **Redeploy** (obligatoire).

## Ce qui restera à faire après (pas bloquant)
- Renommer le projet / domaine Vercel proprement.
- Extraire l'app vers son **dépôt privé dédié** (plus propre que le sous-dossier).
- Importer les vrais questionnaires + rendre natives les apps « à importer ».
