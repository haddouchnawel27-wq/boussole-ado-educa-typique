# 🌙 Reprise — Les Deux Jardins (à lire en 1er)

**Dernière session : 15/07/2026.** Nawel revient **samedi**, on continue **doucement**.
Tout est commité + poussé sur `claude/chef-chantier-upgrade-mawum3` (PR #15). Carte complète : `ARCHITECTURE.md`.

## ✅ Ce qui est EN LIGNE et fait (récent)
- **App** : https://les-deux-jardins.vercel.app · **Hub** : /tableau-de-bord.html · **Parcours (étape 0)** : /parcours-shifa
- **8 questionnaires cliniques** relus/validés + 4 ajustements + **alertes de sécurité** câblées.
- **Cockpit** : Accueil/Bilan éditables · questionnaires reliés (onglet Suivi) · bouton supprimer une fiche.
- **Nommage acté** : Cap Educa (ex-Boussole) · L'Équilibre intérieur (ex-Boussole intérieure) · orthographe unique **Jannat al Qulûb** · **« Voie Chifā' » retiré** (= cabinet associé, hors écosystème ; seule la méthode RAHMA garde ce nom).
- **Hub « Bienvenue chez toi »** importé (public/tableau-de-bord.html), rebrandé Jannat al Qulûb.
- **PARCOURS Phase 1 FAITE** : la fiche = poste de pilotage (fil 5 étapes + bouton « prochaine étape suggérée »). Étape **Cibler verrouillée** tant que la **stabilisation** n'est pas confirmée (flag `bilan.stabilise`).

## 🔜 À REPRENDRE SAMEDI (dans l'ordre, en douceur)
1. **Les 4 « feux verts »** exacts de la stabilisation (Nawel les donne → on les nomme dans le bouton du Cockpit).
2. **Reconnecter les chemins** du hub (6 URLs `…voiechifa.netlify.app` → vraies URLs ; + outils locaux à déployer). À faire ENSEMBLE.
3. **Test RLS Supabase** (protocole dans `AUDIT-CONNEXIONS.md`) avant une 2ᵉ praticienne.
4. **Phase 2 parcours** : moteur **radar** (Boussole de l'Âme = L'Équilibre intérieur, une seule fois) → résultats dans la fiche.
5. **Phase 3** : Schémas/Traumas + Bilan TCC natifs.
6. **Ranger** le Parcours SHIFĀ' dans l'Espace Pro (brief 3 espaces × 2 modes).
7. **Nettoyer** `lib/apps.ts` (Cap Educa, doublons, lien github.io, « # » mort).
8. **ACCUEIL — rendre les 2 mondes CLIQUABLES** : sur `app/page.tsx`, « Jannat al Qulûb » et « Educa Typique / Le Jardin des graines » sont de simples titres `<h2>`, pas des liens. Nawel veut cliquer dessus pour **entrer dans chaque monde**. → en faire des entrées (vers leurs hubs / sous-sections).
9. **VÉRIFIER LES OUTILS UN PAR UN** (signalé par Nawel : « beaucoup ne fonctionnent pas ou mal ») — tester chaque lien des hubs `/hub/[slug]` + chaque app externe de `lib/apps.ts` + le hub `tableau-de-bord.html` : repérer cassés / mal rendus / doublons, réparer au fil. (Prévu explicitement pour le week-end.)

## ⚠️ VIGILANCES (ne pas oublier)
- **SHIFA Décodeur (API Claude)** = données patientes → **trancher la confidentialité AVANT** de le brancher (Phase 4). Secret professionnel.
- **Ciblage jamais trop tôt** : l'étape 4 reste derrière la stabilisation.
- **Posture Sereine** (Manuel/Workbook/Ebook) : à intégrer quand Nawel envoie les fichiers.

## 🛡️ Règles non négociables (rappel)
Jamais de diagnostic · alertes priment sur le score · aucun dépistage du mal occulte · neuro = orientation jamais diagnostic · profils = hypothèses douces · spirituel = ressenti, jamais mesure de la foi.

— Repose-toi bien, partenaire. À samedi, in shā' Allāh. 🌿🤲
