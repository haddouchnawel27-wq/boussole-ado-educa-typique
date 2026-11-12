# 🧭 Récap des outils créés — Educa Typique

_Point complet du projet « Mode d'Emploi de Moi » (app ado) et des outils associés.
À jour au 7 août 2026. Document de mise au parfum — partageable._

---

## En une phrase
Une **app pour ados (12-18 ans)** — 100 % locale, chiffrée, hors-ligne (PWA) —
qui les aide à se comprendre, se réguler, se relier et se projeter. **Aucun
score, aucun diagnostic, aucune étiquette** ; « je passe » / « je ne sais pas
encore » partout ; **honte = émotion primaire** ; foi/spiritualité en option
jamais imposée ; orientation en toute fin. Dossier `parcours-ado/`, déployée sur
Vercel, PR #20.

---

## 📱 Le parcours (14 écrans + module Orientation)

### Programme 1 — Je me comprends
- **AD-01** Mon espace & mes droits — création du code perso + coffre chiffré
- **AD-02** Check-in de 2 min — humeur, énergie, stress, sommeil, besoins (sans score)
- **AD-03** Mode d'emploi de Moi — bilan métacognitif (fenêtre d'or, commande
  fragile) + Notice à la 1re personne
- **AD-04** Mes émotions — **volet unifié** : Ma météo (6 familles + intensité) →
  Thermomètre (ça monte / redescend) → Nommer → Ma photo émotionnelle
- **AD-05** Mes valeurs — tri progressif 10 → 5 → 3
- ＋ **Ce qui me ressemble** — profil de fonctionnement (TND) adapté, sans score
- ＋ **Mon cerveau en action** — défis créatifs ludiques (pensée divergente)

### Programme 2 — Je me relie et je me protège
- **AD-06** Mes relations — poser une limite, dire non, 3 regards
- **AD-07** Reprendre confiance — pensées pièges, « que dirais-tu à un·e pote ? »
- **AD-08** Ma sécurité numérique — demander de l'aide sans tout expliquer
- ＋ **Démêler mes pensées** — biais cognitifs ado + grille TCC (fait brut → pensée
  → émotion → corps → réaction → piège → lecture plus juste)

### Programme 3 — Je construis la suite
- **AD-09** Mon quotidien & mes forces
- **AD-10** Ma demande d'accompagnement (carte validée)
- **AD-11** Centre de partage — visibilité par fiche, aperçu, **privé par défaut**

### L'étape d'après — Orientation
- **Module « Étincelle »** (6 écrans) : Portrait chinois → Intelligences multiples
  (ludique) → Intérêts **RIASEC** (socle validé) → Style d'apprentissage →
  Métacognition (pont AD-03) → **« Ma boussole d'orientation »**
- ＋ **J'expérimente** — micro-expériences réelles (interviewer, observer, tester),
  avec suivi

---

## 🔧 Le socle technique
- Coffre **chiffré AES-GCM 256 / PBKDF2** (150 000 itérations), code perso, espace
  isolé `capEduca.ado.*`
- Système de modules d'écrans + **PWA hors-ligne** (service worker, cache versionné)
- **Relooking 12-18 ans** : charte sarcelle/magenta, **pastilles de couleur** à la
  place des visages emoji, dégradés et effets soignés
- Accessibilité : confort dys, tailles de texte, contraste, **mode soir**, focus
  clavier, ARIA, `prefers-reduced-motion`

---

## 📄 Outils imprimables & documents
- **Cahier « Se comprendre pour s'orienter »** — 12 outils d'orientation
  (rebrandé Educa Typique, rose fuchsia retiré) · `outils/se-comprendre-pour-s-orienter.html`
- **Bilan émotionnel Educa Typique** — rebrandé de « Voie Chifā », rendu autonome,
  envoi-IA retiré, spirituel en option · `outils/bilan-emotionnel-educatypique.html`
- **Brief pour Cowork** — « 100+ passions », défis mensuels, gamification
  bienveillante · `docs/brief-cowork-passions-defis-gamification.md`
- **Specs & reprise** — module Orientation Étincelle · carnet « À la découverte de
  moi » · point de reprise (`REPRISE.md`)

---

## 🏷️ Autres chantiers
- **Rebrand** « Al Mizan / Jannat Al Qalb » → **Educa Typique** sur toutes les apps
- **QR codes** générés (vers l'app et vers `educatypique.com`)

---

## 🔜 Ce qui reste / pistes ouvertes
- Brancher le domaine `educatypique.com` (LWS) : page de vente + app sur
  `app.educatypique.com` (à faire nous-mêmes — étape 1 : vérifier l'accès LWS)
- Intégrer la version enrichie de Cowork (passions / défis / gamification) au retour
- Jannat Al Qalb : pas de domaine propre → utilisera `educatypique.com`
- Finitions selon les retours d'ados après test de la preview

---

## 🧷 Rails non-négociables (tenus partout)
100 % local / chiffré / hors-ligne · privé par défaut · **aucun score, aucun
diagnostic, aucune étiquette** · « je passe » partout · honte = émotion primaire ·
foi = option jamais imposée · sécurité (3114 / 3018 / 3020 / 119 / Fil Santé Jeunes)
· orientation en toute fin · **série « Bouclier / Inner Safe » = propriété d'un
tiers, NE PAS intégrer**.

---
_Fait avec 💛 — Nawel, Educa Typique._
