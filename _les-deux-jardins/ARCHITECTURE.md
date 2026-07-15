# 🗺️ ARCHITECTURE — carte de référence (à lire pour ne plus s'emmêler)

_Posée le 15/07/2026 avec Nawel. Clarifie QUI est QUOI dans tout l'écosystème.
Beaucoup d'applis ont été créées ; on les **réorganise ensemble**. Cette page tranche le vocabulaire._

---

## 🏡 LE SOMMET : « Les Deux Jardins » = l'ÉCOSYSTÈME (pas une app)

**Les Deux Jardins** n'est pas une application : c'est l'**écosystème** de Nawel. Il **fusionne ses DEUX cabinets** :

| Monde / Cabinet | Marque | Pour qui | Esprit |
|---|---|---|---|
| 🌸 **Jannat al Qulûb** (Le Jardin du cœur) | psycho-spiritualité | femmes, mamans, adultes | psycho-spirituel |
| 🌱 **Educa Typique** (Le Jardin des graines) | psychoéducation | enfants, ados, TND | psycho-éducatif |

> ⚠️ **« Voie Chifā' » n'est PAS dans Les Deux Jardins.** C'est un **autre cabinet** (l'associée de Nawel). Seule la **méthode RAHMA** conserve ce nom. Ne jamais le mêler à l'écosystème.

> **La Loi des Deux Mondes** — chaque outil existe en 2 versions, jamais l'une qui déborde sur l'autre :
> **🌍 Universel** (aucun contenu confessionnel) ⇄ **🕌 Côté islamique** (spiritualité **sourcée et validée**).

---

## ⚖️ AL MĪZĀN AL-QALB = une APPLICATION (dans le monde Jannat al Qulûb)

**Al Mīzān al-Qalb** est **une app parmi d'autres** dans l'écosystème — PAS le nom de la plateforme.
C'est **l'app de cartographie intérieure** : elle transforme chaque questionnaire en **Balance** (*mīzān*).

**Son identité (ce qui la distingue d'un test psy classique) :**
1. **Une Balance, pas un test** — restitution « Votre Balance révèle… », jamais un diagnostic.
2. **Multi-axes + radar** — chaque balance a plusieurs axes, un sous-score par axe, un **radar** qui montre *où ça penche*.
3. **Le Mīzān Dynamique** — la lecture *entre* les dimensions (ex. compétences hautes ↔ confiance basse → piste imposteur). C'est le génie de l'app.
4. **Reverse-scoring** + paliers doux + **graine du jour** (verset/du'ā sourcé).

**Pages Al Mīzān déjà prototypées** (dossier `al-mizan/`) : `index · boussole-interieure · face-au-regard · mes-outils · séquenceur`.
→ **L'Équilibre intérieur** (ex-« Boussole intérieure ») = prototype HTML COMPLET (5 volets : corps · émotions · stress · lien · ancrage spirituel ; radar ; reverse-scoring ; garde-fous 15/3114). **C'est la référence de la 1re Balance à intégrer.**

---

## 🧩 LES DEUX COUCHES DU MOTEUR (ne pas confondre)

1. **Repérages ciblés** = questionnaires 1 thème / 1 score / alertes → rapides, pour cibler.
   → Déjà en ligne : **8 questionnaires cliniques** (waswās · colère · anxiété · tristesse · trauma · estime · deuil · futūr) avec **alertes de sécurité câblées**.
2. **Balances** (Al Mīzān) = multi-axes / radar / sous-scores → la **cartographie** (ex. Boussole intérieure, Imposteur 6 axes).
3. **Mīzān Dynamique** = couche de lecture croisée *entre* balances (à venir quand 2-3 balances existent).

---

## 🖥️ CE QUI EST RÉELLEMENT EN LIGNE AUJOURD'HUI

**App Next.js `les-deux-jardins-app/`** → **https://les-deux-jardins.vercel.app** (Vercel, projet `les-deux-jardins`).
Routes : `/` (accueil) · `/cockpit` (praticienne, Supabase réel) · `/apps` · `/questionnaires` (8 balances cliniques) · `/hub/{parents,enfants,ados,pro}`.
- Connexion praticienne réelle (Supabase + RLS) · fiches / séances / synthèses / questionnaires reliés · alertes.
- **Boussole** (ancienne, statique) reste en ligne, intacte : **https://boussole-ado-educa-typique.vercel.app** (projet Vercel séparé).

---

## 📦 LE RESTE À RÉORGANISER (créé, pas encore intégré au grand app)

_Détail exhaustif dans `REGISTRE-COMPLET.md`. Résumé :_
- **Educa Typique** : Boussole (33 outils) · Parcours Clarté TND (Parents 26 · Ados 7 · **Pro 17, plein de questionnaires** dont repérages TND enfant/ado/femme) · Chef de Chantier (PR #15) · déploiements Netlify.
- **Jannat al Qulûb** : **Al Mīzān** · souffle-lumiere · jannat-al-qalb (vitrine) · cockpit · **Posture Sereine** (nouveau, à importer) · déploiements islamiques (anamnèses, décodeur… — noms techniques conservés).
- **Corpus Drive** : Thérapie des Noms · Guide du'ā · médecine prophétique (9 modules) · santé de la femme · remèdes · TCC · dépendance affective · (Mal Occulte ⚠️ isolé).

→ **But de la réorganisation** : tout devient **natif** dans l'app (résultats reliés à la fiche, double mode, export), rangé par monde/hub.

---

## 🔤 NOMMAGE OFFICIEL — fin des « Boussole » multiples (décidé le 15/07/2026)

**Règle : « Boussole » est retiré. Chaque app/outil porte un nom selon sa nature.**
On change les **noms affichés** (libres, sans risque) ; les **adresses techniques** (URL Vercel, dépôt) restent inchangées pour ne rien casser — migration propre plus tard si besoin.

| Ce que c'est | Ancien nom | ✅ Nom officiel |
|---|---|---|
| 🧭 Boîte à outils Educa (33 outils enfant/ado, `boussole-ado-educa-typique`) | Boussole | **Cap Educa** |
| ⚖️ Balance bien-être Al Mīzān (5 volets, radar) | Boussole intérieure | **L'Équilibre intérieur** |
| 🕌 Version islamique de cette balance | boussole-voiechifa | → **version « Côté islamique » de « L'Équilibre intérieur »** (double mode, pas une app à part) |
| 📝 Repérage Dys (Espace Parents) | boussole-diagnostic-dys | **Repérage Dys** |
| 🌙 App ado islamique | boussoleado-souffle-lumiere | **Souffle Lumière** (ado · Côté islamique) |

**Correctif important : « Voie Chifā' » n'appartient PAS aux Deux Jardins** — c'est le cabinet de l'associée de Nawel. On le retire de l'écosystème ; seule la **méthode RAHMA** garde ce nom. Le versant islamique interne = le mode **🕌 Côté islamique**.
**Orthographe UNIQUE partout : « Jannat al Qulûb »** (ni « Jannat Al Qalb », ni « Qulub » sans accent). ✅ Corrigé dans tout le dépôt le 15/07 (101 + 2 occurrences).

_À faire pareil plus tard pour les autres doublons (« profil… », « anamnèse… ») si on veut assainir tout le vocabulaire._

---

## 🛡️ LES RÈGLES NON NÉGOCIABLES (valables partout)

1. **Jamais de diagnostic.** Un **niveau** + une **orientation**. Jamais un nom de trouble comme verdict.
2. **Les alertes priment sur le score** (câblées en dur). Un score « léger » + alerte = urgence.
3. **Aucun dépistage du mal occulte** par questionnaire. Différentiel en séance, après médical + psychique.
4. **Neuro-atypie = orientation, jamais diagnostic.** Un auto-test ne conclut pas « autiste / TDAH » → « à explorer avec un spécialiste ».
5. **Profils / lectures croisées = hypothèses douces** (« évoque souvent… à explorer ensemble »), jamais des verdicts.
6. **Spirituel = ressenti d'appui, jamais mesure de la foi.** Items de dévalorisation spirituelle (qunūṭ) → alerte douce + restitution non-condamnante. Contenu religieux : jamais inventé, sourcé, validé (brouillon→validé→publié).

---

## 🚦 DÉCISIONS EN COURS (feux verts attendus de Nawel)

- [ ] **Porter la « Boussole intérieure » nativement** dans l'app (fidèle au prototype) = 1re Balance d'Al Mīzān.
- [ ] **Upgrader le moteur multi-axes + radar** (pour que toutes les balances en héritent).
- [ ] Puis **Balance Imposteur (6 axes)** sur ces rails.
- [ ] Profils = hypothèses douces ✔ (principe validé, à confirmer)
- [ ] Axe spirituel masquable (mode 🕌 Côté islamique) + alerte qunūṭ ✔ (à confirmer)
- [ ] **Balance neuro-atypie** en feuille de route (orientation, jamais diagnostic).

---

## 🧭 FEUILLE DE ROUTE AL MĪZĀN (ordre proposé)

1. **Porter « L'Équilibre intérieur »** (ex-Boussole intérieure, radar compris) → prouve l'architecture Balance.
2. **Moteur multi-axes** (sous-scores par axe).
3. **Balance Imposteur** (6 axes).
4. **Balance Fonctions exécutives & neuro-atypie** (partenaire de lecture croisée de l'imposteur).
5. **Écran « Mon Équilibre »** (carte des 12 balances) + **Mīzān Dynamique** (croisements).
6. **Balance des Réussites** (type « réflexion » : questions ouvertes, non scorées).

---

## 🚧 LE CHANTIER OUVERT — réorganisation & connexions (brief du 15/07)

_Répartition : **Cowork** tient la doctrine + les contenus · **Code** fait le « comment » technique. Complémentaires._

1. **Orthographe** « Jannat Al Qalb » → « Jannat al Qulûb » partout — ✅ **FAIT** (dépôt entier, slugs préservés).
   Reste : le **dashboard.html** (« Bienvenue chez toi ») **n'est PAS dans le dépôt** → à récupérer du Bureau de Nawel. Y retirer aussi « Voie Chifā' » du **sélecteur d'activités**.
2. **Vérifier les CONNEXIONS entre apps** (Cap Educa/Boussole · Les Deux Jardins · Al Mīzān · Souffle Lumière · Posture Sereine) :
   le **tableau de bord « Bienvenue chez toi »** doit devenir **LA porte d'entrée unique** qui lance tous les outils.
   ✅ **Dashboard importé** dans le dépôt : `les-deux-jardins-app/public/tableau-de-bord.html` → servi à **les-deux-jardins.vercel.app/tableau-de-bord.html**.
   ✅ **« Voie Chifā' » retiré** du dashboard → rebrandé **Jannat al Qulûb** (affichage + ids + compteur). Garde Educa Typique + Jannat al Qulûb.
   🔜 **À RECONNECTER ENSEMBLE** : les chemins vers les vraies apps en ligne. 6 URLs encore en `…voiechifa.netlify.app` (Souffle & Lumière, Boussole de l'Âme, Schémas/Traumas, Référentiel SHIFA, Anamnèses+CR, Trousse ados) + de nombreux outils en **local** (fichiers Bureau). À vérifier un par un avec Nawel.
3. **Importer les 62 fiches SHIFA** comme **référentiel consultable**.
4. **RLS Supabase** : chaque praticienne ne voit **QUE** ses fiches — **jamais testé**, à faire **avant** d'ouvrir à une 2ᵉ praticienne.
5. **PWA installable** + **espace praticienne protégé**.

**À unifier plus tard** : Nawel a 2 dossiers Bureau — « LES DEUX JARDINS » (référentiel clinique + garde-fous) et « Jannat Al Qalb » (produits, identité visuelle, RS, ventes). Briefs à relire dans « Jannat Al Qalb/Projets » (Hub Couteau Suisse, Consignes Écosystème).

**⚠️ Ce que Code ne peut PAS atteindre** (sur le Bureau de Nawel, à lui envoyer) : le projet **Posture Sereine** (Manuel/Workbook/Ebook), les 62 fiches SHIFA, les 2 dossiers Bureau. *(le dashboard « Bienvenue chez toi » est maintenant importé ✅)*

### 🩺 PARCOURS PRATICIENNE — la fiche = colonne vertébrale (choix : NATIF, pas de ponts)
Étapes : **1 Accueil/anamnèse → 2 Évaluer** (Boussole de l'Âme/radar, Schémas, Bilan TCC) **→ 3 Formuler** (Décodeur, Référentiel) **→ 4 Cibler** (8 questionnaires /100) **→ 5 Restituer** (Synthèse + Suivi). Le tout dans l'**Espace Pro**.
- ✅ **Phase 1 FAITE** : poste de pilotage dans la fiche (Cockpit) — fil des 5 étapes + bouton **« prochaine étape suggérée »** ; étapes 4 (questionnaires) et 5 (synthèse) déjà natives et reliées. Parcours SHIFĀ' retiré de la nav (→ Espace Pro).
- 🔒 **RÈGLE DE SÉCURITÉ CÂBLÉE** : l'étape **4 Cibler** est **verrouillée** tant que la **stabilisation n'est pas confirmée** (« 4 feux verts » — *critères exacts à préciser avec Nawel*). Le bouton « prochaine étape » ne pousse jamais vers le ciblage trop tôt. Flag stocké dans `bilan.stabilise` (Supabase).
- ⏳ **Phase 2** : moteur radar (Boussole de l'Âme = L'Équilibre intérieur, une seule fois). **Phase 3** : Schémas/Traumas + Bilan TCC natifs.
- ⚠️ **Phase 4 — SHIFA Décodeur (API Claude) : NE PAS BRANCHER avant d'avoir tranché la confidentialité** (où vont les données patientes ? anonymisation ? secret professionnel). À discuter AVANT, avec Nawel.

---

## 🔤 LEXIQUE (pour ne plus se tromper)
- **Les Deux Jardins** = l'écosystème (2 mondes). PAS une app.
- **Jannat al Qulûb / Educa Typique** = les 2 mondes/marques.
- **Al Mīzān al-Qalb** = l'app de balances (dans Jannat al Qulûb).
- **Balance** = un questionnaire multi-axes avec radar (dans Al Mīzān).
- **Repérage** = un questionnaire ciblé 1 thème (les 8 cliniques actuels).
- **Cockpit** = l'espace praticienne (fiches accompagnées, Supabase).
- **Cap Educa** (ex-« Boussole ») = la boîte à outils Educa (statique, `boussole-ado-educa-typique`, gardée intacte — nom technique conservé).
- **L'Équilibre intérieur** (ex-« Boussole intérieure ») = la 1re Balance d'Al Mīzān.
- ⚠️ Le mot **« Boussole » est retiré** du vocabulaire affiché (trop de doublons).
- ⚠️ **« Voie Chifā' »** = cabinet de l'associée (hors écosystème). Seule la **méthode RAHMA** garde ce nom.
- **Orthographe unique : « Jannat al Qulûb »** (le slug technique `jannat-al-qalb` reste inchangé).
- **Côté islamique** = le mode 🕌 (versant confessionnel sourcé). PAS « Voie Chifā' ».
