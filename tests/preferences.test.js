import test from 'node:test';
import assert from 'node:assert/strict';
import { readLanguage, readTheme, savePreference } from '../src/preferences.js';

const memory = (values = {}) => ({ getItem: key => values[key] ?? null, setItem: (key, value) => { values[key] = value; } });
test('preferences accept supported values and reject corrupted stored language', () => {
  assert.equal(readLanguage(memory({ language: 'en' })), 'en');
  for (const language of [null, '', 'fr', '__proto__', '<script>']) assert.equal(readLanguage(memory({ language })), 'es');
  assert.equal(readTheme(memory({ darkMode: 'true' })), true);
  assert.equal(readTheme(memory({ darkMode: 'yes' })), false);
});
test('unavailable storage does not block initial render or preference changes', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(readLanguage(blocked), 'es');
  assert.equal(readTheme(blocked), false);
  assert.equal(savePreference('language', 'en', blocked), false);
});
test('saving preferences only writes valid presentation settings', () => {
  const storage = memory();
  assert.equal(savePreference('language', 'en', storage), true);
  assert.equal(readLanguage(storage), 'en');
  assert.equal(savePreference('darkMode', 'true', storage), true);
  assert.equal(readTheme(storage), true);
  assert.equal(savePreference('language', 'other', storage), false);
  assert.equal(savePreference('token', 'secret', storage), false);
});
