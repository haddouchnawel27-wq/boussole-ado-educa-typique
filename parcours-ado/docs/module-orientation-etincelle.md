# 🧭 Module Orientation « Étincelle » — spécification

> **Statut :** spécification (pas encore codée). Étape **finale** du Parcours Ado
> « Mode d'Emploi de Moi », à construire **après** que l'ado se soit « rencontré »
> (Programmes 1 à 3).
> **Rattachement :** `Cahier_Des_Charges_Fonctionnel_Parcours_Parent_Ado_Pro_v1.md`
> (espace de travail Nawel). Enrichit **AD-05 (Mes valeurs)** et surtout
> **AD-09 (Mon quotidien et mon avenir)** ; se relie à **AD-03 (Mode d'emploi de
> Moi)** par la métacognition.
> **Codes techniques :** `orientationModule` / écrans ET-01 à ET-06.

Ce document consolide le brainstorm de Nawel (source) et les **compléments**
d'implémentation (signalés `＋`). Il respecte les non-négociables de l'écosystème :
100 % local et chiffré · privé par défaut · **aucun diagnostic, aucun score
alarmiste, aucune mise en échec** · feedback toujours positif · relais vers des
ressources externes fiables plutôt que prétendre tout couvrir.

---

## 1. Intention

Un module **ludique d'introspection** pour aider l'ado (surtout neuroatypique) à
se comprendre, explorer ses **intelligences** (y compris celles peu valorisées à
l'école), les relier à ses **valeurs**, développer l'esprit critique, et préparer
une **orientation choisie et sereine**.

**Principe non négociable — jamais de mise en échec.** Si l'ado ne sait pas ce
qu'il veut, on creuse en douceur ; feedback positif systématique, « je ne sais
pas encore » disponible partout.

## 2. Les quatre blocs

1. **Étincelle** — ce qui motive et passionne.
2. **Forces & faiblesses** — auto-évaluation par domaine, avec le message : on
   peut être confiant dans un domaine et pas dans un autre (**pas de jugement
   global**).
3. **Valeurs** — ce qui compte le plus (la foi = une valeur possible, jamais
   imposée ; cohérent avec AD-05).
4. **Projection** — participation à l'orientation, à son rythme.

Progression : **découverte de soi → mise en pratique → plan d'action concret**.

## 3. Le socle : intelligences × intérêts (profil combiné)

Deux questionnaires en parallèle **qui se croisent** pour un **profil combiné**
— jamais un résultat isolé de chaque test.

### 3.1 Intelligences multiples (Gardner) — couche **ludique**
Logico-mathématique · Linguistique · Interpersonnelle · Intrapersonnelle ·
Kinesthésique · Musicale · Spatiale · Naturaliste.

> ⚠️ **Rigueur** : Gardner est un cadre pédagogique populaire mais **sans
> validation psychométrique forte**. À présenter comme un **outil ludique de
> connaissance de soi**, jamais comme une mesure d'intelligence. Vocabulaire :
> « pour t'aider à explorer », pas « pour mesurer ».

### 3.2 Intérêts professionnels (RIASEC / Holland) — socle **validé**
Réaliste · Investigateur · Artistique · Social · Entreprenant · Conventionnel.
**Modèle bien établi** en psychologie de l'orientation → c'est le socle sérieux
pour la partie « compatibilité métiers ». Gardner reste la couche ludique en
complément.

### 3.3 Style d'apprentissage (à croiser)
Écouter / voir des démonstrations / essayer soi-même ; relire / en parler /
mettre en pratique ; cadre structuré / flexible.

> ＋ **Éviter le mythe des « styles d'apprentissage » figés** : comme pour
> Gardner, présenter en « conditions d'accès » (reprend la posture d'AD-03 /
> Fiche 4), pas en identité (« je suis visuel »). C'est une **préférence**, pas
> une étiquette.

### 3.4 Métacognition — **le vrai plus clinique**
Comprendre **comment** l'ado pense et apprend, pas seulement ce qu'il aime.
Exemple : un ado qui pense « en images », a besoin de concret, peine à prendre
des notes en écoutant → risque en amphi (notes + écoute + compréhension
simultanées). Info cruciale pour orienter vers des **filières compatibles avec
son fonctionnement réel**, pas seulement ses goûts.

> ＋ **Pont technique explicite avec AD-03.** Le bilan AD-03 capture déjà :
> - la **fenêtre d'or** (moment de disponibilité) ;
> - la **commande la plus fragile** (fonction exécutive) ;
> - (V4, à venir) la **porte d'entrée** (comment je comprends le mieux).
>
> Étincelle doit **lire ces données du coffre** (`capEduca.ado.data.bilan-*`)
> pour personnaliser sans reposer les mêmes questions, et pour formuler des
> **alertes douces de format** (ex. « les formats avec beaucoup de prise de notes
> rapide risquent de te coûter — pense aux filières qui laissent enregistrer,
> relire, manipuler »). C'est ce qui distingue Étincelle d'un test générique.

## 4. Familles de métiers (auto-positionnement, jamais nominatif)

3 à 5 questions par domaine, toujours en « aimes-tu / te sens-tu à l'aise / es-tu
motivé », **jamais en test de compétence** :

Communication/marketing · Santé · Ingénierie · Métiers manuels · Art · Commerce ·
Finance · Juridique · Culinaire · Éducation · **Environnement/développement
durable** (préoccupation fréquente des jeunes — à garder) · Informatique/numérique.

> **Usage** : base d'exploration **généraliste**, pas un instrument de décision.
> Le relais vers des ressources spécialisées prend ensuite le relais.

## 5. Portrait chinois (entrée en matière ludique)

Questions projectives : si tu étais un animal / paysage / couleur / saison /
objet — lequel, et pourquoi ? Révèle des traits **sans pression d'introspection
directe**. Idéal comme **première étape** avant les questionnaires structurés,
surtout pour un ado qui bloquerait sur des questions frontales.

> ＋ **Route de secours anti-blocage** : si l'ado répond « je ne sais pas » à
> plusieurs items d'un questionnaire, proposer de basculer vers le portrait
> chinois — jamais l'inverser en échec.

## 6. Ressources externes (relais, jamais copiées)

L'Étudiant · Onisep · Ton avenir · JobTeaser & plateformes profils
neuroatypiques · (app mentionnée : 130+ tests basés sur de vraies théories).

> ＋ **Règles d'intégration** (non-négociables techniques) :
> - Ce sont des **liens que l'ado choisit d'ouvrir**, présentés en « à explorer
>   plus tard, idéalement avec un adulte de confiance ». Aucun appel réseau
>   automatique ; l'app reste 100 % hors-ligne sans eux.
> - Liste **datée** et portant « à revérifier avant diffusion » (les URLs et
>   réputations évoluent).
> - Le module **prépare** l'ado à s'y présenter mieux ; il ne remplace pas ces
>   ressources.

---

## ＋ 7. Compléments d'implémentation (Claude)

### 7.1 « Jamais de mise en échec » — mécanismes concrets
- Aucun écran « aucun résultat » / « pas de correspondance ». On reflète toujours
  au moins **une force** et **une piste**.
- « Je ne sais pas encore » présent **sur chaque item** (comme le « je passe »
  d'AD-03), compté comme une donnée, pas un trou.
- **Profil « éclaté » valorisé** : pour un ado TND, plusieurs pics très
  différents (ou un seul très ciblé) est une **richesse**, pas une anomalie. Le
  module **ne force jamais** l'émergence d'« une » famille dominante.

### 7.2 Restitution — « Ma boussole d'orientation »
Sur le modèle de la Notice d'AD-03, à la **première personne**, privée :
- **Ce qui m'allume** (Étincelle + intelligences hautes, formulé en forces).
- **Mes couleurs d'intérêts** : les 2-3 facettes RIASEC les plus fortes,
  présentées comme des **facettes qui se combinent**, pas un classement-verdict.
- **Comment j'apprends le mieux** (préférences + pont métacognition depuis AD-03).
- **Des univers à explorer** : familles de métiers cohérentes, au pluriel,
  toujours « à explorer » — jamais « le » métier.
- **Ma prochaine petite action** : UNE seule (ex. « regarder tel univers sur
  Onisep avec un adulte cette semaine »), dans l'esprit du plan d'AD-03.

### 7.3 Visualisation du profil combiné
- **Radar accessible** (réutiliser le SVG de `profil-neuro.js`, sans sa logique
  de score clinique), **doublé d'une version texte** pour lecteurs d'écran et
  faible vision. Pas de couleur seule pour porter l'information.

### 7.4 Confidentialité & partage
- Tout reste dans le coffre chiffré `capEduca.ado.*`, **privé par défaut**.
- Partage uniquement via **AD-11 (Centre de partage)** : l'ado choisit quoi et à
  qui (parent / praticienne), avec aperçu et confirmation. Le parent ne reçoit
  jamais les réponses brutes automatiquement.

### 7.5 Adaptations neuroatypiques & âge
- Découpage en **petits blocs** (fatigabilité), reprise du brouillon, « quitter
  pour aujourd'hui ».
- **Profondeur selon l'âge** : 13-14 ans = découverte/plaisir ; 16-17 ans =
  projection plus concrète (filières, premières démarches).
- Portrait chinois comme **porte d'entrée douce**.

### 7.6 Ordre de construction proposé (dans le module)
1. **ET-06** Portrait chinois (entrée ludique)
2. **ET-01** Intelligences multiples (Gardner, ludique)
3. **ET-02** Intérêts RIASEC (socle validé)
4. **ET-03** Style d'apprentissage
5. **ET-04** Métacognition — **pont explicite** avec AD-03 (lecture du coffre)
6. **ET-05** Profil combiné + « Ma boussole d'orientation » (radar accessible)

### 7.7 Points de vigilance repris du brainstorm
1. **Séparer le validé du ludique** : Holland = socle sérieux ; Gardner = couche
   plaisante. Même vocabulaire de présentation à tenir partout.
2. **La métacognition est le pont**, pas une brique isolée (lien AD-03 / PA-09).
3. **Profil éclaté = richesse** : ne jamais ranger de force dans une seule case.

---

---

## 8. Banque de questions détaillée (version « bilan de profil »)

> Version développée par Nawel. Ambition : passer d'un questionnaire
> **exploratoire** à un vrai **outil de bilan**, en variant les **types de
> questions** pour que chaque réponse devienne un indicateur exploitable :
> **échelles 1-5 · questions ouvertes · mises en situation · choix forcés ·
> questions de validation**.

### 8.1 Les 10 blocs

1. **Intelligences multiples** — (A) Perception : choix multiples « quand tu
   découvres une activité / résous un problème / on t'explique… ». (B) Mise en
   situation : « tu dois monter un meuble, que fais-tu ? » + *pourquoi*.
   (C) Auto-évaluation 1-5 : je retiens les images / les sons / j'aime expliquer,
   résoudre, créer, organiser, manipuler, observer la nature, travailler avec les
   autres / seul.
2. **Portrait chinois** — animal, couleur, saison, plante, arbre, matière, objet,
   pays, métier, super-pouvoir, émotion, devise, citation, livre, invention — avec
   *pourquoi* à chaque fois.
3. **Centres d'intérêt** — classer des activités (créativité, sport, lecture, jeux,
   sciences, nature, musique, cuisine, voyages, techno, bricolage, aide aux autres,
   animaux, organisation, entrepreneuriat, autre) + 3 ouvertes (temps libre / sujet
   que j'écouterais des heures / sujet que je sais expliquer).
4. **Motivations** — classer de 1 à 10 (argent, aider, créer, liberté, stabilité,
   voyager, innover, apprendre, équipe, reconnaissance) + ouvertes (fierté,
   source de motivation, ce qui décourage).
5. **Profil d'apprentissage** — préférences (lire/écouter/manipuler/regarder),
   compréhension, réaction au blocage, durée de concentration, seul/à deux/groupe.
6. **Métacognition** — dialogue intérieur ? images ? scénarios ? besoin d'écrire /
   de parler ? réaction à l'erreur ; « peux-tu expliquer ce qui t'a fait réussir ? »
7. **Personnalité face au travail** — seul/équipe, décision rapide/réfléchie,
   créatif/organisé/intuitif/logique, prévoir/improviser, face à la difficulté.
8. **Environnement idéal** — calme/bruit/musique/dehors ; bureau/atelier/labo/
   terrain/télétravail ; liberté/cadre/planning/objectifs.
9. **Orientation** — univers attirants (santé, éducation, numérique, commerce, art,
   communication, agriculture, environnement, sciences, bâtiment, justice, sport,
   recherche, artisanat, cuisine, transport, sécurité, social) ; matières
   préférées / évitées ; métier admiré + *pourquoi* ; « dans 10 ans… ».
10. **Bilan final** — 3 qualités, 3 talents, 3 défis, ce qui motive / épuise / rend
    heureux, ce que j'aimerais apprendre, mon plus grand rêve, le métier qui me
    ressemble **aujourd'hui**.

### 8.2 Vision « outil intelligent » (Nawel) — et son cadrage
Ambition annoncée : scoring par profils · radar des intelligences · analyse du
style d'apprentissage · profil de personnalité au travail · recommandations
personnalisées · **rapport final automatisé de plusieurs pages**.

> ＋ **Cadrage non-négociable de cette ambition** :
> - **Scoring = facettes, jamais verdict.** Les points nourrissent un **portrait
>   nuancé** (« tes couleurs dominantes »), jamais une catégorie unique imposée.
>   **Profil éclaté valorisé.** Feedback **toujours positif**, y compris quand
>   c'est incertain.
> - **Gardner & styles d'apprentissage = ludique / préférences**, jamais mesure
>   validée ni identité figée (« je suis visuel »). Formulation « conditions
>   d'accès », comme AD-03.
> - **Le « rapport multi-pages » a deux versions distinctes** :
>   - côté **ADO** = « Ma boussole d'orientation », **1re personne, privée**,
>     centrée forces + pistes + UNE action ;
>   - une lecture **pro / conseiller / établissement** ne vit **pas** dans l'app
>     ado : elle relève de **Les Deux Jardins**, et **rien n'est transmis sans le
>     consentement explicite de l'ado** (AD-11, aperçu + confirmation).
> - **Volume ⇒ deux profondeurs** : une **version courte** (l'essentiel, ~10 min)
>   et une **version longue** (approfondissement). « Je passe » et « je ne sais
>   pas encore » **sur chaque item**, reprise du brouillon, découpage en blocs
>   (fatigabilité TND).
> - **Questions ouvertes & mises en situation** : stockées **chiffrées et
>   privées**, elles servent au **dialogue** (et à la séance), pas à une analyse
>   automatique intrusive. La mise en situation « monter un meuble » est un
>   excellent révélateur de **porte d'entrée** → à relier à AD-03.
> - **Réponses « j'abandonne / je me décourage »** : jamais restituées comme un
>   défaut. Reformulées en **besoin** (« quand je bloque, j'ai besoin de… ») —
>   posture d'AD-03.

---

---

## 9. Vision « bilan 360° » — axes complémentaires

> Extension proposée par Nawel : dépasser « quel métier me correspond ? » pour
> couvrir « qui suis-je · comment j'apprends · dans quel environnement je
> m'épanouis ». 15 axes complémentaires + une architecture cible en 6 modules.

### 9.1 Les 15 axes proposés
1. **Valeurs personnelles** (inacceptable au travail, top 3, liberté/sécurité,
   impact/reconnaissance, créer/transmettre… → valeurs dominantes).
2. **Forces naturelles** (psychologie positive : ce que je fais facilement, ce
   pour quoi on vient me demander de l'aide…).
3. **Talents cachés** (cases : j'observe, je remarque les détails, je comprends
   les émotions, solutions originales…).
4. **Rapport aux émotions** (stress → réfléchir/agir/aide/isolement ; conflit ;
   récupération d'énergie).
5. **Compétences transférables** (organiser, écouter, expliquer, réparer,
   dessiner, négocier, programmer, cuisiner, diriger, vendre…).
6. **Profil de motivation** (apprendre, gagner, aider, créer, résoudre,
   découvrir, transmettre, protéger, construire, diriger).
7. **Freins** (peur de l'échec, manque de confiance, regard des autres,
   difficulté à choisir, organisation, concentration, procrastination).
8. **Conditions idéales de travail** (dehors/bureau/déplacement/atelier/labo ;
   avec enfants/animaux/ordinateur/mains).
9. **Styles de décision** (réfléchir longtemps / vite / demander conseil /
   intuition / liste avantages-inconvénients).
10. **Aspirations de vie** (apprendre / construire / transmettre / laisser /
    changer dans le monde).
11. **Créativité — pensée divergente** (défis : inventer un objet, 10 usages d'un
    trombone, améliorer ton école).
12. **Compétences du XXIᵉ siècle** (collaboration, communication, pensée critique,
    créativité, résolution de problèmes, numérique, adaptabilité, autonomie).
13. **Projection dans le futur** (dans 10 ans : ma journée, mon lieu, les gens,
    ce que je fais, ce que je ressens).
14. **Intelligence émotionnelle** (Goleman : conscience de soi, maîtrise,
    motivation, empathie, compétences sociales).
15. **Profil entrepreneurial** (face à un problème : j'attends / je propose / je
    prends l'initiative / j'organise ; suivre vs créer sa méthode).

### 9.2 Architecture cible (6 modules)
1. Portrait personnel (identité, valeurs, aspirations)
2. Fonctionnement cognitif (intelligences, métacognition, styles)
3. Personnalité (traits, motivation, émotions, décision)
4. Compétences & talents (forces, transférables, créativité)
5. Projection professionnelle (environnements, métiers, études, conditions)
6. Rapport personnalisé (graphiques, profils, recommandations, pistes)

### 9.3 ＋ Carte des recoupements — **relire, ne pas re-demander**
> Insight clé : plusieurs axes existent **déjà** ailleurs dans le parcours. Le
> module Orientation doit **lire le coffre** et **synthétiser**, jamais reposer
> les mêmes questions (fatigue + incohérence).

| Axe 360° | Déjà couvert par | Rôle de l'Orientation |
|---|---|---|
| Valeurs (1), aspirations (10) | **AD-05 Mes valeurs** | relire + relier aux univers |
| Émotions (4), intelligence émotionnelle (14) | **AD-04 Émotions**, AD-07 | relire, ne pas refaire |
| Métacognition, styles, fonctions exéc. | **AD-03** | pont explicite (§3.4) |
| Freins : confiance, échec, procrastination (7) | **AD-07 Reprendre confiance** | relire → reformuler en **besoins/leviers** |
| Forces (2), talents (3) | AD-03 (forces) + neuf | compléter côté orientation |
| **Vraiment neufs** : intérêts RIASEC, familles de métiers, conditions de travail (8), transférables (5), entrepreneurial (15), projection pro (13), créativité divergente (11), compétences XXIᵉ (12) | — | **cœur propre du module** |

### 9.4 ＋ Garde-fous sur cette ambition élargie
- **Anti-usine-à-gaz** : un **socle court** (l'essentiel, ~10-15 min) + des
  **modules d'approfondissement optionnels** (comme le tronc commun + modules
  d'AD-03). Jamais tout en une fois ; découpage, reprise, « je passe » / « je ne
  sais pas encore » partout. Crucial pour la fatigabilité TND.
- **Rigueur / cadrage scientifique** : RIASEC (Holland) et, éventuellement, des
  traits type Big Five = ancrages les plus solides. **Gardner, « styles
  d'apprentissage », Goleman (IE)** = cadres **populaires mais faiblement
  validés** → présentés comme **exploration ludique / préférences**, jamais comme
  mesure. Vocabulaire « pour explorer », pas « pour mesurer ».
- **Freins (axe 7) = zone sensible** : jamais un « score de faiblesses ».
  Reformulés en **besoins et leviers** (« quand je bloque, j'ai besoin de… »),
  posture d'AD-03 / AD-07. Touche l'estime de soi → toujours positif.
- **Créativité divergente (11)** : reste **ludique et auto-réflexive**, réponses
  ouvertes **stockées privées** ; **pas de scoring automatique** d'originalité
  (subjectif et hasardeux).
- **Deux audiences, un mur** : côté **ado** = *« Ma boussole d'orientation »*,
  1re personne, **privée**. La lecture **pro / conseiller / psychologue / coach /
  établissement** (mentionnée dans la vision) ne vit **pas** dans l'app ado :
  elle relève de **Les Deux Jardins**, et **rien n'est transmis sans le
  consentement explicite de l'ado** (AD-11). Un bilan 360° sur un mineur est une
  donnée très sensible.
- **Profil éclaté valorisé** : l'outil ne force jamais « une » dominante ; un
  profil qui ne « range » pas proprement est une richesse.

---

---

## 10. Cahier d'outils — version adolescent (12 outils)

> Version workbook fournie par Nawel. **Principe cardinal** : ces outils
> **n'enferment jamais dans une étiquette** — ils font émerger des **hypothèses**
> et des **pistes**. À réaliser **en plusieurs séances**, jamais tout d'un coup.
> Types : questionnaires · échelles · grilles d'observation · choix forcés ·
> exercices projectifs · **passage à l'action réel**.

| # | Outil | Type | Écran de destination |
|---|---|---|---|
| 1 | **La roue de ma vie d'ado** (10 domaines notés 0-10 + 1 action prioritaire) | échelle + action | AD-09 (quotidien) |
| 2 | **La carte de mes forces** (comprendre/créer/aider/agir/organiser) + **regard croisé** parent/prof (comparer, sans « qui a raison ») | cases + ouvertes | Orientation (forces) ↔ AD-03 |
| 3 | **Mon histoire de réussites** (3 réussites × situation/difficulté/action/ressources/résultat/apprentissage) | récit guidé | Orientation (forces par l'expérience) |
| 4 | **Le journal d'énergie** (7 jours : activités +/=/− , énergie avant/après) | grille d'observation | AD-09 / Orientation (conditions) |
| 5 | **Les familles d'intérêts** (6 familles = **RIASEC** : réaliser, rechercher, créer, aider, entreprendre, organiser) | échelle 4 niveaux | Orientation **ET-02** |
| 6 | **Mon profil d'apprentissage** (mise en situation + échelle 1-5 + « mon mode d'emploi ») | mixte | Orientation **ET-03** ↔ AD-03 |
| 7 | **Le test des environnements** (12 choix forcés + projection) | choix forcés | Orientation (conditions de travail) |
| 8 | **Mes valeurs** (20 valeurs → 10 → 5 → 3, *Spiritualité* incluse, jamais imposée) | tri progressif | **AD-05 Mes valeurs** |
| 9 | **La journée idéale dans 10 ans** (récit + repérage activités/personnes/lieux/émotions/valeurs) | projectif | Orientation (projection) |
| 10 | **Le défi des micro-expériences** (interviewer, observer, mini-projet… + fiche d'expérimentation) | passage à l'action | Orientation (relais externe) |
| 11 | **Le conseil de mes futurs moi** (moi à 1 an / 5 ans / 10 ans → 1 action cette semaine) | projectif | AD-05 / Orientation |
| 12 | **Le plan d'orientation en 4 étapes** (je me connais → j'explore → je compare → j'agis) | plan d'action | Orientation (synthèse) |

### 10.1 Synthèse ado — règle de rédaction **non-négociable**
Le portrait final (1-2 pages) **ne conclut jamais** « Tu es fait pour devenir… ».
Il formule toujours au conditionnel ouvert :
- « Ton profil semble **actuellement** attiré par… »
- « Tu pourrais **explorer**… »
- « Les environnements qui **pourraient** te convenir sont… »
- « Les prochaines **expériences utiles** seraient… »

### 10.2 ＋ Ce que ce cahier confirme / précise
- **OUTIL 8 = AD-05** : ce module donne directement le contenu de l'écran
  « Mes valeurs » (Programme 1) — tri 10→5→3 + questions de mise en lien.
- **OUTILS 2-3-4-5-6-7-9-10-12 = le module Orientation** (étape finale) ; ils
  s'appuient sur AD-03 (pont métacognition) et AD-09.
- **Passage à l'action réel** (OUTIL 10) = la vraie valeur : remplacer les
  suppositions par des micro-expériences ; c'est là que le **relais externe**
  (Onisep, L'Étudiant…) prend le relais.
- **Grilles d'observation sur plusieurs jours** (OUTIL 4) ⇒ prévoir un petit
  outil de **suivi dans le temps**, pas seulement un formulaire ponctuel.
- Tout reste **privé/chiffré** ; le **regard croisé** (OUTIL 2) et tout partage
  passent par **AD-11** (consentement), jamais automatiquement.

---

_Source : brainstorm, version développée, vision 360° & cahier d'outils ado de
Nawel (Educa Typique) + compléments d'implémentation. À relire et reformuler
avec les mots de Nawel avant codage, comme pour AD-03._
