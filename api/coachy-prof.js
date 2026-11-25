/* Coachy 2.0 — « Mon prof autrement », moteur IA côté serveur.
   - La clé API reste ici (variable d'environnement), jamais dans l'appli.
   - Accès protégé par un code (COACHY_ACCESS_CODE) que Nawel donne à l'ado.
   - Ne reçoit qu'un profil FONCTIONNEL (besoins, appuis, intérêts), jamais
     le prénom ni de donnée médicale. Rien n'est stocké (store:false).
   - Pédagogie : étayage, indices progressifs, jamais la réponse d'un exercice.
   Même hébergeur et même fournisseur que api/mcc-rediger.js (OPENAI_API_KEY). */
const crypto = require('node:crypto');

const MODEL = process.env.COACHY_MODEL || 'gpt-5.6-terra';
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 40;
const rateBuckets = new Map();
const MODES = ['ping', 'explique', 'autrement', 'indice', 'ocr'];

const BESOINS = {
  attention: 'attention fluctuante', lire: 'lecture, écriture et calcul coûteux', visuel: 'fatigue visuelle sur les pages chargées',
  consignes: 'consignes longues difficiles à suivre', demarrer: 'difficulté à démarrer et à s’organiser', memoire: 'mémorisation peu durable',
  transfert: 'difficulté à transférer une notion dans un autre contexte', stress: 'anxiété de performance', confiance: 'manque de confiance en soi', fatigue: 'fatigabilité importante',
};
const APPUIS = {
  oral: 'compétences verbales et expression orale', ordi: 'à l’aise avec l’ordinateur', volonte: 'volontaire', concret: 'intérêt pour le commerce et le concret',
  comprendre: 'comprend bien quand on explique', objectif: 'motivé·e par un objectif',
};

function safeEqual(received, expected) {
  const left = Buffer.from(String(received || ''));
  const right = Buffer.from(String(expected || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function readClientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}
function consumeRateLimit(key) {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= WINDOW_MS) { rateBuckets.set(key, { startedAt: now, count: 1 }); return true; }
  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}
function txt(v, max) { return String(v == null ? '' : v).replace(/\u0000/g, '').slice(0, max); }
function liste(v, dict) { return (Array.isArray(v) ? v : []).filter((k) => Object.prototype.hasOwnProperty.call(dict, k)).map((k) => dict[k]); }

function normalize(raw) {
  const b = raw && typeof raw === 'object' ? raw : {};
  const p = b.profil && typeof b.profil === 'object' ? b.profil : {};
  const image = typeof b.image === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(b.image) && b.image.length < 3_000_000 ? b.image : '';
  return {
    mode: MODES.includes(b.mode) ? b.mode : '',
    notion: txt(b.notion, 200), matiere: txt(b.matiere, 80), cours: txt(b.cours, 8000), exercice: txt(b.exercice, 2000),
    niveau: Math.max(1, Math.min(5, Number(b.niveau) || 1)),
    dejaDonnes: (Array.isArray(b.dejaDonnes) ? b.dejaDonnes : []).slice(0, 6).map((x) => txt(x, 600)),
    image,
    profil: {
      classe: txt(p.classe, 20),
      objectifs: (Array.isArray(p.objectifs) ? p.objectifs : []).filter((o) => ['DNB', 'CFG', 'stage', 'orientation'].includes(o)),
      besoins: liste(p.besoins, BESOINS), appuis: liste(p.appuis, APPUIS),
      interets: (Array.isArray(p.interets) ? p.interets : []).slice(0, 6).map((x) => txt(x, 40)),
      energie: ['basse', 'moyenne', 'haute', 'inconnue'].includes(p.energie) ? p.energie : 'inconnue',
    },
  };
}

function systemPrompt(d) {
  const p = d.profil;
  return `Tu es « Coachy », le prof autrement d'Educa-Typique : un assistant pédagogique pour adolescent·es neuroatypiques, construit avec une neuropédagogue.
Tu tutoies l'élève, avec chaleur et respect, sans jamais l'infantiliser.

PROFIL FONCTIONNEL (pas un diagnostic) :
- Classe : ${p.classe || 'non précisée'} ; objectifs : ${p.objectifs.join(', ') || 'non précisés'}
- Ce qui lui coûte : ${p.besoins.join(' ; ') || 'non précisé'}
- Ses points d'appui : ${p.appuis.join(' ; ') || 'non précisés'}
- Centres d'intérêt : ${p.interets.join(', ') || 'non précisés'}
- Énergie du jour : ${p.energie}${p.energie === 'basse' ? ' → fais TRÈS court, une seule idée, propose une pause.' : ''}

RÈGLES DE FORME (neuroergonomie) :
- Phrases courtes. Une idée par ligne. 120 mots maximum sauf demande contraire.
- Pas de Markdown, pas d'astérisques, pas de tableaux. Listes simples avec « - » si utile.
- Vocabulaire simple ; si un mot technique est indispensable, explique-le entre parenthèses.
- Exemples concrets, de préférence liés au commerce, aux prix, à la vie quotidienne ou aux centres d'intérêt.

RÈGLES DE FOND :
- Ne donne JAMAIS la réponse finale d'un exercice. Étaye : indices progressifs, questions, méthode.
- N'invente aucun fait. Si le cours fourni est incomplet ou ambigu, dis-le et invite à vérifier avec le professeur.
- Aucun diagnostic, aucune remarque sur la santé. Valorise l'effort, jamais de jugement.
- Si l'élève exprime une détresse ou un danger, invite-la/le à parler à un adulte de confiance et rappelle le 3114 (24 h/24) ou le 112.`;
}

function userPrompt(d) {
  const ctx = `Notion : ${d.notion || 'non précisée'}${d.matiere ? ' (' + d.matiere + ')' : ''}\n\nCOURS FOURNI PAR L'ÉLÈVE :\n${d.cours || '(aucun texte de cours)'}`;
  if (d.mode === 'explique') return `${ctx}\n\nTÂCHE : explique cette notion simplement, dans cet ordre :\n1. À quoi ça sert (une phrase).\n2. L'idée principale en 2 ou 3 phrases courtes.\n3. Un exemple concret de la vie quotidienne.\n4. Une question pour vérifier que l'élève a compris (sans la réponse).`;
  if (d.mode === 'autrement') return `${ctx}\n\nTÂCHE : l'élève n'a pas compris la première explication. Explique AUTREMENT : par une analogie concrète (idéalement liée à ses centres d'intérêt ou au commerce), puis redis l'idée en une phrase, puis propose de la redire avec ses mots.`;
  if (d.mode === 'indice') return `${ctx}\n\nEXERCICE :\n${d.exercice}\n\nINDICES DÉJÀ DONNÉS :\n${d.dejaDonnes.join('\n---\n') || 'aucun'}\n\nTÂCHE : donne UNIQUEMENT l'indice n°${d.niveau} (sur 5), plus précis que les précédents mais SANS donner la réponse finale ni le résultat. Niveau 1 = reformuler la consigne ; 2 = repérer les données ; 3 = méthode du cours ; 4 = première étape guidée ; 5 = vérifier sa démarche. 60 mots maximum. Termine par une question qui relance l'élève.`;
  return '';
}

function extractOutputText(response) {
  return (response.output || []).flatMap((item) => (item.type === 'message' ? item.content || [] : []))
    .filter((c) => c.type === 'output_text').map((c) => c.text || '').join('\n').trim();
}

function buildRequest(d) {
  if (d.mode === 'ocr') {
    return {
      model: MODEL, store: false, max_output_tokens: 2500,
      input: [{ role: 'user', content: [
        { type: 'input_text', text: 'Recopie fidèlement, en texte brut, tout le texte lisible de cette photo de cours ou d’exercice, dans l’ordre de lecture. N’ajoute rien, ne corrige rien, n’explique rien. Si un passage est illisible, écris [illisible].' },
        { type: 'input_image', image_url: d.image },
      ] }],
    };
  }
  return {
    model: MODEL, store: false, max_output_tokens: 900, reasoning: { effort: 'low' },
    input: [
      { role: 'system', content: [{ type: 'input_text', text: systemPrompt(d) }] },
      { role: 'user', content: [{ type: 'input_text', text: userPrompt(d) }] },
    ],
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });

  const apiKey = process.env.OPENAI_API_KEY;
  const accessCode = process.env.COACHY_ACCESS_CODE;
  if (!apiKey || !accessCode) return res.status(503).json({ error: "L'IA de Coachy n'est pas encore configurée sur l'hébergement." });
  if (!safeEqual(req.headers['x-coachy-code'], accessCode)) return res.status(401).json({ error: "Code d'accès incorrect." });
  if (Number(req.headers['content-length'] || 0) > 3_200_000) return res.status(413).json({ error: 'Envoi trop volumineux.' });
  if (!consumeRateLimit(readClientIp(req))) return res.status(429).json({ error: 'Beaucoup de demandes : fais une pause et réessaie dans une heure.' });

  const d = normalize(req.body);
  if (!d.mode) return res.status(400).json({ error: 'Mode inconnu.' });
  if (d.mode === 'ping') return res.status(200).json({ text: 'ok' });
  if (d.mode === 'ocr' && !d.image) return res.status(400).json({ error: 'Photo manquante ou format non pris en charge.' });
  if (d.mode === 'indice' && !d.exercice) return res.status(400).json({ error: "Écris d'abord l'exercice." });
  if ((d.mode === 'explique' || d.mode === 'autrement') && !d.cours && !d.notion) return res.status(400).json({ error: 'Ajoute le texte de ton cours.' });

  try {
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildRequest(d)),
    });
    const response = await r.json();
    if (!r.ok) return res.status(r.status === 429 ? 429 : 502).json({ error: r.status === 429 ? 'Limite IA atteinte pour le moment.' : "L'IA n'a pas répondu correctement. Réessaie." });
    const text = extractOutputText(response).replace(/\*+/g, '');
    if (!text) return res.status(502).json({ error: "L'IA n'a pas renvoyé de texte." });
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: 'Connexion au moteur IA impossible.' });
  }
};

module.exports._internals = { normalize, systemPrompt, userPrompt, buildRequest };
