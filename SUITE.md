# 📌 Reprise du travail — Boussole

_Note pour reprendre là où on s'est arrêtés._

## ✅ État actuel (fait et poussé)

Application **Boussole** complète, locale et privée (vanilla JS, sans dépendance),
sur la branche `claude/gracious-davinci-t0zife`. **16 outils** opérationnels.

- **Socle** : `index.html`, `assets/css/styles.css`, `assets/js/{store,ui,app,suggestions}.js`
- **Outils** dans `assets/js/tools/` : accueil (tableau de bord), hub (mes applications),
  profils, timer, sequenceur, emploi-du-temps, jetons, emotions, pensees,
  respiration, humeur, ancrage, securite, abc, gratitude, suivi, accessibilite
- **Installable / hors-ligne** (PWA) : `manifest.webmanifest`, `sw.js`
- **Évolutions récentes** : tableau de bord intelligent, dossier de suivi
  consolidé (frise + notes de séance + objectifs + impression), suggestions
  contextuelles bienveillantes, recherche d'outils, favoris, récents, mode sombre.

## 🔜 Pistes pour demain (au choix)

1. **Mettre en ligne** via GitHub Pages (adresse utilisable sur tablette/mobile).
2. **Profil neuro-cognitif natif** : questionnaire forces/défis par domaine
   (attention, mémoire, fonctions exécutives, langage…) + **graphique radar**
   + synthèse imprimable. (Inspiré de `mon-profil-cognitif` / `profil-neuro-ado`.)
3. **Boîte à émotions 6-12 ans** : version enfant plus ludique, avec variante
   d'ancrage spirituel / islamique.
4. **Intégrer nativement** les apps Netlify existantes (nécessite l'accès au
   code : rendre les dépôts publics, ou coller captures/descriptions).
5. Idées d'amélioration continue : export PDF de la synthèse, rappels,
   bibliothèque de fiches parents imprimables, thèmes de couleur.

## ℹ️ Rappels techniques

- Architecture **modulaire** : un outil = un fichier dans `assets/js/tools/`
  qui appelle `Boussole.registerTool(...)`, à inclure dans `index.html` **et**
  dans la liste du cache de `sw.js` (penser à incrémenter `CACHE`).
- Données via `Store` (localStorage), interface via `UI`.
- Vérif rapide : `node --check` sur chaque fichier + test de chargement.
