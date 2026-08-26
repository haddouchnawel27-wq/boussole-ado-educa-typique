# 🏠 La Casa des Familles — état des lieux

_Périmètre : parents d'enfants (4/5 → 10/11 ans) et parents d'ados._
_Relevé du 26 août 2026 — **version vérifiée**, chaque ligne contrôlée par comparaison de contenu._
_Mise à jour du 26 août au soir : les 20 outils absents sont publiés._

---

## En un coup d'œil

| | Nombre |
|---|---|
| Outils en ligne qui nous appartiennent | **39** |
| Outils en ligne à arbitrer (parent d'ado) | **4** |
| Outils réellement absents, à publier | **0** ✅ |
| Fiches PDF | **déjà toutes en ligne** ✅ |
| Doublons rangés en archive | **2** |
| Outils qui n'existent nulle part | **4** |

> ⚠️ **Correction d'un relevé précédent.** Une première version de ce document annonçait
> « 22 outils et 11 PDF jamais publiés ». C'était faux sur deux points :
> les **11 fiches PDF étaient déjà toutes en ligne** dans `ressources/`, et deux des
> outils comptés comme manquants (`kit-calme`, `kit-emotions`) sont déjà publiés
> sous un autre nom. Le compte réel est de **20 outils**.

---

## 1. Ce qui est en ligne et nous appartient (19)

**Comprendre son enfant**
`guide-tdah-top` · `guide-hpi` · `boussole-diagnostic-dys` · `pyramide-7-niveaux` · `ligne-du-temps-parcours-tnd`

**Le quotidien qui coince**
`devoirs-sans-crise` · `routines-educatypique` · `guide-consignes-efficaces` · `mon-plan-pas-a-pas` ·
`kit-gestion-emotions` · `emotionometre-parental` · `detecteur-de-paroles` · `kit-ramener-le-calme`

**Le parent lui-même**
`maman-neuro-atypique` · `chrono-energies-maman` · `matrice-urgent-important` · `profils-couple-educatif`

**Les démarches**
`mdph-pas-a-pas` · `mon-equipe-de-soin`

**Dimension spirituelle**
`neuro-tarbiya`

_(`pense-bete-outils` est le mémo interne de Nawel, pas un outil client — hors décompte.)_

### Les ressources, toutes déjà publiées

`ressources/` — 15 fiches PDF : TDAH · TSA · Dyscalculie · Dysorthographie · Dyspraxie ·
stratégies de métacognition (+ annexes) · carte d'identité cognitive · valeurs ados ·
veille TND · mode d'emploi · profil sensoriel · profil élève école · guide parents consignes ·
profil socio-relationnel

`ebooks-guides/` — 14 PDF, dont *Accompagner la Parentalité*, *Éduquer avec Conscience*,
*Les 4 Piliers de l'Apprentissage*, *Présentation Dossier MDPH*, *Organisation de Semaine*

`formations/` — 11 PDF de formation (neurosciences, dys, HPI, cerveau, traumas, estime de soi)

---

## 2. À arbitrer : les outils « parent d'ado » (4)

Rangés côté parents, ils affichent 12-18 ans. Mais ils s'adressent au **parent**, pas à l'ado.

`dialoguer-avec-son-ado` (+ variante `-ISL`) · `autonomie-ado` ·
`contrat-confiance-ado` · `reprendre-confiance`

**Mon avis : ils restent ici.** La consigne était « parents-enfants *et* parents-ados ».
C'est le parent qui les lit — l'ado ne consulte pas une fiche sur comment lui parler.

---

## 3. Les 20 outils manquants — publiés ✅

Publiés le 26 août 2026 dans `parcours-clarte-tnd/apps/`, tous à la charte
EducaTypique, tous reliés à la Casa des Familles.

**Régulation (7)**
`boite-emotions-19` — l'application maître, 19 émotions · `boite-emotions-19-ISL` — édition
familles musulmanes · `devoirs-sans-crise-6-10-ans` — renommé, c'est bien un outil distinct
de l'app du même nom · `recadrer-sans-exploser` · `premiers-secours-psy-ado-familles` ·
`methode-rahma` · `methode-rahma-prophetique`

**Ludothèque (7)**
`des-emotions` · `cartes-scenarios-parent-enfant` · `apprivoise-tes-emotions` ·
`memoire-en-images` · `jeux-maison-fe` · `jeu-chitane` · `jeux-adaptes-rahma-tech`

**Fonds antérieur (6)**
`aide-epuise` · `apprendre-a-apprendre` · `controle-influence-lache` ·
`cours-tnd-interactif` · `schema-declencheur-tcc` · `trouble-dys-executif`

### Ce qui a été corrigé au passage

| Correction | Détail |
|---|---|
| **Bloc « Mode Pro » retiré** | `cours-tnd-interactif` embarquait six panneaux cliniques réservés aux praticiens — dont un « diagnostic différentiel ». Retirés : ce contenu appartient à l'espace Pro. |
| **Chemins du ZIP remappés** | Les liens pointaient vers l'arborescence de la Boîte NeuroPed (`../A_reperage/…`, `../E_ludotheque/…`). Tous redirigés, plus aucun lien mort. |
| **Retour vers la Casa** | Les liens « ← Espace parents » menaient à une page inexistante. Ils pointent désormais vers la Casa des Familles. |
| **Images allégées** | Les deux boîtes à émotions pesaient 6,5 Mo chacune. Ramenées à ~1,9 Mo, sans perte visible. Total : 13,1 Mo → 4,9 Mo. |
| **Bug JavaScript corrigé** | La mise à la charte avait inséré des noms de polices entre apostrophes à l'intérieur de chaînes JS, cassant cinq outils. Détecté au test de rendu, corrigé. Les 45 outils de `apps/` sont désormais testés sans erreur. |
| **Deux cartes mortes retirées** | `cours-tnd-interactif` renvoyait vers `radar-profils` et `reperage-tnd-femme`, qui ne sont pas publiés. Candidats à publier plus tard. |

## 4. Les doublons — ce qu'on garde, ce qu'on écarte

Enquête menée sur les fichiers portant le même nom. Les dates de fichier du dépôt sont
inutilisables (toutes au 16/08, c'est la date du clone) : le tri s'est fait sur le
**contenu, la taille et les marqueurs internes**.

| Famille | On garde | On écarte, et pourquoi |
|---|---|---|
| **dialoguer-avec-son-ado** | `apps/dialoguer-avec-son-ado.html` | `_v2` était la copie du ZIP avec des chemins `../../` **cassés** sur le site → archivé |
| **neuro-tarbiya** | `apps/neuro-tarbiya.html` — marque Jannat Al Qalb à jour | `docs/neuro-tarbiya-merkez.html`, doublon → archivé · la version ZIP dit encore « Voie Chifā », périmée |
| **devoirs-sans-crise** | `apps/devoirs-sans-crise.html` — 151 Ko, la plus complète | `devoirs-sans-crise-app` du ZIP (130 Ko), antérieure · les 3 fichiers de `_versions-precedentes/` sont bien des archives |
| **kit-gestion-emotions** | `apps/kit-gestion-emotions.html` — 57,7 Ko | `kit-emotions` du ZIP (54,1 Ko) est la version antérieure |
| **kit-calme** | `contenus-reseaux/kit-ramener-le-calme.html` | La version ZIP est la même à 3 octets près (chemins) |
| **emotionometre-parental** | la version du site | Le ZIP ne diffère que par les chemins `../` → `../../` |
| **mon-plan-pas-a-pas** | la version du site | Idem |
| **guide-tdah-top** · **mdph-pas-a-pas** | les versions du site | Les fichiers « - Copie » du ZIP sont identiques à l'octet près |

**Ce qui a bougé :** deux fichiers déplacés vers `_versions-precedentes/`. Aucun lien ne
pointait dessus, rien ne casse. Rien n'a été supprimé — tout reste récupérable.

---

## 5. Ce qui n'existe nulle part (4)

Croisement du catalogue avec les trois sources lues (cf. `_sources/ENSEIGNEMENTS-A-RETENIR.md`).

### 🔴 Le trou 4-6 ans

L'outil le plus jeune du catalogue est la boîte à émotions de Cap Educa — elle démarre
à **6 ans**. Notre périmètre commence à 4/5. Il manque donc précisément la **maternelle**.

La recherche-action belge fournit toute la matière : quatre fonctions exécutives,
sept fiches, des activités testées en classe avec des tout-petits.

### 🟠 Le « moment spécial » parent-enfant

Réinstaller du temps partagé agréable, sans consigne et sans enjeu, quand la relation
s'est réduite au conflit. Deuxième marche de toute guidance parentale. Rien chez nous.

### 🟠 Féliciter quand tout va bien

Aller vers l'enfant *pendant* qu'il joue seul et ne dérange personne. Contre-intuitif,
central dans la littérature TDAH — et tous nos outils n'interviennent qu'après le dérapage.

### 🟠 La posture de l'adulte, formalisée

Nos outils donnent des activités, jamais le cadre d'attitude qui les rend efficaces.
Le livret belge en fait sa toute première fiche, avant tout matériel.

---

## Ce qui reste

1. ~~Publier les 20 outils.~~ ✅ **Fait le 26 août.**
2. **Créer l'espace 4-6 ans.** Le plus gros manque, la matière est disponible.
3. **La série « posture parentale »** — moment spécial, attention au calme, cadre d'attitude. Les trois vont ensemble.
4. Deux outils repérés au passage et non publiés : `radar-profils` et `reperage-tnd-femme`.
   Le second se marie bien avec `maman-neuro-atypique`.

## Ce qui attend Nawel

- Le périmètre « parents d'ados » (§2).
- `bmv_p1.pdf` et `bmv_p2.pdf` dans `ressources/` : ils portent la mention
  « Propriété de Aziza AZRI — copie et partage interdit ». Ils ne sont liés depuis aucune
  page, mais restent téléchargeables par URL directe. À sortir du dossier publié.
