# 🧭 État des lieux — reprise de session

_Mémo pour reprendre sans rien perdre. Dernière mise à jour : 1 juillet 2026._

---

## 🎒 BOUSSOLE (app à la racine du dépôt)

**Statut : finalisée + refonte visuelle + mascottes.** En ligne :
https://haddouchnawel27-wq.github.io/boussole-ado-educa-typique/

- Parcours par âge/profil (Enfant · Ado · Parent · Praticienne) + accueil par actions.
- Boîte à outils dys (7 onglets), Aide à l'écriture, Cartes de révision, Carte mentale, Métacognition.
- **Refonte visuelle** (charte Claude Design : crème, violet, pastels, Poppins/Nunito).
- **Mascottes intégrées** (Neuroo, Noury, Maman, Educa) sur l'écran d'entrée + bandeau d'accueil.
- Service worker fiable (stale-while-revalidate, cache v13).

⚠️ **Tout ce travail récent (redesign + mascottes + SW) est sur la branche `claude/lucid-dirac-zt93h3` (PR #5, PAS encore fusionnée).** Pour le mettre en ligne : fusionner PR #5, comme les précédentes.

---

## 🌸 AL MIZAN (dossier `al-mizan-design/`)

App de Nawel = **bundle React** (Claude Design). Dernier export : `AlMizan_1.html` (fourni le 1 juil).
5 onglets : Aujourd'hui · Tendances · Jardin · Pensées · **Espace**.

### Fichiers dans le dépôt (`al-mizan-design/`)
- `boussole-interieure.html` — bilan bien-être 5 volets (corps/émotions/stress/lien/spirituel). ✅ prêt
- `face-au-regard.html` — fiche peur du regard + rituel des 3 appuis. ✅ prêt
- `almizan-sequenceur.html` — **LA version de Nawel** du séquenceur « S'organiser en douceur » (Jost + cacao/sauge/rose/or, glisser-déposer, dégradé doré). = **le séquenceur canonique** (déjà dans son app). ✅
- `sequenceur.html` + `mes-outils.html` — mes 1res versions (charte terra/Nunito). **Obsolètes** (remplacées par la version de Nawel ci-dessus).
- `index.html` (785 Ko) — ancienne version autonome (30 juin).

### Ce qui a été livré
- Version **autonome** de son app (React embarqué) + bouton flottant **contextuel** « Mes outils » (visible uniquement sur l'onglet Espace) → livrée en zip `AlMizan-complet.zip`.

### ⛔ EN PAUSE — plan de reprise (option B, validé par Nawel)
Le vrai point à régler : **l'onglet Espace est trop chargé** (tout empilé). Décision prise :
1. **Nawel refait l'Espace en HALL à 4 cartes dans Claude Design** (chaque carte → sa sous-page) :
   - **S'organiser** → « S'organiser en douceur » (le séquenceur).
   - **Comprendre** → mini-articles (Tes émotions, 6 biais, Charge mentale, Hygiène de vie…) **+ Face au regard**.
   - **Faire le point** → « Mon mode d'organisation » **+ Boussole intérieure**.
   - **Zones de turbulences** → moments de vie (prémenstruel, fatigue, burn-out, ménopause, post-partum…).
2. Elle m'envoie le **nouvel export complet**.
3. **Moi (à la reprise)** : rendre l'export autonome (vendor React+ReactDOM+Babel, cf. `scratchpad/patch`), **brancher `boussole-interieure.html` et `face-au-regard.html`** dans les bonnes cartes du hall, packager un dossier + guider le déploiement Netlify. (Le bouton flottant « Mes outils » ne sera plus nécessaire une fois le hall en place.)

### Doublons à éviter (déjà repérés)
- Son app a déjà « S'organiser en douceur » (= séquenceur) et « Mon mode d'organisation » (audit) qui **fonctionnent**. → Ne PAS les doubler. Mes ajouts nets = **Boussole intérieure** + **Face au regard**.

---

## 🌙 SOUFFLE & LUMIÈRE (`VoieChifa.html`, non commité)
App **séparée** : gestion des émotions + méditation, offerte avec ses accompagnements / le parcours **Méthode Rahma « Sortir du Brouillard »**. Bundle React aussi. **À traiter à son tour**, plus tard.

---

## 🔧 Repères techniques
- Dépôt : `haddouchnawel27-wq/boussole-ado-educa-typique` · défaut `claude/gracious-davinci-t0zife` · travail `claude/lucid-dirac-zt93h3`.
- Mascottes Boussole détourées : `assets/img/mascotte-{neuroo,noury,maman,educa}.png` (redimensionnées ~360px).
- Dé-bundling des exports Claude Design : patcher l'asset qui contient les URLs `unpkg` (React/ReactDOM/Babel) → data-URIs vendorées (`scratchpad/vendor/`), blanchir les SRI. Scripts dans `scratchpad/`.
