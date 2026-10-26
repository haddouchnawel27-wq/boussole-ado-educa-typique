# Cahier des charges fonctionnel complet — Cap Educa & Les Deux Jardins

Version 2.0 — reprise intégrale du projet depuis le début, à jour au 31/07/2026
Destinataires : Code, Codex, Cowork, Design
Produits concernés : Cap Educa (application familiale) et Les Deux Jardins (application praticienne), avec le module Étincelle (orientation) en extension du Parcours Ado

Ce document remplace et complète la version 1.0 déjà transmise. Il ne supprime aucune décision déjà actée : il les reprend telles quelles, y ajoute le module Étincelle construit depuis, l'inventaire du contenu déjà existant et réutilisable, l'état technique réel du chantier à ce jour, et une liste consolidée de toutes les décisions encore ouvertes. C'est la version à proposer au Codage.

---

## 0. Contexte et intention du projet

Cap Educa et Les Deux Jardins ne sont pas des applications isolées : elles s'inscrivent dans un écosystème plus large porté par Nawel Haddouch (psycho-praticienne, neuropédagogue), sous plusieurs marques — Educa Typique (grand public, familles), Les Deux Jardins / Jannat Al Qouloub (cabinet psycho-spirituel praticienne), Le Jardin des Cœurs (version non confessionnelle du même contenu clinique).

Le principe directeur de tout l'écosystème, formulé par Nawel elle-même et à garder en tête pour toute décision produit : *« Une boussole ne dit pas quel chemin sera facile. Elle indique simplement le nord. »* Concrètement, pour Code/Cowork/Design, cela se traduit par deux exigences pratiques constantes dans tout ce cahier des charges :

- ne jamais sacrifier la rigueur clinique ou la confidentialité des personnes accompagnées pour aller plus vite ;
- ne jamais présenter un outil comme plus certain qu'il ne l'est (pas de diagnostic, pas de score alarmiste, des hypothèses toujours formulées avec prudence).

Deux produits distincts, une seule architecture de confidentialité :

- **Cap Educa** — application familiale grand public (parents, enfants, adolescents), utilisable en autonomie, sans praticienne.
- **Les Deux Jardins** — application strictement réservée aux praticiennes autorisées, qui héberge l'accompagnement professionnel et reprend certains outils migrés depuis Cap Educa.

Les deux produits ne partagent aucune base de données commune et ne doivent jamais mélanger les usages familial et professionnel (voir section 2).

D'autres applications existent dans l'écosystème plus large de Nawel (Al Mizan Al Qouloub / Le Point du Jour / La Balance des Cœurs pour les auto-entrepreneuses, Mon Chargé de Com, Chef de Chantier pour un adolescent accompagné en particulier) : elles sont mentionnées en section 12 pour mémoire, mais ne font pas l'objet du détail fonctionnel de ce document, qui se concentre sur Cap Educa et Les Deux Jardins.

---

## 1. Vue d'ensemble de l'écosystème applicatif

| Application | Public | Statut technique au 31/07 | Dépôt / déploiement |
|---|---|---|---|
| **Cap Educa** (nom encore « Boussole » dans le code) | Familles (parents, enfants, ados) | En ligne, grosse boîte à outils déjà fonctionnelle (Time Timer, séquenceur, emploi du temps visuel, jetons, thermomètre des émotions, carnet de pensées Beck, respiration, suivi d'humeur, trousse anti-crise, plan de sécurité, gratitude) + outils pro encore présents à migrer (Fiches des jeunes, Journal ABC, Dossier de suivi, Modèles professionnels) | `haddouchnawel27-wq/boussole-ado-educa-typique`, Vercel |
| **Les Deux Jardins** (« Le Fil des Deux Jardins ») | Praticiennes | Cockpit praticienne fonctionnel (connexion, anamnèse, questionnaires, dossier actif, pré-synthèse, objectifs suggérés) ; dernier commit prêt mais non poussé faute de jeton GitHub (voir section 12) | `les-deux-jardins-app/` dans le même dépôt |
| **Chef de Chantier** | Un adolescent accompagné en particulier (bêta-testeur) | Déployé, dérivé personnalisé des outils d'autorégulation de Cap Educa | même dépôt |
| **Mon Chargé de Com** | Nawel elle-même (assistant réseaux sociaux) | Déployé, stable, complet | même dépôt |
| **Al Mizan Al Qouloub / Le Point du Jour / La Balance des Cœurs** | Consultantes et auto-entrepreneuses en accompagnement | Gabarits statiques livrés, application cible non commencée | chantier distinct, voir section 12 |

Le nom **Cap Educa** est le nom produit validé pour l'application familiale, mais n'est pas encore présent dans le code (qui utilise toujours « Boussole » / « Educa Typique »). C'est une décision en attente, listée en section 12 et 15.

---

## 2. Décisions non négociables

### Cap Educa

Cap Educa est une application strictement familiale.
Elle conserve trois portes :

1. Parents / enfants
2. Parents / adolescents
3. Adolescents 13–17 ans

Il ne doit plus exister :

- de profil « praticienne » ;
- de porte `pro` ;
- de code praticienne ;
- d'outils de suivi professionnel ;
- de dossiers clients ;
- de données Supabase liées à un accompagnement professionnel.

Une licence payante Cap Educa est une licence familiale, jamais une « licence pro ».

Nom technique recommandé :

```text
entitlement = demo | family_full
```

Ne plus utiliser `licencePro` pour Cap Educa.

### Les Deux Jardins

Les Deux Jardins est exclusivement réservé aux praticiennes autorisées.
Il regroupe :

- les dossiers des accompagnées ;
- les observations ;
- les questionnaires professionnels ;
- la double lecture parent/adolescent ;
- les séances ;
- les formulations ;
- les objectifs ;
- les restitutions ;
- les outils professionnels migrés depuis Cap Educa.

### Migration

Les quatre outils professionnels doivent être fonctionnels dans Les Deux Jardins avant leur retrait définitif de Cap Educa :

1. Fiches des jeunes
2. Journal ABC
3. Dossier de suivi
4. Modèles professionnels

Aucune suppression avant validation de la destination.

---

## 3. Principes communs d'expérience utilisateur

Toutes les interfaces doivent respecter les principes suivants :

- phrases courtes ;
- une consigne à la fois ;
- sauvegarde automatique ;
- possibilité d'interrompre et de reprendre ;
- progression visible sans pression ;
- aucun défilement infini ;
- aucun classement moral ;
- aucun diagnostic automatique ;
- aucun résultat alarmiste ;
- navigation clavier ;
- champs correctement annoncés aux lecteurs d'écran ;
- contraste suffisant ;
- fonctionnement à 200 % de zoom ;
- animations désactivables ;
- mode sombre ou soir ;
- bouton « Quitter pour aujourd'hui ».

### Garde-fou écran

Présent dans les espaces familiaux :

- compteur de temps visible ;
- rappel doux après une durée définie ;
- mode soir configurable par le parent ;
- après l'heure choisie, seuls restent accessibles les outils apaisants ;
- récompenses liées aux actions hors écran ;
- aucune sanction si une routine n'est pas réalisée ;
- aucune série culpabilisante de type « streak perdu ».

Exemple de message :

> Tu as suffisamment avancé pour aujourd'hui. Choisis maintenant quelque chose qui te fait du bien loin de l'écran.

---

## 4. Cap Educa — écrans communs

### CE-01 — Activation familiale

Fonctions :

- saisir ou restaurer une licence ;
- afficher le statut de l'accès ;
- permettre un mode démonstration limité ;
- ne jamais exposer le secret de validation dans le JavaScript public.

Critère d'acceptation :

> Une personne ne peut pas débloquer l'application en modifiant simplement une variable dans son navigateur.

### CE-02 — Choix de la porte

Trois boutons uniquement :

- Parent d'un enfant
- Parent d'un adolescent
- Adolescent

Aucune porte `pro`.

### CE-03 — Présentation de la confidentialité

Avant la première utilisation :

- expliquer où sont conservées les données ;
- expliquer ce qui est privé ;
- expliquer comment exporter ou supprimer ;
- préciser les limites de la confidentialité sur un appareil partagé ;
- recueillir l'accord nécessaire.

### CE-04 — Tableau de bord

Affiche :

- parcours en cours ;
- dernière activité ;
- outils enregistrés ;
- bibliothèque adaptée au profil ;
- accès aux réglages ;
- temps passé aujourd'hui.

### CE-05 — Réglages et données

Fonctions :

- modifier le mode Universel/Islamique ;
- modifier le mode soir ;
- exporter ses données ;
- supprimer ses données ;
- changer le code local ;
- consulter la politique de confidentialité.

---

## 5. Parcours Parent d'adolescent

Nom : **Comprendre mon ado — Rester en lien pendant que tout change**

Public : parents d'adolescents de 11 à 18 ans.

### PA-01 — Accueil

Présente : la promesse du parcours · les neuf étapes · une durée indicative · le rappel qu'il ne s'agit pas d'un diagnostic.

Question d'entrée : *« Qu'est-ce qui te préoccupe le plus actuellement ? »*

Choix possibles : communication · émotions · opposition · sommeil · écrans · école · relations · harcèlement · TND · autre.

Cette réponse sert uniquement à proposer un ordre, pas à étiqueter la situation.

### PA-02 — Ce qui change chez mon adolescent

Contenus : cerveau · corps · sommeil · émotions · autonomie · pairs · pensée · valeurs.

Outil : **Carte des transformations**

Sortie : ce qui semble nouveau · ce qui reste stable · ce qui inquiète réellement le parent.

### PA-03 — Observer sans interpréter

Journal de 14 jours : sommeil · alimentation · école · relations · hygiène · humeur · écrans · événements · moments où cela va bien.

Chaque saisie distingue :

```text
FAIT OBSERVÉ
INTERPRÉTATION DU PARENT
QUESTION À EXPLORER
```

Aucun score clinique.

### PA-04 — Comprendre derrière le comportement

Outil : **Ce que je vois / Ce que cela pourrait signifier / Ce que je dois vérifier**

Hypothèses proposées avec prudence : fatigue · surcharge · honte · anxiété · besoin d'autonomie · frustration · difficulté exécutive · conflit · événement de vie.

Toujours afficher : *« Une hypothèse aide à poser une question. Elle ne prouve pas ce que vit ton adolescent. »*

### PA-05 — Ma régulation de parent

Outils : thermomètre parental · pause avant de répondre · mes déclencheurs · réparer après une dispute · distinguer l'erreur, le comportement et la personne.

### PA-06 — Mieux dialoguer

Contenus : écoute active · reformulation · questions ouvertes · phrase en « je » · accueil du silence · discussion côte à côte · communication écrite.

Outil : **Préparer une conversation importante**

Champs : fait observé · inquiétude · question ouverte · réaction à éviter · phrase pour laisser la porte ouverte · moment choisi.

### PA-07 — Poser un cadre évolutif

Outils : mes trois non-négociables · ce qui peut être négocié · notre accord familial · conséquence prévue · date de révision.

Une règle doit comporter :

```text
Pourquoi elle existe
Ce qui est attendu
Ce qui reste négociable
Ce qui arrive si elle n'est pas respectée
Quand elle sera réévaluée
```

### PA-08 — Écrans, harcèlement et sécurité numérique

Outils : pacte numérique familial · signes possibles de harcèlement · conservation des preuves · que faire sans punir la victime · images intimes, pression et diffusion · personnes et services ressources.

Aucun conseil juridique trop précis sans source datée.

### PA-09 — Adapter en présence d'un TND

Contenus distincts : TDAH · TSA · troubles dys · profils associés · surcharge · fonctions exécutives · camouflage · aménagements.

Outil : **Ce qui lui demande un effort invisible / Ce qui l'aide réellement**

Ne jamais attribuer un « âge émotionnel » à l'adolescent.

🔗 *Point d'articulation avec le module Étincelle (section 7)* : la métacognition explorée dans Étincelle (comment l'ado pense et apprend, pas seulement ce qu'il aime) doit être cohérente avec le contenu de cet écran — un même adolescent ne doit jamais recevoir un message contradictoire entre PA-09 et le profil qu'il découvre de son côté dans Étincelle.

### PA-10 — Quand demander de l'aide ?

Les cinq repères : durée · intensité · rupture · retentissement · souffrance. Ils servent à s'orienter, pas à trancher.

Outil : **Préparer une demande d'accompagnement**

Résumé exportable : faits observés · début des changements · événements récents · domaines touchés · ressources · actions déjà essayées · questions du parent.

### PA-11 — Synthèse

Le parent repart avec : trois priorités · une action immédiate · une conversation à préparer · une adaptation à essayer · une demande d'aide facultative.

---

## 6. Parcours Ado — « Mode d'emploi de Moi »

Public : adolescents de 13 à 17 ans.

### AD-01 — Mon espace et mes droits

Avant toute question : expliquer que l'espace appartient à l'adolescent · expliquer ce qui est enregistré · expliquer que le parent n'accède pas automatiquement aux réponses · expliquer que l'application ne pose aucun diagnostic · expliquer les limites techniques d'un appareil partagé · permettre un code local différent de celui du parent.

Message : *« Tu choisis ce que tu veux écrire et ce que tu souhaites partager. »*

### AD-02 — Comment je vais aujourd'hui

Micro-évaluation : énergie · humeur · stress · sommeil · besoin principal.

Durée maximale : deux minutes. Pas de score global de santé mentale.

### AD-03 — Mode d'emploi de Moi

Bilan métacognitif central : attention · mémoire · organisation · démarrage des tâches · impulsivité · sensorialité · communication · apprentissage · relations · fatigue · forces · besoins.

Sortie privée : **Mon Mode d'emploi de Moi**

Sections : ce qui est facile pour moi · ce qui me coûte · ce qui me surcharge · ce qui m'aide · comment me parler · comment m'aider sans faire à ma place.

🔗 *Point d'articulation avec le module Étincelle (section 7)* : la métacognition est le point de jonction explicite entre cet écran et le bloc « style d'apprentissage » d'Étincelle — à terme, les deux ne devraient pas dupliquer les mêmes questions, mais se renvoyer l'un à l'autre (« tu as déjà répondu à cela dans Mode d'emploi de Moi, veux-tu le reprendre ici ? »).

### AD-04 — Mes émotions

Outils : météo intérieure · roue des émotions · intensité · déclencheurs · besoins · stratégies d'apaisement · place particulière de la honte.

La honte n'est ni supprimée ni réduite à une « émotion secondaire ».

### AD-05 — Mes valeurs

Outil « Découvre tes valeurs » : choisir dix valeurs · construire son Top 5 · situations où une valeur a été blessée · moments de fierté · personnes admirées · qualités appréciées · actions cohérentes avec ses valeurs.

La foi est une valeur possible, jamais obligatoire.

🔗 *Point d'articulation avec le module Étincelle (section 7)* : le bloc « Valeurs » et le « portrait chinois » d'Étincelle se greffent naturellement ici plutôt que de constituer un écran séparé.

### AD-06 — Mes relations

Outils : les trois regards · ce que je ressens · ce que l'autre pourrait vivre · perspective extérieure · poser une limite · demander une explication · dire non · repérer une relation dangereuse.

### AD-07 — Reprendre confiance

Contenus : erreur, échec et identité · perfectionnisme · comparaison · efforts invisibles · discours intérieur · petit défi réaliste · preuve de progression.

### AD-08 — Ma sécurité numérique

Contenus : harcèlement · cyberharcèlement · pression · sextorsion · diffusion d'images · manipulation · adulte ou mineur inquiétant · conserver une preuve · demander de l'aide.

Bouton : *« Je veux demander de l'aide sans devoir tout expliquer maintenant. »*

### AD-09 — Mon quotidien et mon avenir

Outils : ma semaine réaliste · sommeil · organisation · argent · autonomie quotidienne · forces · intérêts · orientation · aujourd'hui / dans cinq ans.

Remplacer « zone de génie » par : *« Ma zone de forces, d'intérêts et de progression. »*

🔗 *Point d'articulation avec le module Étincelle (section 7)* : cet écran ne contenait jusqu'ici que « forces · intérêts · orientation » en une ligne — le module Étincelle lui donne un contenu détaillé et structuré. **Étincelle est fonctionnellement le développement complet de AD-09.**

### AD-10 — Ma demande d'accompagnement

Champs : ce qui me préoccupe · depuis quand · ce que j'ai essayé · ce qui m'aide · ce que je ne veux pas · avec qui je voudrais parler · ce que j'accepte de partager.

Sortie : **Carte de demande d'aide**

### AD-11 — Centre de partage

Chaque élément possède une visibilité :

```text
PRIVÉ
À PARTAGER AVEC UNE PRATICIENNE
À PARTAGER AVEC MON PARENT
À PARTAGER AVEC LES DEUX
```

L'adolescent valide chaque partage. Le parent ne peut pas ouvrir les réponses brutes.

### Élément exclu de la version 1

Le plan de sécurité personnel n'est pas intégré tant que la décision clinique n'est pas prise.
La version 1 ne contient pas de dépistage suicidaire automatisé ni d'alerte secrète.

---

## 7. Module Étincelle — Orientation et intelligences multiples (extension de AD-09)

### 7.0 — Origine et statut

Ce module est né d'un brainstorm de Nawel avec une autre IA (31/07/2026), synthétisé et structuré dans `Module_Etincelle_Orientation_IntelligencesMultiples.md`. Il enrichit fortement AD-09 (qui ne contenait jusque-là que « forces · intérêts · orientation » en une ligne), se relie à AD-05 (Mes valeurs) et à AD-03 (Mode d'emploi de Moi) via la métacognition. **Statut : direction validée par Nawel, détail fonctionnel prêt pour transmission à Code, nom définitif encore en discussion (voir section 15).**

### 7.1 — Idée d'ensemble et principe non négociable

Un module ludique d'introspection pour adolescents, en particulier neuroatypiques, pour les aider à se comprendre et comprendre leur fonctionnement — explorer leurs différentes intelligences (notamment celles peu valorisées à l'école), les relier à leurs valeurs, développer l'esprit critique et les habiletés sociales, améliorer l'estime de soi, et préparer une orientation professionnelle choisie et sereine.

**Principe non négociable** (cohérent avec les principes UX de la section 3) : jamais de situation d'échec. Si l'ado ne sait pas ce qu'il veut ou n'a pas d'intérêt clair, on creuse en douceur — feedback positif systématique, même quand une réponse est incertaine. Pas de score alarmiste, pas de classement moral, pas de diagnostic automatique.

### 7.2 — Architecture en quatre blocs, séquencés

Ordre de séquençage retenu (confirmé par un second regard indépendant lors du brainstorm de Nawel) : chaque section se nourrit des réponses précédentes, pour aboutir à un profil global combiné.

**ET-01 — Questionnaire Intelligences multiples**

Test de 32 questions (4 par intelligence, sur 8 catégories), déjà entièrement rédigé par Nawel et disponible sur Canva (« les intelligences multiples ») : linguistique · logico-mathématique · visuo-spatiale · kinesthésique · musicale · interpersonnelle · intrapersonnelle · naturaliste.

Cotation : 0 = pas moi, 1 = un peu, 2 = souvent, 3 = carrément moi. Score maximum 12 par intelligence. Niveaux : 0-3 émergent, 4-6 en développement, 7-9 solide, 10-12 très marqué.

Sortie : tableau récapitulatif avec, pour chaque intelligence, le score, le niveau, ce que cela dit de l'ado, des pistes scolaires concrètes et des idées de métiers — **contenu déjà rédigé pour les 8 intelligences, à reprendre tel quel plutôt qu'à réinventer** (voir section 11).

Note de rigueur scientifique, à respecter dans la présentation à l'ado : la théorie de Gardner est un cadre pédagogique populaire et utile pour l'auto-exploration, mais n'a pas de validation empirique forte en psychométrie — vocabulaire de présentation : « pour t'aider à explorer », jamais « pour mesurer ton intelligence ».

Peut être rempli en auto-évaluation, en duo (ado + parent), ou en groupe.

**ET-02 — Questionnaire Intérêts professionnels (RIASEC / Holland)**

Contrairement à Gardner, le modèle de Holland (intérêts réaliste/investigateur/artistique/social/entreprenant/conventionnel) est bien établi en psychologie de l'orientation — c'est le socle scientifique à privilégier pour la partie « compatibilité métiers ».

Questions de base : préférence travail en équipe/seul · logique ou expression créative · tâches claires ou cadre flexible · planifier ou improviser · activités qui font perdre la notion du temps · travailler avec des idées/objets/personnes · réaction aux instructions strictes.

Questions complémentaires identifiées le 31/07 : ce qui compte le plus dans un futur métier (sécurité de l'emploi / liberté créative / impact social / salaire) · goût du défi et des problèmes complexes vs tâches routinières et organisées · environnement de travail idéal (bureau / atelier / laboratoire / terrain).

**ET-03 — Style d'apprentissage**

Questions : apprentissage par l'écoute / la démonstration / l'essai · mémorisation par relecture / verbalisation / mise en pratique · organisation du temps (tâches structurées ou flexibles) · préférence terrain / lecture-documentation / échange avec d'autres.

Contenu déjà rédigé et disponible sur Canva (« Profils d'apprentissages ») : profils visuel/auditif/kinesthésique (versions enfant et parent), adapté par tranche d'âge.

**ET-04 — Métacognition**

Identifié par Nawel elle-même comme le vrai plus clinique du module, à ne jamais traiter comme une section parmi d'autres : comprendre **comment** l'ado pense et apprend, pas seulement ce qu'il aime. Exemple clé : un ado qui pense « en images », a besoin de concret, a du mal à prendre des notes ou à faire plusieurs choses à la fois, risque de se retrouver en difficulté dans un amphi universitaire — information cruciale pour orienter vers des filières compatibles avec son fonctionnement réel, pas seulement ses goûts.

C'est le pont explicite avec AD-03 (Mode d'emploi de Moi) et PA-09 (adaptations TND) — voir renvois en section 6.

Contenu déjà rédigé et disponible sur Canva (« Profils d'apprentissages ») : autonomie, auto-régulation, auto-réflexion par tranche d'âge, avec exemples concrets et volet psychoéducation.

**ET-05 — Profil combiné et restitution visuelle**

À l'issue des quatre blocs, un profil global combiné est restitué à l'ado (pas un résultat isolé de chaque test). Piste de format de restitution : un graphique visuel de type radar/étoile, sur le même principe que l'outil « Le Radar des Profils » déjà conçu par Nawel (voir section 11) — à adapter d'un radar de fonctionnement global (6 axes parents) vers un radar du profil Étincelle (intelligences/intérêts/style/métacognition).

Vigilance particulière pour le public neuroatypique : un ado TND peut avoir un profil « éclaté » (fort dans plusieurs intelligences très différentes, ou au contraire très ciblé) — le module doit résister à la tentation de faire émerger « une » famille de métiers dominante à tout prix.

**ET-06 — Portrait chinois**

Outil complémentaire ludique et détendu, à proposer en entrée de parcours plutôt qu'en fin — série de questions projectives (*si tu étais un animal / un paysage / une couleur / une saison / un objet, lequel serais-tu, et pourquoi ?*), utile pour un ado qui bloquerait sur des questions frontales. Se greffe naturellement sur AD-05 (Mes valeurs).

### 7.3 — Familles de métiers explorées

Douze domaines, chacun avec 3 à 5 questions d'auto-positionnement (jamais des tests de compétence, toujours formulées en « aimes-tu / te sens-tu à l'aise / es-tu motivé ») : communication/marketing · santé · ingénierie · métiers manuels (artisanat, bâtiment, mécanique) · art · commerce · finance · juridique · culinaire · éducation · environnement/développement durable (signalé par Nawel comme préoccupation fréquente chez les jeunes actuels) · informatique/numérique.

### 7.4 — Relais externes (à recommander, pas à répliquer)

Le module n'a pas vocation à remplacer les ressources professionnelles existantes, seulement à préparer l'ado à s'y présenter avec une meilleure connaissance de lui-même. Ressources identifiées à recommander en relais : L'Étudiant (tests métier/étude/psychologiques/emploi, page « Orientation : nos conseils ») · Onisep · Ton avenir · Job Teaser et plateformes spécialisées profils neuroatypiques · une application Google Play (130+ tests) · Hopteo · Hello Charly · Orientoi · Avneer · ORIENTA QUEST (jeu de l'oie 63 cases, mécanique à rapprocher de l'esprit ludique du portrait chinois ET-06 plutôt qu'à copier) · Alis Alberta · test Walt (CCI) · Happy HP Family (test 9 intelligences Gardner) · Sandrine Laurent.

⚠️ **Point de vigilance nommage, à trancher avant tout développement** : un blog existant s'appelle déjà « Étincelle » et propose des outils ludiques sur les intelligences multiples pour ados. À vérifier avant de figer « Étincelle » comme nom de marque du module ou de l'application — voir piste alternative « Les Octufuns » en section 11, et décision à trancher en section 15.

⚠️ **Point de vigilance vocabulaire, distinct du point ci-dessus** : un autre document déjà existant de Nawel (`questionnaires_orientation_TND_consultantes_enfant_ado_adulte.docx`, voir section 11) s'appelle aussi « questionnaire d'orientation », mais il s'agit d'une orientation vers un bilan/professionnel de santé (repérage clinique de TND), pas d'une orientation professionnelle. Les deux vocabulaires (« orientation clinique » vs « orientation professionnelle/scolaire ») doivent rester clairement distincts dans toute la communication et l'interface, pour éviter toute confusion entre les deux outils.

### 7.5 — Critères d'acceptation spécifiques au module Étincelle

- Aucun résultat ne désigne un seul métier ou une seule filière comme « la bonne réponse ».
- Un profil « éclaté » ou atypique reçoit le même niveau de valorisation qu'un profil « net ».
- Le vocabulaire de présentation distingue explicitement ce qui relève d'un cadre scientifiquement validé (RIASEC/Holland) de ce qui relève d'un outil ludique d'auto-exploration (Gardner).
- Aucune confusion d'interface entre ce module (orientation professionnelle/scolaire) et l'outil clinique de repérage TND existant par ailleurs.

---

## 8. Les Deux Jardins — parcours professionnel

### LDJ-01 — Connexion

Exigences : compte individuel · aucun compte partagé · mot de passe robuste · récupération sécurisée · authentification multifacteur avant mise en service réelle.

La CNIL recommande la MFA lorsque des données sensibles sont traitées. [Recommandation CNIL sur l'authentification multifacteur](https://www.cnil.fr/fr/recommandation-mfa)

### LDJ-02 — Cockpit

Affiche : accompagnées actives · prochaines séances · actions en attente · consentements à renouveler · alertes administratives · accès rapide aux dossiers.

Aucune donnée détaillée sur la page publique.

### LDJ-03 — Nouvelle accompagnée

Données minimales : initiales ou pseudonyme · tranche d'âge · praticienne responsable · responsable légal si nécessaire · date d'entrée · consentements · motif général.

Éviter le nom complet tant qu'il n'est pas indispensable.

### LDJ-04 — Consentement

Enregistrer : personne ayant consenti · date · version du document · finalités acceptées · limites de confidentialité expliquées · autorisations de partage · retrait éventuel.

Pour certains traitements fondés sur le consentement concernant les moins de 15 ans, la CNIL rappelle la nécessité d'un accord conjoint du mineur et du parent. Une validation juridique doit déterminer précisément ce qui s'applique au service. [CNIL — consentement des mineurs](https://www.cnil.fr/fr/recommandation-4-rechercher-le-consentement-dun-parent-pour-les-mineurs-de-moins-de-15-ans)

### LDJ-05 — Dossier principal

Onglets : Accueil et consentement · Anamnèse · Demande du parent · Demande de l'adolescent · Évaluations · Ligne de vie · Formulation · Objectifs · Séances · Outils envoyés · Restitutions · Archives.

### LDJ-06 — Double recueil

Deux espaces séparés :

**Regard du parent** : observations · attentes · difficultés · événements · ressources.

**Regard de l'adolescent** : vécu · priorités · besoins · objectifs · éléments partageables.

Ne jamais fusionner automatiquement les réponses.

### LDJ-07 — Comparaison des perceptions

Affichage en trois colonnes : Parent | Adolescent | Points à explorer

Terminologie obligatoire : *« La comparaison des deux perceptions constitue une donnée particulièrement utile. »*

Ne jamais afficher : « Le parent a raison » / « L'adolescent minimise » / « Incohérence détectée ».

### LDJ-08 — Ligne de vie

Événements : famille · santé · école · séparation · deuil · déménagement · diagnostic · harcèlement · relation · changement de traitement · autre événement significatif.

### LDJ-09 — Journal ABC professionnel

Champs : date · contexte · antécédent observable · comportement observable · conséquence · intensité · durée · retour au calme · fonction possible · éléments protecteurs.

Les faits et les hypothèses doivent être visuellement séparés.

### LDJ-10 — Formulation

Sections : faits établis · perception du parent · perception de l'adolescent · facteurs déclenchants · facteurs de maintien possibles · ressources · hypothèses · points à évaluer · orientations recommandées.

### LDJ-11 — Objectifs

Trois catégories : objectifs du parent · objectifs de l'adolescent · objectifs partagés.

Chaque objectif comporte : indicateur observable · première action · date de révision · personne responsable.

### LDJ-12 — Séance

Champs : objectif · participants · éléments apportés · intervention · outil utilisé · réponse observée · décision · prochain pas · orientation.

### LDJ-13 — Bibliothèque professionnelle

Contient : Fiches des jeunes · Journal ABC · Dossier de suivi · Modèles professionnels · questionnaire parent · questionnaire adolescent · Mode d'emploi de Moi professionnel · harcèlement · TND · émotions · valeurs · confiance · organisation · orientation · communication parent-adolescent.

La praticienne sélectionne les outils. Elle ne débloque pas toute la bibliothèque par défaut.

### LDJ-14 — Restitution

Trois documents possibles : restitution parent · restitution adolescent · restitution partagée.

Une restitution ne doit contenir que les éléments autorisés pour son destinataire.

### LDJ-15 — Export, archive et suppression

Fonctions : exporter un dossier · archiver · supprimer selon la politique de conservation · tracer l'action · retirer les accès associés.

La durée de conservation doit être définie avant le lancement. Elle ne doit pas être inventée par Code.

---

## 9. Confidentialité et sécurité

### Cap Educa

Principe : données familiales locales.

Exigences : namespaces séparés · espace Ado chiffré avec code local · aucun mot de passe enregistré en clair · aucun contenu sensible dans les URL · aucun contenu personnel dans les journaux techniques · aucun transfert automatique vers Les Deux Jardins · export explicite uniquement · suppression complète accessible.

Namespaces recommandés :

```text
capEduca.parentEnfant.*
capEduca.parentAdo.*
capEduca.ado.*
capEduca.settings.*
capEduca.entitlement.*
```

Le passage de `boussole.*` vers `capEduca.*` doit conserver les données existantes.

### Les Deux Jardins

Exigences minimales Supabase : authentification obligatoire · RLS sur toutes les tables · chaque dossier lié à `auth.uid()` de la praticienne · aucun accès anonyme aux données · pièces jointes dans un bucket privé · liens temporaires signés · journalisation des exports et suppressions · sauvegardes testées · séparation des environnements développement et production · aucune donnée réelle dans l'environnement de test · MFA avant utilisation réelle.

Test RLS obligatoire :

> Une praticienne A ne peut ni lire, ni modifier, ni deviner l'existence du dossier d'une praticienne B.

### Point juridique bloquant avant production

Il faut déterminer si les données hébergées dans Les Deux Jardins entrent dans le champ des données de santé recueillies lors d'activités de prévention, de soins ou de suivi social ou médico-social. Si oui, l'hébergement doit répondre au cadre HDS ; un projet Supabase ordinaire ne doit pas être supposé conforme sans vérification. [Agence du Numérique en Santé — certification HDS](https://esante.gouv.fr/produits-services/hds)

Décision nécessaire avant l'accueil de vraies accompagnées :

```text
HDS applicable ?
OUI / NON / AVIS JURIDIQUE EN COURS
```

Tant que ce point n'est pas validé, Les Deux Jardins reste en test avec des données fictives.

---

## 10. Modes Universel et Islamique

Le mode est une couche éditoriale, pas une base de données différente.

**Mode Universel** : aucune section islamique obligatoire · aucun verset ou hadith affiché · aucun champ spirituel requis · vocabulaire neutre.

**Mode Islamique** — ajouts facultatifs : foi et valeurs · sabr · shukr · tawakkul · sens · ressources spirituelles · rappels validés.

Règles : aucune religiosité notée · aucune difficulté transformée en faute morale · aucune source non vérifiée · bascule réversible à tout moment · la fonction de l'outil reste identique.

Chaque contenu religieux doit comporter dans sa source interne :

```json
{
  "source_type": "coran|hadith|commentaire",
  "reference": "...",
  "verification_status": "verified|pending|excluded",
  "verified_by": "...",
  "verified_at": "..."
}
```

Ce même principe (universel par défaut, spirituel en option jamais l'inverse) est appliqué de façon cohérente dans le reste de l'écosystème de Nawel, notamment sur le chantier distinct Al Mizan Al Qouloub/Le Point du Jour (voir section 12).

---

## 11. Contenu déjà existant à réutiliser (inventaire Canva, 31/07/2026)

Avant de faire développer du contenu neuf par Cowork/Design, une recherche dans l'espace Canva de Nawel a permis de retrouver du contenu déjà rédigé, directement réutilisable pour tout ou partie du module Étincelle et au-delà. **Consigne pour Cowork : vérifier systématiquement cette liste avant de rédiger un nouveau contenu clinique ou pédagogique pour Cap Educa.**

| Document Canva | Contenu | Réutilisation prévue |
|---|---|---|
| « les intelligences multiples » | Test 32 questions déjà rédigé (4/intelligence, 8 catégories), scoring, niveaux, tableau récap, pistes scolaires et idées de métiers déjà écrites par intelligence, mini-plan d'action | Cœur du bloc ET-01 du module Étincelle — à reprendre tel quel ou à adapter à l'interface app |
| « les profils d'intelligences » | Contient la mention « Les Octufuns » | Piste de nom alternatif pour le module ou le bloc intelligences multiples, si « Étincelle » pose un problème de nommage (voir section 7.4 et section 15) |
| « Profils d'apprentissages » | Contenu détaillé profils visuel/auditif/kinesthésique (versions enfant/parent), métacognition, autonomie, auto-régulation, auto-réflexion par tranche d'âge, volet psychoéducation | Matière première pour ET-03 (style d'apprentissage) et ET-04 (métacognition) |
| « Le Radar des Profils » | Outil de visualisation déjà conçu pour les parents : graphique étoile à 6 axes (langage/communication, motricité, attention/fonctions exécutives, apprentissages, relations sociales, autonomie), noté de 1 à 5, pensé pour un suivi tous les 6 mois | Piste de format de restitution visuelle pour ET-05 (profil combiné Étincelle), à adapter d'un radar de fonctionnement global vers un radar de profil d'orientation |
| « questionnaires_orientation_TND_consultantes_enfant_ado_adulte.docx » | Outil clinique complet et distinct (versions enfant/ado/adulte, échelle 0-3, 6-8 domaines par version), à visée de repérage clinique de TND, non diagnostique | Outil séparé, à ne pas confondre avec Étincelle — pertinent pour Les Deux Jardins (bibliothèque professionnelle LDJ-13) plutôt que pour Cap Educa |
| « Questionnaire-intelligences-multiples » (variante) | Document lié à Potentiel au TOP (contact@potentielautop.com) | À vérifier — contenu potentiellement sous droits tiers, ne pas réutiliser sans clarification (voir section 15) |

---

## 12. État technique actuel du chantier (au 31/07/2026)

### Les Deux Jardins — « Le Fil des Deux Jardins »

- Dépôt : `haddouchnawel27-wq/boussole-ado-educa-typique`, branche `claude/fil-deux-jardins-propre`, sous-dossier `les-deux-jardins-app/`.
- Dernier commit poussé confirmé : `4a0d752` (« Les Deux Jardins : parcours praticienne relié »).
- Un commit local plus récent (`730e169` — dossier actif partout, navigations synchronisées, pré-synthèse, objectifs suggérés) est prêt, vérifié (`tsc --noEmit` propre, `vitest run` 17/17), mais **non poussé faute de jeton d'accès GitHub à jour**. Action requise : Nawel doit créer un nouveau jeton d'accès personnel (permission « Contents: Read and write », scope limité au dépôt) pour débloquer le push.
- Un blocage de connexion sur l'aperçu Vercel (« E-mail ou mot de passe incorrect ») a été diagnostiqué et résolu le 28/07 : la cause réelle était un mot de passe périmé côté praticienne (compte et configuration Supabase confirmés sains), pas un bug de code ou de déploiement. Reste à faire, non urgent : ajouter un vrai flux « mot de passe oublié » en self-service.
- Reste à tester de bout en bout depuis la résolution du blocage : le parcours complet Accueillir → Évaluer → Formuler → Cibler → Restituer.

### Cap Educa (« Boussole »)

- Décision de nommage en attente : le nom « Cap Educa » n'est pas encore dans le code (qui utilise toujours « Boussole »/« Educa Typique »). À trancher avant le développement du hub unifié.
- Bonne nouvelle technique déjà repérée par Codex : Boussole dispose déjà d'un Time Timer visuel et d'un séquenceur — à mutualiser avec les besoins du chantier Le Point du Jour plutôt qu'à reconstruire.
- Migration `boussole.v1.*` → `capEduca.v1.*` : pas commencée, à planifier avec Codex, en conservant les données existantes (voir section 9).

### Autres applications de l'écosystème (hors périmètre détaillé de ce cahier des charges, mentionnées pour cohérence)

- **Le Point du Jour / Al Mizan Al Qouloub / La Balance des Cœurs** — chantier distinct destiné aux auto-entrepreneuses en accompagnement (positionnement « produit d'appel » léger et gratuit, avec pont doux vers l'écosystème plus large). Principe de conception : universel par défaut, spirituel en option — cohérent avec la section 10 de ce document. Architecture cible déjà cartographiée (Accueil à 3 portes, Questionnaire → Synthèse, Le Sauveteur, Boîte à Outils, historique local), gabarits statiques déjà livrés (Planificateur Hebdomadaire Praticienne, Planificateur Hebdomadaire, La Balance des Cœurs, Le Point du Jour), développement de l'application réelle non commencé.
- **Mon Chargé de Com** — assistant réseaux sociaux pour Nawel elle-même, déployé et stable.
- **Chef de Chantier** — application d'autorégulation dérivée de Cap Educa, personnalisée pour un adolescent accompagné en particulier (bêta-testeur expert).
- Un fichier `FEUILLE-DE-ROUTE-IA.md`, créé par Codex dans le dépôt, sert de feuille de route technique/produit ancrée au code — à ne pas confondre avec le présent cahier des charges fonctionnel, qui reste la référence côté architecture/contenu clinique validée par Nawel.

---

## 13. Ordre d'intégration obligatoire

**Phase 0 — Sauvegarde et gel** (Code) : sauvegarder les deux dépôts · identifier les branches de référence · documenter les versions en production · ne rien supprimer.

**Phase 1 — Frontières produit** (Code + Cowork) : retirer toute nouvelle dépendance au profil `pro` de Cap Educa · renommer la licence familiale · confirmer les trois portes · confirmer Les Deux Jardins strictement professionnel.

**Phase 2 — Sécurité et données** (Code) : corriger RLS · vérifier les accès croisés · activer MFA · vérifier sauvegardes · séparer test et production · traiter la question HDS avant données réelles.

**Phase 3 — Migration professionnelle** (Code + Cowork) : migrer Fiches des jeunes, Journal ABC, Dossier de suivi, Modèles professionnels vers Les Deux Jardins. Tester chaque équivalent. Ensuite seulement, retirer ces outils de Cap Educa.

**Phase 4 — Parcours Parent** (Cowork : contenus/sources · Code : écrans/outils · Design : composants/illustrations) : accueil → carte des transformations → observation → régulation → dialogue → cadre → numérique → TND → demande d'aide → synthèse.

**Phase 5 — Parcours Ado** (après validation des règles de confidentialité) : espace privé → check-in → Mode d'emploi de Moi → émotions et honte → valeurs → relations → confiance → numérique → organisation et avenir (avec Étincelle, voir phase 5bis) → demande d'accompagnement → centre de partage.

**Phase 5bis — Module Étincelle** (après stabilisation du reste du Parcours Ado, en particulier AD-03/AD-05/AD-09) : questionnaire intelligences multiples → questionnaire intérêts (RIASEC) → style d'apprentissage → métacognition → profil combiné et restitution visuelle → portrait chinois. Reprendre en priorité le contenu déjà rédigé par Nawel sur Canva (section 11) plutôt que d'en faire rédiger un nouveau. Trancher le nom définitif du module avant l'intégration (voir section 15).

**Phase 6 — Parcours professionnel complet** : double recueil · comparaison · ligne de vie · formulation · objectifs · séances · bibliothèque · restitutions.

**Phase 7 — Variante islamique** (après stabilisation du parcours Universel) : intégrer les ajouts validés · tester qu'aucun contenu islamique n'apparaît en mode Universel · tester qu'aucun champ islamique n'est obligatoire.

**Phase 8 — Monétisation familiale** : démonstration limitée · licence familiale complète · abonnement ou achat · validation serveur · fonctionnement hors ligne avec délai de grâce · aucune porte professionnelle débloquée.

**Phase 9 — Recette complète** : mobile · ordinateur · tablette · hors ligne · lecteur d'écran · navigation clavier · sauvegarde · export · suppression · changement de profil · mode soir · Universel/Islamique · RLS · licence · Étincelle (profil combiné cohérent, aucun métier imposé comme seule réponse).

---

## 14. Répartition du travail

**Code** : architecture technique · écrans · stockage local · chiffrement de l'espace Ado · migration des clés · licence familiale · Supabase · RLS · MFA · tests automatiques · déploiement.

**Cowork** : nettoyage des contenus · suppression des doublons · classement Parent/Ado/Pro · transformation en JSON structuré · vérification des sources · rédaction des microcopies · scénarios de tests fonctionnels · inventaire de migration · intégration du contenu Canva déjà rédigé (section 11) dans le module Étincelle.

**Design** : composants accessibles · déclinaisons mobile et ordinateur · cartes d'outils · pictogrammes · contraste · version impression · illustrations · templates Canva intégrables · restitution visuelle du profil Étincelle (type radar, voir section 7.5).

**Nawel** : validation clinique · validation des contenus sur la honte · décision sur le plan de sécurité · validation des sources islamiques · politique de partage adolescent/parent · choix commercial · nom définitif du module Étincelle · validation finale avant mise en service.

**Codex** : supervision de l'architecture · revue du code · audit de sécurité · contrôle des migrations · vérification des tests · contrôle de cohérence entre les parcours (y compris Étincelle) · préparation des cahiers de recette.

---

## 15. Décisions encore ouvertes — liste consolidée

Cette section rassemble, en un seul endroit, toutes les décisions qui restent à trancher par Nawel avant ou pendant le développement — pour éviter que Code/Cowork/Design ne les découvrent dispersées au fil du projet.

**Nommage et image de marque**

- Nom définitif de Cap Educa à faire atterrir dans le code (actuellement « Boussole »/« Educa Typique »).
- Nom définitif du module Étincelle : garder « Étincelle » malgré le blog existant du même nom sur les intelligences multiples (risque de confusion), ou basculer vers une piste alternative comme « Les Octufuns » (déjà esquissée par Nawel sur Canva) ou un autre nom.
- Vérifier les droits d'usage du document Canva « Questionnaire-intelligences-multiples » lié à un tiers (contact@potentielautop.com) avant toute réutilisation.

**Contenu clinique**

- Décision clinique sur le plan de sécurité personnel de l'adolescent (AD-11) — non intégré tant que non tranché.
- Nombre de questions cible par domaine dans Étincelle (le brainstorm évoque « une vingtaine par domaine » à confirmer).
- Comment/quand introduire le relais vers les sites externes d'orientation sans donner une impression d'incomplétude du module.

**Juridique et sécurité**

- Question HDS (hébergement de données de santé) pour Les Deux Jardins — bloquante avant toute donnée réelle d'accompagnée.
- Durée de conservation des dossiers dans Les Deux Jardins (LDJ-15) — à définir par Nawel, pas à inventer par Code.
- Calendrier d'activation de la MFA praticienne (LDJ-01).

**Technique**

- Création par Nawel d'un nouveau jeton d'accès GitHub pour débloquer le push du commit `730e169` (Le Fil des Deux Jardins).
- Décision sur la fusion ou non de la PR #16 (Codex).
- Migration `boussole.v1.*` → `capEduca.v1.*` à planifier.
- Architecture technique commune ou séparée entre Le Point du Jour (produit d'appel) et Al Mizan Al Qouloub (usage praticienne/consultante) — question ouverte, distincte du périmètre de ce document mais à garder en cohérence.

---

## 16. Critères de validation finale

Le projet n'est considéré prêt que si :

- Cap Educa ne contient plus aucun accès praticienne ;
- une licence familiale n'active aucun profil `pro` ;
- les trois portes familiales sont distinctes ;
- un parent ne peut pas lire l'espace Ado ;
- l'adolescent choisit ce qu'il partage ;
- aucune réponse ne produit de diagnostic ;
- le plan de sécurité n'est pas présent sans validation ;
- le mode Universel ne contient aucune obligation islamique ;
- les quatre outils professionnels existent dans Les Deux Jardins avant leur retrait ;
- une praticienne ne peut pas accéder aux dossiers d'une autre ;
- les champs sont annoncés correctement aux lecteurs d'écran ;
- les données peuvent être exportées et supprimées ;
- la question HDS est tranchée avant toute utilisation réelle ;
- le module Étincelle ne désigne jamais un métier ou une filière comme la seule bonne réponse, et valorise un profil atypique/éclaté autant qu'un profil net.

Ce cahier des charges devient la référence fonctionnelle complète à transmettre à Code, Codex, Cowork et Design.

---

*Document compilé par Rahma-Tech le 31/07/2026, à la demande de Nawel (« reprends le projet depuis le début, une application complète dans le détail afin que je puisse la proposer au Codage »). Reprend intégralement le Cahier des charges v1.0 déjà validé, y intègre le module Étincelle construit depuis, l'inventaire du contenu déjà existant sur Canva, l'état technique réel du chantier, et une liste consolidée des décisions encore ouvertes. Périmètre : Cap Educa et Les Deux Jardins (l'écosystème plus large — Al Mizan Al Qouloub/Le Point du Jour, Mon Chargé de Com, Chef de Chantier — est mentionné pour mémoire en section 1 et 12 mais ne fait pas l'objet du détail fonctionnel de ce document).*
