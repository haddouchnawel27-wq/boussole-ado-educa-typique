/* Coachy 2.0 — contenus.
   Tout le texte éditable est ici, séparé du code, pour que Nawel puisse
   relire et ajuster sans toucher aux mécanismes. */
(function () {
  'use strict';
  const D = (C.data = {});

  /* ------------------------------------------------------------------
     PROFIL — besoins fonctionnels formulés à la 1re personne.
     Pas de diagnostic, pas de donnée médicale : seulement ce qui aide.
     ------------------------------------------------------------------ */
  D.besoins = [
    { id: 'attention', ico: '🌊', label: 'Mon attention fait des vagues', aide: 'Rounds courts (10 min par défaut), checkpoints doux.' },
    { id: 'lire', ico: '📖', label: 'Lire, écrire ou calculer me demande beaucoup d\'effort', aide: 'Lecture audio proposée, dictée, texte aéré.' },
    { id: 'visuel', ico: '👀', label: 'Les pages chargées me fatiguent les yeux', aide: 'Une info par écran, police lisible, contrastes.' },
    { id: 'consignes', ico: '🧩', label: 'Les consignes longues me perdent', aide: 'Décodeur de consigne mis en avant.' },
    { id: 'demarrer', ico: '🚦', label: 'Démarrer et m\'organiser, c\'est difficile', aide: 'Mission du jour, découpage en petites étapes.' },
    { id: 'memoire', ico: '🧠', label: 'J\'oublie vite ce que j\'ai appris', aide: 'Réactivations espacées dans le labo mémoire.' },
    { id: 'transfert', ico: '🔁', label: 'J\'ai du mal à réutiliser une notion dans un autre exercice', aide: 'Questions « situation différente ».' },
    { id: 'stress', ico: '🌡️', label: 'Les contrôles me stressent', aide: 'Préparation au contrôle, respiration avant l\'épreuve.' },
    { id: 'confiance', ico: '🌱', label: 'Je doute souvent de moi', aide: 'Carnet de réussites mis en avant.' },
    { id: 'fatigue', ico: '🔋', label: 'Je me fatigue vite', aide: 'Pauses proposées, mode faible énergie.' },
  ];
  D.appuis = [
    { id: 'oral', ico: '🗣️', label: 'Je m\'exprime bien à l\'oral' },
    { id: 'ordi', ico: '💻', label: 'Je suis à l\'aise avec l\'ordinateur' },
    { id: 'volonte', ico: '💪', label: 'Je suis volontaire, je m\'accroche' },
    { id: 'concret', ico: '🛒', label: 'J\'aime le concret : le commerce, la vraie vie' },
    { id: 'comprendre', ico: '💡', label: 'Je comprends bien quand on m\'explique' },
    { id: 'objectif', ico: '🎯', label: 'J\'ai un objectif qui me motive' },
  ];
  D.objectifs = [
    { id: 'DNB', label: 'Le brevet (DNB)' },
    { id: 'CFG', label: 'Le CFG' },
    { id: 'stage', label: 'Mon stage' },
    { id: 'orientation', label: 'Mon orientation' },
  ];
  D.interets = ['Commerce / vente', 'Mode', 'Cuisine', 'Animaux', 'Sport', 'Musique', 'Jeux vidéo', 'Dessin', 'Informatique', 'Petite enfance', 'Beauté / coiffure', 'Nature'];

  /* Profil pilote : une ado de 3e qui prépare le DNB et le CFG.
     Le prénom n'est PAS écrit ici : l'ado le tape elle-même (stocké sur son appareil). */
  D.presets = {
    'pilote-3e': {
      nom: 'Profil pilote · 3e · DNB & CFG',
      classe: '3e',
      objectifs: ['DNB', 'CFG'],
      besoins: ['attention', 'lire', 'visuel', 'consignes', 'demarrer', 'memoire', 'transfert', 'stress', 'confiance', 'fatigue'],
      appuis: ['oral', 'ordi', 'volonte', 'concret', 'objectif', 'comprendre'],
      interets: ['Commerce / vente'],
      reglages: { dys: true, audio: true, taille: 18 },
    },
  };

  /* ------------------------------------------------------------------ */
  D.meteo = [
    { id: 'soleil', ico: '☀️', label: 'Ça va bien' },
    { id: 'eclaircie', ico: '🌤️', label: 'Plutôt ok' },
    { id: 'nuages', ico: '☁️', label: 'Mitigé' },
    { id: 'brouillard', ico: '🌫️', label: 'Dans le flou' },
    { id: 'orage', ico: '⛈️', label: 'Tempête' },
  ];
  D.batterieTexte = function (v) {
    if (v <= 15) return 'Batterie très basse. Aujourd\'hui, on protège ton énergie : une toute petite chose suffit, ou du repos.';
    if (v <= 30) return 'Batterie basse. On allège : missions courtes, pauses prévues, zéro pression.';
    if (v <= 60) return 'Batterie moyenne. On avance par petits rounds.';
    if (v <= 80) return 'Bonne batterie. On peut avancer, sans oublier les pauses.';
    return 'Batterie bien chargée. Profites-en pour la mission qui compte le plus.';
  };

  /* ------------------------------------------------------------------
     BOUTONS CONTEXTUELS — chaque bouton ouvre une intervention courte.
     action : outil à ouvrir ensuite (voir m-organise.js).
     ------------------------------------------------------------------ */
  D.contexte = {
    bloque: { ico: '🧱', titre: 'Je bloque', intro: 'D\'accord. On cherche d\'abord ce qui coince, sans se juger.', options: [
      { label: 'Je ne comprends pas la consigne', conseil: 'On la décode ensemble : mots importants, ce qu\'on attend, première étape.', action: 'decodeur' },
      { label: 'Je comprends, mais je ne sais pas comment faire', conseil: 'Quelle est la toute première action possible ? Même minuscule : écrire le titre, relire la question.', action: 'decouper' },
      { label: 'Ça me paraît énorme', conseil: 'On ne regarde pas toute la montagne. On découpe en marches.', action: 'decouper' },
      { label: 'J\'ai peur de me tromper', conseil: 'Une erreur, c\'est une information, pas une note sur toi. Écris un premier jet « brouillon autorisé ».', action: 'parcours:peur' },
    ] },
    decroche: { ico: '🎈', titre: 'Je décroche', intro: 'Ça arrive à tous les cerveaux. Qu\'est-ce qui t\'a embarqué ailleurs ?', options: [
      { label: 'Quelque chose autour de moi (téléphone, bruit…)', conseil: 'Une solution simple à tester maintenant : téléphone retourné, casque, changer de place ?' },
      { label: 'Mes pensées sont parties ailleurs', conseil: 'Dépose-les au parking : elles t\'attendront.', action: 'parking' },
      { label: 'Je fatigue', conseil: 'On raccourcit le round ou on fait une vraie pause. Les deux sont de bonnes réponses.', action: 'pause' },
      { label: 'Je m\'ennuie', conseil: 'Rends l\'objectif plus concret : « 3 lignes », « 2 calculs », puis checkpoint.', action: 'decouper' },
    ] },
    comprendsPas: { ico: '❓', titre: 'Je ne comprends pas', intro: 'Bonne nouvelle : le dire, c\'est déjà avancer.', options: [
      { label: 'Je ne comprends pas la consigne', conseil: 'On la décode étape par étape.', action: 'decodeur' },
      { label: 'Je ne comprends pas la leçon', conseil: 'Mon prof autrement peut te l\'expliquer simplement, avec un exemple concret.', action: 'prof' },
      { label: 'Je ne comprends pas un mot', conseil: 'Note le mot. Cherche-le dans ta leçon ou demande-le. Un mot compris débloque souvent toute la phrase.' },
    ] },
    oublie: { ico: '🫧', titre: 'J\'ai oublié', intro: 'Oublier, c\'est normal : le cerveau garde ce qu\'on réactive.', options: [
      { label: 'J\'ai oublié ce que je devais faire', conseil: 'Regarde ta mission du jour et ton planning. Puis reformule à voix haute : « Là, je dois… ».', action: 'go:organise' },
      { label: 'J\'ai oublié ma leçon', conseil: 'Essaie d\'abord de te souvenir de 3 choses, sans regarder. Puis vérifie. C\'est ça qui fait retenir.', action: 'go:memoire' },
      { label: 'J\'ai oublié mon matériel', conseil: 'Ça arrive. On prépare une checklist pour la prochaine fois.', action: 'go:organise/routines' },
    ] },
    commencer: { ico: '🚦', titre: 'Je ne sais pas commencer', intro: 'Le démarrage est souvent la partie la plus dure. On le rend minuscule.', options: [
      { label: 'Donne-moi juste la 1re étape', conseil: 'Ouvre le cahier ou le fichier. Écris la date et le titre. C\'est tout. Ensuite on voit.' },
      { label: 'Découpe ma tâche avec moi', conseil: 'On transforme la tâche en petites marches.', action: 'decouper' },
      { label: 'Lance un round de 5 minutes', conseil: '5 minutes, pas plus. Tu as le droit d\'arrêter après.', action: 'round5' },
    ] },
    monte: { ico: '🌡️', titre: 'Ça monte', intro: 'On met le travail de côté une minute. D\'abord, faire redescendre.', options: [
      { label: 'Respirer doucement', conseil: 'Souffle long, à ton rythme.', action: 'respiration' },
      { label: 'Revenir dans le présent (5-4-3-2-1)', conseil: 'On utilise tes sens pour te ramener ici.', action: 'ancrage' },
      { label: 'Vider ma tête', conseil: 'Sors tout ce qui tourne, sans trier.', action: 'parking' },
      { label: 'Je veux comprendre ce qui se passe', conseil: 'On regarde ton émotion, ton corps et ce dont tu as besoin.', action: 'parcours:stresse' },
    ] },
    pause: { ico: '☕', titre: 'J\'ai besoin d\'une pause', intro: 'Une pause n\'est pas un abandon : c\'est recharger la batterie.', options: [
      { label: 'Pause 5 minutes', conseil: 'Lève-toi, bois de l\'eau, regarde loin par la fenêtre. Je te préviens à la fin.', action: 'pause5' },
      { label: 'Bouger un peu', conseil: 'Étire-toi vers le plafond, relâche les épaules, marche quelques pas.' },
      { label: 'Un mini-jeu de 60 secondes', conseil: 'Court, fini, puis on revient.', action: 'go:ludo' },
      { label: 'J\'arrête pour aujourd\'hui', conseil: 'C\'est une décision de pilote. Note où tu en es pour reprendre facilement.', action: 'stop' },
    ] },
  };

  /* ------------------------------------------------------------------
     ÉMOTIONS — roue, corps, besoins, stratégies, pensées (TCC).
     ------------------------------------------------------------------ */
  D.roue = [
    { id: 'peur', ico: '😨', nom: 'Peur / stress', mots: ['inqui{ète|et}', 'stress{ée|é}', 'sous pression', 'tend{ue|u}', 'paniqu{ée|é}', 'bloqu{ée|é}', 'pas en sécurité'] },
    { id: 'tristesse', ico: '😢', nom: 'Tristesse', mots: ['déç{ue|u}', 'seul{e|}', 'bless{ée|é}', 'découra{gée|gé}', 'vid{ée|é}', 'incompri{se|s}', 'nostalgique'] },
    { id: 'colere', ico: '😠', nom: 'Colère', mots: ['agac{ée|é}', 'frustr{ée|é}', 'énerv{ée|é}', 'vex{ée|é}', 'injustement trait{ée|é}', 'à bout', 'révolt{ée|é}'] },
    { id: 'honte', ico: '😳', nom: 'Honte / gêne', mots: ['gên{ée|é}', 'jug{ée|é}', 'nul{le|}', 'ridicule', 'expos{ée|é}', 'rabaiss{ée|é}'] },
    { id: 'fatigue', ico: '🥱', nom: 'Fatigue', mots: ['épuis{ée|é}', 'lente', 'satur{ée|é}', 'dans le brouillard', 'à plat', 'lourde'] },
    { id: 'joie', ico: '😊', nom: 'Joie / apaisement', mots: ['fi{ère|er}', 'calme', 'motiv{ée|é}', 'soulag{ée|é}', 'capable', 'compri{se|s}', 'content{e|}'] },
  ];
  D.corps = ['Cœur qui bat vite', 'Ventre noué', 'Gorge serrée', 'Mâchoire serrée', 'Épaules tendues', 'Mains moites', 'Chaud au visage', 'Envie de pleurer', 'Jambes qui bougent', 'Tête lourde', 'Respiration rapide', 'Rien de spécial'];
  D.besoinsEmo = ['Du calme', 'Une pause', 'Être rassur{ée|é}', 'Être compri{se|s}', 'Qu\'on m\'explique', 'Bouger', 'Être seul{e|} un moment', 'Parler à quelqu\'un', 'Dormir / me reposer', 'Manger / boire', 'Un câlin', 'Du temps'];
  D.strategies = ['Respirer doucement', 'Boire de l\'eau', 'Bouger / marcher', 'Écouter de la musique', 'Écrire ce que je ressens', 'Parler à quelqu\'un de confiance', 'Me mettre au calme', 'Dessiner', 'Prendre l\'air', 'Me rappeler une réussite', 'Le 5-4-3-2-1', 'Découper ce qui me fait peur'];
  D.pensees = [
    { auto: 'Je suis nul{le|}.', piege: 'Généraliser', autre: 'Là, je n\'y arrive pas ENCORE. Ça ne dit rien de qui je suis.' },
    { auto: 'Je vais rater, c\'est sûr.', piege: 'Prédire le pire', autre: 'Je ne connais pas l\'avenir. Je peux préparer une étape à la fois.' },
    { auto: 'Tout le monde va se moquer.', piege: 'Lire dans les pensées', autre: 'Je ne sais pas ce qu\'ils pensent. La plupart sont occupés par leurs propres soucis.' },
    { auto: 'Si ce n\'est pas parfait, ça ne vaut rien.', piege: 'Tout ou rien', autre: 'Un travail « assez bien » rapporte des points. Fait vaut mieux que parfait.' },
    { auto: 'Je n\'ai jamais réussi.', piege: 'Oublier les réussites', autre: 'Mon carnet de réussites dit autre chose. Je peux le relire.' },
    { auto: 'Les autres comprennent tout de suite, pas moi.', piege: 'Se comparer', autre: 'Chaque cerveau a son chemin. Le mien a besoin d\'étapes : c\'est un mode d\'emploi, pas un défaut.' },
  ];

  /* Parcours guidés « Je suis… » (espace Je prends soin de moi) */
  D.parcours = {
    stresse: { ico: '😰', titre: 'Je suis stress{ée|é}', valide: 'Le stress, c\'est ton alarme interne qui essaie de te protéger. Elle sonne parfois trop fort.', outil: 'respiration', besoin: 'Qu\'est-ce qui t\'aiderait maintenant ?', apres: 'Découper ce qui te stresse en une seule petite étape.' },
    triste: { ico: '😢', titre: 'Je suis triste', valide: 'La tristesse dit souvent qu\'il y a quelque chose d\'important pour toi. Tu as le droit de la ressentir.', outil: 'ecrire', besoin: 'De quoi aurais-tu besoin ?', apres: 'Parler à quelqu\'un de confiance, ou faire une chose douce pour toi.' },
    colere: { ico: '😠', titre: 'Je suis en colère', valide: 'La colère arrive souvent quand quelque chose semble injuste ou trop lourd. D\'abord, on fait baisser la pression.', outil: 'bouger', besoin: 'Derrière ta colère, il y a peut-être un besoin :', apres: 'Quand ce sera redescendu, tu pourras dire ce qui n\'allait pas, avec des mots calmes.' },
    epuise: { ico: '🥱', titre: 'Je suis épuis{ée|é}', valide: 'Quand la batterie est vide, forcer coûte encore plus. Se reposer fait partie du travail.', outil: 'repos', besoin: 'Ton corps te demande peut-être :', apres: 'Aujourd\'hui, une seule toute petite chose suffit. Ou rien, et c\'est ok.' },
    peur: { ico: '🫣', titre: 'J\'ai peur de me tromper', valide: 'La peur de l\'erreur montre que tu tiens à bien faire. Mais le cerveau apprend justement grâce aux erreurs.', outil: 'pensee', besoin: 'Qu\'est-ce qui te rassurerait ?', apres: 'Fais un « brouillon autorisé » : un premier essai, imparfait exprès.' },
    bloque: { ico: '🧱', titre: 'Je suis bloqu{ée|é}', valide: 'Être bloqu{ée|é}, ce n\'est pas être incapable. C\'est un signal : la marche est trop haute, on la découpe.', outil: 'ancrage', besoin: 'Qu\'est-ce qui coince le plus ?', apres: 'Ouvrir l\'outil « Découper ma tâche ».' },
    pensees: { ico: '🌪️', titre: 'J\'ai trop de pensées', valide: 'Quand la tête est pleine, il n\'y a plus de place pour réfléchir. On vide un peu.', outil: 'vider', besoin: 'Une fois vidée, qu\'est-ce qui compte le plus ?', apres: 'Choisir UNE seule chose parmi ce que tu as écrit.' },
    aide: { ico: '🤝', titre: 'J\'ai besoin d\'aide', valide: 'Demander de l\'aide, c\'est une compétence, pas une faiblesse.', outil: 'aide', besoin: 'Vers qui peux-tu te tourner ?', apres: 'Si tu es en danger ou si tu penses à te faire du mal : appelle le 3114 ou le 112, ou parle tout de suite à un adulte.' },
  };

  /* ------------------------------------------------------------------
     MON JARDIN INTÉRIEUR — module facultatif.
     ⚠️ Chaque contenu porte un statut. Rien n'est inventé : uniquement des
     versets du Coran (référence sourate:verset) et une formule rapportée
     dans les deux Sahîh. Les textes de méditation sont des réflexions
     rédigées pour l'appli, pas des hadiths : à relire par Nawel.
     statut : 'valide' | 'a-valider'
     ------------------------------------------------------------------ */
  D.invocations = [
    { id: 'zidni', theme: 'Avant d\'apprendre', ar: 'رَبِّ زِدْنِي عِلْمًا', ph: 'Rabbi zidnî ʿilmâ', fr: 'Mon Seigneur, accrois-moi en savoir.', ref: 'Coran, sourate Ṭâ-Hâ (20), verset 114', statut: 'a-valider' },
    { id: 'charh', theme: 'Avant un contrôle ou un oral', ar: 'رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي', ph: 'Rabbi-chrah lî ṣadrî, wa yassir lî amrî, waḥlul ʿuqdatan min lisânî, yafqahû qawlî', fr: 'Mon Seigneur, ouvre-moi ma poitrine, facilite-moi ma tâche, dénoue un nœud de ma langue, afin qu\'ils comprennent mes paroles.', ref: 'Coran, sourate Ṭâ-Hâ (20), versets 25 à 28', statut: 'a-valider' },
    { id: 'hasbuna', theme: 'Quand j\'ai peur', ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', ph: 'Ḥasbunâ-llâhu wa niʿma-l-wakîl', fr: 'Allah nous suffit, et quel excellent Garant.', ref: 'Coran, sourate Âl ʿImrân (3), verset 173', statut: 'a-valider' },
    { id: 'hawqala', theme: 'Quand c\'est trop lourd', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', ph: 'Lâ ḥawla wa lâ quwwata illâ billâh', fr: 'Il n\'y a de force ni de puissance qu\'en Allah.', ref: 'Rapporté par al-Bukhârî et Muslim', statut: 'a-valider' },
  ];
  D.versets = [
    { id: 'yusr', theme: 'Espérance', ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', ph: 'Inna maʿa-l-ʿusri yusrâ', fr: 'Certes, avec la difficulté vient une facilité.', ref: 'Coran, sourate Ach-Charḥ (94), verset 6', statut: 'a-valider' },
    { id: 'wusaha', theme: 'Quand je suis fatigu{ée|é}', ar: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', ph: 'Lâ yukallifu-llâhu nafsan illâ wusʿahâ', fr: 'Allah n\'impose à aucune âme une charge supérieure à sa capacité.', ref: 'Coran, sourate Al-Baqara (2), verset 286', statut: 'a-valider' },
    { id: 'tawakkul', theme: 'Tawakkul', ar: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', ph: 'Wa man yatawakkal ʿalâ-llâhi fa-huwa ḥasbuh', fr: 'Et quiconque place sa confiance en Allah, Il lui suffit.', ref: 'Coran, sourate Aṭ-Ṭalâq (65), verset 3', statut: 'a-valider' },
    { id: 'qulub', theme: 'Apaisement', ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', ph: 'A lâ bi-dhikri-llâhi taṭmaʾinnu-l-qulûb', fr: 'N\'est-ce point par le rappel d\'Allah que les cœurs s\'apaisent ?', ref: 'Coran, sourate Ar-Raʿd (13), verset 28', statut: 'a-valider' },
  ];
  D.dhikr = [
    { ar: 'سُبْحَانَ اللَّهِ', ph: 'Subḥâna-llâh', fr: 'Gloire à Allah' },
    { ar: 'الْحَمْدُ لِلَّهِ', ph: 'Al-ḥamdu li-llâh', fr: 'Louange à Allah' },
    { ar: 'اللَّهُ أَكْبَرُ', ph: 'Allâhu akbar', fr: 'Allah est le plus Grand' },
    { ar: 'أَسْتَغْفِرُ اللَّهَ', ph: 'Astaghfiru-llâh', fr: 'Je demande pardon à Allah' },
  ];
  D.noms = [
    { id: 'latif', ar: 'اللَّطِيف', ph: 'Al-Laṭîf', fr: 'Le Doux, le Bienveillant dans les détails', med: 'Pense à une petite chose douce arrivée aujourd\'hui, même minuscule. La douceur passe souvent par les détails.', statut: 'a-valider' },
    { id: 'salam', ar: 'السَّلَام', ph: 'As-Salâm', fr: 'La Paix', med: 'Respire lentement trois fois. À chaque expiration, imagine que tu déposes un peu de ce qui pèse.', statut: 'a-valider' },
    { id: 'wadud', ar: 'الْوَدُود', ph: 'Al-Wadûd', fr: 'Le Tout-Affectueux', med: 'Tu n\'as pas besoin d\'être parfai{te|t} pour être aim{ée|é}. Laisse cette idée se poser un moment.', statut: 'a-valider' },
    { id: 'fattah', ar: 'الْفَتَّاح', ph: 'Al-Fattâḥ', fr: 'Celui qui ouvre', med: 'Avant un travail difficile : une porte peut s\'ouvrir là où tu ne vois qu\'un mur. Commence par une petite étape.', statut: 'a-valider' },
    { id: 'hafiz', ar: 'الْحَفِيظ', ph: 'Al-Ḥafîẓ', fr: 'Le Gardien', med: 'Pense à ce qui te protège et te soutient : des personnes, des lieux, des habitudes.', statut: 'a-valider' },
  ];
  D.pausesUniverselles = [
    { titre: 'Trois mercis', texte: 'Pense à trois choses, même toutes petites, pour lesquelles tu peux dire merci aujourd\'hui.' },
    { titre: 'Regarder le ciel', texte: 'Va à la fenêtre. Regarde le ciel 30 secondes. Remarque les couleurs, la lumière, le mouvement.' },
    { titre: 'Les mains', texte: 'Pose tes mains sur tes cuisses. Sens leur chaleur. Respire trois fois en les observant.' },
    { titre: 'Un endroit sûr', texte: 'Ferme les yeux si tu veux. Imagine un endroit où tu te sens bien. Qu\'est-ce que tu y vois, entends, sens ?' },
  ];

  /* ------------------------------------------------------------------
     MON MODE D'EMPLOI DE MOI-MÊME — 10 chapitres.
     type : texte | choix (plusieurs) | echelle (0-10)
     ------------------------------------------------------------------ */
  D.chapitres = [
    { id: 'histoire', ico: '📜', titre: 'Mon histoire', intro: 'D\'où je viens, ce que j\'ai traversé, ce dont je suis fi{ère|er}.', q: [
      { id: 'parcours', type: 'texte', label: 'Mon parcours d\'école en quelques mots' },
      { id: 'fiere', type: 'texte', label: 'Un moment dont je suis fi{ère|er}' },
      { id: 'traverse', type: 'texte', label: 'Une difficulté que j\'ai déjà traversée' },
    ] },
    { id: 'connaitre', ico: '🪞', titre: 'Mieux me connaître', intro: 'Qui je suis, au-delà des notes.', q: [
      { id: 'mots', type: 'texte', label: 'Trois mots qui me décrivent' },
      { id: 'aime', type: 'texte', label: 'Ce que j\'aime faire quand j\'ai du temps libre' },
      { id: 'incompris', type: 'texte', label: 'Ce que les adultes ne comprennent pas toujours chez moi' },
    ] },
    { id: 'cognitif', ico: '🧠', titre: 'Mon fonctionnement cognitif', intro: 'Comment mon cerveau apprend le mieux.', q: [
      { id: 'canal', type: 'choix', label: 'Je comprends mieux quand…', options: ['On me l\'explique à l\'oral', 'Je vois un schéma ou une image', 'Je fais avec mes mains', 'C\'est découpé en étapes', 'Il y a un exemple concret', 'Je peux réécouter', 'Je le redis avec mes mots'] },
      { id: 'difficile', type: 'choix', label: 'Ce qui me coûte le plus d\'énergie', options: ['Lire de longs textes', 'Écrire beaucoup', 'Calculer de tête', 'Recopier au tableau', 'Les consignes longues', 'Rester concentr{ée|é} longtemps', 'Me repérer sur une page chargée', 'Retenir par cœur'] },
      { id: 'moment', type: 'choix', label: 'Mon meilleur moment pour travailler', options: ['Le matin', 'En fin de matinée', 'L\'après-midi', 'Le soir', 'Ça dépend des jours'] },
    ] },
    { id: 'ressources', ico: '💎', titre: 'Mes super-ressources', intro: 'Mes forces, mes talents, ce qui marche pour moi.', q: [
      { id: 'forces', type: 'choix', label: 'Mes forces', options: ['Je parle bien', 'Je suis persévérant{e|}', 'Je suis à l\'aise sur ordi', 'J\'ai le sens du concret', 'Je suis genti{lle|l} avec les autres', 'Je suis créati{ve|f}', 'J\'ai de l\'humour', 'Je suis organis{ée|é} quand ça m\'intéresse', 'J\'ai le sens du commerce'] },
      { id: 'aides', type: 'texte', label: 'Ce qui m\'aide vraiment à travailler' },
      { id: 'phrase', type: 'texte', label: 'Ma phrase de secours quand ça va mal' },
      { id: 'plan', type: 'texte', label: 'Mon plan SI… ALORS… (ex. : SI je bloque, ALORS je découpe)' },
    ] },
    { id: 'action', ico: '⚙️', titre: 'Mon cerveau en action', intro: 'Ce que j\'ai découvert en travaillant avec Coachy (après validation).', q: [
      { id: 'strategies', type: 'texte', label: 'Les stratégies qui marchent pour moi' },
      { id: 'fatigue', type: 'choix', label: 'Ce qui me fatigue', options: ['Le bruit', 'La lumière forte', 'Les écrans longtemps', 'Rester assi{se|s}', 'Les changements imprévus', 'Le manque de sommeil', 'La faim', 'Les journées longues'] },
      { id: 'sensoriel', type: 'choix', label: 'Mes besoins sensoriels', options: ['Calme / casque', 'Bouger un peu', 'Lumière douce', 'Mâchouiller / boire', 'Être près de la fenêtre', 'Un objet dans les mains', 'De l\'espace autour de moi'] },
    ] },
    { id: 'meteo', ico: '🌦️', titre: 'Ma météo intérieure', intro: 'Mes émotions, ce qui les déclenche, ce qui m\'apaise.', q: [
      { id: 'declencheurs', type: 'choix', label: 'Ce qui me fait monter vite', options: ['Les remarques devant les autres', 'Les injustices', 'Les consignes longues', 'Le bruit', 'Les contrôles', 'Les changements de programme', 'Quand on me presse', 'Quand je suis fatigu{ée|é}'] },
      { id: 'signaux', type: 'choix', label: 'Mon corps me prévient par…', options: D.corps.slice(0, 11) },
      { id: 'apaise', type: 'texte', label: 'Ce qui m\'apaise' },
      { id: 'pasdire', type: 'texte', label: 'La phrase qu\'il ne faut pas me dire quand ça monte' },
    ] },
    { id: 'personnes', ico: '🫶', titre: 'Les personnes qui comptent', intro: 'Mon équipe : vers qui je peux me tourner.', q: [
      { id: 'confiance', type: 'texte', label: 'Les personnes à qui je peux parler (pas besoin de noms : « ma mère », « ma prof de… »)' },
      { id: 'ecole', type: 'texte', label: 'À l\'école, je peux demander de l\'aide à…' },
      { id: 'aider', type: 'texte', label: 'Comment les autres peuvent m\'aider' },
    ] },
    { id: 'anime', ico: '🔥', titre: 'Ce qui m\'anime', intro: 'Mes passions, mes valeurs, ce qui me donne de l\'énergie.', q: [
      { id: 'passions', type: 'texte', label: 'Ce qui me passionne' },
      { id: 'valeurs', type: 'choix', label: 'Ce qui compte pour moi', options: ['La famille', 'L\'amitié', 'La justice', 'L\'honnêteté', 'Aider les autres', 'L\'indépendance', 'La foi', 'La créativité', 'La réussite', 'Le respect'] },
      { id: 'energie', type: 'texte', label: 'Ce qui recharge ma batterie' },
    ] },
    { id: 'possibles', ico: '🧭', titre: 'Explorer les possibles', intro: 'Les métiers et les voies qui m\'attirent — sans pression.', q: [
      { id: 'domaines', type: 'choix', label: 'Les domaines qui m\'attirent', options: ['Commerce / vente', 'Accueil', 'Mode', 'Cuisine / restauration', 'Petite enfance', 'Soins / beauté', 'Animaux', 'Logistique', 'Informatique', 'Artisanat', 'Sport'] },
      { id: 'stage', type: 'texte', label: 'Ce que j\'ai aimé (ou pas) en stage' },
      { id: 'questions', type: 'texte', label: 'Les questions que je me pose sur mon orientation' },
    ] },
    { id: 'avenir', ico: '🌅', titre: 'Construire mon avenir', intro: 'Mes objectifs, petits et grands.', q: [
      { id: 'court', type: 'texte', label: 'Mon objectif pour ce trimestre' },
      { id: 'annee', type: 'texte', label: 'Mon objectif pour la fin de l\'année (DNB, CFG…)' },
      { id: 'reve', type: 'texte', label: 'Dans quelques années, j\'aimerais…' },
      { id: 'premier', type: 'texte', label: 'Le premier petit pas que je peux faire' },
    ] },
  ];
})();
