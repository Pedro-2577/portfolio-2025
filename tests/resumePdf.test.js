import test from 'node:test';
import assert from 'node:assert/strict';
import { downloadResumePdf } from '../src/resumePdf.js';
import { professionalProfile } from '../src/profile.js';
import { projects, contact } from '../src/data.js';

async function capture(language) {
  const saved = { document: globalThis.document, window: globalThis.window, create: URL.createObjectURL, revoke: URL.revokeObjectURL };
  let blob, filename, clicked = false, appended = false, removed = false;
  try {
    const anchor = { click() { clicked = true; filename = this.download; }, remove() { removed = true; } };
    globalThis.document = { createElement: () => anchor, body: { append() { appended = true; } } };
    globalThis.window = { setTimeout(fn) { fn(); } };
    URL.createObjectURL = value => { blob = value; return 'blob:resume-test'; };
    URL.revokeObjectURL = () => {};
    downloadResumePdf({
      language, profile: professionalProfile[language],
      text: { role: 'Full stack', resumeSummary: 'Products, APIs and user experience.', resumeProjectsTitle: language === 'es' ? 'Proyectos seleccionados' : 'Selected projects' },
      contact, projects: projects.filter(p => !p.academic && p.role).sort((a, b) => a.importance - b.importance).slice(0, 3)
    });
    return { raw: await blob.text(), type: blob.type, filename, clicked, appended, removed };
  } finally {
    globalThis.document = saved.document; globalThis.window = saved.window;
    URL.createObjectURL = saved.create; URL.revokeObjectURL = saved.revoke;
  }
}

for (const language of ['es', 'en']) test('CV ' + language + ' has a named, valid two-page PDF and readable content', async () => {
  const result = await capture(language);
  assert.equal(result.type, 'application/pdf');
  assert.equal(result.filename, 'CV-Pedro-Martin-Mendez-Caraban-' + language.toUpperCase() + '.pdf');
  assert.ok(result.clicked && result.appended && result.removed);
  assert.match(result.raw, /^%PDF-1\.4/);
  assert.equal((result.raw.split('/Subtype /Link').length - 1), 3);
  const text = [...result.raw.matchAll(/<([0-9A-F]+)> Tj/g)].map(m => new TextDecoder('windows-1252').decode(Buffer.from(m[1], 'hex'))).join(' ');
  for (const expected of ['Pedro Martín Méndez Carabán', 'Rebill', 'ARCA', 'Reverb', 'Playwright', 'Spatie']) assert.ok(text.includes(expected), expected);
  assert.ok(text.includes(language === 'es' ? 'Inglés intermedio' : 'Intermediate English'));
  for (const expected of [
    language === 'es' ? 'Ciudad: Buenos Aires  ·  País: Argentina' : 'City: Buenos Aires  ·  Country: Argentina',
    'pedromendezcaraban@gmail.com',
    'LinkedIn: www.linkedin.com/in/pedro-mendez-caraban',
    'Portfolio: pedro-2577.github.io/portfolio-2025',
    'GitHub: github.com/Pedro-2577',
    'https://www.linkedin.com/in/pedro-mendez-caraban/',
    'https://pedro-2577.github.io/portfolio-2025/',
    'https://github.com/Pedro-2577'
  ]) assert.ok(text.includes(expected) || result.raw.includes(expected), expected);
  assert.equal((result.raw.match(/\\/Subtype \\/Link/g) || []).length, 3);
  for (const m of result.raw.matchAll(/1 0 0 1 ([\d.]+) ([\d.-]+) Tm/g)) assert.ok(+m[2] >= 0 && +m[2] <= 841.89, 'Text outside page');
  const xref = Number(result.raw.match(/startxref\n(\d+)/)[1]);
  assert.equal(result.raw.slice(xref, xref + 4), 'xref');
  const offsets = result.raw.slice(xref).split('\n').slice(3).filter(line => /^\d{10} 00000 n/.test(line));
  offsets.forEach((line, i) => assert.equal(result.raw.slice(Number(line.slice(0, 10)), Number(line.slice(0, 10)) + String(i + 1).length + 6), (i + 1) + ' 0 obj'));
});
