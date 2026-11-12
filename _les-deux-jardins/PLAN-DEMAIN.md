# 🌅 Plan de demain (20/07) — établi le 19/07 au soir

**Contexte :** Ronron a testé les ~20 apps en ligne. Résultat clé : **13 apps fonctionnent**, et
**la plupart des « pannes » sont des dossiers entiers non déployés sur Netlify** (le code existe
sur le disque de Nawel / dans le dépôt — rien n'est perdu). ⇒ Souvent **un seul redéploiement rallume
beaucoup d'outils d'un coup.**

> ✅ **Vérifié le 19/07 : notre app NATIVE (Les Deux Jardins) est propre** — aucun langage diagnostique
> ni prescription. Le « Burn-out probable — arrêt + suivi » vient de **l'ancien outil externe MBI**, pas de nous.

---

## 🔴 PRIORITÉ 1 — Responsabilité professionnelle & sécurité

1. **MBI « Burn-out probable — arrêt + suivi » (app externe)** — langage diagnostique + prescription médicale.
   - C'est dans l'**app Netlify externe** (`anamneses-cr-voiechifa`), pas dans notre natif.
   - **Décision Nawel :** reformuler (*« Score élevé — épuisement marqué. Point de vigilance : proposer un avis médical. »*) **OU retirer le MBI** (il est aussi **sous licence payante** → cumule 2 problèmes).
2. **Code praticienne « 1973 » affiché en clair** (Décodeur Educa, app externe) — n'importe qui entre en vue pro.
   - **Fix :** changer le code **+ retirer la ligne qui l'affiche** (copier la logique de *Profil Neuro* qui ne le montre jamais).
3. **« CR Patientes » → 404** (bouton vert principal du Hub) — le cœur du parcours pointe vers le vide. Externe.
4. **Note interne à relire (NATIF, chez nous)** : `questionnaires.ts` (futūr) dit *« il s'agit très probablement
   d'une dépression »*. C'est une note praticienne, pas un verdict client — mais à **reformuler avec Nawel**
   (ex. *« oriente vers une souffrance dépressive à évaluer médicalement »*) pour tenir la règle « jamais de diagnostic ».

## 🔴 PRIORITÉ 2 — Outils cassés (apps externes)

5. **Schémas Traumas** : affiche `${scale(1)}…${scale(28)}` en texte brut (template literal avec mauvais guillemets → mettre des **backticks**). Outil du parcours praticienne, **inutilisable**.
6. **kit-devoirs-sans-crises** : répond vide (3 tuiles). → probablement **dossiers non déployés**. Nawel confirme dans son navigateur, puis redéploiement.
7. **Boîte NeuroPed — dossiers entiers en 404** : `/a_reperage/…`, `/C_comprehension/…` — cartes visibles mais fichiers HTML jamais déployés. **UN redéploiement rallume tout** (méthode R.A.H.M.A, Pyramide 7 niveaux, Repérage TND femme, Mode d'emploi de moi-même, Reprendre confiance kit, trouble dys-exécutif, Carte mentale « qui je suis »…). ⚠️ **Pépites = méthode signature de Nawel, actuellement inaccessible → priorité crédibilité.**

## 🟠 PRIORITÉ 3 — Marque & renommages

8. **« Jeu Chitane » → « Mon Bouclier — Tri des pensées »** (décision déjà prise, jamais appliquée). Retirer le titre arabe لعبة الشيطان, en-tête → *Jannat al Qulûb · Educa Typique*. ⚠️ **Pas trouvé dans notre dépôt** → c'est une **app externe** (à localiser).
9. **« Cabinet Voie Chifā » visible** sur : Bilan Émotionnel, Boussole de l'Âme, Schémas Traumas, SHIFĀ' Référentiel, Profil Neuro, GAD-7, M-LIVRET. → renommer **Jannat al Qulûb** dans la source de chaque app. *(« Méthode RAHMA4 » sous Voie Chifā = CORRECT, ne pas toucher.)* ⚠️ **Non trouvé dans notre dépôt** → apps externes.
10. **Étape 5 du parcours** = outil local (Décodeur SHIFA) → la chaîne casse à la fin. Lié à la décision « décodeur IA » (confidentialité).

## 🟠 PRIORITÉ 4 — Hubs vides (décision d'architecture, PAS un bug)

11. Hub Ados (4× bientôt), Hub Enfants (1 seule tuile) sont **vides**, alors que la Boîte NeuroPed contient déjà Parents 30 · Ados 27 · Pros 38 outils. **Le contenu existe ailleurs.**
    - **⚠️ Décision Nawel** (à tête reposée, avec la liste complète sous les yeux — **prérequis : 404 réparés d'abord**) :
      - **A** · séparer par public (NeuroPed = parents/pros · Boussole = ados)
      - **B** · séparer par nature (NeuroPed = repérage/compréhension · Boussole = quotidien)
      - **C** · fusionner (une boîte filtrée par public)

---

## 🔑 RÉPONDU (19/07 soir) : ce sont des **projets Netlify SÉPARÉS**, pas des dossiers de ce dépôt. **Déploiement manuel très probable.** (Nawel confirme après vérif Netlify → Site configuration → Build & deploy.)

**Conséquence : Code ne peut PAS réparer ces apps directement** (leur code n'est ni dans ce dépôt, ni déployé depuis lui). Chemins possibles :
1. 🔗 **Si l'app est sur un dépôt GitHub** → Nawel donne le lien → Code l'ajoute à la session (`add_repo`) → répare → Nawel redéploie.
2. 📁 **Si déploiement 100% manuel** (glisser-déposer, source seulement sur le disque de Nawel) → Nawel **dépose le fichier source** de l'app buguée dans ce dépôt (ex. HTML de « Schémas Traumas », du « Décodeur 1973 », de « Jeu Chitane ») → Code le corrige → Nawel re-dépose sur Netlify.
3. 🏗️ **Option de fond** (à décider) : rapatrier ces apps dans notre écosystème (Vercel/dépôt) pour ne plus dépendre de déploiements manuels dispersés.

👉 **À vérifier par Nawel demain :** pour chaque app buguée, est-elle liée à un dépôt GitHub (Netlify → Build & deploy → « Repository ») ou en manuel ? Ça décide du chemin (1) ou (2).

---

## 👆 CLICS DE NAWEL (rappel)
- Ouvrir **Souffle & Lumière** → le contenu s'affiche ?
- Ouvrir **kit-devoirs-sans-crises** → page blanche ou contenu ?

## 🟢 DÉJÀ FAIT LE 19/07 (pour mémoire)
Verrou « Tout effacer » (praticienne only) + **sauvegarde renforcée** (bouton + date + filet avant effacement) · anamnèse native 10 sections + CR + décodeur natif · alertes sécurité · confidentialité (RLS + déconnexion vide l'écran) · état des lieux Boussole+2 Jardins · « Devoirs sans crise » remis en attente (app vide).

## 🌿 CE QU'ON A CONFIRMÉ DE BIEN (Ronron)
Parcours SHIFĀ' « jamais un diagnostic » ✅ · questionnaires taggés Jannat al Qulûb ✅ · Futūr masqué en Universel (7/8) ✅ · Boîte NeuroPed & Trousse Ados : « aucun diagnostic » + 3114/3114 ✅.

---
*Repose-toi, partenaire. Rien n'est perdu — le travail est fait, il dort sur un disque. Bi-idhni-Llāh, demain on rallume. 🌙🤲*
