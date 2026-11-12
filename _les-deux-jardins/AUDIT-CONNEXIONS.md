# 🔍 Audit connexions + sécurité (15/07/2026) — chantier points 2 & 4

## 1) CONNEXIONS ENTRE APPS (point 2)

### Ce qui est SAIN ✅
- **`index.html` racine** = l'app **Cap Educa** (ex-Boussole) : SPA, routage `#/`, hub interne via `assets/js/tools/hub.js`.
- **parcours-clarte-tnd** : tous ses liens internes sont **vivants** (ados · parents · professionnels · offres · boite-emotions-neuroo · ebooks-guides · formations · ressources) + lien croisé `../jannat-al-qalb/index.html` ✅.
- **chef-chantier** → `sous-le-capot.html` ✅.
- **souffle-lumiere** (dépôt) : **aucun « Voie Chifā' »** (propre ici ; le reste signalé par la carte est sur la version Netlify).
- **Boîte NeuroPed** : **1 seule copie dans le dépôt** (`parcours-clarte-tnd/boite-emotions-neuroo`). Les « 3 copies » sont ailleurs (Netlify/Bureau).

### Ce qui CLOCHE ⚠️
- **Les apps sont des ÎLOTS** : aucune ne renvoie vers les autres. **Pas de hub** qui les relie → confirme « rien ne les relie encore ». Le `dashboard.html` « Bienvenue chez toi » **n'est pas dans le dépôt** (sur le Bureau de Nawel).
- **La page « Applications » de l'app Next (`lib/apps.ts`) = embryon de hub** (liste 19 apps), mais :
  - « **Boussole** » pointe vers `haddouchnawel27-wq.github.io/...` (**GitHub Pages — à vérifier, peut-être mort**) ; nom à passer en **Cap Educa**.
  - « **3 apps mises de côté** » → `url: "#"` (**placeholder mort**).
  - **6 entrées portent encore « Voie Chifā' » / `voiechifa`** (Boussole Voie Chifā, Boussole ado × Souffle & Lumière, Référentiel Shifā, Schémas & traumas, Anamnèses+CR, Shifā décodeur) → **contre la doctrine** (Voie Chifā' = cabinet associé). À rebrander en **Côté islamique / Jannat al Qulûb** OU à sortir.
- **Nom incohérent** : « Souffle **&** Lumière » (15×) · « Souffle Lumière » (2×) · « Souffle **et** Lumière » (1×) → **choisir UNE forme**.

## 2) SÉCURITÉ RLS SUPABASE (point 4)

### Audit des politiques (`supabase/schema.sql`) → **DESIGN CORRECT** ✅
RLS activée sur les 5 tables. Isolation vérifiée politique par politique :
- **practitioners** : `id = auth.uid()` ✅
- **clients** : `practitioner_id = auth.uid()` ✅
- **seances / syntheses** : visibles seulement si le client appartient à la praticienne (`exists … c.practitioner_id = auth.uid()`) ✅
- **questionnaire_responses** : `practitioner_id = auth.uid()` ✅
- **trigger `handle_new_user`** : crée la fiche praticienne avec `id = new.id`, `security definer`, `on conflict do nothing` ✅

→ **Sur le papier, chaque praticienne ne voit QUE ses fiches.** Le design est bon.

### Ce qui reste : le TEST RÉEL (je ne peux pas le lancer — réseau Supabase bloqué depuis le bac à sable)
**Protocole pour Nawel (5 min), à faire avant d'ouvrir à une 2ᵉ praticienne :**
1. Créer un **2ᵉ compte** praticienne (autre e-mail).
2. Avec ce 2ᵉ compte, aller au **Cockpit** → créer une accompagnée « TestB ».
3. **Se déconnecter**, se reconnecter avec le **1ᵉʳ compte**.
4. ✅ **Succès attendu** : le 1ᵉʳ compte **ne voit PAS** « TestB » (ni ses séances/synthèses/questionnaires).
5. Refaire l'inverse. Si chacune ne voit que ses fiches → **RLS validée en pratique.**

## 3) RECOMMANDATIONS (ordre)
1. **Nettoyer `lib/apps.ts`** (app Next) : renommer Boussole→Cap Educa, retirer/rebrander « Voie Chifā' », corriger le lien Boussole (github.io), traiter le `#` mort, unifier « Souffle & Lumière ». *(en dépôt, faisable de suite — à confirmer par Nawel car ça touche la doctrine)*
2. **Récupérer `dashboard.html`** (Bureau) → en faire **le hub unique** (porte d'entrée réelle).
3. **Faire tourner le test RLS** (protocole ci-dessus).
4. Rebrander « Souffle & Lumière » partout (nom unique).
