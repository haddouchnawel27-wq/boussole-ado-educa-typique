# 📍 Recensement — quelle version fait foi, et où

_Scan complet du 16 novembre 2026 : registre officiel du hub + déploiements réels (Vercel, Netlify) + dossiers du dépôt + branches._
_Objectif : avant de « brancher », savoir pour **chaque outil** laquelle de ses versions fait foi._

> **Ordre de vérité** (du plus fiable au moins fiable) :
> 1. **Le registre du hub** `les-deux-jardins-app/lib/apps.ts` — la liste officielle maintenue par Nawel.
> 2. **La branche par défaut** `claude/gracious-davinci-t0zife` (= site publié).
> 3. **Les déploiements en ligne** (Vercel / Netlify) — ce que le public voit.
> 4. Les fichiers locaux sur le PC = **copies**, souvent dépassées.

---

## 🧩 1. Registre officiel du hub — 18 applis (`apps.ts`)

### 🌷 Univers Educa Typique
| Appli | Catégorie | Où elle vit | Type |
|---|---|---|---|
| Cap Educa (boîte à outils ados) | Boîte à outils | Vercel `boussole-ado-educa-typique.vercel.app` | **interne** (dépôt) |
| Boîte NeuroPed Universelle (MASTER) | Parcours Clarté TND | Netlify `boite-neuro-ped-univers.netlify.app` | **master** (= `parcours-clarte-tnd/`) |
| Mon profil cognitif | Profil | Netlify `mon-profil-cognitif` | 📋 questionnaire |
| Profil neuro ado | Profil | Netlify `profil-neuro-ado` | 📋 questionnaire |
| Décodeur de profil | Profil | Netlify `decodeur-profil-educa-typique` | 📋 questionnaire |
| Bilan émotionnel | Bilan | Netlify `bilan-emotionnel` | 📋 questionnaire |
| Secours émotionnel ados | Premiers secours | Netlify `secours-emotionnel-ados` | externe |
| Boîte à bobo émotionnel 6-12 (univ) | Enfants | Netlify `boite-a-bobo-emotionnel-6-12-univ` | externe |
| Anamnèse Educa Typique | Anamnèse | Netlify `anamne-educa-typique` | 📋 · 👩‍⚕️ praticienne |

### 🌿 Univers Jannat Al Qalb
| Appli | Catégorie | Où elle vit | Type |
|---|---|---|---|
| Boussole de l'Âme | Boîte à outils | Netlify `boussole-voiechifa` | externe |
| Boussole ado × Souffle & Lumière | Boîte à outils | Netlify `boussoleado-souffle-lumiere-voiechifa` | externe |
| Boîte émotions 6-12 (ISL) | Enfants | Netlify `boite-outil-emotions-6-12ans-isl` | externe |
| Référentiel intégré Jannat al Qulûb | Référentiel | Netlify `referentielshifa-complet-voiechifa` | externe |
| Le Jardin des Trésors | Thérapie des Noms | ChatGPT site `jardin-des-remedes…` | externe (5 volumes) |
| Schémas & traumas | Clinique | Netlify `schemas-traumas-voiechifa` | externe |
| Anamnèses + comptes-rendus | Anamnèse / CR | Netlify `anamneses-cr-voiechifa` | 📋 · 👩‍⚕️ |
| Décodeur clinique + CR | Décodeur / CR | Netlify `shifa-decodeur-voie-chifa-cr` | 📋 · 👩‍⚕️ |
| Mon assistante Nawel | Assistante | Netlify `mon-assistante-nawel` | 👩‍⚕️ praticienne |

➡️ **Voilà « les 15 apps » de ta checklist** (en fait **18** aujourd'hui). La plupart sont **externes sur Netlify**, reliées depuis le hub.

---

## ▲ 2. Déploiements Vercel (team « Nawel's projects »)
| Projet | Source | État |
|---|---|---|
| `boussole-ado-educa-typique` | ce dépôt (racine) | ✅ Ready |
| `les-deux-jardins` | `les-deux-jardins-app/` | ✅ Ready (le hub) |

## 🌐 3. Déploiements Netlify (compte `nf_team_dev`, 12 projets — tous ✅ Ready)
`jovial-sable-f547be` · `la-casa-des-ados-educa-typique-cd…` · `souffle-lumiere-voiechifa` · `anamneses-cr-voiechifa` · `decodeur-profil-educa-typique` · `anamne-educa-typique` · `secours-emotionnel-ados` · `referentielshifa-complet-voiechifa` · `boussoleado-souffle-lumiere-voiechifa` · `boite-outil-emotions-6-12ans-isl` · `mon-profil-cognitif` · `profil-neuro-ado`

> ⚠️ Le registre cite aussi des sites Netlify **non listés ici** (`boite-neuro-ped-univers`, `bilan-emotionnel`, `boite-a-bobo-emotionnel-6-12-univ`, `boussole-voiechifa`, `schemas-traumas-voiechifa`, `shifa-decodeur-voie-chifa-cr`, `mon-assistante-nawel`) → ils sont sur **un autre des 3 comptes Netlify**. À rescanner compte par compte pour être complet.

---

## 📂 4. Dossiers d'apps DANS le dépôt (branche par défaut)
Apps/espaces versionnés ici (≠ les externes Netlify) :
`al-mizan` · `atelier-de-tri` · `atelier-grandir-serenite` · `boite-enseignants` · `casa-familles` · `chef-chantier` · `clarte-educa` · `ebook-le-point-du-jour` · `jannat-al-qalb` · `le-point-du-jour` · **`les-deux-jardins-app`** (le hub) · `ma-boussole-du-quotidien` · `moi-et-coachy` · `mon-charge-de-com` · `mon-cockpit` (nouveau ✅) · `parcours-ado` · `parcours-clarte-tnd` · `parcours-clarte-tnd-offre` · `posture-sereine` · `souffle-lumiere` · pages de vente `vente-*`.

## 📋 5. Questionnaires cliniques intégrés (`questionnaires.ts`)
Système de bandes d'intensité (🟢 léger / 🟠 modéré / 🔴 élevé → orientation médicale) pour : Waswās/pensées intrusives · Colère · Anxiété/stress chronique · Tristesse (ḥuzn) · Traumatisme · Estime de soi/imposteur · Deuil · Faiblesse de foi (futūr) · + garde-fous (désespoir/qunūṭ → parole immédiate). **Jamais de diagnostic** : orientation douce.

---

## 🌿 6. Branches (toutes synchronisées sur la publiée, sauf anciennes)
- **`claude/gracious-davinci-t0zife`** = **défaut / référence** (16 nov) — « Chef de Chantier v2 + décodeurs de secours ».
- Actives récentes : `salam-aleyki-partenaire` (Jardin des Trésors au registre) · `chef-chantier-upgrade` · `wellbeing-check` · `nouvelles-aventures` · `casa-familles` · `atelier-de-tri` · `point-du-jour-douceur/maj` · `codex/mcc-fabrique-publications`.
- Anciennes (juin-août, probablement absorbées) : `awesome-curie` · `lucid-dirac` · `nouveau-projet` · `fil-deux-jardins-propre` · `cap-educa-gardes-monetisation` · `partenaire-lien-mot-a-mot`.
- **`claude/partenaire-comment-vas-tu-kfi56n`** (cette branche) : cartographie + **Mon Cockpit**.

---

## ✅ 7. Ce que ce recensement règle
- **Les « 15 apps »** = les 18 du registre `apps.ts` (surtout externes Netlify) → **version qui fait foi = le lien du registre**.
- **Doublons locaux** (Pense-Bête v4, semainiers, planificateurs) = copies PC, remplacées par les versions en ligne / `mon-cockpit`.
- **La version qui fait foi d'une appli** = son entrée dans `apps.ts` (interne → dépôt ; master → `parcours-clarte-tnd/` ; externe → son site Netlify/ChatGPT).

## ❓ 8. Reste à faire pour un recensement 100 %
1. **Rescanner les 2 autres comptes Netlify** (7 sites cités mais non listés sur le compte scanné).
2. Confirmer les apps `soon:` du hub (ex. « Devoirs sans crise » répondait vide au test du 19/07 — à rebrancher).
3. Décider du **point d'entrée unique** : le hub `les-deux-jardins-app` (`/cockpit`, `/questionnaires`, `/hub/parents`, `/hub/enfants`) est prêt à tout relier.
