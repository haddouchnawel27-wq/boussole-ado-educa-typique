# 🌤️ Le point du jour

Un **baromètre doux du fonctionnement du moment**, personnel et **100 % hors-ligne**.
Il t'aide à voir *où tu en es aujourd'hui* et t'oriente vers le bon niveau d'aide — sans
ajouter de charge, sans jugement.

> Outil de **soutien**, pas un diagnostic ni un service d'urgence. Ne remplace pas l'avis
> d'un professionnel.

## ✨ Le principe

Un questionnaire **adaptatif**, une question par écran, ton non culpabilisant :

1. **État du moment** — humeur globale, énergie, concentration.
2. **Modes adaptatifs** — si l'énergie/concentration sont basses (ou « débordée »), on passe en **mode bref** (moins de blocs). Si « en crise » → **route protection** directe.
3. **Blocs mesurés** (fréquence 0→3) — Blocages · Anxiété · Dysrégulation émotionnelle · Surcharge émotionnelle · Charge de travail.
4. **Synthèse** — état global (stable / vigilance / surcharge / protection), score par domaine, **message + action douce** là où ça coince, et un **mode conseillé**.

Route protection : respiration guidée + ressources (3114, 15/112) + disclaimer.

## 🔒 Confidentialité & hors-ligne

- **Aucun serveur, aucun compte, aucune donnée envoyée.** Tout en `localStorage`.
- **Fonctionne sans wifi** : un seul fichier HTML, polices système, zéro dépendance.
- Historique local des points précédents · brouillon (pause / reprise) · confort dys.

## ▶️ Utilisation

Ouvre `index.html` dans un navigateur. Aucune installation, aucun build.
Sur mobile : « Ajouter à l'écran d'accueil » pour l'utiliser comme une app (PWA installable).

## 🛠️ Technique

Un seul fichier `index.html` (HTML + CSS + JS vanilla). Le **schéma du questionnaire**
(`fonctionnement_jour v1.3.0`) est intégré comme **source de vérité** et pilote le moteur
(rendu, scores par section, seuils, mode bref, alertes, synthèse).

Charte **pré-alignée Al Mizan Al Qulûb** (sauge / amande / ivoire) → l'intégrer ensuite
comme page de l'app Al Mizan est trivial (c'est une page autonome).

*Grand frère du « check-in » de Mon Chargé de Com — on pourra les faire se parler plus tard.*
