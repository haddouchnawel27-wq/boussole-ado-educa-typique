# 🧭 État des lieux — reprise de session

_Mémo pour reprendre sans rien perdre. Dernière mise à jour : 3 juillet 2026 (soir)._

---

## ⏭️ PROCHAINE SESSION (prioritaire) — Programme « Posture Sereine »

Nawel bâtit un **vrai programme d'accompagnement** pour **femmes entrepreneuses bloquées** :
coaching + **TCC** + **psychologie islamique** (niyya, amanah, tawakkul actif, sabr, shukr, rahma ; tawhid, fitra, qalb, nafs, aql). Parcours **12 semaines**, 5 étapes : Observer → Réguler → Clarifier → Repositionner → Consolider.

**Plan validé pour demain :**
1. **On réfléchit d'abord ensemble** (structure de l'offre, cible, format) AVANT de construire.
2. Puis on produit **3 documents cohérents** (charte Jannat Al Qalb, ton doux, PDF pro) :
   - 📖 **Ebook** — basé sur le **programme d'accompagnement**.
   - 📓 **Workbook**.
   - 📋 **Questionnaire d'entrée** (candidature/clarification).

**Fichiers source déjà fournis (uploads) — à réutiliser :**
- `Programme_Formation_Accompagnement_Femmes_Entrepreneuses_Bloquees.docx` — parcours 12 semaines (colonne vertébrale).
- `Posture_Sereine_Questionnaire_Candidature.docx` — questionnaire d'entrée (cadre de sécurité : ne remplace ni thérapie, ni ruqya, ni fatwa).
- `Posture_Sereine_Workbook.docx` / `.pdf` — **workbook upgradé** (Fiche 0 Niyya + 5 étapes, dimension spirituelle).
- `Ebook_Accompagner_Autoentrepreneuses_Bloquees.pdf` — **ebook PRO** (14 chapitres, riche : fenêtre de tolérance, trauma, attachement & business, posture pro) → matière première de l'ebook grand public.
- `Parcours_Accompagnement_Mixte_Autoentrepreneuses.pdf` — architecture d'offre (4 formules : Autonomie / Groupe / Premium / Bootcamp ; rôle d'Al Mizan = compagnon quotidien).

**⚠️ Points à trancher ensemble :**
- **Deux workbooks existent** : `Posture Sereine — Mon carnet de parcours` (HTML doux, 8 fiches → pack **grand public**) VS `Workbook d'accompagnement` (spirituel/TCC → **programme accompagné**). Décider lequel va où.
- **Ebook « Posture Sereine » grand public : JAMAIS reçu** — les fichiers envoyés étaient la note « ⚠️ Fichier remplacé ». Option retenue : **le créer à partir de l'ebook PRO**, adouci en charte Jannat Al Qalb.

**Échelle d'offres repérée (le vrai levier de revenu) :**
| Niveau | Contenu | Prix (ordre d'idée) |
|---|---|---|
| Autonomie | App + ebook + workbook | 59 € (pack digital) |
| Groupe | + ateliers hebdo | 150–350 € |
| Premium | + séances individuelles | 600–1500 € |
| Bootcamp | sprint 14/30 j | selon format |
→ Le pack digital = porte d'entrée ; l'accompagnement = le vrai revenu. L'ebook/workbook doivent **donner envie** de l'accompagnement (page ressources / clôture).

---

## 🧰 CHANTIER SUIVANT — Hub « Couteau Suisse » (unifier toutes les apps)

_Brief complet chez Nawel (local) : `Bureau › Jannat Al Qalb › Projets › 🧰 Brief pour Code - Hub Couteau Suisse (Educa Typique x Jannat Al Qalb).md`. Je n'y ai PAS accès → lui redemander de coller le brief (surtout : URLs réelles, les 3 copies de la Boîte NeuroPed, décisions de fin de brief)._

**Vision :** rattacher TOUTES ses apps en **un hub unique installable (PWA)** — une porte d'entrée, **deux univers distincts** + passerelles entre eux :
- 🌷 **Educa Typique** : Boussole + **Boîte NeuroPed Universelle (106 outils)** + Parcours Clarté TND.
- 🌿 **Jannat Al Qalb** (جنة القلب, « Le Jardin du Cœur ») : Al Mizan Al Qalb + satellites, Souffle & Lumière, **Boîte NeuroPed ISL**, Posture Sereine.

**Architecture à anticiper :** un **3ᵉ espace à accès restreint « Praticiennes »** (projet futur — la matière existe : tous les outils praticiens de la Boîte NeuroPed).

**Hébergement :** Nawel a **3 comptes Netlify** dispo (+ GitHub Pages actuel). → Je dois **proposer le meilleur setup**, surtout pour gérer les **accès payants** (packs 44-59 €, pack des 3 à 99/129 €).

**Non négociables :** aucun diagnostic (disclaimer partout) · **100 % privé (localStorage)** · **installable + hors-ligne** · **aucune représentation humaine dans les icônes** · chartes respectées (Educa Typique + Jannat Al Qalb) · **pas de chiffres rituels sans dalil**.

**Correctifs Souffle & Lumière (point 5 du brief) : ✅ DÉJÀ FAITS le 3 juil** — rebrand Jannat Al Qalb + « autant de fois que ton cœur en ressent le besoin » (à la place de « 7 fois »).

**Ma Phase 1 (avant de coder) :**
1. **Inventaire technique** : URLs réelles vs dossiers locaux ; **doublons** (la Boîte NeuroPed existe en **3 copies → demander laquelle fait foi**).
2. **Contre-proposition d'architecture** (hub, univers, passerelles, espace praticiennes, accès payants) — à valider AVANT de coder.

**Décisions qui reviennent à Nawel (lui faire mes recommandations) :** nom du hub · mécanisme de paiement · produits d'appel offerts.

### ✅ Phase 1 — inventaire GitHub FAIT (4 juil)
Ce qui est en ligne dans le dépôt (Pages) :
- 🌷 **Educa Typique** : Boussole (`/`) + **`/parcours-clarte-tnd/` = la Boîte NeuroPed / Parcours Clarté TND, 118 fichiers** (voir `parcours-clarte-tnd/INVENTAIRE.md`) :
  - 7 pages d'accueil (index, parents, ados, professionnels, **parents-musulmans**, offres, protection-numerique)
  - 26 apps · 7 outils-ado · **17 outils-pro** (profils, repérages TND, protocole crise…) · 44 ebooks-guides · 17 fiches · 11 formations · Boîte Émotions Neuroo · kit réseaux.
  - Variantes **ISL** déjà présentes ici (parents-musulmans, dialoguer-ado-ISL, cartes émotions ISL).
- 🌿 **Jannat Al Qalb** : Al Mizan (`/al-mizan/`) · Souffle & Lumière (`/souffle-lumiere/`) · vitrine (`/jannat-al-qalb/`) · Posture Sereine (programme, pas encore une app).
- 🛍️ Ventes : `/vente-al-mizan/`, `/vente-boussole/`, `/vente-souffle/`.

### ❓ Questions en attente (à demander à Nawel avant Phase 2 = archi)
1. **Boîte NeuroPed « en 3 copies »** : je n'en vois qu'UNE (`parcours-clarte-tnd/`). Où sont les 2 autres (Netlify ? ZIP ?) et **laquelle fait foi** ?
2. **3 comptes Netlify** : quoi déployé sur chacun + URLs ?
3. **NeuroPed « Universelle » (Educa) vs « ISL » (Jannat)** : séparation à faire (tout est mélangé dans un dossier) ou existe déjà ailleurs ?
4. **« Satellites » d'Al Mizan** : c'est quoi ?
5. **Coller le brief `.md` complet** (surtout décisions de fin : nom hub · paiement · produits d'appel).

---

## ✅ CE QUI EST EN LIGNE (3 applis · GitHub Pages)

Base : `https://haddouchnawel27-wq.github.io/boussole-ado-educa-typique/`

| Appli | Lien | État |
|---|---|---|
| 🧭 Boussole (familles) | `/` | en ligne |
| 🌸 Al Mizan Al Qalb | `/al-mizan/` | en ligne — séquenceur « Vider, trier, avancer » = 3ᵉ carte de « Faire le point » + icône balance |
| 🌙 Souffle & Lumière | `/souffle-lumiere/` | en ligne — **rebrandée Jannat Al Qalb** (clôture + footer) ; étape Nom d'Allāh = **répétition libre** (plus de « /7 ») ; icône arche |

- Clé localStorage `voiechifa.v1` **conservée** (ne pas renommer = données préservées).
- Boussole = **familles seulement** (Enfant/Ado/Parent). Le volet **praticiennes** sera une **appli dédiée** plus tard.

---

## 💼 COMMERCIALISATION

### Pages de vente — PUBLIÉES + artifacts
- Public : `/vente-al-mizan/` · `/vente-boussole/` · `/vente-souffle/`
- Artifacts (modèles) : Al Mizan `dd9be335-e758-4557-88d5-d355245bd807` · Boussole `f26c2afa-16be-4e6b-bb2c-9960ab65b0c3` · Souffle `83966fda-ad53-466b-8eb1-5e121404c454`
- Sources : dossiers `vente-*/` + `al-mizan-design/vente-al-mizan.html`.
- Chaque page : 2 offres (*appli seule* / *pack + ebook & workbook*).

### 💶 Grille de prix (validée)
| Produit | Seul | Pack |
|---|---|---|
| Al Mizan Al Qalb 🔝 | 44 € | 59 € |
| Boussole (familles) | 39 € | 59 € |
| Souffle & Lumière | 29 € | 44 € |
| Pack des 3 apps | 99 € | — |
| Pack des 3 complets | — | 129 € |

### 💳 Vente — décision
- **Applis & packs → Stripe direct (Option 1)** : elle a déjà Stripe. Payment Link → bouton « acheter » des pages hébergées → **page code d'accès / merci** (À CONSTRUIRE) donnant lien + code. **Systeme.io PAS obligatoire.**
- **Le reste** (tunnels, e-mails auto) → Systeme.io (comptes : Educa Typique, Voie Chifa).

### 📜 Textes légaux — FAITS
- Artifact `c91838a3-44b1-40c5-916e-99f25a968cdb` · source `scratchpad/mentions-legales.html`.
- **Naoual HADDOUCH (EI), SIRET 902 273 366 00028, APE 96.09Z, Nîmes, TVA art. 293 B**, marques Jannat Al Qalb + Educa Typique.
- **Blancs à compléter** : e-mail de contact · adresse (domicile ou domiciliation) · **médiateur de la consommation** (adhésion obligatoire B2C) · dates.

### 📌 Reste à faire (vente)
1. **Page code d'accès / merci** (arrivée après paiement Stripe).
2. **Payment Links Stripe** (guider) + relier aux boutons des pages de vente.
3. **Héberger les textes légaux** (`/mentions-legales/`) + wirer les liens en pied de page (actuellement `#`).
4. Finaliser **ebook + workbook « Posture Sereine » en PDF** (voir section « Prochaine session »).
5. (option) page **pack des 3** ; nom de domaine `jannatalqalb.fr`.

### e-books prêts (NE PAS publier publiquement — produits payants)
- `Ebook_Souffle_de_Lumiere__Le_chemin_de_la_sakina.html` (Souffle & Lumière) — Jannat Al Qalb, prêt.
- QR codes des 3 applis : `scratchpad/QR-*.png`.

---

## 🔧 Repères techniques
- Dépôt : `haddouchnawel27-wq/boussole-ado-educa-typique` · défaut publié = **`claude/gracious-davinci-t0zife`** · branche de travail = `claude/lucid-dirac-zt93h3`.
- **Déploiement Pages flaky** : `deploy-pages.yml` échoue régulièrement sur « Deployment failed, try again later » (transitoire GitHub). `rerun`/`workflow_dispatch` via l'intégration = **403**. **Pour relancer : petit commit → PR → merge dans le défaut** (le push redéclenche). Souvent OK à la 2ᵉ/3ᵉ tentative. (Un memo n'a pas besoin d'être publié → pas grave si son déploiement flanche.)
- `sw.js` v15 : exclut `/al-mizan/`, `/souffle-lumiere/`, `/vente-*` du cache Boussole.
- **Cache côté client** = piège récurrent : navigation privée / Ctrl+Maj+R / `?v=N`.
- Icônes vectorielles : `scratchpad/icon.svg` (balance), `scratchpad/icon-souffle.svg` (arche).
- Extraction PDF/DOCX en session : `pip install cffi` d'abord (sinon `cryptography` plante) ; puis `pdfminer.six` pour PDF, unzip `word/document.xml` pour DOCX.
- Al Mizan `index.html` autonome (React vendorisé) ; Souffle charge React via unpkg (OK en ligne).

---

## 🌙 À traiter plus tard
- Rendre **Souffle & Lumière** autonome hors-ligne (comme Al Mizan), si souhaité.
- **Appli praticienne** dédiée (le volet pro sorti de Boussole).
- Vérifier en détail tous les outils de Boussole.
