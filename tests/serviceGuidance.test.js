import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendServices } from '../src/serviceGuidance.js';

test('starting a store depends on the current sales channel, not an overriding final answer', () => {
  for (const website of ['new', 'other-channels']) {
    const result = recommendServices({ website, marketplace: 'already', products: 'suppliers' });
    assert.equal(result.goal, 'launch');
    assert.equal(result.help, '');
    assert.deepEqual(result.reasons, ['newStore', 'existingMarketplace', 'suppliers']);
    assert.equal(result.supplierUpdates, true);
  }
});

test('Mercado Libre is suggested for an existing store only when relevant to the visitor', () => {
  assert.equal(recommendServices({ website: 'yes', marketplace: 'interested' }).help, 'configuration');
  assert.equal(recommendServices({ website: 'yes', marketplace: 'already' }).help, 'configuration');
  for (const marketplace of ['not-now', 'unsure']) {
    const result = recommendServices({ website: 'yes', marketplace, products: 'made-here' });
    assert.equal(result.goal, 'help');
    assert.equal(result.help, '');
    assert.equal(result.marketplaceRelevant, false);
    assert.deepEqual(result.reasons, ['existingStore', 'ownProducts']);
    assert.equal(result.supplierUpdates, false);
  }
});

test('mixed supplier products add an optional update suggestion without changing the starting point', () => {
  const result = recommendServices({ website: 'yes', marketplace: 'not-now', products: 'both' });
  assert.equal(result.goal, 'help');
  assert.equal(result.supplierUpdates, true);
  assert.deepEqual(result.reasons, ['existingStore', 'suppliers']);
});

test('uncertainty offers guidance instead of assuming a store launch or an integration', () => {
  for (const answers of [undefined, { website: 'unsure', marketplace: 'unsure', products: 'unsure' }]) {
    const result = recommendServices(answers);
    assert.equal(result.goal, 'help');
    assert.equal(result.help, '');
    assert.equal(result.orientation, true);
    assert.deepEqual(result.reasons, ['orientation']);
  }
});
