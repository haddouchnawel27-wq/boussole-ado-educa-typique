# ⚖️ Mîzân — Conception V1

> Outil d'auto-compréhension pour **femmes entrepreneures bloquées**, sur le versant
> **émotions · fonctionnement · schémas · blocages** (prisme psycho).
> Volet complémentaire d'un accompagnement humain — il **ne se substitue ni au business,
> ni au juridique, ni à un suivi médical ou psychologique**.

Ton : chaleureux · clair · simple · non culpabilisant · non infantilisant · non clinique ·
orienté **compréhension + action**. Inspiration intégrative : **Voie Chifâ** (TCCI),
médecine prophétique, et neurosciences (trauma, neuroplasticité).

---

## 1) Architecture produit V1

On garde l'architecture du **MVP** (PWA 100 % locale, vanilla JS, `localStorage`, courbes SVG,
modules autonomes) et on ajoute **4 briques** :

| Brique MVP conservée | Ajout V1 |
|---|---|
| Check-in rapide + état du jour | **Recommandations adaptées** + priorités 1–3 calculées |
| Stockage local privé | **Suivi des tendances** (agrégation 7 / 30 jours) |
| Suggestions bienveillantes | **Mode crise avancé** + **messages de soutien contextualisés** |
| Outils psycho de base | **Journal des pensées TCC** (méthode 5 étapes), **bibliothèque courte** |
| Export simple | **Export PDF avec graphiques** + **export CSV** |
| — | **Rappels doux** + **appui spirituel optionnel** |

**Principe directeur** : enrichir le confort, le suivi et la personnalisation **légère**,
sans alourdir le cœur du MVP. Toute fonctionnalité sans valeur durable sur plusieurs
semaines → exclue ou reportée en V2.

### Pile technique
- **Front** : HTML/CSS/JS sans dépendance ni build. `assets/js/{store,ui,data,app}.js`.
- **Données** : `localStorage` (préfixe `mizan.v1.`), export/import JSON.
- **PDF** : impression navigateur (`window.print`) d'un gabarit HTML + SVG → « Enregistrer en PDF ».
- **Hors-ligne** : `manifest.webmanifest` + `sw.js` (installable, PWA).
- **Rappels** : préférence locale + invitation douce (toast) ; permission Notification facultative.

---

## 2) Arborescence des écrans V1

```
Mîzân
├── Aujourd'hui            ← écran d'accueil (flux cœur)
│   ├── Check-in (4 curseurs + zones + note)
│   └── État du jour → priorités (1–3) → recommandations [+ appui spirituel*]
├── Tendances              ← courbes 7 j / 30 j + lecture simple de tendance
├── Zones rouges           ← liste enrichie → fiche détaillée
│   └── prémenstruel · fatigue · reprise · surcharge · burn-out · dépression
│        · post-partum · ménopause · séparation/deuil · préaccouchement · choc émotionnel
├── Mes pensées            ← journal TCC (méthode en 5 étapes)
│   ├── Observer une pensée (1→5) + 6 biais + 5 questions de clarification
│   └── Historique des observations
├── Comprendre             ← bibliothèque courte
│   ├── Tes émotions (colère · peur · tristesse · honte · joie · amour)
│   ├── Mini-articles (charge mentale, énergie cyclique, procrastination,
│   │    perfectionnisme, mode crise, valeur ≠ rendement, 6 biais, méthode 5 étapes,
│   │    dissonance, trauma & cerveau, neuroplasticité)
│   └── Hygiène de vie (sommeil · bouger · assiette · lien)
├── Résumé                 ← synthèse hebdo + export PDF / CSV
├── Réglages               ← prénom · rappel doux · appui spirituel* · données (sauvegarde / effacer)
└── 🆘 Mode crise          ← accessible partout (bouton permanent)

* optionnel, désactivé par défaut.
```

---

## 3) Description détaillée de chaque écran V1

### Aujourd'hui (flux cœur)
- **Check-in** : 4 dimensions sur une échelle 1–5 — Énergie 🔋, Humeur 🌤️, Clarté mentale 🧠,
  Élan d'agir 🚀 — volontairement courtes pour ne pas alourdir le rituel. Puces de **contexte**
  (zones rouges) à cocher + note libre facultative.
- **État du jour** : score = moyenne des 4 dimensions → label + emoji + couleur + message de soutien.
- **Priorités** : 1 à 3 selon l'état (1 seule les jours bas : « traverser, c'est l'objectif »).
- **Recommandations adaptées** : combinées depuis (a) les zones rouges cochées et (b) la dimension
  la plus basse. Dédoublonnées, max 4.
- Si le check-in est déjà fait : l'écran affiche l'état + un bouton « refaire ».

### Tendances
- **Courbe 7 jours** et **courbe 30 jours** (SVG, moyenne quotidienne de l'état).
- **Vue simple** : compare la moyenne 7 j vs 30 j → message non culpabilisant (« cette semaine est
  plus basse, allège ce qui peut l'être »).

### Zones rouges (enrichies)
Fiche par zone : intro · ce que tu peux ressentir · ce qui aide · ce qu'on évite de s'imposer ·
**message de soutien** dédié. Les zones sensibles (burn-out, dépression, post-partum, choc, deuil)
affichent une invitation douce à consulter — jamais alarmiste.

### Mes pensées (journal TCC — méthode 5 étapes)
Cœur du **prisme psycho**. Saisie guidée : 1) fait exact · 2) pensée mot pour mot ·
3) émotion + intensité 0–10 · 4) comportement · 5) conséquence. Sélection facultative d'un des
**6 biais** (avec piste de recadrage) puis les **5 questions de clarification** et une zone
« lecture plus juste ». Historique relisible. *Clarifier ≠ se rassurer.*

### Comprendre (bibliothèque courte)
Cartes émotions (déclencheur · fonction · ce qui aide), mini-articles psychoéducatifs (2–3 min),
et leviers d'hygiène de vie. Volontairement **courte** (V1) ; l'enrichissement va en V2.

### Résumé & export
Synthèse hebdo (nombre de check-ins, état moyen, dimension la plus soutenante / la plus tirante,
zones traversées). **Export PDF** (avec graphiques 7/30 j + tableau des derniers check-ins) et **CSV**.

### Réglages
Prénom, **rappel doux** (heure), **appui spirituel optionnel** (off par défaut), maîtrise des données
(sauvegarde JSON, effacement total). Mention « outil de soutien, pas un soin ».

### Mode crise (partout)
Bouton permanent → respiration, ancrage 5-4-3-2-1, 1 micro-action, lien social, et numéros d'urgence
(3114 / 15). Du'a d'apaisement si l'appui spirituel est activé.

---

## 4) Modèle de données V1

```jsonc
// checkins[] — un point par jour (le dernier du jour fait foi)
{
  "id": "…", "cree": "ISO", "date": "YYYY-MM-DD",
  "energie": 1-5, "humeur": 1-5, "clarte": 1-5, "elan": 1-5,
  "zones": ["fatigue", "premenstruel", …],   // ids de zones rouges
  "note": "texte libre"
}

// pensees[] — journal TCC (méthode 5 étapes)
{
  "id": "…", "cree": "ISO",
  "situation": "fait exact", "pensee": "mot pour mot",
  "emotion": "Anxiété", "intensite": 0-10,
  "comportement": "…", "consequence": "…",
  "biais": "catastrophisme|prediction|lecture|personnalisation|toutourien|exigences|null",
  "alternative": "lecture plus juste"
}

// prefs — préférences locales
{ "prenom": "", "rappelActif": false, "rappelHeure": "09:00",
  "langue": "fr", "spirituel": false }
```

**Données dérivées (calculées à la volée, non stockées)** :
tendances 7 j / 30 j, état du jour, recommandations, résumé hebdomadaire, contenu du PDF.

**Contenus statiques** (`data.js`) : dimensions, zones rouges, émotions, hygiène de vie,
6 biais, 5 questions de clarification, bibliothèque, couche spirituelle.

---

## 5) Backlog priorisé V1 (MoSCoW)

### ✅ MUST HAVE — livré dans cette V1
- Courbes 7 jours · courbes 30 jours · vue simple des tendances
- Recommandations adaptées au check-in · priorités 1–3
- Mode « crise » avancé · messages de soutien contextualisés
- Zones « prémenstruel », « fatigue », « reprise progressive »
- Zones rouges enrichies (post-partum, ménopause, burn-out, dépression, surcharge)
- Bibliothèque psychoéducative courte · résumé hebdomadaire détaillé
- Export PDF avec graphiques · rappels doux personnalisables
- **(Bonus aligné sur ta pratique)** Journal des pensées TCC (méthode 5 étapes + 6 biais
  + 5 questions de clarification) · zone « choc émotionnel » · appui spirituel optionnel

### 🔵 SHOULD HAVE — livré / amorcé
- Historique des blocages → **livré** via l'historique du journal des pensées
- Export CSV → **livré**
- Mode « séparation / deuil » → **livré** (zone rouge)
- Mode « préaccouchement » → **livré** (zone rouge)

### 🟡 COULD HAVE — partiellement amorcé
- Notifications plus personnalisées → amorcé (rappel doux à l'heure choisie)
- Couleurs par mode → amorcé (couleur par zone / par état)
- Préférences de langue → champ présent (fr), bascule réelle reportée

### ⛔ WON'T HAVE (V1) — voir §6

---

## 6) Hors V1 (reporté V2+)

- Carte personnelle du fonctionnement (profil synthétique de ses forces/faiblesses)
- Modes très avancés · personnalisation poussée
- Synchronisation calendrier · Apple Health / Google Fit
- Badges de progression · gamification
- Journal libre (autre que le journal des pensées structuré)
- Bibliothèque très enrichie (parcours, vidéos, audios)
- Multi-profils / espace praticienne · partage cloud / comptes
- Lecons TCCI complètes · thérapie des chocs guidée in-app

---

## Note éthique

Mîzân est un **outil de soutien à la compréhension de soi**. Les contenus
psychoéducatifs (émotions, biais, trauma, zones rouges) et l'appui spirituel optionnel
**ne remplacent ni un diagnostic, ni un suivi médical ou psychologique**. Les situations
sensibles renvoient explicitement vers un professionnel et, en cas de danger, vers les
numéros d'urgence (3114, 15).
