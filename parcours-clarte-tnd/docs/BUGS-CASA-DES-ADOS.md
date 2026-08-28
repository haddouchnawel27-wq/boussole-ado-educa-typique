# 🧑 Casa des Ados — relevé de bugs

_Constaté le 28 août 2026 sur le paquet `Mobile_app_concept_3.zip` (dossier `deploy/`),
recoupé avec `Mobile_app_concept_1/2` et avec la livraison Codex
`Casa_des_Ados_SIMPLE_A_OUVRIR`._

**Cette app appartient à Codex.** Ce document est un relevé, pas une correction :
aucune modification n'a été poussée sur sa branche.

---

## Le visuel

Rien à redire. Navigation à quatre onglets fluide, les 11 ateliers et les 6 espaces
s'affichent, le check-in humeur répond, **zéro erreur JavaScript**, aucune ressource
qui échoue à charger. Le problème n'est pas là.

---

## 🔴 Bloquant — les 22 outils sont injoignables une fois en ligne

Chaque étape d'atelier pointe vers :

```
uploads/Casa_des_Ados_SIMPLE_A_OUVRIR/ressources/ados/<outil>.html
```

Ce dossier **n'est pas dans `deploy/`**. Le paquet ne contient que `index.html`,
`carnet.html`, deux icônes et `manifest.json`. Le README affirme pourtant que
« les 22 outils sont **dans** les fichiers » — ce n'est pas le cas.

Conséquence : l'ado navigue, choisit son atelier, clique « 1 · Boussole Ados » →
page blanche 404. Sur les 22 liens, 22 sont morts.

Le catalogue lui-même est sain : les 22 fichiers appelés existent tous chez Codex,
aucun nom ne manque. C'est uniquement le paquet d'export qui est incomplet.

**Correction :** copier `ressources/ados/` dans `deploy/` et réécrire la base des liens
en `outils/` (plus court et moins fragile que le chemin `uploads/…` actuel).

## 🟠 `window.casaOpenTool` n'existe pas

Le code appelle `window.casaOpenTool(fichier, titre)` sur chaque clic d'étape ; la
fonction n'est définie nulle part, ni dans `index.html`, ni dans `carnet.html`.
Le clic retombe sur le `href` de l'ancre — donc sur le lien mort ci-dessus.
Une fois le dossier d'outils livré, ça fonctionnera par accident ; il vaut mieux
soit définir la fonction, soit retirer le crochet.

## 🟠 Le carnet est livré mais inaccessible

`carnet.html` (624 Ko) est dans le dossier. Aucun bouton, aucun lien, aucune mention
dans le DOM de l'app ne permet d'y arriver. Il faut connaître l'URL.

## 🟡 Le titre de l'onglet est « Bundled Page »

`<title>Bundled Page</title>` dans `index.html`. C'est ce que l'ado verra dans son
onglet et, surtout, sous l'icône ajoutée à l'écran d'accueil.
`carnet.html`, lui, est correct : « La Casa des Ados — Educa Typique ».

## 🟡 Le `manifest.json` n'est relié à aucune page

Ni `index.html` ni `carnet.html` ne contiennent `<link rel="manifest">`.
Le README promet « Ajouter à l'écran d'accueil » avec l'icône ✦ et le plein écran :
sans ce lien, Android ne lit pas le manifeste — pas de nom, pas d'icône, pas de mode
`standalone`. Manquent aussi `<html lang="fr">`, le `<meta name="viewport">` et
`<meta name="theme-color">`.

## 🟡 Liens internes cassés à l'intérieur des outils

Dans `ressources/ados/`, les 22 outils pointent vers des cibles absentes :

| Cible appelée | Occurrences | État |
|---|---|---|
| `../../ados.html` et `../ados.html` | 30 | absente du paquet |
| `../../_assets/charte.css` et `../_assets/charte.css` | 12 | absente du paquet |
| `moi-et-coachy.html` | 2 | renommé `Moi_et_Coachy_Accueil.html` |
| `mode-emploi-moi-meme.html` | 1 | renommé `Mon_Mode_Emploi.html` |
| `coachy_v1.html` | 1 | renommé `Coachy.html` |

La feuille de style manquante n'est pas grave — les 12 outils concernés portent tous
un `<style>` en ligne complet. Les flèches de retour et les trois liens renommés, si.

## 🟡 Un outil orphelin

`appli-emotions-ados.html` est livré mais n'est appelé par aucun atelier.
Soit il remplace `app-emotions-vocabulaire.html`, soit il est à retirer.

---

## Ce qui est bon et qu'il ne faut pas casser

- **Le mot « diagnostic » n'apparaît que sous forme protectrice** — « ces outils donnent
  des pistes, jamais un diagnostic », « elle ne pose aucun diagnostic ». Conforme.
- **Aucune trace de l'ancienne marque.** Ni « Voie Chifa », ni « Nawell ».
- **Aucun lien vers l'espace Famille ni vers l'espace Pro.** La cloison tient.
- **Aucune donnée ne sort du navigateur.** Pas d'appel réseau, pas de formulaire distant.
- **Les 3 zips livrent la même app** ; `concept_3/deploy/` est la version la plus récente
  et la seule prête à héberger. C'est celle sur laquelle travailler.
