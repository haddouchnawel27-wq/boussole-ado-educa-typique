# 🧭 État des lieux — reprise de session

_Mémo pour reprendre sans rien perdre. Dernière mise à jour : 2 juillet 2026 (soir)._

---

## ✅ CE QUI EST EN LIGNE (3 applis, même site GitHub Pages)

Tout est publié sur **GitHub Pages**, dossier par dossier, sans que les applis se gênent :

| Appli | Lien | État |
|---|---|---|
| 🧭 **Boussole** (ados) | `.../boussole-ado-educa-typique/` | en ligne, inchangée |
| 🌸 **Al Mizan Al Qalb** (femmes) | `.../boussole-ado-educa-typique/al-mizan/` | **en ligne** ✅ |
| 🌙 **Souffle & Lumière** (Voie Chifa) | `.../boussole-ado-educa-typique/souffle-lumiere/` | **en ligne** ✅ (validé par Nawel) |

Base URL complète : `https://haddouchnawel27-wq.github.io/boussole-ado-educa-typique/`

### Al Mizan — ce qui a été fait aujourd'hui
- Le séquenceur **« Vider, trier, avancer »** est ajouté comme **3ᵉ carte dans « Faire le point »** (à côté de « Mon mode d'organisation » et « Boussole intérieure »). Injecté dans le bundle + testé (navigation OK).
- Fichiers outils co-déployés dans `al-mizan/` : `boussole-interieure.html`, `face-au-regard.html`, `sequenceur.html` (+ alias `mes-outils`, `s-organiser`, `organiser`).
- **Icône d'appli** (balance dorée) : `al-mizan/apple-touch-icon.png`.

### Souffle & Lumière
- **Icône d'appli** (arche + lumière) intégrée : `souffle-lumiere/apple-touch-icon.png` + métadonnées « écran d'accueil » iOS dans le `<head>`.

### ⚠️ Piège rencontré : le CACHE
Le gros blocage du jour n'était **pas** technique : c'était le **cache du téléphone/navigateur** (Nawel voyait l'ancienne version). Solutions qui marchent : **navigation privée**, **Ctrl+Maj+R** sur ordi, ou ajouter **`?v=3`** au bout du lien. À redire si ça se reproduit.

### ⚠️ Déploiement Pages : échecs transitoires
Le workflow `.github/workflows/deploy-pages.yml` (déclenché sur push vers `claude/gracious-davinci-t0zife`) a **échoué 2 fois** sur une erreur GitHub transitoire (« Deployment failed, try again later »), puis **réussi à la 3ᵉ**.
- **Impossible de relancer le workflow via l'intégration** (`rerun`/`workflow_dispatch` → 403).
- **Pour relancer : pousser un petit commit sur la branche de travail → PR → merge dans `claude/gracious-davinci-t0zife`** (le push sur la branche par défaut redéclenche le déploiement).

---

## 💼 COMMERCIALISATION (le chantier en cours)

**Modèle retenu :** l'appli reste en ligne, **protégée par un code d'accès** ; la cliente paie → reçoit **lien + code**. (Pas de vente en « fichier à télécharger » : mauvaise expérience sur iPhone.)

Nawel **inclut déjà** les applis dans ses accompagnements payants. Elle veut **AUSSI** les vendre **à l'unité** (produits digitaux).

**Comptes Systeme.io existants :**
- Boussole → Systeme.io **Educa Typique**
- Souffle & Lumière → Systeme.io **Voie Chifa**
- Al Mizan → **Jannat Al Qalb** (page de vente à créer → voir ci-dessous)

### ✅ Fait aujourd'hui : page de vente Al Mizan Al Qalb
Maquette complète, dans la charte de l'appli (crème/cacao/sauge/terracotta/or), **pied de page vert sauge**, symbole balance recentré.
- **Artifact (rendu en ligne) :** https://claude.ai/code/artifact/dd9be335-e758-4557-88d5-d355245bd807
- **Source :** `scratchpad/vente-al-mizan.html` (éphémère — récupérable via l'artifact avec WebFetch).
- Sections : hero + « Est-ce pour toi » + « Ce qu'elle contient » (6 outils) + « Pourquoi différente » (dont 100 % privé) + « Comment ça se passe » + offre + témoignages + FAQ + CTA.
- **3 blancs à remplir** (repérés par étiquette rose) : **le prix**, **les vrais témoignages**, **les liens légaux** du bas.
- → À recopier dans Systeme.io Jannat Al Qalb.

### 📌 À FAIRE DEMAIN (dans l'ordre)
1. **Textes légaux** pour compléter le bas de la page de vente : **mentions légales + politique de confidentialité + CGV**.
   - Infos à demander à Nawel : **statut** (auto/micro-entreprise) + **SIRET**, **nom de facturation** (nom + « Jannat Al Qalb »), **e-mail de contact**.
   - Argument fort à mettre en avant : appli **100 % locale/privée**, aucune donnée collectée (RGPD au top).
2. **Page « code d'accès »** devant Al Mizan (et à décliner pour les autres si voulu) : un seul code que Nawel contrôle, donné à ses acheteuses ET à ses clientes d'accompagnement. ⚠️ Honnêteté : un code côté web n'est pas inviolable — suffisant pour son univers de confiance ; changer le code de temps en temps.
3. (Optionnel) **Nom de domaine propre** (ex. `jannatalqalb.fr`) au lieu de l'adresse github — plus pro. GitHub Pages le permet.
4. Nawel : renseigner **prix** + **témoignages réels** dans la page de vente.

### QR codes (déjà livrés à Nawel)
Générés pour les 3 applis (`scratchpad/QR-AlMizan.png`, `QR-Souffle-Lumiere.png`, `QR-Boussole.png`). Pratiques pour cabinet/fiches/flyers.

---

## 🔧 Repères techniques
- Dépôt : `haddouchnawel27-wq/boussole-ado-educa-typique` · défaut = **`claude/gracious-davinci-t0zife`** (c'est CE qui est publié par Pages) · branche de travail = `claude/lucid-dirac-zt93h3`.
- SW Boussole `sw.js` v14 : exclut `/al-mizan/` et `/souffle-lumiere/` du cache Boussole (chaque appli reste indépendante).
- Icônes recréées **en vectoriel** (les images collées dans le chat ne sont pas récupérables comme fichiers) : sources `scratchpad/icon.svg` (balance) et `scratchpad/icon-souffle.svg` (arche) ; PNG déployés dans les dossiers d'appli.
- Dé-bundling des exports Claude Design (React inline) : Al Mizan `al-mizan/index.html` est autonome (React vendorisé). Souffle `souffle-lumiere/index.html` charge encore React depuis unpkg (marche en ligne ; à rendre autonome plus tard si besoin).

---

## 🌙 À traiter plus tard
- Rendre **Souffle & Lumière** totalement autonome (hors-ligne) comme Al Mizan, si souhaité.
- Vérifier en détail tous les outils de Boussole (Nawel voulait le faire « plus tard »).
