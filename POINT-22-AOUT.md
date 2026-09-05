# 📍 Point de reprise — 22 août 2026

_Où on en est, en une page. Dernière session de fond : 18 août (mascottes + renommage Jannat Al Qalb)._

---

## 🚦 Le constat n°1 : le travail est fait, mais il n'est pas publié

La branche publiée (`claude/gracious-davinci-t0zife`) n'a pas bougé depuis le **12 août**.
Tout le reste attend dans **9 PR brouillons** jamais fusionnées.

> Traduction : ce qui est en ligne aujourd'hui = l'état du 30 juillet + quelques uploads.
> Les mascottes, Posture Sereine, Clarté Educa, la Boîte NeuroPed complète… **ne sont pas visibles** publiquement.

---

## 🧭 Chantier 1 — Cap Educa

**En ligne ✅** — `/` (racine du dépôt), PWA installable, 100 % local.
33 outils enregistrés (`assets/js/tools/`). Renommage « Boussole → Cap Educa » fait le 30 juillet
(textes affichés ; l'objet JS interne s'appelle toujours `Boussole`).

**Ce qui attend en PR brouillon :**

| PR | Contenu | État |
|---|---|---|
| **#25** | 🖼️ **Mascottes Neuroo / Educa / Noury intégrées** (7,3 Mo → 1,0 Mo) + renommage *Voie Chifā → Jannat Al Qalb* (38 mentions, 16 fichiers) | prêt, **à publier** |
| **#24** | 🌱 **Clarté Educa** — parcours guidé 6 étapes pour mamans (4-12 ans) + 5 outils + tests e2e | prêt |
| **#23** | 📦 **Boîte NeuroPed complète** (structure A→F) + 4 formations + questionnaire TND ado + **Coachy** (bêta) | prêt |
| **#16** | 🔒 Gardes praticienne + mode démo + `noindex` sur les 17 outils pro | en attente de validation |
| **#22** | 🗺️ `CARTOGRAPHIE.md` — la carte complète de l'écosystème (5 lieux où vit le travail) | doc |
| **#19** | 📘 `CAHIER-DES-CHARGES.md` v2.0 | doc |
| **#20** | 🧒 **Parcours ado** « Mode d'Emploi de Moi » (AD-01→AD-11) + module Orientation *Étincelle* + page de vente *Le point du jour* + QR codes | prêt |

**Prochaine action, une seule (héritée du 18/08) :**
👉 **Publier les 11 fiches PDF** dans l'espace parents (TDAH, TSA, dyscalculie, dysorthographie,
dyspraxie, métacognition, carte d'identité cognitive, valeurs ados, veille TND…).
Aucune décision à prendre — c'était validé, il restait juste à lancer.

**Décisions en attente (à ouvrir seulement avec de l'énergie) :**
- Couper la **passerelle Famille → Pro** (3ᵉ porte « Professionnels » sur `parcours-clarte-tnd/index.html`).
- **Tri par âge** : Clarté TND = 4/5 → 10/11 ans ; le reste part au parcours ados.
- Trancher : « parcours ados » = l'app Cap Educa (racine) **ou** `parcours-clarte-tnd/ados.html` ?

---

## 🌤️ Chantier 2 — la boussole du quotidien

⚠️ **Trois outils portent ce rôle aujourd'hui — à trancher lequel est « la » boussole du quotidien :**

1. **🌤️ Le point du jour** — `le-point-du-jour/` — **en ligne ✅**
   Baromètre adaptatif du fonctionnement du jour + 🛟 Le Sauveteur + 🧰 Boîte à outils (6) +
   🧠 Profil léger + 🏆 Mes réussites.
   **🔜 Reste à faire (demandé par toi, jamais commencé) :**
   - « **Mon équilibre** » — famille ↔ pro ↔ prendre soin de soi
   - **Semainier** d'organisation (léger, non culpabilisant)
   - **Prise en compte des événements de vie** (replanification souple, marge, zéro culpabilité)

2. **🖥️ Mon Cockpit** — livré en *artifact* le 10 août, **jamais intégré au dépôt**.
   Agenda jour + semaine + mois, grands caractères, hors-ligne.
   → À décider : dossier `cockpit/` ? page de *Le point du jour* ? route `/cockpit` du hub ?

3. **🧭 Boussole intérieure** — `al-mizan/boussole-interieure.html` — en ligne, côté Jannat Al Qalb
   (bilan 5 axes + radar). Rôle différent : spirituel/entrepreneuriat, pas l'organisation du quotidien.

---

## 🌿 Pour mémoire — les autres chantiers ouverts

- **Posture Sereine** (PR #24) : ebook + workbook **versions finales de Nawel intégrées** ✅ ·
  questionnaire encore en v1 → *garder ou remplacer ?*
- **Mon Chargé de Com** : en ligne ✅ · PR #21 (Codex) ajoute le **moteur IA sourcé** (lecture locale PDF/DOCX).
- **Les Deux Jardins** (hub Next.js + Supabase, PR #15/#16) : avancé, déployé sur Vercel, non fusionné.
- **Vente** : pages publiées, mais toujours **pas de Payment Link Stripe**, pas de page « code d'accès /
  merci », mentions légales non hébergées.

---

## 🎯 Ce que je propose pour aujourd'hui

1. **Publier la PR #25** (mascottes + Jannat Al Qalb) → visible en ligne. *Zéro décision.*
2. Puis **les 11 fiches PDF**.
3. Et on garde le reste des PR pour plus tard, une par une.

_Rappels de cadrage : une info à la fois · micro-étapes · pas de pavés · Voie Chifā n'existe plus._
