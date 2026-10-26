# 🗺️ Cartographie de l'écosystème — Nawel HADDOUCH

_Vue d'ensemble de tous les outils, questionnaires, applications, parcours et leurs missions.
Généré le 10 août 2026 — synthèse du dépôt `boussole-ado-educa-typique` (99 commits, depuis le 12 juin 2026)._

> **Deux univers, une même main.**
> 🌷 **Educa Typique** — accompagnement des ados, TND/DYS, neuropédagogie, familles & pros.
> 🌿 **Jannat Al Qalb** (جنة القلب, « Le Jardin du Cœur ») — accompagnement psycho-spirituel, TCC + psychologie islamique.
>
> **Non négociables (toutes les apps)** : 100 % local (localStorage) · hors-ligne · installable (PWA) ·
> aucun diagnostic (disclaimer partout) · aucune représentation humaine dans les icônes ·
> pas de chiffres rituels sans dalil · universel d'abord, spirituel en option.

Base de publication : `https://haddouchnawel27-wq.github.io/boussole-ado-educa-typique/`

---

## 📅 1. Timeline — depuis le début

| Période | Jalon | État |
|---|---|---|
| **12 juin 2026** | Démarrage. Assemblage du **Parcours Clarté TND** (accueil + espaces parents/ado/pro) + inventaire | ✅ |
| **13 juin 2026** | Récupération massive : outils parents, espaces Ado (7) + Pro (17), protection numérique, page Offres, naissance de **Boussole Pro → Mîzân → Al Mizan** | ✅ |
| **14–16 juin 2026** | Charte graphique Al Mizan · mini-site **Jannat Al Qalb** (cabinet) | ✅ |
| **30 juin – 1 juil.** | Boussole : refonte visuelle + mascottes + couleurs par profil (PR #4, #5) · séquenceur Al Mizan | ✅ |
| **2–3 juil. 2026** | Mise en ligne **Al Mizan** + **Souffle & Lumière** (PR #6) · rebrand Jannat Al Qalb · **pages de vente** publiées (PR #10) | ✅ |
| **3–4 juil. 2026** | Mémos : **Posture Sereine**, **Hub Couteau Suisse** (inventaire Phase 1) (PR #12, #13, #14) | 📝 |
| **27–28 juil. 2026** | **Mon Chargé de Com** (PWA) · **Le point du jour** (baromètre + Sauveteur + Boîte à outils + Profil + Réussites) | ✅ |
| **30 juil. 2026** | Renommage marque **Boussole → Cap Educa** · publication Cap Educa + Le point du jour + Mon Chargé de Com (PR #17) · Feuille de route IA | ✅ |
| **Aujourd'hui (10 août)** | Cette cartographie | 📝 |

_Répartition des commits : **68 en juin**, **31 en juillet**. Dernier travail de fond : 30 juillet._

---

## 🌷 2. Univers EDUCA TYPIQUE

### 2.1 — 🧭 Cap Educa (ex-« Boussole ») — `index.html` (racine)
**Mission :** boîte à outils d'accompagnement des ados, 100 % locale et privée (TCC, gestion des émotions, TND/DYS, neuropédagogie, coaching parental, secourisme en santé mentale).
**État : ✅ en ligne** (PWA installable). _Marque renommée « Cap Educa » le 30 juil. (textes affichés ; objet JS interne inchangé)._

Outils inclus (~22) :
- **TND · DYS · Neuropédagogie** : Time Timer visuel · Séquenceur de tâches · Emploi du temps visuel · Tableau de jetons
- **TCC · Émotions** : Thermomètre des émotions · Carnet de pensées (colonnes de Beck) · Respiration guidée (cohérence cardiaque, carrée, 4-7-8) · Suivi d'humeur
- **Secourisme santé mentale** : Trousse anti-crise (5-4-3-2-1) · Plan de sécurité imprimable
- **Ancrage** : Carnet de gratitude
- **Suivi & réglages** : Dossier de suivi (frise chrono) · Fiches des jeunes (anonymisables) · Journal ABC (analyse fonctionnelle) · Réglages & données (confort dys, sauvegardes)
- **Hub** : liens vers apps externes · Tableau de bord · Suggestions bienveillantes

### 2.2 — 📦 Parcours Clarté TND / « Boîte NeuroPed » — `parcours-clarte-tnd/`
**Mission :** la grande collection Educa Typique assemblée en site navigable et vendable — le « couteau suisse ». **169 fichiers** (inventaire historique : 118).
**État : ✅ en ligne** — ⏳ manquent encore les **images des mascottes** (Neuroo, Educa, Noury) et visuels du kit réseaux.

**7 pages d'accueil :** `index` · `parents` · `ados` · `professionnels` · **`parents-musulmans`** · `offres` · `protection-numerique`

**👪 Espace PARENTS — `apps/` (outils + guides)**
- *Outils interactifs* : Détecteur de Paroles · Devoirs Sans Crise · Émotionomètre parental · Kit Gestion des Émotions · Mon Plan Pas-à-Pas · Pense-Bête Outils · Reprendre Confiance
- *Récupérés* : Boussole Diagnostic DYS · Contrat Confiance Ado · Autonomie Ado · Chrono Énergies Maman · Profils Couple Éducatif · Pyramide 7 niveaux · Routines Educatypique · MDPH Pas-à-Pas · Matrice Urgent/Important · Maman Neuro-Atypique · Ligne du temps parcours TND · Mon Équipe de Soin · Neuro Tarbiya
- *Guides* : Consignes efficaces · HPI · TDAH+TOP · **Dialoguer avec son ado** (+ variante **ISL** + v2)

**🧑 Espace ADO — `outils-ado/` (7)** : App Vocabulaire émotionnel · Boîte ado TDAH · Carnet d'intéroception · Émotion en 5 étapes · Mes valeurs · Module Joie · Thermomètre du bruit

**🧑‍⚕️ Espace PRO — `outils-pro/` (17)**
- *Profils (8 questionnaires)* : cognitif · neuro · sensoriel · fonctions exécutives · habiletés sociales · compétences scolaires · accès apprentissages · apprentissage
- *Repérage TND (3 questionnaires)* : ado · enfant · femme
- *Régulation/clinique (6)* : Roue des émotions pro · Thermomètre émotionnel · Protocole de crise · Premiers secours psy ado PRO · Radar profils · Constellation motivationnelle

**📄 Documents** : `ressources/` fiches (17) · `formations/` neurosciences (11) · `ebooks-guides/` (44) · `boite-emotions-neuroo/` (aperçu 6 modules, ⏳ attend mascottes) · `templates/`, `docs/`, `contenus-reseaux/` (kit « Ramener le calme »)

### 2.3 — 🌤️ Le point du jour — `le-point-du-jour/`
**Mission :** baromètre adaptatif du fonctionnement du jour, pensé pour cerveaux atypiques (TDAH/dys/HPI). Universel d'abord, spirituel en option.
**État : ✅ en ligne (PWA).**
- Baromètre (état → sections → synthèse ; modes bref/complet/crise)
- 🛟 **Le Sauveteur** — coach anti-noyade (respire → une bouée → premier geste → découper → alléger → plan)
- 🧰 **Boîte à outils** (6 hors-ligne) : Vide-tête · Découper · Choisir UNE priorité · Timer « on démarre » · Checklist · Respirer
- 🧠 **Profil léger** (TDAH/TDA/dys/sensoriel/HPI) → met en avant les bons outils
- 🏆 **Mes réussites** — done list (célèbre le « fait », pas le « parfait »)

**🔜 À faire (demandé par Nawel)** : « Mon équilibre » (famille ↔ pro ↔ soi) · Semainier d'organisation · Prise en compte des **événements de vie** (replanification souple, zéro culpabilité).

### 2.4 — 🧭 Mon Chargé de Com — `mon-charge-de-com/`
**Mission :** assistant réseaux sociaux anti-blocage (check-in émotionnel → régulation → **une** micro-action → écriture guidée par templates, sans IA).
**État : ✅ en ligne (PWA, 100 % hors-ligne).**
- Calendrier éditorial simple · bibliothèque de brouillons · réglages (spirituel, confort dys) · atelier enrichi (accroches, CTA, hashtags)
- **🔜 À faire** : génération de contenu par **IA optionnelle** quand connexion dispo (sans casser le hors-ligne).

---

## 🌿 3. Univers JANNAT AL QALB

### 3.1 — 🌸 Al Mizan Al Qalb — `al-mizan/`
**Mission :** app-compagnon pour aider les **auto-entrepreneuses à se libérer de leurs blocages** (la « balance » — الميزان). Universel d'abord, spirituel en option.
**État : ✅ en ligne** (charte + logo Jannat Al Qalb). Version « Design de Nawel » sauvegardée dans `al-mizan-design/`.
Espaces / satellites :
- **Vider, trier, avancer** — séquenceur (« Faire le point » — 3ᵉ carte, icône balance) — `sequenceur.html` / `mes-outils.html` / `organiser.html`
- **Boussole intérieure** — `boussole-interieure.html`
- **Face au regard** — `face-au-regard.html`

### 3.2 — 🌙 Souffle & Lumière — `souffle-lumiere/`
**Mission :** apaisement / sakîna, dhikr guidé.
**État : ✅ en ligne** — **rebrandée Jannat Al Qalb** (clôture + footer) ; étape Nom d'Allāh = **répétition libre** (« autant de fois que ton cœur en ressent le besoin », plus de « /7 ») ; icône arche.
_À traiter plus tard : la rendre autonome hors-ligne (comme Al Mizan)._

### 3.3 — 🌿 Jannat Al Qalb (vitrine cabinet) — `jannat-al-qalb/`
**Mission :** mini-site vitrine du **cabinet psycho-spirituel islamique** de Nawel (psychopraticienne, conseillère en psychologie islamique, conseillère d'éducation spécialisée TND & DYS).
**État : ✅ fait** (charte, logo, « Qui suis-je », 11 formations, tarifs, 4 piliers, FAQ, témoignages Seynabou + Vanessa, réservation **TidyCal**).
**⏳ À confirmer** : lien public TidyCal · email dédié · photo (optionnel).

### 3.4 — 🧘 Programme « Posture Sereine »
**Mission :** vrai **programme d'accompagnement** pour femmes entrepreneuses bloquées — coaching + TCC + psychologie islamique. **12 semaines, 5 étapes** : Observer → Réguler → Clarifier → Repositionner → Consolider.
**État : 🚧 programme (contenus), pas encore une app.** Matière déjà produite (uploads) :
- 📖 Ebook PRO (14 chapitres) → à décliner en ebook grand public
- 📓 Workbook (Fiche 0 Niyya + 5 étapes)
- 📋 **Questionnaire d'entrée / candidature** (cadre de sécurité : ne remplace ni thérapie, ni ruqya, ni fatwa)
- Architecture d'offre : 4 formules (Autonomie / Groupe / Premium / Bootcamp)

---

## 🛍️ 4. Commercialisation

### Pages de vente — ✅ publiées
`vente-boussole/` · `vente-al-mizan/` · `vente-souffle/` (chacune : 2 offres — appli seule / pack + ebook & workbook).
Sources aussi dans `al-mizan-design/vente-al-mizan.html`.

### 💶 Grille de prix (validée)
| Produit | Seul | Pack |
|---|---|---|
| Al Mizan Al Qalb 🔝 | 44 € | 59 € |
| Cap Educa (familles) | 39 € | 59 € |
| Souffle & Lumière | 29 € | 44 € |
| Pack des 3 apps | 99 € | — |
| Pack des 3 complets | — | 129 € |

### 💳 Décisions
- **Applis & packs → Stripe direct** (Payment Link → page code d'accès/merci **à construire**).
- Tunnels/e-mails auto → Systeme.io.
- **Textes légaux faits** (Naoual HADDOUCH EI, SIRET 902 273 366 00028) — ⏳ blancs : email contact · adresse · **médiateur consommation** · dates.

### 📌 Reste à faire (vente)
1. Page **code d'accès / merci** (après paiement Stripe)
2. **Payment Links Stripe** reliés aux boutons
3. Héberger les **mentions légales** (`/mentions-legales/`) + wirer les pieds de page
4. Finaliser **ebook + workbook « Posture Sereine »** en PDF
5. (option) page **pack des 3** · domaine `jannatalqalb.fr`

---

## 🧰 5. Chantier transverse — Hub « Couteau Suisse »
**Vision :** rattacher **toutes** les apps en **un hub unique installable (PWA)** — une porte d'entrée, **deux univers** (Educa Typique · Jannat Al Qalb) + passerelles, et un **3ᵉ espace restreint « Praticiennes »** (futur).
**État : 📝 Phase 1 (inventaire) faite** — architecture à valider avant de coder.
**❓ Questions ouvertes** : Boîte NeuroPed « en 3 copies » (laquelle fait foi ?) · 3 comptes Netlify (quoi/où ?) · séparation NeuroPed Universelle vs ISL · « satellites » d'Al Mizan · mécanisme de paiement · nom du hub.

---

## ✅ 6. Synthèse — Achevé / En cours / À faire

**✅ ACHEVÉ (en ligne)**
- Cap Educa · Parcours Clarté TND · Le point du jour · Mon Chargé de Com · Al Mizan Al Qalb · Souffle & Lumière · vitrine Jannat Al Qalb · 3 pages de vente · textes légaux (sources)

**🚧 EN COURS / partiel**
- Posture Sereine (contenus prêts, app à faire) · Boîte Émotions Neuroo (attend mascottes) · Souffle & Lumière hors-ligne · finalisation ebook/workbook PDF

**🔜 À FAIRE**
- Le point du jour : Mon équilibre + Semainier + événements de vie
- Mon Chargé de Com : IA optionnelle
- Vente : page code d'accès + Payment Links + hébergement légal
- **Hub Couteau Suisse** (Phase 2 archi) + espace Praticiennes
- App praticienne dédiée (volet pro sorti de Cap Educa)

---

## 🔧 7. Repères techniques
- Dépôt : `haddouchnawel27-wq/boussole-ado-educa-typique` · défaut publié = `claude/gracious-davinci-t0zife`.
- Clé localStorage `voiechifa.v1` **conservée** (données préservées — ne pas renommer).
- `sw.js` (Cap Educa) exclut `/al-mizan/`, `/souffle-lumiere/`, `/vente-*` du cache. Cache client = piège récurrent (navigation privée / Ctrl+Maj+R / `?v=N`).
- Al Mizan `index.html` autonome (React vendorisé) ; Souffle charge React via unpkg.
- Mémos de référence : `ETAT-DES-LIEUX.md` · `FEUILLE-DE-ROUTE-IA.md` · `SUITE.md` · `README.md` · `parcours-clarte-tnd/INVENTAIRE.md` · `jannat-al-qalb/A-FINALISER.md`.

---

## 🗺️ 8. OÙ VIT TON TRAVAIL — les 5 lieux (rien n'est perdu)

_Découverte du 10 août : une grande partie du travail n'est pas sur la branche publiée, mais répartie sur d'autres branches, d'autres hébergeurs et en local. Cette section fait le pont._

### Lieu 1 — Branche GitHub publiée (en ligne aujourd'hui)
Cap Educa · Parcours Clarté TND · Le point du jour · Mon Chargé de Com · Al Mizan · Souffle & Lumière · vitrine Jannat · 3 pages de vente.
→ **Cap Educa compte en réalité 33 outils enregistrés** (fichiers `assets/js/tools/`), pas ~22 (source : `LISTE-OUTILS-CAP-EDUCA.md`, branche codex). Le « 125 »/« 106 » se rapporte au **Parcours Clarté TND** (projet distinct), pas à Cap Educa.

### Lieu 2 — Branches GitHub NON fusionnées (pépites cachées)
| Branche | Contenu | État |
|---|---|---|
| `claude/fil-deux-jardins-propre` | **« Les Deux Jardins »** — hub **Next.js** (routes `/cockpit`, `/questionnaires`, `/hub/[slug]`, `/jardin/[slug]`, `/parcours-shifa`, login Supabase) + corpus complet (`_les-deux-jardins/`) | 🚧 avancé, **déployé** |
| `claude/chef-chantier-upgrade-mawum3` | Version « chantier » du même hub (branche déployée sur Vercel) | 🚧 |
| `codex/mcc-fabrique-publications-20260804` | **Mon Chargé de Com v2** : moteur IA sourcé, lecture locale PDF/DOCX (mammoth+pdf.js), fabrique de publications, studio de rédaction · **Pense-Bête Outils v5** · `LISTE-OUTILS-CAP-EDUCA.md` | 🚧 |
| `claude/cap-educa-gardes-monetisation` | (nom) gardes d'accès + monétisation Cap Educa | ❓ à ouvrir |
| `claude/wellbeing-check-ewiiyq` | (nom) check-in bien-être | ❓ à ouvrir |
| `claude/nouveau-projet-n5fzgh` | (nom) nouveau projet | ❓ à ouvrir |
| `claude/awesome-curie-grc7ky` · `claude/partenaire-lien-mot-a-mot-jn3o3q` · `claude/lucid-dirac-zt93h3` | à identifier (lucid-dirac = ancienne branche de travail) | ❓ |

### Lieu 3 — Vercel (team « Nawel's projects »)
- `boussole-ado-educa-typique` → ✅ Ready (ce dépôt)
- `les-deux-jardins` (Next.js) → ✅ **Ready** — `les-deux-jardins.vercel.app` (le hub, depuis la branche chef-chantier). L'« Error » ponctuel vient des builds de PR qui n'ont pas le dossier `les-deux-jardins-app/`.

### Lieu 4 — Netlify
- `boite-neuro-ped-univ.netlify.app` (la Boîte NeuroPed source, structure `f0_fondations/`) + **3 comptes Netlify** à recenser. _(API Netlify en panne temporaire lors du scan — à refaire.)_

### Lieu 5 — Ton PC (local : Bureau, Téléchargements, OneDrive)
Exports/brouillons HTML, souvent **dépassés** par les versions en ligne :
- `Pense-Bete_Outils_Nawel_v4_FINALE.html` → ⚠️ **v4**, alors que GitHub a la **v5**.
- `Planification_Semaine_Nawel_30072026.html` → semainier (remplacé par **Mon Cockpit**, ci-dessous).
- `_carte-outils.html` · `CHECKLIST — tester mes 15 apps en ligne.html` → tes propres cartes/checklists locales.
> 💡 Règle : le **dépôt GitHub fait foi** ; les fichiers du PC sont des copies. En cas de doute, comparer la version (v4 vs v5…).

---

## 🖥️ 9. NOUVEL OUTIL — « Mon Cockpit » (bureau)
**Mission :** un seul fichier posé sur le Bureau qui regroupe **agenda du jour + semaine + mois**, en **grands caractères** (lunettes), 100 % local et hors-ligne ; gestion douce des imprévus, marge intégrée, priorité du jour, spirituel en option.
**État : ✅ livré (artifact, à tester)** — à décider : intégrer au dépôt (`cockpit/`) ou le brancher dans *Le point du jour* / le hub *Les Deux Jardins* (qui a déjà une route `/cockpit`).

---

## ⏭️ 10. Prochaine décision (à trancher avec Nawel)
1. **Consolider les branches** : fusionner/relier *Les Deux Jardins* (hub) et *MCC v2* (codex) dans une base claire — c'est là qu'est le gros du travail non publié.
2. **Recenser Netlify** (3 comptes) + relier à la liste « 15 apps ».
3. **Choisir le point d'entrée unique** : le hub *Les Deux Jardins* (`/cockpit`) est le candidat naturel pour « tout regrouper à portée d'yeux ».
