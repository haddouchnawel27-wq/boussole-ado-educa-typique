# Documents internes — retirés du site

Ce dossier ne contient aucun fichier : il documente ce qui a été **sorti du dossier publié**
et pourquoi. Rien n'est perdu, tout se récupère depuis l'historique Git.

---

## `Veille_TND.pdf` — ancienne version, 19 pages

**Retiré du site le 26 août 2026.**

### Ce qu'il y avait dedans

Le fichier portait le nom d'une veille de recherche, mais seules les **3 premières pages**
en étaient une. Les pages 3 à 19 étaient un **document de travail interne**, jamais relu
avant publication. On y trouvait :

- la description commerciale des services Educa-Typique et leurs cibles ;
- une section intitulée « PAGE DE VENTE ULTRA-COMMERCIALE » ;
- une **grille tarifaire** — « À partir de 350 € » ;
- des **fragments de conversation avec une IA**, non nettoyés
  (« Je te laisse choisir la SUITE (je fais, tu valides) », « je te challenge, brutalement honnête »…) ;
- un script d'appel téléphonique et un argumentaire de démarchage auprès des directions ;
- des champs jamais remplis — « Cordialement, [Nom] Educa-Typique [Coordonnées] ».

### Pourquoi c'était un problème

Le fichier était **téléchargeable publiquement** et **lié depuis la Casa des Familles**,
dans la section « Fiches à imprimer ». Les tarifs, les argumentaires de vente et les
brouillons de travail étaient donc accessibles aux familles accompagnées.

### Ce qui l'a remplacé

`ressources/Veille_TND.pdf` — **3 pages, à la charte EducaTypique**, reprenant uniquement
le contenu de veille réel : essai eTNS, thérapies digitales, méta-analyses fonctions
exécutives, récupération active et espacement, plus le kit séance de 15 minutes.
Zéro mention commerciale.

### Comment récupérer l'original

```bash
git show d08addb:parcours-clarte-tnd/ressources/Veille_TND.pdf > Veille_TND-original.pdf
```

Il reste aussi dans le ZIP source (`_pdfs_nawel/`) sur la machine de Nawel.

> ⚠️ **À ne pas remettre en ligne tel quel.** Si le contenu commercial doit servir,
> sa place est dans un dossier privé, pas dans un dossier servi par Vercel ou GitHub Pages —
> même sans lien, une URL directe reste accessible.

---

## `bmv_p1.pdf` et `bmv_p2.pdf` — propriété d'un tiers

**Retirés du site le 27 août 2026, sur décision de Nawel.**

### Pourquoi

Ces deux PDF ne sont pas de nous. Ils portent la mention :

> *« Propriété de Aziza AZRI, fondatrice Madrassa LMDE — INPI, tous droits intellectuels
> réservés. Copie et partage interdit. »*

Ils étaient déposés dans `ressources/`, dossier publié. Aucune page ne pointait dessus,
mais **une URL directe suffisait à les télécharger** — un dossier servi par Vercel ou
GitHub Pages l'est en entier, lien ou pas. Diffuser un document marqué « partage interdit »
depuis le site d'Educa Typique n'était pas tenable.

### Ce qui a été fait

Les fichiers sortent de l'arborescence publiée et la ligne « bmv 1-2 » disparaît de
`INVENTAIRE.md`. Aucun lien ne pointait dessus : rien ne casse.

### Comment les récupérer

```bash
git show 62abb28:parcours-clarte-tnd/ressources/bmv_p1.pdf > bmv_p1.pdf
git show 62abb28:parcours-clarte-tnd/ressources/bmv_p2.pdf > bmv_p2.pdf
```

> ⚠️ **Pour consultation personnelle uniquement.** Ces documents restent la propriété
> de leur autrice. Ils ne doivent être ni republiés, ni redistribués, ni intégrés à un
> produit Educa Typique. Pour un contenu équivalent sur le site, il faut une création
> originale — ou l'autorisation écrite d'Aziza AZRI.
