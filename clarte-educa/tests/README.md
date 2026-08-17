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

## ✅ Test fonctionnel navigateur (`functional.mjs`)

Scénario complet dans un **vrai navigateur** (via `puppeteer-core` + un Chromium déjà présent).
Il se **saute proprement** si `puppeteer-core` n'est pas installé (jamais déclaré « réussi » sans exécution).

Le lancer (servir en **http** — indispensable pour un `localStorage` au comportement identique à la prod) :

```bash
# 1) pilote (n'embarque PAS de navigateur ; réutilise un Chromium existant)
npm install puppeteer-core
# 2) petit serveur http
python3 -m http.server 8139 --bind 127.0.0.1 &
# 3) lancer le test
CHROME_BIN=/chemin/vers/chrome \
BASE_URL=http://127.0.0.1:8139/clarte-educa/index.html \
node clarte-educa/tests/functional.mjs
```

Scénario joué : `remplir → suggestion → ouvrir l'outil (même onglet) → revenir → confirmer la stratégie
→ plan → recharger → reprise → suivi → récapitulatif`, plus une condition de passage.

**Dernier résultat : 22 réussis · 0 échoué.** Ce test a détecté puis fait corriger 3 vrais bugs :
lien « Retour au parcours » manquant dans le kit, écouteur de clic absent sur les cartes d'outils
générées dynamiquement (corrigé par délégation), et sauvegarde différée pouvant perdre la dernière
action lors d'un rechargement immédiat (corrigé par écriture immédiate).

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
