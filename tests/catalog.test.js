import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { projects, contact } from '../src/data.js';
import { professionalProfile } from '../src/profile.js';

test('project routes are unique and preview assets exist', () => {
  assert.equal(new Set(projects.map(p => p.slug)).size, projects.length);
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length);
  for (const p of projects) {
    assert.match(p.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(p.title && p.titleEn && p.description && p.descriptionEn, p.slug);
    assert.match(p.image, /^\.\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp|svg)$/i);
    assert.ok(existsSync(new URL('../public/' + p.image.slice(2), import.meta.url)), p.image);
  }
});
test('authored external destinations use HTTPS without URL credentials', () => {
  const values = projects.flatMap(p => [p.live, p.github]).filter(Boolean).concat(contact.github, contact.linkedin);
  for (const value of values) {
    const url = new URL(value);
    assert.equal(url.protocol, 'https:', value);
    assert.equal(url.username + url.password, '', value);
  }
});
test('project evidence preserves private and in-development boundaries', () => {
  const current = projects.find(p => p.currentSite);
  assert.ok(current);
  assert.equal(current.live, null);
  for (const p of projects.filter(p => p.demoType === 'development')) {
    assert.equal(p.live, null);
    assert.equal(p.github, null);
  }
  const technical = projects.filter(p => p.technicalCase);
  for (const p of technical) {
    const es = p.technicalCase.es;
    const en = p.technicalCase.en;
    assert.deepEqual(es.cases.map(c => c.id), en.cases.map(c => c.id));
    for (const content of [es, en]) {
      assert.ok(content.title && content.intro && content.linkLabel);
      assert.equal(new Set(content.cases.map(c => c.id)).size, content.cases.length);
      for (const c of content.cases) assert.ok(c.title && c.summary && c.sections.length, c.id);
    }
  }
});
test('the canonical professional profile is complete in both languages', () => {
  for (const language of ['es', 'en']) {
    const p = professionalProfile[language];
    assert.ok(p.languages && p.experience.length && p.education.length && p.skills.length);
    for (const entry of p.experience) assert.ok(entry.role && entry.organization && entry.period && entry.items.length);
  }
});
