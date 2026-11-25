/* Coachy 2.0 — Je m'organise (fonctions exécutives).
   Reprend le cœur de Coachy V1 : batterie → check de préparation → mission →
   round (minuteur facultatif) → checkpoint → suite. Ajoute : boutons
   contextuels, découpage, parking à pensées, routines, planning, relecture.
   Aucun classement, aucune pénalité. */
(function () {
  'use strict';
  const D = C.data, ui = C.ui, esc = C.esc;

  /* ======================= INTERVENTIONS CONTEXTUELLES ======================= */
  C.act('contexte', (el, id) => {
    const c = D.contexte[id];
    const fatigue = C.faibleEnergie() && id !== 'pause' ? '<div class="bulle sobre small">🌙 Ta batterie est basse aujourd\'hui. Tu as aussi le droit de t\'arrêter là.</div>' : '';
    const rappel = (id === 'bloque' || id === 'monte' || id === 'commencer') && C.rappelModeEmploi ? C.rappelModeEmploi() : '';
    C.dialog(c.ico + ' ' + c.titre, `<div class="bulle">${c.intro}</div>${fatigue}${rappel}
      ${c.options.map((o, i) => `<button class="choice" data-act="contexteOpt" data-arg="${id}|${i}"><b>${esc(o.label)}</b></button>`).join('')}`);
    C.state.compteurs['ctx_' + id] = (C.state.compteurs['ctx_' + id] || 0) + 1; C.save();
    if (C.state.roundEnCours) { C.state.roundEnCours.aides = (C.state.roundEnCours.aides || 0) + 1; C.save(); }
  });
  const LIB_ACTION = { decodeur: '🧩 Décoder la consigne', decouper: '✂️ Découper ma tâche', parking: '💭 Vider ma tête', pause: '☕ Faire une pause', pause5: '⏱️ Lancer la pause de 5 min', round5: '▶️ Lancer 5 minutes', respiration: '🫧 Respirer', ancrage: '🖐️ 5-4-3-2-1', prof: '📘 Mon prof autrement', stop: '🏁 Clôturer ma journée' };
  C.act('contexteOpt', (el, arg) => {
    const [id, i] = arg.split('|'), o = D.contexte[id].options[+i];
    let bouton = '';
    if (o.action) {
      const lib = LIB_ACTION[o.action] || (o.action.startsWith('parcours:') ? '🌿 Ouvrir le parcours' : '→ J\'y vais');
      bouton = `<button class="btn primaire plein" data-act="lancer" data-arg="${o.action}">${lib}</button>`;
    }
    C.dialog(D.contexte[id].ico + ' ' + D.contexte[id].titre, `<div class="bulle">${esc(o.conseil)}</div>${bouton}
      <p style="margin-top:14px"><b>Et toi, qu'est-ce qui t'aiderait ?</b> <span class="muted small">(facultatif)</span></p>
      <textarea id="ctx-note" rows="2" placeholder="Ce que je remarque…"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn" data-act="ctxGarder">💡 Garder comme découverte</button><button class="btn" data-act="fermer">▶️ Je teste</button></div>`);
  });
  C.act('ctxGarder', () => { const t = C.$('#ctx-note').value.trim(); if (!t) { C.toast('Écris d\'abord ce que tu remarques'); return; } C.proposer(t, 'Bouton d\'aide', 'action'); C.toast('💡 Proposé à ton mode d\'emploi (à valider)'); C.close(); });
  C.act('lancer', (el, a) => {
    C.close();
    if (a === 'decodeur') return C.ouvrirDecodeur();
    if (a === 'decouper') return C.go('organise/decouper');
    if (a === 'parking') return ouvrirVidage();
    if (a === 'pause' || a === 'pause5') return ouvrirPause(5);
    if (a === 'round5') { preparerRound({ duree: 5 }); return C.go('organise/round'); }
    if (a === 'respiration') return C.outils.respiration();
    if (a === 'ancrage') return C.outils.ancrage();
    if (a === 'prof') return C.go('apprendre');
    if (a === 'stop') return clore();
    if (a.startsWith('parcours:')) return C.go('soin/parcours/' + a.split(':')[1]);
    if (a.startsWith('go:')) return C.go(a.slice(3));
  });
  function boutonsContexte() {
    return `<div class="chips">${Object.entries(D.contexte).map(([id, c]) => `<button class="chip" data-act="contexte" data-arg="${id}">${c.ico} ${c.titre}</button>`).join('')}</div>`;
  }
  C.boutonsContexte = boutonsContexte;

  /* ======================= HUB ======================= */
  C.screen('organise', function (args) {
    const sub = args[0];
    if (sub === 'round') return ecranRound();
    if (sub === 'decouper') return ecranDecouper();
    if (sub === 'parking') return ecranParking();
    if (sub === 'routines') return ecranRoutines(args[1]);
    if (sub === 'planning') return ecranPlanning();
    if (sub === 'relecture') return ecranRelecture();
    const j = C.jour(), r = C.state.roundEnCours;
    return `<h1>🧭 Je m'organise</h1>
      ${r ? `<a class="card bleu" style="display:block;text-decoration:none;color:inherit" href="#/organise/round">⏱️ <b>Round en cours :</b> ${esc(r.mission)} →</a>` : ''}
      <div class="card"><h2>Besoin d'un coup de main ?</h2>${boutonsContexte()}</div>
      <div class="grid two" style="margin-top:12px">
        ${ui.tile('organise/round', '▶️', 'Lancer un round', j.mission ? 'Mission : ' + j.mission : 'Travailler par petits blocs', 'bleu')}
        ${ui.tile('organise/decouper', '✂️', 'Découper une tâche', 'En petites marches', 'sauge')}
        ${ui.tile('organise/planning', '📅', 'Mon planning', 'Ma semaine, en douceur', 'sable')}
        ${ui.tile('organise/routines', '✅', 'Routines & checklists', 'Cartable, matin, soir…', 'sauge')}
        ${ui.tile('organise/parking', '💭', 'Parking à pensées', C.state.parking.filter((p) => !p.fait).length + ' pensée(s) garée(s)', 'lavande')}
        ${ui.tile('organise/relecture', '🔎', 'Relecture guidée', 'Avant de rendre un travail', 'bleu')}
      </div>`;
  });

  /* ======================= ROUND (héritage Coachy V1) ======================= */
  let rd = { etape: 1 };
  function preparerRound(o) { rd = Object.assign({ etape: 3, duree: null, presence: 'dispo', checks: [] }, o || {}); }
  const CHECKS = ['💧 Eau à portée', '🌬️ Air / pièce OK', '🪑 Bien installé{e|}', '📚 Matériel prêt', '📱 Téléphone éloigné ou en silence', '🎧 Bruit gérable'];
  const PRESENCES = [
    { id: 'lancer', ico: '🚀', t: 'Me lancer', s: 'Un petit coup d\'envoi.' },
    { id: 'cap', ico: '🎯', t: 'Garder le cap', s: 'Un rappel à mi-parcours.' },
    { id: 'dispo', ico: '🧩', t: 'Être là si je bloque', s: 'Tu bosses, j\'attends.' },
    { id: 'seul', ico: '😎', t: 'Je gère', s: 'Reste juste dans le coin.' },
  ];
  function dureeDefaut() {
    if (C.faibleEnergie()) return 5;
    return C.state.profil.besoins.includes('attention') || C.state.profil.besoins.includes('fatigue') ? 10 : 20;
  }

  function ecranRound() {
    const r = C.state.roundEnCours;
    if (r) return ecranRoundEnCours(r);
    if (rd.etape === 'check') return ecranCheckpoint();
    if (rd.etape === 'suite') return ecranSuite();
    const e = rd.etape || 1, j = C.jour();
    let h = `${ui.crumb('organise', 'Je m\'organise')}${ui.steps(e, 4)}`;
    if (e === 1) {
      const b = rd.batt != null ? rd.batt : j.batterie != null ? j.batterie : 50;
      h += `<div class="card"><h1>🔋 Ta batterie, elle en est où ?</h1><p class="muted">C'est toi qui te lis.</p>
        ${ui.batt(b)}<input id="rd-b" type="range" min="0" max="100" step="5" value="${b}" data-input="rdBatt" style="margin-top:8px">
        <p id="rd-bt" class="muted small">${D.batterieTexte(b)}</p></div>
        <button class="btn primaire plein" data-act="rdSuiv">Suivant →</button>`;
    } else if (e === 2) {
      h += `<div class="card"><h1>🚀 Avant de décoller</h1><p class="muted">Un check rapide. Coche ce qui est prêt — ce n'est pas un interrogatoire.</p>
        ${CHECKS.map((c, i) => `<label class="switch"><span>${c}</span><input type="checkbox" data-change="rdCheck" data-arg="${i}" ${rd.checks && rd.checks.includes(i) ? 'checked' : ''}></label>`).join('')}
        <button class="btn discret" data-act="lancer" data-arg="respiration">🌫️ Je suis dans le brouillard → petit reset</button></div>
        <div class="row" style="justify-content:space-between"><button class="btn" data-act="rdPrec">←</button><button class="btn primaire" data-act="rdSuiv">Suivant →</button></div>`;
    } else if (e === 3) {
      const d = rd.duree || dureeDefaut();
      h += `<div class="card"><h1>🎯 Ma mission pour ce round</h1>
        <p class="muted small">Astuce Coachy : une mission doit tenir dans un round. Sinon, <a href="#/organise/decouper">on la découpe</a>.</p>
        <input id="rd-m" type="text" value="${esc(rd.mission || j.mission || '')}" placeholder="Ex. : faire les exercices 1 et 2" maxlength="120">
        <div class="row" style="margin-top:8px">${ui.ecouter('rd-m')}</div>
        <h2 style="margin-top:14px">Tu veux quoi de moi ?</h2>
        <div>${PRESENCES.map((p) => `<button class="choice" data-act="rdPres" data-arg="${p.id}" aria-pressed="${(rd.presence || 'dispo') === p.id}"><span class="ico">${p.ico}</span><span><b>${p.t}</b><br><span class="muted small">${p.s}</span></span></button>`).join('')}</div>
        <h2 style="margin-top:14px">Combien de temps ?</h2>
        <div class="chips">${[5, 10, 20, 30].map((m) => `<button class="chip" data-act="rdDuree" data-arg="${m}" aria-pressed="${d === m}">${m} min</button>`).join('')}
        <button class="chip" data-act="rdDuree" data-arg="0" aria-pressed="${d === 0}">Sans minuteur</button></div>
        ${C.faibleEnergie() ? '<p class="small muted">🌙 Batterie basse : je te propose 5 minutes. Tu as le droit de t\'arrêter après.</p>' : ''}</div>
        <div class="row" style="justify-content:space-between"><button class="btn" data-act="rdPrec">←</button><button class="btn primaire" data-act="rdGo">▶️ GO</button></div>`;
    }
    return h;
  }
  C.onInput('rdBatt', (el) => { rd.batt = +el.value; C.$('#rd-bt').textContent = D.batterieTexte(+el.value); el.previousElementSibling.firstElementChild.style.width = el.value + '%'; });
  C.onInput('rdCheck', (el) => { rd.checks = rd.checks || []; const i = +el.dataset.arg; rd.checks = el.checked ? rd.checks.concat(i) : rd.checks.filter((x) => x !== i); });
  C.act('rdSuiv', () => {
    if (rd.etape === 1) { const j = C.jour(); if (rd.batt == null) rd.batt = j.batterie != null ? j.batterie : 50; if (j.batterie == null) { j.batterie = rd.batt; C.save(); } }
    rd.etape = (rd.etape || 1) + 1; C.render();
  });
  C.act('rdPrec', () => { if (rd.etape === 3) rd.mission = C.$('#rd-m').value; rd.etape = Math.max(1, (rd.etape || 1) - 1); C.render(); });
  C.act('rdPres', (el, p) => { rd.presence = p; rd.mission = C.$('#rd-m').value; C.$$('[data-act="rdPres"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.arg === p)); });
  C.act('rdDuree', (el, m) => { rd.duree = +m; C.$$('[data-act="rdDuree"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.arg === m)); });
  C.act('rdGo', () => {
    const mission = C.$('#rd-m').value.trim() || 'Ma mission';
    const duree = rd.duree == null ? dureeDefaut() : rd.duree;
    C.state.roundEnCours = { id: C.uid(), mission, duree, debut: Date.now(), fin: duree ? Date.now() + duree * 60e3 : null, presence: rd.presence || 'dispo', batt: rd.batt != null ? rd.batt : C.jour().batterie, aides: 0, parking: 0, pauses: 0, rappelFait: false };
    if (!C.jour().mission) { C.jour().mission = mission; }
    C.save(); C.render();
  });

  let tick = null;
  function ecranRoundEnCours(r) {
    const bulles = { lancer: '🚀 Première action : ouvre ton cahier ou ton fichier, et écris juste le titre. Go !', cap: '🎯 Je te ferai signe à mi-parcours.', dispo: '🧩 Je suis là si tu bloques. Utilise les boutons en dessous.', seul: '😎 Je reste dans le coin.' };
    return {
      html: `${ui.crumb('organise', 'Je m\'organise')}
      <div class="card bleu center"><p class="muted small">Mission</p><h1 style="margin:0">${esc(r.mission)}</h1>
      <div class="timer" id="rd-timer" aria-live="off">${r.fin ? '--:--' : '∞'}</div>
      ${r.fin ? '' : '<p class="muted small">Sans minuteur : arrête quand tu veux.</p>'}
      <div class="bulle" id="rd-bulle" style="text-align:left">${bulles[r.presence] || ''}</div></div>
      <div class="card"><h2>Si besoin</h2>${boutonsContexte()}</div>
      <div class="card"><h2>💭 Parking à pensées</h2><p class="muted small">Une pensée parasite ? Pose-la ici, tu n'as plus besoin de la retenir.</p>
        <div class="row"><input id="rd-park" type="text" placeholder="Ex. : penser à acheter du pain" style="flex:1;min-width:0"><button class="btn" data-act="rdPark">📥</button></div></div>
      <button class="btn sauge plein" style="margin-top:12px" data-act="rdFin">⏹️ Finir le round</button>`,
      mount: () => {
        clearInterval(tick);
        const maj = () => {
          const el = C.$('#rd-timer'); if (!el || !C.state.roundEnCours) { clearInterval(tick); return; }
          if (!r.fin) return;
          const rest = Math.max(0, Math.round((r.fin - Date.now()) / 1000));
          el.textContent = String(Math.floor(rest / 60)).padStart(2, '0') + ':' + String(rest % 60).padStart(2, '0');
          if (r.presence === 'cap' && !r.rappelFait && Date.now() > r.debut + (r.fin - r.debut) / 2) { r.rappelFait = true; C.save(); C.$('#rd-bulle').textContent = '🎯 Mi-parcours ! Tu es toujours sur ta mission ? Si oui, continue. Sinon, reviens-y doucement.'; }
          if (rest <= 0) { clearInterval(tick); if (navigator.vibrate) navigator.vibrate(200); terminerRound(); }
        };
        maj(); tick = setInterval(maj, 1000);
      },
    };
  }
  const stopAvant = C.stopTimers;
  C.stopTimers = function () { if (stopAvant) stopAvant(); clearInterval(tick); };
  C.act('rdPark', () => { const v = C.$('#rd-park').value.trim(); if (!v) return; C.state.parking.push({ id: C.uid(), text: v, at: Date.now(), fait: false }); C.state.roundEnCours.parking++; C.save(); C.$('#rd-park').value = ''; C.toast('💭 Garé. Tu le retrouveras dans le parking.'); });
  C.act('rdFin', () => terminerRound());
  function terminerRound() {
    const r = C.state.roundEnCours; if (!r) return;
    r.finReelle = Date.now(); rd = { etape: 'check', round: r };
    C.state.roundEnCours = null; C.save(); C.render();
  }

  function ecranCheckpoint() {
    const r = rd.round;
    let q = 'Qu\'est-ce qui t\'a aidé{e|} à avancer pendant ce round ?';
    if (!r.aides && !r.parking) q = 'Tu t\'es débrouillé{e|} sans m\'appeler. Qu\'est-ce qui t\'a aidé{e|} ?';
    else if (r.parking) q = 'Tu as garé des pensées. Est-ce que ça t\'a aidé{e|} à revenir à ta mission ?';
    else if (r.aides) q = 'Tu as demandé de l\'aide pendant le round. Qu\'est-ce qui a marché ?';
    return `${ui.crumb('organise', 'Je m\'organise')}
      <div class="card"><h1>🔔 Checkpoint</h1><p class="muted">Mission : <b>${esc(r.mission)}</b></p>
      <h2>La mission, elle en est où ?</h2>
      <div class="grid two" data-groupe="verdict">${[['fait', '✅ Accomplie'], ['avance', '🟡 J\'ai avancé'], ['pas', '🔴 Pas vraiment'], ['change', '🔄 J\'ai changé de mission']].map(([v, l]) => `<button class="chip" data-act="choixUnique" data-val="${v}" aria-pressed="false">${l}</button>`).join('')}</div>
      <h2 style="margin-top:14px">Et toi, ce round ?</h2>
      <div class="grid two" data-groupe="cout">${[['fluide', '😎 Fluide'], ['correct', '🙂 Correct'], ['couteux', '😮‍💨 Coûteux'], ['galere', '🤯 Galère']].map(([v, l]) => `<button class="chip" data-act="choixUnique" data-val="${v}" aria-pressed="false">${l}</button>`).join('')}</div>
      <label class="lbl" for="ck-b">🔋 Ma batterie maintenant</label><input id="ck-b" type="range" min="0" max="100" step="5" value="${r.batt == null ? 50 : r.batt}">
      <div class="bulle">${q}</div>
      <textarea id="ck-ref" rows="2" placeholder="Ce que je remarque (facultatif)"></textarea>
      <label class="switch"><span>💡 Garder ça comme découverte sur moi</span><input id="ck-garder" type="checkbox"></label>
      </div><button class="btn primaire plein" data-act="ckOk">Et maintenant ? →</button>`;
  }
  C.act('ckOk', () => {
    const r = rd.round, val = (g) => { const b = C.$(`[data-groupe="${g}"] [aria-pressed="true"]`); return b ? b.dataset.val : ''; };
    r.verdict = val('verdict'); r.cout = val('cout'); r.battFin = +C.$('#ck-b').value; r.note = C.$('#ck-ref').value.trim();
    C.state.rounds.push(Object.assign({ at: Date.now() }, r)); C.state.rounds = C.state.rounds.slice(-200);
    C.jour().batterie = r.battFin;
    if (r.verdict === 'fait') {
      const j = C.jour(); if (j.mission === r.mission) j.missionFaite = true;
      C.state.reussites.push({ id: C.uid(), at: Date.now(), text: 'Round réussi : ' + r.mission, auto: true });
    }
    if (C.$('#ck-garder').checked && r.note) C.proposer(r.note, 'Checkpoint de round', 'action');
    if (r.cout === 'fluide' && r.duree) C.proposer('Un round de ' + r.duree + ' min, ça peut bien marcher pour moi', 'Checkpoint de round', 'action');
    C.compter('rounds'); C.save();
    rd = { etape: 'suite', round: r }; C.render();
  });
  function ecranSuite() {
    const basse = C.faibleEnergie();
    return `${ui.crumb('organise', 'Je m\'organise')}
      <div class="card"><h1>🎮 Ton cerveau a besoin de quoi ?</h1>
      ${basse ? '<div class="bulle sobre">🌙 Ta batterie est basse. Je te conseille une vraie pause ou de t\'arrêter pour aujourd\'hui.</div>' : ''}
      <button class="choice" data-act="suite" data-arg="round"><span class="ico">▶️</span><b>Nouveau round</b></button>
      <button class="choice" data-act="suite" data-arg="pause"><span class="ico">☕</span><b>Pause 5 minutes</b></button>
      <button class="choice" data-act="suite" data-arg="jeu"><span class="ico">🎲</span><b>Un mini-jeu court</b></button>
      <button class="choice" data-act="suite" data-arg="reset"><span class="ico">🚶</span><b>Reset : respirer, bouger, boire</b></button>
      <button class="choice" data-act="suite" data-arg="stop"><span class="ico">🏁</span><b>J'arrête pour aujourd'hui</b></button></div>`;
  }
  C.act('suite', (el, a) => {
    if (a === 'round') { preparerRound({ mission: '', batt: rd.round && rd.round.battFin }); C.render(); return; }
    rd = { etape: 1 };
    if (a === 'pause') { C.go('organise'); ouvrirPause(5); }
    if (a === 'jeu') C.go('ludo');
    if (a === 'reset') { C.go('organise'); C.outils.reset(); }
    if (a === 'stop') clore();
  });
  function clore() {
    const j = C.jour(), auj = C.state.rounds.filter((r) => C.today(new Date(r.at)) === C.today());
    rd = { etape: 1 };
    C.go('organise');
    C.dialog('🏁 Session terminée', `<p>Bien joué. Pas parce que tout était parfait : parce que tu as essayé de <b>piloter</b> au lieu de subir.</p>
      <ul class="liste"><li><span>🎯</span><span class="grow">Rounds aujourd'hui</span><b>${auj.length}</b></li><li><span>💭</span><span class="grow">Pensées au parking</span><b>${C.state.parking.filter((p) => !p.fait).length}</b></li></ul>
      <label class="lbl" for="clo-n">Pour reprendre facilement demain, je note où j'en suis :</label><textarea id="clo-n" rows="2"></textarea>
      <button class="btn primaire plein" style="margin-top:10px" data-act="cloOk">Enregistrer et fermer</button>`);
  }
  C.act('cloOk', () => { const t = C.$('#clo-n').value.trim(); if (t) C.state.planning.push({ id: C.uid(), date: C.today(new Date(Date.now() + 864e5)), titre: 'Reprendre : ' + t, fait: false, at: Date.now() }); C.save(); C.close(); C.toast('À demain 🌙'); });

  /* ======================= PAUSE ======================= */
  let pauseT = null;
  function ouvrirPause(min) {
    const fin = Date.now() + min * 60e3;
    C.dialog('☕ Pause', `<p class="center">Lève-toi, bois de l'eau, regarde loin. Je te préviens à la fin.</p><div class="timer" id="pz-t">0${min}:00</div>
      <div class="row" style="justify-content:center"><button class="btn" data-act="fermer">Je reviens plus tôt</button></div>`);
    clearInterval(pauseT);
    pauseT = setInterval(() => {
      const el = C.$('#pz-t'); if (!el) { clearInterval(pauseT); return; }
      const r = Math.max(0, Math.round((fin - Date.now()) / 1000));
      el.textContent = String(Math.floor(r / 60)).padStart(2, '0') + ':' + String(r % 60).padStart(2, '0');
      if (!r) { clearInterval(pauseT); if (navigator.vibrate) navigator.vibrate([150, 80, 150]); el.insertAdjacentHTML('afterend', '<p class="bulle">⏰ Pause terminée. Tu reprends avec une seule petite étape ?</p>'); }
    }, 1000);
  }
  C.ouvrirPause = ouvrirPause;
  const stopDlgAvant = C.stopDialogTimers;
  C.stopDialogTimers = function () { if (stopDlgAvant) stopDlgAvant(); clearInterval(pauseT); };

  /* ======================= DÉCOUPER ======================= */
  const MODELES = {
    'Rédaction / texte': ['Relire la consigne et souligner les mots-actions', 'Noter 3 idées en vrac', 'Choisir l\'ordre des idées', 'Écrire l\'introduction (2 phrases)', 'Écrire une idée par paragraphe', 'Écrire la conclusion', 'Relecture guidée'],
    'Exercice de maths': ['Lire l\'énoncé deux fois', 'Noter les données (nombres, unités)', 'Écrire ce que je cherche', 'Retrouver l\'exemple du cours qui ressemble', 'Faire le calcul étape par étape', 'Vérifier que le résultat est logique', 'Écrire une phrase réponse'],
    'Apprendre une leçon': ['Lire le titre et les grandes parties', 'Écouter la leçon (lecture audio)', 'Redire avec mes mots', 'Créer 3 cartes mémoire', 'Me tester sans regarder', 'Programmer la réactivation de demain'],
    'Préparer mon sac': ['Regarder l\'emploi du temps de demain', 'Sortir ce qui ne sert plus', 'Mettre les cahiers et livres', 'Trousse complète ?', 'Devoirs à rendre ?', 'Affaires de sport ?'],
    'Préparer un oral': ['Choisir mon sujet', 'Faire un plan en 3 parties', 'Écrire des mots-clés (pas des phrases)', 'M\'enregistrer une fois', 'Me réécouter et améliorer une chose', 'Répéter devant quelqu\'un'],
  };
  function ecranDecouper() {
    const t = C.state.decoupage || { tache: '', etapes: [] };
    return `${ui.crumb('organise', 'Je m\'organise')}<h1>✂️ Découper une tâche</h1>
      <p class="muted">Une grosse tâche fait peur au cerveau. Des petites marches, beaucoup moins.</p>
      <div class="card"><label class="lbl" for="dc-t">Ma tâche</label>
      <input id="dc-t" type="text" value="${esc(t.tache || C.jour().mission)}" placeholder="Ex. : faire mon exposé" data-input="dcTache">
      <label class="lbl">Partir d'un modèle</label><div class="chips">${Object.keys(MODELES).map((m) => `<button class="chip" data-act="dcModele" data-arg="${esc(m)}">${esc(m)}</button>`).join('')}</div></div>
      <div class="card"><h2>Mes marches</h2>
      ${t.etapes.length ? `<ul class="liste">${t.etapes.map((e, i) => `<li><input type="checkbox" style="width:26px;height:26px;accent-color:var(--sauge)" data-change="dcCoche" data-arg="${i}" ${e.fait ? 'checked' : ''} aria-label="Fait"><span class="grow" style="${e.fait ? 'text-decoration:line-through;color:var(--doux)' : ''}">${i + 1}. ${esc(e.t)}</span><button class="btn discret" data-act="dcSuppr" data-arg="${i}" aria-label="Retirer">✕</button></li>`).join('')}</ul>` : ui.vide('Ajoute ta première marche, ou choisis un modèle.')}
      <div class="row" style="margin-top:10px"><input id="dc-e" type="text" placeholder="Une petite étape" style="flex:1;min-width:0"><button class="btn" data-act="dcAjout">➕</button></div>
      ${t.etapes.length ? `<div class="row" style="margin-top:12px"><button class="btn primaire" data-act="dcRound">▶️ Lancer un round sur la 1re marche</button><button class="btn" data-act="dcPlanning">📅 Mettre dans mon planning</button><button class="btn discret" data-act="dcVider">Tout effacer</button></div>` : ''}</div>`;
  }
  function dc() { C.state.decoupage = C.state.decoupage || { tache: '', etapes: [] }; return C.state.decoupage; }
  C.onInput('dcTache', (el) => { dc().tache = el.value; C.save(); });
  C.act('dcModele', (el, m) => { dc().tache = C.$('#dc-t').value || m; dc().etapes = MODELES[m].map((t) => ({ t, fait: false })); C.save(); C.rerender(); });
  C.act('dcAjout', () => { const v = C.$('#dc-e').value.trim(); if (!v) return; dc().tache = C.$('#dc-t').value; dc().etapes.push({ t: v, fait: false }); C.save(); C.rerender(); setTimeout(() => C.$('#dc-e') && C.$('#dc-e').focus(), 0); });
  C.act('dcSuppr', (el, i) => { dc().etapes.splice(+i, 1); C.save(); C.rerender(); });
  C.onInput('dcCoche', (el) => { const e = dc().etapes[+el.dataset.arg]; e.fait = el.checked; C.save(); if (dc().etapes.every((x) => x.fait)) { C.state.reussites.push({ id: C.uid(), at: Date.now(), text: 'Tâche terminée marche par marche : ' + (dc().tache || 'ma tâche'), auto: true }); C.save(); C.toast('🌱 Toutes les marches sont faites !'); } C.rerender(); });
  C.act('dcRound', () => { const e = dc().etapes.find((x) => !x.fait) || dc().etapes[0]; preparerRound({ mission: e.t, etape: 3 }); C.go('organise/round'); });
  C.act('dcPlanning', () => { dc().etapes.filter((e) => !e.fait).forEach((e) => C.state.planning.push({ id: C.uid(), date: C.today(), titre: (dc().tache ? dc().tache + ' — ' : '') + e.t, fait: false, at: Date.now() })); C.save(); C.toast('📅 Ajouté à ton planning d\'aujourd\'hui'); });
  C.act('dcVider', () => { C.state.decoupage = { tache: '', etapes: [] }; C.save(); C.rerender(); });

  /* ======================= PARKING & VIDAGE ======================= */
  function ecranParking() {
    const l = C.state.parking.filter((p) => !p.fait);
    return `${ui.crumb('organise', 'Je m\'organise')}<h1>💭 Parking à pensées</h1>
      <p class="muted">Ce qui encombre ta tête attend ici. Tu t'en occuperas plus tard — ou jamais, si ce n'était pas important.</p>
      <button class="btn primaire plein" data-act="vidage">🧠 Vider ma tête (tout d'un coup)</button>
      <div class="card" style="margin-top:12px">${l.length ? `<ul class="liste">${l.map((p) => `<li><span>💭</span><span class="grow">${esc(p.text)}<br><span class="muted small">${C.fmtDate(p.at)}</span></span><button class="btn discret" data-act="parkPlan" data-arg="${p.id}" aria-label="Mettre au planning">📅</button><button class="btn discret" data-act="parkFait" data-arg="${p.id}" aria-label="Réglé">✓</button></li>`).join('')}</ul>` : ui.vide('Parking vide. Ta tête a fait le ménage 😌')}</div>`;
  }
  function ouvrirVidage() {
    C.dialog('🧠 Vider ma tête', `<p class="muted">Écris tout ce qui tourne, une idée par ligne. Pas besoin de trier.</p><textarea id="ram" rows="7" placeholder="Tout ce qui tourne dans ma tête…"></textarea>
      <div class="row" style="margin-top:10px">${ui.ecouter('ram')}<button class="btn primaire" data-act="vidageOk">📥 Déposer au parking</button></div>`);
  }
  C.ouvrirVidage = ouvrirVidage;
  C.act('vidage', ouvrirVidage);
  C.act('vidageOk', () => {
    const lignes = C.$('#ram').value.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    lignes.forEach((t) => C.state.parking.push({ id: C.uid(), text: t, at: Date.now(), fait: false }));
    C.save(); C.close(); C.toast(lignes.length ? '📥 ' + lignes.length + ' pensée(s) garée(s). Respire.' : 'Rien à déposer');
    if (C.courant().name === 'organise') C.rerender();
  });
  C.act('parkFait', (el, id) => { const p = C.state.parking.find((x) => x.id === id); p.fait = true; C.save(); C.rerender(); });
  C.act('parkPlan', (el, id) => { const p = C.state.parking.find((x) => x.id === id); p.fait = true; C.state.planning.push({ id: C.uid(), date: C.today(new Date(Date.now() + 864e5)), titre: p.text, fait: false, at: Date.now() }); C.save(); C.toast('📅 Mis au planning de demain'); C.rerender(); });

  /* ======================= ROUTINES ======================= */
  const ROUTINES_TYPE = [
    { nom: '🎒 Mon cartable', etapes: ['Emploi du temps de demain', 'Cahiers et livres', 'Trousse complète', 'Devoirs à rendre', 'Carnet de liaison', 'Affaires de sport si besoin'] },
    { nom: '🌅 Mon matin', etapes: ['Me lever', 'Boire un verre d\'eau', 'Me préparer', 'Petit-déjeuner', 'Prendre mon sac', 'Vérifier : clés, téléphone, carte'] },
    { nom: '🌙 Mon soir', etapes: ['Préparer mes affaires pour demain', 'Regarder mon planning de demain', 'Écran posé 30 min avant de dormir', 'Me coucher'] },
    { nom: '📚 Avant de travailler', etapes: ['Eau à portée', 'Téléphone éloigné', 'Matériel prêt', 'Une seule mission choisie', 'Minuteur (si je veux)'] },
    { nom: '💼 Journée de stage', etapes: ['Horaires et adresse vérifiés', 'Trajet prévu (avec marge)', 'Tenue prête', 'Carnet de stage + stylo', 'Repas ou argent pour manger', 'Numéro du tuteur enregistré'] },
  ];
  function ecranRoutines(id) {
    const s = C.state;
    if (!s.routines.length) { s.routines = ROUTINES_TYPE.map((r) => ({ id: C.uid(), nom: r.nom, etapes: r.etapes.map((t) => ({ t, fait: false })), jour: '' })); C.save(); }
    const r = id && s.routines.find((x) => x.id === id);
    if (r) {
      if (r.jour !== C.today()) { r.etapes.forEach((e) => (e.fait = false)); r.jour = C.today(); C.save(); }
      const n = r.etapes.filter((e) => e.fait).length;
      return `${ui.crumb('organise/routines', 'Mes routines')}<h1>${esc(r.nom)}</h1>
        <div class="progress"><i style="width:${(n / Math.max(1, r.etapes.length)) * 100}%"></i></div><p class="muted small">${n}/${r.etapes.length} — la checklist se remet à zéro chaque jour.</p>
        <div class="card">${r.etapes.map((e, i) => `<label class="switch"><span>${esc(e.t)}</span><input type="checkbox" data-change="rtCoche" data-arg="${r.id}|${i}" ${e.fait ? 'checked' : ''}></label>`).join('')}</div>
        ${ui.fold('✏️ Modifier cette routine', `<div class="row"><input id="rt-e" type="text" placeholder="Nouvelle étape" style="flex:1;min-width:0"><button class="btn" data-act="rtAjout" data-arg="${r.id}">➕</button></div>
          <ul class="liste">${r.etapes.map((e, i) => `<li><span class="grow">${esc(e.t)}</span><button class="btn discret" data-act="rtSupprE" data-arg="${r.id}|${i}">✕</button></li>`).join('')}</ul>
          <button class="btn discret" data-act="rtSuppr" data-arg="${r.id}">Supprimer la routine</button>`)}`;
    }
    return `${ui.crumb('organise', 'Je m\'organise')}<h1>✅ Mes routines</h1><p class="muted">Des checklists pour ne pas avoir à tout retenir.</p>
      <div class="grid two">${s.routines.map((x) => `<a class="tile" href="#/organise/routines/${x.id}"><b>${esc(x.nom)}</b><span class="muted">${x.etapes.length} étapes</span></a>`).join('')}</div>
      ${ui.fold('➕ Créer une routine', '<input id="rt-n" type="text" placeholder="Nom (ex. : 🏃 Sport)"><button class="btn primaire" style="margin-top:8px" data-act="rtCreer">Créer</button>')}`;
  }
  const rt = (id) => C.state.routines.find((x) => x.id === id);
  C.onInput('rtCoche', (el) => { const [id, i] = el.dataset.arg.split('|'), r = rt(id); r.etapes[+i].fait = el.checked; C.save(); if (r.etapes.every((e) => e.fait)) { C.toast('✅ Routine complète !'); } C.rerender(); });
  C.act('rtAjout', (el, id) => { const v = C.$('#rt-e').value.trim(); if (!v) return; rt(id).etapes.push({ t: v, fait: false }); C.save(); C.rerender(); });
  C.act('rtSupprE', (el, a) => { const [id, i] = a.split('|'); rt(id).etapes.splice(+i, 1); C.save(); C.rerender(); });
  C.act('rtSuppr', (el, id) => { if (!confirm('Supprimer cette routine ?')) return; C.state.routines = C.state.routines.filter((x) => x.id !== id); C.save(); C.go('organise/routines'); });
  C.act('rtCreer', () => { const v = C.$('#rt-n').value.trim(); if (!v) return; const r = { id: C.uid(), nom: v, etapes: [], jour: '' }; C.state.routines.push(r); C.save(); C.go('organise/routines/' + r.id); });

  /* ======================= PLANNING ======================= */
  function ecranPlanning() {
    const auj = C.today(), items = C.state.planning.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.at - b.at));
    const passes = items.filter((x) => x.date < auj && !x.fait);
    const jours = [];
    for (let i = 0; i < 7; i++) jours.push(C.today(new Date(Date.now() + i * 864e5)));
    const bloc = (d) => {
      const l = items.filter((x) => x.date === d);
      const titre = d === auj ? 'Aujourd\'hui' : C.fmtDate(new Date(d + 'T12:00:00'));
      return `<details class="fold" ${d === auj ? 'open' : ''}><summary>${titre} <span class="badge">${l.filter((x) => !x.fait).length}</span></summary><div class="fold-body">
        ${l.length ? `<ul class="liste">${l.map((x) => `<li><input type="checkbox" style="width:26px;height:26px;accent-color:var(--sauge)" data-change="plCoche" data-arg="${x.id}" ${x.fait ? 'checked' : ''} aria-label="Fait"><span class="grow" style="${x.fait ? 'text-decoration:line-through;color:var(--doux)' : ''}">${esc(x.titre)}</span><button class="btn discret" data-act="plSuppr" data-arg="${x.id}" aria-label="Retirer">✕</button></li>`).join('')}</ul>` : '<p class="muted small">Rien de prévu. C\'est bien aussi.</p>'}</div></details>`;
    };
    return `${ui.crumb('organise', 'Je m\'organise')}<h1>📅 Mon planning</h1>
      ${C.faibleEnergie() ? '<div class="bulle sobre">🌙 Batterie basse : choisis UNE seule chose aujourd\'hui. Le reste peut attendre.</div>' : ''}
      <div class="card"><div class="row"><input id="pl-t" type="text" placeholder="Ajouter quelque chose" style="flex:2;min-width:150px"><input id="pl-d" type="date" value="${auj}" style="flex:1;min-width:130px"><button class="btn primaire" data-act="plAjout">➕</button></div></div>
      ${passes.length ? `<div class="card sable" style="margin-top:12px"><b>${passes.length} chose(s) d'avant pas encore faite(s).</b> Pas grave : on les reporte à aujourd'hui, ou on les laisse partir.<div class="row" style="margin-top:8px"><button class="btn" data-act="plReporter">↪️ Reporter à aujourd'hui</button><button class="btn discret" data-act="plLaisser">Laisser partir</button></div></div>` : ''}
      <div style="margin-top:12px">${jours.map(bloc).join('')}</div>`;
  }
  C.act('plAjout', () => { const t = C.$('#pl-t').value.trim(); if (!t) return; C.state.planning.push({ id: C.uid(), titre: t, date: C.$('#pl-d').value || C.today(), fait: false, at: Date.now() }); C.save(); C.rerender(); });
  C.onInput('plCoche', (el) => { const x = C.state.planning.find((p) => p.id === el.dataset.arg); x.fait = el.checked; C.save(); C.rerender(); });
  C.act('plSuppr', (el, id) => { C.state.planning = C.state.planning.filter((p) => p.id !== id); C.save(); C.rerender(); });
  C.act('plReporter', () => { const a = C.today(); C.state.planning.forEach((p) => { if (p.date < a && !p.fait) p.date = a; }); C.save(); C.rerender(); });
  C.act('plLaisser', () => { const a = C.today(); C.state.planning = C.state.planning.filter((p) => !(p.date < a && !p.fait)); C.save(); C.rerender(); });

  /* ======================= RELECTURE GUIDÉE ======================= */
  const RELECTURE = [
    { t: 'La consigne', q: 'Relis la consigne. As-tu répondu à TOUT ce qui était demandé ?' },
    { t: 'L\'écoute', q: 'Écoute ton texte lu à voix haute. Les mots oubliés et les phrases bizarres s\'entendent mieux qu\'ils ne se voient.', ecoute: true },
    { t: 'Les phrases', q: 'Chaque phrase commence par une majuscule et finit par un point ?' },
    { t: 'Les accords', q: 'Regarde les verbes : sont-ils accordés avec leur sujet ? (ils mangent, elle mange)' },
    { t: 'Les nombres', q: 'En maths ou en sciences : les unités sont là ? Le résultat est-il logique ?' },
    { t: 'La présentation', q: 'Nom, date, titre, numéro d\'exercice : tout y est ?' },
  ];
  let rl = 0;
  function ecranRelecture() {
    const e = RELECTURE[rl];
    return `${ui.crumb('organise', 'Je m\'organise')}<h1>🔎 Relecture guidée</h1>
      <div class="card"><label class="lbl" for="rl-txt">Mon texte (facultatif : colle-le pour l'écouter)</label><textarea id="rl-txt" rows="4" data-input="rlTxt">${esc(C.state.relecture || '')}</textarea></div>
      <div class="card bleu" style="margin-top:12px">${ui.steps(rl + 1, RELECTURE.length)}<h2>${e.t}</h2><p>${e.q}</p>
      ${e.ecoute ? '<button class="btn" data-act="rlEcoute">🔊 Écouter mon texte</button>' : ''}
      <div class="row" style="margin-top:12px;justify-content:space-between">${rl > 0 ? '<button class="btn" data-act="rlNav" data-arg="-1">←</button>' : '<span></span>'}
      ${rl < RELECTURE.length - 1 ? '<button class="btn primaire" data-act="rlNav" data-arg="1">Vérifié ✓ →</button>' : '<button class="btn sauge" data-act="rlFin">J\'ai tout relu ✓</button>'}</div></div>`;
  }
  C.onInput('rlTxt', (el) => { C.state.relecture = el.value; C.save(); });
  C.act('rlEcoute', () => { const t = C.$('#rl-txt').value.trim(); if (!t) { C.toast('Colle d\'abord ton texte'); return; } C.dire(t); });
  C.act('rlNav', (el, d) => { rl = Math.max(0, Math.min(RELECTURE.length - 1, rl + +d)); C.rerender(); });
  C.act('rlFin', () => { rl = 0; C.state.reussites.push({ id: C.uid(), at: Date.now(), text: 'J\'ai fait une relecture complète avant de rendre mon travail', auto: true }); C.save(); C.toast('🌱 Relecture faite — ajouté à tes réussites'); C.go('organise'); });
})();
