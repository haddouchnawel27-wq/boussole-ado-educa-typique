# Mon Chargé de Com — point de reprise

État consigné le **4 août 2026 au soir** pour une reprise le **5 août 2026**.

## Décision validée

Mon Chargé de Com doit recevoir un **véritable moteur de rédaction IA sourcé**, intégré dans l'application. Il ne s'agira pas d'un GPT séparé obligeant Nawel à changer d'outil et à recopier ses contenus.

Le mode local et hors-ligne reste disponible pour la bibliothèque, les documents, les gabarits, les brouillons et la fabrique de publications. L'IA ne sera appelée qu'après une action explicite de l'utilisatrice.

## Ce qui fonctionne déjà

- Telegram et WhatsApp sont proposés en priorité.
- La bibliothèque accepte les textes collés et les fichiers locaux.
- Les fichiers PDF, DOCX, TXT, Markdown, CSV, JSON et HTML sont lus localement.
- Les titres, noms de fichiers et origines sont conservés.
- Les PDF scannés ou protégés sont signalés clairement.
- Le texte collé reste une **source fidèle** : il n'est pas présenté comme ayant déjà été réécrit par une IA.
- Le studio local produit uniquement des trames de travail et ne prétend plus être un moteur IA.
- Les gabarits Educa Typique et Jannat al Qouloub, l'export PNG et le kit Canva sont présents.

## Moteur IA à construire

Ajouter un bouton clair : **« Rédiger avec l'IA sourcée »**.

À partir du sujet, de l'accroche, du mot de fin et des ressources sélectionnées, le moteur devra produire :

1. trois accroches réellement différentes ;
2. trois angles éditoriaux ;
3. une publication complète et cohérente ;
4. une adaptation WhatsApp ;
5. une adaptation Telegram ;
6. un appel à l'action ;
7. une proposition de carrousel ou de visuel Canva ;
8. la liste des sources utilisées ;
9. la distinction entre contenu issu des documents, source externe, proposition éditoriale et élément à vérifier ;
10. un contrôle pédagogique, neuropédagogique, social media, community management, rédactionnel et copyright.

La recherche Internet restera **facultative** et ne se déclenchera que sur demande.

## Modèles et budget validés

- Modèle quotidien envisagé : **GPT-5.6 Terra**.
- Mode approfondi éventuel : **GPT-5.6 Sol**, jamais automatique.
- Budget cible : **5 € maximum par mois**.
- Prévoir un compteur visible, un suivi par requête et un blocage lorsque la limite interne est atteinte.
- Aucun coût n'est actuellement déclenché.
- Aucun appel API n'est actuellement actif.
- La facturation de l'API est séparée de l'abonnement ChatGPT.

## Protection de l'accès

- La clé OpenAI ne devra jamais être écrite dans le HTML ou le JavaScript du navigateur.
- Elle ne devra jamais être communiquée dans une conversation.
- Elle sera ajoutée ultérieurement comme secret côté serveur/hébergement.
- Seuls les documents et extraits explicitement choisis pour une rédaction seront transmis au moteur.

## Situation technique au moment de la pause

- Branche : `codex/mcc-fabrique-publications-20260804`
- Dernier commit : `6cf0669 feat: lire les ressources PDF et DOCX localement`
- La branche locale possède sept commits d'avance sur sa branche de référence.
- Le répertoire de travail est propre au moment de la consignation, avant l'ajout de ce mémo.
- La clé API n'est pas encore configurée : c'est volontaire et aucune dépense n'est possible dans cet état.

## Reprise recommandée

1. Relire ce mémo, sans refaire l'audit déjà terminé.
2. Préparer l'interface « Rédiger avec l'IA sourcée » en conservant le mode local actuel.
3. Créer le point d'entrée serveur sécurisé et le schéma de réponse structuré.
4. Ajouter le compteur et la limite budgétaire avant tout appel réel.
5. Guider Nawel, un écran à la fois, pour créer et installer la clé privée sans la transmettre dans le chat.
6. Tester sur trois sujets fictifs représentatifs.
7. Ne publier et ne facturer aucun appel sans validation explicite de Nawel.

