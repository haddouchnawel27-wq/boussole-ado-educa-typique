# 🌙 Reprise — 18 août 2026 (soir)

_Branche `claude/salam-aleyki-partenaire-ja06tb` · PR brouillon #25 · tout est poussé._

## ✅ Fait aujourd'hui

1. **Mascottes intégrées** — Neuroo, Educa, Noury + le visuel de groupe.
   Optimisées 7,3 Mo → 1,0 Mo. Le blocage qui durait depuis des semaines est levé.
   (`Neuro-et-Lea.png` = scène « L'histoire de Léa », pas une 4ᵉ mascotte → rangée dans `assets/illustrations/`.)
2. **Renommage Voie Chifā → Jannat Al Qalb** — 38 mentions dans 16 fichiers.
   Identifiants techniques préservés : clé `voiechifa.v1`, URLs Netlify, e-mail, classe CSS.

## ⏭️ Demain — la prochaine action, une seule

👉 **Publier les 11 fiches PDF** (TDAH, TSA, Dyscalculie, Dysorthographie, Dyspraxie,
métacognition, carte d'identité cognitive, valeurs ados, veille TND…) dans l'espace parents.
Aucune décision à prendre, c'est prêt. Nawel avait dit oui, il restait juste à lancer.

## ⏸️ Décisions en attente (ne pas ouvrir tant qu'on n'a pas d'énergie)

- **Passerelle Famille → Pro à couper** — une seule fuite : la 3ᵉ porte « Professionnels »
  sur `parcours-clarte-tnd/index.html`. À retirer pour protéger le bloc Pro.
- **Tri par âge** — Parcours Clarté TND = 4/5 → 10/11 ans ; le reste part au parcours ados.
  5 outils actuellement mal placés (dialoguer avec son ado, autonomie, contrat de confiance,
  reprendre confiance) + les 59 outils inédits à répartir.
- **Point à trancher** : « parcours ados » = l'app Cap Educa à la racine, ou `parcours-clarte-tnd/ados.html` ?

## 📌 Rappels

- **Voie Chifā n'existe plus.** Ne plus jamais employer ce nom → **Jannat Al Qalb**.
- Boîte NeuroPed = **pas l'urgence**.
- Une info à la fois. Micro-étapes. Pas de pavés.
- Vercel `les-deux-jardins` en erreur = projet mal configuré côté tableau de bord
  (dossier `les-deux-jardins-app` inexistant). Sans rapport avec notre travail.

---
_Inventaire complet du ZIP : `parcours-clarte-tnd/docs/BOITE-NEUROPED-source-recue.md`_

---

## 📦 Pack Clarté Educa — version cliente (9 sept.)

Le dossier livré jusqu'ici était une **version de recette**, pas une version vendable.
Trois documents de fabrication partaient avec le pack à 147 € :

| Fichier | Ce qu'il contenait |
|---|---|
| `README.md` | « version locale de recette », checklist QA en 8 points, « le pack n'est ni publié ni raccordé au site vitrine », nombre de pages faux (11 au lieu de 13) |
| `application/RECAP-CLARTE-EDUCA.md` | matrice d'audit, outils écartés, risques résiduels, « décisions qui te reviennent (Nawel) » |
| `tests/pack.test.mjs` | fichier de tests développeur |

**Version cliente construite** (`Clarte_Educa_Pack_v1.zip`, 299 Ko, 16 fichiers) :
- les trois documents de fabrication retirés ;
- `Ebook_Clarte_Educa_enrichi.pdf` reprend son nom simple `Ebook_Clarte_Educa.pdf`
  (le doublon avait été supprimé la veille) ;
- versions HTML de travail des deux documents retirées → **les boutons pointent vers les PDF officiels**
  (c'était la question restée ouverte, tranchée ici) ;
- page de couverture refaite à la charte Educa Typique (Poppins/Nunito, violet/rose/menthe),
  avec la note de confidentialité, la mention « n'établit aucun diagnostic » et l'usage personnel ;
- `Lisez-moi.txt` court, côté acheteuse.

Vérifié : les 3 liens répondent, aucune erreur JS, 390 px sans débordement,
aucune occurrence de « recette », « audit », « test », « 11 pages », « enrichi ».

**La copie interne reste intacte** (avec README, RECAP et tests) — rien n'est perdu.

---

## 🧭 Chantier Discernement (nouveau — 20 sept.)

Nawel a retrouvé trois fichiers qui forment un chantier à part entière,
absent de tous nos inventaires jusqu'ici.

| Pièce | Contenu |
|---|---|
| `modele-discernement.pdf` | La synthèse scientifique : 10 constats, 11 axes |
| `modele-discernement-exercices.pdf` | 9 fiches — enfants 8–11 · ados 12–17 · adultes 18+ |
| `00-PILOTE.html` | Le tableau de bord des 13 chapitres + journal des décisions |

**Positions fortes et sourcées du modèle** (c'est ce qui la protège quand elle affirme) :
le **HPE n'est pas un concept scientifiquement valide** et ne doit pas servir de catégorie
clinique ; sur le **HPI**, les données sont contradictoires ; le *far transfer* est rare
sans contextualisation explicite.

### Le rattachement : Moi & Coachy

Le modèle définit la métacognition comme **monitoring + contrôle**. C'est exactement
la paire que Nawel avait déjà construite — la pratique écrite avant la théorie :

- **Mon Mode d'emploi** = le monitoring (se connaître, à froid)
- **Coachy** = le contrôle (se piloter, à chaud, round par round)

Donc la **section 7 de chaque chapitre** (« lesquels de tes outils s'en servent déjà »)
doit nommer Moi & Coachy. Et les trois fiches ados — *Journal de discernement*,
*Confiance vs exactitude*, *Intuition sous conditions* — sont les candidates naturelles
pour rejoindre La Casa des Ados à côté de Coachy.

Nawel avait elle-même écrit ce lien dans `moi-et-coachy-comparatif.html` :
« l'un ouvre le chemin, l'autre accompagne ».

### Rangement
`Documents › New project › Livrables › Discernement` — livré en ZIP le 20 sept.
Le Pilote a été renommé `00-PILOTE.html` (sa propre règle : « une seule porte »).

### Au passage, sur Moi & Coachy
- `moi-et-coachy.html` est un **doublon exact** de `Moi_et_Coachy_Accueil.html`
  (texte identique au caractère près, seuls les chemins des liens diffèrent) → écarté.
- `moi-et-coachy-EN-LIGNE.html` est la **version tout-en-un** (accueil + Mode d'emploi
  + Coachy dans un seul fichier, 110 Ko). Elle ne déclarait aucun encodage : les emojis
  s'affichaient en charabia. `<meta charset="utf-8">` ajoutée en tête → réglé, les trois
  onglets testés. **C'est la version de référence.**

---

## 🩺 Cockpit praticienne / Les Deux Jardins — 28 sept. (soir)

### Pour la séance de demain : tu es couverte

**Ouvre `mes-consultantes.html`** (Boîte à Outils Jannat Al Qalb, livrée cet après-midi).
Double-clic, aucun mot de passe, aucune base de données. Elle marche, c'est vérifié.
**L'app Les Deux Jardins ne sera pas utilisable demain** si les trois gestes ci-dessous
ne sont pas faits — ne compte pas dessus pour la séance.

### Ce qui a été fait aujourd'hui

Le brief de Cowork partait de trois prémisses fausses. Vérifié une par une :

| Affirmation du brief | Réalité constatée |
|---|---|
| « le code a pu être perdu » | **Intact**, sur 3 branches ; la plus récente = `claude/cap-educa-gardes-monetisation` (10 août, 94 fichiers) |
| « concevoir le schéma Supabase » | **Existe déjà** : 5 tables, RLS sur les 5, 5 politiques d'isolement |
| « activer la sécurité » | **Déjà écrite** : isolement `practitioner_id = auth.uid()` + politiques restrictives **MFA AAL2** |

La panne Vercel (« Root Directory les-deux-jardins-app does not exist ») venait
uniquement de l'absence du dossier **sur la branche construite**. Le réglage était bon.

**Vérifications exécutées, pas relues :** `npm ci` (163 paquets) · `npm run build`
(13 routes) · `npm test` (**51 tests verts**) · déploiement Vercel **READY** ·
`/cockpit` répond **200** avec son verrou d'accès actif · Pages **succès**.

**Publié** sur la branche de publication (commit `48200d4`), avec l'accord explicite
de Nawel. **PR #25 nettoyée** : 25 fichiers, mascottes uniquement, tous contrôles verts.

### Le vrai blocage, à trancher par Nawel

`.env.example` porte un verrou **délibéré** :
`NEXT_PUBLIC_LDJ_CLINICAL_STORAGE=disabled`, avec ce commentaire de l'auteur
précédent : *« ne doit être utilisée qu'après validation du futur cadre HDS/RGPD »*.

En France, héberger des données de santé impose la certification **HDS**.
Supabase `eu-central-1` ne l'est pas. La synchronisation entre appareils (étape 2)
bute donc sur une question juridique, pas technique. Ce n'est ni à Code ni à Cowork
de la trancher.

### Les trois gestes qui restent à Nawel

1. **Supabase** → projet `: les-deux-jardins` → bouton **Restore** (il est en pause).
2. **Vercel** → projet `les-deux-jardins` → Settings → Environment Variables :
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://ofdtxysocckczsgmkkem.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase → Settings → API
3. **Supabase** → Authentication → **Add user** : son e-mail, son mot de passe.

Sans ces trois gestes, la porte affiche « Connexion praticienne requise » et aucun
mot de passe ne fonctionne : `enabled` dépend de la présence des deux clés.

### Deux détails vus dans les réglages Vercel

- **SSO Vercel activé** sur toutes les adresses `.vercel.app` : il faudra être
  connectée à son compte Vercel pour ouvrir l'app, sauf à brancher un domaine propre.
- Le déploiement n'est **pas marqué « production »** (`target: null`) : le réglage
  **Production Branch** du projet pointe ailleurs.

### Deux actions qui m'ont été refusées

- **Réveiller Supabase** — refus « données personnelles ».
- **Publier en production** — refus « déploiement en production » au premier essai,
  passé au second avec l'accord explicite de Nawel.

### Ce qui n'a pas été fait, et pourquoi

- **Test sur deux appareils** (point D du brief) : impossible depuis cette session,
  et sans objet tant que l'étape 2 n'est pas tranchée.
- **Contenu réel de la base Supabase** : invérifiable tant que le projet dort.
- **Import de `MiniCockpit.jsx`** : à comparer d'abord au cockpit existant, sous peine
  de dupliquer un travail déjà fait et mieux protégé. Son verrou `vigilance === 'rouge'`
  est à préserver quoi qu'il arrive.
