# 🗺️ Cartographie complète des applications & outils

_Inventaire technique détaillé du dépôt, réalisé le 7 juillet 2026. Sert de socle pour :
nettoyer les doublons, concevoir le Hub unique, améliorer chaque produit._

---

## 🌷 Univers Educa Typique

### 🧭 Boussole — racine `/`
PWA installable (cache SW `boussole-v16`). Cœur : `assets/js/` (`app.js` routeur+registre, `store.js`,
`ui.js`, `suggestions.js`, `install.js`). **Clé localStorage globale : préfixe `boussole.v1.`**
(tout passe par `Store.*`). **33 modules d'outils** dans `assets/js/tools/`, regroupés en familles :

| Famille | Outils |
|---|---|
| **TND · Dys · Neuropéda** | time timer, pomodoro, séquenceur, emploi du temps, jetons, boîte dys, profil neuro, organisateur, flashcards, carte mentale, aide à l'écriture, jeux fonctions exécutives |
| **Apprendre à apprendre** | « par où commencer », métacognition |
| **TCC · Émotions** | thermomètre émotions, roue des émotions, besoins & sensations, carnet de pensées, respiration, suivi d'humeur, gratitude |
| **Enfants 6-12** | boîte à émotions enfant |
| **Secourisme santé mentale** | trousse anti-crise (5-4-3-2-1), plan de sécurité |
| **Coin spiritualité** | liens spirituels |
| **Suivi & réglages** | fiches jeunes, dossier de suivi, modèles pro, journal ABC, personnalisation, réglages/RGPD |

Clés notables : `emotions` (partagée thermomètre+roue), `humeurs`, `jetonsEvts`, `sequences`,
`profils`, `notes`, `objectifs`, `perso`, `prefs`. Clés dynamiques : `modelePro.<type>.<jeune>`.

### 📦 Parcours Clarté TND — `parcours-clarte-tnd/`
Boîte NeuroPed assemblée en site (118 fichiers). Convention stockage : `educatypique_<nom>_v1`
(apps/ado) ou `neuroped_<nom>_v1` (pro). 44 pages persistent en localStorage.
- **`apps/` (26)** — parents : autonomie-ado, boussole-diagnostic-dys, chrono-énergies-maman,
  contrat-confiance-ado, détecteur-de-paroles, **devoirs-sans-crise** (151 Ko, la plus lourde),
  dialoguer-avec-son-ado (+ `_v2` doublon + `-ISL` variante), émotionomètre-parental,
  guide-consignes-efficaces, guide-hpi, guide-tdah-top, kit-gestion-émotions,
  ligne-du-temps-parcours-tnd, maman-neuro-atypique, matrice-urgent-important, mdph-pas-à-pas,
  mon-équipe-de-soin, mon-plan-pas-à-pas, neuro-tarbiya, pense-bête-outils,
  profils-couple-éducatif, pyramide-7-niveaux, **reprendre-confiance** (176 Ko), routines-educatypique.
- **`outils-ado/` (7)** — vocabulaire émotionnel, boîte ado TDAH, carnet intéroception,
  émotion 5 étapes, mes valeurs, module joie, thermomètre du bruit.
- **`outils-pro/` (17)** — 8 profils (cognitif, neuro, sensoriel, fonctions exécutives, habiletés
  sociales, compétences scolaires, accès apprentissages, apprentissage), 3 repérages TND
  (ado/enfant/femme), constellation motivationnelle, premiers secours psy ado PRO, protocole crise,
  radar profils, roue émotions pro, thermomètre émotionnel.
- Pages d'accueil : index, parents, ados, professionnels, parents-musulmans, offres, protection-numerique.
- + ebooks-guides (44), ressources/fiches (17), formations (11), boîte-émotions-neuroo (attente mascottes).

### 🚜 Chef de Chantier — `chef-chantier/`
Appli individuelle (PWA propre, SW v3). `index.html` (v2 : zone rouge, lycée, paie, historique jauge) +
`sous-le-capot.html` (parcours 7 postes). Clés : `chantier` + `educatypique-souslecapot-state`.
→ **PR #15 en cours.**

---

## 🌿 Univers Jannat al Qulûb

### 🌸 Al Mizan Al Qalb — `al-mizan/` (live) & `al-mizan-design/` (build source)
**Deux builds du MÊME produit.** `al-mizan-design/` = build « Claude Design » de référence (source +
assets de vente) ; `al-mizan/` = version assemblée et **déployée** (GitHub Pages), la plus récente.
Clés : `almizan.v2` (état app), `almizan.taches`, `almizan_sequenceur`.

⚠️ **Bugs de duplication dans `al-mizan/`** :
- `organiser.html`, `s-organiser.html`, `sequenceur.html`, `mes-outils.html` = **4 copies
  byte-for-byte identiques du séquenceur** (md5 `927c92db…`). `mes-outils.html` devrait être le
  **hall à 3 outils** (il existe correct dans `al-mizan-design/mes-outils.html`, `5caf238e…`).
- Fichiers identiques entre les deux dossiers : `boussole-interieure.html`, `face-au-regard.html`,
  `sequenceur.html`.
- Uniques à `al-mizan-design/` : **`vente-al-mizan.html`** (page de vente), icônes SVG, README,
  `almizan-sequenceur.html` (séquenceur antérieur, police Jost → à archiver).

### 🌙 Souffle & Lumière — `souffle-lumiere/`
SPA React (987 Ko). Site public du cabinet psycho-spirituel. Corps déjà rebrandé « Jannat al Qulûb ».
**Clé `voiechifa.v1`** (héritage). Historique des noms : Voie Chifâ → Souffle & Lumière → Jannat al Qulûb.

### 🏛️ Vitrine Jannat al Qulûb — `jannat-al-qalb/`
Vitrine statique légère et propre (23,5 Ko, sans React) = version aboutie du rebrand. Charte
sauge/amande/ivoire. Réservation TidyCal. **À finaliser (3 points)** : slug TidyCal, email de contact,
photo optionnelle.

---

## 🛍️ Pages de vente
`vente-al-mizan/` · `vente-boussole/` · `vente-souffle/` (+ source `al-mizan-design/vente-al-mizan.html`).

---

## 🧹 À NETTOYER — doublons & fichiers redondants

| # | Élément | Diagnostic | Action proposée |
|---|---|---|---|
| D1 | `parcours-clarte-tnd/apps/dialoguer-avec-son-ado_v2.html` | Copie exacte de l'original, seule diff = lien retour CASSÉ. Orpheline (aucune page n'y mène). | **Supprimer** |
| D2 | `al-mizan/organiser.html` + `al-mizan/s-organiser.html` | Alias identiques du séquenceur. | **Supprimer** (garder `sequenceur.html`) |
| D3 | `al-mizan/mes-outils.html` | Écrasé par une copie du séquenceur au lieu du hall à 3 outils. | **Réparer** (récupérer depuis `al-mizan-design/`) |
| D4 | `vente-al-mizan.html` + icônes SVG (dans `al-mizan-design/`) | Assets utiles absents de la version live. | **Remonter** vers `al-mizan/` |
| D5 | `al-mizan-design/almizan-sequenceur.html` | Séquenceur antérieur (police Jost) supplanté. | **Archiver** |
| D6 | `al-mizan-design/` (après D3/D4/D5) | Build de référence. | Conserver comme **source** (ne pas fusionner les 2 index) |

## 🔗 LIENS CASSÉS à réparer (Parcours Clarté TND)

| Fichier | Lien cassé | Cible |
|---|---|---|
| `apps/devoirs-sans-crise.html` (l. 1947, 1953) | `kit-emotions-devoirs.html`, `detecteur-paroles-devoirs.html` | fichiers inexistants |
| `outils-pro/premiers-secours-psy-ado-PRO.html` (l. 279, 325) | `../parents/premiers-secours-psy-ado.html` | dossier `parents/` inexistant |
| `apps/routines-educatypique.html` (l. 495) | `../../D_regulation/parents/methode-rahma-prophetique.html` | dossier inexistant |

## 🌐 DÉPLOIEMENTS NETLIFY (fournis par Nawel le 7 juil) — 16 apps

> ⚠️ `*.netlify.app` est **bloqué (403)** par la politique réseau des sessions Code → je ne
> peux pas ouvrir/vérifier ces sites ni récupérer leur code d'ici. Mapping fait **par recoupement
> de noms** avec le dépôt. Légende : 🟢 = source dans le repo · 🟡 = apparenté/partiel dans le repo ·
> ❌ = **source absente du repo** (à importer en ZIP, ou lien-only dans le Hub).

### 🌷 Educa Typique
| URL Netlify | App | Source dans le repo ? |
|---|---|---|
| `boite-neuro-ped-univers.netlify.app` | **Boîte NeuroPed Universelle (MASTER)** | 🟢 = version assemblée `parcours-clarte-tnd/` |
| `mon-profil-cognitif.netlify.app` | Profil cognitif | 🟢 `outils-pro/profil-cognitif.html` |
| `profil-neuro-ado.netlify.app` | Profil neuro ado | 🟢 `outils-pro/profil-neuro.html` |
| `decodeur-profil-educa-typique.netlify.app` | Décodeur de profil | 🟡 apparenté `outils-pro/` profils + `radar-profils` |
| `secours-emotionnel-ados.netlify.app` | Secours émotionnel ados | 🟡 apparenté `premiers-secours-psy-ado-PRO` + Boussole ancrage/sécurité |
| `bilan-emotionnel.netlify.app` | Bilan émotionnel | 🟡 apparenté `thermometre-emotionnel` / Boussole émotions |
| `boite-a-bobo-emotionnel-6-12-univ.netlify.app` | Boîte à bobo émotionnel 6-12 (Univ) | 🟡 apparenté `boite-emotions-neuroo/` + Boussole enfants |
| `anamne-educa-typique.netlify.app` | Anamnèse Educa Typique | ❌ absent du repo (Boussole n'a que le modèle pro « anamnèse ») |

### 🌿 Jannat al Qulûb / Voie Chifā (ISL + praticienne)
| URL Netlify | App | Source dans le repo ? |
|---|---|---|
| `boussole-voiechifa.netlify.app` | Boussole (variante Voie Chifā) | 🟡 apparenté Boussole racine |
| `boussoleado-souffle-lumiere-voiechifa.netlify.app` | Boussole ado × Souffle & Lumière | 🟡 apparenté Boussole + `souffle-lumiere/` |
| `boite-outil-emotions-6-12ans-isl.netlify.app` | Boîte émotions 6-12 **ISL** | 🟡 variante ISL de `boite-emotions-neuroo` |
| `referentielshifa-complet-voiechifa.netlify.app` | Référentiel Shifā complet | ❌ absent du repo |
| `schemas-traumas-voiechifa.netlify.app` | Schémas & traumas | ❌ absent du repo |
| `anamneses-cr-voiechifa.netlify.app` | Anamnèses + comptes-rendus | ❌ absent — **espace praticienne** |
| `shifa-decodeur-voie-chifa-cr.netlify.app` | Shifā décodeur + CR | ❌ absent — **espace praticienne** |
| `mon-assistante-nawel.netlify.app` | Mon assistante Nawel | ❌ absent — **espace praticienne** |

_(+ 3 dernières apps mises de côté « qu'on ne retouche pas pour l'instant ».)_

### 🎯 Ce que ça change
- **Question « Boîte NeuroPed en 3 copies » tranchée** : le MASTER déployé = `boite-neuro-ped-univ`,
  sa version assemblée dans le repo = `parcours-clarte-tnd/`.
- **Fragmentation confirmée** : ~16 apps = 16 déploiements Netlify séparés (répartis sur 3 comptes) →
  c'est précisément ce que le **Hub unique** doit rassembler.
- **Contrainte clé pour AMÉLIORER/FUSIONNER** : je ne peux modifier que le code **présent dans le
  dépôt**. Les apps ❌ (surtout l'**espace praticienne** : anamnèses, CR, décodeur, assistante) ne
  sont pas dans le repo → il faut soit importer leurs sources (ZIP), soit se contenter de les **lier**
  depuis le Hub sans toucher au code.
- **Amorce de l'espace praticienne restreint** : `anamneses-cr`, `shifa-decodeur-cr`,
  `mon-assistante-nawel`, `anamne-educa-typique` = le futur 3ᵉ espace à accès protégé.

## 🔀 CHEVAUCHEMENTS fonctionnels (à arbitrer pour le Hub)

- **Émotions** — très redondant : Boussole (thermomètre + roue + boîte enfant + besoins) **ET**
  Parcours (roue-emotions-pro, thermomètre-emotionnel, app-vocabulaire, émotion-5-étapes,
  kit-gestion-émotions). ≈ 9 outils autour de « nommer/mesurer/réguler une émotion ».
- **Séquenceur / organisation** — Boussole (séquenceur + emploi du temps + organisateur) **ET**
  Al Mizan (séquenceur « Vider, trier, avancer ») **ET** Parcours (routines-educatypique, matrice).
- **Profils** — Boussole (`profil-neuro`) **ET** Parcours (8 profils pro). Branding hétérogène
  (« Boussol Ados » vs « Boîte NeuroPed »).
- **Respiration / ancrage / crise** — Boussole (respiration, ancrage, plan sécurité) **ET** Parcours
  (protocole-crise, premiers-secours) **ET** Souffle & Lumière (apaisement).
