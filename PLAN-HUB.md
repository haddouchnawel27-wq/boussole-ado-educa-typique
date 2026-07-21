# 🧰 Hub « Couteau Suisse » — proposition d'architecture (à valider avant de coder)

_Rédigé le 7 juillet 2026. Objectif : rassembler TOUTES les apps de Nawel en une seule porte
d'entrée installable, sans rien perdre ni casser. À valider par Nawel avant construction._

---

## 1. Principe

**Un Hub unique = une PWA installable** (hébergée sur le dépôt GitHub Pages actuel), qui présente
**deux univers** + **passerelles**, et prépare un **3ᵉ espace praticienne** à accès restreint.

```
                        ┌──────────────────────────┐
                        │      HUB (porte unique)   │   ← installable, hors-ligne
                        │   choix de l'univers      │
                        └───────────┬──────────────┘
              ┌─────────────────────┴─────────────────────┐
        🌷 EDUCA TYPIQUE                             🌿 JANNAT AL QALB
        (familles / neuro-éduc.)                    (psycho-spirituel)
        • Boussole                                  • Al Mizan Al Qalb
        • Parcours Clarté TND (Boîte NeuroPed)      • Souffle & Lumière
        • Chef de Chantier                          • Vitrine Jannat al Qulûb
        • Décodeur profil, bilans, profils…         • Boussole/émotions Voie Chifā (ISL)
              └─────────────────────┬─────────────────────┘
                        🔒 ESPACE PRATICIENNE (accès restreint — futur)
                        anamnèses · comptes-rendus · décodeur CR · assistante
```

## 2. Comment chaque app est rattachée (statut réel)

| Type | Rattachement dans le Hub | Apps concernées |
|---|---|---|
| 🟢 **Dans le repo** | **Lien interne** (même origine, hors-ligne) | Boussole, Parcours Clarté TND, Chef de Chantier, Al Mizan, Souffle & Lumière, profil-cognitif, profil-neuro |
| 🟡🔴 **Netlify only** | **Lien externe** (nouvel onglet, marqueur ↗) en attendant l'import des sources | décodeur-profil, secours-émotionnel, bilan-émotionnel, boîte-bobo 6-12, référentiel Shifā, schémas-traumas, variantes Voie Chifā… |
| 🔒 **Praticienne** | **Section masquée** derrière un code d'accès (déverrouillage local) | anamnèses-CR, shifā-décodeur-CR, mon-assistante-nawel, anamnèse Educa |

→ Dès qu'une source ❌ arrive en ZIP dans le repo, son lien externe devient un lien interne
(hors-ligne + améliorable). Migration douce, app par app.

## 3. Non négociables (rappel des mémos) — respectés par construction

- ❌ **Aucun diagnostic** (disclaimer visible partout).
- 🔒 **100 % privé** : tout en `localStorage`, aucune donnée envoyée. Clés existantes **conservées**
  (`boussole.v1.`, `almizan.v2`, `voiechifa.v1`, `chantier`, `educatypique_*`, `neuroped_*`) — aucune migration destructive.
- 📲 **Installable + hors-ligne** (manifest + service worker propre au Hub).
- 🚫 **Aucune représentation humaine** dans les icônes.
- 🎨 **Chartes respectées** : Educa Typique (rose/lavande/menthe) vs Jannat al Qulûb (sauge/amande/ivoire).
- ☪️ **Pas de chiffres rituels sans dalil**.

## 4. Accès payants (packs 44-59 € / pack des 3 à 99-129 €) — reco technique

Tout est **statique + localStorage, sans serveur** → on ne peut pas « bloquer » un fichier côté client
de façon inviolable. Reco réaliste, sans backend :

- **Produits d'appel gratuits** (ex. Boussole, une app par univers) = ouverts, servent de vitrine.
- **Contenus payants** = livrés après achat via un **lien de paiement externe** (Stripe/PayPal/Sumup,
  ou une place de marché). L'acheteuse reçoit **un code d'accès** ; le Hub **déverrouille** la section
  quand le code est saisi (stocké en local). Simple, sans serveur, suffisant pour un usage de cabinet.
- Alternative plus étanche (si besoin plus tard) : héberger les apps payantes sur une **URL non listée**
  communiquée seulement après achat, ou passer par un hébergeur avec mot de passe (Netlify password
  protection). → à trancher selon le volume de ventes.

## 5. Ce qui reste à décider par Nawel (mes recommandations)

| Décision | Ma reco |
|---|---|
| **Nom du Hub** | Un nom parapluie neutre qui chapeaute les 2 univers (ex. « L'Atelier de Nawel », « Le Trousseau »…) — à choisir ensemble. |
| **Mécanisme de paiement** | Lien de paiement externe + code de déverrouillage local (point 4). |
| **Produits d'appel offerts** | Boussole (Educa) + une app d'apaisement (Jannat) gratuites en vitrine. |
| **Hébergement** | Garder **GitHub Pages** comme socle du Hub (déjà en place) ; réserver les 3 comptes Netlify aux apps non encore importées + éventuel password des apps payantes. |

## 6. Plan de construction proposé (une fois validé)

1. **Squelette du Hub** : page d'accueil (choix d'univers) + 2 portails + manifest + SW propre. Liens
   internes pour les 🟢, liens externes ↗ pour le reste. **Livrable immédiat, ne casse rien.**
2. **Nettoyage doublons** (D1→D6) + réparation des 3 liens cassés (voir `CARTOGRAPHIE.md`).
3. **Import progressif** des sources ❌ reçues en ZIP → passage lien externe → lien interne.
4. **Espace praticienne** : section masquée + code d'accès.
5. **Accès payants** : déverrouillage par code + pages de vente reliées.
