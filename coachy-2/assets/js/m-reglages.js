/* Coachy 2.0 — Réglages, sauvegarde, partage avec un adulte.
   Partage = l'ado choisit ce qu'elle/il montre, au moment où elle/il le
   décide (impression / PDF / fichier). Rien n'est envoyé automatiquement :
   pas de surveillance. Un espace accompagnant en ligne, multiprofils, avec
   comptes et permissions, demande un serveur : prévu pour la V3. */
(function () {
  'use strict';
  const D = C.data, ui = C.ui, esc = C.esc;

  C.screen('reglages', function () {
    const r = C.state.reglages, p = C.state.profil;
    const sw = (k, label, aide) => `<label class="switch"><span>${label}${aide ? `<br><span class="muted small">${aide}</span>` : ''}</span><input type="checkbox" data-change="regSwitch" data-arg="${k}" ${r[k] ? 'checked' : ''}></label>`;
    return `<h1>⚙️ Réglages</h1>
      <div class="card"><h2>👤 Mon profil</h2>
        <p>${p.prenom ? '<b>' + esc(p.prenom) + '</b>' : '<span class="muted">Sans prénom</span>'}${p.classe ? ' · ' + esc(p.classe) : ''}</p>
        <p class="small muted">${p.besoins.length} besoin(s) · ${p.appuis.length} point(s) d'appui · objectifs : ${p.objectifs.join(', ') || '—'}</p>
        <button class="btn" data-act="regProfil">✏️ Modifier mon profil</button></div>
      <div class="card"><h2>👀 Confort</h2>
        <label class="lbl" for="rg-t">Taille du texte : <b id="rg-tv">${r.taille}</b> px</label><input id="rg-t" type="range" min="15" max="24" value="${r.taille}" data-input="regTaille">
        ${sw('dys', 'Texte plus espacé', 'Lettres et lignes plus aérées')}
        ${sw('contraste', 'Contrastes renforcés')}
        ${sw('calme', 'Couper les animations')}
        ${sw('focus', 'Mode concentration', 'Cache la barre du bas pour moins de distractions')}
        ${sw('audio', 'Proposer la lecture audio', 'Boutons 🔊 dans les exercices et les jeux')}
        <label class="lbl" for="rg-v">Vitesse de la voix</label><input id="rg-v" type="range" min="0.6" max="1.3" step="0.05" value="${r.voixVitesse}" data-input="regVoix">
        <button class="btn" data-act="regTestVoix">🔊 Tester la voix</button>
        ${C.peutLire() ? '' : '<p class="small muted">La lecture audio n\'est pas disponible sur ce navigateur.</p>'}</div>
      <div class="card"><h2>🌸 Mon jardin intérieur</h2>${sw('spirituel', 'Ressources spirituelles (islam)', 'Invocations, dhikr, Noms d\'Allah. Désactivé = version universelle.')}</div>
      <div class="card"><h2>✨ Intelligence artificielle</h2>
        <p class="small">Par défaut, Coachy fonctionne <b>sans IA</b> (mode démonstration) : méthodes, décodeur de consignes, indices de méthode, cartes mémoire, lecture audio. Il ne lit pas et ne comprend pas le contenu de tes cours.</p>
        <p class="small">Le <b>mode IA</b> explique tes cours, donne des indices adaptés à ton exercice et lit le texte des photos. Il passe par le serveur d'Educa-Typique (la clé n'est jamais dans l'appli). Seuls le texte du cours et ton profil fonctionnel (sans prénom) sont envoyés. Il faut un code d'accès donné par Nawel.</p>
        ${!location.protocol.startsWith('http') ? '<p class="small muted">⚠️ Le mode IA ne marche que depuis le site en ligne, pas depuis un fichier ouvert sur l\'ordinateur.</p>' : ''}
        <label class="switch"><span>Activer le mode IA</span><input type="checkbox" data-change="regIA" ${r.ia.actif ? 'checked' : ''}></label>
        <label class="lbl" for="rg-code">Code d'accès</label><input id="rg-code" type="password" autocomplete="off" value="${esc(r.ia.code)}" data-input="regCode">
        <button class="btn" data-act="regTestIA">Tester la connexion</button> <span id="rg-ia-res" class="small"></span></div>
      <div class="card"><h2>💾 Ma sauvegarde</h2>
        <p class="small">🔒 Tout est enregistré <b>uniquement sur cet appareil</b>. Si tu vides le navigateur ou changes d'appareil, tout disparaît : exporte régulièrement.</p>
        ${C.stockageOk() ? '' : '<p class="small" style="color:var(--alerte)">⚠️ L\'enregistrement ne fonctionne pas sur ce navigateur (navigation privée ?).</p>'}
        <div class="row"><button class="btn primaire" data-act="regExport">⬇️ Exporter ma sauvegarde</button>
        <label class="btn" for="rg-import">⬆️ Importer une sauvegarde</label><input id="rg-import" type="file" accept="application/json,.json" hidden data-change="regImport"></div>
        ${C.aDesDonneesV1() ? '<button class="btn" style="margin-top:10px" data-act="regV1">🎁 Reprendre mes notes de Moi &amp; Coachy V1</button>' : ''}
        <hr class="sep"><button class="btn discret" data-act="regReset" style="color:var(--alerte)">Tout effacer sur cet appareil</button></div>
      <p class="footer-note">Coachy 2.0 · prototype V1 · Création originale Nawel Haddouch · Educa-Typique<br>Coachy n'est pas un outil de diagnostic et ne remplace pas un accompagnement professionnel.</p>`;
  });
  C.act('regProfil', () => C.reprendreProfil());
  C.onInput('regTaille', (el) => { C.state.reglages.taille = +el.value; C.$('#rg-tv').textContent = el.value; C.appliquerReglages(); C.save(); });
  C.onInput('regVoix', (el) => { C.state.reglages.voixVitesse = +el.value; C.save(); });
  C.act('regTestVoix', () => C.dire('Bonjour, je suis Coachy. On avance une étape à la fois.'));
  C.onInput('regSwitch', (el) => { C.state.reglages[el.dataset.arg] = el.checked; C.appliquerReglages(); C.save(); });
  C.onInput('regIA', (el) => { C.state.reglages.ia.actif = el.checked; C.save(); });
  C.onInput('regCode', (el) => { C.state.reglages.ia.code = el.value.trim(); C.save(); });
  C.act('regTestIA', async () => {
    const out = C.$('#rg-ia-res');
    if (!C.iaDispo()) { out.textContent = 'Active le mode IA et entre ton code (depuis le site en ligne).'; return; }
    out.textContent = '⏳…';
    try { await C.ia('ping', {}); out.textContent = '✅ Connecté'; } catch (e) { out.textContent = '⚠️ ' + e.message; }
  });
  C.act('regExport', () => {
    const d = new Date();
    C.telecharger('coachy-sauvegarde-' + C.today(d) + '.json', JSON.stringify(C.state, null, 1), 'application/json');
    C.toast('⬇️ Sauvegarde téléchargée');
  });
  C.onInput('regImport', async (el) => {
    const f = el.files[0]; if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data || typeof data !== 'object' || !data.profil || !data.reglages) throw new Error('format');
      if (!confirm('Remplacer les données de cet appareil par cette sauvegarde ?')) return;
      localStorage.setItem('coachy2', JSON.stringify(data));
      location.reload();
    } catch (e) { C.toast('⚠️ Ce fichier n\'est pas une sauvegarde Coachy.'); }
    el.value = '';
  });
  C.act('regV1', () => { const n = C.importerV1(); C.toast(n ? '🎁 ' + n + ' élément(s) repris. Valide tes découvertes dans Mon mode d\'emploi.' : 'Rien de nouveau à reprendre.'); });
  C.act('regReset', () => {
    if (!confirm('Tout effacer ? Profil, notions, cartes, journal… Cette action est définitive. Pense à exporter avant.')) return;
    if (!confirm('Vraiment tout effacer ?')) return;
    C.reset(); location.hash = '#/bienvenue'; location.reload();
  });

  /* ======================= PARTAGER AVEC UN ADULTE ======================= */
  const ELEMENTS = [
    ['profil', '👤 Mes besoins et mes points d\'appui'],
    ['strategies', '🌿 Les stratégies qui marchent pour moi (découvertes validées)'],
    ['passeport', '📇 Mon passeport cognitif'],
    ['progression', '📈 Ma progression (rounds, notions, réactivations)'],
    ['memoire', '🧠 Où j\'en suis dans mes notions (labo mémoire)'],
    ['examen', '🎓 Ma préparation au brevet / CFG'],
    ['reussites', '🌱 Mes réussites'],
    ['objectifs', '🎯 Mes objectifs et mon orientation'],
  ];
  C.screen('accompagnant', function () {
    const ch = C.state.partage.choix;
    return `<h1>🤝 Partager avec un adulte</h1>
      <div class="card sauge small">🔒 <b>C'est toi qui décides.</b> Rien n'est envoyé automatiquement, personne ne voit ton journal ni tes émotions. Tu choisis ce que tu montres, puis tu imprimes ou enregistres un PDF pour ton parent, ton prof ou ton accompagnante.</div>
      <div class="card" style="margin-top:12px"><h2>Ce que je choisis de partager</h2>
      ${ELEMENTS.map(([k, l]) => `<label class="switch"><span>${l}</span><input type="checkbox" data-change="paChoix" data-arg="${k}" ${ch.includes(k) ? 'checked' : ''}></label>`).join('')}
      <p class="small muted">Jamais partagés par cette page : ton radar émotionnel, ton parking à pensées, ta gratitude, tes pensées pièges.</p></div>
      <div class="card" id="synthese" style="margin-top:12px">${synthese(ch)}</div>
      <div class="row" style="margin-top:12px"><button class="btn primaire" data-act="imprimer" ${ch.length ? '' : 'disabled'}>🖨️ Imprimer / PDF</button><button class="btn" data-act="paTexte" ${ch.length ? '' : 'disabled'}>📄 Exporter en texte</button></div>
      ${ui.fold('🧑‍🏫 Pour l\'adulte accompagnant', `<p class="small">Cette version (V1) est un prototype <b>sur un seul appareil</b>, sans compte. Les objectifs individualisés peuvent être définis <b>ensemble</b> et notés par l'ado dans « Mon mode d'emploi › Construire mon avenir » et dans le planning.</p>
        <p class="small">Prévu en V3 (nécessite un serveur sécurisé) : multiprofils, espace accompagnant distinct avec permissions explicites, suivi des acquisitions et export PDF de synthèses sélectionnées par l'ado.</p>`)}`;
  });
  C.onInput('paChoix', (el) => { const p = C.state.partage, k = el.dataset.arg; p.choix = el.checked ? p.choix.concat(k) : p.choix.filter((x) => x !== k); C.save(); C.rerender(); });
  C.act('paTexte', () => C.telecharger('coachy-synthese.txt', C.$('#synthese').innerText));

  function synthese(ch) {
    if (!ch.length) return ui.vide('Coche ce que tu veux partager : l\'aperçu apparaîtra ici.');
    const s = C.state, p = s.profil, sem = Date.now() - 30 * 864e5;
    let h = `<div class="row" style="justify-content:space-between"><b style="font-size:1.2rem">Synthèse Coachy</b><span class="muted small">${esc(p.prenom || '')} · ${new Date().toLocaleDateString('fr-FR')}</span></div><hr class="sep">`;
    const sec = (t, body) => `<h3 style="margin-top:12px">${t}</h3>${body}`;
    const ul = (l) => (l.length ? `<ul style="margin:0;padding-left:20px">${l.map((x) => `<li>${C.acc(esc(x))}</li>`).join('')}</ul>` : '<p class="muted small">—</p>');
    if (ch.includes('profil')) h += sec('👤 Besoins et points d\'appui', `<p class="small"><b>Ce qui me demande de l'énergie :</b></p>${ul(D.besoins.filter((b) => p.besoins.includes(b.id)).map((b) => b.label))}<p class="small"><b>Mes points d'appui :</b></p>${ul(D.appuis.filter((a) => p.appuis.includes(a.id)).map((a) => a.label))}`);
    if (ch.includes('strategies')) h += sec('🌿 Stratégies qui marchent pour moi', ul(s.decouvertes.filter((d) => d.statut === 'validee').map((d) => d.text)));
    if (ch.includes('passeport')) {
      const r = s.modeEmploi.ressources || {}, cog = s.modeEmploi.cognitif || {};
      h += sec('📇 Passeport cognitif', `<p class="small"><b>Je comprends mieux quand :</b></p>${ul(cog.canal || [])}${r.aides ? `<p class="small"><b>Ce qui m'aide :</b> ${esc(r.aides)}</p>` : ''}${r.phrase ? `<p class="small"><b>Ma phrase de secours :</b> « ${esc(r.phrase)} »</p>` : ''}<p class="small muted">Passeport complet : Mon mode d'emploi › Passeport.</p>`);
    }
    if (ch.includes('progression')) {
      const n = (a) => a.filter((x) => (x.at || x.creeLe || 0) > sem).length;
      h += sec('📈 Progression (30 derniers jours)', ul([n(s.rounds) + ' round(s) de travail', n(s.notions) + ' notion(s) travaillée(s)', s.cartes.reduce((k, c) => k + (c.hist || []).filter((x) => x.at > sem).length, 0) + ' réactivation(s) mémoire', n(s.reussites) + ' réussite(s) notée(s)']));
    }
    if (ch.includes('memoire')) {
      const st = { construction: 0, solide: 0, durable: 0 };
      s.cartes.forEach((c) => st[C.memoire.statut(c)]++);
      h += sec('🧠 Labo mémoire', ul([st.durable + ' acquis durable(s) (réussis seul·e après 1 semaine)', st.solide + ' en cours de consolidation', st.construction + ' en construction']) + `<p class="small">Notions : ${s.notions.map((x) => esc(x.titre)).join(', ') || '—'}</p>`);
    }
    if (ch.includes('examen')) h += sec('🎓 Préparation examens', ul(((s.examen || {}).epreuves || []).map((e) => (e.fait ? '✅ ' : '📌 ') + e.nom + (e.date ? ' (' + e.date + ')' : ''))));
    if (ch.includes('reussites')) h += sec('🌱 Réussites récentes', ul(s.reussites.slice(-10).reverse().map((r) => r.text)));
    if (ch.includes('objectifs')) {
      const av = s.modeEmploi.avenir || {}, po = s.modeEmploi.possibles || {};
      h += sec('🎯 Objectifs et orientation', ul(D.objectifs.filter((o) => p.objectifs.includes(o.id)).map((o) => o.label).concat([av.court, av.annee, av.reve].filter(Boolean), (po.domaines || []).map((d) => C.acc('Attir{ée|é} par : ') + d))));
    }
    h += `<p class="small muted" style="margin-top:14px">Synthèse choisie et partagée par l'élève. Elle décrit un fonctionnement et des stratégies, pas un diagnostic. Coachy · Educa-Typique.</p>`;
    return h;
  }
})();
