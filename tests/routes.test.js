import test from 'node:test';
import assert from 'node:assert/strict';
import { routeAliases, projectPrefixes, normalizeRoute, routeFromLocation, staticRoutePaths } from '../src/routes.js';
import { resolveRouteStatus } from '../src/httpErrors.js';
import { createRouteHtml } from '../build/notFound.mjs';

test('all public aliases resolve consistently without collisions', () => {
  const seen = new Set();
  for (const [route, aliases] of Object.entries(routeAliases)) {
    for (const alias of aliases) {
      assert.equal(seen.has(alias), false, 'Duplicate alias: ' + alias);
      seen.add(alias);
      for (const input of [alias, '/' + alias, '#/' + alias + '/', alias.toUpperCase()]) {
        assert.equal(normalizeRoute(input), route, input);
        assert.equal(resolveRouteStatus(input), null, input);
      }
    }
  }
  assert.equal(normalizeRoute('sobre-m%C3%AD'), 'about');
  assert.equal(normalizeRoute('cotizaci%C3%B3n'), 'precios');
});

test('project and nested pricing aliases keep their distinct destination', () => {
  for (const prefix of projectPrefixes) {
    assert.equal(normalizeRoute(prefix + '/vendoalgo'), 'project/vendoalgo');
    assert.equal(resolveRouteStatus(prefix + '/vendoalgo', ['vendoalgo']), null);
    assert.equal(resolveRouteStatus(prefix + '/missing', ['vendoalgo']), 404);
  }
  for (const service of routeAliases.services) for (const price of routeAliases.precios) {
    assert.equal(normalizeRoute(service + '/' + price), 'precios');
    assert.equal(resolveRouteStatus(service + '/' + price), null);
  }
  assert.equal(normalizeRoute('p'), 'precios');
  assert.equal(normalizeRoute('p/vendoalgo'), 'project/vendoalgo');
  assert.equal(resolveRouteStatus('p/vendoalgo', ['vendoalgo']), null);
  assert.equal(normalizeRoute('pr'), 'precios');
  assert.equal(normalizeRoute('s'), 'services');
});

test('direct URLs, existing fragments and subdirectory hosting select the right view', () => {
  for (const base of ['/', '/portfolio-2025/']) {
    for (const [path, canonical] of staticRoutePaths(['vendoalgo'])) {
      for (const suffix of ['', '/']) assert.equal(routeFromLocation({ pathname: base + path + suffix, hash: '' }, base), canonical);
    }
    assert.equal(routeFromLocation({ pathname: base, hash: '' }, base), 'home');
    assert.equal(routeFromLocation({ pathname: base, hash: '#/' }, base), 'home');
    assert.equal(routeFromLocation({ pathname: base + 'servicios/', hash: '#contacto' }, base), 'contact');
    assert.equal(routeFromLocation({ pathname: base, hash: '#services/precios' }, base), 'precios');
  }
  assert.equal(routeFromLocation({ pathname: '/servicios', hash: '' }, '/portfolio-2025/'), 'not-found');
});

test('unknown, malformed and extra segments retain the 404 behavior', () => {
  for (const path of ['missing', 's/missing', 'servicios/precios/extra', 'proyecto/vendoalgo/extra', 'project/%2Fvendoalgo', 'project/%5Cvendoalgo', 'project/%', 'services//precios', 'project/<script>', 'error/0500', 'error/502']) {
    assert.equal(resolveRouteStatus(path, ['vendoalgo']), 404, path);
  }
  for (const code of [403, 404, 500, 503]) assert.equal(resolveRouteStatus('errores/' + code), code);
});

test('generated Pages entries keep assets at the site base and preserve CSP', () => {
  const index = '<html lang="es"><head><meta http-equiv="Content-Security-Policy" content="script-src self"><link rel="icon" href="./favicon.svg"></head><body><div id="app"></div></body></html>';
  for (const base of ['/', '/portfolio-2025/']) {
    for (const [path, route] of staticRoutePaths(['vendoalgo'])) {
      const html = createRouteHtml(index, base, route);
      assert.ok(!html.includes('data-http-status="404"'));
      assert.ok(!html.includes('name="robots" content="noindex"'));
      assert.ok(html.includes('Content-Security-Policy'));
      assert.ok(html.includes('rel="canonical" href="' + base + route + '/"'));
      const page = 'https://pedromendezcaraban.com.ar' + base + path + '/';
      const documentBase = new URL(html.match(/<base href="([^"]+)"/)[1], page);
      assert.equal(new URL('./favicon.svg', documentBase).pathname, base + 'favicon.svg');
    }
  }
  assert.throws(() => staticRoutePaths(['../private']));
  assert.throws(() => createRouteHtml(index, '//external.com/', 'services'));
  assert.throws(() => createRouteHtml(index, '/', '../private'));
});
