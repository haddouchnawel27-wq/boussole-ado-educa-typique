# 🏛️ La séparation en trois espaces — document de référence

_Établi par Nawel le 24 août 2026. Ce document fait foi pour les trois agents._

---

## Le problème qu'on résout

Tout vivait au même endroit. Les outils pour les parents, ceux pour les ados et ceux
réservés aux praticiens étaient mélangés dans les mêmes dossiers, atteignables depuis
les mêmes pages, sans frontière.

Trois conséquences :

1. **Un parent tombait sur des outils cliniques** qu'il n'a pas à manipuler seul —
   grilles d'observation, analyse fonctionnelle, repérage différentiel.
2. **Le bloc Pro, vendu 297-497 €, était gratuit** pour qui cliquait au bon endroit.
3. **Personne ne savait qui possédait quoi.** Trois agents travaillaient sur les mêmes
   fichiers, se marchaient dessus, et aucun état des lieux n'était fiable.

## La solution : un public, un espace, un agent, une branche

| Espace | Public | Agent | Branche |
|---|---|---|---|
| 🏠 **La Casa des Familles** | Parents d'enfants (4/5 → 10/11 ans) **et** parents d'ados | **Claude** | `claude/casa-familles` |
| 🧑 **La Casa des Ados** | Les ados eux-mêmes (12-18 ans) | **Codex** | `codex/casa-ados` |
| 🧑‍⚕️ **L'Espace Pro** | Praticiens, enseignants, AESH, structures | **Cowork** | `cowork/espace-pro` |

Branche de base commune : `claude/gracious-davinci-t0zife`.

---

## Règle fondatrice — le contact humain

_Posée par Nawel le 28 août 2026._

> **Le contact humain est un socle obligatoire. Pas d'auto-livraison.**

Aucun programme, aucun parcours, aucune formation ne se livre en libre-service. Il y a
toujours un humain dans la boucle — Nawel, ou la praticienne qui accompagne.

Ce que cela change concrètement :

| Ce qui reste libre | Ce qui passe par un humain |
|---|---|
| Les **outils** de la Casa des Familles : gratuits, sans inscription, on les prend et on s'en sert | Les **programmes** et **formations** : Posture Sereine, la formation harcèlement, tout ce qui se déroule dans le temps |
| Les **fiches à imprimer** | Les **grilles de suivi sur plusieurs semaines** — sans accompagnement, elles restent vides |
| Les **applications compagnon** (Al Mizan, Le point du jour) une fois la personne accompagnée | Les **supports qui portent un jugement clinique** — profils, repérages |

C'est aussi la raison pour laquelle la formation « Harcèlement scolaire » n'a pas été
publiée dans la Casa : elle se remet en main propre.

---

## Les cinq règles absolues

### 1. Aucun passage vers le Pro

**Aucun lien, bouton, menu ou redirection ne mène de la Casa des Familles ou de la Casa
des Ados vers l'Espace Pro.** C'est la règle la plus importante : elle protège le bloc
tarifé 297-497 €. Elle a déjà été enfreinte une fois — la porte « Professionnels » de
l'accueil du Parcours Clarté — et Nawel est tombée dessus elle-même.

Le sens inverse est permis : un praticien peut consulter les outils familles.

### 2. Jamais le mot « diagnostic » dans un texte affiché

Nawel n'est pas habilitée à poser des diagnostics. Le mot ne doit apparaître dans aucun
texte vu par un utilisateur. On dit **repérage**, **observation**, **profil**.

Deux exceptions légitimes, à conserver :
- les identifiants techniques (`data-tab="diagnostic"`, `id="panel-diagnostic"`) ;
- les mentions protectrices — « cet outil ne pose aucun diagnostic », « un diagnostic
  médical relève d'un professionnel qualifié ». Elles disent l'inverse, elles protègent.

### 3. « Voie Chifā » n'existe plus

La marque est **Jannat Al Qalb**. Aucun texte affiché ne doit porter l'ancien nom.

⚠️ **Ne jamais renommer** en revanche : la clé de stockage `voiechifa.v1` (cela
détruirait les données des utilisateurs), les URL `*-voiechifa.netlify.app` (sites en
ligne), l'adresse `voiechifa@gmail.com`, la classe CSS `.voie-chifa`.

### 4. Une branche par agent

Ne jamais pousser sur la branche d'un autre agent. Si un travail déborde sur un espace
voisin, on le signale à Nawel — on ne le fait pas soi-même.

### 5. Un message court à la fois

Nawel est TDAH. Ses mots : *« trop d'info tue l'info, mes yeux louchent »*. Une seule
idée par message, pas de pavé, pas de liste de dix décisions. Une question, on attend
la réponse, on avance.

---

## La charte EducaTypique

`parcours-clarte-tnd/assets/charte.css` (identique à `_assets/charte.css`).

**Polices** — Poppins pour les titres, Nunito pour le texte. Rien d'autre.

**Palette** — rose clair `#F8CFE0` · rose soutenu `#F39BC2` · lavande `#CBB6F6` ·
menthe `#BDEAD7` · turquoise `#8ED9D2` · pêche `#FFD6C2` · beige `#F7F2EC` ·
jaune doux `#FFE9A8` · bleu ciel `#CDE6F5`.
Titres : violet `#7c5cbf` · rose `#e05a8a` · teal `#2a9d8f`.

**Mascottes** — Neuroo (l'explorateur, menthe), Educa (la guide, rose/lavande),
Noury (la studieuse, rose). Dans `assets/mascottes/`.

⚠️ **Piège connu.** Google Fonts sert Nunito en police **variable**. Chromium ne sait
pas l'intégrer dans un PDF : il redessine chaque lettre en vecteurs et le fichier double
de poids. Pour tout PDF, figer des instances statiques (`fontTools.varLib.instancer`).

⚠️ **Second piège.** Ne jamais insérer `font-family:'Nunito',…` avec des apostrophes à
l'intérieur d'une chaîne JavaScript entre apostrophes — cela casse le script. Écrire
`font-family:Nunito, system-ui, sans-serif` sans guillemets dans ce contexte.

---

## Où en est chaque espace

### 🏠 Casa des Familles — Claude · `claude/casa-familles`

**En ligne.** Page d'entrée `casa-familles/index.html`, 45 outils rangés par besoin,
11 fiches PDF à la charte, état des lieux vérifié ligne à ligne.

**Fait :** publication des 20 outils qui manquaient · toutes les fiches passées à la
charte · poids des PDF divisé par deux · fuite Famille→Pro fermée · un document de
travail interne (tarifs, page de vente) retiré du dossier public · deux PDF appartenant
à un tiers retirés.

**Reste :** l'espace maternelle 4-6 ans (le catalogue démarre à 6 ans, la Casa annonce
4-5) · la série « posture parentale ».

### 🧑 Casa des Ados — Codex · `codex/casa-ados`

7 outils dans `parcours-clarte-tnd/outils-ado/` : vocabulaire des émotions, boîte ado
TDAH, carnet d'interoception, émotion en 5 étapes, mes valeurs, module joie,
thermomètre du bruit.

À rassembler derrière une porte unique, comme la Casa des Familles.

### 🌙 Al Mizan Al Qalb et Posture Sereine — hors des trois espaces

Ces deux-là ne relèvent d'aucune des trois Casas : ils s'adressent aux **femmes
adultes**, pas aux familles TND.

**Al Mizan Al Qalb** (`al-mizan/`) est une application compagnon du quotidien : un
check-in de 30 secondes, un jardin qui pousse au fil des jours, un résumé de la semaine,
et trois outils — « Vider, trier, avancer » (charge mentale), « Boussole intérieure »,
« Face au regard ».

**Posture Sereine** (branche `claude/nouvelles-aventures-6rtc3b`) est le programme
d'accompagnement de 12 semaines qui va avec : un ebook de 14 chapitres, un workbook de
12 fiches, un questionnaire de candidature. Le workbook est explicitement « relié à
l'app Al Mizan Al Qalb ».

**L'intention, telle que Nawel l'a posée :** l'application sert le parcours Posture
Sereine, pour accompagner les **auto-entrepreneuses bloquées**. L'une ne va pas sans
l'autre.

⚠️ **Un recouvrement à trancher un jour.** `le-point-du-jour/` propose lui aussi un
check-in quotidien, en version autonome et hors ligne, avec une porte « J'ai besoin
d'aide, maintenant ». Il faudra choisir : porte d'urgence d'Al Mizan, ou produit
distinct. Pas urgent.

---

### 🧑‍⚕️ Espace Pro — Cowork · `cowork/espace-pro`

17 outils dans `parcours-clarte-tnd/outils-pro/`.

**Profils (8)** — cognitif · sensoriel · neuro · apprentissage · accès aux
apprentissages · compétences scolaires · fonctions exécutives · habiletés sociales

**Repérage (4)** — radar des profils · repérage TND enfant · TND ado · TND femme

**Clinique (5)** — protocole de crise · premiers secours psy ado (version PRO) ·
roue des émotions PRO · thermomètre émotionnel · constellation motivationnelle

Un brouillon existe côté Cowork : `Espace_Pro_NeuroPed.html`, en attente de validation.

---

## Ce que Claude a mis de côté pour l'Espace Pro

En publiant les outils familles, du contenu clairement praticien a été retiré. Il
**appartient à Cowork**, pas à la Casa.

**Six panneaux « Mode Pro » de `cours-tnd-interactif`** — concepts cliniques, repérage
clinique, codification, HPI clinique, repérage différentiel, plan d'action. Ils étaient
déverrouillables par un bouton dans un outil grand public. Récupérables dans
l'historique Git, avant le commit `62abb28`.

**Quatre fiches PDF praticiens** jamais passées à la charte, dans `ressources/` :
`Fiche00_Mode_Emploi` (6 p.) · `Fiche05_Profil_Sensoriel` (11 p.) ·
`Fiche11_Profil_Eleve_Ecole` (11 p.) · `Fiche15_Profil_Socio_Relationnel` (9 p.).

**Deux outils repérés et non publiés** : `radar-profils` et `reperage-tnd-femme` — déjà
présents dans `outils-pro/`, mais un outil famille y renvoyait. Les liens ont été coupés.

**Les axes B et F de la Boîte NeuroPed**, jamais publiés : observation et évaluation
(grille ABC, analyse fonctionnelle, grilles d'observation, bilan 4 théoriciens, atelier
ZPD, pack fondation) et suivi et traçabilité (anamnèse TND, objectifs SMART, tableau de
suivi, carnet de séances, restitution famille, bilan programme, aide PAP/PPS/PAI,
contrat tripartite, fiche attachement TDAH).

---

## Une réserve de propriété intellectuelle

Deux PDF ont été retirés du site le 27 août : ils portaient « Propriété de Aziza AZRI,
fondatrice Madrassa LMDE — copie et partage interdit ». Le détail est dans
`_versions-precedentes/documents-internes/LISEZ-MOI.md`.

**La leçon vaut pour les trois espaces :** un dossier servi par Vercel ou GitHub Pages
l'est en entier. Un fichier sans lien reste téléchargeable par URL directe. Rien
d'interne, de tarifaire ou appartenant à un tiers ne doit y être déposé.
