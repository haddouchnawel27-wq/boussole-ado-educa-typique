# 🗺️ ARCHITECTURE — carte de référence (à lire pour ne plus s'emmêler)

_Posée le 15/07/2026 avec Nawel. Clarifie QUI est QUOI dans tout l'écosystème.
Beaucoup d'applis ont été créées ; on les **réorganise ensemble**. Cette page tranche le vocabulaire._

---

## 🏡 LE SOMMET : « Les Deux Jardins » = l'ÉCOSYSTÈME (pas une app)

**Les Deux Jardins** n'est pas une application : c'est l'**écosystème** de Nawel, composé de **2 mondes** :

| Monde | Marque | Pour qui | Esprit |
|---|---|---|---|
| 🌸 **Jannat al Qulûb** (Le Jardin du cœur) | adulte / praticienne / spirituel | femmes, accompagnement, Voie Chifā' | psycho-spirituel |
| 🌱 **Educa Typique** (Le Jardin des graines) | enfants / ados / TND | familles, neuro-atypie | psycho-éducatif |

> **Mode transversal** partout : **Universel ⇄ Islamique (Voie Chifā')**.

---

## ⚖️ AL MĪZĀN AL-QALB = une APPLICATION (dans le monde Jannat al Qulûb)

**Al Mīzān al-Qalb** est **une app parmi d'autres** dans l'écosystème — PAS le nom de la plateforme.
C'est **l'app de cartographie intérieure** : elle transforme chaque questionnaire en **Balance** (*mīzān*).

**Son identité (ce qui la distingue d'un test psy classique) :**
1. **Une Balance, pas un test** — restitution « Votre Balance révèle… », jamais un diagnostic.
2. **Multi-axes + radar** — chaque balance a plusieurs axes, un sous-score par axe, un **radar** qui montre *où ça penche*.
3. **Le Mīzān Dynamique** — la lecture *entre* les dimensions (ex. compétences hautes ↔ confiance basse → piste imposteur). C'est le génie de l'app.
4. **Reverse-scoring** + paliers doux + **graine du jour** (verset/du'ā sourcé).

**Pages Al Mīzān déjà prototypées** (dossier `al-mizan/`) : `index · boussole-interieure · face-au-regard · mes-outils · séquenceur`.
→ **Boussole intérieure** = prototype HTML COMPLET (5 volets : corps · émotions · stress · lien · ancrage spirituel ; radar ; reverse-scoring ; garde-fous 15/3114). **C'est la référence de la 1re Balance à intégrer.**

---

## 🧩 LES DEUX COUCHES DU MOTEUR (ne pas confondre)

1. **Repérages ciblés** = questionnaires 1 thème / 1 score / alertes → rapides, pour cibler.
   → Déjà en ligne : **8 questionnaires cliniques** (waswās · colère · anxiété · tristesse · trauma · estime · deuil · futūr) avec **alertes de sécurité câblées**.
2. **Balances** (Al Mīzān) = multi-axes / radar / sous-scores → la **cartographie** (ex. Boussole intérieure, Imposteur 6 axes).
3. **Mīzān Dynamique** = couche de lecture croisée *entre* balances (à venir quand 2-3 balances existent).

---

## 🖥️ CE QUI EST RÉELLEMENT EN LIGNE AUJOURD'HUI

**App Next.js `les-deux-jardins-app/`** → **https://les-deux-jardins.vercel.app** (Vercel, projet `les-deux-jardins`).
Routes : `/` (accueil) · `/cockpit` (praticienne, Supabase réel) · `/apps` · `/questionnaires` (8 balances cliniques) · `/hub/{parents,enfants,ados,pro}`.
- Connexion praticienne réelle (Supabase + RLS) · fiches / séances / synthèses / questionnaires reliés · alertes.
- **Boussole** (ancienne, statique) reste en ligne, intacte : **https://boussole-ado-educa-typique.vercel.app** (projet Vercel séparé).

---

## 📦 LE RESTE À RÉORGANISER (créé, pas encore intégré au grand app)

_Détail exhaustif dans `REGISTRE-COMPLET.md`. Résumé :_
- **Educa Typique** : Boussole (33 outils) · Parcours Clarté TND (Parents 26 · Ados 7 · **Pro 17, plein de questionnaires** dont repérages TND enfant/ado/femme) · Chef de Chantier (PR #15) · déploiements Netlify.
- **Jannat al Qulûb** : **Al Mīzān** · souffle-lumiere · jannat-al-qalb (vitrine) · cockpit · déploiements Voie Chifā' (anamnèses, décodeur shifa…).
- **Corpus Drive** : Thérapie des Noms · Guide du'ā · médecine prophétique (9 modules) · santé de la femme · remèdes · TCC · dépendance affective · (Mal Occulte ⚠️ isolé).

→ **But de la réorganisation** : tout devient **natif** dans l'app (résultats reliés à la fiche, double mode, export), rangé par monde/hub.

---

## 🛡️ LES RÈGLES NON NÉGOCIABLES (valables partout)

1. **Jamais de diagnostic.** Un **niveau** + une **orientation**. Jamais un nom de trouble comme verdict.
2. **Les alertes priment sur le score** (câblées en dur). Un score « léger » + alerte = urgence.
3. **Aucun dépistage du mal occulte** par questionnaire. Différentiel en séance, après médical + psychique.
4. **Neuro-atypie = orientation, jamais diagnostic.** Un auto-test ne conclut pas « autiste / TDAH » → « à explorer avec un spécialiste ».
5. **Profils / lectures croisées = hypothèses douces** (« évoque souvent… à explorer ensemble »), jamais des verdicts.
6. **Spirituel = ressenti d'appui, jamais mesure de la foi.** Items de dévalorisation spirituelle (qunūṭ) → alerte douce + restitution non-condamnante. Contenu religieux : jamais inventé, sourcé, validé (brouillon→validé→publié).

---

## 🚦 DÉCISIONS EN COURS (feux verts attendus de Nawel)

- [ ] **Porter la « Boussole intérieure » nativement** dans l'app (fidèle au prototype) = 1re Balance d'Al Mīzān.
- [ ] **Upgrader le moteur multi-axes + radar** (pour que toutes les balances en héritent).
- [ ] Puis **Balance Imposteur (6 axes)** sur ces rails.
- [ ] Profils = hypothèses douces ✔ (principe validé, à confirmer)
- [ ] Axe spirituel masquable (Voie Chifā') + alerte qunūṭ ✔ (à confirmer)
- [ ] **Balance neuro-atypie** en feuille de route (orientation, jamais diagnostic).

---

## 🧭 FEUILLE DE ROUTE AL MĪZĀN (ordre proposé)

1. **Porter Boussole intérieure** (radar compris) → prouve l'architecture Balance.
2. **Moteur multi-axes** (sous-scores par axe).
3. **Balance Imposteur** (6 axes).
4. **Balance Fonctions exécutives & neuro-atypie** (partenaire de lecture croisée de l'imposteur).
5. **Écran « Mon Équilibre »** (carte des 12 balances) + **Mīzān Dynamique** (croisements).
6. **Balance des Réussites** (type « réflexion » : questions ouvertes, non scorées).

---

## 🔤 LEXIQUE (pour ne plus se tromper)
- **Les Deux Jardins** = l'écosystème (2 mondes). PAS une app.
- **Jannat al Qulûb / Educa Typique** = les 2 mondes/marques.
- **Al Mīzān al-Qalb** = l'app de balances (dans Jannat al Qulûb).
- **Balance** = un questionnaire multi-axes avec radar (dans Al Mīzān).
- **Repérage** = un questionnaire ciblé 1 thème (les 8 cliniques actuels).
- **Cockpit** = l'espace praticienne (fiches accompagnées, Supabase).
- **Boussole** = l'ancienne app Educa (statique, `boussole-ado-educa-typique`, gardée intacte).
