# 🌿 Les Deux Jardins — analyse du brief & réponses aux 6 questions

_Reçu le 7 juillet 2026 : cahier des charges « Consignes pour Code — Écosystème Les Deux Jardins »
(v1.0) + 3 assets de marque (logos Educa Typique & Jannat al Qulûb, brand board) + gabarit
« Pour toi ». Ce mémo = ma lecture + mes recommandations, à valider avant de coder._

> ⚠️ **Ce projet est différent de l'existant.** Le dépôt actuel `boussole-ado-educa-typique` est un
> site **statique GitHub Pages, 100 % localStorage, sans serveur**. « Les Deux Jardins » tel que
> spécifié (Next.js + Vercel + Supabase, comptes, données cliniques chiffrées) est une **nouvelle
> application** → elle devrait vivre dans **son propre dépôt**, pas dans celui-ci. Les apps
> statiques existantes (Boussole, Al Mizan…) deviennent des outils que les hubs **relient**.

## Vision (rappel)
Écosystème psycho-éducatif + spirituel reliant maman / enfant / ado / pro. Deux identités socles :
- 🌸 **Jannat al Qulûb — Le Jardin du cœur** (maman/femme/pro, psycho-spirituel)
- 🌱 **Educa Typique — Le Jardin des graines** (enfant/parentalité TND, neuropédagogie)

**4 hubs** (Parents · Enfants 3·5·12 · Ados · Professionnels) + **cockpit praticienne** privé (le cœur).
**Double mode transversal : Universel ⇄ Islamique** (mêmes composants, deux jeux de contenu).
Principe : **un lièvre à la fois** — socle propre + 1er hub complet avant les suivants.

## Cockpit praticienne (Jalon 1, le MVP) — parcours accueil → clôture
Fiche client unique reliant 7 étapes : Accueil (questionnaire, consentement, RDV) → Bilan/anamnèse →
Séances (notes, météo émotionnelle) → Bibliothèque d'outils assignables → **Synthèses « Pour toi »**
(génération semi-auto, **jamais envoyée sans validation humaine**, export PDF A4) → Suivi/progression
→ Clôture (+ Relais Lumière = mécénat/tarif solidaire).

## Design tokens (du brief §6)
**Jannat al Qulûb :** vert jardin `#3E4A38` · sauge `#7C8B6C` · vert tendre `#D9E4CB` · crème lin
`#FBF7EF` (fond, pas de blanc pur) · **doré signature `#C3873C`** (accent, jamais un fond) · rose du
cœur `#C48B93` · encre `#43463F`. Titres Cormorant Garamond, corps Lato/Open Sans, arabe Amiri.
**Educa Typique :** **sarcelle `#3C6478`** (signature) · magenta `#F050C8` · ciel `#B4F0F0` · lavande
`#C8A0F0` (ado) · menthe `#B4F0C8` · jaune `#F0F078` · anthracite `#4A4540` · beige `#F0E4D3` ·
offwhite `#FAF7F2`. Titres Quicksand/Nunito/Poppins (rondes), corps Lato, arabe Amiri. Max 2-3
accents/écran, coins 12-20px, blanc sur sarcelle uniquement.
**Shell « Les Deux Jardins » :** fond crème neutre, le doré comme liant entre les deux chartes.

---

## ✅ Mes réponses aux 6 questions (section 12)

**1. Stack → hybride recommandé.** Le cockpit gère des **données cliniques de mineurs, multi-clients,
multi-appareils** → il faut un vrai backend : **Next.js (App Router) + TypeScript + Tailwind sur
Vercel + Supabase** (Postgres, Auth par rôles, Row-Level Security, chiffrement, journal d'accès),
comme le propose le brief. **Notion/Airtable : à écarter** comme base principale de données de santé
(données chez un tiers, contrôle d'accès/audit faibles, pas de chiffrement au niveau champ) — OK
seulement en back-office annexe. **En revanche, les outils grand public** (Boussole, tools enfants/ado)
**restent statiques + localStorage** : les hubs les **relient**, sans backend. → Backend uniquement là
où il le mérite (cockpit + comptes) ; statique partout ailleurs. *(NB : le « 100 % privé sans serveur »
s'appliquait aux outils familles ; le cockpit est le back-office pro de Nawel, contexte où un backend
sécurisé est attendu.)*

**2. Comptes & rôles → via la praticienne au départ.** Pour le MVP : **pas de compte parent** ; le
parent accède par **lien/code d'invitation** de la praticienne. Seul·e le·la praticien·ne (+ admin) a
un compte en Jalon 1. Comptes parent/ado ajoutés plus tard (Jalon 2+) si besoin. → surface de données
sensibles minimale, auth simple, MVP plus rapide, plus sûr pour les mineurs.

**3. Nom Hub Enfants → « Le Jardin des graines ».** On garde ce nom parapluie (c'est déjà la signature
du logo Educa Typique) et les **tranches d'âge 3·5·12 = des sections internes**, pas des noms séparés.
Une marque cohérente, contenu adapté par âge.

**4. Mode par défaut → universel, global, surchargeable par hub.** À la 1re visite : **universel**
(inclusif, aucun contenu confessionnel imposé — cohérent avec la règle éthique §9), avec bascule
islamique visible et facile. Choix **global** mémorisé par utilisateur, **surchargé par hub** si utile
(le hub Jannat peut naturellement défaut-basculer en islamique).

**5. Médecine prophétique → différé (pas dans le MVP).** Le Hub Enfants = Jalon 3, donc pas requis
pour la 1re livraison. On prévoit des **emplacements de contenu** « petits maux » (double mode) à
remplir quand tu m'enverras les contenus de ta formation. Ça ne bloque pas le MVP.

**6. Périmètre MVP → ✅ confirmé.** **Jalon 0** (app-shell + design system + toggle de mode + page
d'accueil des deux jardins) **+ Jalon 1** (cockpit praticienne avec **données de démonstration**).
Conforme à la reco §10.

---

## 🚧 Ce que je peux / ne peux pas faire dans cet environnement
- ✅ **Construire** l'app Next.js, le design system, le shell et le cockpit, la faire tourner en local
  (headless) avec **données de démo**, et te montrer des captures.
- ❌ **Provisionner** Supabase / Vercel / Calendly / Zoom : ça nécessite **tes comptes & clés**. →
  Le 1er livrable réaliste = MVP **en local avec données fictives** (exactement le §11), puis toi tu
  branches les comptes.
- 📦 **Emplacement** : à décider — **nouveau dépôt dédié** (recommandé) ou dossier de travail temporaire.

## 📥 Assets encore à fournir
- Les **vrais fichiers `.svg`** des logos/brand board (j'ai reçu des **exports PDF**, pas les SVG
  vectoriels — nécessaires pour des assets web nets).
- Le gabarit **« Pour toi — Séance du 6 juillet.html »** (annoncé mais non joint) — indispensable pour
  reproduire au pixel le format imposé des synthèses.

## ▶️ Prochain pas proposé
Livrer tout de suite **Jalon 0 en prototype visuel** (page d'accueil des deux jardins + les 2 chartes +
toggle de mode) que tu peux **ouvrir et voir** — sans aucune décision de stack. Puis attaquer le
cockpit (Jalon 1) une fois le dépôt/stack tranchés.
