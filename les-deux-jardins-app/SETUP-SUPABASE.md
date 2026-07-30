# 🔑 Brancher tes vraies données — guide pas à pas (~10 min)

_Aucune compétence technique requise. À la fin, l'app sauvegarde tes vraies accompagnées, en sécurité.
Tant que ce n'est pas fait, l'app tourne en **mode démo** (rien n'est cassé)._

## Étape 1 — Créer le compte Supabase (gratuit)
1. Va sur **https://supabase.com** → **Start your project** → connecte-toi (avec GitHub, c'est le plus simple).
2. **New project** :
   - **Name** : `les-deux-jardins`
   - **Database Password** : choisis-en un et **note-le** quelque part.
   - **Region** : choisis **Europe (Frankfurt / Paris)** (plus proche = plus rapide, et données en Europe).
3. Clique **Create new project** et attends ~1 minute (le temps que la base se crée).

## Étape 2 — Créer les tables (copier-coller)
1. Dans Supabase, menu de gauche → **SQL Editor** → **New query**.
2. Ouvre le fichier **`supabase/schema.sql`** (dans ce dossier), **copie tout**, colle-le dans l'éditeur.
3. Clique **Run** (en bas à droite). Tu dois voir « Success ». ✅
   *(Ça crée les tables + la sécurité qui fait que tu ne verras QUE tes propres accompagnées.)*

## Étape 3 — Récupérer les 2 clés
1. Menu de gauche → **Project Settings** (roue crantée) → **API**.
2. Copie ces **2 valeurs** :
   - **Project URL** (ex. `https://xxxx.supabase.co`)
   - **anon public** key (une longue clé qui commence par `eyJ…`)

## Étape 4 — Me les donner
Colle-les moi ici, tout simplement :
```
URL = ...
anon = ...
```
👉 **Ces 2 clés sont publiques et sûres à partager** (la « anon key » est faite pour ça ; c'est la
sécurité RLS de l'étape 2 qui protège les données). **Ne me donne jamais** le mot de passe de la base
ni la clé « service_role ».

Dès que tu me les donnes, je les mets en place (`.env.local`), j'active l'inscription praticienne,
et **on teste ensemble** : tu crées ton compte, tu ajoutes une accompagnée, et elle est **sauvegardée
pour de vrai**. 🌱

## Et pour mettre en ligne (Vercel) — juste après
1. Va sur **https://vercel.com** → connecte-toi avec **GitHub**.
2. On aura besoin d'un **dépôt** pour Les Deux Jardins (je t'aide à l'extraire) → **Import** dans Vercel.
3. Dans Vercel → **Settings → Environment Variables**, on recolle les 2 mêmes clés.
4. **Deploy** → l'app est en ligne, à ton adresse. 🌸

_(On fera Vercel tranquillement après Supabase — un lièvre à la fois.)_
