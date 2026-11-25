/* Coachy 2.0 — Mon mode d'emploi de moi-même.
   Carnet de connaissance de soi en 10 chapitres, carte d'identité cognitive,
   passeport cognitif imprimable.
   Connexion bidirectionnelle avec Coachy :
   - Coachy → Mode d'emploi : les découvertes sont PROPOSÉES, l'ado valide,
     modifie ou écarte. Rien n'entre sans son accord.
   - Mode d'emploi → Coachy : phrase de secours, plan SI/ALORS et stratégies
     remontent dans les boutons d'aide. Le profil reste modifiable : il décrit
     un fonctionnement, il n'enferme pas dans un diagnostic. */
(function () {
  'use strict';
  const D = C.data, ui = C.ui, esc = C.esc;
  const me = () => C.state.modeEmploi;
  const rep = (ch, q) => ((me()[ch] || {})[q]);
  function rempli(v) { return Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim()); }
  function avancement(ch) { const c = D.chapitres.find((x) => x.id === ch); return c.q.filter((q) => rempli(rep(ch, q.id))).length + '/' + c.q.length; }
  function decouvertes(ch) { return C.state.decouvertes.filter((d) => d.statut === 'validee' && (!ch || d.chapitre === ch)); }

  /* Rappel pour les boutons d'aide (Mode d'emploi → Coachy) */
  C.rappelModeEmploi = function () {
    const r = me().ressources || {}, bits = [];
    if (r.plan) bits.push('🎯 Mon plan : ' + esc(r.plan));
    if (r.phrase) bits.push('🆘 Ma phrase de secours : « ' + esc(r.phrase) + ' »');
    const strat = decouvertes('action').slice(-2).map((d) => esc(d.text));
    if (strat.length) bits.push('🌿 Ce qui marche pour moi : ' + strat.join(' · '));
    return bits.length ? `<div class="bulle sobre small">🪞 <b>Mon mode d'emploi me rappelle :</b><br>${bits.join('<br>')}</div>` : '';
  };

  C.screen('modemploi', function (args) {
    if (args[0] === 'ch') return ecranChapitre(args[1]);
    if (args[0] === 'decouvertes') return ecranDecouvertes();
    if (args[0] === 'carte') return ecranCarte();
    if (args[0] === 'passeport') return ecranPasseport();
    const prop = C.state.decouvertes.filter((d) => d.statut === 'proposee').length;
    return `<h1>🪞 Mon mode d'emploi de moi-même</h1>
      <p class="muted">Ce carnet décrit comment je fonctionne et ce qui m'aide. Il évolue avec moi. Ce n'est pas un diagnostic, et je peux tout changer quand je veux.</p>
      ${prop ? `<a class="card lavande" style="display:block;text-decoration:none;color:inherit" href="#/modemploi/decouvertes">💡 <b>${prop} découverte(s)</b> proposée(s) par Coachy : je valide ? →</a>` : ''}
      <div class="grid two" style="margin-top:12px">
        ${ui.tile('modemploi/carte', '🪪', 'Ma carte d\'identité cognitive', 'Mon fonctionnement en un coup d\'œil', 'bleu')}
        ${ui.tile('modemploi/passeport', '📇', 'Mon passeport cognitif', 'À montrer si je le souhaite', 'sauge')}
      </div>
      <h2 style="margin-top:16px">Mes 10 chapitres</h2>
      <ul class="liste card">${D.chapitres.map((c, i) => `<li><span style="font-size:1.4rem">${c.ico}</span><span class="grow"><a href="#/modemploi/ch/${c.id}"><b>${i + 1}. ${c.titre}</b></a><br><span class="muted small">${C.acc(c.intro)}</span></span><span class="badge">${avancement(c.id)}</span></li>`).join('')}</ul>
      ${ui.fold('📜 Mes découvertes validées', decouvertes().length ? `<ul class="liste">${decouvertes().map((d) => `<li><span>💡</span><span class="grow">${esc(d.text)}<br><span class="muted small">${esc(d.source)} · ${C.fmtDate(d.at)}</span></span></li>`).join('')}</ul>` : ui.vide('Pas encore. Elles viennent de tes rounds, de tes parcours émotions et de Mon prof autrement.'))}
      <p class="small muted" style="margin-top:12px">La version « quand ça monte » (radar de crise, phrases de remplacement) reste dans <a href="../moi-et-coachy/">Moi &amp; Coachy V1</a>.</p>`;
  });

  function ecranChapitre(id) {
    const i = D.chapitres.findIndex((c) => c.id === id), c = D.chapitres[i];
    if (!c) return ui.vide('Chapitre introuvable.');
    const dec = decouvertes(id);
    const champs = c.q.map((q) => {
      const v = rep(id, q.id);
      if (q.type === 'choix') {
        const sel = Array.isArray(v) ? v : [];
        return `<div class="card"><h3>${C.acc(esc(q.label))}</h3><div class="chips">${q.options.map((o) => `<button class="chip" data-act="meChoix" data-arg="${id}|${q.id}|${esc(o)}" aria-pressed="${sel.includes(o)}">${C.acc(esc(o))}</button>`).join('')}</div>
          <input type="text" style="margin-top:8px" placeholder="Autre chose…" data-input="meAutre" data-arg="${id}|${q.id}" value="${esc((me()[id] || {})[q.id + '_autre'] || '')}"></div>`;
      }
      return `<div class="card"><label class="lbl" for="me-${q.id}">${C.acc(esc(q.label))}</label><textarea id="me-${q.id}" rows="3" data-input="meTexte" data-arg="${id}|${q.id}">${esc(v || '')}</textarea><div class="row" style="margin-top:6px">${ui.ecouter('me-' + q.id)}</div></div>`;
    }).join('');
    return `${ui.crumb('modemploi', 'Mon mode d\'emploi')}
      <p class="muted small">Chapitre ${i + 1} sur 10</p><h1>${c.ico} ${c.titre}</h1><p class="muted">${C.acc(c.intro)}</p>
      ${dec.length ? `<div class="card lavande"><b>💡 Ce que j'ai découvert avec Coachy</b><ul class="liste">${dec.map((d) => `<li><span class="grow">${esc(d.text)}</span></li>`).join('')}</ul></div>` : ''}
      ${champs}
      <p class="muted small center">💾 Enregistré automatiquement sur ton appareil.</p>
      <div class="row" style="justify-content:space-between;margin-top:10px">
        ${i > 0 ? `<a class="btn" href="#/modemploi/ch/${D.chapitres[i - 1].id}">← ${D.chapitres[i - 1].titre}</a>` : '<span></span>'}
        ${i < 9 ? `<a class="btn primaire" href="#/modemploi/ch/${D.chapitres[i + 1].id}">${D.chapitres[i + 1].titre} →</a>` : '<a class="btn sauge" href="#/modemploi/passeport">Mon passeport →</a>'}
      </div>`;
  }
  function setRep(ch, q, v) { me()[ch] = me()[ch] || {}; me()[ch][q] = v; C.save(); }
  C.onInput('meTexte', (el) => { const [ch, q] = el.dataset.arg.split('|'); setRep(ch, q, el.value); });
  C.onInput('meAutre', (el) => { const [ch, q] = el.dataset.arg.split('|'); setRep(ch, q + '_autre', el.value); });
  C.act('meChoix', (el, a) => {
    const [ch, q, o] = a.split('|');
    const cur = Array.isArray(rep(ch, q)) ? rep(ch, q) : [];
    const nv = cur.includes(o) ? cur.filter((x) => x !== o) : cur.concat(o);
    setRep(ch, q, nv); el.setAttribute('aria-pressed', nv.includes(o));
  });

  /* ---------- découvertes : valider / modifier / écarter ---------- */
  function ecranDecouvertes() {
    const l = C.state.decouvertes.filter((d) => d.statut === 'proposee');
    const opts = (sel) => D.chapitres.map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.ico} ${c.titre}</option>`).join('');
    return `${ui.crumb('modemploi', 'Mon mode d\'emploi')}<h1>💡 Mes découvertes</h1>
      <p class="muted">Coachy a remarqué des choses pendant que tu travaillais. C'est <b>toi</b> qui décides si c'est vrai pour toi. Ce sont des pistes, pas des vérités gravées.</p>
      ${l.length ? l.map((d) => `<div class="card">
        <label class="lbl" for="dc-${d.id}">Découverte <span class="muted small">(${esc(d.source)} · ${C.fmtDate(d.at)})</span></label>
        <textarea id="dc-${d.id}" rows="2">${esc(d.text)}</textarea>
        <label class="lbl" for="dch-${d.id}">Dans quel chapitre ?</label><select id="dch-${d.id}">${opts(d.chapitre || 'action')}</select>
        <div class="row" style="margin-top:10px"><button class="btn sauge" data-act="decValider" data-arg="${d.id}">✅ C'est vrai pour moi</button><button class="btn" data-act="decEcarter" data-arg="${d.id}">Pas vraiment</button></div></div>`).join('') : ui.vide('Aucune découverte en attente.')}`;
  }
  C.act('decValider', (el, id) => {
    const d = C.state.decouvertes.find((x) => x.id === id);
    d.text = C.$('#dc-' + id).value.trim() || d.text; d.chapitre = C.$('#dch-' + id).value; d.statut = 'validee'; d.valideLe = Date.now();
    C.save(); C.toast('🪞 Ajouté à ton mode d\'emploi'); C.rerender();
  });
  C.act('decEcarter', (el, id) => { const d = C.state.decouvertes.find((x) => x.id === id); d.statut = 'ecartee'; C.save(); C.rerender(); });

  /* ---------- carte d'identité cognitive ---------- */
  function liste(ch, q) { const v = rep(ch, q), a = (me()[ch] || {})[q + '_autre']; return (Array.isArray(v) ? v : v ? [v] : []).concat(a ? [a] : []); }
  function bloc(ico, titre, items, couleur) {
    items = items.filter(Boolean);
    return `<div class="card ${couleur || ''}"><b>${ico} ${titre}</b>${items.length ? `<ul style="margin:6px 0 0;padding-left:20px">${items.map((x) => `<li>${C.acc(esc(x))}</li>`).join('')}</ul>` : '<p class="muted small" style="margin:4px 0 0">À compléter</p>'}</div>`;
  }
  function donneesCarte() {
    const p = C.state.profil;
    return {
      forces: liste('ressources', 'forces').concat(D.appuis.filter((a) => p.appuis.includes(a.id)).map((a) => a.label)),
      comprends: liste('cognitif', 'canal'),
      coute: liste('cognitif', 'difficile').concat(D.besoins.filter((b) => p.besoins.includes(b.id)).map((b) => b.label)),
      aide: [rep('ressources', 'aides')].concat(decouvertes('action').map((d) => d.text), decouvertes('ressources').map((d) => d.text)),
      sensoriel: liste('action', 'sensoriel'),
      fatigue: liste('action', 'fatigue'),
      declencheurs: liste('meteo', 'declencheurs'),
      apaise: [rep('meteo', 'apaise')].concat(decouvertes('meteo').map((d) => d.text)),
      moment: liste('cognitif', 'moment'),
      phrase: rep('ressources', 'phrase'),
      objectifs: D.objectifs.filter((o) => p.objectifs.includes(o.id)).map((o) => o.label).concat([rep('avenir', 'annee')]),
    };
  }
  function ecranCarte() {
    const d = donneesCarte(), p = C.state.profil;
    return `${ui.crumb('modemploi', 'Mon mode d\'emploi')}<h1>🪪 Ma carte d'identité cognitive</h1>
      <p class="muted small">Construite à partir de ton profil et de ton mode d'emploi. Pour la modifier, change tes réponses dans les chapitres.</p>
      <div class="card bleu center"><b style="font-size:1.2rem">${esc(p.prenom || 'Moi')}</b>${p.classe ? ' · ' + esc(p.classe) : ''}</div>
      <div class="grid two-lg" style="display:grid;gap:10px;margin-top:10px">
        ${bloc('💎', 'Mes forces', d.forces, 'sauge')}
        ${bloc('💡', 'Je comprends mieux quand…', d.comprends, 'bleu')}
        ${bloc('🔋', 'Ce qui me demande beaucoup d\'énergie', d.coute, 'sable')}
        ${bloc('🌿', 'Ce qui m\'aide', d.aide, 'sauge')}
        ${bloc('🎧', 'Mes besoins sensoriels', d.sensoriel, 'lavande')}
        ${bloc('⚡', 'Ce qui me fait monter', d.declencheurs, 'sable')}
      </div>
      ${d.phrase ? `<div class="bulle">🆘 Ma phrase de secours : « ${esc(d.phrase)} »</div>` : ''}`;
  }

  /* ---------- passeport cognitif (je choisis ce que j'y mets) ---------- */
  const SECTIONS = [['forces', '💎 Mes forces'], ['comprends', '💡 Je comprends mieux quand…'], ['aide', '🌿 Ce qui m\'aide à travailler'], ['coute', '🔋 Ce qui me demande beaucoup d\'énergie'], ['sensoriel', '🎧 Mes besoins sensoriels'], ['fatigue', '😮‍💨 Ce qui me fatigue'], ['declencheurs', '⚡ Ce qui peut me faire monter'], ['apaise', '🫧 Ce qui m\'apaise'], ['moment', '⏰ Mon meilleur moment pour travailler'], ['objectifs', '🎯 Mes objectifs']];
  function ecranPasseport() {
    const st = (C.state.passeport = C.state.passeport || { sections: ['forces', 'comprends', 'aide', 'coute', 'sensoriel', 'objectifs'], phrase: true, message: '' });
    const d = donneesCarte(), p = C.state.profil;
    return `${ui.crumb('modemploi', 'Mon mode d\'emploi')}<h1>📇 Mon passeport cognitif</h1>
      <p class="muted">Un document court à montrer à un prof, un tuteur de stage ou un adulte — <b>seulement si tu le souhaites</b>. Tu choisis ce que tu y mets.</p>
      ${ui.fold('✅ Ce que je partage', SECTIONS.map(([k, l]) => `<label class="switch"><span>${C.acc(l)}</span><input type="checkbox" data-change="ppSection" data-arg="${k}" ${st.sections.includes(k) ? 'checked' : ''}></label>`).join('') +
        `<label class="switch"><span>🆘 Ma phrase de secours</span><input type="checkbox" data-change="ppPhrase" ${st.phrase ? 'checked' : ''}></label>
         <label class="lbl" for="pp-msg">Un message de ma part (facultatif)</label><textarea id="pp-msg" rows="2" data-input="ppMsg" placeholder="Ex. : Je suis motivée. Si je ne réponds pas tout de suite, je réfléchis : laissez-moi un peu de temps.">${esc(st.message)}</textarea>`)}
      <div class="card" id="passeport" style="margin-top:12px">
        <div class="row" style="justify-content:space-between"><div><b style="font-size:1.25rem">📇 Passeport cognitif</b><br><span class="muted small">${esc(p.prenom || '')}${p.classe ? ' · ' + esc(p.classe) : ''} · ${new Date().toLocaleDateString('fr-FR')}</span></div><span class="badge">Educa-Typique</span></div>
        <hr class="sep">
        ${SECTIONS.filter(([k]) => st.sections.includes(k)).map(([k, l]) => { const it = (d[k] || []).filter(Boolean); return it.length ? `<p style="margin:10px 0 2px"><b>${C.acc(l)}</b></p><ul style="margin:0;padding-left:20px">${it.map((x) => `<li>${C.acc(esc(x))}</li>`).join('')}</ul>` : ''; }).join('')}
        ${st.phrase && d.phrase ? `<p style="margin-top:10px"><b>🆘 Ma phrase de secours :</b> « ${esc(d.phrase)} »</p>` : ''}
        ${st.message ? `<div class="bulle">${esc(st.message)}</div>` : ''}
        <p class="small muted" style="margin-top:12px">Ce passeport décrit un fonctionnement et des stratégies utiles. Ce n'est pas un diagnostic. Il a été rempli par l'élève et peut évoluer.</p>
      </div>
      <div class="row" style="margin-top:12px"><button class="btn primaire" data-act="imprimer">🖨️ Imprimer / enregistrer en PDF</button><button class="btn" data-act="ppTexte">📄 Exporter en texte</button></div>`;
  }
  C.onInput('ppSection', (el) => { const s = C.state.passeport, k = el.dataset.arg; s.sections = el.checked ? s.sections.concat(k) : s.sections.filter((x) => x !== k); C.save(); C.rerender(); });
  C.onInput('ppPhrase', (el) => { C.state.passeport.phrase = el.checked; C.save(); C.rerender(); });
  C.onInput('ppMsg', (el) => { C.state.passeport.message = el.value; C.save(); });
  C.act('ppTexte', () => { C.telecharger('passeport-cognitif.txt', C.$('#passeport').innerText); });
})();
