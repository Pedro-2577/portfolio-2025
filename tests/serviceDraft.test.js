import test from 'node:test';
import assert from 'node:assert/strict';
import { readServiceDraft, saveServiceDraft, clearServiceDraft } from '../src/serviceDraft.js';

const schema = {
  questions: [
    { id: 'website', options: [{ id: 'new' }, { id: 'other-platform' }, { id: 'yes' }] },
    { id: 'marketplace', options: [{ id: 'interested' }, { id: 'not-now' }] },
    { id: 'products', options: [{ id: 'suppliers' }, { id: 'made-here' }] },
  ],
  services: ['design', 'catalog', 'payments', 'shipping', 'training', 'migration', 'visual-changes', 'ml', 'auto-prices', 'auto-stock'],
  modules: ['ai', 'mercadolibre'],
  groups: ['catalogue', 'automation', 'configuration'],
};
function memoryStorage(raw = null) {
  const items = new Map([['unrelated', 'keep']]);
  const store = { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, value), removeItem: key => items.delete(key) };
  if (raw !== null) store.setItem('portfolio.store-services.draft.v1', raw);
  return store;
}
const answers = { website: 'other-platform', marketplace: 'interested', products: 'suppliers' };

test('a migration draft restores edited choices and budget inputs without stored prices or contact data', () => {
  const storage = memoryStorage();
  const draft = { answers, step: 2, completed: true, selected: ['design', 'payments', 'shipping', 'training', 'migration', 'ml', 'auto-prices', 'auto-stock'], modules: ['ai'], catalogSize: 'over50', platform: 'pro', expanded: true, expandedGroups: { automation: true } };
  saveServiceDraft(draft, storage);
  const restored = readServiceDraft(schema, storage);
  assert.deepEqual(restored.selected, draft.selected);
  assert.deepEqual(restored.answers, answers);
  assert.equal(restored.completed, true);
  assert.equal(restored.catalogSize, 'over50');
  assert.equal(restored.platform, 'pro');
  assert.equal(restored.expandedGroups.automation, true);
  const extra = memoryStorage(JSON.stringify({ ...draft, version: 1, amount: 123, showPrices: true, inquiry: { name: 'Private' } }));
  assert.equal('amount' in readServiceDraft(schema, extra), false);
  assert.equal('showPrices' in readServiceDraft(schema, extra), false);
  assert.equal('inquiry' in readServiceDraft(schema, extra), false);
});

test('clearing all services stays empty after reload instead of reapplying suggestions', () => {
  const storage = memoryStorage();
  saveServiceDraft({ answers, completed: true, selected: [] }, storage);
  const restored = readServiceDraft(schema, storage);
  assert.deepEqual(restored.selected, []);
  assert.equal(restored.completed, true);
});

test('unfinished or invalid answers cannot skip unanswered questions', () => {
  const storage = memoryStorage(JSON.stringify({ version: 1, answers: { website: 'new', marketplace: 'removed-answer' }, step: 999, completed: true }));
  const restored = readServiceDraft(schema, storage);
  assert.equal(restored.completed, false);
  assert.equal(restored.step, 1);
  assert.equal(restored.answers.marketplace, '');
  assert.equal(restored.answers.products, '');
});

test('obsolete service IDs and conflicting alternatives are removed safely', () => {
  const storage = memoryStorage(JSON.stringify({ version: 1, answers, selected: ['catalog', 'migration', 'design', 'visual-changes', 'obsolete', 'ml', 'ml'], modules: ['unknown', 'ai'], platform: 'unknown' }));
  const restored = readServiceDraft(schema, storage);
  assert.deepEqual(restored.selected, ['migration', 'design', 'ml']);
  assert.deepEqual(restored.modules, ['ai']);
  assert.equal(restored.platform, 'unsure');
});

test('corrupt, unsupported, missing and oversized drafts are ignored', () => {
  for (const raw of [null, '{broken', 'null', '[]', JSON.stringify({ version: 2, answers }), JSON.stringify({ version: 1 }), 'x'.repeat(20001)]) {
    assert.equal(readServiceDraft(schema, memoryStorage(raw)), null);
  }
});

test('blocked storage does not break reading, saving or resetting', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); }, removeItem() { throw new Error('blocked'); } };
  assert.equal(readServiceDraft(schema, blocked), null);
  assert.doesNotThrow(() => saveServiceDraft({ answers }, blocked));
  assert.doesNotThrow(() => clearServiceDraft(blocked));
});

test('start over removes this draft while retaining unrelated browser preferences', () => {
  const storage = memoryStorage();
  saveServiceDraft({ answers }, storage);
  clearServiceDraft(storage);
  assert.equal(readServiceDraft(schema, storage), null);
  assert.equal(storage.getItem('unrelated'), 'keep');
});

const countSchema = { ...schema, questions: [...schema.questions, { id: 'catalogSize', options: [{ id: 'upto50' }, { id: 'over50' }, { id: 'unsure' }] }] };

test('the fourth answer supplies product count when a different count was stored separately', () => {
  const storage = memoryStorage();
  saveServiceDraft({ answers: { ...answers, catalogSize: 'over50' }, completed: true, step: 3, catalogSize: 'upto50', selected: ['design'] }, storage);
  const restored = readServiceDraft(countSchema, storage);
  assert.equal(restored.answers.catalogSize, 'over50');
  assert.equal(restored.catalogSize, 'over50');
  assert.equal(restored.completed, true);
});

test('completed drafts from the three-question flow retain their count and edited services', () => {
  for (const count of ['upto50', 'over50', 'unsure']) {
    const storage = memoryStorage();
    saveServiceDraft({ answers, completed: true, step: 2, catalogSize: count, selected: ['migration', 'ml'] }, storage);
    const restored = readServiceDraft(countSchema, storage);
    assert.equal(restored.answers.catalogSize, count);
    assert.equal(restored.catalogSize, count);
    assert.equal(restored.completed, true);
    assert.deepEqual(restored.selected, ['migration', 'ml']);
  }
});

test('older drafts with no valid count resume at the new fourth question', () => {
  const storage = memoryStorage();
  saveServiceDraft({ answers, completed: true, step: 2, selected: ['migration'] }, storage);
  const restored = readServiceDraft(countSchema, storage);
  assert.equal(restored.completed, false);
  assert.equal(restored.step, 3);
  assert.deepEqual(restored.selected, ['migration']);
});

test('manual catalog selections restore without answering the questionnaire', () => {
  const storage = memoryStorage();
  saveServiceDraft({ mode: 'manual', started: false, answers: {}, completed: true, selected: ['ml'] }, storage);
  const restored = readServiceDraft(countSchema, storage);
  assert.equal(restored.mode, 'manual');
  assert.equal(restored.completed, true);
  assert.equal(restored.started, false);
  assert.equal(restored.answers.catalogSize, '');
  assert.deepEqual(restored.selected, ['ml']);
});

test('an empty manual catalog remains open after all choices are removed', () => {
  const storage = memoryStorage();
  saveServiceDraft({ mode: 'manual', answers: {}, completed: true, selected: [] }, storage);
  const restored = readServiceDraft(countSchema, storage);
  assert.equal(restored.completed, true);
  assert.deepEqual(restored.selected, []);
});

test('older drafts resume their guided progress while unsupported modes cannot skip questions', () => {
  const storage = memoryStorage();
  saveServiceDraft({ answers: { website: 'new' }, step: 1, completed: false }, storage);
  const restored = readServiceDraft(countSchema, storage);
  assert.equal(restored.mode, 'guided');
  assert.equal(restored.started, true);
  assert.equal(restored.step, 1);
  saveServiceDraft({ mode: 'unknown', answers: {}, completed: true }, storage);
  assert.equal(readServiceDraft(countSchema, storage).completed, false);
});
