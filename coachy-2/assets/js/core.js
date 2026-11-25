/* Coachy 2.0 — moteur commun
   - stockage local unique (clé "coachy2"), versionné, jamais envoyé en ligne ;
   - routeur par ancre (#/espace/sous-page) ;
   - délégation des clics (data-act) : aucun onclick dans le HTML ;
   - outils transverses : dialogue, toast, voix, énergie du jour, découvertes.
   Les modules (m-*.js) s'enregistrent avec C.screen() et C.act(). */
(function () {
  'use strict';
  const KEY = 'coachy2';
  const VERSION = 1;

  const C = (window.C = {});
  C.screens = {};
  C.actions = {};
  C.inputs = {};

  /* ---------------- utilitaires ---------------- */
  C.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  C.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  C.today = (d) => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  C.fmtDate = (ts) => new Date(ts).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  C.fmtHeure = (ts) => new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  C.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  C.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  C.rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  C.euros = (cents) => (cents / 100).toFixed(2).replace('.', ',') + ' €';
  C.$ = (sel, root) => (root || document).querySelector(sel);
  C.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  /* Accord : « stress{ée|é} » → féminin ou masculin selon le profil. */
  C.acc = (s) => String(s).replace(/\{([^|{}]*)\|([^|{}]*)\}/g, (m, f, mm) => ((C.state && C.state.profil.accord) === 'm' ? mm : f));

  /* ---------------- stockage ---------------- */
  function defaults() {
    return {
      v: VERSION,
      creeLe: Date.now(),
      profil: { prenom: '', accord: 'f', classe: '', objectifs: [], besoins: [], appuis: [], interets: [], preset: null, configure: false },
      reglages: { taille: 17, dys: false, contraste: false, calme: false, audio: false, focus: false, spirituel: false, voixVitesse: 0.95, minuteur: true, ia: { actif: false, code: '' } },
      jour: { date: '', meteo: '', batterie: null, mission: '', missionFaite: false },
      historique: [],
      notions: [],
      cartes: [],
      rounds: [],
      parking: [],
      routines: [],
      planning: [],
      emotions: [],
      reussites: [],
      decouvertes: [],
      modeEmploi: {},
      jeux: {},
      jardin: { gratitude: [], favoris: [] },
      compteurs: {},
      partage: { choix: [] },
    };
  }
  function deepMerge(base, extra) {
    if (!extra || typeof extra !== 'object' || Array.isArray(extra)) return extra === undefined ? base : extra;
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    Object.keys(extra).forEach((k) => {
      out[k] = base && typeof base[k] === 'object' && base[k] && !Array.isArray(base[k]) ? deepMerge(base[k], extra[k]) : extra[k];
    });
    return out;
  }
  let stockageOk = true;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return deepMerge(defaults(), JSON.parse(raw));
    } catch (e) { stockageOk = false; return null; }
  }
  C.state = load();
  C.premiereVisite = !C.state;
  if (!C.state) C.state = defaults();

  C.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(C.state)); stockageOk = true; }
    catch (e) { stockageOk = false; C.toast('⚠️ Sauvegarde impossible sur cet appareil (navigation privée ?). Pense à exporter.'); }
  };
  C.stockageOk = () => stockageOk;
  C.reset = function () { try { localStorage.removeItem(KEY); } catch (e) {} C.state = defaults(); };

  /* Reprendre ce que Moi & Coachy V1 avait déjà noté (même site → même stockage). */
  C.importerV1 = function () {
    let n = 0;
    const lire = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
    try {
      const prenom = localStorage.getItem('educatypique_prenom');
      if (prenom && !C.state.profil.prenom) { C.state.profil.prenom = prenom; n++; }
    } catch (e) {}
    const deja = new Set(C.state.decouvertes.map((d) => d.text));
    (lire('coachy_insights') || []).concat(lire('educatypique_decouvertes') || []).forEach((it) => {
      if (it && it.text && !deja.has(it.text)) { deja.add(it.text); C.state.decouvertes.push({ id: C.uid(), text: it.text, source: 'Coachy V1', at: it.at || Date.now(), statut: 'proposee' }); n++; }
    });
    const p = lire('educatypique_profil_actif');
    if (p) {
      const me = C.state.modeEmploi;
      me.ressources = me.ressources || {};
      if (p.phrase_secours && !me.ressources.phrase) { me.ressources.phrase = p.phrase_secours; n++; }
      if (p.plan_si && p.plan_alors && !me.ressources.plan) { me.ressources.plan = 'SI ' + p.plan_si + ' → ALORS ' + p.plan_alors; n++; }
      if (Array.isArray(p.aides) && p.aides.length && !me.ressources.aides) { me.ressources.aides = p.aides.join(', '); n++; }
    }
    if (n) C.save();
    return n;
  };
  C.aDesDonneesV1 = function () {
    try { return ['coachy_insights', 'educatypique_decouvertes', 'educatypique_profil_actif', 'educatypique_prenom'].some((k) => localStorage.getItem(k)); } catch (e) { return false; }
  };

  /* ---------------- énergie & jour ---------------- */
  C.jour = function () {
    const t = C.today();
    if (C.state.jour.date !== t) {
      if (C.state.jour.date && (C.state.jour.meteo || C.state.jour.batterie != null)) {
        C.state.historique.push({ date: C.state.jour.date, meteo: C.state.jour.meteo, batterie: C.state.jour.batterie, mission: C.state.jour.mission, faite: C.state.jour.missionFaite });
        C.state.historique = C.state.historique.slice(-60);
      }
      C.state.jour = { date: t, meteo: '', batterie: null, mission: '', missionFaite: false };
      C.save();
    }
    return C.state.jour;
  };
  /* basse / moyenne / haute — sert à alléger les exigences quand la fatigue est forte */
  C.energie = function () {
    const j = C.jour();
    if (j.batterie == null) return j.meteo === 'orage' || j.meteo === 'brouillard' ? 'basse' : 'inconnue';
    if (j.batterie <= 30 || j.meteo === 'orage') return 'basse';
    if (j.batterie <= 60) return 'moyenne';
    return 'haute';
  };
  C.faibleEnergie = () => C.energie() === 'basse';

  C.compter = function (type) { C.state.compteurs[type] = (C.state.compteurs[type] || 0) + 1; C.save(); };

  /* Découvertes : Coachy PROPOSE, l'ado VALIDE (ou écarte). Rien n'entre dans
     « Mon mode d'emploi » sans son accord. */
  C.proposer = function (text, source, chapitre) {
    text = String(text || '').trim();
    if (!text) return false;
    if (C.state.decouvertes.some((d) => d.text === text && d.statut !== 'ecartee')) return false;
    C.state.decouvertes.push({ id: C.uid(), text, source: source || 'Coachy', chapitre: chapitre || 'action', at: Date.now(), statut: 'proposee' });
    C.save();
    return true;
  };

  /* ---------------- rendu & navigation ---------------- */
  C.screen = (name, fn) => { C.screens[name] = fn; };
  C.act = (name, fn) => { C.actions[name] = fn; };
  C.onInput = (name, fn) => { C.inputs[name] = fn; };

  let courant = { name: 'accueil', args: [] };
  C.courant = () => courant;
  C.go = function (path) { const h = '#/' + String(path).replace(/^#?\/?/, ''); if (location.hash === h) C.render(); else location.hash = h; };
  C.render = function () {
    const parts = (location.hash.replace(/^#\/?/, '') || 'accueil').split('/').map(decodeURIComponent);
    let name = parts[0];
    if (!C.screens[name]) name = 'accueil';
    courant = { name, args: parts.slice(1) };
    if (C.stopTimers) C.stopTimers();
    window.speechSynthesis && window.speechSynthesis.cancel();
    const main = C.$('#main');
    let out;
    try { out = C.screens[name](courant.args); }
    catch (e) { console.error(e); out = '<div class="card alerte"><h2>Oups, cet écran a eu un souci.</h2><p>Tes données sont en sécurité. Reviens à l\'accueil.</p><a class="btn" href="#/accueil">Accueil</a></div>'; }
    const res = typeof out === 'string' ? { html: out } : out || { html: '' };
    main.innerHTML = C.acc(res.html);
    const tab = { accueil: 'accueil', apprendre: 'apprendre', memoire: 'apprendre', organise: 'organise', soin: 'soin' }[name] || 'plus';
    document.body.classList.toggle('onboarding', name === 'bienvenue');
    C.$$('.tabbar a').forEach((a) => a.setAttribute('aria-current', a.dataset.tab === tab ? 'page' : 'false'));
    if (res.mount) res.mount(main);
    window.scrollTo(0, 0);
    if (C._focusMain) main.focus({ preventScroll: true });
  };
  C.rerender = () => { const y = window.scrollY; C.render(); window.scrollTo(0, y); };

  /* Petits blocs réutilisables */
  C.ui = {
    crumb: (href, label) => `<a class="crumb" href="#/${href}">← ${C.esc(label || 'Retour')}</a>`,
    tile: (href, ico, titre, sous, couleur) => `<a class="tile ${couleur || ''}" href="#/${href}"><span class="ico" aria-hidden="true">${ico}</span><b>${C.esc(titre)}</b>${sous ? `<span class="muted">${C.esc(sous)}</span>` : ''}</a>`,
    tileAct: (act, arg, ico, titre, sous, couleur) => `<button class="tile ${couleur || ''}" data-act="${act}" data-arg="${C.esc(arg || '')}"><span class="ico" aria-hidden="true">${ico}</span><b>${C.esc(titre)}</b>${sous ? `<span class="muted">${C.esc(sous)}</span>` : ''}</button>`,
    fold: (titre, body, open) => `<details class="fold"${open ? ' open' : ''}><summary>${titre}</summary><div class="fold-body">${body}</div></details>`,
    vide: (txt) => `<div class="vide">${txt}</div>`,
    steps: (n, total) => `<div class="steps" aria-label="Étape ${n} sur ${total}">${Array.from({ length: total }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</div>`,
    batt: (v) => `<div class="batt" role="img" aria-label="Batterie ${v} %"><i style="width:${v}%"></i></div>`,
    ecouter: (cible) => (C.peutEcouter() ? `<button class="btn" data-act="dicter" data-arg="${cible}" type="button">🎙️ Dicter</button>` : ''),
    lire: (texte) => `<button class="btn" data-act="direTexte" data-arg="${C.esc(texte)}" type="button">🔊 Écouter</button>`,
  };

  /* ---------------- dialogue & toast ---------------- */
  C.dialog = function (title, html, mount) {
    const d = C.$('#dlg');
    C.$('#dlg-title').textContent = C.acc(title);
    C.$('#dlg-body').innerHTML = C.acc(html);
    if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
    if (mount) mount(C.$('#dlg-body'));
    C.$('#dlg-body').scrollTop = 0;
  };
  C.close = function () { const d = C.$('#dlg'); if (C.stopDialogTimers) C.stopDialogTimers(); if (d.open) { if (d.close) d.close(); else d.removeAttribute('open'); } };
  let toastT;
  C.toast = function (msg) {
    const t = C.$('#toast'); if (!t) return;
    t.textContent = C.acc(msg); t.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2800);
  };

  /* ---------------- voix (lecture & dictée) ---------------- */
  C.peutLire = () => 'speechSynthesis' in window;
  C.peutEcouter = () => !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  C.dire = function (texte, lang) {
    if (!C.peutLire()) { C.toast('La lecture audio n\'est pas disponible sur ce navigateur.'); return; }
    const s = window.speechSynthesis; s.cancel();
    const u = new SpeechSynthesisUtterance(String(texte).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''));
    u.lang = lang || 'fr-FR'; u.rate = C.state.reglages.voixVitesse || 0.95;
    const voix = s.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith(u.lang.slice(0, 2)));
    if (voix) u.voice = voix;
    else if (lang && lang.startsWith('ar')) C.toast('Pas de voix arabe installée sur cet appareil.');
    s.speak(u);
  };
  C.ecouter = function (onText) {
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) { C.toast('La dictée n\'est pas disponible ici. Utilise le micro du clavier.'); return; }
    const r = new R(); r.lang = 'fr-FR'; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = (e) => onText(e.results[0][0].transcript);
    r.onerror = () => C.toast('Je n\'ai pas entendu. Réessaie ou écris.');
    r.onend = () => C.toast('🎙️ Dictée terminée');
    C.toast('🎙️ Je t\'écoute…'); r.start();
  };

  /* ---------------- réglages appliqués ---------------- */
  C.appliquerReglages = function () {
    const r = C.state.reglages, b = document.body;
    document.documentElement.style.setProperty('--taille', (r.taille || 17) + 'px');
    b.classList.toggle('dys', !!r.dys);
    b.classList.toggle('contraste', !!r.contraste);
    b.classList.toggle('calme', !!r.calme);
    b.classList.toggle('focus', !!r.focus);
  };

  /* ---------------- délégation d'événements ---------------- */
  document.addEventListener('click', function (ev) {
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const fn = C.actions[el.dataset.act];
    if (!fn) { console.warn('Action inconnue', el.dataset.act); return; }
    ev.preventDefault();
    fn(el, el.dataset.arg, ev);
  });
  document.addEventListener('input', function (ev) {
    const el = ev.target.closest('[data-input]');
    if (el && C.inputs[el.dataset.input]) C.inputs[el.dataset.input](el, ev);
  });
  document.addEventListener('change', function (ev) {
    const el = ev.target.closest('[data-change]');
    if (el && C.inputs[el.dataset.change]) C.inputs[el.dataset.change](el, ev);
  });

  /* Actions transverses */
  C.act('go', (el, arg) => { C.close(); C.go(arg); });
  C.act('fermer', () => C.close());
  C.act('direTexte', (el, arg) => C.dire(arg));
  C.act('dicter', (el, arg) => {
    const cible = document.getElementById(arg);
    C.ecouter((t) => { if (cible) { cible.value = (cible.value ? cible.value + ' ' : '') + t; cible.dispatchEvent(new Event('input', { bubbles: true })); } });
  });
  C.act('lireEcran', () => {
    const d = C.$('#dlg');
    const zone = d.open ? C.$('#dlg-body') : C.$('#main');
    const clone = zone.cloneNode(true);
    clone.querySelectorAll('button, .no-read, select, input, textarea').forEach((n) => n.remove());
    C.dire(clone.innerText.replace(/\s+/g, ' ').slice(0, 1800));
  });
  C.act('toggle', (el) => { el.setAttribute('aria-pressed', el.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); });
  C.act('choixUnique', (el) => {
    const g = el.parentElement; C.$$('[aria-pressed]', g).forEach((b) => b.setAttribute('aria-pressed', 'false'));
    el.setAttribute('aria-pressed', 'true');
  });

  /* Petits générateurs de fichiers (export) */
  C.telecharger = function (nom, contenu, type) {
    const blob = new Blob([contenu], { type: type || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = nom;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  /* ---------------- démarrage ---------------- */
  C.start = function () {
    C.appliquerReglages();
    C.jour();
    window.addEventListener('hashchange', () => { C.close(); C._focusMain = true; C.render(); });
    C.$('#dlg').addEventListener('close', () => { if (C.stopDialogTimers) C.stopDialogTimers(); window.speechSynthesis && window.speechSynthesis.cancel(); });
    if (C.premiereVisite || !C.state.profil.configure) { if (!/^#\/(bienvenue|reglages)/.test(location.hash)) location.replace('#/bienvenue'); }
    C.render();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  };
})();
