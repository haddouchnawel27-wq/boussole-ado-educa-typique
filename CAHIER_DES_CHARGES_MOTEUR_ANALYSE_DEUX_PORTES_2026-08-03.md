# Les Deux Jardins — moteur d’analyse professionnel à deux portes

**Date :** 3 août 2026  
**Statut :** architecture fonctionnelle validée par Nawel avant développement  
**Destination finale :** application professionnelle Les Deux Jardins

## 1. Décision produit

Les deux Décodeurs existants sont fusionnés dans **Les Deux Jardins** :

- Décodeur clinique Jannat al Qalb :
  `https://shifa-decodeur-voie-chifa-cr.netlify.app/` ;
- Décodeur Educa Typique :
  `C:\Users\haddo\Downloads\decodeur-educa-typique.html`.

Ils alimentent un moteur natif commun, accessible depuis chaque dossier
professionnel. **Une version autonome de continuité est également conservée**
pour que Nawel puisse utiliser les Décodeurs même si Les Deux Jardins est
momentanément indisponible.

Les sources ne sont ni supprimées ni désactivées. Après la migration, elles
restent conservées et maintenues comme solution de secours indépendante.

## 2. Autorité clinique

Le moteur est un **assistant de formulation professionnelle
pluridisciplinaire**. Il peut :

- organiser les informations recueillies ;
- faire émerger plusieurs hypothèses de travail ;
- croiser les domaines de compétence ;
- signaler les informations manquantes ;
- proposer des questions complémentaires ;
- suggérer des axes, outils, protocoles et orientations.

Il ne valide aucune conclusion et ne décide jamais du parcours.

Pour chaque proposition, Nawel dispose obligatoirement de quatre décisions :

1. **Retenir** ;
2. **Nuancer / modifier** ;
3. **Mettre en attente** ;
4. **Réfuter**.

Une hypothèse, un axe ou un protocole n’entre dans la formulation validée que
sur décision explicite de la praticienne.

## 3. Les deux portes d’entrée

### Porte 1 — Jannat al Qalb

Public accompagné : femmes et adultes selon le cadre professionnel retenu.

Lectures mobilisables selon la situation et le mandat de la consultante :

- psychologie clinique et psychopathologie ;
- psychologie et psychothérapie islamiques ;
- TCC, ACT et outils de régulation ;
- schémas, modes, attachement et fonctionnement sacrificiel ;
- traumatismes, pertes, événements de vie et mécanismes de protection ;
- estime de soi, honte, culpabilité, perfectionnisme et dépendances ;
- relations, couple, famille, parentalité et dynamiques d’emprise ;
- transculturalité, mandat culturel, injonctions familiales et sociales ;
- ressources, valeurs, sens et spiritualité ;
- fonctionnement cognitif, sensoriel ou neuroatypique lorsqu’il est pertinent ;
- besoins d’orientation médicale, sociale, juridique ou spécialisée.

Le religieux, le culturel et le psychologique sont distingués, puis articulés
lorsque cela éclaire la situation. La pratique religieuse peut être explorée
et accompagnée sans jugement, selon les besoins et attentes de la consultante.

### Porte 2 — Educa Typique

Public accompagné : enfants, adolescents et parentalité.

Lectures mobilisables selon l’âge et le contexte :

- développement global et histoire développementale ;
- TND et diagnostics déjà posés ;
- attention, impulsivité et niveau d’activation ;
- fonctions exécutives et mémoire de travail ;
- profils d’apprentissage et métacognition ;
- langage, lecture, écriture, mathématiques et autres apprentissages ;
- communication et interactions sociales ;
- motricité, graphisme, coordination et repères corporels ;
- sensorialité, besoins de régulation et environnement ;
- émotions, estime de soi, anxiété, honte et vécu scolaire ;
- sommeil, fatigue, écrans et hygiène de vie ;
- relations familiales, fratrie, école et pairs ;
- harcèlement, conflits, ruptures et événements de vie ;
- ressources, intérêts, valeurs, autonomie et orientation ;
- besoins d’aménagement ou d’orientation vers un professionnel habilité.

Le contenu structuré du Décodeur Educa Typique est importé puis relu :
questionnaires, domaines, profils, orientations, protocoles d’observation et
programmes d’accompagnement. Les affirmations non sourcées ou trop certaines
sont reformulées avant intégration.

## 4. Socle professionnel commun

Les deux portes partagent :

- compte praticienne ;
- code pseudonymisé du dossier ;
- demande initiale et consentement ;
- anamnèse ;
- questionnaires et observations ;
- chronologie et événements de vie ;
- notes de séance ;
- formulation et objectifs ;
- bibliothèque d’outils ;
- synthèse « Pour toi » ;
- compte rendu praticienne ;
- clôture structurée.

La porte choisie adapte le vocabulaire, les domaines proposés, les
questionnaires, les référentiels et les protocoles sans séparer artificiellement
le dossier.

## 5. Place du moteur dans le parcours

Le moteur apparaît après **Recueillir / Évaluer** et nourrit **Formuler** puis
**Cibler**.

```text
Anamnèse + notes + questionnaires + événements
                         ↓
              Préparation de l’analyse
                         ↓
           Hypothèses plurifactorielles
                         ↓
     Validation / modification par la praticienne
                         ↓
       Axes de travail et protocoles possibles
                         ↓
     Validation / modification par la praticienne
                         ↓
          Formulation professionnelle retenue
```

## 6. Entrées analysables

Le moteur peut recevoir, avec sélection explicite de la praticienne :

- champs d’anamnèse ;
- notes complémentaires ;
- notes de séance ;
- réponses et scores de questionnaires ;
- observations libres ;
- éléments copiés depuis un bilan ou un compte rendu ;
- événements de vie et changements de contexte ;
- ressources, obstacles, objectifs et attentes ;
- éléments spirituels uniquement lorsque la porte ou le mode le permet.

Avant l’analyse, un écran récapitule ce qui sera pris en compte. Nawel peut
retirer un élément ou ajouter une consigne clinique.

## 7. Structure obligatoire d’une hypothèse

Chaque carte d’hypothèse contient :

- domaine de lecture ;
- formulation prudente de la piste ;
- observations qui la soutiennent ;
- observations qui la nuancent ou la contredisent ;
- hypothèses alternatives ;
- informations manquantes ;
- questions complémentaires possibles ;
- retentissement observé ou supposé à vérifier ;
- priorité clinique proposée, distincte d’une probabilité chiffrée ;
- orientation éventuelle ;
- décision et commentaire de la praticienne ;
- date et version de validation.

Le moteur ne présente jamais une probabilité numérique de diagnostic. Il
distingue : **à explorer**, **à documenter**, **à surveiller**, **prioritaire**
et **orientation à envisager**.

## 8. Croisements multidisciplinaires

Une vue « Lectures croisées » rapproche les hypothèses sans les confondre :

- clinique et événements de vie ;
- clinique et neurodéveloppement ;
- émotionnel et sensoriel ;
- apprentissages et fonctions exécutives ;
- relations, attachement et contexte familial ;
- religion, culture, migration et attentes personnelles ;
- ressources, valeurs, environnement et obstacles ;
- état actuel, trajectoire et facteurs de maintien.

La vue affiche également les contradictions, les explications concurrentes et
les effets possibles du contexte. Elle favorise la formulation intégrative,
pas la recherche d’une étiquette unique.

## 9. Suggestions d’axes et de protocoles

Une suggestion comporte obligatoirement :

- objectif visé ;
- hypothèse validée à laquelle elle répond ;
- public et conditions d’utilisation ;
- déroulé ou étapes ;
- adaptations possibles ;
- précautions et limites ;
- indicateur d’évolution ;
- moment de réévaluation ;
- orientation ou coordination éventuelle ;
- source ou statut de validation du contenu ;
- décision de la praticienne.

Le moteur peut proposer plusieurs options et expliquer leurs différences. Il
ne sélectionne jamais automatiquement « le meilleur protocole ».

## 10. Alertes de sécurité

Les alertes de sécurité restent visibles lorsqu’un élément exige une
évaluation immédiate. Elles ne transforment pas chaque difficulté en urgence et
n’annulent pas le raisonnement clinique.

Elles servent à rappeler les informations à vérifier et les ressources à
mobiliser. L’évaluation, la décision et l’action appartiennent à la
praticienne, sauf intervention directe des services compétents dans leur propre
cadre.

## 11. Écran de validation praticienne

L’écran final sépare clairement :

1. éléments factuels recueillis ;
2. interprétations proposées par le moteur ;
3. hypothèses retenues par Nawel ;
4. hypothèses écartées ou suspendues ;
5. axes de travail retenus ;
6. protocoles ou outils choisis ;
7. orientations et coordinations ;
8. points à réévaluer à la prochaine séance.

Aucune synthèse destinée à la consultante ne reprend automatiquement une
hypothèse non validée.

## 12. Fusion de l’existant

### À reprendre du Décodeur Jannat al Qalb

- analyse de texte libre ;
- architecture intégrative ;
- lecture psycho-spirituelle ;
- production d’une synthèse structurée ;
- propositions d’axes et de protocoles ;
- préparation du compte rendu.

### À reprendre du Décodeur Educa Typique

- choix du public et du répondant ;
- domaines d’observation ;
- questionnaires structurés ;
- profils et cartographies ;
- orientations professionnelles ;
- protocoles d’observation ;
- programmes d’accompagnement ;
- restitution famille et vue praticienne distinctes.

### À ne pas reprendre tel quel

- verdict automatique ;
- probabilité diagnostique chiffrée ;
- causalité ou statistique non sourcée ;
- orientation fondée sur un score isolé ;
- protocole présenté comme obligatoire ;
- contenu religieux non vérifié ;
- promesse absolue de confidentialité ;
- clé d’API saisie et conservée dans une page publique.

## 13. Ordre d’intégration

1. Valider le présent cahier des charges avec Nawel.
2. Extraire les contenus structurés des deux Décodeurs.
3. Classer les contenus par domaine, public, source et statut de validation.
4. Concevoir les deux portes sans dupliquer le cockpit.
5. Construire les cartes d’hypothèse et les décisions praticienne.
6. Construire les cartes d’axes et protocoles.
7. Relier le moteur au dossier local des Deux Jardins.
8. Tester avec des cas entièrement fictifs Jannat et Educa.
9. Faire relire les contenus cliniques, neuro-éducatifs et religieux retenus.
10. Obtenir le feu vert de Nawel.
11. Vérifier que toutes leurs fonctions utiles sont retrouvées dans Les Deux
    Jardins.
12. Conserver et tester les Décodeurs autonomes comme solution de continuité.

## 14. Critères de réussite

- deux portes visibles et compréhensibles ;
- un seul dossier et un seul fil de suivi ;
- aucune perte de contenu utile des deux Décodeurs ;
- aucune hypothèse transformée automatiquement en conclusion ;
- raisonnement pluriel, contradictoire et traçable ;
- validation praticienne obligatoire ;
- propositions modifiables et réfutables ;
- protocoles reliés aux hypothèses retenues ;
- synthèses adaptées au destinataire ;
- fonctionnement suffisamment simple pour être utilisé pendant ou après une
  séance sans surcharge technique.

## 15. Continuité d’utilisation — accès autonome obligatoire

Les Deux Jardins est l’outil principal, mais ne constitue jamais le seul moyen
d’accéder aux fonctions d’analyse.

Un **Kit Décodeurs autonomes** doit être conservé avec deux portes :

1. **Jannat al Qalb — Décodeur autonome** ;
2. **Educa Typique — Décodeur autonome**.

Ce kit respecte les règles suivantes :

- ouverture indépendante de Les Deux Jardins ;
- absence de connexion au compte Les Deux Jardins ;
- possibilité de saisir ou coller un contenu sans ouvrir un dossier ;
- fonctionnement local pour les questionnaires, grilles, cartographies et
  formulations manuelles ;
- export ou copie de la synthèse produite ;
- conservation des versions sources ;
- mise à jour contrôlée lorsque le moteur principal évolue ;
- test régulier des deux portes.

Les fonctions reposant sur une IA distante nécessitent encore une connexion à
Internet et le service concerné. En cas d’indisponibilité de l’IA, le kit doit
laisser accessibles les grilles structurées, les questionnaires, les champs de
formulation et les protocoles déjà validés.

Le kit autonome est un **plan de continuité**, pas une troisième base de
dossiers : les contenus peuvent être utilisés ponctuellement puis copiés dans
le dossier principal lorsque Les Deux Jardins redevient disponible.
