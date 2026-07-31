# État des lieux — Code face au Cahier des charges v1.0

_Analyse d'écart produite par Code (Claude) le 2026-07-31._
_Référence : [`CAHIER-DES-CHARGES.md`](CAHIER-DES-CHARGES.md)._

> But de ce document : mettre le **code actuel** de Cap Educa en face de chaque
> décision non négociable, pour distinguer ce que Code peut faire tout de suite,
> ce qui est bloqué par une décision humaine, et ce qui appartient à un autre
> dépôt (Les Deux Jardins). **Aucune suppression n'a été faite** (Phase 0 : « ne
> rien supprimer »).

---

## 1. Ce que fait le code aujourd'hui (constat)

| Élément du CDC | État réel dans le dépôt | Fichier(s) |
|---|---|---|
| Marque « Cap Educa » | ✅ Faite dans les textes affichés (titre, README) ; objet JS interne toujours nommé `Boussole` | `index.html`, `README.md`, `assets/js/*` |
| Porte `pro` / « Praticienne » | ❌ **Présente** : porte `pro` (« Moi, praticienne — Accès complet : tous les outils, fiches et suivi ») | `assets/js/app.js` (l. 17, 67, 146) |
| Accès par défaut = « tout voir » | ❌ **`publicEffectif()` retourne `"pro"` par défaut** → le mode praticienne voit tout ; c'est la faille visée par CE-01 | `assets/js/app.js` (l. 76, 83) |
| Namespace de stockage | ❌ Préfixe unique `boussole.v1.` (pas de namespaces séparés parent/ado) | `assets/js/store.js` (l. 8) |
| Espace Ado chiffré (code local) | ❌ Absent : tout est en clair dans un seul namespace | `assets/js/store.js` |
| 4 outils pro dans Cap Educa | ⚠️ **Présents** : Fiches des jeunes, Journal ABC, Dossier de suivi, Modèles pro | `profils.js`, `abc.js`, `suivi.js`, `modeles-pro.js` |
| Plan de sécurité | ⚠️ **Présent** alors que le CDC le classe « exclu de la v1 » tant que la décision clinique n'est pas prise | `assets/js/tools/securite.js` |
| Les Deux Jardins (produit pro) | ⛔ **N'existe pas** dans ce dépôt ; aucun code Supabase présent | — |
| `licencePro` | ✅ Aucune occurrence trouvée (rien à renommer côté licence pour l'instant) | — |
| Mode Universel / Islamique | ⚠️ Toggle spiritualité présent, à auditer vs §8 | `spiritualite.js`, `personnalisation.js` |

---

## 2. Ce que Code peut faire tout de suite (non bloqué)

Ces tâches ne dépendent d'aucune décision humaine et n'entraînent **aucune
suppression irréversible**. Elles peuvent être livrées par tranches indépendantes.

- **P1-a — Retirer la porte `pro` de Cap Educa** (CE-02).
  Réduire `PORTES` à trois boutons (parent/enfant, parent/ado, ado) et supprimer
  la porte `pro` de l'écran de choix. Les 4 outils pro **ne sont pas supprimés** :
  ils sont simplement retirés de la navigation familiale (masqués), en attendant
  leur migration (Phase 3). Réversible.
- **P1-b — Corriger l'accès par défaut** (CE-01).
  `publicEffectif()` ne doit plus retomber sur `"pro"` (« tout voir »). Par défaut,
  l'accès est familial ; aucun mode « tout débloqué » n'est atteignable en changeant
  une variable du navigateur.
- **P7-a — Namespaces séparés + migration de clés** (§7).
  Introduire `capEduca.parentEnfant.*`, `capEduca.parentAdo.*`, `capEduca.ado.*`,
  `capEduca.settings.*`, `capEduca.entitlement.*`, avec **migration transparente**
  des clés `boussole.v1.*` existantes (aucune perte de données).
- **Entitlement familial** (§1).
  Poser le type `entitlement = demo | family_full` (sans logique serveur pour
  l'instant), en remplacement conceptuel de toute idée de « licence pro ».
- **Écran garde-fou / temps d'écran** (§2).
  Compteur de temps visible + « Quitter pour aujourd'hui » : purement local,
  additif, sans risque.

---

## 3. Bloqué par une décision humaine (Nawel / juridique)

Code **ne doit pas** trancher ces points seul :

- **Plan de sécurité** (`securite.js`) : le CDC l'exclut de la v1 « tant que la
  décision clinique n'est pas prise ». → Décision de Nawel : le **retirer/masquer**
  ou le **conserver** ? Tant que non tranché, il reste en place (Phase 0).
- **HDS** : Les Deux Jardins ne peut accueillir de vraies données avant la réponse
  `OUI / NON / AVIS JURIDIQUE EN COURS`.
- **Consentement des mineurs (< 15 ans)** : cadrage juridique requis (CNIL).
- **Durée de conservation** (LDJ-15) : « ne doit pas être inventée par Code ».
- **Sources islamiques** (§8) : chaque contenu religieux doit être `verified` par
  une personne habilitée avant affichage.
- **Choix commercial** (Phase 8) : modèle demo/abonnement/achat.

---

## 4. Autre dépôt / autre chantier

- **Les Deux Jardins** (parcours pro, Supabase, RLS, MFA — §6, §7, Phases 2/3/6)
  est un **produit séparé** qui n'existe pas dans ce dépôt. Il demande un nouveau
  projet (Supabase + front dédié). À cadrer avec Codex/Cowork avant tout code.
- La **migration des 4 outils pro** (Phase 3) ne peut se terminer (retrait de
  Cap Educa) qu'une fois leur équivalent **fonctionnel et testé** dans Les Deux
  Jardins — règle « aucune suppression avant validation de la destination ».

---

## 5. Ordre proposé pour ce dépôt (Cap Educa uniquement)

1. **Tranche 1 — Frontières produit (Phase 1)** : retirer la porte `pro`,
   corriger l'accès par défaut, poser `entitlement`. _Réversible, sans perte de données._
2. **Tranche 2 — Namespaces + migration de clés (§7)** : `capEduca.*` avec reprise
   transparente de `boussole.v1.*`.
3. **Tranche 3 — Garde-fou écran (§2)** : compteur + « Quitter pour aujourd'hui ».
4. **Tranche 4 — Parcours Parent (Phase 4)** puis **Parcours Ado (Phase 5)** :
   nouveaux écrans, livrés étape par étape, après validation des contenus par Cowork/Nawel.

> Chaque tranche = une livraison indépendante et testable. On ne commence une
> tranche qu'après validation de la précédente.
