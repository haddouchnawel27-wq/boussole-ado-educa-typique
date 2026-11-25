/* Coachy 2.0 — Laboratoire de mémorisation.
   Réactivation espacée + récupération active. On distingue :
   autonome · avec indice · avec exemple · avec guidance · à retravailler.
   Une réussite immédiate n'est PAS un acquis : « durable » seulement après
   une réussite autonome à J+7 au moins (et réussite du transfert s'il existe). */
(function () {
  'use strict';
  const ui = C.ui, esc = C.esc;
  const MIN = 60e3, JOUR = 864e5;
  const PALIERS = [
    { id: 0, label: 'Tout de suite', ms: 0 },
    { id: 1, label: '30 minutes', ms: 30 * MIN, facultatif: true },
    { id: 2, label: 'Le lendemain', ms: JOUR },
    { id: 3, label: '3 jours', ms: 3 * JOUR },
    { id: 4, label: '1 semaine', ms: 7 * JOUR },
    { id: 5, label: '2 semaines', ms: 14 * JOUR },
    { id: 6, label: '1 mois', ms: 30 * JOUR },
  ];
  const NIVEAUX = {
    autonome: { ico: '🌟', label: 'Réussi seul{e|}', badge: 'sauge' },
    indice: { ico: '💡', label: 'Réussi avec un indice', badge: '' },
    exemple: { ico: '🛒', label: 'Réussi avec un exemple', badge: 'lavande' },
    guidance: { ico: '🤝', label: 'Réussi avec de l\'aide', badge: 'sable' },
    retravailler: { ico: '🔄', label: 'À retravailler', badge: 'alerte' },
  };

  function cfg() { const s = C.state; s.memoireCfg = s.memoireCfg || { avec30: true, actifs: [0, 1, 2, 3, 4, 5, 6] }; return s.memoireCfg; }
  function paliersActifs() { const c = cfg(); return PALIERS.filter((p) => c.actifs.includes(p.id) && (p.id !== 1 || c.avec30)); }
  function suivant(palier) { const a = paliersActifs(); const nx = a.find((p) => p.id > palier); return nx ? nx.id : a[a.length - 1].id; }
  function delai(palier) { const p = PALIERS[palier]; return p ? p.ms : JOUR; }

  const M = (C.memoire = {});
  M.ajouter = function (o) {
    const c = Object.assign({ id: C.uid(), type: 'normal', indice: '', exemple: '', palier: 0, prochaine: Date.now(), hist: [], creeLe: Date.now(), at: Date.now() }, o);
    C.state.cartes.push(c); C.save(); return c;
  };
  M.dues = () => C.state.cartes.filter((c) => !c.archive && c.prochaine <= Date.now());
  M.statut = function (c) {
    const autoTard = (c.hist || []).some((h) => h.niveau === 'autonome' && h.palier >= 4);
    if (autoTard) {
      const tr = C.state.cartes.filter((x) => x.notionId && x.notionId === c.notionId && x.type === 'transfert');
      if (!tr.length || tr.some((x) => (x.hist || []).some((h) => h.niveau === 'autonome' || h.niveau === 'indice'))) return 'durable';
    }
    if ((c.hist || []).some((h) => h.niveau === 'autonome' && h.palier >= 2)) return 'solide';
    return 'construction';
  };
  const STATUTS = { construction: ['🌱', 'En construction', 'sable'], solide: ['🌿', 'Ça tient', 'lavande'], durable: ['🌳', 'Acquis durable', 'sauge'] };
  M.noter = function (c, niveau) {
    const p = c.palier;
    c.hist = c.hist || [];
    c.hist.push({ at: Date.now(), niveau, palier: p });
    let np = p, d;
    if (niveau === 'autonome') { np = suivant(p); d = delai(np); }
    else if (niveau === 'indice') { np = p < 2 ? 2 : p; d = delai(np); } // on ne monte pas de palier
    else if (niveau === 'exemple') { np = Math.max(2, p - 1); d = delai(np); }
    else if (niveau === 'guidance') { np = 2; d = JOUR; }
    else { np = 0; d = 10 * MIN; }
    c.palier = np; c.prochaine = Date.now() + d; c.at = Date.now();
    C.save();
    return { np, d };
  };
  function quand(ts) {
    const d = ts - Date.now();
    if (d <= 60e3) return 'maintenant';
    if (d < 3600e3) return 'dans ' + Math.round(d / 60e3) + ' min';
    if (d < JOUR * 1.5) return 'demain';
    return 'le ' + C.fmtDate(ts);
  }

  /* ======================= ÉCRANS ======================= */
  C.screen('memoire', function (args) {
    if (args[0] === 'reviser') return ecranRevision();
    if (args[0] === 'controle') return ecranControle(args[1]);
    if (args[0] === 'cartes') return ecranCartes();
    const cartes = C.state.cartes.filter((c) => !c.archive), dues = M.dues();
    const st = { construction: 0, solide: 0, durable: 0 };
    cartes.forEach((c) => st[M.statut(c)]++);
    return `${ui.crumb('apprendre', 'J\'apprends')}
      <h1>🧠 Labo de mémorisation</h1>
      <p class="muted">Le cerveau garde ce qu'on <b>va rechercher</b> dedans, plusieurs fois, en espaçant. Relire ne suffit pas : on essaie de se souvenir, puis on vérifie.</p>
      <div class="card ${dues.length ? 'sable' : 'sauge'}">
        <h2>${dues.length ? dues.length + ' carte(s) à réactiver' : 'Rien à réactiver pour l\'instant 🌿'}</h2>
        ${dues.length ? `<p class="muted small">${C.faibleEnergie() ? 'Batterie basse : on en fait 5 maximum.' : 'Compte environ 30 secondes par carte.'}</p><a class="btn primaire plein" href="#/memoire/reviser">Commencer</a>` : `<p class="muted small">Prochaine réactivation : ${cartes.length ? quand(Math.min(...cartes.map((c) => c.prochaine))) : '—'}</p>`}
      </div>
      <div class="grid" style="grid-template-columns:repeat(3,1fr);margin-top:12px">
        ${Object.keys(STATUTS).map((k) => `<div class="card center" style="margin:0;padding:12px"><div style="font-size:1.6rem">${STATUTS[k][0]}</div><b>${st[k]}</b><div class="small muted">${STATUTS[k][1]}</div></div>`).join('')}
      </div>
      <div class="grid two" style="margin-top:12px">
        ${ui.tile('memoire/cartes', '🃏', 'Mes cartes', cartes.length + ' carte(s)', '')}
        ${ui.tile('memoire/controle', '📝', 'Préparer un contrôle', 'Plan de réactivation', 'sable')}
      </div>
      ${ui.fold('⚙️ Mes rappels', `<p class="muted small">Choisis quand Coachy te repropose une carte.</p>
        ${PALIERS.map((p) => `<label class="switch"><span>${p.label}${p.facultatif ? ' <span class="muted small">(facultatif)</span>' : ''}</span><input type="checkbox" data-change="memPalier" data-arg="${p.id}" ${cfg().actifs.includes(p.id) && (p.id !== 1 || cfg().avec30) ? 'checked' : ''} ${p.id === 0 ? 'disabled' : ''}></label>`).join('')}`)}
      ${ui.fold('❓ Comment ça marche', `<ul class="liste">${Object.values(NIVEAUX).map((n) => `<li><span>${n.ico}</span><span class="grow">${n.label}</span></li>`).join('')}</ul>
        <p class="small">Une carte devient <b>🌳 acquis durable</b> seulement quand tu la réussis seul{e|} après au moins une semaine — et que tu sais l'utiliser dans une situation différente (question de transfert). Réussir juste après avoir appris, c'est bien, mais ce n'est pas encore durable.</p>`)}`;
  });
  C.onInput('memPalier', (el) => {
    const id = +el.dataset.arg, c = cfg();
    if (id === 1) c.avec30 = el.checked;
    c.actifs = el.checked ? [...new Set(c.actifs.concat(id))].sort() : c.actifs.filter((x) => x !== id);
    if (!c.actifs.some((x) => x >= 2)) { c.actifs.push(2); el.checked = true; C.toast('Il faut garder au moins un rappel espacé'); }
    C.save();
  });

  /* ---------- session de révision : une carte par écran ---------- */
  let sess = null;
  function nouvelleSession() {
    const dues = C.shuffle(M.dues());
    sess = { file: dues.slice(0, C.faibleEnergie() ? 5 : 15).map((c) => c.id), i: 0, aide: 'autonome', vu: false, faits: [] };
  }
  function ecranRevision() {
    if (!sess || sess.i >= sess.file.length) { if (sess && sess.faits.length) return finSession(); nouvelleSession(); }
    if (!sess.file.length) return `${ui.crumb('memoire', 'Labo mémoire')}${ui.vide('Aucune carte à réactiver. Reviens plus tard 🌿')}`;
    const c = C.state.cartes.find((x) => x.id === sess.file[sess.i]);
    if (!c) { sess.i++; return ecranRevision(); }
    const n = C.state.notions.find((x) => x.id === c.notionId);
    return `${ui.crumb('memoire', 'Labo mémoire')}
      ${ui.steps(sess.i + 1, sess.file.length)}
      <div class="card ${c.type === 'transfert' ? 'lavande' : 'bleu'}">
        <p class="muted small">${c.type === 'transfert' ? '🔁 Question de transfert · ' : ''}${n ? esc(n.titre) : 'Carte libre'} · carte ${sess.i + 1}/${sess.file.length}</p>
        <h2 style="font-size:1.25rem">${esc(c.recto)}</h2>
        ${C.peutLire() ? ui.lire(c.recto) : ''}
      </div>
      <div class="card">
        <label class="lbl" for="rv-rep">Je cherche dans ma tête… (je peux écrire)</label>
        <textarea id="rv-rep" rows="3" placeholder="Ma réponse"></textarea>
        <div id="rv-aides"></div>
        ${sess.vu ? `<div class="card sauge" style="margin-top:10px"><b>Réponse :</b><p style="white-space:pre-wrap;margin:4px 0 0">${esc(c.verso)}</p></div>
          <p style="margin-top:12px"><b>Tu l'avais trouvé ?</b></p>
          <div class="grid two"><button class="btn sauge" data-act="rvNote" data-arg="ok">✅ Oui</button><button class="btn" data-act="rvNote" data-arg="non">🔄 Pas encore</button></div>`
        : `<div class="row" style="margin-top:10px">
          ${c.indice ? '<button class="btn" data-act="rvAide" data-arg="indice">💡 Un indice</button>' : ''}
          ${c.exemple ? '<button class="btn" data-act="rvAide" data-arg="exemple">🛒 Un exemple</button>' : ''}
          <button class="btn" data-act="rvAide" data-arg="guidance">🤝 Guide-moi</button>
          <button class="btn primaire" data-act="rvVoir">👀 Voir la réponse</button></div>`}
      </div>`;
  }
  const RANG = { autonome: 0, indice: 1, exemple: 2, guidance: 3 };
  C.act('rvAide', (el, type) => {
    const c = C.state.cartes.find((x) => x.id === sess.file[sess.i]);
    if (RANG[type] > RANG[sess.aide]) sess.aide = type;
    let t = '';
    if (type === 'indice') t = '💡 ' + esc(c.indice);
    if (type === 'exemple') t = '🛒 ' + esc(c.exemple);
    if (type === 'guidance') {
      const mots = c.verso.trim().split(/\s+/);
      t = `🤝 La réponse commence par « <b>${esc(mots.slice(0, Math.min(2, Math.ceil(mots.length / 4))).join(' '))}…</b> » et fait environ ${mots.length} mot(s).`;
    }
    C.$('#rv-aides').insertAdjacentHTML('beforeend', `<div class="bulle">${t}</div>`);
    el.disabled = true;
  });
  C.act('rvVoir', () => { sess.vu = true; const rep = C.$('#rv-rep').value; C.rerender(); C.$('#rv-rep').value = rep; });
  C.act('rvNote', (el, ok) => {
    const c = C.state.cartes.find((x) => x.id === sess.file[sess.i]);
    const niveau = ok === 'ok' ? sess.aide : 'retravailler';
    const r = M.noter(c, niveau);
    sess.faits.push({ id: c.id, niveau, prochaine: c.prochaine });
    C.toast(C.acc(NIVEAUX[niveau].ico + ' ' + NIVEAUX[niveau].label + ' · prochaine fois ' + quand(c.prochaine)));
    sess.i++; sess.aide = 'autonome'; sess.vu = false;
    C.render();
  });
  function finSession() {
    const f = sess.faits, compte = {};
    f.forEach((x) => (compte[x.niveau] = (compte[x.niveau] || 0) + 1));
    const html = `${ui.crumb('memoire', 'Labo mémoire')}
      <div class="card sauge center"><div class="big-emoji">🧠</div><h1>Session terminée</h1>
      <p>Tu as réactivé <b>${f.length}</b> carte(s). C'est ce geste-là — aller chercher dans ta mémoire — qui fait retenir.</p></div>
      <div class="card"><ul class="liste">${Object.keys(NIVEAUX).filter((k) => compte[k]).map((k) => `<li><span>${NIVEAUX[k].ico}</span><span class="grow">${NIVEAUX[k].label}</span><b>${compte[k]}</b></li>`).join('')}</ul>
      ${compte.retravailler ? '<p class="small muted">Les cartes « à retravailler » reviennent dans 10 minutes. Ce n\'est pas un échec : c\'est le cerveau qui s\'entraîne.</p>' : ''}</div>
      <a class="btn primaire plein" href="#/memoire">Retour au labo</a>`;
    C.compter('revisions');
    sess = null;
    return html;
  }

  /* ---------- liste des cartes ---------- */
  function ecranCartes() {
    const cartes = C.state.cartes.filter((c) => !c.archive);
    return `${ui.crumb('memoire', 'Labo mémoire')}<h1>🃏 Mes cartes</h1>
      ${ui.fold('➕ Ajouter une carte libre', `<label class="lbl" for="cl-r">Question</label><input id="cl-r" type="text"><label class="lbl" for="cl-v">Réponse</label><textarea id="cl-v" rows="2"></textarea>
        <label class="lbl" for="cl-i">Indice (facultatif)</label><input id="cl-i" type="text"><label class="lbl" for="cl-e">Exemple (facultatif)</label><input id="cl-e" type="text">
        <label class="switch"><span>C'est une question de transfert (situation différente)</span><input id="cl-t" type="checkbox"></label>
        <button class="btn primaire" data-act="carteLibre">Ajouter</button>`)}
      ${cartes.length ? `<ul class="liste card" style="margin-top:12px">${cartes.map((c) => {
        const s = STATUTS[M.statut(c)];
        return `<li><span>${s[0]}</span><span class="grow"><b>${esc(c.recto)}</b><br><span class="muted small">${esc(c.verso)}</span><br><span class="badge ${s[2]}">${s[1]}</span> <span class="small muted">· prochaine : ${quand(c.prochaine)}</span></span><button class="btn discret" data-act="carteSuppr" data-arg="${c.id}" aria-label="Supprimer">🗑️</button></li>`;
      }).join('')}</ul>` : ui.vide('Aucune carte. Crée-les depuis une notion (étape 8) ou ici.')}`;
  }
  C.act('carteLibre', () => {
    const r = C.$('#cl-r').value.trim(), v = C.$('#cl-v').value.trim();
    if (!r || !v) { C.toast('Question et réponse, s\'il te plaît'); return; }
    M.ajouter({ recto: r, verso: v, indice: C.$('#cl-i').value.trim(), exemple: C.$('#cl-e').value.trim(), type: C.$('#cl-t').checked ? 'transfert' : 'normal' });
    C.toast('🃏 Carte ajoutée'); C.rerender();
  });
  C.act('carteSuppr', (el, id) => { if (!confirm('Supprimer cette carte ?')) return; C.state.cartes = C.state.cartes.filter((c) => c.id !== id); C.save(); C.rerender(); });

  /* ---------- plan de contrôle ---------- */
  function ecranControle(id) {
    const notions = C.state.notions;
    return `${ui.crumb('memoire', 'Labo mémoire')}<h1>📝 Préparer un contrôle</h1>
      <p class="muted">Je te prépare un plan de réactivations jusqu'au jour J, et je l'ajoute à ton planning.</p>
      <div class="card">
        <label class="lbl" for="ct-nom">Le contrôle</label><input id="ct-nom" type="text" placeholder="Ex. : Contrôle de maths">
        <label class="lbl" for="ct-date">La date</label><input id="ct-date" type="date" min="${C.today()}">
        <label class="lbl">Les notions concernées</label>
        ${notions.length ? `<div class="chips" data-groupe="ct-notions">${notions.map((n) => `<button class="chip" data-act="toggle" data-val="${n.id}" aria-pressed="${n.id === id}">${esc(n.titre)}</button>`).join('')}</div>` : '<p class="muted small">Ajoute d\'abord tes notions dans Mon prof autrement (ou crée le plan sans).</p>'}
        <button class="btn primaire plein" style="margin-top:14px" data-act="ctPlan">Créer mon plan</button>
      </div>
      <div class="card sauge" style="margin-top:12px"><b>La veille :</b> une réactivation courte, puis dormir. Le sommeil aide le cerveau à ranger ce qu'il a appris. <a href="#/soin/examen">Gérer le stress →</a></div>`;
  }
  C.act('ctPlan', () => {
    const nom = C.$('#ct-nom').value.trim() || 'Mon contrôle', date = C.$('#ct-date').value;
    if (!date) { C.toast('Choisis la date du contrôle'); return; }
    const ids = C.$$('[data-groupe="ct-notions"] [aria-pressed="true"]').map((b) => b.dataset.val);
    const titres = ids.map((i) => (C.state.notions.find((n) => n.id === i) || {}).titre).filter(Boolean);
    const jJ = new Date(date + 'T12:00:00').getTime();
    const jours = Math.round((jJ - Date.now()) / JOUR);
    const offsets = [7, 3, 1].filter((o) => o < jours + 1);
    const plan = [];
    offsets.forEach((o) => plan.push({ date: C.today(new Date(jJ - o * JOUR)), titre: `${nom} : réactiver ${titres.length ? titres.join(', ') : 'mes cartes'} (${o === 1 ? 'la veille, court' : 'J-' + o})` }));
    if (!plan.length || plan[0].date !== C.today()) plan.unshift({ date: C.today(), titre: `${nom} : faire une liste de ce que je sais déjà` });
    plan.push({ date, titre: `${nom} — jour J. Respirer, lire la consigne deux fois, commencer par ce que je sais.` });
    plan.forEach((p) => C.state.planning.push({ id: C.uid(), date: p.date, titre: p.titre, fait: false, at: Date.now() }));
    ids.forEach((i) => C.state.cartes.filter((c) => c.notionId === i && c.prochaine > jJ - JOUR).forEach((c) => (c.prochaine = Math.max(Date.now(), jJ - 2 * JOUR))));
    C.save();
    C.dialog('📝 Ton plan est prêt', `<ul class="liste">${plan.map((p) => `<li><span>📅</span><span class="grow"><b>${C.fmtDate(new Date(p.date + 'T12:00:00'))}</b><br>${esc(p.titre)}</span></li>`).join('')}</ul>
      <p class="muted small">C'est ajouté à ton planning (Je m'organise). Tu peux tout modifier.</p><button class="btn primaire plein" data-act="go" data-arg="organise/planning">Voir mon planning</button>`);
  });
})();
