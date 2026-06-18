# 🧭 Voie Chifā & Educa Typique — applis de Nawel Haddouch

Ce dépôt réunit, derrière une page d'accueil-portail (`index.html`), les espaces
en ligne des deux cabinets de Nawel Haddouch :

| Dossier | Cabinet | Description |
|---|---|---|
| **`jannat-al-qalb/`** | 🤲 Voie Chifā | Site vitrine du cabinet psycho-spirituel |
| **`parcours-clarte-tnd/`** | 🌷 Educa Typique | Programme & bibliothèque d'outils TND (parents · ados · pros) |
| **`boussole/`** | 🌷 Educa Typique | Boîte à outils d'accompagnement des ados (100 % privée, PWA) |

> La racine (`index.html`) est désormais un **portail** qui mène à ces trois
> espaces. Boussole, autrefois à la racine, vit maintenant dans `boussole/`.

---

# 🧭 Boussole — Boîte à outils d'accompagnement des ados

Application web **100 % locale et privée** (dossier `boussole/`) conçue pour
soutenir l'accompagnement des adolescents : TCC, gestion des émotions, TND/dys,
neuropédagogie, coaching parental et secourisme en santé mentale.

> ⚠️ Boussole est un **outil de soutien**. Il ne remplace ni un diagnostic, ni un
> suivi médical, ni l'avis d'un professionnel de santé.

## ✨ Confidentialité d'abord

- **Aucun serveur, aucun compte, aucune donnée envoyée sur Internet.**
- Toutes les informations (fiches, émotions, jetons, plans…) sont stockées
  uniquement dans le navigateur de l'appareil utilisé (`localStorage`).
- Export / import de sauvegarde et effacement total disponibles dans
  **Réglages & données**.

## 🧰 Outils inclus

**TND · Dys · Neuropédagogie**
- ⏱️ **Time Timer visuel** — minuteur circulaire qui rend le temps concret
- 🪜 **Séquenceur de tâches** — routines découpées en étapes illustrées
- 📅 **Emploi du temps visuel** — planning hebdomadaire à pictogrammes, imprimable
- ⭐ **Tableau de jetons** — renforcement positif et récompenses

**TCC · Émotions**
- 🌡️ **Thermomètre des émotions** — nommer et mesurer l'intensité
- 💭 **Carnet de pensées** — restructuration cognitive (colonnes de Beck)
- 🫁 **Respiration guidée** — cohérence cardiaque, carrée, 4-7-8
- 📈 **Suivi d'humeur** — journal quotidien + courbe d'évolution

**Secourisme en santé mentale**
- 🧰 **Trousse anti-crise** — ancrage 5-4-3-2-1 et techniques express
- 🆘 **Plan de sécurité** — co-construit, imprimable, avec numéros d'urgence

**Ancrage & spiritualité**
- 🤲 **Carnet de gratitude** — cultiver le positif

**Mes applications**
- 🔗 **Hub** — rassemble en un seul endroit vos applications externes (liens
  modifiables : ajout / édition / suppression)

**Suivi & réglages**
- 🗂️ **Dossier de suivi** — frise chronologique consolidée par jeune, notes de
  séance, objectifs d'accompagnement, synthèse imprimable
- 👤 **Fiches des jeunes** — suivi anonymisable
- 🔍 **Journal ABC** — analyse fonctionnelle du comportement
- ⚙️ **Réglages & données** — confort dys, taille, contraste, mode sombre, sauvegardes

## 🧠 Intelligence d'usage

- **Tableau de bord** : aperçu du jour par jeune (humeur, dernière émotion,
  jetons) et actions rapides
- **Suggestions bienveillantes** : après une émotion intense ou une humeur basse,
  Boussole propose un outil d'apaisement (respiration, ancrage, plan de sécurité)
- **Recherche d'outils**, **favoris** épinglables et **outils récents**

## ▶️ Utilisation

Aucune installation, aucun outil de build. Ouvrez `index.html` (le portail) dans
un navigateur récent (Chrome, Firefox, Edge, Safari), ou directement
`boussole/index.html` pour la boîte à outils.

### Mettre en ligne (gratuit, recommandé)

Hébergez le dossier sur **GitHub Pages** :
1. Réglages du dépôt → *Pages* → *Deploy from a branch* → branche principale,
   dossier `/ (root)`.
2. Ouvrez l'URL fournie, puis « Ajouter à l'écran d'accueil » sur tablette/mobile
   pour l'utiliser comme une application (et hors-ligne).

## 🌍 Accessibilité

- Police « dys » + espacement renforcé, tailles de texte, contraste élevé
- Navigation au clavier, libellés ARIA, respect de `prefers-reduced-motion`
- Pensée mobile-first (séance sur tablette, devoirs à la maison)

## 🛠️ Architecture (pour faire évoluer)

Vanilla JS, sans dépendance. Chaque outil est un module autonome dans
`boussole/assets/js/tools/` qui s'enregistre via `Boussole.registerTool(...)`.
Ajouter un outil = créer un fichier dans ce dossier et l'inclure dans
`boussole/index.html` (et dans `boussole/sw.js` pour le cache hors-ligne). Le
stockage passe par `Store` (`boussole/assets/js/store.js`) et l'interface par
`UI` (`boussole/assets/js/ui.js`).
