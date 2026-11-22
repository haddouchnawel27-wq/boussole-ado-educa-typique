# 🔀 Casa des Ados — qui fait quoi, maintenant

_Préparé le 2 septembre 2026 au soir, à la demande de Nawel : « est-ce que Design peut
récupérer ce qui manquait, ou est-ce à Codex de reprendre la main ? »_

---

## La réponse courte

**Ni l'un ni l'autre n'a besoin de reprendre la main sur ce qui manquait.** Les fichiers
sont désormais dans le dépôt, réparés et vérifiés. Codex sort du chemin critique.

Ce qui reste se répartit en trois piles nettes, et une seule est pour Design.

---

## Ce qui s'est passé, pour mémoire

**Codex a fait la conception** : il a réuni et écrit les 23 outils, construit le
catalogue, structuré les ateliers. C'est le fond.

**Claude Design a repris l'esthétique** : la coquille de l'app, le visuel sombre, les
quatre onglets, l'écran d'ouverture. C'est la forme.

Le problème est né entre les deux. Les 23 outils de Codex vivaient **dans un ZIP, hors
de tout dépôt**. Chaque export de Design les oubliait — l'app pointait vers un dossier
que personne ne livrait. D'où 23 liens morts sur 23, à chaque version.

Ce n'est la faute de personne en particulier : c'est ce qui arrive quand un fond n'a pas
d'adresse fixe.

---

## Ce qui est réglé — ce soir, dans le dépôt

**Les 23 outils sont désormais dans `parcours-clarte-tnd/outils-ado/`.** Le dépôt n'en
contenait que 7 ; j'ai ajouté les 16 autres depuis la livraison de Codex.

- Les 7 déjà présents étaient **identiques** à la livraison, au caractère près. Rien
  n'a été écrasé.
- Les 16 ajoutés ont été vérifiés un par un : **16/16 s'affichent sans une seule erreur
  JavaScript**, aucune trace de l'ancienne marque, le mot « diagnostic » uniquement sous
  forme protectrice, aucun lien vers l'espace famille ou pro, aucune donnée qui sort du
  navigateur.
- **Les 31 liens internes cassés sont réparés.** Les cinq cibles distinctes des 23
  outils existent maintenant toutes : la flèche de retour, la charte, et les trois
  outils qui avaient été renommés sans que leurs appelants suivent.

**Ce que ça change :** le fond a une adresse fixe. Design n'a plus à attendre un ZIP de
qui que ce soit, et le problème ne peut plus se reproduire au prochain export.

---

## Ce qui reste — pile par pile

### 🎨 Pile 1 — pour Claude Design (la coquille)

Cinq points, tous dans l'app, tous d'ordre technique ou esthétique. C'est son domaine.

| Quoi | Pourquoi ça compte |
|---|---|
| **Embarquer les 23 outils dans l'export** | Sans ça, rien ne fonctionne en ligne |
| `window.casaOpenTool` n'est définie nulle part | Appelée à chaque clic d'étape |
| Le carnet est livré sans aucun lien pour y arriver | 680 Ko inaccessibles |
| `<title>Bundled Page</title>` | C'est ce que l'ado voit sous l'icône de son écran d'accueil |
| Pas de `<link rel="manifest">`, ni `lang`, ni `viewport` | « Ajouter à l'écran d'accueil » ne tiendra pas sa promesse |

Le prompt prêt à copier-coller est dans `PROMPT-DESIGN-CASA-ADOS.md`.

### ✍️ Pile 2 — pour Nawel (la doctrine)

**Les deux outils de l'espace spirituel n'existent nulle part.** Ce n'est pas un fichier
égaré : ils n'ont jamais été écrits.

Et ils ne sont **ni pour Design ni pour Codex**. Une muḥāsaba à hauteur d'ado, le dhikr
comme voie d'apaisement, les récits prophétiques rattachés aux émotions — c'est la
signature de Nawel et sa responsabilité. Design fait de l'esthétique ; il ne peut pas
inventer ça, et il ne doit pas.

Le cahier des charges est prêt : `SPEC-ESPACE-SPIRITUEL-ADO.md`.

### 🤔 Pile 3 — deux petites décisions de Nawel

1. **`appli-emotions-ados.html`** est livré mais appelé par aucun atelier. Soit il
   remplace `app-emotions-vocabulaire.html`, soit il sort du fonds.
2. **La bêta part-elle avec ou sans l'écran spirituel ?** L'architecture est tranchée
   (une seule app, espace en option). Reste à savoir si l'écran s'affiche dès la bêta
   alors que les deux ateliers sont vides — ou s'il attend qu'ils existent.

---

## Ce que Codex doit fournir

**Rien.** Son travail est dans le dépôt, vérifié et réparé. S'il reprend la main un
jour, ce sera pour écrire de nouveaux outils — pas pour rattraper ceux-là.
