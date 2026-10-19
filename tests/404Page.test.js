import test from 'node:test';
import assert from 'node:assert/strict';
import { create404Html } from '../build/notFound.mjs';
import { contentSecurityPolicy } from '../build/security.mjs';

for (const base of ['/', '/portfolio-2025/']) {
  test('404 assets and recovery resolve from nested URLs with base ' + base, () => {
    const index = '<!doctype html><html lang="es"><head>' +
      '<meta http-equiv="Content-Security-Policy" content="' + contentSecurityPolicy + '">' +
      '<title>Pedro Méndez Carabán | Portfolio</title>' +
      '<script type="module" src="' + base + 'assets/app.js"></script>' +
      '<link rel="stylesheet" href="' + base + 'assets/app.css">' +
      '<link rel="icon" href="./favicon.svg"></head><body><div id="app"></div></body></html>';
    const html = create404Html(index, base);
    assert.ok(html.indexOf('<base ') < html.indexOf('<script '));
    assert.ok(html.indexOf('<base ') < html.indexOf('<link '));
    assert.ok(html.includes(contentSecurityPolicy));
    assert.ok(html.includes('data-http-status="404"'));
    assert.ok(html.includes('name="robots" content="noindex"'));
    assert.ok(!/<script[^>]*>\s*[^<\s]/i.test(html));
    for (const origin of ['https://pedro-2577.github.io', 'https://pedromendezcaraban.com.ar']) {
      for (const suffix of ['missing', 'missing/child/page', 'missing/child/']) {
        const current = origin + base + suffix;
        const documentBase = new URL(html.match(/<base href="([^"]+)"/)[1], current);
        for (const asset of [base + 'assets/app.js', base + 'assets/app.css', './favicon.svg']) {
          assert.equal(new URL(asset, documentBase).href, origin + base + (asset.startsWith('./') ? 'favicon.svg' : asset.slice(base.length)));
        }
        const home = html.match(/<a href="([^"]+)"/)[1];
        assert.equal(new URL(home, documentBase).href, origin + base + '#home');
      }
    }
  });
}

test('404 generation rejects relative or untrusted base paths and missing mount points', () => {
  for (const base of ['./', '//example.com/', '/"><script>/']) assert.throws(() => create404Html('<head><div id="app"></div>', base));
  assert.throws(() => create404Html('<head></head>', '/'));
});
