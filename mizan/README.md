# ⚖️ Mîzân — Mieux te comprendre, jour après jour

Application web **100 % locale et privée** pour accompagner les **femmes entrepreneures**
sur le versant **émotions · fonctionnement · schémas · blocages**. Volet complémentaire d'un
accompagnement humain (Voie Chifâ) — elle n'intervient ni sur le business, ni sur le juridique.

> ⚠️ **Outil de soutien à la compréhension de soi.** Ne remplace ni un diagnostic, ni un suivi
> médical ou psychologique.

## ✨ Ce que fait la V1

- **Check-in du jour** (Énergie · Humeur · Clarté · Élan) → **état du jour**, **1 à 3 priorités**
  et des **recommandations adaptées**.
- **Tendances** : courbes 7 et 30 jours + une lecture simple, non culpabilisante.
- **Zones rouges enrichies** : prémenstruel, fatigue, reprise, surcharge, burn-out, dépression,
  post-partum, ménopause, séparation/deuil, préaccouchement, choc émotionnel.
- **Mes pensées** : journal TCC (méthode en 5 étapes) + les 6 biais cognitifs + les 5 questions
  de clarification — pour comprendre ses schémas et retrouver une lecture plus juste.
- **Comprendre** : bibliothèque courte (émotions, biais, dissonance, trauma & cerveau,
  neuroplasticité, hygiène de vie).
- **Résumé** hebdo + **export PDF** (avec graphiques) et **CSV**.
- **Rappels doux**, **mode crise** accessible partout, **appui spirituel optionnel** (off par défaut).

## 🔒 Confidentialité d'abord

Aucun serveur, aucun compte, aucune donnée envoyée. Tout est stocké dans le navigateur
(`localStorage`). Sauvegarde JSON et effacement total dans **Réglages**.

## ▶️ Utilisation

Aucune installation, aucun build. Ouvrez `index.html` dans un navigateur récent.

Pour mettre en ligne (et installer comme une appli, hors-ligne) : hébergez le dossier sur
**GitHub Pages**, puis « Ajouter à l'écran d'accueil ».

## 🛠️ Architecture (pour faire évoluer)

Vanilla JS, sans dépendance, 100 % statique (aucun build).

```
mizan/
├── index.html
├── manifest.webmanifest · sw.js
├── CONCEPTION-V1.md          ← architecture, écrans, data model, backlog, hors-V1
└── assets/
    ├── css/styles.css
    └── js/
        ├── store.js          ← stockage local + collections (checkins, pensees) + prefs
        ├── ui.js             ← helpers DOM (el, modal, toast, dates)
        ├── data.js           ← contenus (dimensions, zones, émotions, biais, biblio, spirituel) + moteur de reco
        └── app.js            ← routeur + écrans + export PDF/CSV
```

Voir **CONCEPTION-V1.md** pour le détail des livrables (architecture produit, arborescence,
modèle de données, backlog MoSCoW, hors-V1).
