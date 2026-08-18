# 📦 Boîte NeuroPed — source complète reçue (18 août 2026)

_Nawel a envoyé `Boite_NeuroPed.zip` (24 Mo) : c'est **le dossier source du site Netlify**,
celui qu'on cherchait depuis des semaines. Il contient `F0_fondations` et **tout le reste**._

---

## ✅ Ce qui a été intégré immédiatement

### Mascottes (le blocage historique est levé)

| Fichier | Personnage | Emplacement |
|---|---|---|
| `neuroo.png` | Neuroo — l'explorateur (menthe) | `assets/mascottes/` |
| `educa.png` | Educa — la guide (rose/lavande) | `assets/mascottes/` |
| `noury.png` | Noury — la studieuse (rose) | `assets/mascottes/` |
| `groupe-mascottes.png` | Les 3 ensemble (« Fin de module ») | `assets/mascottes/` |
| `histoire-de-lea.png` | Scène « L'histoire de Léa » (8 ans, TDAH, devoirs) | `assets/illustrations/` |

Images optimisées pour le web : **7,3 Mo → 1,0 Mo** (palette 256 couleurs, redimensionnées).
Les originaux haute définition (1254 px) restent chez Nawel.

> ⚠️ **Il n'y a que 3 mascottes.** `Neuro-et-Lea.png` n'était pas un 4ᵉ personnage mais une
> illustration de cas pratique — d'où son déplacement dans `assets/illustrations/`.

---

## 🗂️ Ce que contient la Boîte NeuroPed (et qui n'est PAS encore en ligne)

Le ZIP est une **application complète et déjà construite** : 111 outils HTML, organisés selon
l'architecture v3 (6 axes × 3 publics), avec sa propre charte CSS et sa page d'accueil.

### Architecture du ZIP

```
Boite_NeuroPed/
├── index.html · parents.html · ados.html · parents-musulmans.html
├── a-propos.html · aujourdhui.html · classeur.html · _carte-outils.html
├── A_reperage/       (parents · ados · praticiens)   — 13 outils, déjà tous en ligne ✅
├── B_observation/    (praticiens)                    —  7 outils, aucun en ligne ❌
├── D_regulation/     (parents · ados · praticiens)   — 24 outils, 12 en ligne
├── E_ludotheque/     (parents · ados · praticiens)   — 11 outils, aucun en ligne ❌
├── F0_fondations/    (parents)                       — 20 outils, déjà tous en ligne ✅
├── F_suivi/          (ados · praticiens)             — 13 outils, aucun en ligne ❌
├── Boite Neuro Ped/  (dossier antérieur)             — 13 outils, aucun en ligne ❌
├── _assets/          charte.css + mascottes          — ✅ mascottes intégrées
└── _pdfs_nawel/      11 PDF signés EducaTypique      — ❌ pas en ligne
```

### Bilan chiffré

| | Nombre |
|---|---|
| Outils HTML dans le ZIP | **111** |
| Déjà publiés dans `parcours-clarte-tnd/` | ~47 |
| **Outils inédits à publier** | **~60** |
| PDF EducaTypique inédits | 11 |
| Documents Word (jeux imprimables) | 3 |

### Les gros absents du site actuel

**Axe B — Observation & évaluation (7 outils praticiens, 0 en ligne)**
`grille-abc` · `grille-observation-classe` · `grille-observation-parent` ·
`analyse-fonctionnelle` · `bilan-4-theoriciens` · `atelier-zpd-55min` · `pack-fondation`

**Axe E — Ludothèque cognitive (11 outils, 0 en ligne)**
`des-emotions` · `cartes-scenarios-parent-enfant` · `apprivoise-tes-emotions` ·
`memoire-en-images` · `jeux-maison-fe` · `jeu-chitane` · `jeux-adaptes-rahma-tech` ·
`roue-conversation` · `choisis-une-reponse` · `jeux-cognitifs-ados` · `catalogue-jeux-fe`

**Axe F — Suivi & traçabilité (13 outils, 0 en ligne)**
`anamnese-tnd` · `objectifs-smart` · `tableau-suivi-progres` · `fiche-profil-eleve` ·
`carnet-seances` · `restitution-famille` · `bilan-programme-12` · `aide-pap-pps-pai` ·
`contrat-tripartite-eleve-parent-ecole` · `fiche-attachement-tdah` ·
`journal-reussites` · `chrono-energies` · `fiche-introspective-hebdo`

**Axe D — Régulation, les manquants (12 outils)**
`boite-emotions-19` + variante `-ISL` (l'app maître 19 émotions !) · `kit-calme` ·
`kit-emotions` · `roue-emotions` · `boite-secours` · `appli-emotions-ados` ·
`devoirs-sans-crise-app` · `methode-rahma` + `-prophetique` ·
`recadrer-sans-exploser` · `premiers-secours-psy-ado`

**Dossier `Boite Neuro Ped/` (13 outils antérieurs)**
`aide-epuise` (+ version ado) · `apprendre-a-apprendre` · `controle-influence-lache` ·
`cours-tnd-interactif` · `schema-declencheur-tcc` · `trouble-dys-executif` (+ `-pro`) ·
`triangle-tcc` · `detecteur-pensees-pieges` · `carte-mentale-qui-je-suis` ·
`mode-emploi-moi-meme` · `reprendre-confiance`

---

## 🤔 Décision à prendre avec Nawel

La Boîte NeuroPed est un **produit distinct** du Parcours Clarté TND, avec sa propre
architecture, son public praticiens et sa propre stratégie de prix
(cf. `_NOTES_STRATEGIE_COMMERCIALE.md` du ZIP : 3 blocs — Familles 89-129 € /
Pros 297-497 € / Jannat Al Qalb 49-79 € add-on).

**Trois options :**

1. **Publier la Boîte NeuroPed en produit séparé** — `boite-neuroped/` à la racine du dépôt,
   avec son `index.html` et ses 6 axes tels quels. Le plus fidèle à son architecture, et
   cohérent avec la stratégie « 3 blocs ». Le Parcours Clarté reste la porte d'entrée grand public.
2. **Fusionner les outils inédits dans le Parcours Clarté** — répartir les ~60 outils dans
   `apps/`, `outils-ado/`, `outils-pro/`. Un seul site, mais on perd la logique des 6 axes.
3. **Mixte** — publier la Boîte comme espace pro séparé, et remonter seulement les outils
   « famille » (ludothèque parents, kit calme, boîte 19 émotions) dans le Parcours Clarté.

⏸️ **En attente de l'arbitrage de Nawel.**

---

## 📎 Autres pistes ouvertes par le ZIP

- `_pdfs_nawel/` — 11 fiches PDF prêtes (TDAH, TSA, Dyscalculie, Dysorthographie, Dyspraxie,
  métacognition, carte d'identité cognitive, valeurs ados, veille TND, présentation pro).
  Elles peuvent alimenter la section `ressources/` du Parcours Clarté.
- `_NOTES_STRATEGIE_COMMERCIALE.md` — la stratégie de prix en 3 blocs, à croiser avec
  l'échelle d'offres « Posture Sereine » notée dans `ETAT-DES-LIEUX.md`.
- Émotions Neuroo (Joie, Tristesse, Colère, Calme, Honte, Surprise) reçues en images —
  destinées à la `boite-emotions-neuroo/`, à cadrer avec Nawel.
- Doublons à ignorer : `guide-tdah-top - Copie.html`, `mdph-pas-a-pas - Copie.html`.
