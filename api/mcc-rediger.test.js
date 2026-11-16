const test = require('node:test');
const assert = require('node:assert/strict');
const { _internals } = require('./mcc-rediger');

test('le contrat conserve l’accroche et le mot de fin demandés', () => {
  const brief = {
    topic: 'Parentalité apaisée',
    hook: '« Parentalité apaisée » ne veut pas dire être un parent parfait.',
    closing: 'Prends soin de toi, et reviens quand tu veux.',
  };
  const result = _internals.enforceEditorialBrief({
    post: {
      title: 'POST : Parentalité apaisée',
      text: 'Trois conseils génériques.\n\nPrends soin de toi, et reviens quand tu veux.',
      cta: 'CTA : Enregistre ce post.',
    },
  }, brief);

  assert.match(result.post.text, /^« Parentalité apaisée » ne veut pas dire être un parent parfait\./);
  assert.equal(result.post.text.includes('Prends soin de toi, et reviens quand tu veux.'), false);
  assert.equal(result.post.cta, 'Prends soin de toi, et reviens quand tu veux.');
  assert.equal(result.post.title, 'Parentalité apaisée');
});

test('le prompt déclare les éléments de l’utilisatrice obligatoires', () => {
  const prompt = _internals.buildEditorialBriefPrompt({
    topic: 'Traverser l’adolescence',
    audience: 'Parents d’adolescents',
    objective: 'Faire comprendre',
    platform: 'Instagram',
    hook: 'Mon accroche exacte',
    message: 'Mon idée essentielle exacte',
    closing: 'Mon mot de fin exact',
    currentDraft: 'Mon brouillon',
    resources: [],
  });

  assert.match(prompt, /Mon accroche exacte/);
  assert.match(prompt, /Mon idée essentielle exacte/);
  assert.match(prompt, /Mon mot de fin exact/);
  assert.match(prompt, /ne sont pas de simples suggestions/);
  assert.match(prompt, /Ne la remplace jamais par des conseils génériques/);
});
