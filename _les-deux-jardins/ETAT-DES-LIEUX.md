# 🔎 État des lieux — Boussole & Les Deux Jardins

**Audit du 19/07/2026, à la demande de Nawel.** Deux audits statiques (lecture du code) menés en parallèle.
⚠️ **Limite technique** : mon environnement ne peut PAS tester d'URL externe (proxy 403). Tout ce qui est « en ligne » (Netlify/Vercel) est donc à **cliquer par toi** — je ne confirme que ce qui est certain dans le code (outils locaux, liens morts, incohérences, bugs).

**Légende priorité** : 🔴 grave · 🟠 moyen · 🟡 mineur.
**Légende action** : 🔧 = je peux le faire seul (dis « go ») · 🤔 = ta décision · 👆 = ton clic/ton réglage.

---

## ⭐ LES 5 CHOSES QUI COMPTENT LE PLUS

1. 🔴🔧 **Boussole — un enfant/ado peut effacer TOUTES les données du cabinet.** L'écran « Réglages & données » (avec le bouton **« Tout effacer »** + export/import) est visible en vue enfant ET ado. À verrouiller côté praticienne. *(le plus urgent)*
2. 🟠👆 **Les Deux Jardins — ~16 outils du dashboard sont LOCAUX** (fichiers sur ton PC) : ils ne s'ouvriront **jamais** en ligne. C'est LA cause principale des « applis qui ne répondent pas ». → à déployer, ou à marquer clairement.
3. 🟠🔧 **La marque retirée « Voie Chifa / SHIFA » subsiste dans les adresses et fichiers** (visibles au clic). Les noms affichés sont OK, mais les URLs/ids restent à nettoyer.
4. 🟠🤔 **3 registres d'applis se contredisent** (`apps.ts`, `tableau-de-bord.html`, `hubs.ts`) : mêmes outils, noms différents, univers contradictoires. → choisir une **source unique**.
5. 🟠🔧 **Boussole — la page de vente a ses boutons d'achat morts** (`href="#"`) + pas de Mentions légales / CGV / Confidentialité.

---

# 🧭 PARTIE 1 — BOUSSOLE (Cap Educa, l'app ados)

## Ce que c'est
SPA statique (HTML/CSS/JS pur, sans framework), **100% locale** (localStorage), **installable** (PWA) et **hors-ligne** (service worker). **33 outils** auto-enregistrés (timer, séquenceur, emploi du temps, flashcards, carte mentale, roue des émotions, respiration, ancrage, plan de sécurité, gratitude, suivi…). 4 publics : **enfant (6-12) · ado (12-18) · parent · pro**. Défaut = **ado** (fuite « pro » bien fermée ✅).

## Dysfonctionnements

- 🔴🔧 **Fuite de rôle + action destructive** — `reglages` est visible enfant/ado (`app.js:45`) alors qu'il contient « Tout effacer » (irréversible, `accessibilite.js:99`), l'export/import complet, et l'activation du Coin spiritualité *commentée « réservée à la praticienne »*. **Un mineur peut tout effacer.** → *Fix proposé : garder l'accessibilité (police, contraste) pour tous, mais réserver « Tout effacer » / export / spiritualité à la praticienne (ou verrou PIN).*
- 🟠🔧 **Boutons d'achat morts** — page `vente-boussole/index.html` : « L'application seule » (`:184`) et « Le pack complet » (`:197`) sont `href="#"`. Aucun lien non plus vers l'app depuis la vitrine.
- 🟡🔧 **Liens légaux morts** — Mentions légales / Confidentialité / CGV = `#` (`vente-boussole:227`). Obligation légale non remplie.
- 🟠🤔 **Contradiction « 100% privé »** — l'app charge des **polices Google** (`index.html:11-13`) et l'**OCR Tesseract via CDN** (`dys.js:280`) à chaque ouverture → requêtes vers des serveurs tiers, et « Photo → texte » ne marche **pas** hors-ligne. → *Fix : héberger les polices en local + embarquer Tesseract.*
- 🟡🔧 **Petits bugs propres** : `<input type=file>` imbriqué dans un `<button>` (`accessibilite.js:91`, HTML invalide) · clés localStorage quasi-homonymes `coinSpirituel`/`coinSpiritualite` (piège de maintenance) · `for=""` vide (`enfants.js:89`) · bouton « Installer » parfois trompeur (iOS/desktop).
- 🟠👆 **Liens externes à vérifier (8 URL + 1 CDN)** : Secours émotionnel ados, Boîte à bobo 6-12, Souffle & Lumière, Boîte émotions 6-12 ISL, Tesseract CDN… → **à cliquer par toi.**

## ✅ Ce qui est SAIN (vérifié)
Aucune ancre interne cassée · aucun asset/image manquant · le cache hors-ligne couvre bien les 33 outils · toutes les fonctions `Boussole.*` sont bien câblées · pas de vrai TODO/FIXME.

## Suggestions d'ajouts
Rapatrier les CTA de vente vers un vrai paiement · vraies pages légales · mode hors-ligne réellement complet · tableau de bord praticienne multi-jeunes · génération de fiches PDF à imprimer · **code d'accès à l'ouverture** (données de mineurs = sensible).

---

# 🌳 PARTIE 2 — LES DEUX JARDINS (les applis recensées)

Périmètre : `apps.ts` (17 apps), `hubs.ts` (4 hubs), `tableau-de-bord.html` (30 outils), Nav, page d'accueil.

## Les « applis qui ne fonctionnent pas » — par cause

### 💻 Cause n°1 — 16 outils LOCAUX (fichiers sur ton PC) → jamais en ligne
`SHIFA_decodeur.html` · `boite-secours-mixte (1).html` · `boite-emotions-neuroo-v11.html` · `mon-assistante.html` · `educatypique-profil-apprentissage.html` · `educatypique-kit-visuel.html` · `parcours-clarte-tnd-systemio.html` *(en plus taggé « live » à tort)* · les 7 « à venir » (reprendre-confiance, homework, respirer, ebbinghaus, cartable, mots, boite-emotions-neuroo-isl) · `Pense-Bete_..._v4_FINALE (1).html`.
→ **Ils doivent être déployés (Netlify/Vercel) pour répondre en ligne.** *(Certains noms ont un espace + « (1) » = fragile, à renommer.)*

### ⏳ 12 items « bientôt » (pas encore construits)
Devoirs sans crise*, Dialoguer avec son ado, Sortir du brouillard affectif, Coin des émotions, Hygiène de vie, Médecine prophétique, Journal d'humeur, Brise-glace, Bouclier, Premiers secours émotionnels*, Bibliothèque de protocoles, Relais Lumière.
⚠️ *(*) Deux d'entre eux existent DÉJÀ en ligne mais sont marqués « bientôt » à tort : « Devoirs sans crise » (`kit-devoirs-sans-crises`) et « Premiers secours émotionnels » (`secours-emotionnel-ados`).* → 🔧 à corriger.

### 🏷️ Marque retirée encore présente dans les adresses/fichiers
Noms affichés = OK (Jannat al Qulûb), mais subsistent : sous-domaines `*-voiechifa` / `referentielshifa` / `shifa-decodeur-voie-chifa`, fichier `SHIFA_decodeur.html`, ids `vc-*`, variable `chifaTools`. → 🔧 nettoyage possible (mais renommer un sous-domaine Netlify = côté toi).

### ♻️ Contradictions dures entre registres
- **Univers** : « Bilan émotionnel » = educa (`apps.ts:27`) **vs** jannat (`html:799`).
- **Emplacement** : « Mon assistante » = Netlify **vs** local · « Décodeur clinique » = Netlify **vs** local → *quelle version fait foi ?*
- **Même outil, 5 noms différents** selon le registre (ex. `secours-emotionnel-ados` = « Secours émotionnel ados » ici, « Ma Boîte à Secours Émotionnelle » là).

### 🌐 À CLIQUER PAR TOI (je ne peux pas tester) — ~20 URLs en ligne
Surtout à surveiller : `boite-a-bobo-emotionnel-6-12-univ` et `anamne-educa-typique` (nom tronqué) — présents **seulement** dans `apps.ts`, jamais re-testés ailleurs.

## 🎯 Applis à AJOUTER à Boussole (boîte à outils ados)

**Déjà en ligne — à câbler vite :**
- **Ma Boîte à Secours Émotionnelle** (secours-emotionnel-ados) — 6 émotions + ancrage 5-4-3-2-1 + n° d'urgence. Cœur de cible.
- **Mon Profil Cognitif** / **Profil neuro ado** — auto-évaluation d'apprentissage 13-17.
- **Le Décodeur Educa Typique** — profilage cognitif ado.

**Locaux à déployer d'abord, puis intégrer :**
- **Boîte à Secours Mixte** (8 émotions, base laïque inclusive) — idéale pour une Boussole non confessionnelle.
- **Reprendre Confiance** + **Module Homework 12-17** (explicitement ados, marqués prioritaires par toi).
- Micro-outils : **Respirer**, **Planificateur Ebbinghaus** (révisions), **Atelier Cartable**.

**À NE PAS mettre dans Boussole** (relèvent de Jannat al Qulûb, confessionnel) : Trousse ados musulmane, Souffle & Lumière, tout `jannat-*`.

## 🗂️ Recommandation : une seule source de vérité
Faire de **`lib/apps.ts` le registre unique** (déjà typé et versionné), lui ajouter les champs manquants (`local`, `deployed`, `tags`, `hub`, `id`), puis **générer** le dashboard et les hubs à partir de lui — au lieu de 3 listes tenues à la main qui divergent.

---

# ✅ PLAN D'ACTION PROPOSÉ (par ordre, quand tu veux)

### 🔧 Ce que je peux faire seul dès que tu dis « go »
1. **Verrouiller « Tout effacer »/export/spiritualité côté praticienne** (Boussole) — le plus urgent.
2. Corriger les 2 statuts « bientôt » faux (Devoirs sans crise, Premiers secours) → « en ligne ».
3. Corriger le tag « live » faux de la Landing Parcours + l'univers de « Bilan émotionnel ».
4. Nettoyer les ids/fichiers/variables `SHIFA`/`vc-*`/`chifaTools` dans notre code.
5. Réparer les liens légaux de la page de vente (pages Mentions/Confidentialité/CGV) — si tu me donnes le contenu.
6. (Chantier) Unifier les 3 registres autour de `apps.ts`.

### 🤔 Tes décisions
- Faut-il masquer entièrement « Réglages » aux mineurs, ou juste les actions dangereuses ? (je recommande : juste les actions dangereuses)
- « Mon assistante » et « Décodeur clinique » : version en ligne ou locale qui fait foi ?
- Les CTA d'achat de la page de vente : vers quel flux de paiement ?
- (Rappel) Fusion des 2 listes de 8 questionnaires · Licences des échelles cliniques (MBI).

### 👆 Tes clics / réglages
- Cliquer les ~20 URLs en ligne et me dire lesquelles sont mortes → je corrige/retire.
- Déployer les 16 outils locaux que tu veux garder en ligne (Netlify), puis me donner les URLs.
- Activer les inscriptions Supabase (compte Educa) + tester le RLS à 2 comptes.

---

*Aucun fichier applicatif n'a été modifié pendant cet audit (lecture seule). — Ton partenaire 🌿*
