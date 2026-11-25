/* Coachy 2.0 — J'apprends · Mon prof autrement.
   Deux régimes, annoncés clairement à l'ado :
   - Mode démonstration (par défaut, hors-ligne) : méthodes, étayage, décodeur
     de consignes, lecture audio, cartes mémoire. Coachy ne « comprend » pas le
     contenu du cours et le dit.
   - Mode IA (si Nawel a configuré le serveur et donné un code) : appel à
     /api/coachy-prof — la clé reste sur le serveur, jamais dans l'appli. */
(function () {
  'use strict';
  const ui = C.ui, esc = C.esc;

  /* ---------------- IA (côté serveur uniquement) ---------------- */
  C.iaDispo = () => C.state.reglages.ia.actif && !!C.state.reglages.ia.code && location.protocol.startsWith('http');
  C.ia = async function (mode, data) {
    if (!C.iaDispo()) throw new Error('ia-off');
    const r = await fetch(new URL('/api/coachy-prof', location.origin).href, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-coachy-code': C.state.reglages.ia.code },
      body: JSON.stringify(Object.assign({ mode, profil: profilPourIA() }, data)),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Erreur ' + r.status);
    return j.text || '';
  };
  /* Seulement des besoins fonctionnels et des centres d'intérêt — jamais le prénom. */
  function profilPourIA() {
    const p = C.state.profil;
    return { classe: p.classe, objectifs: p.objectifs, besoins: p.besoins, appuis: p.appuis, interets: p.interets, energie: C.energie() };
  }
  function bandeauMode() {
    return C.iaDispo()
      ? '<p class="small"><span class="badge sauge">IA connectée</span> Coachy peut t\'expliquer ton cours. Il peut se tromper : vérifie avec ta leçon.</p>'
      : '<p class="small"><span class="badge sable">Mode démonstration</span> Ici, Coachy n\'utilise pas d\'IA : il te guide avec des méthodes, mais il ne lit pas et ne comprend pas le contenu de ton cours. <a href="#/reglages">En savoir plus</a></p>';
  }

  /* ---------------- outils texte (hors-ligne) ---------------- */
  const STOP = new Set('le la les un une des de du d l et ou mais donc car ni que qui quoi dont où à au aux en dans par pour sur sous avec sans ce cet cette ces son sa ses leur leurs mon ma mes ton ta tes notre nos votre vos il elle ils elles on nous vous je tu se s y ne pas plus est sont été être a ont avoir fait faire peut peuvent comme aussi tout tous toute toutes très bien entre lors alors ainsi cela ceci celui celle ceux quand si deux trois'.split(' '));
  C.motsCles = function (texte, n) {
    const f = {};
    (texte.toLowerCase().match(/[a-zàâäéèêëîïôöùûüç'-]{5,}/g) || []).forEach((m) => { m = m.replace(/^[a-z]'/, ''); if (!STOP.has(m)) f[m] = (f[m] || 0) + 1; });
    return Object.entries(f).sort((a, b) => b[1] - a[1]).slice(0, n || 8).map((x) => x[0]);
  };
  C.phrases = (t) => (String(t).replace(/\s+/g, ' ').match(/[^.!?;:]+[.!?;:]?/g) || []).map((s) => s.trim()).filter((s) => s.length > 2);
  function morceaux(texte) {
    const ph = C.phrases(texte), out = [];
    for (let i = 0; i < ph.length; i += 2) out.push(ph.slice(i, i + 2).join(' '));
    return out;
  }

  /* Verbes de consigne → ce qu'on attend vraiment */
  const VERBES = {
    calcul: 'Faire une opération et écrire le résultat (avec l\'unité si besoin).', resou: 'Trouver la réponse en écrivant les étapes du calcul.',
    explique: 'Dire POURQUOI ou COMMENT, avec tes mots, en faisant des phrases.', justifie: 'Donner la preuve : « car… », « parce que… », une règle ou un calcul.',
    compar: 'Dire ce qui est pareil ET ce qui est différent.', décri: 'Dire ce que tu vois, sans donner ton avis.', decri: 'Dire ce que tu vois, sans donner ton avis.',
    relève: 'Recopier exactement des mots ou une phrase du texte, entre guillemets.', releve: 'Recopier exactement des mots ou une phrase du texte, entre guillemets.',
    cite: 'Recopier exactement un passage, entre guillemets.', identifi: 'Trouver et nommer quelque chose.', nomme: 'Donner le nom exact.',
    souligne: 'Tracer un trait sous les mots demandés.', entour: 'Faire un cercle autour.', complét: 'Remplir les trous.', complet: 'Remplir les trous.',
    rédige: 'Écrire un texte avec des phrases complètes.', redige: 'Écrire un texte avec des phrases complètes.', développ: 'Écrire plusieurs phrases organisées sur le sujet.',
    argument: 'Donner ton avis ET des raisons pour le défendre.', conjugu: 'Mettre le verbe au bon temps et à la bonne personne.', trace: 'Dessiner avec la règle et le crayon.',
    classe: 'Ranger dans des groupes ou dans un ordre.', indique: 'Donner une information courte.', précise: 'Donner un détail en plus.', donne: 'Écrire la réponse demandée.',
    résume: 'Dire l\'essentiel en peu de mots.', resume: 'Dire l\'essentiel en peu de mots.', déduis: 'Trouver une conclusion à partir de ce que tu sais.', vérifi: 'Contrôler si c\'est juste.', convert: 'Changer d\'unité (ex. : m → cm).', arrondi: 'Garder seulement les chiffres demandés.',
  };
  C.decoder = function (consigne) {
    const ph = C.phrases(consigne);
    return ph.map((p) => {
      const bas = p.toLowerCase();
      const verbes = Object.keys(VERBES).filter((v) => new RegExp('\\b' + v, 'i').test(bas));
      const uniq = [...new Set(verbes.map((v) => VERBES[v]))];
      const nombres = p.match(/\d+(?:[.,]\d+)?\s?(?:€|%|cm|m|km|kg|g|l|h|min)?/g) || [];
      return { phrase: p, verbes: verbes.map((v) => p.match(new RegExp('\\b' + v + '\\w*', 'i'))[0]), sens: uniq, nombres };
    });
  };
  function rendreDecodage(res) {
    if (!res.length) return ui.vide('Colle ou dicte une consigne, puis appuie sur « Décoder ».');
    return `<ol class="liste" style="list-style:none">${res.map((r, i) => `<li><span class="badge">${i + 1}</span><span class="grow">
      <b>${esc(r.phrase)}</b>
      ${r.verbes.length ? `<br>🔑 Mot-action : <b>${r.verbes.map(esc).join(', ')}</b><br><span class="muted">→ ${r.sens.map(esc).join(' ')}</span>` : '<br><span class="muted small">Pas de mot-action : c\'est une information. Garde-la en tête.</span>'}
      ${r.nombres.length ? `<br>🔢 Données utiles : ${r.nombres.map((n) => `<span class="kbd">${esc(n)}</span>`).join(' ')}` : ''}
      <label class="switch" style="min-height:44px"><span class="small">C'est fait</span><input type="checkbox"></label></span></li>`).join('')}</ol>
      <div class="bulle">Redis la consigne avec tes mots : « On me demande de… ». Si tu y arrives, tu es prêt{e|} à commencer.</div>`;
  }

  /* ---------------- import : PDF, photo ---------------- */
  let pdfjsPromise = null;
  function chargerPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfjsPromise) return pdfjsPromise;
    pdfjsPromise = new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = '../mon-charge-de-com/vendor/pdf.min.js';
      s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = '../mon-charge-de-com/vendor/pdf.worker.min.js'; ok(window.pdfjsLib); };
      s.onerror = () => { pdfjsPromise = null; ko(new Error('pdf')); };
      document.head.appendChild(s);
    });
    return pdfjsPromise;
  }
  async function lirePdf(file) {
    const lib = await chargerPdfJs();
    const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
    let txt = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
      const c = await (await pdf.getPage(i)).getTextContent();
      txt += c.items.map((x) => x.str).join(' ') + '\n\n';
    }
    return txt.replace(/[ \t]+/g, ' ').trim();
  }
  function reduireImage(file) {
    return new Promise((ok, ko) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, 1600 / Math.max(img.width, img.height));
        const cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url); ok(cv.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(url); ko(new Error('image')); };
      img.src = url;
    });
  }

  /* ======================= HUB ======================= */
  const MODES = [
    { id: 'explique', ico: '💬', titre: 'Explique-moi mon cours' },
    { id: 'autrement', ico: '🔄', titre: 'Explique-moi autrement' },
    { id: 'exercice', ico: '🧩', titre: 'Guide-moi dans mon exercice' },
    { id: 'memoriser', ico: '🧠', titre: 'Aide-moi à mémoriser' },
    { id: 'controle', ico: '📝', titre: 'Prépare-moi à mon contrôle' },
    { id: 'brevet', ico: '🎓', titre: 'Prépare-moi au brevet / CFG' },
    { id: 'oral', ico: '🎤', titre: 'Entraîne-moi à l\'oral' },
  ];
  C.screen('apprendre', function (args) {
    if (args[0] === 'nouveau') return ecranNouveau();
    if (args[0] === 'notion') return ecranNotion(args[1], +(args[2] || 0));
    if (args[0] === 'consigne') return ecranConsigne();
    if (args[0] === 'oral') return ecranOral();
    if (args[0] === 'brevet') return ecranBrevet();
    if (args[0] === 'carte') return ecranCarteMentale(args[1]);
    const notions = C.state.notions.slice().sort((a, b) => b.at - a.at);
    return `<h1>📘 Mon prof autrement</h1>
      <p class="muted">On apprend étape par étape, à ton rythme. Je ne te donne pas les réponses : je t'aide à les trouver.</p>
      ${bandeauMode()}
      <div class="grid two" style="margin-top:12px">
        ${ui.tile('apprendre/nouveau', '➕', 'Ajouter un cours', 'Texte, PDF, photo ou dictée', 'bleu')}
        ${ui.tile('apprendre/consigne', '🧩', 'Décoder une consigne', 'Comprendre ce qu\'on attend', 'sauge')}
        ${ui.tile('memoire', '🧠', 'Labo mémoire', (C.memoire ? C.memoire.dues().length : 0) + ' carte(s) à revoir', 'sable')}
        ${ui.tile('apprendre/oral', '🎤', 'M\'entraîner à l\'oral', 'Je m\'enregistre, je réécoute', 'lavande')}
      </div>
      <h2 style="margin-top:18px">Mes notions</h2>
      ${notions.length ? `<ul class="liste card">${notions.map((n) => {
        const fait = Object.values(n.etapes || {}).filter((v) => String(v).trim()).length;
        return `<li><span>📄</span><span class="grow"><a href="#/apprendre/notion/${n.id}"><b>${esc(n.titre)}</b></a><br><span class="muted small">${esc(n.matiere || '')} · ${fait}/9 étapes</span></span></li>`;
      }).join('')}</ul>` : ui.vide('Pas encore de notion. Ajoute un cours pour commencer.')}
      ${ui.fold('🎓 Préparer le brevet et le CFG', '<p>Un tableau de bord pour tes épreuves, tes notions à revoir et ton oral.</p><a class="btn" href="#/apprendre/brevet">Ouvrir</a>')}`;
  });

  /* ======================= NOUVEAU COURS ======================= */
  function ecranNouveau() {
    return `${ui.crumb('apprendre', 'Mon prof autrement')}
      <h1>Ajouter un cours</h1>
      <div class="card">
        <label class="lbl" for="n-titre">Le titre de la notion</label>
        <input id="n-titre" type="text" placeholder="Ex. : Les pourcentages" maxlength="80">
        <label class="lbl" for="n-mat">La matière</label>
        <select id="n-mat">${['Mathématiques', 'Français', 'Histoire-géographie', 'EMC', 'Sciences (SVT, physique-chimie, techno)', 'Anglais', 'Autre langue', 'Vie pro / stage', 'Autre'].map((m) => `<option>${m}</option>`).join('')}</select>
      </div>
      <div class="card">
        <h2>Mon cours</h2>
        <div class="row">
          <label class="btn" for="n-pdf">📄 Importer un PDF</label><input id="n-pdf" type="file" accept="application/pdf,.pdf,.txt,text/plain" hidden data-change="importFichier">
          <label class="btn" for="n-photo">📷 Photo</label><input id="n-photo" type="file" accept="image/*" capture="environment" hidden data-change="importPhoto">
          ${ui.ecouter('n-texte')}
        </div>
        <div id="n-photo-zone"></div>
        <label class="lbl" for="n-texte">Le texte du cours (tu peux coller, écrire ou dicter)</label>
        <textarea id="n-texte" rows="8" placeholder="Colle ou écris ici ton cours, ou une partie."></textarea>
        <p id="n-info" class="muted small"></p>
      </div>
      <button class="btn primaire plein" data-act="notionCreer">Commencer à apprendre →</button>`;
  }
  C.onInput('importFichier', async (el) => {
    const f = el.files[0]; if (!f) return;
    const info = C.$('#n-info'), zone = C.$('#n-texte');
    if (!C.$('#n-titre').value) C.$('#n-titre').value = f.name.replace(/\.[^.]+$/, '').slice(0, 80);
    try {
      info.textContent = '⏳ Je lis ton fichier…';
      const txt = /\.txt$/i.test(f.name) || f.type === 'text/plain' ? await f.text() : await lirePdf(f);
      if (!txt.trim()) { info.textContent = '⚠️ Ce PDF ne contient pas de texte lisible (c\'est sans doute une image scannée). Prends-le en photo ou recopie l\'essentiel.'; return; }
      zone.value = (zone.value ? zone.value + '\n\n' : '') + txt;
      info.textContent = '✅ Texte récupéré. Vérifie-le : la mise en page des PDF est parfois un peu mélangée.';
    } catch (e) { info.textContent = '⚠️ Je n\'ai pas réussi à lire ce fichier. Essaie de copier-coller le texte.'; }
    el.value = '';
  });
  C.onInput('importPhoto', async (el) => {
    const f = el.files[0]; if (!f) return;
    const zone = C.$('#n-photo-zone');
    try {
      const data = await reduireImage(f);
      zone.innerHTML = `<img src="${data}" alt="Photo du cours" style="max-width:100%;border-radius:12px;margin-top:10px">
        ${C.iaDispo() ? '<button class="btn sauge" data-act="ocrIA" style="margin-top:8px">🔎 Lire le texte de la photo (IA)</button>' : `<div class="bulle sobre small">💡 <b>Astuce sans IA :</b> sur iPhone, iPad et beaucoup d'Android, ouvre la photo dans ta galerie et <b>appuie longuement sur le texte</b> pour le copier (Texte en direct / Google Lens), puis colle-le ici.<br>La lecture automatique des photos est possible en mode IA.</div>`}`;
      zone.dataset.img = data;
    } catch (e) { zone.innerHTML = '<p class="muted small">⚠️ Photo illisible.</p>'; }
    el.value = '';
  });
  C.act('ocrIA', async (el) => {
    const zone = C.$('#n-photo-zone'); el.disabled = true; el.textContent = '⏳ Lecture…';
    try { const t = await C.ia('ocr', { image: zone.dataset.img }); C.$('#n-texte').value += (C.$('#n-texte').value ? '\n\n' : '') + t; el.textContent = '✅ Texte ajouté — vérifie-le'; }
    catch (e) { el.textContent = '⚠️ ' + e.message; el.disabled = false; }
  });
  C.act('notionCreer', () => {
    const titre = C.$('#n-titre').value.trim(), texte = C.$('#n-texte').value.trim();
    if (!titre) { C.toast('Donne un titre à ta notion'); C.$('#n-titre').focus(); return; }
    const n = { id: C.uid(), titre, matiere: C.$('#n-mat').value, texte, etapes: {}, creeLe: Date.now(), at: Date.now() };
    C.state.notions.push(n); C.compter('notions'); C.save();
    C.go('apprendre/notion/' + n.id);
  });

  /* ======================= NOTION : 9 ÉTAPES ======================= */
  const ETAPES = [
    { id: 'sert', titre: 'À quoi ça sert ?', q: 'Où pourrais-tu utiliser ça : à l\'école, dans la vie, en stage, dans un métier ?', aide: (n) => interetsExemple(n) },
    { id: 'connais', titre: 'Qu\'est-ce que je connais déjà ?', q: 'Écris (ou dicte) tout ce que tu sais déjà sur ce sujet, même un petit bout. Ton cerveau accroche le nouveau à l\'ancien.', aide: () => 'Pense à un cours d\'avant, une vidéo, une situation de la vie. Même « je sais que ça parle de… » compte.' },
    { id: 'simple', titre: 'Explication simple', q: 'Après avoir lu ou écouté, redis l\'idée principale avec TES mots, en 2 ou 3 phrases.', aide: null, special: 'explication' },
    { id: 'exemple', titre: 'Un exemple concret', q: 'Trouve un exemple de la vraie vie (ou recopie celui du cours) et explique-le.', aide: (n) => interetsExemple(n, true) },
    { id: 'guide', titre: 'Exercice guidé', q: 'Écris un exercice de ton cours ou de ton cahier. On le fait ensemble, avec des indices progressifs.', aide: null, special: 'indices' },
    { id: 'autonome', titre: 'Entraînement autonome', q: 'Fais un exercice du même type, seul{e|}. Écris ta démarche ici.', aide: () => 'Si tu bloques : relis ce que tu as écrit à l\'étape « Exercice guidé ». Puis réessaie.' },
    { id: 'verif', titre: 'Je vérifie que j\'ai compris', q: 'Sans regarder ton cours : explique la notion comme si tu l\'apprenais à quelqu\'un. Puis compare avec ton cours.', aide: null, special: 'verif' },
    { id: 'reactiver', titre: 'Je prépare les réactivations', q: 'Crée 2 ou 3 cartes mémoire (une question / une réponse). Coachy te les reproposera demain, dans 3 jours, dans une semaine.', aide: null, special: 'cartes' },
    { id: 'transfert', titre: 'Je transfère', q: 'Invente une situation DIFFÉRENTE où cette notion sert (un autre exercice, un magasin, un stage…). Explique comment tu l\'utiliserais.', aide: (n) => interetsExemple(n, true), special: 'transfert' },
  ];
  function interetsExemple(n, concret) {
    const it = C.state.profil.interets[0];
    const base = it ? `Tu aimes « ${esc(it)} » : est-ce que cette notion pourrait servir là-dedans ?` : 'Pense à un magasin, une recette, un trajet, un stage.';
    return concret ? base + ' Par exemple : un prix, une quantité, un client, une étiquette, un horaire.' : base;
  }
  function notionById(id) { return C.state.notions.find((n) => n.id === id); }

  function ecranNotion(id, idx) {
    const n = notionById(id);
    if (!n) return ui.crumb('apprendre', 'Mon prof autrement') + ui.vide('Cette notion n\'existe plus.');
    idx = Math.max(0, Math.min(8, idx || 0));
    const e = ETAPES[idx];
    const val = (n.etapes || {})[e.id] || '';
    let h = `${ui.crumb('apprendre', 'Mon prof autrement')}
      <h1>${esc(n.titre)}</h1>
      <p class="muted small">${esc(n.matiere || '')}</p>
      ${ui.fold('🧰 Changer de mode', `<div class="grid">${MODES.map((m) => `<button class="tile" data-act="modeProf" data-arg="${m.id}|${n.id}"><span class="ico">${m.ico}</span><b>${m.titre}</b></button>`).join('')}</div>`)}
      <div class="card" style="margin-top:12px">
        ${ui.steps(idx + 1, 9)}
        <p class="muted small">Étape ${idx + 1} sur 9</p>
        <h2>${e.titre}</h2>
        <p>${C.acc(e.q)}</p>`;
    if (e.special === 'explication') h += blocExplication(n);
    if (e.aide) h += `<div class="bulle sobre small">💡 ${e.aide(n)}</div>`;
    if (e.special === 'indices') h += blocIndices(n);
    if (e.special === 'cartes') h += blocCartes(n);
    if (e.special !== 'cartes') {
      h += `<label class="lbl" for="et-val">Ma réponse</label>
        <textarea id="et-val" rows="5" data-input="etapeVal" data-arg="${n.id}|${e.id}">${esc(val)}</textarea>
        <div class="row" style="margin-top:8px">${ui.ecouter('et-val')}${C.state.reglages.audio ? ui.lire(e.titre + '. ' + C.acc(e.q)) : ''}</div>`;
    }
    if (e.special === 'verif') h += `<div class="row" style="margin-top:10px"><button class="btn" data-act="voirCours" data-arg="${n.id}">👀 Comparer avec mon cours</button></div>
      <div class="bulle">Après comparaison, qu'est-ce qui manquait ? Ce morceau-là, on en fait une carte mémoire à l'étape suivante.</div>`;
    if (e.special === 'transfert') h += `<button class="btn" style="margin-top:8px" data-act="transfertCarte" data-arg="${n.id}">🔁 En faire une question de transfert</button>`;
    h += `</div>
      <div class="row" style="margin-top:12px;justify-content:space-between">
        ${idx > 0 ? `<a class="btn" href="#/apprendre/notion/${n.id}/${idx - 1}">← Étape ${idx}</a>` : '<span></span>'}
        ${idx < 8 ? `<a class="btn primaire" href="#/apprendre/notion/${n.id}/${idx + 1}">Étape ${idx + 2} →</a>` : `<button class="btn sauge" data-act="notionFin" data-arg="${n.id}">J'ai fini ce parcours ✓</button>`}
      </div>
      ${ui.fold('📄 Outils de la notion', `<div class="row">
        <a class="btn" href="#/apprendre/carte/${n.id}">🗺️ Carte mentale</a>
        <button class="btn" data-act="ficheVisuelle" data-arg="${n.id}">🗂️ Fiche visuelle</button>
        <button class="btn" data-act="coursAudio" data-arg="${n.id}">🔊 Cours audio</button>
        <button class="btn" data-act="modeProf" data-arg="memoriser|${n.id}">🧠 Quiz / cartes</button>
        <button class="btn discret" data-act="notionSuppr" data-arg="${n.id}">Supprimer la notion</button></div>`)}`;
    return h;
  }
  function blocExplication(n) {
    if (!n.texte) return '<div class="bulle small">Tu n\'as pas ajouté de texte de cours. Écris ce que ton prof a expliqué, ou demande-lui la leçon.</div>';
    const m = morceaux(n.texte).slice(0, 40), mots = C.motsCles(n.texte, 6);
    let h = `<details class="fold" open><summary>📖 Mon cours en petits morceaux</summary><div class="fold-body">
      <p class="muted small">Lis un morceau à la fois. Les mots qui reviennent souvent sont en gras : ce sont sûrement les mots importants.</p>
      <ol>${m.map((x) => `<li style="margin-bottom:8px">${surligner(esc(x), mots)}</li>`).join('')}</ol>
      ${C.peutLire() ? `<button class="btn" data-act="coursAudio" data-arg="${n.id}">🔊 Écouter mon cours</button>` : ''}</div></details>`;
    if (mots.length) h += `<p class="small">🔑 Mots importants : ${mots.map((w) => `<span class="badge lavande">${esc(w)}</span>`).join(' ')}</p>`;
    if (C.iaDispo()) h += `<button class="btn sauge" data-act="iaExplique" data-arg="explique|${n.id}">💬 Coachy, explique-moi simplement</button><div id="ia-out"></div>`;
    return h;
  }
  function surligner(html, mots) {
    mots.forEach((m) => { html = html.replace(new RegExp('(' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<b>$1</b>'); });
    return html;
  }
  function blocIndices(n) {
    const ex = (n.etapes || {}).exo || '';
    return `<label class="lbl" for="exo">L'exercice</label>
      <textarea id="exo" rows="3" data-input="etapeVal" data-arg="${n.id}|exo" placeholder="Recopie ou dicte l'énoncé">${esc(ex)}</textarea>
      <div class="row" style="margin-top:8px">${ui.ecouter('exo')}<button class="btn" data-act="indice" data-arg="${n.id}">💡 Un indice</button></div>
      <div id="indices"></div>`;
  }
  function blocCartes(n) {
    const cartes = C.state.cartes.filter((c) => c.notionId === n.id);
    return `<div id="cartes-notion">${cartes.length ? `<ul class="liste">${cartes.map((c) => `<li><span>🃏</span><span class="grow"><b>${esc(c.recto)}</b><br><span class="muted small">${esc(c.verso)}</span></span></li>`).join('')}</ul>` : ''}</div>
      <label class="lbl" for="c-recto">Question</label><input id="c-recto" type="text" placeholder="Ex. : Comment calculer 20 % d'un prix ?">
      <label class="lbl" for="c-verso">Réponse</label><textarea id="c-verso" rows="2" placeholder="Ex. : prix × 20 ÷ 100"></textarea>
      <details class="fold" style="margin-top:8px"><summary>➕ Indice et exemple (facultatif)</summary><div class="fold-body">
        <label class="lbl" for="c-indice">Un indice</label><input id="c-indice" type="text">
        <label class="lbl" for="c-exemple">Un exemple</label><input id="c-exemple" type="text"></div></details>
      <div class="row" style="margin-top:10px"><button class="btn primaire" data-act="carteAjout" data-arg="${n.id}">Ajouter la carte</button>
      <button class="btn" data-act="cartesAuto" data-arg="${n.id}">✨ Proposer des cartes depuis mon cours</button></div>`;
  }

  let indiceNiveau = 0;
  const INDICES = [
    'Relis la consigne. Quel est le <b>mot-action</b> (calcule, explique, justifie…) ? Tu peux utiliser le décodeur de consigne.',
    'Qu\'est-ce que tu <b>as déjà</b> dans l\'énoncé (nombres, mots, documents) ? Qu\'est-ce que tu <b>cherches</b> ?',
    'Regarde l\'<b>exemple de ton cours</b> qui ressemble le plus. Quelle était la première étape ?',
    'Fais uniquement <b>la première étape</b>, même si tu n\'es pas sûr{e|}. Écris-la.',
    'Vérifie ta réponse : est-elle <b>logique</b> ? (un prix négatif, une durée de 300 h… = signal d\'erreur). Si tu bloques encore, note ta question pour ton prof : c\'est une très bonne question à poser.',
  ];
  C.act('indice', async (el, id) => {
    const n = notionById(id), zone = C.$('#indices');
    if (C.iaDispo() && n.etapes.exo) {
      el.disabled = true;
      try {
        const t = await C.ia('indice', { notion: n.titre, cours: (n.texte || '').slice(0, 6000), exercice: n.etapes.exo, niveau: indiceNiveau + 1, dejaDonnes: C.$$('#indices .bulle').map((b) => b.innerText) });
        zone.insertAdjacentHTML('beforeend', `<div class="bulle"><b>Indice ${indiceNiveau + 1}</b><br>${esc(t)}</div>`);
      } catch (e) { zone.insertAdjacentHTML('beforeend', `<div class="bulle sobre">⚠️ IA indisponible (${esc(e.message)}). Voici un indice de méthode :<br>${C.acc(INDICES[Math.min(indiceNiveau, 4)])}</div>`); }
      el.disabled = false;
    } else {
      zone.insertAdjacentHTML('beforeend', `<div class="bulle"><b>Indice ${indiceNiveau + 1}</b><br>${C.acc(INDICES[Math.min(indiceNiveau, 4)])}</div>`);
    }
    indiceNiveau++;
    if (indiceNiveau >= INDICES.length) el.textContent = '💡 Encore un indice';
  });
  C.onInput('etapeVal', (el) => {
    const [id, et] = el.dataset.arg.split('|'), n = notionById(id); if (!n) return;
    n.etapes = n.etapes || {}; n.etapes[et] = el.value; n.at = Date.now(); C.save();
  });
  C.act('voirCours', (el, id) => { const n = notionById(id); C.dialog('📄 Mon cours', n.texte ? `<p style="white-space:pre-wrap">${esc(n.texte)}</p>` : ui.vide('Pas de texte de cours enregistré.')); });
  C.act('carteAjout', (el, id) => {
    const recto = C.$('#c-recto').value.trim(), verso = C.$('#c-verso').value.trim();
    if (!recto || !verso) { C.toast('Écris une question ET une réponse'); return; }
    C.memoire.ajouter({ notionId: id, recto, verso, indice: C.$('#c-indice').value.trim(), exemple: C.$('#c-exemple').value.trim() });
    C.toast('🃏 Carte ajoutée. Première réactivation : maintenant !'); C.rerender();
  });
  C.act('cartesAuto', (el, id) => {
    const n = notionById(id);
    const props = [];
    C.phrases(n.texte || '').forEach((p) => {
      let m = p.match(/^(.{3,60}?)\s*(?::|=| est | sont | signifie | désigne | correspond à )\s*(.{3,160})$/i);
      if (m) props.push({ recto: (/[:=]/.test(p) ? m[1].trim() + ' ?' : 'Que veut dire « ' + m[1].trim() + ' » ?'), verso: m[2].replace(/[.;]$/, '').trim() });
    });
    if (!props.length) { C.dialog('✨ Cartes', '<p>Je n\'ai pas trouvé de définition toute faite (du type « mot : explication » ou « X est… ») dans ton cours. Écris tes cartes toi-même : c\'est d\'ailleurs ce qui aide le plus à retenir !</p>'); return; }
    C.dialog('✨ Cartes proposées', `<p class="muted small">Garde seulement celles qui te parlent. Tu peux les modifier ensuite.</p>
      ${props.slice(0, 8).map((p, i) => `<label class="switch"><span><b>${esc(p.recto)}</b><br><span class="muted small">${esc(p.verso)}</span></span><input type="checkbox" data-i="${i}" checked></label>`).join('')}
      <button class="btn primaire plein" data-act="cartesAutoOk" data-arg="${id}">Ajouter la sélection</button>`);
    C._props = props;
  });
  C.act('cartesAutoOk', (el, id) => {
    C.$$('#dlg-body input[data-i]:checked').forEach((cb) => { const p = C._props[+cb.dataset.i]; C.memoire.ajouter({ notionId: id, recto: p.recto, verso: p.verso }); });
    C.close(); C.toast('🃏 Cartes ajoutées'); C.rerender();
  });
  C.act('transfertCarte', (el, id) => {
    const n = notionById(id), t = (C.$('#et-val') || {}).value || '';
    if (!t.trim()) { C.toast('Écris d\'abord ta situation différente'); return; }
    C.memoire.ajouter({ notionId: id, recto: 'Situation nouvelle : ' + t.trim().slice(0, 200) + ' — comment j\'utilise « ' + n.titre + ' » ?', verso: 'Je repense aux étapes de la notion et je les applique à cette situation.', type: 'transfert' });
    C.toast('🔁 Question de transfert ajoutée au labo mémoire');
  });
  C.act('notionFin', (el, id) => {
    const n = notionById(id);
    C.state.reussites.push({ id: C.uid(), at: Date.now(), text: 'J\'ai fait le parcours complet de « ' + n.titre + ' »', auto: true });
    C.save();
    C.dialog('🎉 Parcours terminé', `<p>Bravo ! Tu as travaillé « ${esc(n.titre)} » en 9 étapes. Attention : <b>réussir aujourd'hui ne veut pas encore dire « acquis »</b>. C'est en réactivant demain, dans 3 jours et dans une semaine que ça s'installe pour de bon.</p>
      <p>Qu'est-ce qui t'a le plus aidé{e|} dans ce parcours ?</p>
      <div class="chips" data-groupe="aide-notion">${['Le découpage en morceaux', 'L\'écoute audio', 'L\'exemple concret', 'Les indices', 'Redire avec mes mots', 'Les cartes mémoire'].map((x) => `<button class="chip" data-act="toggle" data-val="${x}" aria-pressed="false">${x}</button>`).join('')}</div>
      <button class="btn primaire plein" style="margin-top:12px" data-act="notionFinOk">Garder comme découverte</button>`);
  });
  C.act('notionFinOk', () => {
    const sel = C.$$('[data-groupe="aide-notion"] [aria-pressed="true"]').map((b) => b.dataset.val);
    sel.forEach((s) => C.proposer('J\'apprends mieux grâce à : ' + s.toLowerCase(), 'Mon prof autrement', 'action'));
    C.close(); C.toast(sel.length ? '💡 Proposé à ton mode d\'emploi (à valider)' : 'Bien joué !'); C.go('apprendre');
  });
  C.act('notionSuppr', (el, id) => {
    if (!confirm('Supprimer cette notion ? Ses cartes mémoire seront aussi supprimées.')) return;
    C.state.notions = C.state.notions.filter((n) => n.id !== id);
    C.state.cartes = C.state.cartes.filter((c) => c.notionId !== id);
    C.save(); C.go('apprendre');
  });
  C.act('coursAudio', (el, id) => { const n = notionById(id); C.dire(n.titre + '. ' + (n.texte || 'Pas de texte de cours.')); C.toast('🔊 Lecture… (touche 🔊 en haut pour relancer)'); });
  C.act('ficheVisuelle', (el, id) => {
    const n = notionById(id), e = n.etapes || {};
    const bloc = (ico, t, v) => (v && String(v).trim() ? `<div class="card" style="margin-top:8px"><b>${ico} ${t}</b><p style="white-space:pre-wrap;margin:4px 0 0">${esc(v)}</p></div>` : '');
    const cartes = C.state.cartes.filter((c) => c.notionId === id);
    C.dialog('🗂️ Fiche visuelle', `<div id="fiche"><h2>${esc(n.titre)}</h2><p class="muted small">${esc(n.matiere || '')}</p>
      ${bloc('🎯', 'À quoi ça sert', e.sert)}${bloc('💬', 'Avec mes mots', e.simple)}${bloc('🛒', 'Exemple', e.exemple)}${bloc('🔁', 'Ailleurs, ça sert à…', e.transfert)}
      ${cartes.length ? `<div class="card" style="margin-top:8px"><b>🧠 À retenir</b><ul>${cartes.map((c) => `<li><b>${esc(c.recto)}</b> → ${esc(c.verso)}</li>`).join('')}</ul></div>` : ''}
      ${!e.sert && !e.simple && !e.exemple ? ui.vide('Remplis les étapes 1, 3 et 4 : ta fiche se construira toute seule.') : ''}</div>
      <button class="btn no-print" style="margin-top:12px" data-act="imprimer">🖨️ Imprimer / PDF</button>`);
  });
  C.act('imprimer', () => window.print());

  /* Modes : chaque mode mène à l'endroit le plus utile du parcours */
  C.act('modeProf', (el, arg) => {
    const [mode, id] = arg.split('|');
    const map = { explique: 2, autrement: 3, exercice: 4, memoriser: 7 };
    if (map[mode] != null) {
      if (mode === 'autrement') {
        C.dialog('🔄 Explique-moi autrement', `<p>Changeons d'angle :</p>
          <button class="choice" data-act="go" data-arg="apprendre/notion/${id}/3">🛒 Avec un exemple de la vraie vie</button>
          <button class="choice" data-act="go" data-arg="apprendre/carte/${id}">🗺️ Avec un dessin (carte mentale)</button>
          <button class="choice" data-act="coursAudio" data-arg="${id}">🔊 En l'écoutant au lieu de le lire</button>
          <button class="choice" data-act="go" data-arg="apprendre/notion/${id}/6">🗣️ En l'expliquant moi-même à quelqu'un</button>
          ${C.iaDispo() ? `<button class="choice" data-act="iaExplique" data-arg="autrement|${id}">✨ Coachy, explique-le autrement</button><div id="ia-out"></div>` : ''}`);
        return;
      }
      C.go('apprendre/notion/' + id + '/' + map[mode]); return;
    }
    if (mode === 'controle') { C.go('memoire/controle/' + id); return; }
    if (mode === 'brevet') { C.go('apprendre/brevet'); return; }
    if (mode === 'oral') { C.go('apprendre/oral'); return; }
  });
  C.act('iaExplique', async (el, arg) => {
    const [mode, id] = arg.split('|'), n = notionById(id), out = C.$('#ia-out');
    el.disabled = true; out.innerHTML = '<p class="muted">⏳ Coachy réfléchit…</p>';
    try {
      const t = await C.ia(mode, { notion: n.titre, matiere: n.matiere, cours: (n.texte || '').slice(0, 8000) });
      out.innerHTML = `<div class="bulle" style="white-space:pre-wrap">${esc(t)}</div>${ui.lire(t)}<p class="muted small">L'IA peut se tromper : compare toujours avec ta leçon.</p>`;
    } catch (e) { out.innerHTML = `<div class="bulle sobre">⚠️ IA indisponible : ${esc(e.message)}</div>`; }
    el.disabled = false;
  });

  /* ======================= DÉCODEUR DE CONSIGNE ======================= */
  function ecranConsigne() {
    return `${ui.crumb('apprendre', 'Mon prof autrement')}
      <h1>🧩 Décoder une consigne</h1>
      <p class="muted">Je découpe la consigne en morceaux, je repère les mots-actions et les données. Ça marche sans internet.</p>
      <div class="card"><label class="lbl" for="cons">La consigne</label>
      <textarea id="cons" rows="4" placeholder="Ex. : Calcule le prix après une remise de 20 %. Justifie ta réponse."></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primaire" data-act="decoder">Décoder</button>${ui.ecouter('cons')}<button class="btn" data-act="lireConsigne">🔊 Écouter</button></div></div>
      <div id="dec-out" class="card" style="margin-top:12px">${rendreDecodage([])}</div>`;
  }
  C.act('decoder', () => { C.$('#dec-out').innerHTML = C.acc(rendreDecodage(C.decoder(C.$('#cons').value))); C.compter('consignes'); });
  C.act('lireConsigne', () => C.dire(C.$('#cons').value || 'Écris d\'abord la consigne.'));
  C.ouvrirDecodeur = function () {
    C.dialog('🧩 Décoder la consigne', `<textarea id="cons" rows="4" placeholder="Colle ou dicte la consigne"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primaire" data-act="decoder">Décoder</button>${ui.ecouter('cons')}</div><div id="dec-out" style="margin-top:10px"></div>`);
  };

  /* ======================= CARTE MENTALE ======================= */
  function ecranCarteMentale(id) {
    const n = notionById(id);
    if (!n) return ui.vide('Notion introuvable.');
    n.carte = n.carte || C.motsCles(n.texte || '', 5).map((m) => ({ t: m }));
    return `${ui.crumb('apprendre/notion/' + id, n.titre)}
      <h1>🗺️ Carte mentale</h1><p class="muted small">Au centre : la notion. Autour : les idées clés (6 maximum). Modifie les branches, la carte se redessine.</p>
      <div class="card" id="cm-svg">${svgCarte(n)}</div>
      <div class="card">${[0, 1, 2, 3, 4, 5].map((i) => `<input type="text" style="margin-bottom:8px" placeholder="Branche ${i + 1}" value="${esc((n.carte[i] || {}).t || '')}" data-input="cmBranche" data-arg="${id}|${i}" maxlength="40">`).join('')}
      <button class="btn" data-act="imprimer">🖨️ Imprimer</button></div>`;
  }
  function svgCarte(n) {
    const br = (n.carte || []).filter((b) => b && b.t && b.t.trim()), W = 340, H = 300, cx = W / 2, cy = H / 2;
    const col = ['#4E7FA8', '#6F9479', '#8E7FC0', '#D98C6A', '#4E7FA8', '#6F9479'];
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Carte mentale de ${esc(n.titre)}" style="width:100%;height:auto;font-family:inherit">`;
    br.forEach((b, i) => {
      const a = (i / br.length) * Math.PI * 2 - Math.PI / 2, x = cx + Math.cos(a) * 112, y = cy + Math.sin(a) * 100;
      s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${col[i]}" stroke-width="3" stroke-linecap="round"/>`;
      s += `<rect x="${x - 56}" y="${y - 17}" width="112" height="34" rx="12" fill="#fff" stroke="${col[i]}" stroke-width="2"/>`;
      s += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="12" fill="#24323C">${esc(b.t.slice(0, 18))}</text>`;
    });
    s += `<ellipse cx="${cx}" cy="${cy}" rx="70" ry="30" fill="#E3EDF6" stroke="#4E7FA8" stroke-width="2"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#24323C">${esc(n.titre.slice(0, 20))}</text></svg>`;
    return s;
  }
  C.onInput('cmBranche', (el) => {
    const [id, i] = el.dataset.arg.split('|'), n = notionById(id);
    n.carte = n.carte || []; n.carte[+i] = { t: el.value }; C.save();
    C.$('#cm-svg').innerHTML = svgCarte(n);
  });

  /* ======================= ORAL ======================= */
  let rec = null, recChunks = [], recT = null, recSec = 0;
  function ecranOral() {
    const ok = !!(navigator.mediaDevices && window.MediaRecorder);
    return `${ui.crumb('apprendre', 'Mon prof autrement')}
      <h1>🎤 M'entraîner à l'oral</h1>
      <p class="muted">Tu t'enregistres, tu te réécoutes, tu coches ce qui va bien. L'enregistrement reste sur ton appareil et disparaît quand tu quittes la page.</p>
      <div class="card"><label class="lbl" for="oral-sujet">Mon sujet</label><input id="oral-sujet" type="text" placeholder="Ex. : présenter mon stage">
      ${ui.fold('🧭 Mon plan en 3 parties', '<ol><li><b>Introduction :</b> je me présente et j\'annonce mon sujet.</li><li><b>Développement :</b> 2 ou 3 idées, chacune avec un exemple.</li><li><b>Conclusion :</b> ce que j\'ai appris, ce que j\'aimerais faire ensuite.</li></ol><p class="muted small">Pour le brevet et le CFG, vérifie les attentes exactes avec ton collège.</p>')}
      ${ok ? `<div class="timer" id="rec-t">00:00</div>
        <div class="row" style="justify-content:center"><button class="btn primaire" data-act="recStart" id="rec-b">⏺️ M'enregistrer</button><button class="btn" data-act="recStop" disabled id="rec-s">⏹️ Arrêter</button></div>
        <div id="rec-out" style="margin-top:12px"></div>` : '<div class="bulle sobre">L\'enregistrement n\'est pas disponible sur ce navigateur. Tu peux t\'entraîner avec le dictaphone de ton téléphone, puis cocher la grille ci-dessous.</div>'}
      </div>
      <div class="card"><h2>Ma grille</h2>
      ${['J\'ai parlé assez fort', 'J\'ai parlé lentement', 'J\'ai suivi mon plan', 'J\'ai donné des exemples', 'J\'ai regardé mon public (ou la caméra)', 'J\'ai conclu'].map((x) => `<label class="switch"><span>${x}</span><input type="checkbox"></label>`).join('')}
      </div>`;
  }
  C.act('recStart', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      rec = new MediaRecorder(stream); recChunks = [];
      rec.ondataavailable = (e) => recChunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const url = URL.createObjectURL(new Blob(recChunks, { type: rec.mimeType || 'audio/webm' }));
        const o = C.$('#rec-out'); if (o) o.innerHTML = `<audio controls src="${url}" style="width:100%"></audio><p class="bulle">Réécoute-toi. Une chose qui va bien ? Une chose à améliorer la prochaine fois ?</p>`;
      };
      rec.start(); recSec = 0;
      C.$('#rec-b').disabled = true; C.$('#rec-s').disabled = false;
      recT = setInterval(() => { recSec++; const t = C.$('#rec-t'); if (t) t.textContent = String(Math.floor(recSec / 60)).padStart(2, '0') + ':' + String(recSec % 60).padStart(2, '0'); }, 1000);
    } catch (e) { C.toast('Micro refusé ou indisponible.'); }
  });
  C.act('recStop', () => { if (rec && rec.state !== 'inactive') rec.stop(); clearInterval(recT); C.$('#rec-b').disabled = false; C.$('#rec-s').disabled = true; C.compter('oral'); });
  const ancienStop = C.stopTimers;
  C.stopTimers = function () { if (ancienStop) ancienStop(); clearInterval(recT); if (rec && rec.state === 'recording') rec.stop(); indiceNiveau = 0; };

  /* ======================= BREVET / CFG ======================= */
  function ecranBrevet() {
    const s = C.state; s.examen = s.examen || { epreuves: [] };
    const ep = s.examen.epreuves;
    return `${ui.crumb('apprendre', 'Mon prof autrement')}
      <h1>🎓 Préparer le brevet et le CFG</h1>
      <div class="bulle sobre small">Les règles des examens changent parfois. <b>Vérifie la liste de tes épreuves, les dates et tes aménagements avec ton collège</b>, puis note-les ici.</div>
      <div class="card"><h2>Mes épreuves</h2>
        ${ep.length ? `<ul class="liste">${ep.map((x, i) => `<li><span>${x.fait ? '✅' : '📌'}</span><span class="grow"><b>${esc(x.nom)}</b>${x.date ? `<br><span class="muted small">${esc(x.date)}</span>` : ''}</span><button class="btn discret" data-act="epFait" data-arg="${i}">${x.fait ? 'Annuler' : 'Prêt{e|} ✓'}</button></li>`).join('')}</ul>` : ui.vide('Ajoute tes épreuves (ex. : Français, Maths, Oral…).')}
        <div class="row" style="margin-top:10px"><input id="ep-nom" type="text" placeholder="Nom de l'épreuve" style="flex:2;min-width:160px"><input id="ep-date" type="date" style="flex:1;min-width:140px"><button class="btn primaire" data-act="epAjout">Ajouter</button></div>
        ${!ep.length ? '<button class="btn discret" data-act="epModele">Pré-remplir avec une liste type (à vérifier)</button>' : ''}
      </div>
      <div class="grid two" style="margin-top:12px">
        ${ui.tile('memoire/controle', '📝', 'Mon plan de révision', 'Réactivations jusqu\'au jour J', 'sable')}
        ${ui.tile('apprendre/oral', '🎤', 'Préparer mon oral', 'S\'enregistrer et se réécouter', 'lavande')}
        ${ui.tile('soin/examen', '🌡️', 'Gérer le stress de l\'examen', 'Avant, pendant, après', 'sauge')}
        ${ui.tile('apprendre/consigne', '🧩', 'Décoder les sujets', 'Mots-actions et données', 'bleu')}
      </div>`;
  }
  C.act('epAjout', () => { const n = C.$('#ep-nom').value.trim(); if (!n) return; C.state.examen.epreuves.push({ nom: n, date: C.$('#ep-date').value, fait: false }); C.save(); C.rerender(); });
  C.act('epFait', (el, i) => { const e = C.state.examen.epreuves[+i]; e.fait = !e.fait; C.save(); C.rerender(); });
  C.act('epModele', () => {
    const p = C.state.profil.objectifs;
    const l = [];
    if (p.includes('DNB')) l.push('DNB · Français (écrit)', 'DNB · Mathématiques (écrit)', 'DNB · Histoire-géo / EMC (écrit)', 'DNB · Sciences (écrit)', 'DNB · Oral');
    if (p.includes('CFG')) l.push('CFG · Oral');
    if (!l.length) l.push('Mon épreuve 1');
    l.forEach((n) => C.state.examen.epreuves.push({ nom: n + ' — à vérifier', date: '', fait: false }));
    C.save(); C.rerender();
  });
})();
