# 🌅 Point de reprise — Les Deux Jardins (à lire en 1er demain)

_Figé le 7 juil 2026 au soir. Tout est commité + poussé sur `claude/chef-chantier-upgrade-mawum3`.
Rien n'est en suspens. On reprend d'ici, in shā'a Llāh._

## Où on en est (en une phrase)
Le **vrai build Next.js** a un socle réel, complet et **navigable** : accueil, cockpit praticienne,
mes applications, moteur de questionnaires, 4 hubs, navigation unifiée. Tout respecte tes piliers.

## L'app réelle (`les-deux-jardins-app/`)
Routes : `/` · `/cockpit` · `/apps` · `/questionnaires` · `/hub/{parents,enfants,ados,pro}`
Démarrer : `cd les-deux-jardins-app && npm install && npm run dev`
Détail complet : `ETAT-BUILD.md`.

## Ce qu'on peut attaquer demain (par ordre d'impact)
1. 🔑 **Brancher Supabase + Vercel** (tes clés) → tes vraies données + app en ligne. *(dépend de toi)*
2. 📝 **Importer un 1er questionnaire réel** dans le moteur (ex. un repérage) — contenu **à valider ensemble**.
3. 📲 **PWA** (installable/hors-ligne) + **polices self-hostées** (Cormorant/Lato/Quicksand/Amiri).
4. 🌱 **Rendre native une 1re app « à importer »** (voir `REGISTRE-COMPLET.md` = checklist).

## Décisions / infos qui t'attendent (pas bloquant)
- Comptes **Supabase / Vercel / Calendly** (clés) quand tu voudras brancher le réel.
- **3 apps « qu'on ne retouche pas »** : me donner leurs noms pour les marquer dans `/apps`.
- **« Thérapeute musulman »** : dossier Drive à confirmer (piste : « Formation de Conseillères »).
- **Nom du cabinet** dans le corpus : *Kanz-Al-Qalb* vs *Jannat al Qulûb* — harmoniser ?

## Ce qui tourne en fond
- Points de contrôle **PR #15** (Chef de Chantier) : automatiques, silencieux, ~1×/h.

## Garde-fous toujours actifs
Aucun diagnostic · contenu religieux jamais inventé, sourcé, « à valider » · transmission douce ·
100 % de ton corpus, rien inventé. Voir `religion/CONSIGNES-cote-islamique.md` + `PRINCIPE-UX-transmission-douce.md`.

— Qu'Allah mette la baraka dans la suite. À demain. 🌿
