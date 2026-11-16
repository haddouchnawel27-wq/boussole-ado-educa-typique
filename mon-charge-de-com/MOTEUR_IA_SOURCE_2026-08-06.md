# Mon Chargé de Com — moteur IA sourcé

## État au 6 août 2026

Le moteur connecté est intégré dans la copie de travail.

- modèle quotidien : `gpt-5.6-terra` ;
- modèle approfondi, uniquement après confirmation : `gpt-5.6-sol` ;
- API OpenAI appelée côté serveur, jamais depuis le fichier HTML ;
- clé OpenAI absente du code, de Git et du navigateur ;
- second code privé requis pour protéger le crédit ;
- recharge automatique OpenAI désactivée ;
- ressources personnelles envoyées uniquement lorsqu'elles sont cochées ;
- recherche Web facultative ;
- réponse structurée : accroches, angles, post, WhatsApp, Telegram, carrousel, visuel, sources, vérifications et contrôles éditoriaux ;
- conservation OpenAI désactivée pour ces requêtes avec `store: false`.

## Recette fictive

### Sans recherche Web

- résultat : réussi ;
- 3 accroches, 3 angles, 7 slides et 1 ressource interne tracée ;
- coût de jetons estimé : `0,032808 $`.

### Avec recherche Web

- résultat : réussi ;
- 2 liens HTTPS réellement cités et 3 points à vérifier ;
- coût de jetons estimé : `0,076665 $` ;
- les éventuels frais propres à l'outil de recherche Web ne sont pas inclus dans l'estimation locale des jetons.

## Variables privées nécessaires sur l'hébergement

- `OPENAI_API_KEY`
- `MCC_ACCESS_CODE`

Ne jamais copier ces valeurs dans `index.html`, dans un fichier versionné ou dans un message.

## Reste avant utilisation en ligne

1. enregistrer les deux variables privées dans Vercel ;
2. publier la branche validée ;
3. ouvrir la préversion ;
4. saisir une seule fois le code privé dans Mon Chargé de Com ;
5. refaire un test fictif depuis l'interface.
