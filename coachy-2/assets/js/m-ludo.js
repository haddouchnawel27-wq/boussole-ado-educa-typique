/* Coachy 2.0 — Ludothèque & Laboratoire de la vraie vie.
   Jeux courts, progressifs, SANS chrono obligatoire, sans classement.
   Le niveau monte après 3 réussites, et redescend si l'ado le choisit. */
(function () {
  'use strict';
  const ui = C.ui, esc = C.esc;

  function g(id) { const j = C.state.jeux; j[id] = j[id] || { niveau: 1, parties: 0, reussites: 0, hist: [] }; return j[id]; }
  function partieFinie(id, reussie) {
    const s = g(id); s.parties++; s.hist.push(Date.now()); s.hist = s.hist.slice(-50);
    let monte = false;
    if (reussie) { s.reussites++; if (s.reussites % 3 === 0 && s.niveau < 5) { s.niveau++; monte = true; } }
    C.save();
    return monte;
  }

  const JEUX = [
    { id: 'detective', ico: '🔍', t: 'Détective des détails', s: 'Attention', c: 'bleu' },
    { id: 'memo', ico: '🃏', t: 'Cartes et associations', s: 'Mémoire', c: 'lavande' },
    { id: 'regle', ico: '🔀', t: 'Changement de règle', s: 'Flexibilité', c: 'sauge' },
    { id: 'journee', ico: '🗓️', t: 'Planifier une journée', s: 'Organisation', c: 'sable' },
    { id: 'consignes', ico: '🧩', t: 'Consignes à décoder', s: 'Compréhension', c: 'bleu' },
    { id: 'prix', ico: '🏷️', t: 'Prix et promotions', s: 'Mathématiques', c: 'sable' },
    { id: 'emotions', ico: '🎭', t: 'Détective des émotions', s: 'Émotions', c: 'lavande' },
    { id: 'social', ico: '💬', t: 'Situations à choix', s: 'Habiletés sociales', c: 'sauge' },
    { id: 'quiz', ico: '❓', t: 'Quiz de mes cartes', s: 'Apprentissages', c: 'bleu' },
  ];
  const VRAIE_VIE = [
    { id: 'boulangerie', ico: '🥖', t: 'Payer à la boulangerie', s: 'Choisir les pièces' },
    { id: 'caisse', ico: '🧾', t: 'Rendre la monnaie', s: 'Je tiens la caisse' },
    { id: 'comparer', ico: '⚖️', t: 'Comparer des prix', s: 'Le meilleur achat' },
    { id: 'horaire', ico: '🚌', t: 'Lire un horaire', s: 'Bus et trajets' },
    { id: 'trajet', ico: '🗺️', t: 'Préparer un trajet', s: 'Dans le bon ordre' },
    { id: 'cartable', ico: '🎒', t: 'Organiser mon cartable', s: 'Selon l\'emploi du temps' },
    { id: 'stage', ico: '💼', t: 'Ma journée de stage', s: 'Prévoir et s\'organiser' },
    { id: 'consignepro', ico: '📋', t: 'Consignes professionnelles', s: 'Au travail' },
  ];

  C.screen('ludo', function (args) {
    if (args[0]) return lancer(args[0]);
    const tile = (j) => `<a class="tile ${j.c || ''}" href="#/ludo/${j.id}"><span class="ico">${j.ico}</span><b>${j.t}</b><span class="muted">${j.s}${C.state.jeux[j.id] ? ' · niv. ' + C.state.jeux[j.id].niveau : ''}</span></a>`;
    return `<h1>🎲 J'entraîne mon cerveau</h1>
      <p class="muted">Des jeux courts, sans chrono, sans classement. Le niveau s'adapte tout seul.</p>
      ${C.faibleEnergie() ? '<div class="bulle sobre">🌙 Batterie basse : choisis un jeu tout doux, ou fais une vraie pause.</div>' : ''}
      <h2>Ludothèque</h2><div class="grid two">${JEUX.map(tile).join('')}</div>
      <h2 style="margin-top:18px">🛒 Laboratoire de la vraie vie</h2><div class="grid two">${VRAIE_VIE.map((j) => tile(Object.assign({ c: 'sable' }, j))).join('')}</div>`;
  });

  let cur = null; // partie en cours
  function entete(id, titre, consigne) {
    const s = g(id);
    return `${ui.crumb('ludo', 'Ludothèque')}<h1>${titre}</h1>
      <p class="muted small">Niveau ${s.niveau} · ${s.parties} partie(s) jouée(s)
      ${s.niveau > 1 ? ` · <button class="btn discret" data-act="ludoNiv" data-arg="${id}|-1">plus facile</button>` : ''}${s.niveau < 5 ? `<button class="btn discret" data-act="ludoNiv" data-arg="${id}|1">plus difficile</button>` : ''}</p>
      ${consigne ? `<div class="bulle">${consigne} ${C.state.reglages.audio ? `<button class="btn discret" data-act="direTexte" data-arg="${esc(consigne.replace(/<[^>]+>/g, ''))}">🔊</button>` : ''}</div>` : ''}`;
  }
  C.act('ludoNiv', (el, a) => { const [id, d] = a.split('|'), s = g(id); s.niveau = Math.max(1, Math.min(5, s.niveau + +d)); C.save(); cur = null; C.render(); });
  C.act('rejouer', () => { cur = null; C.render(); });
  function fin(id, reussie, msg) {
    // compté une seule fois, même si l'écran se redessine
    if (!cur.compte) { cur.compte = true; cur.monte = partieFinie(id, reussie); }
    const monte = cur.monte;
    return `<div class="card sauge center" style="margin-top:12px"><div class="big-emoji">${reussie ? '🎉' : '🌱'}</div><p>${msg}</p>
      ${monte ? '<p><b>⬆️ Niveau suivant débloqué !</b></p>' : ''}
      <div class="row" style="justify-content:center"><button class="btn primaire" data-act="rejouer">Rejouer</button><a class="btn" href="#/ludo">Autre jeu</a></div></div>`;
  }

  function lancer(id) {
    const f = { detective, memo, regle, journee, consignes: () => qcm('consignes'), prix, emotions: () => qcm('emotions'), social: () => qcm('social'), quiz, boulangerie, caisse, comparer, horaire, trajet, cartable, stage: () => qcm('stage'), consignepro: () => qcm('consignepro') }[id];
    if (!f) return ui.vide('Jeu introuvable.');
    if (!cur || cur.id !== id) cur = { id };
    return f();
  }

  /* ---------- 1. Détective des détails (attention) ---------- */
  const PAIRES = [['🍎', '🍅'], ['🐱', '🐯'], ['⭐', '🌟'], ['🔵', '🟦'], ['🌙', '🌛'], ['🍪', '🥯'], ['🎈', '🏮'], ['🐟', '🐠']];
  function detective() {
    const n = g('detective').niveau;
    if (!cur.grid) {
      const [cible, leurre] = C.pick(PAIRES);
      const taille = 18 + n * 6, nbC = 3 + n;
      const autres = C.shuffle(PAIRES.flat().filter((x) => x !== cible && x !== leurre));
      const cells = Array.from({ length: taille }, (_, i) => (i < nbC ? cible : i < nbC + 2 + n ? leurre : autres[i % (n > 2 ? autres.length : 4)]));
      Object.assign(cur, { grid: C.shuffle(cells), cible, trouves: [], erreurs: 0 });
    }
    const reste = cur.grid.filter((x) => x === cur.cible).length - cur.trouves.length;
    return `${entete('detective', '🔍 Détective des détails', `Trouve tous les <b style="font-size:1.4rem">${cur.cible}</b>. Attention aux faux jumeaux ! Prends ton temps.`)}
      <p class="small">Il en reste <b>${reste}</b>.</p>
      <div class="detail-grid">${cur.grid.map((x, i) => `<button data-act="detClic" data-arg="${i}" class="${cur.trouves.includes(i) ? 'ok' : ''}" aria-label="Case ${i + 1}">${x}</button>`).join('')}</div>
      ${reste === 0 ? fin('detective', cur.erreurs <= 2, cur.erreurs ? `Tout trouvé ! ${cur.erreurs} faux jumeau(x) en chemin : c'est en ralentissant qu'on les repère.` : 'Tout trouvé, sans te faire piéger. Œil de détective !') : ''}`;
  }
  C.act('detClic', (el, i) => {
    i = +i; if (cur.trouves.includes(i)) return;
    if (cur.grid[i] === cur.cible) { cur.trouves.push(i); C.rerender(); }
    else { cur.erreurs++; el.classList.add('non'); setTimeout(() => el.classList.remove('non'), 600); }
  });

  /* ---------- 2. Mémoire : cartes et associations ---------- */
  const ASSOC = [['🥖', 'Baguette'], ['🧀', 'Fromage'], ['🍎', 'Pomme'], ['🚌', 'Bus'], ['📚', 'Livre'], ['💶', 'Billet'], ['⏰', 'Réveil'], ['🧾', 'Ticket'], ['🛒', 'Caddie'], ['📦', 'Colis']];
  function memo() {
    const n = g('memo').niveau;
    if (!cur.cartes) {
      const nb = Math.min(4 + n, 8);
      const sel = C.shuffle(ASSOC).slice(0, nb);
      const cartes = [];
      sel.forEach(([e, m], k) => { cartes.push({ k, v: e }); cartes.push({ k, v: n >= 3 ? m : e }); });
      Object.assign(cur, { cartes: C.shuffle(cartes), ouv: [], ok: [], coups: 0, bloque: false });
    }
    const fini = cur.ok.length === cur.cartes.length;
    return `${entete('memo', '🃏 Cartes et associations', g('memo').niveau >= 3 ? 'Associe chaque image à son mot.' : 'Retrouve les paires identiques.')}
      <div class="memo-grid">${cur.cartes.map((c, i) => { const vis = cur.ouv.includes(i) || cur.ok.includes(i); return `<button data-act="memoClic" data-arg="${i}" class="${cur.ok.includes(i) ? 'ok' : vis ? 'vu' : ''}" style="${c.v.length > 2 ? 'font-size:.8rem' : ''}" aria-label="${vis ? esc(c.v) : 'Carte cachée'}">${vis ? esc(c.v) : '❔'}</button>`; }).join('')}</div>
      <p class="muted small">${cur.coups} essai(s)</p>
      ${fini ? fin('memo', true, `Toutes les paires en ${cur.coups} essais. Ta mémoire de travail a bossé !`) : ''}`;
  }
  C.act('memoClic', (el, i) => {
    i = +i; if (cur.bloque || cur.ok.includes(i) || cur.ouv.includes(i)) return;
    cur.ouv.push(i);
    if (cur.ouv.length === 2) {
      cur.coups++;
      const [a, b] = cur.ouv;
      if (cur.cartes[a].k === cur.cartes[b].k) { cur.ok.push(a, b); cur.ouv = []; }
      else { cur.bloque = true; setTimeout(() => { cur.ouv = []; cur.bloque = false; if (C.courant().name === 'ludo') C.rerender(); }, 1100); }
    }
    C.rerender();
  });

  /* ---------- 3. Flexibilité : changement de règle ---------- */
  const FORMES = ['●', '■', '▲'], COUL = [['bleu', '#4E7FA8'], ['vert', '#6F9479'], ['orange', '#D98C6A']];
  function regle() {
    const n = g('regle').niveau;
    if (!cur.essais) {
      const essais = [];
      const total = 12, chg = n >= 3 ? 3 : 4;
      let r = 'couleur';
      for (let i = 0; i < total; i++) {
        if (i && i % chg === 0) r = n >= 4 ? C.pick(['couleur', 'nombre', 'forme'].filter((x) => x !== r)) : r === 'couleur' ? 'nombre' : 'couleur';
        essais.push({ r, f: C.rand(0, 2), c: C.rand(0, 2), nb: C.rand(1, 6) });
      }
      Object.assign(cur, { essais, i: 0, bons: 0, retour: '' });
    }
    if (cur.i >= cur.essais.length) return entete('regle', '🔀 Changement de règle') + fin('regle', cur.bons >= 9, `${cur.bons}/12 bien triées. Changer de règle en cours de route, c'est exactement ce que demande la flexibilité.`);
    const e = cur.essais[cur.i], prev = cur.essais[cur.i - 1];
    const opts = e.r === 'couleur' ? COUL.map((c) => c[0]) : e.r === 'nombre' ? ['pair', 'impair'] : ['rond', 'carré', 'triangle'];
    const annonce = !prev || prev.r !== e.r;
    return `${entete('regle', '🔀 Changement de règle', 'Trie chaque carte selon la règle affichée. Attention : la règle change de temps en temps !')}
      <div class="card ${annonce ? 'sable' : ''} center"><p>${annonce ? '⚠️ <b>Nouvelle règle !</b><br>' : ''}Règle : trier par <b style="font-size:1.2rem">${e.r.toUpperCase()}</b></p>
      <div style="font-size:2.6rem;color:${COUL[e.c][1]};letter-spacing:.2em">${FORMES[e.f].repeat(e.nb)}</div><p class="muted small">carte ${cur.i + 1}/12</p></div>
      <div class="grid" style="grid-template-columns:repeat(${opts.length},1fr);margin-top:10px">${opts.map((o) => `<button class="btn" data-act="regleRep" data-arg="${o}">${o}</button>`).join('')}</div>
      <p class="small">${cur.retour}</p>`;
  }
  C.act('regleRep', (el, o) => {
    const e = cur.essais[cur.i];
    const bon = e.r === 'couleur' ? COUL[e.c][0] : e.r === 'nombre' ? (e.nb % 2 ? 'impair' : 'pair') : ['rond', 'carré', 'triangle'][e.f];
    if (o === bon) { cur.bons++; cur.retour = '✅ Oui !'; } else cur.retour = `🔄 Ici c'était « ${bon} » (règle : ${e.r}).`;
    cur.i++; C.rerender();
  });

  /* ---------- 4. Planifier une journée ---------- */
  const JOURNEES = [
    { titre: 'Mercredi', taches: [['Dentiste à 14 h', 'apm'], ['Devoirs de maths', 'matin|apm'], ['Déjeuner', 'midi'], ['Sport à 17 h 30', 'soir'], ['Préparer mon sac pour jeudi', 'soir']], regles: ['Le dentiste est à 14 h.', 'Le sport commence à 17 h 30.', 'Les devoirs, c\'est mieux quand on n\'est pas épuisé{e|}.'] },
    { titre: 'Samedi', taches: [['Courses au marché (ouvert le matin)', 'matin'], ['Anniversaire d\'une amie à 15 h', 'apm'], ['Ranger ma chambre', 'matin|apm'], ['Déjeuner en famille', 'midi'], ['Regarder un film', 'soir']], regles: ['Le marché ferme à 13 h.', 'L\'anniversaire est à 15 h.'] },
    { titre: 'Jour de stage', taches: [['Arriver au magasin à 9 h', 'matin'], ['Pause déjeuner', 'midi'], ['Mettre en rayon', 'matin|apm'], ['Remplir mon carnet de stage', 'soir'], ['Préparer ma tenue pour demain', 'soir']], regles: ['Le magasin ouvre à 9 h.', 'Le carnet de stage se remplit à la fin de la journée.'] },
  ];
  const CRENEAUX = [['matin', 'Matin'], ['midi', 'Midi'], ['apm', 'Après-midi'], ['soir', 'Soir']];
  function journee() {
    if (!cur.j) Object.assign(cur, { j: JOURNEES[(g('journee').parties) % JOURNEES.length], rep: {}, verif: false });
    const j = cur.j;
    let ok = 0;
    const lignes = j.taches.map(([t, bon], i) => {
      const v = cur.rep[i] || '';
      const juste = v && bon.split('|').includes(v);
      if (juste) ok++;
      return `<li><span class="grow"><b>${esc(t)}</b>${cur.verif && v ? (juste ? ' ✅' : ' 🔄') : ''}</span>
        <select data-change="jourSel" data-arg="${i}" style="max-width:150px" aria-label="Moment pour ${esc(t)}"><option value="">—</option>${CRENEAUX.map(([k, l]) => `<option value="${k}" ${v === k ? 'selected' : ''}>${l}</option>`).join('')}</select></li>`;
    });
    return `${entete('journee', '🗓️ Planifier une journée', 'Place chaque activité au bon moment de la journée.')}
      <div class="card sable"><b>${j.titre}</b><ul>${j.regles.map((r) => `<li>${C.acc(r)}</li>`).join('')}</ul></div>
      <ul class="liste card" style="margin-top:10px">${lignes.join('')}</ul>
      <button class="btn primaire plein" style="margin-top:10px" data-act="jourVerif">Vérifier</button>
      ${cur.verif && ok === j.taches.length ? fin('journee', true, 'Journée bien organisée ! Repérer les horaires fixes d\'abord, puis placer le reste : c\'est la méthode des pros.') : cur.verif ? `<p class="bulle">${ok}/${j.taches.length} bien placées. Astuce : place d'abord ce qui a une heure fixe.</p>` : ''}`;
  }
  C.onInput('jourSel', (el) => { cur.rep[+el.dataset.arg] = el.value; cur.verif = false; });
  C.act('jourVerif', () => { cur.verif = true; C.rerender(); });

  /* ---------- QCM générique (consignes, émotions, social, stage, consignes pro) ---------- */
  const QCM = {
    consignes: { titre: '🧩 Consignes à décoder', intro: 'Qu\'est-ce que la consigne demande vraiment ?', items: [
      { q: '« Relève deux adjectifs qui décrivent le personnage. »', c: ['Inventer deux adjectifs', 'Recopier deux adjectifs du texte', 'Expliquer le personnage'], b: 1, e: '« Relever » = recopier exactement depuis le texte.' },
      { q: '« Justifie ta réponse. »', c: ['Écrire la réponse plus proprement', 'Donner la preuve (car…, parce que…)', 'Recommencer l\'exercice'], b: 1, e: 'Justifier = prouver, avec une règle, un calcul ou un passage du texte.' },
      { q: '« Calcule le prix total, puis arrondis à l\'euro près. »', c: ['Faire un calcul', 'Faire deux choses : calculer, puis arrondir', 'Arrondir chaque prix'], b: 1, e: 'Deux mots-actions = deux étapes. Le « puis » donne l\'ordre.' },
      { q: '« Compare les deux documents. »', c: ['Dire ce qui est pareil et différent', 'Résumer le premier document', 'Choisir le meilleur'], b: 0, e: 'Comparer = points communs ET différences.' },
      { q: '« Sans calculatrice, donne un ordre de grandeur du résultat. »', c: ['Le résultat exact', 'Une valeur approximative', 'Le résultat avec la calculatrice'], b: 1, e: 'Ordre de grandeur = environ combien. Et la consigne interdit la calculatrice.' },
      { q: '« Souligne le sujet et entoure le verbe. »', c: ['Souligner les deux', 'Deux gestes différents pour deux mots', 'Entourer les deux'], b: 1, e: 'Chaque mot-action a son geste : souligner ≠ entourer.' },
      { q: '« Décris l\'image en trois phrases. »', c: ['Donner mon avis sur l\'image', 'Dire ce que je vois, en 3 phrases', 'Écrire un paragraphe long'], b: 1, e: 'Décrire = dire ce qu\'on voit, sans avis. Et le nombre est imposé : 3.' },
    ] },
    emotions: { titre: '🎭 Détective des émotions', intro: 'Ce que pourrait ressentir la personne. Plusieurs réponses peuvent être justes !', multi: true, items: [
      { q: 'Inès a révisé toute la semaine et elle a eu 8/20.', c: ['Déçue', 'Découragée', 'Joyeuse', 'En colère contre elle-même'], b: [0, 1, 3], e: 'Plusieurs émotions peuvent exister en même temps. Aucune n\'est « fausse ».' },
      { q: 'Le prof annonce un contrôle surprise.', c: ['Stress', 'Surprise', 'Soulagement', 'Inquiétude'], b: [0, 1, 3], e: 'Selon les personnes, la même situation déclenche des émotions différentes.' },
      { q: 'Sami est invité à un anniversaire mais ne connaît presque personne.', c: ['Content', 'Intimidé', 'Curieux', 'Furieux'], b: [0, 1, 2], e: 'On peut être content ET intimidé à la fois.' },
      { q: 'Quelqu\'un se moque de toi devant la classe.', c: ['Honte', 'Colère', 'Tristesse', 'Fierté'], b: [0, 1, 2], e: 'Ces émotions sont normales. Ce qui compte : ce que tu fais ensuite, et à qui tu en parles.' },
      { q: 'Tu réussis enfin un exercice qui te bloquait depuis longtemps.', c: ['Fierté', 'Soulagement', 'Joie', 'Peur'], b: [0, 1, 2], e: 'Prends le temps de ressentir ça : ça nourrit la confiance.' },
    ] },
    social: { titre: '💬 Situations à choix', intro: 'Choisis la réponse qui te semble la plus aidante. Il n\'y a pas de piège : on regarde les effets.', items: [
      { q: 'Tu n\'as pas compris la consigne et le prof est occupé.', c: ['Je ne fais rien', 'J\'attends qu\'il soit libre et je lève la main', 'Je copie sur mon voisin'], b: 1, e: 'Lever la main au bon moment, c\'est demander de l\'aide de façon efficace.' },
      { q: 'Une amie te demande de l\'aide alors que tu es épuisé{e|}.', c: ['Je dis oui même si je n\'en peux plus', '« Là je suis à plat, on peut voir ça demain ? »', 'Je l\'ignore'], b: 1, e: 'Poser une limite gentiment, c\'est prendre soin de toi ET de la relation.' },
      { q: 'En stage, on te demande une chose que tu ne sais pas faire.', c: ['Je fais semblant de savoir', '« Pouvez-vous me montrer une fois ? »', 'Je m\'en vais'], b: 1, e: 'Demander à voir faire, c\'est professionnel. Personne ne sait tout le premier jour.' },
      { q: 'Quelqu\'un te coupe la parole en groupe.', c: ['Je crie plus fort', '« Je n\'avais pas fini, je peux terminer ? »', 'Je boude jusqu\'à la fin'], b: 1, e: 'Une phrase calme et claire est souvent mieux entendue.' },
      { q: 'Un client est mécontent parce qu\'il attend.', c: ['« C\'est pas ma faute »', '« Je comprends, je m\'occupe de vous dans un instant »', 'Je fais comme si je n\'avais pas entendu'], b: 1, e: 'Reconnaître ce que vit l\'autre fait souvent baisser la tension.' },
    ] },
    stage: { titre: '💼 Ma journée de stage', intro: 'Que faire dans ces situations de stage ?', items: [
      { q: 'La veille du stage, qu\'est-ce qui est le plus utile ?', c: ['Regarder le trajet et l\'heure d\'arrivée', 'Rien, on verra demain', 'Me coucher très tard'], b: 0, e: 'Prévoir le trajet avec de la marge évite le stress du matin.' },
      { q: 'Tu vas être en retard de 10 minutes.', c: ['Je préviens mon tuteur avant l\'heure', 'Je n\'y vais pas', 'Je ne dis rien'], b: 0, e: 'Prévenir avant, c\'est ce qu\'on attend d\'un professionnel.' },
      { q: 'Ton tuteur te donne trois consignes d\'un coup.', c: ['J\'essaie de tout retenir', 'Je les note dans mon carnet', 'Je fais seulement la première'], b: 1, e: 'Noter, c\'est libérer ta mémoire de travail. Tu peux aussi reformuler pour vérifier.' },
      { q: 'Tu as fini ta tâche.', c: ['J\'attends sans rien dire', 'Je demande « Qu\'est-ce que je peux faire maintenant ? »', 'Je sors mon téléphone'], b: 1, e: 'Proposer son aide montre ta motivation.' },
    ] },
    consignepro: { titre: '📋 Consignes professionnelles', intro: 'Au travail, qu\'est-ce qu\'on te demande ?', items: [
      { q: '« Fais le facing du rayon. »', c: ['Nettoyer le rayon', 'Avancer les produits au bord du rayon, étiquettes face au client', 'Vider le rayon'], b: 1, e: 'Le facing : les produits bien alignés, face visible. Si un mot est inconnu, on demande !' },
      { q: '« Range par date, les plus courtes devant. »', c: ['Les produits qui périment bientôt devant', 'Les plus grands devant', 'Au hasard'], b: 0, e: 'C\'est pour vendre d\'abord ce qui périme en premier.' },
      { q: '« Encaisse le client et propose-lui la carte fidélité. »', c: ['Une seule action', 'Deux actions : encaisser ET proposer la carte', 'Seulement la carte'], b: 1, e: 'Deux verbes = deux actions.' },
      { q: '« Signale-moi toute rupture de stock. »', c: ['Prévenir quand un produit manque', 'Casser un produit', 'Compter tout le stock'], b: 0, e: 'Rupture de stock = il n\'y a plus le produit en rayon ou en réserve.' },
    ] },
  };
  function qcm(id) {
    const d = QCM[id];
    if (!cur.items) Object.assign(cur, { items: C.shuffle(d.items).slice(0, Math.min(d.items.length, 3 + g(id).niveau)), i: 0, bons: 0, rep: null, sel: [] });
    if (cur.i >= cur.items.length) return entete(id, d.titre) + fin(id, cur.bons >= Math.ceil(cur.items.length * 0.6), `${cur.bons}/${cur.items.length}. ${d.multi ? 'Reconnaître plusieurs émotions, c\'est une vraie compétence.' : 'Tu as décodé des situations réelles : ça se transfère partout.'}`);
    const it = cur.items[cur.i], bonnes = [].concat(it.b);
    return `${entete(id, d.titre, d.intro)}
      ${ui.steps(cur.i + 1, cur.items.length)}<div class="card bleu"><h2>${C.acc(esc(it.q))}</h2></div>
      <div style="margin-top:10px">${it.c.map((c, k) => {
        let style = '';
        if (cur.rep) style = bonnes.includes(k) ? 'background:var(--sauge-clair);border-color:var(--sauge)' : cur.sel.includes(k) ? 'background:var(--alerte-clair)' : '';
        return `<button class="choice" data-act="qcmRep" data-arg="${k}" aria-pressed="${cur.sel.includes(k)}" style="${style}" ${cur.rep ? 'disabled' : ''}>${C.acc(esc(c))}</button>`;
      }).join('')}</div>
      ${d.multi && !cur.rep ? '<button class="btn primaire plein" style="margin-top:10px" data-act="qcmValider">Valider</button>' : ''}
      ${cur.rep ? `<div class="bulle">${cur.rep === 'ok' ? '✅ ' : '🔄 '}${C.acc(esc(it.e))}</div><button class="btn primaire plein" data-act="qcmSuiv">Suivant →</button>` : ''}`;
  }
  function qcmCorriger() {
    const it = cur.items[cur.i], bonnes = [].concat(it.b);
    const ok = QCM[cur.id].multi ? cur.sel.length && cur.sel.every((k) => bonnes.includes(k)) : bonnes.includes(cur.sel[0]);
    cur.rep = ok ? 'ok' : 'non'; if (ok) cur.bons++;
  }
  C.act('qcmRep', (el, k) => {
    k = +k;
    if (QCM[cur.id].multi) { cur.sel = cur.sel.includes(k) ? cur.sel.filter((x) => x !== k) : cur.sel.concat(k); el.setAttribute('aria-pressed', cur.sel.includes(k)); return; }
    cur.sel = [k]; qcmCorriger(); C.rerender();
  });
  C.act('qcmValider', () => { if (!cur.sel.length) { C.toast('Choisis au moins une réponse'); return; } qcmCorriger(); C.rerender(); });
  C.act('qcmSuiv', () => { cur.i++; cur.rep = null; cur.sel = []; C.rerender(); });

  /* ---------- Réponse numérique avec indices progressifs ---------- */
  function numerique(id, titre, consigne, enonce, rep, indices, unite) {
    const fini = cur.trouve;
    return `${entete(id, titre, consigne)}
      <div class="card sable"><div class="ticket">${enonce}</div></div>
      <div class="card"><label class="lbl" for="num">Ta réponse ${unite ? '(' + unite + ')' : ''}</label>
      <div class="row"><input id="num" type="text" inputmode="decimal" style="flex:1;min-width:0" ${fini ? 'disabled' : ''} placeholder="Ex. : 2,40"><button class="btn primaire" data-act="numOk" ${fini ? 'disabled' : ''}>Vérifier</button></div>
      <div id="num-ind">${(cur.indicesVus || []).map((t, i) => `<div class="bulle"><b>Indice ${i + 1}</b> · ${t}</div>`).join('')}</div>
      ${!fini && (cur.indicesVus || []).length < indices.length ? '<button class="btn discret" data-act="numIndice">💡 Un indice</button>' : ''}
      <p>${cur.msg || ''}</p></div>
      ${fini ? fin(id, !(cur.indicesVus || []).length, (cur.indicesVus || []).length ? 'Trouvé avec ' + cur.indicesVus.length + ' indice(s). Les indices, c\'est fait pour ça !' : 'Trouvé tout{e|} seul{e|} !') : ''}`;
  }
  C.act('numIndice', () => { const l = cur.indices; cur.indicesVus = (cur.indicesVus || []).concat(l[(cur.indicesVus || []).length]); C.rerender(); });
  C.act('numOk', () => {
    const v = parseFloat(String(C.$('#num').value).replace(',', '.').replace(/[^\d.-]/g, ''));
    if (isNaN(v)) { C.toast('Écris un nombre'); return; }
    if (Math.abs(v - cur.rep) < 0.005) { cur.trouve = true; cur.msg = '✅ Exact : ' + String(cur.rep).replace('.', ',') + (cur.unite ? ' ' + cur.unite : ''); }
    else { cur.essais = (cur.essais || 0) + 1; cur.msg = '🔄 Pas encore. Vérifie ton calcul, ou prends un indice. (Pas de chrono, prends ton temps.)'; }
    C.rerender();
  });

  /* ---------- 6. Prix et promotions ---------- */
  function prix() {
    const n = g('prix').niveau;
    if (!cur.enonce) {
      const typ = C.pick(n <= 2 ? ['remise', 'total'] : ['remise', 'total', 'lot', 'unitaire']);
      let e, r, ind;
      if (typ === 'remise') {
        const p = n <= 2 ? C.rand(2, 10) * 10 : C.rand(15, 89) + (n >= 4 ? 0.5 : 0), t = C.pick(n <= 2 ? [10, 50] : [10, 20, 25, 30]);
        r = Math.round(p * (100 - t)) / 100;
        e = `👟 Baskets : ${String(p).replace('.', ',')} €\n🏷️ PROMO : -${t} %\n\nCombien vas-tu payer ?`;
        ind = [`${t} % de réduction, c'est enlever ${t} € pour 100 €.`, `Calcule d'abord la réduction : ${String(p).replace('.', ',')} × ${t} ÷ 100.`, 'Puis enlève la réduction du prix de départ.'];
      } else if (typ === 'total') {
        const items = C.shuffle([['Cahier', 2.5], ['Stylo', 1.2], ['Classeur', 4], ['Gomme', 0.8], ['Règle', 1.5], ['Surligneur', 1.9]]).slice(0, 2 + Math.min(n, 3));
        r = Math.round(items.reduce((s, x) => s + x[1], 0) * 100) / 100;
        e = items.map((x) => `${x[0].padEnd(12, '.')} ${x[1].toFixed(2).replace('.', ',')} €`).join('\n') + '\n\nCombien ça fait au total ?';
        ind = ['Additionne les euros d\'un côté, les centimes de l\'autre.', '100 centimes = 1 euro.'];
      } else if (typ === 'lot') {
        const p = C.pick([1.5, 2, 2.4, 3]);
        r = Math.round(p * 2 * 100) / 100;
        e = `🧃 Jus de fruits : ${p.toFixed(2).replace('.', ',')} € l'unité\n🏷️ « 2 achetés, le 3e offert »\n\nTu prends 3 jus. Combien tu paies ?`;
        ind = ['Le 3e est offert : tu ne paies que 2 jus.', `2 × ${p.toFixed(2).replace('.', ',')} €`];
      } else {
        const qte = C.pick([250, 500]), p = C.pick([2, 3, 1.5]);
        r = Math.round((p * 1000) / qte * 100) / 100;
        e = `🧀 Un paquet de ${qte} g coûte ${p.toFixed(2).replace('.', ',')} €.\n\nCombien coûte 1 kg (1 000 g) ?`;
        ind = [`Combien de paquets de ${qte} g faut-il pour faire 1 000 g ?`, `${1000 / qte} paquets × ${p.toFixed(2).replace('.', ',')} €`];
      }
      Object.assign(cur, { enonce: e, rep: r, indices: ind, unite: '€' });
    }
    return numerique('prix', '🏷️ Prix et promotions', 'Calcule tranquillement. Tu peux utiliser une feuille ou la calculatrice.', esc(cur.enonce), cur.rep, cur.indices, '€');
  }

  /* ---------- Vraie vie : boulangerie (payer) & caisse (rendre) ---------- */
  const PIECES = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000];
  const PRODUITS = [['Baguette', 110], ['Croissant', 120], ['Pain au chocolat', 135], ['Éclair', 280], ['Tartelette', 320], ['Pain complet', 230], ['Chouquettes (×10)', 250], ['Sandwich', 450]];
  function libPiece(c) { return c >= 500 ? (c / 100) + ' €' : c >= 100 ? (c / 100) + ' €' : c + ' c'; }
  function panier(n) {
    const nb = Math.min(1 + n, 4), l = C.shuffle(PRODUITS).slice(0, nb).map(([p, c]) => [p, c, C.rand(1, n >= 3 ? 3 : 1)]);
    return { l, total: l.reduce((s, x) => s + x[1] * x[2], 0) };
  }
  function boulangerie() {
    const n = g('boulangerie').niveau;
    if (!cur.pan) Object.assign(cur, { pan: panier(n), donne: [] });
    const donne = cur.donne.reduce((s, x) => s + x, 0), t = cur.pan.total;
    return `${entete('boulangerie', '🥖 Payer à la boulangerie', 'Donne la somme EXACTE en touchant les pièces et les billets.')}
      <div class="card sable"><div class="ticket">${cur.pan.l.map(([p, c, q]) => `${q} × ${p} … ${C.euros(c * q)}`).join('\n')}\n──────────\nTOTAL : ${C.euros(t)}</div></div>
      <div class="card"><p>J'ai donné : <b>${C.euros(donne)}</b> ${cur.donne.length ? '<button class="btn discret" data-act="coinUndo">↩︎ Reprendre la dernière</button>' : ''}</p>
      <div class="coins">${PIECES.filter((p) => p <= 2000).map((p) => `<button class="${p >= 500 ? 'billet' : ''}" data-act="coin" data-arg="${p}">${libPiece(p)}</button>`).join('')}</div></div>
      ${donne === t ? fin('boulangerie', true, 'Compte exact ! Tu peux payer sans stress.') : donne > t ? `<p class="bulle">C'est un peu trop (${C.euros(donne - t)} de plus). Reprends une pièce : ici on cherche la somme exacte.</p>` : ''}`;
  }
  C.act('coin', (el, p) => { cur.donne.push(+p); C.rerender(); });
  C.act('coinUndo', () => { cur.donne.pop(); C.rerender(); });
  function caisse() {
    const n = g('caisse').niveau;
    if (!cur.pan) {
      const pan = panier(n), billet = [500, 1000, 2000].find((b) => b > pan.total) || 5000;
      Object.assign(cur, { pan, recu: billet, rendu: [] });
    }
    const aRendre = cur.recu - cur.pan.total, rendu = cur.rendu.reduce((s, x) => s + x, 0);
    return `${entete('caisse', '🧾 Je tiens la caisse', 'Tu es en caisse ! Rends la monnaie au client, pièce par pièce. Astuce des commerçants : on compte en partant du prix jusqu\'à la somme reçue.')}
      <div class="card sable"><div class="ticket">TOTAL : ${C.euros(cur.pan.total)}\nLe client donne : ${C.euros(cur.recu)}</div></div>
      <div class="card"><p>Je rends : <b>${C.euros(rendu)}</b> ${cur.rendu.length ? '<button class="btn discret" data-act="rendUndo">↩︎</button>' : ''}</p>
      <div class="coins">${PIECES.filter((p) => p < 2000).map((p) => `<button class="${p >= 500 ? 'billet' : ''}" data-act="rend" data-arg="${p}">${libPiece(p)}</button>`).join('')}</div>
      ${!cur.aide ? '<button class="btn discret" data-act="caisseAide">💡 Comment compter ?</button>' : `<div class="bulle small">Pars de ${C.euros(cur.pan.total)} et ajoute des pièces jusqu'à arriver à un compte rond, puis jusqu'à ${C.euros(cur.recu)}.</div>`}</div>
      ${rendu === aRendre ? fin('caisse', !cur.aide, `Monnaie exacte : ${C.euros(aRendre)}. Le client repart content !`) : rendu > aRendre ? '<p class="bulle">Oups, tu rends trop. Reprends une pièce.</p>' : ''}`;
  }
  C.act('rend', (el, p) => { cur.rendu.push(+p); C.rerender(); });
  C.act('rendUndo', () => { cur.rendu.pop(); C.rerender(); });
  C.act('caisseAide', () => { cur.aide = true; C.rerender(); });

  /* ---------- Comparer des prix ---------- */
  function comparer() {
    if (!cur.a) {
      const base = C.pick([['Céréales', 'g'], ['Jus d\'orange', 'cL'], ['Pâtes', 'g'], ['Lessive', 'lavages']]);
      const q1 = C.pick([250, 500]), q2 = q1 * 2, p1 = C.pick([1.2, 1.5, 2, 2.4]), p2 = Math.round(p1 * 2 * C.pick([0.8, 0.9, 1.1, 1.2]) * 100) / 100;
      Object.assign(cur, { a: { n: base[0] + ' petit format', q: q1, p: p1 }, b: { n: base[0] + ' grand format', q: q2, p: p2 }, u: base[1], rep: null });
    }
    const pu = (x) => x.p / x.q, meilleur = pu(cur.a) < pu(cur.b) ? 'a' : 'b';
    const carte = (k) => { const x = cur[k]; return `<button class="choice" data-act="cmpRep" data-arg="${k}" ${cur.rep ? 'disabled' : ''} style="${cur.rep && meilleur === k ? 'background:var(--sauge-clair);border-color:var(--sauge)' : ''}"><span class="ico">🛒</span><span><b>${esc(x.n)}</b><br>${x.q} ${cur.u} · <b>${x.p.toFixed(2).replace('.', ',')} €</b></span></button>`; };
    return `${entete('comparer', '⚖️ Comparer des prix', 'Lequel est le plus avantageux ? Pense au prix pour la même quantité.')}
      ${carte('a')}${carte('b')}
      ${cur.rep ? `<div class="bulle">Le grand format contient 2 fois plus. Pour comparer : petit format × 2 = ${(cur.a.p * 2).toFixed(2).replace('.', ',')} € contre ${cur.b.p.toFixed(2).replace('.', ',')} €.<br>${meilleur === 'b' ? 'Le grand format est plus avantageux.' : 'Ici, le petit format est plus avantageux ! Le grand n\'est pas toujours moins cher.'}</div>${fin('comparer', cur.rep === meilleur, cur.rep === meilleur ? 'Bien vu, tu as le réflexe du prix au kilo !' : 'Pas cette fois. Le piège classique : croire que le grand format est toujours moins cher.')}` : ''}`;
  }
  C.act('cmpRep', (el, k) => { cur.rep = k; C.rerender(); });

  /* ---------- Lire un horaire ---------- */
  function horaire() {
    if (!cur.t) {
      const depart = C.pick([[7, 5], [7, 12], [7, 20]]), freq = C.pick([10, 15, 12]), trajet = C.pick([14, 18, 22]), marche = C.pick([5, 8]);
      const bus = []; let m = depart[0] * 60 + depart[1];
      for (let i = 0; i < 6; i++) { bus.push(m); m += freq; }
      const arrivee = C.pick([8 * 60, 8 * 60 + 30]);
      const ok = bus.filter((b) => b + trajet + marche <= arrivee);
      cur.t = { bus, trajet, marche, arrivee, rep: ok.length ? ok[ok.length - 1] : bus[0] };
    }
    const t = cur.t, h = (m) => Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0');
    return `${entete('horaire', '🚌 Lire un horaire', 'Quel est le DERNIER bus que tu peux prendre pour arriver à l\'heure ?')}
      <div class="card sable"><p><b>Ligne 4 · Arrêt « Mairie »</b></p><div class="ticket">Départs : ${t.bus.map(h).join(' · ')}</div>
      <ul><li>Le trajet en bus dure <b>${t.trajet} min</b>.</li><li>Puis <b>${t.marche} min</b> à pied jusqu'au collège.</li><li>Tu dois arriver à <b>${h(t.arrivee)}</b>.</li></ul></div>
      <div class="grid two" style="margin-top:10px">${t.bus.map((b) => `<button class="btn" data-act="horRep" data-arg="${b}" ${cur.rep != null ? 'disabled' : ''} style="${cur.rep != null && b === t.rep ? 'background:var(--sauge-clair)' : ''}">${h(b)}</button>`).join('')}</div>
      ${cur.rep != null ? `<div class="bulle">Bus de ${h(t.rep)} + ${t.trajet} min + ${t.marche} min = arrivée à ${h(t.rep + t.trajet + t.marche)}. ${t.rep + t.trajet + t.marche === t.arrivee ? 'Pile à l\'heure… prendre le bus d\'avant donne de la marge !' : ''}</div>${fin('horaire', cur.rep === t.rep, cur.rep === t.rep ? 'Parfait, tu sais lire un horaire !' : 'Pas tout à fait. Astuce : pars de l\'heure d\'arrivée et remonte le temps.')}` : ''}`;
  }
  C.act('horRep', (el, b) => { cur.rep = +b; C.rerender(); });

  /* ---------- Préparer un trajet (remettre dans l'ordre) ---------- */
  const TRAJETS = [['Regarder l\'adresse du lieu', 'Chercher l\'itinéraire (appli ou plan)', 'Noter l\'heure de départ avec de la marge', 'Vérifier mon titre de transport', 'Partir', 'Prévenir si j\'ai un imprévu']];
  function trajet() {
    if (!cur.ordre) Object.assign(cur, { bon: TRAJETS[0], ordre: C.shuffle(TRAJETS[0].map((_, i) => i)), verif: false });
    const okTout = cur.ordre.every((v, i) => v === i);
    return `${entete('trajet', '🗺️ Préparer un trajet', 'Remets les étapes dans l\'ordre avec les flèches.')}
      <ul class="liste card">${cur.ordre.map((v, i) => `<li><span class="badge">${i + 1}</span><span class="grow">${esc(cur.bon[v])}${cur.verif ? (v === i ? ' ✅' : '') : ''}</span>
        <button class="btn discret" data-act="trMove" data-arg="${i}|-1" ${i === 0 ? 'disabled' : ''} aria-label="Monter">⬆️</button><button class="btn discret" data-act="trMove" data-arg="${i}|1" ${i === cur.ordre.length - 1 ? 'disabled' : ''} aria-label="Descendre">⬇️</button></li>`).join('')}</ul>
      <button class="btn primaire plein" style="margin-top:10px" data-act="trVerif">Vérifier</button>
      ${cur.verif ? (okTout ? fin('trajet', true, 'Trajet bien préparé ! Ces étapes marchent aussi pour un stage ou un rendez-vous.') : '<p class="bulle">Les étapes ✅ sont à leur place. Continue pour les autres.</p>') : ''}`;
  }
  C.act('trMove', (el, a) => { const [i, d] = a.split('|').map(Number), o = cur.ordre; [o[i], o[i + d]] = [o[i + d], o[i]]; cur.verif = false; C.rerender(); });
  C.act('trVerif', () => { cur.verif = true; C.rerender(); });

  /* ---------- Organiser mon cartable ---------- */
  const MATIERES = { 'Maths': ['Cahier de maths', 'Calculatrice', 'Règle et équerre'], 'Français': ['Cahier de français', 'Livre de lecture'], 'Anglais': ['Cahier d\'anglais'], 'EPS': ['Tenue de sport', 'Baskets'], 'Histoire-géo': ['Cahier d\'histoire-géo'], 'Arts plastiques': ['Pochette de dessin', 'Crayons de couleur'], 'Sciences': ['Cahier de sciences'] };
  function cartable() {
    if (!cur.edt) {
      const edt = C.shuffle(Object.keys(MATIERES)).slice(0, 4);
      const besoin = new Set(['Trousse', 'Carnet de liaison'].concat(...edt.map((m) => MATIERES[m])));
      const pieges = C.shuffle(Object.keys(MATIERES).filter((m) => !edt.includes(m)).flatMap((m) => MATIERES[m])).slice(0, 4);
      Object.assign(cur, { edt, besoin: [...besoin], objets: C.shuffle([...besoin].concat(pieges, ['Console de jeux'])), sel: [], verif: false });
    }
    const ok = cur.besoin.every((b) => cur.sel.includes(b)) && cur.sel.every((s) => cur.besoin.includes(s));
    return `${entete('cartable', '🎒 Organiser mon cartable', 'Regarde l\'emploi du temps de demain, puis choisis ce qu\'il faut mettre dans le sac.')}
      <div class="card sable"><b>📅 Demain :</b> ${cur.edt.join(' · ')}</div>
      <div class="chips" style="margin-top:10px">${cur.objets.map((o) => {
        const s = cur.sel.includes(o); let st = '';
        if (cur.verif) st = cur.besoin.includes(o) ? (s ? 'background:var(--sauge-clair)' : 'outline:2px dashed var(--accent)') : s ? 'background:var(--alerte-clair)' : '';
        return `<button class="chip" data-act="cartSel" data-arg="${esc(o)}" aria-pressed="${s}" style="${st}">${esc(o)}</button>`;
      }).join('')}</div>
      <button class="btn primaire plein" style="margin-top:12px" data-act="cartVerif">Vérifier mon sac</button>
      ${cur.verif ? (ok ? fin('cartable', true, 'Sac parfait ! Ta routine « cartable » peut t\'aider chaque soir.') : '<p class="bulle">En pointillés : ce qui manque. En rose : ce qui n\'est pas utile demain.</p>') : ''}`;
  }
  C.act('cartSel', (el, o) => { cur.sel = cur.sel.includes(o) ? cur.sel.filter((x) => x !== o) : cur.sel.concat(o); cur.verif = false; C.rerender(); });
  C.act('cartVerif', () => { cur.verif = true; C.rerender(); });

  /* ---------- Quiz de mes cartes ---------- */
  function quiz() {
    const cartes = C.state.cartes.filter((c) => c.type !== 'transfert' && !c.archive);
    if (cartes.length < 3) return `${entete('quiz', '❓ Quiz de mes cartes')}${ui.vide('Il faut au moins 3 cartes mémoire pour créer un quiz. Crée-les dans Mon prof autrement (étape 8) ou dans le labo mémoire.')}<a class="btn" href="#/memoire/cartes" style="margin-top:10px">Créer des cartes</a>`;
    if (!cur.items) {
      const items = C.shuffle(cartes).slice(0, Math.min(cartes.length, 4 + g('quiz').niveau)).map((c) => {
        const faux = C.shuffle(cartes.filter((x) => x.id !== c.id && x.verso !== c.verso)).slice(0, 2).map((x) => x.verso);
        const choix = C.shuffle([c.verso].concat(faux));
        return { q: c.recto, c: choix, b: choix.indexOf(c.verso), e: 'Réponse : ' + c.verso };
      });
      QCM.quiz = { titre: '❓ Quiz de mes cartes', intro: 'Questions tirées de tes propres cartes.', items };
      Object.assign(cur, { items, i: 0, bons: 0, rep: null, sel: [] });
    }
    return qcm('quiz');
  }
})();
