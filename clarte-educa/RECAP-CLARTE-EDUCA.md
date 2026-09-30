# 🧭 Clarté Educa — récap de la V1 (assemblage)

_Assemblé le 16/08/2026. **Clarté Educa = l'outil** · **Clarté TND = le parcours**._
_Public V1 : mamans d'enfants ~4-5 à 12 ans (TND / difficultés d'apprentissage). Pas d'espace Ado/Pro, pas de diagnostic, pas de confessionnel, 100% local._

---

## ▶️ Recette (comment l'ouvrir toi-même)

1. Ouvre `clarte-educa/index.html` dans un navigateur (ou l'aperçu Vercel, lien en fin de doc).
2. Renseigne (facultatif) le prénom/surnom + l'âge, clique **Commencer**.
3. Déroule les 6 étapes : chips à cliquer, textes à écrire, boutons vers les outils.
4. Ferme l'onglet, **rouvre** : tes réponses reviennent toutes seules (« ↩︎ reprise »).
5. À la fin : **Récap** → bouton **Imprimer / PDF**. Bouton **Tout recommencer** (avec confirmation).

> 🔒 Rien n'est envoyé : tout est stocké dans le navigateur (`localStorage`, clé `clarte_educa_v1`).

---

## 🧩 Le parcours (un seul chemin, mobile-first)

`Accueil → Ma situation → Ce que j'observe → Ce dont nous avons besoin → Mon outil conseillé → Mon plan → Mon suivi → Récap`

| Étape | Ce qu'elle fait | S'appuie sur |
|---|---|---|
| 1 · Ma situation | Choisir le domaine qui pèse (école, émotions, sommeil…) | parcours (chips) |
| 2 · Ce que j'observe | Décrire les **faits**, sans interpréter | parcours (texte) |
| 3 · Notre besoin | Repérer le besoin de l'enfant **+ faire le point sur soi** | chips + `emotionometre-parental` |
| 4 · Mon outil conseillé | Choisir **une** stratégie douce à essayer | `guide-consignes-efficaces`, `kit-gestion-emotions`, `chrono-energies-maman` |
| 5 · Mon plan | Poser une première marche | `mon-plan-pas-a-pas` + note |
| 6 · Mon suivi | Noter ce que ça donne, pour ajuster | parcours (journal) |

Les étapes 1, 2, 6 sont **portées par le parcours lui-même** (pas d'outil externe) → zéro lien cassé, zéro nom technique exposé.

---

## 📋 Matrice d'audit (outils examinés)

### ✅ Retenus (copiés dans `clarte-educa/outils/`)
| Outil (source `parcours-clarte-tnd/apps/`) | Besoin | Local | Impr. | Mobile | Diagnostic ? |
|---|---|---|---|---|---|
| emotionometre-parental | état émotionnel de la maman | ✅ | ✅ | ✅ | non |
| guide-consignes-efficaces | donner des consignes qui passent | ✅ | ✅ | ✅ | non |
| kit-gestion-emotions | apaiser une émotion forte | ✅ | ✅ | ✅ | non |
| chrono-energies-maman | énergie / souffle de la maman | ✅ | ✅ | ✅ | non |
| mon-plan-pas-a-pas | construire un plan d'essai | ✅ | ✅ | ✅ | non |

### ❌ Écartés de cette V1 (conservés, non supprimés)
| Outil | Raison de l'écart |
|---|---|
| `reperage-tnd-enfant` (outils-pro) | Outil de **dépistage** avec verdict par axe → trop proche du diagnostic. |
| `detecteur-de-paroles` | Mécanique **« verdict »** (bilan cœur/bombe). |
| `maman-neuro-atypique` | **Score-verdict** radar (auto-questionnaire). |
| `routines-educatypique` | Lien vers une **méthode confessionnelle** (`methode-rahma-prophetique`) + chemin cassé `../../D_regulation` — exclu de la version universelle. |
| `devoirs-sans-crise` | Dépend de 2 sous-outils (`detecteur-paroles-devoirs`, `kit-emotions-devoirs`) → **liens cassés** si copié seul. À réintégrer plus tard avec ses dépendances. |
| `ligne-du-temps-parcours-tnd` | Renvoie vers `boussole-diagnostic-dys.html` (**diagnostic**). Remplacé par le suivi natif du parcours. |
| `pense-bete-outils` | Statique, sans persistance ni interactivité. |
| Tout `outils-ado/` et `outils-pro/` | Hors périmètre V1 (pas d'espace Ado/Pro). |

### 🔁 Doublons / fusions
- Le **suivi** (étape 6) fusionne l'intention de `ligne-du-temps` **sans** son lien diagnostic → façade native du parcours.
- L'**observation** (étape 2) remplace les outils à « verdict » par une simple saisie factuelle.

---

## 🗂️ Fichiers créés / modifiés
**Créés :**
- `clarte-educa/index.html` — le parcours (wrapper 6 étapes).
- `clarte-educa/_assets/charte.css` — charte Educa (copie de `parcours-clarte-tnd/assets/charte.css`).
- `clarte-educa/outils/` — 5 outils copiés (liens « retour » neutralisés → `../index.html`, texte « ← Retour au parcours »).
- `clarte-educa/RECAP-CLARTE-EDUCA.md` — ce document.

**Non modifié :** aucun outil source original (les copies seules ont été retouchées). Aucune autre app de l'écosystème touchée.

---

## ✅ Tests réalisés
- **Rendu** (Chromium headless, écran 430px) : le parcours s'affiche avec la charte Educa (Poppins/violet, encadrés menthe/jaune) — capture OK.
- **JS** : le script s'exécute sans erreur (les pastilles d'étapes sont générées par le script → preuve d'exécution complète).
- **Liens outils** : les 5 fichiers `outils/*.html` existent et sont pointés correctement.
- **Charte des outils copiés** : `../_assets/charte.css` résout bien depuis `outils/` (rendu d'un outil vérifié en capture — pas de page cassée).
- **Liens problématiques** : plus aucun `parents.html` / `professionnels.html` / `methode-rahma` / `D_regulation` dans les copies.

### ⏳ Tests restant à faire (recette manuelle, idéalement par toi)
- Cliquer chaque chip + chaque bouton sur téléphone réel.
- Sauvegarde → fermeture → **réouverture** → vérifier la reprise.
- Confirmation avant « Tout recommencer ».
- Impression/PDF du récap (vérifier fonds colorés).
- Navigation clavier (Tab) sur mobile + ordi.

---

## ⚠️ Risques résiduels
1. **Outils copiés = fonctionnalités riches non re-testées une par une** (ex. impression interne de chaque outil). Ils marchaient dans NeuroPed ; à re-tester en conditions réelles.
2. **Persistances séparées** : le parcours et chaque outil ont leur propre `localStorage` (normal, mais les données ne se croisent pas).
3. **Polices Google Fonts en ligne** : hors-ligne, le rendu retombe sur des polices système (contenu lisible, style un peu différent).
4. **`kit-gestion-emotions`** contient de nombreux `<style>`/JS internes — vérifié comme autonome, mais gros fichier (57 Ko).

---

## 🙋 Décisions qui te reviennent (Nawel)
1. **Périmètre étape 4** : je propose 3 stratégies. En veux-tu plus (ex. réintégrer `devoirs-sans-crise` avec ses 2 sous-outils) ou moins ?
2. **`routines-educatypique`** : le veux-tu, mais **sans** le lien confessionnel (je neutraliserais le lien), ou on le laisse dehors en V1 ?
3. **Nom affiché des outils** : j'ai mis des noms « grand public » (« Des consignes qui passent mieux »…). À valider / réécrire à ta sauce.
4. **Page d'accueil de l'écosystème** : faut-il un lien vers Clarté Educa depuis l'`index.html` racine, ou reste-t-elle non-listée pour l'instant (accès via le parcours payant) ?
5. **Sources locales** (`les-deux-jardins`, `produit-appel-educa`) : non accessibles ici. Si elles contiennent des outils/consignes à intégrer, il faudra me les envoyer (ZIP) ou ajouter le dépôt.

---

_V1 assemblée par réutilisation exclusive d'outils existants. Aucun nouvel outil métier créé. Aucun contenu supprimé._
