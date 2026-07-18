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
10. **🧭 RÉORGANISER TOUS LES QUESTIONNAIRES DES 2 JARDINS EN UNE PROGRESSION COHÉRENTE** (demande Nawel 16/07) — un **« état des lieux » qui s'approfondit étape par étape** (repérage léger → évaluation → analyse fine), **même logique côté Jannat (adultes) et côté Educa (enfants/ados)**. Relie au parcours (repérer → comprendre → agir). Objectif : cohérence d'ensemble, pas une pile de tests isolés. *(chantier de fond, à concevoir AVEC Nawel — c'est sa clinique.)*
11. **🔌 « Bienvenue chez toi » : certaines applis NE RÉPONDENT PAS** (signalé 16/07) — vérifier/reconnecter les liens du dashboard (`public/tableau-de-bord.html`) un par un ; distinguer outils en ligne (URL à corriger) vs locaux (fichiers Bureau, ne s'ouvrent que chez Nawel).

## 🧭 DÉCISIONS À TRANCHER PAR NAWEL (Code n'agit pas seul)
- **Les 2 listes de « 8 questionnaires »** diffèrent : côté Hub (Waswas, Choc émotionnel, Addictions, Dépression, Angoisse, Tristesse/Huzn, Deuil, Futûr) vs côté app Les Deux Jardins (Waswās, Trauma, Estime, Colère, Anxiété, Tristesse, Deuil, Futūr). **5 se recouvrent, 3 diffèrent.** → Quelle liste fait foi ? Fusionner (≈11) ou garder 2 jeux ? *C'est le chantier « grande cohérence des questionnaires ».*
- **Licences des échelles cliniques** (avant l'abonnement Pro payant) : PHQ-9/GAD-7 = libres (citer la source) ; PSS-10 = OK non-commercial, à vérifier commercial ; **MBI = sous copyright / licence payante → à vérifier EN PRIORITÉ** ; LSAS = attribution requise, à confirmer. Remplacer par une échelle libre/maison si blocage.

## ✅ FAIT le 18/07 (anamnèse native)
- **Anamnèse universelle native** reconstruite à l'identique (`lib/anamnese.ts`) : 10 sections, ~70 items typés (texte, boutons, échelles 0-10), reliée à la fiche (CR).
- **2 alertes câblées** : suicide (§3) + qunūṭ (§9), visibles sur la fiche + le CR.
- **Onglet CR natif** (copier / imprimer) + ligne « Repères spirituels » (espoir/tawakkul/qunūṭ).
- **« SHIFA/Voie Chifa »** retiré des noms affichés (dashboard + Applications) → Jannat al Qulûb. Parcours : « Shifā' » côté islamique seulement.
- **Cockpit** : enregistrement honnête (plus de faux « ✔ »).

## ⚠️ VIGILANCES (ne pas oublier)
- **SHIFA Décodeur (API Claude)** = données patientes → **trancher la confidentialité AVANT** de le brancher (Phase 4). Secret professionnel.
- **Ciblage jamais trop tôt** : l'étape 4 reste derrière la stabilisation.
- **Posture Sereine** (Manuel/Workbook/Ebook) : à intégrer quand Nawel envoie les fichiers.

## 🛡️ Règles non négociables (rappel)
Jamais de diagnostic · alertes priment sur le score · aucun dépistage du mal occulte · neuro = orientation jamais diagnostic · profils = hypothèses douces · spirituel = ressenti, jamais mesure de la foi.

— Repose-toi bien, partenaire. À samedi, in shā' Allāh. 🌿🤲
