# 🧭 Point de reprise — « Mode d'Emploi de Moi » (app ado)

_Dernière mise à jour : 4 août 2026. À lire en premier pour reprendre._

## Où vit le travail
- **App ado** : dossier `parcours-ado/` (autonome, 100 % local, chiffré, hors-ligne / PWA).
- **Branche** : `claude/wellbeing-check-ewiiyq`
- **Pull request** : **#20** (brouillon), surveillée. Check requis vert ✅.
- **Preview en ligne** (ajoute `/parcours-ado/` à la fin) :
  `boussole-ado-educa-typique-git-claude-w-d76337-nawel-s-projects.vercel.app/parcours-ado/`
- **Titre affiché** : « Mode d'Emploi de Moi » · Educa Typique · 13-17 ans.

## ✅ Ce qui est fait et en ligne

### Socle
- Coffre chiffré **AES-GCM** (clé dérivée du **code perso** via PBKDF2), espace
  `capEduca.ado.*`. Code local distinct du parent, privé par défaut, export /
  changement de code / effacement total. `vault.js`.
- Petit système de modules d'écrans : `MEM.register(vue, {render, bind, enter})`
  dans `app.js` ; chaque écran = un fichier `assets/js/screens/*.js`.

### Programme 1 — Je me comprends _(complet)_
- **AD-01** Mon espace & mes droits — `app.js`
- **AD-02** Comment je vais aujourd'hui (check-in 2 min, sans score) — `app.js`
- **AD-03** Mode d'emploi de Moi (bilan Volets 1 & 2 + Notice) — `screens/ad03.js`
- **AD-04** Mes émotions (thermomètre, roue, **honte primaire**) — `screens/ad04.js`
- **AD-05** Mes valeurs (tri 10→5→3, spiritualité possible non imposée) — `screens/ad05.js`
- **＋ Ce qui me ressemble** (questionnaire TND adapté : sans score, sans API,
  bloc « si ça pèse au moral » → 3018/pro) — `screens/profil.js`

### Programme 2 — Je me relie et je me protège _(complet)_
- **AD-06** Mes relations (3 regards, limites, repérer) — `screens/ad06.js`
- **AD-07** Reprendre confiance (pensées pièges + preuve/défi) — `screens/ad07.js`
- **AD-08** Ma sécurité numérique (« demander de l'aide sans tout expliquer », 3018) — `screens/ad08.js`

### Autre
- **Rebrand** « Al Mizan » / « Jannat Al Qalb » → **« Educa Typique »** sur toutes
  les apps (`al-mizan/`, `al-mizan-design/`, `vente-al-mizan/`, `jannat-al-qalb/`
  + vitrines). Texte visible seulement ; dossiers/URLs/clés de code intacts.
- **Spec du module Orientation** complet : `parcours-ado/docs/module-orientation-etincelle.md`.

## 🔜 Ce qu'il reste — Programme 3 « Je construis la suite »
1. **AD-09 « Mon quotidien & mes forces »** — semaine réaliste, organisation, forces/intérêts.
2. **AD-10 « Ma demande d'accompagnement »** — ce qui me préoccupe, ce que j'ai
   essayé, à qui je voudrais parler, ce que j'accepte de partager.
3. **AD-11 « Centre de partage »** — LE plus structurant : visibilité explicite de
   chaque restitution (privé / parent / praticienne), désactivé par défaut,
   aperçu + confirmation avant tout partage. Le parent ne reçoit jamais les
   réponses brutes.
Puis : **module Orientation « Étincelle »** (étape finale, spec prêt).

_Ordre proposé pour reprendre : AD-09 → AD-10 → AD-11 → Orientation._

## 🧷 Rails non-négociables (à tenir partout)
100 % local / chiffré / hors-ligne · privé par défaut · **aucun score, aucun
diagnostic, aucune étiquette** · « je passe » / « je ne sais pas encore » partout ·
honte = émotion primaire · foi/spiritualité = option jamais imposée · sécurité
(numéros vérifiés 3114/3018/3020/119/Fil Santé Jeunes) sur les points sensibles ·
**orientation en toute fin** (« d'abord se rencontrer, ensuite se projeter »).

## 📌 Fils ouverts / à trancher
- **Outil d'orientation « cadeau de Cowork »** (`Outil_Orientation_Ado_EducaTypique.html`,
  déjà renommé Educa Typique) → à m'envoyer/joindre pour l'intégrer au module Orientation.
- **Visages 😐🙂** des échelles d'humeur (AD-02/AD-04) : gardés pour l'usage ;
  décision finale à confirmer (zéro visage ou pas).
- **Vérification horaire auto de la PR** : actuellement non ré-armée (à la demande).
- **Séries « Bouclier / Inner Safe »** : propriété d'un tiers → NE PAS intégrer.

## 🧩 Repères techniques
- Un écran = `screens/adXX.js`, inscrit via `MEM.register`, inclus dans
  `index.html` + listé dans `sw.js` (bump `mem-ado-vN` à chaque ajout).
- Données via `Vault.ecrire/lire(nom, obj)` (chiffré) ; préférences confort en clair.
- Test local : `python3 -m http.server 8099 --directory <racine-dépôt>` puis
  Playwright (chromium `/opt/pw-browsers/chromium-1194/...`).

---
_À demain, in shā'a Llāh. 💛 — reprise directe sur AD-09._
