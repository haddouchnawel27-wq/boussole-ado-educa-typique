/* Coachy 2.0 — Mon jardin intérieur.
   Version universelle (toujours là) + ressources spirituelles islamiques
   (seulement si l'ado les active dans les réglages).
   Règles : aucune invocation, aucun hadith, aucune référence inventée ;
   chaque contenu porte un statut de validation (voir data.js) ;
   une difficulté, un trouble ou une émotion ne sont JAMAIS un manque de foi. */
(function () {
  'use strict';
  const D = C.data, ui = C.ui, esc = C.esc;

  function badge(x) { return x.statut === 'valide' ? '' : '<span class="badge sable">En attente de relecture par Nawel</span>'; }
  function carteTexte(x) {
    return `<div class="card">
      <p class="small muted">${esc(x.theme || '')} ${badge(x)}</p>
      <p class="ar" lang="ar">${x.ar}</p>
      <p><i>${esc(x.ph)}</i></p>
      <p>${esc(x.fr)}</p>
      <p class="small muted">📖 ${esc(x.ref)}</p>
      <div class="row">
        <button class="btn" data-act="jardinEcoute" data-arg="${esc(x.ar)}">🔊 Écouter (arabe)</button>
        <button class="btn" data-act="direTexte" data-arg="${esc(x.fr)}">🔊 Traduction</button>
        <button class="btn discret" data-act="jardinFav" data-arg="${x.id}">${C.state.jardin.favoris.includes(x.id) ? '★ Favori' : '☆ Favori'}</button>
      </div></div>`;
  }

  C.screen('jardin', function (args) {
    const spi = C.state.reglages.spirituel;
    if (args[0] === 'dhikr' && spi) return ecranDhikr();
    if (args[0] === 'noms' && spi) return ecranNoms(args[1]);
    if (args[0] === 'gratitude') return ecranGratitude();
    let h = `<h1>🌸 Mon jardin intérieur</h1>
      <p class="muted">Un endroit pour se poser, respirer et se recentrer. Facultatif, à ton rythme.</p>
      <div class="card sauge small">🌿 Une difficulté, un trouble, une émotion forte ne sont <b>jamais</b> un signe de faiblesse ou de manque de foi. Prendre soin de toi, demander de l'aide et te faire accompagner sont des choses justes.</div>
      <h2 style="margin-top:16px">Pauses de recentrage</h2>
      ${D.pausesUniverselles.map((p) => ui.fold('🍃 ' + p.titre, `<p>${p.texte}</p>${ui.lire(p.texte)}`)).join('')}
      <div class="grid two" style="margin-top:12px">
        ${ui.tile('jardin/gratitude', '🙏', 'Ma gratitude', 'Trois mercis par jour', 'lavande')}
        ${ui.tileAct('outil', 'respiration', '🫧', 'Respiration douce', 'Suivre la bulle', 'sauge')}
      </div>`;
    if (!spi) {
      h += `<div class="card lavande" style="margin-top:14px"><h2>Ressources spirituelles</h2><p>Si tu le souhaites, tu peux activer des ressources de la tradition musulmane : invocations du Coran avec phonétique et traduction, dhikr, méditations sur les Noms d'Allah.</p>
        <button class="btn lavande" data-act="jardinActiver">Activer les ressources spirituelles</button></div>`;
      return h;
    }
    const favs = D.invocations.concat(D.versets).filter((x) => C.state.jardin.favoris.includes(x.id));
    h += `<h2 style="margin-top:18px">🌙 Ressources spirituelles</h2>
      <div class="grid two">
        ${ui.tile('jardin/dhikr', '📿', 'Dhikr', 'Se rappeler, sans compter si je veux', 'lavande')}
        ${ui.tile('jardin/noms', '✨', 'Méditer les Noms d\'Allah', 'Contemplations guidées', 'lavande')}
      </div>
      ${favs.length ? `<h3 style="margin-top:14px">★ Mes favoris</h3>${favs.map(carteTexte).join('')}` : ''}
      ${ui.fold('🤲 Invocations du Coran', D.invocations.map(carteTexte).join(''))}
      ${ui.fold('🌅 Versets d\'espérance, de patience et de tawakkul', D.versets.map(carteTexte).join(''))}
      <p class="small muted" style="margin-top:14px">📚 Bibliothèque évolutive : chaque contenu est relu et validé par Nawel avant d'être considéré comme définitif. Une passerelle vers le Jardin des Trésors et les Pauses douceur au Jardin est prévue dans une prochaine version.</p>
      <button class="btn discret" data-act="jardinDesactiver">Masquer les ressources spirituelles</button>`;
    return h;
  });
  C.act('jardinActiver', () => { C.state.reglages.spirituel = true; C.save(); C.rerender(); });
  C.act('jardinDesactiver', () => { C.state.reglages.spirituel = false; C.save(); C.rerender(); });
  C.act('jardinEcoute', (el, ar) => {
    const v = C.peutLire() && window.speechSynthesis.getVoices().some((x) => x.lang && x.lang.toLowerCase().startsWith('ar'));
    if (!v) { C.toast('Aucune voix arabe n\'est installée sur cet appareil. Les enregistrements audio validés arriveront dans une prochaine version.'); return; }
    C.dire(ar, 'ar-SA');
  });
  C.act('jardinFav', (el, id) => { const f = C.state.jardin.favoris; C.state.jardin.favoris = f.includes(id) ? f.filter((x) => x !== id) : f.concat(id); C.save(); C.rerender(); });

  /* Dhikr : compteur libre, aucun objectif chiffré imposé */
  let dk = { i: 0, n: 0 };
  function ecranDhikr() {
    const x = D.dhikr[dk.i];
    return `${ui.crumb('jardin', 'Mon jardin intérieur')}<h1>📿 Dhikr</h1>
      <p class="muted">Autant de fois que ton cœur en ressent le besoin. Le compteur est là si tu veux, pas d'objectif à atteindre.</p>
      <div class="chips">${D.dhikr.map((d, i) => `<button class="chip" data-act="dkChoix" data-arg="${i}" aria-pressed="${i === dk.i}">${esc(d.ph)}</button>`).join('')}</div>
      <div class="card lavande center" style="margin-top:12px"><p class="ar" style="text-align:center" lang="ar">${x.ar}</p><p><i>${esc(x.ph)}</i> — ${esc(x.fr)}</p>
      <button class="btn lavande" style="min-width:160px;min-height:80px;font-size:1.3rem;border-radius:999px" data-act="dkPlus">${dk.n}</button>
      <div><button class="btn discret" data-act="dkZero">Remettre à zéro</button></div></div>`;
  }
  C.act('dkChoix', (el, i) => { dk = { i: +i, n: 0 }; C.rerender(); });
  C.act('dkPlus', (el) => { dk.n++; el.textContent = dk.n; if (navigator.vibrate) navigator.vibrate(15); });
  C.act('dkZero', () => { dk.n = 0; C.rerender(); });

  function ecranNoms(id) {
    const n = D.noms.find((x) => x.id === id);
    if (!n) return `${ui.crumb('jardin', 'Mon jardin intérieur')}<h1>✨ Méditer les Noms d'Allah</h1><p class="muted">Choisis un Nom. Une courte contemplation guidée, à ton rythme.</p>
      <div class="grid two">${D.noms.map((x) => `<a class="tile lavande" href="#/jardin/noms/${x.id}"><b class="ar" style="text-align:left;font-size:1.3rem">${x.ar}</b><b>${esc(x.ph)}</b><span class="muted">${esc(x.fr)}</span></a>`).join('')}</div>`;
    return `${ui.crumb('jardin/noms', 'Les Noms')}
      <div class="card lavande center"><p class="ar" style="text-align:center;font-size:2.2rem" lang="ar">${n.ar}</p><h1>${esc(n.ph)}</h1><p>${esc(n.fr)}</p>${badge(n)}</div>
      <div class="card"><p class="small muted">Contemplation guidée (texte de réflexion, pas un hadith)</p><div class="bulle" style="font-size:1.08rem">${esc(n.med)}</div>
      <div class="row"><button class="btn" data-act="direTexte" data-arg="${esc(n.fr + '. ' + n.med)}">🔊 Écouter</button><button class="btn" data-act="outil" data-arg="respiration">🫧 Respirer un moment</button></div></div>`;
  }

  function ecranGratitude() {
    const l = C.state.jardin.gratitude.slice().reverse();
    return `${ui.crumb('jardin', 'Mon jardin intérieur')}<h1>🙏 Ma gratitude</h1>
      <p class="muted">Trois choses, même minuscules : un rayon de soleil, un message, un bon goûter. Le cerveau apprend à remarquer le positif.</p>
      <div class="card">${[1, 2, 3].map((i) => `<input id="gr-${i}" type="text" placeholder="Merci pour…" style="margin-bottom:8px">`).join('')}
      <button class="btn primaire" data-act="grOk">Garder</button></div>
      <div class="card" style="margin-top:12px">${l.length ? `<ul class="liste">${l.slice(0, 30).map((g) => `<li><span>🌼</span><span class="grow">${g.items.map(esc).join(' · ')}<br><span class="muted small">${C.fmtDate(g.at)}</span></span></li>`).join('')}</ul>` : ui.vide('Ta première liste apparaîtra ici.')}</div>`;
  }
  C.act('grOk', () => {
    const items = [1, 2, 3].map((i) => C.$('#gr-' + i).value.trim()).filter(Boolean);
    if (!items.length) { C.toast('Écris au moins un merci'); return; }
    C.state.jardin.gratitude.push({ at: Date.now(), items }); C.save(); C.toast('🌼 Gardé'); C.rerender();
  });
})();
