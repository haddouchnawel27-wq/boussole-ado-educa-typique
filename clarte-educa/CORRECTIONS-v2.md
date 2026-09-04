# 🔧 Clarté Educa — corrections v2 (post-audit)

_Appliquées le 17/08/2026 sur la branche `claude/nouvelles-aventures-6rtc3b`, dossier `clarte-educa/` uniquement. Aucun outil source hors `clarte-educa/` modifié. Aucun déploiement production._

## Résumé des corrections (dans l'ordre du brief)

1. **Mode Pro retiré** du Kit émotions (copie Clarté Educa) : bouton, 7 panneaux « Mes notes pro », `data-note`, CSS/JS du mode, notes Pro de l'export, mentions « pros/patients/cabinet/cliniques ». → `grep` de contrôle vide.
2. **Données isolées** : chaque outil + le parcours utilisent des clés dédiées `clarte_educa_*` avec **migration douce** (copie l'ancienne clé une seule fois si la nouvelle est absente ; l'ancienne n'est jamais supprimée). Le reset global n'efface que les clés `clarte_educa_*`.
3. **Étape courante persistée + retour depuis les outils** : état enrichi (`schema`, `currentStep`, `outilChoisi`, `strategieRetenue`, `createdAt`, `updatedAt`). Les outils s'ouvrent dans **le même onglet** ; « Retour au parcours » recharge à la **bonne étape** (reprise auto, plus de retour à l'accueil).
4. **Suggestion réellement contextuelle** : routage transparent, non diagnostique, à partir des situations/besoins → Apaiser une émotion / Des consignes / Retrouver mon énergie, avec explication + « Voir les autres outils ». Si aucun signal, la section devient **« Choisir un outil à essayer »** (mot « conseillé » retiré).
5. **Choix d'outil relié au plan** : après retour, « La stratégie que je retiens » (champ requis) + possibilité de changer d'outil sans perdre le parcours. `outilChoisi` et `strategieRetenue` repris dans le plan, l'état, le récap et l'impression.
6. **Conditions de progression douces** : la barre d'étapes verrouille les étapes non atteignables ; « Continuer » bloque si un champ requis manque (message `role="alert"` + focus, **sans jamais effacer**). « Retour » reste libre.
7. **Récap complété** : outil choisi, stratégie retenue, plan, suivi, dates créé/mis à jour. L'émotionomètre reste privé (non intégré). Impression A4 : barres/boutons/nav masqués, bordures visibles en N&B.
8. **Confidentialité honnête** : Google Fonts conservé (option 3) → formulation ajustée en **« Vos réponses restent enregistrées uniquement sur cet appareil »** (plus de « rien n'est envoyé »).
9. **Suppressions sécurisées** : reset global confirmé et limité à `clarte_educa_*` ; suppression d'un suivi avec **Annuler** ; confirmations internes des outils conservées.
10. **Kit émotions simplifié** : entrée « Avant que la crise monte / Pendant la crise / Après la crise » → conduit vers les fiches existantes (Thermomètre / 7 règles / Grille post-crise). Aucun contenu réécrit.

## Accessibilité
`aria-pressed` sur les chips, labels réels, focus visible (`:focus-visible`), messages d'erreur `role="alert"`/`aria-live`, cibles tactiles ≥ 40–44 px, `overflow-x:hidden` (pas de défilement horizontal à 360 px), outils du parcours ouverts **dans le même onglet**.

## Tests
- Structurels : `node clarte-educa/tests/run-tests.mjs` → **11 réussis / 0 échoué**.
- Boot des 5 outils vérifié (rendu headless, aucune page blanche).
- Fonctionnel navigateur : **non automatisé** (pas de puppeteer/jsdom ici) → recette manuelle dans `tests/README.md`.

## Décisions restant à Nawel
1. Émotionomètre : le laisser **privé** (choix actuel) ou l'ajouter au récap ?
2. Réintégrer `devoirs-sans-crise` / `routines-educatypique` (sans le lien confessionnel) ?
3. Polices : garder Google Fonts (actuel) ou passer 100 % polices système pour pouvoir écrire « rien n'est envoyé » ?
4. Lien vers Clarté Educa depuis l'accueil de l'écosystème, ou accès uniquement via le parcours payant ?
