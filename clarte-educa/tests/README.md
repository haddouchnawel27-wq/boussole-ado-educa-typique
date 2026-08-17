# 🧪 Tests — Clarté Educa

## Tests automatisés (structurels)

```bash
node clarte-educa/tests/run-tests.mjs
```

Aucune dépendance (Node seul, `node --check`). Couvre les points de recette **statiques** :

| # | Vérifie |
|---|---|
| 1 | Syntaxe JS de tous les HTML (scripts inline) |
| 2 / 11 | Tous les liens locaux `.html`/`.css` existent (aucun cassé) |
| 3 | Aucun Mode/Espace Pro ni note clinique |
| 4 | Aucun lien Ado |
| 5 | Clés de stockage dédiées `clarte_educa_*` présentes |
| 6 | Anciennes clés génériques **uniquement** en migration |
| 7 | État principal : `currentStep`, `outilChoisi`, `strategieRetenue`, `createdAt`, `updatedAt` |
| 8 | Conditions de passage (`done`/`canEnter`/`tryNext`) |
| 9 | Impression + reset confirmé (efface **seulement** `clarte_educa_*`) |
| 10 | Aucun score-verdict ajouté (hors disclaimer « jamais un verdict ») |
| 12 | Routage des 3 familles de besoins (kit / consignes / énergie) |

Résultat attendu : **11 réussis · 0 échoués**.

## ⚠️ Test fonctionnel navigateur — NON automatisé ici

Un navigateur scriptable (puppeteer/playwright/jsdom) **n'est pas installé** dans cet environnement,
donc le scénario fonctionnel complet n'a **pas** été exécuté automatiquement. Il doit être fait en
**recette manuelle** (ci-dessous). Ne pas le déclarer « réussi » tant qu'il n'a pas été joué.

### Scénario fonctionnel à jouer
`remplir → choisir une suggestion → ouvrir l'outil → revenir → confirmer une stratégie → rédiger un plan → recharger → vérifier la reprise → ajouter un suivi → ouvrir le récapitulatif`

### Recette manuelle (à cocher)
- [ ] Écran ordinateur
- [ ] Écran 360–430 px (téléphone)
- [ ] Clavier seul (Tab / Entrée, focus visible)
- [ ] Chacun des 5 outils s'ouvre sans page blanche
- [ ] Retour depuis un outil → reprise à la **bonne étape** (pas l'accueil)
- [ ] Sauvegarde → **rechargement** → réponses + étape retrouvées
- [ ] Impression / PDF du récap (A4 : pas de bouton/barre imprimés, texte non coupé)
- [ ] Suppression d'un suivi : **Annuler** puis confirmer
- [ ] « Tout recommencer » : confirmation explicite, n'efface que Clarté Educa
- [ ] Parcours avec enfant **non diagnostiqué** (aucun jugement affiché)
- [ ] Aucun accès à un contenu Pro ou Ado
- [ ] Conditions douces : « Continuer » bloque si un champ requis manque (message + focus, sans effacer)
