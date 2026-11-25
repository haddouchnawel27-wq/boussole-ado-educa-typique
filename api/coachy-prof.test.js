const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('./coachy-prof');
const { normalize, systemPrompt, userPrompt, buildRequest } = handler._internals;

function fakeRes() {
  return { code: 0, body: null, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
}

test('le profil envoyé à l’IA ne garde que des besoins fonctionnels connus (jamais un prénom)', () => {
  const d = normalize({ mode: 'explique', profil: { prenom: 'X', besoins: ['attention', 'diagnostic-inventé'], appuis: ['oral'], classe: '3e' } });
  assert.equal(d.profil.prenom, undefined);
  assert.deepEqual(d.profil.besoins, ['attention fluctuante']);
  assert.doesNotMatch(systemPrompt(d), /diagnostic-inventé/);
});

test('le mode indice interdit de donner la réponse', () => {
  const d = normalize({ mode: 'indice', exercice: 'Calcule 20 % de 50 €', niveau: 2 });
  assert.match(userPrompt(d), /SANS donner la réponse finale/);
  assert.match(systemPrompt(d), /Ne donne JAMAIS la réponse finale/);
});

test('mode inconnu et image invalide sont refusés à la normalisation', () => {
  assert.equal(normalize({ mode: 'hack' }).mode, '');
  assert.equal(normalize({ mode: 'ocr', image: 'javascript:alert(1)' }).image, '');
});

test('la requête OCR envoie l’image et n’est pas stockée', () => {
  const req = buildRequest(normalize({ mode: 'ocr', image: 'data:image/jpeg;base64,AAAA' }));
  assert.equal(req.store, false);
  assert.equal(req.input[0].content[1].image_url, 'data:image/jpeg;base64,AAAA');
});

test('sans configuration serveur, l’API répond 503 sans appeler l’IA', async () => {
  delete process.env.OPENAI_API_KEY; delete process.env.COACHY_ACCESS_CODE;
  const res = fakeRes();
  await handler({ method: 'POST', headers: {}, body: { mode: 'ping' }, socket: {} }, res);
  assert.equal(res.code, 503);
});

test('un mauvais code d’accès est refusé', async () => {
  process.env.OPENAI_API_KEY = 'test'; process.env.COACHY_ACCESS_CODE = 'bon-code';
  const res = fakeRes();
  await handler({ method: 'POST', headers: { 'x-coachy-code': 'mauvais' }, body: { mode: 'ping' }, socket: {} }, res);
  assert.equal(res.code, 401);
  const ok = fakeRes();
  await handler({ method: 'POST', headers: { 'x-coachy-code': 'bon-code' }, body: { mode: 'ping' }, socket: {} }, ok);
  assert.equal(ok.code, 200);
});
