# 🧭 Mon Chargé de Com

Un assistant éditorial personnel et **100 % hors-ligne** pour trouver un angle,
écrire, créer un visuel, préparer et planifier une publication. Son parcours
**anti-blocage** reste disponible quand la surcharge mentale empêche d'avancer.

> Outil de soutien personnel. Il ne remplace ni un suivi ni l'avis d'un professionnel.

## ✨ Le principe

Le flux central : **idée → écriture guidée → visuel → validation → planification**.
En cas de blocage : **check-in émotionnel → régulation → micro-action → écriture guidée**.

- 🫧 **Check-in** : énergie, stress, clarté, peur du regard, charge mentale → un **score de blocage** oriente vers *création*, *accompagnement* ou *apaisement*.
- 🌬️ **Régulation** : décharge émotionnelle, respiration guidée (cohérence / carrée / 4-7-8), ancrage 5-4-3-2-1, recentrage spirituel optionnel (Noms d'Allah, invocation).
- ✨ **Micro-action** : une seule, adaptée à l'énergie et au temps dispo (2 / 10 / 30 min) — avec le droit de reporter sans culpabiliser.
- 🧠 **Studio de rédaction pédagogique local** : brief par public et objectif, accroche, idée essentielle, mot de fin et ressources sélectionnées ; trois trames de travail (post pédagogique, post relationnel et carrousel), clairement présentées comme des trames et non comme une IA complète.
- 🎓 **Contrôle éditorial croisé** : ingénierie pédagogique, neuropédagogie, social media, community management, rédaction et copyright.
- ✍️ **Atelier d'écriture** : accroches, angles, plan guidé, CTA et hashtags modifiables (**sans fausse génération IA**).
- ✈️ **Telegram et WhatsApp prioritaires** : choix proposés en premier, légende préparée et boutons d'envoi dédiés. Instagram, Facebook, LinkedIn et TikTok restent disponibles.
- 🎨 **Fabrique de publications** : 6 gabarits natifs — Educa Typique et Jannat al Qouloub — remplissage automatique, photo facultative, aperçu, format carré ou portrait, export PNG et partage.
- 📅 **Calendrier** éditorial simple (brouillon / prévu / publié).
- 💡 **Bibliothèque de sujets** : 24 pistes de départ classées par univers et public, utilisables directement dans l'atelier.
- 📄 **Ajout de documents clair** : l'utilisatrice choisit directement les fichiers dont elle voit les noms. PDF, DOCX, TXT, Markdown, CSV, JSON et HTML sont lus localement et conservent leur origine.
- 📁 **Import de dossier facultatif** : pour les grandes bibliothèques, un second parcours explique clairement que Windows masque les fichiers pendant le choix du dossier. Il s'agit d'un import ponctuel, pas d'une liaison permanente.
- 🔎 **Recherche documentaire locale** : à partir du sujet et de l'idée essentielle, le studio classe les ressources les plus proches et les sélectionne comme sources de travail.
- 📚 **Ressources personnelles** : texte collé ou import local, avec titre, chemin d'origine et date de lecture dans la bibliothèque.
- 📖 **Lecteurs locaux PDF et DOCX** : le texte est extrait sur l'appareil grâce à PDF.js et Mammoth, sans téléversement. Les anciens DOC, ODT et RTF restent signalés comme non lus.
- 📋 **Texte collé sans ambiguïté** : il est conservé tel quel comme ressource. Le moteur local s'en sert pour préparer des trames ; la réécriture éditoriale approfondie appartient au futur moteur IA sourcé.
- 🎨 **Kit Canva récupérable** : sauvegarde la publication, télécharge le PNG sous un nom précis, affiche les étapes d'import et ouvre la page d'import Canva.
- 🔎 **Brief IA sourcée** : prépare un prompt complet imposant sources primaires, liens exacts, distinction faits/conseils, vérification et contrôle copyright.
- 🗂️ **Bibliothèque de créations** : brouillons, idées et publications visuelles avec statut brouillon / prêt / publié.
- ⚙️ **Réglages** : mode spirituel, confort dys, taille du texte, export / import / effacement.

## 🔒 Confidentialité & hors-ligne

- **Aucun serveur, aucun compte, aucune donnée envoyée sur Internet.**
- Tout est stocké **uniquement** dans le navigateur de l'appareil (`localStorage`).
- **Fonctionne sans wifi** : un seul fichier HTML, polices système, zéro dépendance externe.

## ▶️ Utilisation

Ouvre simplement `index.html` dans un navigateur. Aucune installation, aucun build.

Sur mobile/tablette : « Ajouter à l'écran d'accueil » pour l'utiliser comme une app.

## 🛠️ Technique

Interface en HTML + CSS + JavaScript vanilla, sans framework et sans réseau.
Les lecteurs PDF.js et Mammoth sont embarqués dans `vendor/` afin que l'extraction
PDF/DOCX reste locale. Leurs licences sont conservées dans ce même dossier.
L'évaluation dynamique de PDF.js est explicitement désactivée (`isEvalSupported:false`)
pour protéger l'ouverture des PDF ; la migration vers une version modulaire récente
reste prévue lorsque l'application ne dépendra plus d'un lancement direct en `file://`.
Sauvegarde via export/import JSON.

*Phase connectée prévue : backend NestJS/Prisma, génération assistée par IA, tendances,
analytics, apprentissage des préférences et connexion Canva — sans supprimer le mode local.*
