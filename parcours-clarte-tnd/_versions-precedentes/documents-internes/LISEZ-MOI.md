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
