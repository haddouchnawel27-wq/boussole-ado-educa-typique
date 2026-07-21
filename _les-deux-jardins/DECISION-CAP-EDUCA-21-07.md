# 🧭 Décision d'architecture produit — 21 juillet 2026 (fait autorité)

> **Remplace les orientations précédentes** concernant Boussole, Cap Educa et les espaces pro.
> Source : Nawel / Ronron. Destinataires : **Code** (Les Deux Jardins) & **Codex** (Cap Educa).
> 🔴 **Règle d'or : ne rien supprimer ni déployer sans validation après la phase d'audit.**

## 1. Trois produits, trois publics, trois promesses

| Produit | Public | Fonction | Modèle |
|---|---|---|---|
| 🎁 **Boîte NeuroPed** | Tout le monde | Comprendre, découvrir, repérer, orienter | Gratuit — porte d'entrée |
| 🧭 **Cap Educa** (ex-Boussole) | Familles · enfants · ados | Utiliser au quotidien, **seul** | Abonnement **familial B2C** |
| 🩺 **Les Deux Jardins** | Praticiennes | Accompagner, documenter, suivre | Abonnement **pro B2B** |

## 2. Cap Educa = app familiale, point

L'espace **Praticienne est RETIRÉ complètement** — pas masqué, pas bouton caché, pas URL secrète,
pas activable par code, pas dans le bundle si retrait raisonnablement possible.
Cap Educa = **3 espaces uniquement : Enfant · Ado · Parent.**

## 3. Les 4 modules pro à migrer → Les Deux Jardins

1. **Fiches des jeunes**
2. **Journal ABC** (comportement)
3. **Dossier de suivi**
4. **Modèles pro** : anamnèse · PAI · compte-rendu de séance

Avant migration, examiner l'équivalent existant dans Les Deux Jardins → décider :
conserver · fusionner · reprendre des fonctions · importer les données · archiver.

## 4. 🔴 Ordre de migration OBLIGATOIRE (ne rien supprimer d'abord)

1. Inventorier les 4 modules pro de Cap Educa
2. Identifier leur équivalent exact dans Les Deux Jardins
3. Comparer champs, fonctions, exports, structures de données
4. Définir une correspondance de données
5. Compléter Les Deux Jardins si une fonction utile manque
6. Créer un export depuis Cap Educa
7. Créer, si besoin, un import dans Les Deux Jardins
8. Tester la migration avec des **données fictives**
9. Vérifier que toutes les fonctions importantes existent à destination
10. Sauvegarder la version actuelle de Cap Educa
11. Retirer les modules de la **navigation** de Cap Educa
12. Retirer code + données **uniquement après validation**
13. Vérifier qu'aucune route pro n'est encore accessible
14. Vérifier qu'aucune donnée pro n'est perdue

**On migre AVANT de retirer. On ne supprime rien tant que la destination n'est pas prête et validée.**

## 5. Tableau de correspondance à produire (avant toute modif)

Colonnes : module source · route actuelle · fonctions · données · clé de stockage · format export ·
équivalent Les Deux Jardins · fonctions manquantes · décision (conserver/fusionner/migrer/archiver) ·
état migration · tests. Pistes proposées :

| Source Cap Educa | Destination Les Deux Jardins | Action |
|---|---|---|
| Fiches des jeunes | Dossiers accompagnés | Fusionner |
| Journal ABC | Observations fonctionnelles | Migrer les entrées |
| Dossier de suivi | Chronologie d'accompagnement | Comparer puis fusionner |
| Anamnèse | Entretien initial | Conserver la version la plus complète |
| Plan individualisé | Plan d'accompagnement | Fusionner |
| Compte-rendu | Notes de séance | Migrer le modèle utile |

## 6. Renommage définitif : Boussole → Cap Educa

Partout : titre, en-tête, textes, métadonnées HTML, manifest PWA, nom installé, icônes/alt, page
connexion/activation, mentions légales, confidentialité, emails, doc, exports, noms de fichiers,
messages d'erreur, aide, tests. **Migration de clés** : lire temporairement `boussole.*`, écrire dans
`capEduca.*`, ne pas perdre les données.

## 7. Les 3 espaces (contenus prioritaires)

- **Enfant 6-12** : visuel, consignes courtes, pictos, peu de choix. Time Timer, séquenceur, emploi du
  temps, tableau de jetons, boîte à émotions, respiration, cartes de révision, outils DYS, jeux exécutifs.
- **Ado 12-18** : autonomie, confidentialité. Organisateur, Pomodoro, cartes/carte mentale, aide écriture,
  parcours d'apprentissage, roue des émotions, besoins/sensations, carnet de pensées, respiration, humeur,
  gratitude, trousse anti-crise, plan de sécurité.
- **Parent** : orienter, configurer, accompagner sans se substituer, progression familiale, réglages/données.
  Mode d'emploi, orientation par besoin, routines, jetons, emploi du temps, réglages, export, suppression, profils.
  **Interdit dans Parent** : dossier clinique, anamnèse pro, CR de séance, évaluation pro, notes de praticienne.

## 8. Codes d'accès (légers, pas une auth)

Séparent les espaces sur un même appareil. **Ne sont PAS** une auth pro / protection serveur / vérif
abonnement / paiement / protection de données cliniques. **Code Parent demandé avant** : export, suppression,
modif profils, réglages sensibles, réinitialisation.

## 9. Abonnement familial (séparé des codes)

Achat · activation · vérif serveur · récupération · changement d'appareil · expiration · renouvellement ·
annulation · remboursement · révocation · support. **Ne jamais mettre un code d'abonnement valide dans le JS public.**

## 10. Données Cap Educa

Plus de dossiers pro. Mais données familiales **restent personnelles** (émotions, pensées, humeur, objectifs,
plan de sécurité, préférences, progression). Prévoir : explication stockage, consentement, code Parent, export,
suppression par profil + totale, avertissement appareils partagés, rien de sensible dans logs/URL/notifs, pas de
pub émotionnelle. **Formulation correcte** : « Cap Educa ne stocke plus de données pro / dossiers cliniques,
mais certaines données familiales restent personnelles et doivent être protégées. » (ne pas dire « plus aucune donnée sensible »).

## 11. Accueil autonome de Cap Educa (guider, pas lister)

« **De quoi avez-vous besoin aujourd'hui ?** » → M'organiser · Commencer une tâche · Apprendre/réviser ·
Lire/écrire plus facilement · Comprendre une émotion · Retrouver le calme · Accompagner mon enfant.
Puis : 2-3 outils max + pourquoi + durée estimée + retour arrière + accès secondaire « Tous les outils ».
Plus : onboarding, démo, aide contextuelle, bouton « Je suis perdu·e », parcours guidés, états vides,
progression, favoris, historique local, mode d'emploi Parent.

## 12-13. Rôles NeuroPed & Les Deux Jardins

- **NeuroPed** = porte d'entrée publique gratuite → CTA familles « Utiliser dans Cap Educa », CTA pros
  « Structurer dans Les Deux Jardins ».
- **Les Deux Jardins** = **unique espace pro** : dossiers, profils, anamnèses, journal ABC, notes de séance,
  objectifs, plans, chronologie, suivi, synthèses, CR, exports, sauvegardes, auth, gestion des accès.
  **Toute donnée pro absente de Cap Educa après migration.**

## 14. Critères d'acceptation (résumé)

- Cap Educa : « Boussole » n'apparaît plus · espace Praticienne inexistant · aucune route pro accessible ·
  4 modules migrés/fusionnés · 3 espaces OK · codes protègent le sensible · parcours guidé OK · abonnement
  distinct des codes · export/suppression OK · données utiles non perdues.
- Les Deux Jardins : équivalents des 4 modules présents · fonctions utiles récupérées · import testé · auth
  réelle · dossiers jamais publics · sauvegardes/suppressions testées.

## 15. Ordre de travail (4 phases)

1. **AUDIT SANS MODIFICATION** : sauvegarder les 3 projets · inventorier routes Cap Educa · identifier fonctions
   pro · comparer les 4 modules avec Les Deux Jardins · produire le tableau de migration · signaler risques de
   perte · **attendre validation**.
2. **PRÉPARER LA DESTINATION** (Les Deux Jardins) : compléter · tester modules pro · import/export · données
   fictives · faire valider.
3. **TRANSFORMER CAP EDUCA** : retirer Praticienne + 4 modules + routes · renommer · 3 parcours familiaux ·
   codes · parcours autonome · export/suppression.
4. **RELIER** : liens NeuroPed · pages de vente · paiement/activation · parcours d'achat · tester les 3 produits.

**À la fin de chaque phase : fichiers modifiés · fonctions déplacées · données migrées · tests · résultats ·
problèmes restants · décisions à valider.**

---
*Répartition pressentie : Cap Educa côté Codex ; côté Code (Les Deux Jardins) = la « destination » (audit des
équivalents, complétion, import). Aucune exécution ni suppression avant l'audit validé par Nawel.*
