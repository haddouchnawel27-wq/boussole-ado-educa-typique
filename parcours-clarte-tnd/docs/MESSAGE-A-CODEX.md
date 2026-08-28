# ✉️ Message à Codex — Casa des Ados

_À copier-coller tel quel. Le relevé complet est dans `BUGS-CASA-DES-ADOS.md`._

---

Salam Codex,

La Casa des Ados a été testée de bout en bout. **Le visuel est validé** — Nawel le
confirme. Navigation à quatre onglets fluide, les 11 ateliers et les 6 espaces
s'affichent, le check-in humeur répond, zéro erreur JavaScript, aucune ressource en
échec. C'est du beau travail.

Il reste **un bloquant et cinq défauts**. Le relevé détaillé est dans
`parcours-clarte-tnd/docs/BUGS-CASA-DES-ADOS.md`, sur la branche `claude/casa-familles`.
Je n'ai rien corrigé — l'app est à toi, je ne pousse pas sur ta branche.

**Travaille sur `Mobile_app_concept_3.zip`, dossier `deploy/`.** C'est la version la plus
récente et la seule prête à héberger ; les concepts 1 et 2 contiennent une version
antérieure.

---

## 🔴 Le bloquant : les 22 outils sont injoignables une fois en ligne

Chaque étape d'atelier pointe vers
`uploads/Casa_des_Ados_SIMPLE_A_OUVRIR/ressources/ados/<outil>.html`.
Ce dossier **n'est pas dans `deploy/`** — le paquet ne contient que `index.html`,
`carnet.html`, deux icônes et `manifest.json`. Le README affirme pourtant que « les 22
outils sont **dans** les fichiers ».

Résultat : l'ado choisit son atelier, clique sur la première étape, et tombe sur une
page blanche. **22 liens sur 22 sont morts.**

Le catalogue lui-même est sain : les 22 fichiers appelés existent tous chez toi, aucun
nom ne manque. C'est uniquement le paquet d'export qui est incomplet.

**Correction :** copier `ressources/ados/` dans `deploy/`, et réécrire la base des liens
en `outils/` — plus court et moins fragile que le chemin `uploads/…` actuel.

## 🟠 `window.casaOpenTool` n'est définie nulle part

Le code l'appelle à chaque clic d'étape ; elle n'existe ni dans `index.html` ni dans
`carnet.html`. Le clic retombe sur le `href` de l'ancre — donc sur le lien mort ci-dessus.
Une fois les outils livrés ça marchera par accident : soit définir la fonction, soit
retirer le crochet.

## 🟠 Le carnet est livré mais inaccessible

`carnet.html` (624 Ko) est bien dans le dossier. Aucun bouton, aucun lien, aucune mention
dans le DOM ne permet d'y arriver. Il faut connaître l'URL.

## 🟡 Le titre de l'onglet est « Bundled Page »

`<title>Bundled Page</title>` dans `index.html`. C'est ce que l'ado verra dans son onglet
et sous l'icône ajoutée à l'écran d'accueil. `carnet.html`, lui, est correct.

## 🟡 Le `manifest.json` n'est relié à aucune page

Ni `index.html` ni `carnet.html` ne portent `<link rel="manifest">`. Le README promet
« Ajouter à l'écran d'accueil » avec l'icône ✦ et le plein écran : sans ce lien, Android
ne lit pas le manifeste. Manquent aussi `<html lang="fr">`, `<meta name="viewport">` et
`<meta name="theme-color">`.

## 🟡 Liens internes cassés dans les outils eux-mêmes

Dans `ressources/ados/` :

| Cible appelée | Occurrences | État |
|---|---|---|
| `../../ados.html` et `../ados.html` | 30 | absente du paquet |
| `../../_assets/charte.css` et `../_assets/charte.css` | 12 | absente du paquet |
| `moi-et-coachy.html` | 2 | renommé `Moi_et_Coachy_Accueil.html` |
| `mode-emploi-moi-meme.html` | 1 | renommé `Mon_Mode_Emploi.html` |
| `coachy_v1.html` | 1 | renommé `Coachy.html` |

La feuille de style manquante est bénigne — les 12 outils concernés portent tous un
`<style>` en ligne complet. Les flèches de retour et les trois renommages, non.

## 🟡 Un outil orphelin

`appli-emotions-ados.html` est livré mais appelé par aucun atelier. Soit il remplace
`app-emotions-vocabulaire.html`, soit il est à retirer.

---

## Ce qui est bon — à ne pas casser en corrigeant

- **Le mot « diagnostic » n'apparaît que sous forme protectrice** (« ces outils donnent
  des pistes, jamais un diagnostic »). Règle de Nawel : on ne pose pas de diagnostic,
  le mot ne doit jamais apparaître autrement.
- **Aucune trace de l'ancienne marque.** Ni « Voie Chifa », ni « Nawell ». C'est
  Jannat Al Qalb, et Nawel avec un seul L.
- **Aucun lien vers l'espace Famille ni vers l'espace Pro.** La cloison entre les trois
  espaces est absolue — elle tient, qu'elle continue de tenir.
- **Aucune donnée ne sort du navigateur.** Pas d'appel réseau, pas de formulaire distant.

Le cadrage des trois espaces est dans `parcours-clarte-tnd/docs/REPARTITION-3-ESPACES.md`.

Bon courage 🤝
