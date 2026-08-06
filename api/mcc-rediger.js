const crypto = require('node:crypto');

const MODEL_PRICES = {
  'gpt-5.6-terra': { input: 2.5, output: 15 },
  'gpt-5.6-sol': { input: 5, output: 30 },
};

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 12;
const rateBuckets = new Map();

const EDITORIAL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['hooks', 'angles', 'post', 'whatsapp', 'telegram', 'carousel', 'visual', 'sources', 'controls'],
  properties: {
    hooks: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'string' } },
    angles: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object', additionalProperties: false, required: ['title', 'rationale'],
        properties: { title: { type: 'string' }, rationale: { type: 'string' } },
      },
    },
    post: {
      type: 'object', additionalProperties: false, required: ['title', 'text', 'cta'],
      properties: { title: { type: 'string' }, text: { type: 'string' }, cta: { type: 'string' } },
    },
    whatsapp: { type: 'string' },
    telegram: { type: 'string' },
    carousel: {
      type: 'object', additionalProperties: false, required: ['title', 'slides'],
      properties: {
        title: { type: 'string' },
        slides: {
          type: 'array', minItems: 5, maxItems: 9,
          items: {
            type: 'object', additionalProperties: false, required: ['title', 'text'],
            properties: { title: { type: 'string' }, text: { type: 'string' } },
          },
        },
      },
    },
    visual: {
      type: 'object', additionalProperties: false, required: ['format', 'headline', 'direction'],
      properties: { format: { type: 'string' }, headline: { type: 'string' }, direction: { type: 'string' } },
    },
    sources: {
      type: 'object', additionalProperties: false, required: ['internal', 'external', 'verification'],
      properties: {
        internal: {
          type: 'array',
          items: {
            type: 'object', additionalProperties: false, required: ['title', 'usage'],
            properties: { title: { type: 'string' }, usage: { type: 'string' } },
          },
        },
        external: {
          type: 'array',
          items: {
            type: 'object', additionalProperties: false, required: ['title', 'url', 'usage'],
            properties: { title: { type: 'string' }, url: { type: 'string' }, usage: { type: 'string' } },
          },
        },
        verification: { type: 'array', items: { type: 'string' } },
      },
    },
    controls: {
      type: 'object', additionalProperties: false,
      required: ['copyright', 'pedagogy', 'neuropedagogy', 'accuracy'],
      properties: {
        copyright: { type: 'string' }, pedagogy: { type: 'string' },
        neuropedagogy: { type: 'string' }, accuracy: { type: 'string' },
      },
    },
  },
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
  if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}

function limitedText(value, max) {
  return String(value || '').replace(/\u0000/g, '').trim().slice(0, max);
}

function normalizePayload(raw) {
  let input = raw && typeof raw === 'object' ? raw : {};
  if (typeof raw === 'string') {
    try { input = JSON.parse(raw); } catch (error) { input = {}; }
  }
  const resources = Array.isArray(input.resources) ? input.resources.slice(0, 6) : [];
  let remaining = 60000;
  const cleanResources = resources.map((resource) => {
    const content = limitedText(resource?.content, Math.min(18000, remaining));
    remaining = Math.max(0, remaining - content.length);
    return {
      title: limitedText(resource?.title, 180) || 'Ressource personnelle',
      content,
      sourceFormat: limitedText(resource?.sourceFormat, 30),
    };
  }).filter((resource) => resource.content);

  return {
    topic: limitedText(input.topic, 500),
    audience: limitedText(input.audience, 120),
    objective: limitedText(input.objective, 160),
    platform: limitedText(input.platform, 60),
    hook: limitedText(input.hook, 800),
    message: limitedText(input.message, 4000),
    closing: limitedText(input.closing, 1000),
    currentDraft: limitedText(input.currentDraft, 8000),
    resources: cleanResources,
    useWeb: input.useWeb === true,
    depth: input.depth === 'deep' ? 'deep' : 'standard',
  };
}

function extractOutputText(response) {
  return (response.output || []).flatMap((item) => item.type === 'message' ? (item.content || []) : [])
    .filter((content) => content.type === 'output_text')
    .map((content) => content.text || '')
    .join('\n')
    .trim();
}

function extractWebSources(response) {
  const found = [];
  for (const item of response.output || []) {
    if (item.type !== 'message') continue;
    for (const content of item.content || []) {
      for (const annotation of content.annotations || []) {
        const citation = annotation.type === 'url_citation' ? annotation : annotation.url_citation;
        if (citation?.url) found.push({
          title: limitedText(citation.title, 240) || 'Source externe',
          url: citation.url,
          usage: 'Source consultée par la recherche Web pour étayer la rédaction.',
        });
      }
    }
  }
  return [...new Map(found.map((source) => [source.url, source])).values()];
}

function parseJsonOutput(text) {
  const clean = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(clean);
}

function estimateCost(model, usage) {
  const prices = MODEL_PRICES[model];
  const inputTokens = Number(usage?.input_tokens || 0);
  const outputTokens = Number(usage?.output_tokens || 0);
  return Number((((inputTokens * prices.input) + (outputTokens * prices.output)) / 1000000).toFixed(6));
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });

  const apiKey = process.env.OPENAI_API_KEY;
  const accessCode = process.env.MCC_ACCESS_CODE;
  if (!apiKey || !accessCode) return res.status(503).json({ error: "Le moteur IA n'est pas encore configuré sur l'hébergement." });
  if (!safeEqual(req.headers['x-mcc-access-code'], accessCode)) return res.status(401).json({ error: 'Code privé IA incorrect.' });

  const size = Number(req.headers['content-length'] || 0);
  if (size > 180000) return res.status(413).json({ error: 'Le brief est trop volumineux. Sélectionne moins de ressources.' });
  if (!consumeRateLimit(readClientIp(req))) return res.status(429).json({ error: 'Limite de protection atteinte. Réessaie dans une heure.' });

  const brief = normalizePayload(req.body);
  if (!brief.topic) return res.status(400).json({ error: 'Le sujet est obligatoire.' });
  if (!brief.message && !brief.currentDraft && !brief.resources.length) {
    return res.status(400).json({ error: 'Ajoute ton idée essentielle, un brouillon ou une ressource.' });
  }

  const model = brief.depth === 'deep' ? 'gpt-5.6-sol' : 'gpt-5.6-terra';
  const systemPrompt = `Tu es le moteur éditorial de Mon Chargé de Com. Tu réunis les compétences d'une ingénieure pédagogique, d'une neuropédagogue, d'une social media manager, d'une community manager, d'une créatrice de contenu et d'une rédactrice social media.

Produis une rédaction originale, claire, structurée, chaleureuse et publiable en français. La praticienne reste seule décisionnaire. N'établis aucun diagnostic et n'invente aucun fait, chiffre, étude, auteur, citation, URL ou consensus.

Hiérarchie des preuves :
1. Les ressources personnelles fournies sont la base prioritaire. Paraphrase-les sans longs extraits et indique précisément lesquelles ont servi.
2. Si la recherche Web est activée, complète uniquement avec des sources primaires, institutionnelles ou professionnelles fiables et récentes. Les citations Web réelles seront contrôlées par le serveur.
3. Tout point insuffisamment étayé va dans « verification » et ne doit pas être formulé comme un fait certain.

Adapte la charge cognitive au public : phrases lisibles, une idée principale par paragraphe, progression explicite, exemples concrets, aucune infantilisation. Prépare un vrai post complet, une version WhatsApp plus directe, une version Telegram structurée et un carrousel. Le CTA doit respecter le mot de fin demandé lorsqu'il est fourni. Le contrôle copyright doit confirmer la reformulation et signaler tout passage à revoir.`;

  const requestBody = {
    model,
    store: false,
    reasoning: { effort: brief.depth === 'deep' ? 'medium' : 'low' },
    input: [
      { role: 'system', content: [{ type: 'input_text', text: systemPrompt }] },
      { role: 'user', content: [{ type: 'input_text', text: `Voici le brief validé par l'utilisatrice. Respecte-le et retourne uniquement le résultat structuré demandé.\n\n${JSON.stringify(brief)}` }] },
    ],
    text: {
      verbosity: 'high',
      format: { type: 'json_schema', name: 'editorial_package', strict: true, schema: EDITORIAL_SCHEMA },
    },
    max_output_tokens: 7000,
  };
  if (brief.useWeb) requestBody.tools = [{ type: 'web_search' }];

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const response = await openAiResponse.json();
    if (!openAiResponse.ok) {
      const status = openAiResponse.status === 429 ? 429 : 502;
      const message = openAiResponse.status === 429
        ? 'Le crédit ou la limite OpenAI est atteint. Vérifie la page Usage.'
        : "La rédaction IA n'a pas abouti. Réessaie dans un instant.";
      return res.status(status).json({ error: message });
    }

    const outputText = extractOutputText(response);
    if (!outputText) return res.status(502).json({ error: "L'IA n'a pas renvoyé de texte exploitable." });
    const result = parseJsonOutput(outputText);
    result.sources = result.sources || { internal: [], external: [], verification: [] };
    result.sources.external = brief.useWeb ? extractWebSources(response) : [];

    return res.status(200).json({
      result,
      meta: {
        model,
        usedWeb: brief.useWeb,
        inputTokens: Number(response.usage?.input_tokens || 0),
        outputTokens: Number(response.usage?.output_tokens || 0),
        estimatedCostUsd: estimateCost(model, response.usage),
      },
    });
  } catch (error) {
    return res.status(502).json({ error: "La connexion au moteur IA a échoué. Vérifie Internet puis réessaie." });
  }
};
