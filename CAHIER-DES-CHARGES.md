# Cahier des charges fonctionnel — Parcours Parent, Ado et Pro

Version 1.0 — architecture validée
Destinataires : Code, Codex, Cowork et Design
Produits concernés : Cap Educa et Les Deux Jardins

## 1. Décisions non négociables

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

# 2. Principes communs d'expérience utilisateur

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

## Garde-fou écran

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

# 3. Cap Educa — écrans communs

## CE-01 — Activation familiale

Fonctions :

- saisir ou restaurer une licence ;
- afficher le statut de l'accès ;
- permettre un mode démonstration limité ;
- ne jamais exposer le secret de validation dans le JavaScript public.

Critère d'acceptation :

> Une personne ne peut pas débloquer l'application en modifiant simplement une variable dans son navigateur.

## CE-02 — Choix de la porte

Trois boutons uniquement :

- Parent d'un enfant
- Parent d'un adolescent
- Adolescent

Aucune porte `pro`.

## CE-03 — Présentation de la confidentialité

Avant la première utilisation :

- expliquer où sont conservées les données ;
- expliquer ce qui est privé ;
- expliquer comment exporter ou supprimer ;
- préciser les limites de la confidentialité sur un appareil partagé ;
- recueillir l'accord nécessaire.

## CE-04 — Tableau de bord

Affiche :

- parcours en cours ;
- dernière activité ;
- outils enregistrés ;
- bibliothèque adaptée au profil ;
- accès aux réglages ;
- temps passé aujourd'hui.

## CE-05 — Réglages et données

Fonctions :

- modifier le mode Universel/Islamique ;
- modifier le mode soir ;
- exporter ses données ;
- supprimer ses données ;
- changer le code local ;
- consulter la politique de confidentialité.

---

# 4. Parcours Parent d'adolescent

Nom :
**Comprendre mon ado — Rester en lien pendant que tout change**

Public : parents d'adolescents de 11 à 18 ans.

## PA-01 — Accueil

Présente :

- la promesse du parcours ;
- les neuf étapes ;
- une durée indicative ;
- le rappel qu'il ne s'agit pas d'un diagnostic.

Question d'entrée :

> Qu'est-ce qui te préoccupe le plus actuellement ?

Choix possibles :

- communication ;
- émotions ;
- opposition ;
- sommeil ;
- écrans ;
- école ;
- relations ;
- harcèlement ;
- TND ;
- autre.

Cette réponse sert uniquement à proposer un ordre, pas à étiqueter la situation.

## PA-02 — Ce qui change chez mon adolescent

Contenus :

- cerveau ;
- corps ;
- sommeil ;
- émotions ;
- autonomie ;
- pairs ;
- pensée ;
- valeurs.

Outil : **Carte des transformations**

Sortie :

- ce qui semble nouveau ;
- ce qui reste stable ;
- ce qui inquiète réellement le parent.

## PA-03 — Observer sans interpréter

Journal de 14 jours :

- sommeil ;
- alimentation ;
- école ;
- relations ;
- hygiène ;
- humeur ;
- écrans ;
- événements ;
- moments où cela va bien.

Chaque saisie distingue :

```text
FAIT OBSERVÉ
INTERPRÉTATION DU PARENT
QUESTION À EXPLORER
```

Aucun score clinique.

## PA-04 — Comprendre derrière le comportement

Outil :
**Ce que je vois / Ce que cela pourrait signifier / Ce que je dois vérifier**

Hypothèses proposées avec prudence :

- fatigue ;
- surcharge ;
- honte ;
- anxiété ;
- besoin d'autonomie ;
- frustration ;
- difficulté exécutive ;
- conflit ;
- événement de vie.

Toujours afficher :

> Une hypothèse aide à poser une question. Elle ne prouve pas ce que vit ton adolescent.

## PA-05 — Ma régulation de parent

Outils :

- thermomètre parental ;
- pause avant de répondre ;
- mes déclencheurs ;
- réparer après une dispute ;
- distinguer l'erreur, le comportement et la personne.

## PA-06 — Mieux dialoguer

Contenus :

- écoute active ;
- reformulation ;
- questions ouvertes ;
- phrase en « je » ;
- accueil du silence ;
- discussion côte à côte ;
- communication écrite.

Outil : **Préparer une conversation importante**

Champs :

- fait observé ;
- inquiétude ;
- question ouverte ;
- réaction à éviter ;
- phrase pour laisser la porte ouverte ;
- moment choisi.

## PA-07 — Poser un cadre évolutif

Outils :

- mes trois non-négociables ;
- ce qui peut être négocié ;
- notre accord familial ;
- conséquence prévue ;
- date de révision.

Une règle doit comporter :

```text
Pourquoi elle existe
Ce qui est attendu
Ce qui reste négociable
Ce qui arrive si elle n'est pas respectée
Quand elle sera réévaluée
```

## PA-08 — Écrans, harcèlement et sécurité numérique

Outils :

- pacte numérique familial ;
- signes possibles de harcèlement ;
- conservation des preuves ;
- que faire sans punir la victime ;
- images intimes, pression et diffusion ;
- personnes et services ressources.

Aucun conseil juridique trop précis sans source datée.

## PA-09 — Adapter en présence d'un TND

Contenus distincts :

- TDAH ;
- TSA ;
- troubles dys ;
- profils associés ;
- surcharge ;
- fonctions exécutives ;
- camouflage ;
- aménagements.

Outil : **Ce qui lui demande un effort invisible / Ce qui l'aide réellement**

Ne jamais attribuer un « âge émotionnel » à l'adolescent.

## PA-10 — Quand demander de l'aide ?

Les cinq repères :

- durée ;
- intensité ;
- rupture ;
- retentissement ;
- souffrance.

Ils servent à s'orienter, pas à trancher.

Outil : **Préparer une demande d'accompagnement**

Résumé exportable :

- faits observés ;
- début des changements ;
- événements récents ;
- domaines touchés ;
- ressources ;
- actions déjà essayées ;
- questions du parent.

## PA-11 — Synthèse

Le parent repart avec :

- trois priorités ;
- une action immédiate ;
- une conversation à préparer ;
- une adaptation à essayer ;
- une demande d'aide facultative.

---

# 5. Parcours Ado — « Mode d'emploi de Moi »

Public : adolescents de 13 à 17 ans.

## AD-01 — Mon espace et mes droits

Avant toute question :

- expliquer que l'espace appartient à l'adolescent ;
- expliquer ce qui est enregistré ;
- expliquer que le parent n'accède pas automatiquement aux réponses ;
- expliquer que l'application ne pose aucun diagnostic ;
- expliquer les limites techniques d'un appareil partagé ;
- permettre un code local différent de celui du parent.

Message :

> Tu choisis ce que tu veux écrire et ce que tu souhaites partager.

## AD-02 — Comment je vais aujourd'hui

Micro-évaluation :

- énergie ;
- humeur ;
- stress ;
- sommeil ;
- besoin principal.

Durée maximale : deux minutes.
Pas de score global de santé mentale.

## AD-03 — Mode d'emploi de Moi

Bilan métacognitif central :

- attention ;
- mémoire ;
- organisation ;
- démarrage des tâches ;
- impulsivité ;
- sensorialité ;
- communication ;
- apprentissage ;
- relations ;
- fatigue ;
- forces ;
- besoins.

Sortie privée :
**Mon Mode d'emploi de Moi**

Sections :

- ce qui est facile pour moi ;
- ce qui me coûte ;
- ce qui me surcharge ;
- ce qui m'aide ;
- comment me parler ;
- comment m'aider sans faire à ma place.

## AD-04 — Mes émotions

Outils :

- météo intérieure ;
- roue des émotions ;
- intensité ;
- déclencheurs ;
- besoins ;
- stratégies d'apaisement ;
- place particulière de la honte.

La honte n'est ni supprimée ni réduite à une « émotion secondaire ».

## AD-05 — Mes valeurs

Outil « Découvre tes valeurs » :

- choisir dix valeurs ;
- construire son Top 5 ;
- situations où une valeur a été blessée ;
- moments de fierté ;
- personnes admirées ;
- qualités appréciées ;
- actions cohérentes avec ses valeurs.

La foi est une valeur possible, jamais obligatoire.

## AD-06 — Mes relations

Outils :

- les trois regards ;
- ce que je ressens ;
- ce que l'autre pourrait vivre ;
- perspective extérieure ;
- poser une limite ;
- demander une explication ;
- dire non ;
- repérer une relation dangereuse.

## AD-07 — Reprendre confiance

Contenus :

- erreur, échec et identité ;
- perfectionnisme ;
- comparaison ;
- efforts invisibles ;
- discours intérieur ;
- petit défi réaliste ;
- preuve de progression.

## AD-08 — Ma sécurité numérique

Contenus :

- harcèlement ;
- cyberharcèlement ;
- pression ;
- sextorsion ;
- diffusion d'images ;
- manipulation ;
- adulte ou mineur inquiétant ;
- conserver une preuve ;
- demander de l'aide.

Bouton :

> Je veux demander de l'aide sans devoir tout expliquer maintenant.

## AD-09 — Mon quotidien et mon avenir

Outils :

- ma semaine réaliste ;
- sommeil ;
- organisation ;
- argent ;
- autonomie quotidienne ;
- forces ;
- intérêts ;
- orientation ;
- aujourd'hui / dans cinq ans.

Remplacer « zone de génie » par :

> Ma zone de forces, d'intérêts et de progression.

## AD-10 — Ma demande d'accompagnement

Champs :

- ce qui me préoccupe ;
- depuis quand ;
- ce que j'ai essayé ;
- ce qui m'aide ;
- ce que je ne veux pas ;
- avec qui je voudrais parler ;
- ce que j'accepte de partager.

Sortie : **Carte de demande d'aide**

## AD-11 — Centre de partage

Chaque élément possède une visibilité :

```text
PRIVÉ
À PARTAGER AVEC UNE PRATICIENNE
À PARTAGER AVEC MON PARENT
À PARTAGER AVEC LES DEUX
```

L'adolescent valide chaque partage.
Le parent ne peut pas ouvrir les réponses brutes.

## Élément exclu de la version 1

Le plan de sécurité personnel n'est pas intégré tant que la décision clinique n'est pas prise.
La version 1 ne contient pas de dépistage suicidaire automatisé ni d'alerte secrète.

---

# 6. Les Deux Jardins — parcours professionnel

## LDJ-01 — Connexion

Exigences :

- compte individuel ;
- aucun compte partagé ;
- mot de passe robuste ;
- récupération sécurisée ;
- authentification multifacteur avant mise en service réelle.

La CNIL recommande la MFA lorsque des données sensibles sont traitées. [Recommandation CNIL sur l'authentification multifacteur](https://www.cnil.fr/fr/recommandation-mfa)

## LDJ-02 — Cockpit

Affiche :

- accompagnées actives ;
- prochaines séances ;
- actions en attente ;
- consentements à renouveler ;
- alertes administratives ;
- accès rapide aux dossiers.

Aucune donnée détaillée sur la page publique.

## LDJ-03 — Nouvelle accompagnée

Données minimales :

- initiales ou pseudonyme ;
- tranche d'âge ;
- praticienne responsable ;
- responsable légal si nécessaire ;
- date d'entrée ;
- consentements ;
- motif général.

Éviter le nom complet tant qu'il n'est pas indispensable.

## LDJ-04 — Consentement

Enregistrer :

- personne ayant consenti ;
- date ;
- version du document ;
- finalités acceptées ;
- limites de confidentialité expliquées ;
- autorisations de partage ;
- retrait éventuel.

Pour certains traitements fondés sur le consentement concernant les moins de 15 ans, la CNIL rappelle la nécessité d'un accord conjoint du mineur et du parent. Une validation juridique doit déterminer précisément ce qui s'applique au service. [CNIL — consentement des mineurs](https://www.cnil.fr/fr/recommandation-4-rechercher-le-consentement-dun-parent-pour-les-mineurs-de-moins-de-15-ans)

## LDJ-05 — Dossier principal

Onglets :

1. Accueil et consentement
2. Anamnèse
3. Demande du parent
4. Demande de l'adolescent
5. Évaluations
6. Ligne de vie
7. Formulation
8. Objectifs
9. Séances
10. Outils envoyés
11. Restitutions
12. Archives

## LDJ-06 — Double recueil

Deux espaces séparés :

### Regard du parent

- observations ;
- attentes ;
- difficultés ;
- événements ;
- ressources.

### Regard de l'adolescent

- vécu ;
- priorités ;
- besoins ;
- objectifs ;
- éléments partageables.

Ne jamais fusionner automatiquement les réponses.

## LDJ-07 — Comparaison des perceptions

Affichage en trois colonnes :

| Parent | Adolescent | Points à explorer |
|---|---|---|

Terminologie obligatoire :

> La comparaison des deux perceptions constitue une donnée particulièrement utile.

Ne jamais afficher :

- « Le parent a raison »
- « L'adolescent minimise »
- « Incohérence détectée »

## LDJ-08 — Ligne de vie

Événements :

- famille ;
- santé ;
- école ;
- séparation ;
- deuil ;
- déménagement ;
- diagnostic ;
- harcèlement ;
- relation ;
- changement de traitement ;
- autre événement significatif.

## LDJ-09 — Journal ABC professionnel

Champs :

- date ;
- contexte ;
- antécédent observable ;
- comportement observable ;
- conséquence ;
- intensité ;
- durée ;
- retour au calme ;
- fonction possible ;
- éléments protecteurs.

Les faits et les hypothèses doivent être visuellement séparés.

## LDJ-10 — Formulation

Sections :

- faits établis ;
- perception du parent ;
- perception de l'adolescent ;
- facteurs déclenchants ;
- facteurs de maintien possibles ;
- ressources ;
- hypothèses ;
- points à évaluer ;
- orientations recommandées.

## LDJ-11 — Objectifs

Trois catégories :

- objectifs du parent ;
- objectifs de l'adolescent ;
- objectifs partagés.

Chaque objectif comporte :

- indicateur observable ;
- première action ;
- date de révision ;
- personne responsable.

## LDJ-12 — Séance

Champs :

- objectif ;
- participants ;
- éléments apportés ;
- intervention ;
- outil utilisé ;
- réponse observée ;
- décision ;
- prochain pas ;
- orientation.

## LDJ-13 — Bibliothèque professionnelle

Contient :

- Fiches des jeunes ;
- Journal ABC ;
- Dossier de suivi ;
- Modèles professionnels ;
- questionnaire parent ;
- questionnaire adolescent ;
- Mode d'emploi de Moi professionnel ;
- harcèlement ;
- TND ;
- émotions ;
- valeurs ;
- confiance ;
- organisation ;
- orientation ;
- communication parent-adolescent.

La praticienne sélectionne les outils. Elle ne débloque pas toute la bibliothèque par défaut.

## LDJ-14 — Restitution

Trois documents possibles :

- restitution parent ;
- restitution adolescent ;
- restitution partagée.

Une restitution ne doit contenir que les éléments autorisés pour son destinataire.

## LDJ-15 — Export, archive et suppression

Fonctions :

- exporter un dossier ;
- archiver ;
- supprimer selon la politique de conservation ;
- tracer l'action ;
- retirer les accès associés.

La durée de conservation doit être définie avant le lancement. Elle ne doit pas être inventée par Code.

---

# 7. Confidentialité et sécurité

## Cap Educa

Principe : données familiales locales.

Exigences :

- namespaces séparés ;
- espace Ado chiffré avec code local ;
- aucun mot de passe enregistré en clair ;
- aucun contenu sensible dans les URL ;
- aucun contenu personnel dans les journaux techniques ;
- aucun transfert automatique vers Les Deux Jardins ;
- export explicite uniquement ;
- suppression complète accessible.

Namespaces recommandés :

```text
capEduca.parentEnfant.*
capEduca.parentAdo.*
capEduca.ado.*
capEduca.settings.*
capEduca.entitlement.*
```

Le passage de `boussole.*` vers `capEduca.*` doit conserver les données existantes.

## Les Deux Jardins

Exigences minimales Supabase :

- authentification obligatoire ;
- RLS sur toutes les tables ;
- chaque dossier lié à `auth.uid()` de la praticienne ;
- aucun accès anonyme aux données ;
- pièces jointes dans un bucket privé ;
- liens temporaires signés ;
- journalisation des exports et suppressions ;
- sauvegardes testées ;
- séparation des environnements développement et production ;
- aucune donnée réelle dans l'environnement de test ;
- MFA avant utilisation réelle.

Test RLS obligatoire :

> Une praticienne A ne peut ni lire, ni modifier, ni deviner l'existence du dossier d'une praticienne B.

## Point juridique bloquant avant production

Il faut déterminer si les données hébergées dans Les Deux Jardins entrent dans le champ des données de santé recueillies lors d'activités de prévention, de soins ou de suivi social ou médico-social. Si oui, l'hébergement doit répondre au cadre HDS ; un projet Supabase ordinaire ne doit pas être supposé conforme sans vérification. [Agence du Numérique en Santé — certification HDS](https://esante.gouv.fr/produits-services/hds)

Décision nécessaire avant l'accueil de vraies accompagnées :

```text
HDS applicable ?
OUI / NON / AVIS JURIDIQUE EN COURS
```

Tant que ce point n'est pas validé, Les Deux Jardins reste en test avec des données fictives.

---

# 8. Modes Universel et Islamique

Le mode est une couche éditoriale, pas une base de données différente.

## Mode Universel

- aucune section islamique obligatoire ;
- aucun verset ou hadith affiché ;
- aucun champ spirituel requis ;
- vocabulaire neutre.

## Mode Islamique

Ajouts facultatifs :

- foi et valeurs ;
- sabr ;
- shukr ;
- tawakkul ;
- sens ;
- ressources spirituelles ;
- rappels validés.

Règles :

- aucune religiosité notée ;
- aucune difficulté transformée en faute morale ;
- aucune source non vérifiée ;
- bascule réversible à tout moment ;
- la fonction de l'outil reste identique.

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

---

# 9. Ordre d'intégration obligatoire

## Phase 0 — Sauvegarde et gel

Responsable : Code

- sauvegarder les deux dépôts ;
- identifier les branches de référence ;
- documenter les versions en production ;
- ne rien supprimer.

## Phase 1 — Frontières produit

Responsables : Code + Cowork

- retirer toute nouvelle dépendance au profil `pro` de Cap Educa ;
- renommer la licence familiale ;
- confirmer les trois portes ;
- confirmer Les Deux Jardins strictement professionnel.

## Phase 2 — Sécurité et données

Responsable : Code

- corriger RLS ;
- vérifier les accès croisés ;
- activer MFA ;
- vérifier sauvegardes ;
- séparer test et production ;
- traiter la question HDS avant données réelles.

## Phase 3 — Migration professionnelle

Responsables : Code + Cowork

Migrer vers Les Deux Jardins :

1. Fiches des jeunes
2. Journal ABC
3. Dossier de suivi
4. Modèles professionnels

Tester chaque équivalent.
Ensuite seulement, retirer ces outils de Cap Educa.

## Phase 4 — Parcours Parent

Responsables :

- Cowork : contenus et sources ;
- Code : écrans et outils ;
- Design : composants et illustrations.

Ordre :

1. accueil ;
2. carte des transformations ;
3. observation ;
4. régulation ;
5. dialogue ;
6. cadre ;
7. numérique ;
8. TND ;
9. demande d'aide ;
10. synthèse.

## Phase 5 — Parcours Ado

Commencer après validation des règles de confidentialité.

Ordre :

1. espace privé ;
2. check-in ;
3. Mode d'emploi de Moi ;
4. émotions et honte ;
5. valeurs ;
6. relations ;
7. confiance ;
8. numérique ;
9. organisation ;
10. demande d'accompagnement ;
11. centre de partage.

## Phase 6 — Parcours professionnel complet

- double recueil ;
- comparaison ;
- ligne de vie ;
- formulation ;
- objectifs ;
- séances ;
- bibliothèque ;
- restitutions.

## Phase 7 — Variante islamique

Après stabilisation du parcours Universel :

- intégrer les ajouts validés ;
- tester qu'aucun contenu islamique n'apparaît en mode Universel ;
- tester qu'aucun champ islamique n'est obligatoire.

## Phase 8 — Monétisation familiale

- démonstration limitée ;
- licence familiale complète ;
- abonnement ou achat ;
- validation serveur ;
- fonctionnement hors ligne avec délai de grâce ;
- aucune porte professionnelle débloquée.

## Phase 9 — Recette complète

- mobile ;
- ordinateur ;
- tablette ;
- hors ligne ;
- lecteur d'écran ;
- navigation clavier ;
- sauvegarde ;
- export ;
- suppression ;
- changement de profil ;
- mode soir ;
- Universel/Islamique ;
- RLS ;
- licence.

---

# 10. Répartition du travail

## Code

- architecture technique ;
- écrans ;
- stockage local ;
- chiffrement de l'espace Ado ;
- migration des clés ;
- licence familiale ;
- Supabase ;
- RLS ;
- MFA ;
- tests automatiques ;
- déploiement.

## Cowork

- nettoyage des contenus ;
- suppression des doublons ;
- classement Parent/Ado/Pro ;
- transformation en JSON structuré ;
- vérification des sources ;
- rédaction des microcopies ;
- scénarios de tests fonctionnels ;
- inventaire de migration.

## Design

- composants accessibles ;
- déclinaisons mobile et ordinateur ;
- cartes d'outils ;
- pictogrammes ;
- contraste ;
- version impression ;
- illustrations ;
- templates Canva intégrables.

## Nawel

- validation clinique ;
- validation des contenus sur la honte ;
- décision sur le plan de sécurité ;
- validation des sources islamiques ;
- politique de partage adolescent/parent ;
- choix commercial ;
- validation finale avant mise en service.

## Codex

- supervision de l'architecture ;
- revue du code ;
- audit de sécurité ;
- contrôle des migrations ;
- vérification des tests ;
- contrôle de cohérence entre les trois parcours ;
- préparation des cahiers de recette.

---

# 11. Critères de validation finale

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
- la question HDS est tranchée avant toute utilisation réelle.

Ce cahier des charges devient la référence fonctionnelle à transmettre à Code et Cowork.
