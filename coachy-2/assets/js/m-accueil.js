/* Coachy 2.0 — Bienvenue (profil), tableau de bord, menu « Plus », aide. */
(function () {
  'use strict';
  const D = C.data, ui = C.ui, esc = C.esc;

  /* ======================= BIENVENUE / PROFIL ======================= */
  let ob = { etape: 1 };
  const NB = 5;

  function chipsSel(liste, choisis, groupe) {
    return `<div class="chips" data-groupe="${groupe}">${liste.map((x) => {
      const id = x.id || x, label = x.label || x;
      return `<button class="chip" data-act="toggle" data-val="${esc(id)}" aria-pressed="${choisis.includes(id)}">${x.ico ? x.ico + ' ' : ''}${esc(label)}</button>`;
    }).join('')}</div>`;
  }
  function lireChips(groupe) { return C.$$(`[data-groupe="${groupe}"] [aria-pressed="true"]`).map((b) => b.dataset.val); }

  C.screen('bienvenue', function () {
    const p = C.state.profil, r = C.state.reglages, e = ob.etape;
    let h = '<div class="card hero bleu">' + ui.steps(e, NB);
    if (e === 1) {
      h += `<div class="big-emoji" aria-hidden="true">🧭</div>
        <h1>Bienvenue dans Coachy</h1>
        <p>Je suis un compagnon pour <b>apprendre</b>, <b>t'organiser</b>, <b>prendre soin de toi</b> et <b>mieux te connaître</b>.</p>
        <p class="muted small">🔒 Tout ce que tu écris reste sur cet appareil. Rien n'est envoyé. Coachy ne pose aucun diagnostic et ne remplace pas un professionnel.</p>
        </div>
        <div class="card"><h2>Comment veux-tu commencer ?</h2>
        <button class="choice" data-act="obPreset" data-arg="pilote-3e"><span class="ico">🎓</span><span><b>Profil 3e · DNB &amp; CFG</b><br><span class="muted small">Un profil déjà préparé avec ton accompagnante. Tu pourras tout modifier.</span></span></button>
        <button class="choice" data-act="obPreset" data-arg=""><span class="ico">✏️</span><span><b>Je crée mon profil</b><br><span class="muted small">Je choisis moi-même, étape par étape.</span></span></button>
        </div>`;
      return h;
    }
    if (e === 2) {
      h += `<h1>Comment je t'appelle ?</h1><p class="muted">Ton prénom reste sur ton appareil. Tu peux aussi laisser vide.</p></div>
      <div class="card"><label class="lbl" for="ob-prenom">Mon prénom</label>
      <input id="ob-prenom" type="text" autocomplete="given-name" value="${esc(p.prenom)}" maxlength="30">
      <label class="lbl">Je préfère que Coachy me parle…</label>
      <div class="chips" data-groupe="accord">
        <button class="chip" data-act="choixUnique" data-val="f" aria-pressed="${p.accord !== 'm'}">au féminin (prête, fière)</button>
        <button class="chip" data-act="choixUnique" data-val="m" aria-pressed="${p.accord === 'm'}">au masculin (prêt, fier)</button>
      </div>
      <label class="lbl" for="ob-classe">Ma classe</label>
      <select id="ob-classe">${['', '6e', '5e', '4e', '3e', '2de', '1re', 'Terminale', 'CAP', 'Autre'].map((c) => `<option ${c === p.classe ? 'selected' : ''}>${c}</option>`).join('')}</select>
      </div>`;
    } else if (e === 3) {
      h += `<h1>Ce qui est parfois difficile pour moi</h1><p class="muted">Coachy s'adapte à ça. Ce n'est pas une étiquette : tu peux changer quand tu veux.</p></div>
      <div class="card">${chipsSel(D.besoins, p.besoins, 'besoins')}</div>`;
    } else if (e === 4) {
      h += `<h1>Mes points forts et mes objectifs</h1><p class="muted">Coachy s'appuie sur ce qui marche déjà chez toi.</p></div>
      <div class="card"><h2>Mes points d'appui</h2>${chipsSel(D.appuis, p.appuis, 'appuis')}</div>
      <div class="card"><h2>Mes objectifs</h2>${chipsSel(D.objectifs, p.objectifs, 'objectifs')}</div>
      <div class="card"><h2>Ce qui m'intéresse</h2>${chipsSel(D.interets, p.interets, 'interets')}</div>`;
    } else if (e === 5) {
      h += `<h1>Mon confort de lecture</h1><p class="muted">Règle l'affichage pour que tes yeux se fatiguent moins.</p></div>
      <div class="card">
        <label class="lbl" for="ob-taille">Taille du texte : <span id="ob-taille-v">${r.taille}</span> px</label>
        <input id="ob-taille" type="range" min="15" max="24" value="${r.taille}" data-input="obTaille">
        <label class="switch"><span>Texte plus espacé (lecture plus facile)</span><input type="checkbox" id="ob-dys" ${r.dys ? 'checked' : ''} data-change="obConfort"></label>
        <label class="switch"><span>Proposer la lecture audio (🔊)</span><input type="checkbox" id="ob-audio" ${r.audio ? 'checked' : ''} data-change="obConfort"></label>
        <label class="switch"><span>Couper les animations</span><input type="checkbox" id="ob-calme" ${r.calme ? 'checked' : ''} data-change="obConfort"></label>
        <label class="switch"><span>Activer « Mon jardin intérieur » avec les ressources spirituelles (islam)</span><input type="checkbox" id="ob-spi" ${r.spirituel ? 'checked' : ''} data-change="obConfort"></label>
      </div>
      ${C.aDesDonneesV1() ? '<div class="card sauge"><h2>🎁 Tes notes de Moi &amp; Coachy</h2><p>J\'ai trouvé des découvertes et un mode d\'emploi de la première version. Je les reprends ? (Tu valideras chaque découverte.)</p><label class="switch"><span>Oui, reprendre mes notes</span><input type="checkbox" id="ob-v1" checked></label></div>' : ''}`;
    }
    h += `<div class="row" style="margin-top:14px;justify-content:space-between">
      <button class="btn" data-act="obPrec">← Retour</button>
      <button class="btn primaire" data-act="obSuiv">${e === NB ? 'C\'est parti ✓' : 'Suivant →'}</button></div>`;
    return h;
  });

  function obCapture() {
    const p = C.state.profil, e = ob.etape;
    if (e === 2) {
      p.prenom = (C.$('#ob-prenom').value || '').trim().slice(0, 30);
      const ac = C.$('[data-groupe="accord"] [aria-pressed="true"]'); p.accord = ac ? ac.dataset.val : 'f';
      p.classe = C.$('#ob-classe').value;
    }
    if (e === 3) p.besoins = lireChips('besoins');
    if (e === 4) { p.appuis = lireChips('appuis'); p.objectifs = lireChips('objectifs'); p.interets = lireChips('interets'); }
    if (e === 5) {
      const v1 = C.$('#ob-v1');
      if (v1 && v1.checked) { const n = C.importerV1(); if (n) C.toast('🎁 ' + n + ' élément(s) repris de Moi & Coachy'); }
    }
    C.save();
  }
  C.act('obPreset', (el, id) => {
    const pr = D.presets[id], p = C.state.profil;
    if (pr) {
      Object.assign(p, { classe: pr.classe, objectifs: pr.objectifs.slice(), besoins: pr.besoins.slice(), appuis: pr.appuis.slice(), interets: pr.interets.slice(), preset: id });
      Object.assign(C.state.reglages, pr.reglages);
      C.appliquerReglages();
    } else p.preset = null;
    C.save(); ob.etape = 2; C.render();
  });
  C.act('obSuiv', () => {
    obCapture();
    if (ob.etape < NB) { ob.etape++; C.render(); return; }
    C.state.profil.configure = true; C.save(); ob.etape = 1;
    C.go('accueil');
  });
  C.act('obPrec', () => { obCapture(); if (ob.etape > 1) { ob.etape--; C.render(); } else if (C.state.profil.configure) C.go('accueil'); });
  C.onInput('obTaille', (el) => { C.state.reglages.taille = +el.value; C.$('#ob-taille-v').textContent = el.value; C.appliquerReglages(); C.save(); });
  C.onInput('obConfort', () => {
    const r = C.state.reglages;
    r.dys = C.$('#ob-dys').checked; r.audio = C.$('#ob-audio').checked; r.calme = C.$('#ob-calme').checked; r.spirituel = C.$('#ob-spi').checked;
    C.appliquerReglages(); C.save();
  });
  C.reprendreProfil = () => { ob.etape = 2; C.go('bienvenue'); };

  /* ======================= TABLEAU DE BORD ======================= */
  function salut() {
    const h = new Date().getHours(), p = C.state.profil.prenom;
    const mot = h < 5 ? 'Bonsoir' : h < 18 ? 'Bonjour' : 'Bonsoir';
    return mot + (p ? ' ' + esc(p) : '') + ' 👋';
  }
  function suggestionMission() {
    const dues = C.memoire ? C.memoire.dues().length : 0;
    const e = C.energie();
    if (e === 'basse') return C.pick(['Préparer mon sac pour demain', 'Relire une seule carte mémoire', 'Me reposer 20 minutes']);
    if (dues) return 'Réactiver mes ' + dues + ' carte(s) mémoire du jour (5 min).';
    const prochain = C.state.planning.find((x) => !x.fait);
    if (prochain) return prochain.titre;
    if (C.state.profil.objectifs.includes('DNB')) return 'Revoir une notion pour le brevet avec Mon prof autrement.';
    return 'Choisir une seule chose importante pour aujourd\'hui.';
  }

  C.screen('accueil', function () {
    const j = C.jour(), s = C.state;
    let h = `<h1>${salut()}</h1>`;
    const checkFait = j.meteo && j.batterie != null;

    if (!checkFait) {
      h += `<div class="card bleu"><h2>Ma météo intérieure</h2><p class="muted small">Comment ça va, là, maintenant ? Pas de bonne ou de mauvaise réponse.</p>
        <div class="meteo">${D.meteo.map((m) => `<button data-act="meteo" data-arg="${m.id}" aria-pressed="${j.meteo === m.id}"><span class="ico" aria-hidden="true">${m.ico}</span>${m.label}</button>`).join('')}</div>
        <label class="lbl" for="batt">Ma batterie : <span id="batt-v">${j.batterie == null ? 50 : j.batterie}</span> %</label>
        <input id="batt" type="range" min="0" max="100" step="5" value="${j.batterie == null ? 50 : j.batterie}" data-input="batt">
        <p id="batt-t" class="muted small">${D.batterieTexte(j.batterie == null ? 50 : j.batterie)}</p>
        <button class="btn primaire plein" data-act="checkin">Valider</button></div>`;
    } else {
      const m = D.meteo.find((x) => x.id === j.meteo) || {};
      h += `<div class="card"><div class="row" style="justify-content:space-between"><span><span class="big-emoji" style="font-size:1.6rem">${m.ico || ''}</span> <b>${esc(m.label || '')}</b></span>
        <button class="btn discret" data-act="checkinModif">Modifier</button></div>
        ${ui.batt(j.batterie)}<p class="muted small" style="margin-top:6px">${D.batterieTexte(j.batterie)}</p></div>`;
      if (C.faibleEnergie()) {
        h += `<div class="card sauge"><h2>🌙 Mode faible énergie</h2><p>Aujourd'hui, on allège. Pas de grand programme : une seule petite chose, ou du repos. C'est aussi ça, bien se piloter.</p>
        <div class="row"><button class="btn sauge" data-act="go" data-arg="soin/parcours/epuise">Me reposer</button><a class="btn" href="#/organise/round">Un round de 5 min</a></div></div>`;
      }
    }

    // Mission du jour
    h += `<div class="card"><h2>🎯 Ma mission du jour</h2>`;
    if (j.mission) {
      h += `<p style="font-size:1.1rem">${j.missionFaite ? '✅ ' : ''}<b>${esc(j.mission)}</b></p>
        <div class="row">${j.missionFaite ? '<span class="badge sauge">Bravo, c\'est fait</span>' : '<button class="btn sauge" data-act="missionFaite">C\'est fait ✓</button><a class="btn" href="#/organise/decouper">Découper</a><a class="btn" href="#/organise/round">Lancer un round</a>'}
        <button class="btn discret" data-act="missionChanger">Changer</button></div>`;
    } else {
      h += `<p class="muted small">Une seule mission. Petite, c'est mieux.</p>
        <input id="mission" type="text" placeholder="Ex. : réviser les fractions 15 min" maxlength="120">
        <div class="row" style="margin-top:10px"><button class="btn primaire" data-act="missionOk">Choisir</button><button class="btn" data-act="missionSugg">💡 Une idée ?</button>${ui.ecouter('mission')}</div>`;
    }
    h += `</div>`;

    // Découvertes à valider
    const prop = s.decouvertes.filter((d) => d.statut === 'proposee').length;
    if (prop) h += `<a class="card lavande" style="display:block;text-decoration:none;color:inherit" href="#/modemploi/decouvertes">💡 <b>${prop} découverte(s) sur toi</b> attendent ta validation pour entrer dans ton mode d'emploi. →</a>`;

    // Rappels mémoire
    const dues = C.memoire ? C.memoire.dues().length : 0;
    if (dues) h += `<a class="card sable" style="display:block;text-decoration:none;color:inherit;margin-top:12px" href="#/memoire/reviser">🧠 <b>${dues} carte(s)</b> à réactiver aujourd'hui. →</a>`;

    // Accès rapide
    h += `<h2 style="margin-top:20px">Mes espaces</h2><div class="grid two">
      ${ui.tile('apprendre', '📘', 'J\'apprends', 'Mon prof autrement', 'bleu')}
      ${ui.tile('organise', '🧭', 'Je m\'organise', 'Missions, rounds, routines', 'sauge')}
      ${ui.tile('ludo', '🎲', 'J\'entraîne mon cerveau', 'Ludothèque', 'sable')}
      ${ui.tile('soin', '🌿', 'Je prends soin de moi', 'Émotions et stress', 'sauge')}
      ${ui.tile('jardin', '🌸', 'Mon jardin intérieur', 'Pauses de recentrage', 'lavande')}
      ${ui.tile('modemploi', '🪞', 'Mon mode d\'emploi', 'Me connaître', 'lavande')}
    </div>`;

    // Progression (repliée)
    const sem = Date.now() - 7 * 864e5;
    const nb = (arr) => arr.filter((x) => (x.at || x.creeLe || 0) > sem).length;
    const revs = s.cartes.reduce((n, c) => n + (c.hist || []).filter((x) => x.at > sem).length, 0);
    h += ui.fold('📈 Ma progression de la semaine', `
      <ul class="liste">
        <li><span>🎯</span><span class="grow">Rounds de travail</span><b>${nb(s.rounds)}</b></li>
        <li><span>📘</span><span class="grow">Notions travaillées</span><b>${nb(s.notions)}</b></li>
        <li><span>🧠</span><span class="grow">Réactivations mémoire</span><b>${revs}</b></li>
        <li><span>🌱</span><span class="grow">Réussites notées</span><b>${nb(s.reussites)}</b></li>
        <li><span>🎲</span><span class="grow">Parties de jeux</span><b>${Object.values(s.jeux).reduce((n, g) => n + (g.hist || []).filter((t) => t > sem).length, 0)}</b></li>
      </ul>
      <p class="muted small">Pas de classement, pas de note : juste de quoi voir que ça bouge.</p>
      ${historiqueMeteo()}`);

    h += `<p class="footer-note">Coachy n'est pas un outil de diagnostic et ne remplace pas un accompagnement professionnel.<br>Création originale Nawel · Educa-Typique</p>`;
    return h;
  });

  function historiqueMeteo() {
    const hist = C.state.historique.slice(-14);
    if (hist.length < 2) return '<p class="muted small">Ta météo des jours précédents s\'affichera ici.</p>';
    return `<h3 style="margin-top:12px">Ma météo des derniers jours</h3><div class="row" style="gap:4px">${hist.map((x) => {
      const m = D.meteo.find((y) => y.id === x.meteo);
      return `<span title="${x.date} · ${x.batterie == null ? '?' : x.batterie + ' %'}" style="font-size:1.3rem">${m ? m.ico : '·'}</span>`;
    }).join('')}</div>`;
  }

  C.act('meteo', (el, id) => { C.jour().meteo = id; C.save(); C.$$('.meteo button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.arg === id)); });
  C.onInput('batt', (el) => { C.$('#batt-v').textContent = el.value; C.$('#batt-t').textContent = D.batterieTexte(+el.value); });
  C.act('checkin', () => {
    const j = C.jour();
    if (!j.meteo) { C.toast('Choisis d\'abord ta météo 🌤️'); return; }
    j.batterie = +C.$('#batt').value; C.save();
    if (C.faibleEnergie()) C.toast('🌙 Batterie basse : Coachy allège tout pour aujourd\'hui.');
    C.render();
  });
  C.act('checkinModif', () => { const j = C.jour(); const b = j.batterie; j.batterie = null; C.save(); C.render(); C.$('#batt').value = b; C.$('#batt').dispatchEvent(new Event('input', { bubbles: true })); });
  C.act('missionOk', () => {
    const v = C.$('#mission').value.trim();
    if (!v) { C.toast('Écris ta mission, ou demande une idée 💡'); return; }
    const j = C.jour(); j.mission = v; j.missionFaite = false; C.save(); C.render();
  });
  C.act('missionSugg', () => { C.$('#mission').value = suggestionMission(); C.$('#mission').focus(); });
  C.act('missionFaite', () => {
    const j = C.jour(); j.missionFaite = true;
    C.state.reussites.push({ id: C.uid(), at: Date.now(), text: 'Mission accomplie : ' + j.mission, auto: true });
    C.save(); C.toast('🌱 Bien joué ! Ajouté à ton carnet de réussites.'); C.render();
  });
  C.act('missionChanger', () => { const j = C.jour(); j.mission = ''; j.missionFaite = false; C.save(); C.render(); });

  /* ======================= « J'AI BESOIN D'AIDE » ======================= */
  C.act('aide', () => {
    const btns = Object.entries(D.contexte).map(([id, c]) => `<button class="choice" data-act="contexte" data-arg="${id}"><span class="ico">${c.ico}</span><b>${c.titre}</b></button>`).join('');
    C.dialog('🤝 De quoi as-tu besoin ?', `<p class="muted small">Choisis ce qui ressemble le plus à ce que tu vis. Une aide courte va s'ouvrir.</p>${btns}
      <hr class="sep">
      <div class="card alerte"><b>Si tu es en danger ou si tu penses à te faire du mal</b><br>
      Parle tout de suite à un adulte de confiance. Appelle le <b>3114</b> (prévention du suicide, 24 h/24), le <b>119</b> (enfance en danger) ou le <b>112</b> (urgences).<br>
      <span class="small">Coachy ne remplace pas une personne. Tu mérites d'être aidé{e|}.</span></div>`);
  });

  /* ======================= MENU « PLUS » ======================= */
  C.screen('plus', function () {
    return `<h1>Tous mes espaces</h1>
    <div class="grid two">
      ${ui.tile('ludo', '🎲', 'J\'entraîne mon cerveau', 'Jeux et labo de la vraie vie', 'sable')}
      ${ui.tile('memoire', '🧠', 'Labo de mémorisation', 'Réactivations espacées', 'sable')}
      ${ui.tile('jardin', '🌸', 'Mon jardin intérieur', 'Pauses, gratitude' + (C.state.reglages.spirituel ? ', invocations' : ''), 'lavande')}
      ${ui.tile('modemploi', '🪞', 'Mon mode d\'emploi', '10 chapitres + passeport', 'lavande')}
      ${ui.tile('accompagnant', '🤝', 'Partager avec un adulte', 'Je choisis ce que je montre', 'bleu')}
      ${ui.tile('reglages', '⚙️', 'Réglages', 'Profil, confort, sauvegarde', '')}
    </div>
    <div class="card" style="margin-top:14px"><h2>Version précédente</h2><p class="muted small">Moi &amp; Coachy V1 reste disponible, intacte, avec son Mode d'emploi « quand ça monte » et Mon discernement.</p>
    <a class="btn" href="../moi-et-coachy/">Ouvrir Moi &amp; Coachy V1</a></div>`;
  });
})();
