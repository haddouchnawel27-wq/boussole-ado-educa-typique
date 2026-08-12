# 🧰 Inventaire — Parcours PRO (Boîte NeuroPed)

_Recensement des outils HTML du parcours professionnel, d'après la taxonomie de `classeur.html` (structure canonique de Nawel)._
_Établi automatiquement — dernière mise à jour : import local en cours._

**Légende :** ✅ reçu (enregistré ici) · 📦 présent dans le dépôt (`parcours-clarte-tnd/`) · 🛠️ à construire · ⬜ manquant (à envoyer)

---

## A · Repérage & profils — `A_reperage/praticiens/`

| Outil | État | Source |
|---|---|---|
| Profil de compétences scolaires | 📦 | `outils-pro/profil-competences-scolaires.html` |
| Profil fonctions exécutives | ✅ + 📦 | reçu + dépôt |
| Profil socio-relationnel / habiletés sociales | ✅ + 📦 | reçu + dépôt |
| Profil sensoriel | ✅ + 📦 | reçu + dépôt |
| Profil d'accès aux apprentissages | ✅ + 📦 | reçu + dépôt |
| Trouble dys-exécutif — Outil pro | ✅ | reçu (NOUVEAU, absent du dépôt) |

## B · Observation — `B_observation/praticiens/`

| Outil | État | Source |
|---|---|---|
| Analyse fonctionnelle | ⬜ | à envoyer |
| Grille ABC | ⬜ | (le dépôt a un « Journal ABC » dans l'app racine + `assets/js/tools/abc.js`) |

## C · Compréhension — `C_comprehension/praticiens/`

| Outil | État | Source |
|---|---|---|
| Triangle TCC (pensée–émotion–comportement) | ✅ | reçu (NOUVEAU) |
| Détecteur de pensées pièges | ✅ | reçu (NOUVEAU) |

## D · Régulation — `D_regulation/praticiens/`

| Outil | État | Source |
|---|---|---|
| Protocole de crise | 📦 | `outils-pro/protocole-crise.html` |
| Roue des émotions | 📦 | `outils-pro/roue-emotions-pro.html` |
| Thermomètre émotionnel | 📦 | `outils-pro/thermometre-emotionnel.html` |

## F0 · Fondations — `F0_fondations/parents/`

| Outil | État | Source |
|---|---|---|
| Guide des consignes efficaces | 📦 | `apps/guide-consignes-efficaces.html` |

## F · Suivi — `F_suivi/praticiens/`

| Outil | État | Source |
|---|---|---|
| Anamnèse TND | 🛠️ | **à construire en HTML** (PDF de référence reçu : `import-local/anamnese-approfondie-REFERENCE.pdf`) |
| Fiche profil élève | ⬜ | à envoyer |
| Objectifs SMART | ⬜ | à envoyer |
| Tableau de suivi des progrès | ⬜ | à envoyer |

## Racine & navigation

| Page | État | Source |
|---|---|---|
| Classeur professionnel (hub pro) | ✅ | reçu |
| Carte des outils (`_carteoutils`) | ✅ | reçu |
| À propos | ✅ | reçu |
| Espace Ados | ✅ | reçu |
| Espace Professionnels | ✅ + 📦 | reçu + `professionnels.html` |
| Accueil (`index` / `aujourdhui`) | ⬜ | à envoyer |
| **`_assets/charte.css`** | ⬜ | **ESSENTIEL — tous les outils l'utilisent, à envoyer** |

---

## 📦 Autres outils PRO présents dans le dépôt (à repositionner dans ta taxonomie)

Non listés dans `classeur.html` mais existants dans `parcours-clarte-tnd/outils-pro/` :
- Profil cognitif · Profil neuro · Profil d'apprentissage · Radar des profils
- Repérage TND — enfant / ado / femme
- Premiers secours psy ado (PRO) · Constellation motivationnelle

→ À trancher : les intégrer à ta taxonomie A→F, ou les archiver.

---

## ⚠️ Ce qui manque pour reconstituer le parcours pro complet et fonctionnel
1. **`_assets/charte.css`** (feuille de style commune — sans elle les outils ne s'affichent pas correctement)
2. Outils non encore envoyés : analyse-fonctionnelle, grille-abc, fiche-profil-eleve, objectifs-smart, tableau-suivi-progres, index/aujourdhui
3. Anamnèse TND en version HTML (à construire)

> 💡 **Le plus efficace :** envoyer **tout le dossier Boîte NeuroPed en un seul .zip** (avec `_assets/` et l'arborescence A→F). Je reconstitue alors la structure exacte et les chemins d'un coup, au lieu du fichier-par-fichier qui perd les dossiers.
