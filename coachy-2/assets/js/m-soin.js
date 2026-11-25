/* Coachy 2.0 — Je prends soin de moi.
   Psychoéducation émotionnelle inspirée des TCC et de la métacognition.
   Ce n'est ni un diagnostic, ni un substitut à un accompagnement. */
(function () {
  'use strict';
  const D = C.data, ui = C.ui, esc = C.esc;

  /* ======================= OUTILS COURTS (dialogues) ======================= */
  const O = (C.outils = {});
  let souffleT = null, souffleN = 0;
  O.respiration = function () {
    C.dialog('🫧 Respiration douce', `<p class="center muted">Suis la bulle : elle grossit, tu inspires ; elle rapetisse, tu souffles longtemps. À ton rythme, sans forcer.</p>
      <div class="souffle" id="souffle">Prêt{e|} ?</div><p class="center muted small" id="souffle-n"></p>
      <div class="row" style="justify-content:center"><button class="btn primaire" data-act="souffleGo">▶️ Commencer</button><button class="btn" data-act="rescan">J'ai fini</button></div>`);
  };
  C.act('souffleGo', (el) => {
    el.disabled = true; souffleN = 0; clearInterval(souffleT);
    const b = C.$('#souffle'), n = C.$('#souffle-n');
    const cycle = () => {
      if (!C.$('#souffle')) { clearInterval(souffleT); return; }
      souffleN++;
      b.classList.add('in'); b.textContent = 'J\'inspire…';
      setTimeout(() => { if (C.$('#souffle')) { b.classList.remove('in'); b.textContent = 'Je souffle…'; } }, 4000);
      n.textContent = 'Cycle ' + souffleN + (souffleN >= 5 ? ' · tu peux t\'arrêter quand tu veux' : '');
    };
    cycle(); souffleT = setInterval(cycle, 10000);
  });
  const stopDlg = C.stopDialogTimers;
  C.stopDialogTimers = function () { if (stopDlg) stopDlg(); clearInterval(souffleT); clearTimeout(relaxT); };

  const SENS = [['👀', 5, 'choses que tu VOIS'], ['✋', 4, 'choses que tu peux TOUCHER'], ['👂', 3, 'sons que tu ENTENDS'], ['👃', 2, 'odeurs que tu SENS (ou que tu aimes)'], ['👅', 1, 'goût dans ta bouche (ou une gorgée d\'eau)']];
  O.ancrage = function (i) {
    i = i || 0;
    if (i >= SENS.length) return O.rescanDlg();
    const s = SENS[i];
    C.dialog('🖐️ Revenir ici : 5-4-3-2-1', `${ui.steps(i + 1, 5)}<div class="center"><div class="big-emoji">${s[0]}</div><h2>Trouve ${s[1]} ${s[2]}</h2><p class="muted">Prends ton temps. Tu peux les dire à voix basse.</p></div>
      <button class="btn primaire plein" data-act="ancrageSuiv" data-arg="${i + 1}">C'est fait →</button>`);
  };
  C.act('ancrageSuiv', (el, i) => O.ancrage(+i));

  O.reset = function () {
    C.dialog('🌫️ Petit reset', `<p>On teste quelque chose, puis TU regardes si ça t'aide.</p>
      <button class="choice" data-act="outil" data-arg="respiration">🫧 Bulle respiration</button>
      <button class="choice" data-act="outil" data-arg="bouger">🚶 Bouger</button>
      <button class="choice" data-act="outil" data-arg="eau">💧 Boire de l'eau</button>
      <button class="choice" data-act="outil" data-arg="air">🌬️ Prendre l'air</button>
      <button class="choice" data-act="outil" data-arg="vider">🧠 Vider ma tête</button>
      <button class="choice" data-act="outil" data-arg="relax">😌 Détendre mon corps</button>`);
  };
  O.simple = (titre, txt) => C.dialog(titre, `<div class="bulle">${txt}</div><button class="btn primaire plein" data-act="rescan">J'ai fait</button>`);
  O.bouger = () => O.simple('🚶 Bouger', 'Étire-toi vers le plafond → relâche les épaules → secoue doucement les bras et les jambes → marche quelques pas. Si tu en as envie : 10 petits sauts.');
  O.eau = () => O.simple('💧 Eau', 'Va te servir un verre d\'eau. Bois lentement, en sentant l\'eau fraîche.');
  O.air = () => O.simple('🌬️ Air', 'Ouvre la fenêtre ou sors une minute. Respire l\'air frais, regarde loin.');
  O.ecrire = () => C.dialog('✍️ Écrire ce que je ressens', `<p class="muted">Personne ne lira. Écris comme ça vient.</p><textarea id="ecr" rows="6"></textarea><div class="row" style="margin-top:8px">${ui.ecouter('ecr')}<button class="btn primaire" data-act="rescan">J'ai écrit</button></div>`);
  O.vider = () => C.ouvrirVidage();
  O.repos = () => O.simple('🌙 Me reposer', 'Allonge-toi ou installe-toi confortablement 10 minutes. Pas d\'écran si possible. Si tu t\'endors, c\'est que ton corps en avait besoin.');
  O.pensee = () => C.go('soin/pensees');
  O.aide = () => {
    const p = (C.state.modeEmploi.personnes || {});
    C.dialog('🤝 Demander de l\'aide', `${p.confiance ? `<div class="card sauge"><b>Les personnes que tu as notées :</b><p style="white-space:pre-wrap">${esc(p.confiance)}</p></div>` : '<p>Pense à un adulte de confiance : un parent, un prof, la CPE, l\'infirmière scolaire, ton accompagnante.</p>'}
      <p><b>Une phrase pour commencer :</b> « Est-ce que je peux te parler ? Ça ne va pas trop en ce moment. »</p>
      <div class="card alerte"><b>En cas de danger :</b> <b>3114</b> (si tu penses au suicide, 24 h/24) · <b>119</b> (enfance en danger) · <b>112</b> (urgences).</div>
      <button class="btn primaire plein" style="margin-top:10px" data-act="rescan">Continuer</button>`);
  };
  const RELAX = ['Serre fort les poings… 5 secondes… et relâche.', 'Remonte les épaules vers les oreilles… tiens… et laisse-les retomber.', 'Fronce le visage… et détends-le complètement.', 'Pousse les pieds dans le sol… et relâche.', 'Respire lentement. Remarque la différence entre tendu et relâché.'];
  let relaxT = null;
  O.relax = function (i) {
    i = i || 0;
    if (i >= RELAX.length) return O.rescanDlg();
    C.dialog('😌 Détendre mon corps', `${ui.steps(i + 1, RELAX.length)}<div class="bulle" style="font-size:1.1rem">${RELAX[i]}</div><button class="btn primaire plein" data-act="relaxSuiv" data-arg="${i + 1}">Suivant →</button>`);
    if (C.state.reglages.audio) C.dire(RELAX[i]);
  };
  C.act('relaxSuiv', (el, i) => O.relax(+i));
  C.act('outil', (el, nom) => O[nom] && O[nom]());

  /* Re-scan : l'ado observe si l'outil l'a aidé{e} → donnée utile pour son mode d'emploi */
  O.rescanDlg = function () {
    C.dialog('🔎 Re-scan', `<p><b>Et maintenant, comment tu te sens ?</b></p>
      <button class="choice" data-act="rescanOk" data-arg="mieux">🌤️ Plus clair, plus calme</button>
      <button class="choice" data-act="rescanOk" data-arg="pareil">😐 Pareil</button>
      <button class="choice" data-act="rescanOk" data-arg="moins">🌧️ Moins bien</button>`);
  };
  C.act('rescan', () => O.rescanDlg());
  C.act('rescanOk', (el, v) => {
    C.state.compteurs['rescan_' + v] = (C.state.compteurs['rescan_' + v] || 0) + 1; C.save();
    C.close();
    C.toast(v === 'mieux' ? '🌤️ Super. Ça vaut le coup de s\'en souvenir.' : v === 'pareil' ? 'Ok. On peut essayer autre chose, ou juste continuer doucement.' : 'Merci de l\'avoir remarqué. Parle à quelqu\'un si ça continue 🤝');
  });

  /* ======================= HUB ======================= */
  C.screen('soin', function (args) {
    const s = args[0];
    if (s === 'parcours') return ecranParcours(args[1]);
    if (s === 'thermo') return ecranThermo();
    if (s === 'radar') return ecranRadar();
    if (s === 'reussites') return ecranReussites();
    if (s === 'pensees') return ecranPensees();
    if (s === 'examen') return ecranExamen();
    if (s === 'confiance') return ecranConfiance();
    return `<h1>🌿 Je prends soin de moi</h1>
      <p class="muted">Comprendre ce qui se passe dedans, et trouver ce qui aide. À ton rythme.</p>
      <div class="card"><h2>Là, maintenant…</h2>
      <div class="grid two">${Object.entries(D.parcours).map(([id, p]) => `<a class="tile ${id === 'aide' ? 'sauge' : ''}" href="#/soin/parcours/${id}" style="min-height:64px"><span class="ico">${p.ico}</span><b>${p.titre}</b></a>`).join('')}</div></div>
      <h2 style="margin-top:16px">Mes outils</h2>
      <div class="grid two">
        ${ui.tile('soin/thermo', '🌡️', 'Thermomètre & roue', 'Nommer ce que je ressens', 'bleu')}
        ${ui.tile('soin/radar', '📡', 'Mon radar émotionnel', 'Ce qui revient souvent', 'lavande')}
        ${ui.tile('soin/reussites', '🌱', 'Carnet des réussites', C.state.reussites.length + ' réussite(s)', 'sauge')}
        ${ui.tile('soin/pensees', '💭', 'Mes pensées pièges', 'Les repérer, les nuancer', 'lavande')}
        ${ui.tile('soin/examen', '📝', 'Stress des examens', 'Avant, pendant, après', 'sable')}
        ${ui.tile('soin/confiance', '💎', 'Confiance en moi', 'Mes forces, mes progrès', 'bleu')}
      </div>
      <div class="card" style="margin-top:12px"><h2>Pauses express</h2><div class="row">
        <button class="btn" data-act="outil" data-arg="respiration">🫧 Respirer</button>
        <button class="btn" data-act="outil" data-arg="ancrage">🖐️ 5-4-3-2-1</button>
        <button class="btn" data-act="outil" data-arg="relax">😌 Relaxation</button>
        <button class="btn" data-act="outil" data-arg="vider">🧠 Vider ma tête</button></div></div>
      <p class="footer-note">Ces outils aident à se comprendre. Ils ne posent aucun diagnostic et ne remplacent pas un professionnel.</p>`;
  });

  /* ======================= PARCOURS « JE SUIS… » ======================= */
  let pc = null;
  function ecranParcours(id) {
    const p = D.parcours[id];
    if (!p) return ui.vide('Parcours introuvable.');
    if (!pc || pc.id !== id) pc = { id, etape: 1, avant: 5, corps: [], besoins: [], apres: null };
    const e = pc.etape;
    let h = `${ui.crumb('soin', 'Je prends soin de moi')}${ui.steps(e, 5)}<h1>${p.ico} ${p.titre}</h1>`;
    if (e === 1) {
      h += `<div class="bulle">${p.valide}</div>
        <div class="card"><label class="lbl" for="pc-int">Ça monte à combien ? <b id="pc-iv">${pc.avant}</b>/10</label>
        <input id="pc-int" type="range" min="0" max="10" value="${pc.avant}" data-input="pcInt"><p class="muted small" id="pc-zone">${zone(pc.avant)}</p></div>`;
      if (id === 'aide') h += `<div class="card alerte"><b>Si tu es en danger ou si tu penses à te faire du mal :</b> parle tout de suite à un adulte, appelle le <b>3114</b> (24 h/24), le <b>119</b> ou le <b>112</b>.</div>`;
    } else if (e === 2) {
      h += `<div class="card"><h2>Qu'est-ce que ton corps te dit ?</h2><p class="muted small">Coche ce que tu remarques. Ton corps prévient souvent avant ta tête.</p>
        <div class="chips" data-groupe="pc-corps">${D.corps.map((c) => `<button class="chip" data-act="toggle" data-val="${esc(c)}" aria-pressed="${pc.corps.includes(c)}">${esc(c)}</button>`).join('')}</div></div>`;
    } else if (e === 3) {
      const map = { respiration: ['🫧 Respirer avec la bulle', 'respiration'], ecrire: ['✍️ Écrire ce que je ressens', 'ecrire'], bouger: ['🚶 Bouger pour décharger', 'bouger'], repos: ['🌙 Me reposer', 'repos'], pensee: ['💭 Regarder mes pensées', 'pensee'], ancrage: ['🖐️ Revenir ici (5-4-3-2-1)', 'ancrage'], vider: ['🧠 Vider ma tête', 'vider'], aide: ['🤝 Qui peut m\'aider', 'aide'] };
      const m = map[p.outil];
      h += `<div class="card"><h2>On essaie quelque chose</h2><p class="muted small">Un outil court. Tu regardes ensuite si ça t'a aidé{e|}.</p>
        <button class="btn primaire plein" data-act="outil" data-arg="${m[1]}">${m[0]}</button>
        <details class="fold" style="margin-top:10px"><summary>Autre chose</summary><div class="fold-body"><div class="row">
        ${Object.values(map).filter((x) => x[1] !== m[1] && x[1] !== 'aide' && x[1] !== 'pensee').map((x) => `<button class="btn" data-act="outil" data-arg="${x[1]}">${x[0]}</button>`).join('')}</div></div></details></div>`;
    } else if (e === 4) {
      h += `<div class="card"><h2>${p.besoin}</h2><div class="chips" data-groupe="pc-besoins">${D.besoinsEmo.map((b) => `<button class="chip" data-act="toggle" data-val="${esc(b)}" aria-pressed="${pc.besoins.includes(b)}">${C.acc(b)}</button>`).join('')}</div>
        <div class="bulle sobre small" style="margin-top:12px">💡 ${p.apres}</div></div>`;
    } else {
      h += `<div class="card"><h2>Et maintenant ?</h2><label class="lbl" for="pc-int2">Ça monte à combien ? <b id="pc-iv2">${pc.apres == null ? pc.avant : pc.apres}</b>/10 <span class="muted small">(avant : ${pc.avant})</span></label>
        <input id="pc-int2" type="range" min="0" max="10" value="${pc.apres == null ? pc.avant : pc.apres}" data-input="pcInt2">
        <label class="lbl" for="pc-aide">Ce qui m'a aidé{e|} (facultatif)</label><input id="pc-aide" type="text" placeholder="Ex. : la respiration, écrire…">
        <label class="switch"><span>💡 Proposer ça à mon mode d'emploi</span><input id="pc-garder" type="checkbox"></label></div>`;
    }
    h += `<div class="row" style="margin-top:12px;justify-content:space-between">${e > 1 ? '<button class="btn" data-act="pcNav" data-arg="-1">←</button>' : '<span></span>'}
      ${e < 5 ? '<button class="btn primaire" data-act="pcNav" data-arg="1">Suivant →</button>' : '<button class="btn sauge" data-act="pcFin">Terminer ✓</button>'}</div>`;
    return h;
  }
  function zone(v) { return v <= 3 ? '🟢 Zone verte : je suis disponible.' : v <= 5 ? '🟡 Zone jaune : je commence à monter.' : v <= 7 ? '🟠 Zone orange : je fais une pause avant de continuer.' : '🔴 Zone rouge : d\'abord redescendre. On ne règle rien maintenant.'; }
  C.onInput('pcInt', (el) => { pc.avant = +el.value; C.$('#pc-iv').textContent = el.value; C.$('#pc-zone').textContent = zone(+el.value); });
  C.onInput('pcInt2', (el) => { pc.apres = +el.value; C.$('#pc-iv2').textContent = el.value; });
  function pcCapture() {
    if (pc.etape === 2) pc.corps = C.$$('[data-groupe="pc-corps"] [aria-pressed="true"]').map((b) => b.dataset.val);
    if (pc.etape === 4) pc.besoins = C.$$('[data-groupe="pc-besoins"] [aria-pressed="true"]').map((b) => b.dataset.val);
  }
  C.act('pcNav', (el, d) => { pcCapture(); pc.etape = Math.max(1, Math.min(5, pc.etape + +d)); C.render(); });
  C.act('pcFin', () => {
    const p = D.parcours[pc.id], aide = C.$('#pc-aide').value.trim();
    if (pc.apres == null) pc.apres = pc.avant;
    C.state.emotions.push({ id: C.uid(), at: Date.now(), parcours: pc.id, emotion: p.titre, avant: pc.avant, apres: pc.apres, corps: pc.corps, besoins: pc.besoins, aide });
    if (C.$('#pc-garder').checked && aide) C.proposer('Quand « ' + C.acc(p.titre).toLowerCase() + ' », ce qui m\'aide : ' + aide, 'Je prends soin de moi', 'meteo');
    C.save();
    const baisse = pc.avant - pc.apres;
    pc = null;
    C.go('soin');
    C.toast(baisse > 0 ? '🌤️ Ça a baissé de ' + baisse + '. Bien joué d\'avoir pris soin de toi.' : 'Merci d\'avoir pris ce temps pour toi 🌿');
  });

  /* ======================= THERMOMÈTRE & ROUE ======================= */
  let th = { famille: null, mots: [], v: 3 };
  function ecranThermo() {
    return `${ui.crumb('soin', 'Je prends soin de moi')}<h1>🌡️ Thermomètre & roue des émotions</h1>
      <div class="card"><label class="lbl" for="th-v">Mon intensité : <b id="th-vv">${th.v}</b>/10</label><input id="th-v" type="range" min="0" max="10" value="${th.v}" data-input="thV"><p class="muted small" id="th-z">${zone(th.v)}</p></div>
      <div class="card"><h2>Ma famille d'émotions</h2><div class="grid two">${D.roue.map((f) => `<button class="chip" data-act="thFam" data-arg="${f.id}" aria-pressed="${th.famille === f.id}" style="justify-content:flex-start">${f.ico} ${f.nom}</button>`).join('')}</div>
      ${th.famille ? (() => { const f = D.roue.find((x) => x.id === th.famille); return `<h2 style="margin-top:14px">Plus précisément, je me sens…</h2><div class="chips">${f.mots.map((m) => `<button class="chip" data-act="thMot" data-arg="${esc(m)}" aria-pressed="${th.mots.includes(m)}">${C.acc(m)}</button>`).join('')}</div>`; })() : ''}</div>
      ${ui.fold('🔄 Derrière « je suis énervé{e|} », il peut y avoir…', '<ul class="liste"><li>« Je m\'en fiche » → je suis peut-être blessé{e|}</li><li>« Laisse-moi » → je suis peut-être saturé{e|}</li><li>« C\'est bon ! » → je veux que la pression s\'arrête</li><li>« Tu me saoules » → je ne sais plus comment répondre</li></ul>')}
      <label class="lbl" for="th-note">Ce qui s'est passé juste avant (facultatif)</label><input id="th-note" type="text">
      <button class="btn primaire plein" style="margin-top:12px" data-act="thOk">Noter dans mon radar</button>`;
  }
  C.onInput('thV', (el) => { th.v = +el.value; C.$('#th-vv').textContent = el.value; C.$('#th-z').textContent = zone(+el.value); });
  C.act('thFam', (el, f) => { th.famille = f; th.mots = []; C.rerender(); });
  C.act('thMot', (el, m) => { th.mots = th.mots.includes(m) ? th.mots.filter((x) => x !== m) : th.mots.concat(m); el.setAttribute('aria-pressed', th.mots.includes(m)); });
  C.act('thOk', () => {
    if (!th.famille) { C.toast('Choisis une famille d\'émotions'); return; }
    const f = D.roue.find((x) => x.id === th.famille);
    C.state.emotions.push({ id: C.uid(), at: Date.now(), emotion: f.nom, famille: f.id, mots: th.mots.map(C.acc), avant: th.v, declencheur: C.$('#th-note').value.trim() });
    C.save(); th = { famille: null, mots: [], v: 3 };
    C.toast('📡 Noté dans ton radar');
    C.go(+C.state.emotions[C.state.emotions.length - 1].avant >= 6 ? 'soin/parcours/' + ({ peur: 'stresse', tristesse: 'triste', colere: 'colere', fatigue: 'epuise' }[f.id] || 'stresse') : 'soin/radar');
  });

  /* ======================= RADAR ======================= */
  function ecranRadar() {
    const l = C.state.emotions.slice().reverse();
    const compte = {}, decl = {}, aides = {};
    l.forEach((e) => { compte[e.emotion] = (compte[e.emotion] || 0) + 1; if (e.declencheur) decl[e.declencheur] = (decl[e.declencheur] || 0) + 1; if (e.aide && e.apres < e.avant) aides[e.aide] = (aides[e.aide] || 0) + 1; });
    const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return `${ui.crumb('soin', 'Je prends soin de moi')}<h1>📡 Mon radar émotionnel</h1>
      ${l.length < 3 ? '<p class="muted">Après quelques notes, ton radar te montrera ce qui revient souvent et ce qui t\'aide.</p>' : ''}
      ${l.length ? `<div class="card"><h2>Ce qui revient</h2>${top(compte).map(([k, v]) => `<p>${C.acc(esc(k))} <span class="badge">${v}×</span></p>`).join('')}
        ${Object.keys(aides).length ? `<h2>Ce qui m'a aidé{e|} (l'intensité a baissé)</h2>${top(aides).map(([k, v]) => `<p>🌿 ${esc(k)} <span class="badge sauge">${v}×</span></p>`).join('')}<button class="btn" data-act="radarProposer">💡 Proposer à mon mode d'emploi</button>` : ''}
        ${Object.keys(decl).length ? `<h2 style="margin-top:10px">Ce qui s'est passé avant</h2>${top(decl).map(([k]) => `<p>⚡ ${esc(k)}</p>`).join('')}` : ''}</div>
        ${ui.fold('🗂️ Mon historique', `<ul class="liste">${l.slice(0, 40).map((e) => `<li><span>${e.apres != null && e.apres < e.avant ? '🌤️' : '•'}</span><span class="grow"><b>${C.acc(esc(e.emotion))}</b> ${e.mots && e.mots.length ? '(' + e.mots.map(esc).join(', ') + ')' : ''} · ${e.avant}/10${e.apres != null ? ' → ' + e.apres + '/10' : ''}<br><span class="muted small">${C.fmtDate(e.at)} ${C.fmtHeure(e.at)}${e.aide ? ' · aidé par : ' + esc(e.aide) : ''}</span></span></li>`).join('')}</ul>`)}` : ui.vide('Rien encore. Utilise le thermomètre ou un parcours « Je suis… ».')}`;
  }
  C.act('radarProposer', () => {
    let n = 0;
    C.state.emotions.filter((e) => e.aide && e.apres < e.avant).forEach((e) => { if (C.proposer('Quand ça monte, ce qui m\'aide : ' + e.aide, 'Radar émotionnel', 'meteo')) n++; });
    C.toast(n ? '💡 ' + n + ' découverte(s) proposée(s)' : 'Déjà proposé');
  });

  /* ======================= RÉUSSITES ======================= */
  function ecranReussites() {
    const l = C.state.reussites.slice().reverse();
    return `${ui.crumb('soin', 'Je prends soin de moi')}<h1>🌱 Mon carnet des réussites</h1>
      <p class="muted">Les petites victoires comptent. Ton cerveau a tendance à oublier ce qui marche : ici, on le garde.</p>
      <div class="card"><label class="lbl" for="re-t">Aujourd'hui, j'ai réussi…</label><input id="re-t" type="text" placeholder="Ex. : j'ai osé poser une question en classe">
      <div class="row" style="margin-top:8px"><button class="btn primaire" data-act="reAjout">Ajouter</button>${ui.ecouter('re-t')}${l.length > 2 ? '<button class="btn" data-act="reHasard">🎲 Relire une réussite</button>' : ''}</div></div>
      <div class="card" style="margin-top:12px">${l.length ? `<ul class="liste">${l.slice(0, 60).map((r) => `<li><span>${r.auto ? '✨' : '🌱'}</span><span class="grow">${esc(r.text)}<br><span class="muted small">${C.fmtDate(r.at)}</span></span></li>`).join('')}</ul>` : ui.vide('Ton premier pas peut être tout petit : « J\'ai ouvert Coachy » compte !')}</div>`;
  }
  C.act('reAjout', () => { const t = C.$('#re-t').value.trim(); if (!t) return; C.state.reussites.push({ id: C.uid(), at: Date.now(), text: t }); C.save(); C.toast('🌱 Bravo !'); C.rerender(); });
  C.act('reHasard', () => { const r = C.pick(C.state.reussites); C.dialog('🌱 Souviens-toi', `<div class="bulle" style="font-size:1.15rem">${esc(r.text)}</div><p class="muted small">${C.fmtDate(r.at)}</p><p>Tu l'as fait. Tu peux le refaire.</p>`); });

  /* ======================= PENSÉES PIÈGES (TCC) ======================= */
  function ecranPensees() {
    return `${ui.crumb('soin', 'Je prends soin de moi')}<h1>💭 Mes pensées pièges</h1>
      <p class="muted">Une pensée n'est pas un fait. Parfois notre cerveau nous raconte des histoires plus dures que la réalité. On peut les repérer et les nuancer.</p>
      ${D.pensees.map((p) => ui.fold(`💭 « ${C.acc(esc(p.auto))} »`, `<p><span class="badge lavande">Piège : ${esc(p.piege)}</span></p><div class="bulle sobre">🌿 ${C.acc(esc(p.autre))}</div>`)).join('')}
      <div class="card" style="margin-top:12px"><h2>À mon tour</h2>
        <label class="lbl" for="pe-a">La pensée qui me pèse</label><input id="pe-a" type="text">
        <label class="lbl" for="pe-p">Le piège ressemble à…</label><select id="pe-p"><option value="">Je ne sais pas</option>${[...new Set(D.pensees.map((p) => p.piege))].map((x) => `<option>${x}</option>`).join('')}</select>
        <label class="lbl" for="pe-q">Des preuves POUR et CONTRE cette pensée ?</label><textarea id="pe-q" rows="2"></textarea>
        <label class="lbl" for="pe-n">Une pensée plus juste et plus douce</label><input id="pe-n" type="text" placeholder="Ex. : Je n'y arrive pas encore, mais j'ai déjà progressé.">
        <button class="btn primaire" style="margin-top:10px" data-act="peOk">Garder ma nouvelle pensée</button></div>`;
  }
  C.act('peOk', () => {
    const a = C.$('#pe-a').value.trim(), n = C.$('#pe-n').value.trim();
    if (!n) { C.toast('Écris ta pensée plus juste'); return; }
    C.state.pensees = (C.state.pensees || []).concat({ at: Date.now(), auto: a, nouvelle: n, piege: C.$('#pe-p').value });
    C.proposer('Une phrase qui m\'aide : « ' + n + ' »', 'Pensées pièges', 'ressources');
    C.save(); C.toast('🌿 Gardée. Proposée aussi à ton mode d\'emploi.'); C.rerender();
  });

  /* ======================= EXAMENS ======================= */
  function ecranExamen() {
    const inv = C.state.reglages.spirituel ? (C.data.invocations.find((x) => x.id === 'charh') || null) : null;
    return `${ui.crumb('soin', 'Je prends soin de moi')}<h1>📝 Le stress des examens</h1>
      <p class="muted">Un peu de stress aide à se concentrer. Trop de stress bloque la mémoire. On apprend à le régler.</p>
      ${ui.fold('🌙 La veille', '<ul><li>Une réactivation courte de tes cartes (pas toute la nuit !).</li><li>Prépare ton sac : convocation, pièce d\'identité, stylos, calculatrice, eau.</li><li>Écran posé tôt, dodo : le sommeil range ce que tu as appris.</li></ul><a class="btn" href="#/memoire/reviser">🧠 Réactiver mes cartes</a>', true)}
      ${ui.fold('🌅 Le matin', '<ul><li>Petit-déjeuner, même léger.</li><li>Pars avec de la marge.</li><li>Évite les révisions de dernière minute avec les autres si ça te stresse.</li></ul>')}
      ${ui.fold('⏱️ Juste avant', '<ul><li>3 respirations lentes (souffle plus long que l\'inspiration).</li><li>Pose les pieds bien à plat, sens le sol.</li><li>Ta phrase : « Je fais de mon mieux, une question à la fois. »</li></ul><button class="btn" data-act="outil" data-arg="respiration">🫧 Respirer</button>')}
      ${ui.fold('😶 Pendant : si j\'ai un blanc', '<ol><li>Pose le stylo. Une respiration lente.</li><li>Passe à une question que tu sais faire : ça relance la mémoire.</li><li>Relis la consigne, souligne le mot-action.</li><li>Écris ce que tu sais, même un morceau : ça rapporte des points.</li><li>Garde 5 minutes pour relire.</li></ol>')}
      ${ui.fold('🌈 Après', '<ul><li>Fais quelque chose qui te fait du bien.</li><li>Évite de refaire tout le sujet avec les autres si ça t\'inquiète.</li><li>Note une réussite : tu y es allé{e|}.</li></ul><a class="btn" href="#/soin/reussites">🌱 Noter une réussite</a>')}
      ${inv ? `<div class="card lavande" style="margin-top:12px"><b>🌸 Mon jardin intérieur</b><p class="ar">${inv.ar}</p><p><i>${esc(inv.ph)}</i></p><p>${esc(inv.fr)}</p><p class="small muted">${esc(inv.ref)}</p></div>` : ''}`;
  }

  /* ======================= CONFIANCE ======================= */
  function ecranConfiance() {
    const p = C.state.profil, ap = D.appuis.filter((a) => p.appuis.includes(a.id));
    C.state.confiance = C.state.confiance || { avant: '', maintenant: '' };
    return `${ui.crumb('soin', 'Je prends soin de moi')}<h1>💎 Confiance en moi</h1>
      <div class="card sauge"><h2>Mes points d'appui</h2>${ap.length ? ap.map((a) => `<p>${a.ico} ${esc(a.label)}</p>`).join('') : '<p class="muted">Ajoute-les dans ton profil (Réglages).</p>'}</div>
      <div class="card"><h2>Avant / maintenant</h2><p class="muted small">Ce que je ne savais pas faire avant, et que je sais faire maintenant.</p>
      <label class="lbl" for="cf-a">Avant, je ne savais pas…</label><input id="cf-a" type="text" value="${esc(C.state.confiance.avant)}" data-input="cfA">
      <label class="lbl" for="cf-m">Maintenant, je sais…</label><input id="cf-m" type="text" value="${esc(C.state.confiance.maintenant)}" data-input="cfM"></div>
      <div class="card lavande"><h2>Si {ma meilleure amie|mon meilleur ami} vivait ce que je vis…</h2><p>…qu'est-ce que je lui dirais ? Écris-le, puis relis-le pour toi.</p><textarea id="cf-ami" rows="3" data-input="cfAmi">${esc(C.state.confiance.ami || '')}</textarea></div>
      <a class="btn plein" href="#/soin/reussites" style="margin-top:12px">🌱 Relire mon carnet des réussites</a>`;
  }
  C.onInput('cfA', (el) => { C.state.confiance.avant = el.value; C.save(); });
  C.onInput('cfM', (el) => { C.state.confiance.maintenant = el.value; C.save(); });
  C.onInput('cfAmi', (el) => { C.state.confiance.ami = el.value; C.save(); });
})();
