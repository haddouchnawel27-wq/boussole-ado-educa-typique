# ✉️ Prompt pour Claude Design — Casa des Ados

_À copier-coller tel quel. Préparé le 2 septembre 2026._

---

Salam,

La Casa des Ados est belle et je ne touche pas au visuel — navigation à quatre onglets
fluide, 13 ateliers, 6 espaces, le check-in humeur, l'écran d'ouverture de l'espace
spirituel : tout ça est juste, et testé sans une seule erreur JavaScript.

Il reste **cinq points, tous dans la coquille de l'app**. Le premier est bloquant, les
quatre autres sont rapides.

## 🔴 1. Les 23 outils ne sont pas dans l'export

Chaque étape d'atelier pointe vers
`uploads/Casa_des_Ados_SIMPLE_A_OUVRIR/ressources/ados/<outil>.html`.
Ce dossier n'est dans aucun des exports livrés — ni `Mobile_app_concept_3/deploy/`, ni
le dernier paquet. Résultat : **23 liens sur 23 tombent en 404** dès que l'app est en
ligne. L'ado choisit son atelier, clique, et se retrouve devant une page blanche.

**Les fichiers ne sont plus à chercher.** Ils sont maintenant dans le dépôt, à
`parcours-clarte-tnd/outils-ado/`, branche `claude/casa-familles` :

- les 23 outils, complets et autonomes ;
- leurs 31 liens internes réparés — la flèche de retour, la charte et les trois outils
  qui avaient été renommés pointent tous vers des fichiers qui existent ;
- vérifiés un par un : 23/23 s'affichent, zéro erreur JavaScript.

**Ce qu'il faut faire :** embarquer ce dossier dans l'export, et faire pointer les liens
d'atelier vers `outils/` plutôt que vers le chemin `uploads/…` actuel — plus court, plus
lisible, et il ne dépend plus du nom d'un ancien ZIP.

## 🟠 2. `window.casaOpenTool` n'existe pas

Le code l'appelle à chaque clic d'étape :
`done:(e) => { if (window.casaOpenTool && window.casaOpenTool(s.f, s.t)) e.preventDefault(); }`
La fonction n'est définie ni dans l'app, ni dans le carnet. Le clic retombe donc sur le
`href` de l'ancre. Ça marchera « par accident » une fois le point 1 réglé — autant
définir la fonction, ou retirer le crochet.

## 🟠 3. Le carnet est livré mais inaccessible

`Carnet - La Casa des Ados.html` (680 Ko) est bien dans le paquet. Aucun bouton, aucun
lien, aucune mention dans le DOM ne permet d'y arriver : il faut connaître l'URL.

## 🟡 4. Le titre de l'onglet est « Bundled Page »

`<title>Bundled Page</title>` dans l'app. C'est ce que l'ado verra dans son onglet et,
surtout, sous l'icône ajoutée à son écran d'accueil. Le carnet, lui, est correct :
« La Casa des Ados — Educa Typique ».

## 🟡 5. Le manifeste n'est relié à aucune page

Pas de `<link rel="manifest">`, et il manque aussi `<html lang="fr">`,
`<meta name="viewport">` et `<meta name="theme-color">`. Sans ça, « Ajouter à l'écran
d'accueil » ne donnera ni le nom, ni l'icône ✦, ni le plein écran promis par le README.

---

## Ce qu'il ne faut surtout pas casser

- **Le mot « diagnostic » n'apparaît que sous forme protectrice** — « ces outils donnent
  des pistes, jamais un diagnostic ». Règle absolue de Nawel : on ne pose pas de
  diagnostic, et le mot ne doit jamais apparaître autrement.
- **Aucune trace de l'ancienne marque.** C'est **Jannat Al Qalb**, et **Nawel** avec un
  seul L. « Voie Chifā » n'existe plus.
- **Aucun lien vers l'espace Famille ni vers l'espace Pro.** La cloison entre les trois
  espaces est absolue.
- **Aucune donnée ne sort du navigateur.** Pas d'appel réseau, pas de formulaire
  distant. C'est une promesse faite à l'ado, écrite noir sur blanc dans l'app.

## Sur l'espace spirituel

L'architecture est validée par Nawel : **une seule app, l'espace spirituel proposé en
option au début du parcours**. Ne le retire pas de la conception.

Mais ses deux ateliers sont vides — `emotion-5-etapes-spirituel.html` et
`point-semaine-spirituel.html` n'existent nulle part. **Ces deux-là ne sont pas pour
toi** : c'est du contenu de doctrine, Nawel les écrit elle-même.

En attendant, dis-nous ce que tu préfères : masquer l'écran d'ouverture le temps de la
bêta, ou le laisser visible en sachant qu'un ado qui répond « oui » tombera sur du vide.
Nawel tranchera.

Le relevé complet est dans `parcours-clarte-tnd/docs/BUGS-CASA-DES-ADOS.md`, et le
cadrage des trois espaces dans `REPARTITION-3-ESPACES.md`.

Bon courage 🤝
