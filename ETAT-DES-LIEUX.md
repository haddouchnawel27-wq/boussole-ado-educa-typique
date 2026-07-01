# 🧭 Boussole — état des lieux (reprise de session)

_Mémo pour reprendre le travail facilement. Dernière mise à jour : 30 juin 2026._

## ✅ Ce qui est FAIT et EN LIGNE

Boussole est finalisée côté fonctionnel et **déployée** :
👉 https://haddouchnawel27-wq.github.io/boussole-ado-educa-typique/

- **Accueil « Pour qui ? »** + sélecteur : Enfant (6-12) · Ado (12-18) · Parent · Praticienne.
- **Home par actions** : Lire · Écrire · Comprendre · Réviser.
- **Boîte à outils dys** (7 onglets) : confort de lecture, voix haute, **photo → texte (OCR)**, syllabes colorées, numération, **calcul posé**, écriture.
- **Aide à l'écriture** (5 onglets) : banque de mots, phrase modèle, correcteur simple, **copie guidée**, clavier simplifié.
- **Cartes de révision (flashcards)**, **Carte mentale**, **Parcours métacognition** (je choisis · je teste · je m'évalue · je garde).
- Service worker corrigé (v10, « stale-while-revalidate ») → les mises à jour s'appliquent toutes seules.
- Tout est **100 % local / privé**, sauf l'OCR qui charge sa bibliothèque depuis un CDN à la 1ʳᵉ utilisation (l'image, elle, ne quitte jamais l'appareil).

Couvre ~100 % de la spec transmise (dyslexie, dysorthographie, dyspraxie, dyscalculie, métacognition). Seule la **dictée vocale** a été volontairement écartée (elle enverrait la voix sur Internet).

## 🎨 EN COURS — Refonte visuelle (Claude Design)

Nawel a fait redessiner Boussole par Claude Design. Le résultat est **beau** :
fond crème `#F2EADD`, bandeau **dégradé** turquoise→violet→rose, titres violet
profond `#3E3A63`, cartes pastel arrondies, polices **Poppins** (titres) +
**Nunito** (texte). Palette : violets (#8259C0, #9B7AD8, #C2B2F0), rose (#F39BC2),
ambre (#F2B441), turquoise (#8ED9D2).

- Le fichier Design (`Boussole.html`) est un **bundle React** (même format qu'Al Mizan) : rendu autonome avec React embarqué (script `scratchpad/patch_boussole.py`, asset uuid `9dd7b4c6-…`).
- **Souci identifié** : Design a référencé 3 mascottes (« Neuroo », « Noury », « Educa ») **sans fournir les images** → carrés vides + bandeau « [bundle] error ». C'est une **maquette** (1 écran), pas l'app complète.

### ⏭️ PROCHAINE ÉTAPE (décision prise par Nawel = « go »)
**Appliquer ce design à la VRAIE Boussole** (le code vanilla qui marche) :
1. Fond crème + bandeau dégradé turquoise→violet→rose.
2. Polices Poppins (titres) + Nunito (texte), + option police « dys ».
3. Cartes pastel arrondies, boutons, menu latéral, onglets, en-têtes.
4. Palette ci-dessus dans `assets/css/styles.css` (variables CSS).
- **Mascottes** : option (a) on s'en passe maintenant (icônes), (b) en créer 3 maison plus tard. → démarrer en (a).
- Livrer en **nouvelle PR** à fusionner.

## 🌙 À REPRENDRE PLUS TARD — Al Mizan

- App séparée (`al-mizan/`). En attente : l'**export Claude Design** de Nawel avec le **séquenceur de tâches douces** (prompt déjà fourni).
- À faire à réception : rendre l'export autonome (React embarqué, fichier unique), réinjecter l'**icône balance** + méta iPhone, livrer zip + mise en ligne.
- Plus tard : apps + icônes pour **Souffle** et **Lumière**.

## 🔧 Repères techniques

- Dépôt : `haddouchnawel27-wq/boussole-ado-educa-typique` · branche défaut `claude/gracious-davinci-t0zife` · branche de travail `claude/lucid-dirac-zt93h3`.
- App vanilla JS, sans build. Chaque outil = un fichier dans `assets/js/tools/` enregistré via `Boussole.registerTool(...)`. Filtrage par âge/profil centralisé dans `assets/js/app.js` (table `AUDIENCE`).
