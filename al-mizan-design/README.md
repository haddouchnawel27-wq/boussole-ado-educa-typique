# Educa Typique — build « Claude Design » (fichier unique, autonome)

Version visuelle conçue par Nawel avec Claude Design, transformée en **un seul
fichier HTML autonome** :
- React / ReactDOM **intégrés en ligne** (data URI) → aucune dépendance Internet ;
- contrôles d'intégrité (SRI) liés aux CDN neutralisés ;
- titre, couleur de thème et icône (arche) intégrés.

Résultat : `index.html` s'ouvre **en double-clic** (file://) **et** une fois hébergé
(http/https), entièrement **hors-ligne**. Pour publier : déposer ce **seul fichier**
sur un hébergeur statique (Netlify Drop, GitHub Pages…). Le rendu Design est inchangé.
