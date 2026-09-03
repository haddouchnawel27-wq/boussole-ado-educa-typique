# 🌙 Reprise — 28 août 2026 (soir)

_Branche `claude/casa-familles` · PR brouillon #27 · tout est poussé._

> **Posture Sereine est fait. La Casa des Ados est auditée. On reprend sur l'espace
> maternelle 4-6 ans de la Casa des Familles.**

---

## Où on en est sur Posture Sereine

Nawel a envoyé le ZIP complet et la présentation de projet. J'ai lu les deux.

**Ce que c'est, maintenant que c'est clair :** un accompagnement de cabinet pour des femmes
entrepreneures qui ont les compétences mais restent bloquées de l'intérieur. La méthode
repose sur **4 cartographies** — émotionnelle, cognitive, du fonctionnement, des blessures
entrepreneuriales — qui produisent une **Carte de Posture** personnelle. Puis un parcours
en 5 étapes : candidature → entretien → questionnaire → séance individuelle → 8 semaines
en collectif, 5 femmes en bêta.

**Al Mizan n'est pas « lié » au programme, il est dedans.** Dans
`02_ESPACE_CONSULTANTE/Outils_progressifs/` : `BoussoleinterieureAlMizan`,
`FaceauregardAlMizan`, `Outil_Orientation_Adulte_Entrepreneure_AlMizan`. C'est la boîte à
outils de la consultante. L'intention posée par Nawel : l'app sert le parcours, pour
accompagner les auto-entrepreneuses bloquées.

### Fait aujourd'hui

**La présentation de projet est régénérée.** Le PDF que Nawel avait sous la main portait
encore « Cabinet Voie Chifa » et « Nawell » (deux L) sur les 11 pages — c'était un vieux
rendu. La version HTML du pack, elle, était déjà correcte : Jannat Al Qalb, Nawel. Il n'y
avait donc rien à réécrire, seulement à régénérer depuis la bonne source.

Trois défauts de mise en page corrigés au passage :

| Défaut | Correction |
|---|---|
| « La Cartographie de Posture » débordait de 55 mm | Coupée en deux — cartographies 1-2, puis 3-4 sous un bandeau « — suite », comme dans le PDF d'origine |
| « Format bêta » dépassait de 9 mm : son pied de page partait seul sur une feuille blanche | Page resserrée localement (classe `serre`) |
| Le dernier bloc forçait une page blanche finale | `page-break-after:auto` sur le dernier bloc |

Résultat : **11 pages, aucune page vide, zéro mention de l'ancienne marque.**
Le fichier a été remis à Nawel directement — il n'est pas dans le dépôt.

### ⚠️ À ne jamais oublier sur ce pack

Il contient `Grille_Tarifaire_Posture_Sereine`, `Proposition_Cohorte_Beta_DOCUMENT_INTERNE`,
`Manuel_Animation — document interne` et un dossier `04_ARCHIVES_NON_DIFFUSABLE`.

**Rien de tout cela ne doit atterrir dans un dossier publié.** Un dossier servi par Vercel
ou GitHub Pages l'est en entier : un fichier sans lien reste téléchargeable par URL
directe. C'est exactement ce qui était arrivé avec la Veille TND.

### Ce qui reste ouvert sur Posture Sereine

- Le **recouvrement Al Mizan / Le point du jour** : les deux proposent un check-in
  quotidien. Le point du jour ajoute une porte « J'ai besoin d'aide, maintenant » et
  fonctionne hors ligne. À trancher un jour : porte d'urgence d'Al Mizan, ou produit
  distinct. Pas urgent.
- Le **générateur de fiches** (`index.html` envoyé par Nawel) est **cassé** : il appelle
  `styles.css`, `app.js` et `dashboard.html` qui manquent. Son idée — que chaque
  praticienne y mette son propre nom d'entreprise — est un vrai produit, et c'est
  l'espace Pro, donc **Cowork**. La spec reste à écrire.

---

## Ensuite : les Casas

### 🏠 Casa des Familles — l'état au 28 août

45 outils, 11 fiches à imprimer, lisible par âge : 👶 0-10 ans · 🧑 ado · 💗 quel que soit
son âge. Aucun chemin vers l'espace ado ni vers le pro. Zéro erreur JavaScript.

**Le seul chantier restant : l'espace maternelle 4-6 ans.** Le catalogue démarre à 6 ans,
la Casa annonce 4-5. Quatre outils courts, la matière existe (le livret belge sur les
fonctions exécutives en maternelle) :

1. **Ma posture d'abord** — ce que l'adulte fait avant de sortir un jeu
2. **Les 4 muscles du cerveau** — attention, mémoire, freinage, souplesse
3. **Jouer pour muscler** — activités testées en classe, refaisables à la maison
4. **Le retour au calme des petits** — bouteille à paillettes, massages, bâton de pluie

Mon avis : commencer par **« Ma posture d'abord »**, c'est celui qui rend les trois autres
efficaces.

### 🧑 Casa des Ados — auditée le 28 août au soir

Nawel a envoyé trois paquets (`Mobile_app_concept_1/2/3.zip`). **Le bon est le 3, dossier
`deploy/`** — les deux premiers contiennent une version antérieure.

**Le visuel est validé par Nawel.** Testé à 420×860 : navigation à quatre onglets fluide,
les 11 ateliers et les 6 espaces s'affichent, le check-in humeur répond, **zéro erreur
JavaScript, aucune ressource en échec**.

**Un bloquant :** les 22 outils sont injoignables une fois en ligne. Chaque étape pointe
vers `uploads/Casa_des_Ados_SIMPLE_A_OUVRIR/ressources/ados/…`, dossier absent du paquet.
22 liens sur 22 morts. Le catalogue est sain — les 22 fichiers existent tous dans la livraison d'outils d'origine,
c'est le paquet d'export qui est incomplet.

Cinq défauts en plus : `window.casaOpenTool` jamais définie · le carnet livré sans aucun
lien pour y arriver · `<title>Bundled Page</title>` · le `manifest.json` relié à aucune
page (donc « Ajouter à l'écran d'accueil » ne tiendra pas sa promesse) · des liens
internes cassés dans les outils eux-mêmes, dont trois fichiers renommés.

Ce qui tient et qu'il ne faut pas casser : le mot « diagnostic » n'apparaît que sous forme
protectrice, aucune trace de l'ancienne marque, aucun lien vers Famille ni vers Pro,
aucune donnée qui sort du navigateur.

📄 Le relevé : `parcours-clarte-tnd/docs/BUGS-CASA-DES-ADOS.md`
✉️ Le message prêt à copier-coller : `parcours-clarte-tnd/docs/MESSAGE-A-DESIGN.md`

**Rien n'a été corrigé — l'app est à Claude Design, qui a repris la Casa des Ados.**
Nawel a validé le message le 28 au soir ; reste à le lui transmettre.

### 🧑‍⚕️ Espace Pro — Cowork

Le prompt lui a été remis. Le document commun aux trois agents est dans
`parcours-clarte-tnd/docs/REPARTITION-3-ESPACES.md`.

---

## 🌙 Fait dans la nuit du 2 au 3 septembre

**Les 23 outils ados sont dans le dépôt**, à `parcours-clarte-tnd/outils-ado/`. Le dépôt
n'en avait que 7 ; les 16 autres ne vivaient que dans un ZIP, ce qui explique que chaque
export de l'app les oubliait. 16/16 vérifiés, zéro erreur JavaScript, et **31 liens
internes réparés** — les cinq cibles des 23 outils existent maintenant toutes.

**Codex sort du chemin critique.** Il n'a plus rien à fournir.

Trois documents t'attendent :

| Document | Ce que c'est |
|---|---|
| `docs/RELAIS-CODEX-DESIGN.md` | Le tri que tu m'as demandé : qui fait quoi, en trois piles |
| `docs/PROMPT-DESIGN-CASA-ADOS.md` | Le prompt prêt à copier-coller pour Claude Design |
| `docs/SPEC-ESPACE-SPIRITUEL-ADO.md` | Le cahier des charges des deux outils spirituels |

## 🌿 Journée du 3 septembre

**Fait et livré :**

| Quoi | Où |
|---|---|
| **Jannat Al Qalb** — la page était nue, les 4 actifs sont servis | branche par défaut, en ligne |
| **« Jeu Chitane » devient « Le tri des pensées »** — 49 remplacements, nom et code | `apps/tri-des-pensees.html` |
| **La ludothèque adultes** — bouton « Arrêter » sur les 4 jeux, et arrêter tôt ne renvoie plus un zéro | envoyée en fichier |
| **« Mon point de la semaine »** — le premier des deux outils spirituels | envoyé en fichier, à essayer |
| **Le paquet des 23 outils** pour Claude Design | envoyé en zip |

**Deux décisions de Nawel, structurantes :**

**« On ne les transforme pas en jeux, on ne les occidentalise pas. »** D'où trois
interdits dans tout l'espace spirituel : on ne cache pas, on ne chronomètre pas, on ne
compte pas. Et le mot « jeu » lui-même est à éviter — on dit *atelier*.

**Les Noms d'Allah ne vont dans aucun quiz.** Ils deviennent un ancrage dans l'espace
émotion : quel Nom, dans quelle situation. Ça donne sa matière au second fichier
manquant.

**Le plan des 25 écrans est écarté** — comptes, géolocalisation, salons de mineurs,
classements. Trois éléments seulement en sont retenus.

**Ce qui attend :** les invocations par situation (le stress et les examens en porte
d'entrée), les cartes de connaissance sur papier, et le second outil spirituel.
Tout est détaillé dans `parcours-clarte-tnd/docs/SPEC-ESPACE-SPIRITUEL-ADO.md`.

## ✅ Tranché le 2 septembre

**Une seule Casa des Ados, espace spirituel en option au début du parcours.** Pas de
seconde app. Détail et cahier des charges des deux outils :
`parcours-clarte-tnd/docs/SPEC-ESPACE-SPIRITUEL-ADO.md`.

## ⏸️ Les décisions qui attendent Nawel

1. **Le modèle de la formation harcèlement** — gratuite dans la Casa, ou réservée aux
   familles accompagnées ? Elle est prête, à la charte, avec sauvegarde automatique, et
   volontairement non publiée. C'est une décision commerciale.
2. **`les-deux-jardins` sur Vercel** — échoue depuis des semaines. Son dossier racine
   pointe vers `les-deux-jardins-app`, absent de toutes les branches. **Ça se corrige dans
   le tableau de bord Vercel, pas dans le code.**
3. **La PR #27** — en brouillon depuis le début, tout est vert. La passer en « prête » ?

---

## 🎯 Demain, on attaque quoi

**L'espace maternelle 4-6 ans** — le dernier trou de la Casa des Familles. Quatre outils
courts, la matière existe. On commence par **« Ma posture d'abord »** : c'est celui qui
rend les trois autres efficaces.

_Note : le déploiement Vercel de `les-deux-jardins` échoue à chaque commit depuis des
semaines. Ce n'est causé par aucun de nos changements — c'est le dossier racine du projet.
Diagnostiqué, signalé une fois, plus jamais re-signalé. À ignorer._
