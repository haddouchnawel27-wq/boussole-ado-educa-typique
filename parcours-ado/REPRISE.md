# 🧭 Point de reprise — « Mode d'Emploi de Moi » (app ado)

_Dernière mise à jour : 6 août 2026. À lire en premier pour reprendre._

## Où vit le travail
- **App ado** : dossier `parcours-ado/` (autonome, 100 % local, chiffré, hors-ligne / PWA).
- **Branche** : `claude/wellbeing-check-ewiiyq` · **PR** : **#20** (brouillon), check requis vert ✅.
- **Preview** (ajoute `/parcours-ado/`) :
  `boussole-ado-educa-typique-git-claude-w-d76337-nawel-s-projects.vercel.app/parcours-ado/`

## ✅ LE CŒUR DU PARCOURS EST COMPLET (AD-01 → AD-11)

### Programme 1 — Je me comprends
- **AD-01** Mon espace & mes droits · **AD-02** Check-in 2 min — `app.js`
- **AD-03** Mode d'emploi de Moi (bilan + Notice) — `screens/ad03.js`
- **AD-04** Mes émotions (honte primaire) — `screens/ad04.js`
- **AD-05** Mes valeurs (10→5→3) — `screens/ad05.js`
- **＋ Ce qui me ressemble** (TND adapté, sans score/API) — `screens/profil.js`

### Programme 2 — Je me relie et je me protège
- **AD-06** Mes relations — `screens/ad06.js`
- **AD-07** Reprendre confiance — `screens/ad07.js`
- **AD-08** Ma sécurité numérique — `screens/ad08.js`

### Programme 3 — Je construis la suite
- **AD-09** Mon quotidien & mes forces — `screens/ad09.js`
- **AD-10** Ma demande d'accompagnement (carte validée) — `screens/ad10.js`
- **AD-11** Centre de partage (visibilité par fiche, aperçu, privé par défaut) — `screens/ad11.js`

### Socle & autres
- Coffre chiffré AES-GCM, code perso, espace `capEduca.ado.*` — `vault.js`.
- Modules d'écrans via `MEM.register` — `app.js`. Chaque ajout : `index.html` + `sw.js` (bump `mem-ado-vN`).
- **Rebrand** « Al Mizan / Jannat Al Qalb » → « Educa Typique » sur toutes les apps.

## 🎨 RELOOKING « 12-18 ANS » (fait)
- Palette plus mûre (sarcelle profond + magenta + menthe/jaune), topbar en dégradé
  avec liseré magenta, boutons en dégradé, ombres nettes, animation d'entrée douce.
- **Échelles d'humeur** (AD-02) : les visages 😐🙂 sont retirés — pastilles/label
  + rail dégradé sous chaque échelle. Historique : pastille colorée par humeur.
- **Émotions** (AD-04) : chaque émotion a une **pastille de couleur** (plus de
  visages). Restitution + « je ne sais pas encore » alignés.
- `profil.js` : picto anxiété 😰 → 🌀 (cohérence des pictos-symboles).
- `sw.js` bumpé `mem-ado-v12`. Testé Playwright (aucune erreur JS).

## 🧭 MODULE ORIENTATION « ÉTINCELLE » (fait ✅)
Étape **finale** du parcours — `screens/etincelle.js`. Construit à partir du spec
`docs/module-orientation-etincelle.md` (pas besoin du fichier HTML tiers, jamais reçu).
6 écrans dans l'ordre §7.6 :
- **ET-06** Portrait chinois (entrée ludique, tout optionnel)
- **ET-01** Intelligences multiples (Gardner, **ludique**)
- **ET-02** Intérêts **RIASEC** (socle validé)
- **ET-03** Style d'apprentissage (« conditions d'accès », pas une identité)
- **ET-04** Métacognition — **pont AD-03** (relit `bilan-notice` : fenêtre d'or,
  commande fragile ; mise en situation « monter un meuble » = porte d'entrée)
- **ET-05** « **Ma boussole d'orientation** » — 1re personne, privée, **facettes qui
  se combinent** (barres RIASEC, jamais un verdict), univers au pluriel « à explorer »,
  UNE action, ressources externes en opt-in « avec un adulte ».

Câblage : carte Orientation de l'accueil rendue **cliquable** (`data-nav="etincelle"`) ;
fiche **« Ma boussole d'orientation »** ajoutée à **AD-11** (`orientation-notice`, privé
par défaut) ; `index.html` + `sw.js` (bumpé **mem-ado-v13**). Testé Playwright de bout
en bout (aucune erreur JS ; fiche visible dans le Centre de partage).

## 📔 CARNET « À LA DÉCOUVERTE DE MOI » — 2 ajouts (fait ✅)
Concept ado de Nawel, conservé en `docs/carnet-a-la-decouverte-de-moi.md`. Il
confirme l'architecture existante ; deux vrais manques comblés :
- **`screens/cerveau.js`** — « Mon cerveau en action » (section 4) : 5 défis
  ludiques (pensée divergente / logique / orga). **Privé, aucun score**.
  Bonus du **Programme 1**.
- **`screens/experience.js`** — « J'expérimente » (section 9 / OUTIL 10) :
  mini-expériences avec suivi (prévu → fait → « ce que j'en retiens »), relais
  externes en opt-in. Dans **« L'étape d'après »**, après l'Orientation.
- Fiche **« J'expérimente »** ajoutée à AD-11 (privé par défaut). `sw.js` → **v14**.

## 🧶 « DÉMÊLER MES PENSÉES » — biais cognitifs ado (fait ✅)
Adaptation ado du support pro « Biais cognitifs » (TCC) — `screens/pensees.js`,
compagnon d'AD-07, en bonus du **Programme 2**.
- Catalogue de **11 pensées pièges** (mots d'ado + question corrective).
- Grille TCC en outil doux : fait brut → ce que mon esprit ajoute → émotion
  (0-10) → corps → réaction → le piège → preuves pour/contre → lecture plus
  juste → « que dirais-tu à un·e pote ? ».
- **Filet de sécurité** si émotion ≥ 8/10 (mot doux + numéros d'aide).
- Fiche **« Démêler mes pensées »** dans AD-11 (privé par défaut). `sw.js` → **v15**.
- Sources retrouvées par Nawel confirmées : le brainstorm Étincelle = ce qui est
  déjà implémenté (rien à rattraper).

## 🌡️ VOLET ÉMOTIONS UNIFIÉ (fait ✅)
Tout le contenu « émotions » réuni dans **un seul volet = AD-04**, enrichi du
bilan émotionnel Educa Typique :
- Nouvelle 1re étape **« Ma météo émotionnelle »** : palette en **6 familles**
  (Tristesse, Anxiété, Colère, Peur, **Honte & culpabilité**, Positif),
  multi-choix + **intensité 1-5** par émotion.
- Parcours du volet : Météo → Thermomètre → Nommer → **Ma photo** (la photo
  intègre la météo + mot doux si honte présente).
- `emotions-notice` enrichi (météo) → fiche **« Mes émotions »** d'AD-11.
- **Outil pro rebrandé** : `outils/bilan-emotionnel-educatypique.html`
  (ex-« Voie Chifā » → Educa Typique, autonome, universel/spirituel en option,
  envoi-IA retiré). `sw.js` → **v16**.

## 🔜 CE QU'IL RESTE
1. _(optionnel)_ Finitions / retours de Nawel après test de la preview (contenus,
   familles de métiers, version « longue » d'approfondissement, section 7
   « 100+ passions », idée de « défis mensuels »).

## 🧷 Rails non-négociables (tenus partout)
100 % local / chiffré / hors-ligne · privé par défaut · **aucun score, aucun
diagnostic, aucune étiquette** · « je passe » partout · honte = émotion primaire ·
foi = option jamais imposée · sécurité (3114/3018/3020/119/Fil Santé Jeunes) ·
orientation en toute fin · **série « Bouclier / Inner Safe » = propriété d'un tiers,
NE PAS intégrer**.

## 📌 Fils ouverts
- **Visages 😐🙂** des échelles d'humeur : ✅ retirés (pastilles + rail dégradé).
- **Idée d'app perso de Nawel** (via un partage ChatGPT non lisible ici) : à me
  coller si on veut la traiter — chantier séparé de l'app ado.
- **Vérif horaire auto de la PR** : non ré-armée.

---
_Cœur du parcours bouclé (11 écrans + bonus). Prochaine grande étape : le module
Orientation, quand le fichier arrive. 💛_
