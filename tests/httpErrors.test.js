import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRouteStatus } from '../src/httpErrors.js';

test('existing public pages and pricing aliases remain available', () => {
  for (const route of ['home', 'projects', 'services', 'about', 'contact', 'precios', '/precios', 'services/precios']) {
    assert.equal(resolveRouteStatus(route), null, route);
  }
});

test('only existing project routes resolve to project pages', () => {
  assert.equal(resolveRouteStatus('project/vendoalgo', ['vendoalgo']), null);
  assert.equal(resolveRouteStatus('/project/vendoalgo', ['vendoalgo']), null);
  for (const route of ['project/missing', 'project', 'project/vendoalgo/extra', 'unknown/vendoalgo', 'missing']) {
    assert.equal(resolveRouteStatus(route, ['vendoalgo']), 404, route);
  }
});

test('supported HTTP design previews retain the chosen status', () => {
  for (const status of [403, 404, 500, 503]) assert.equal(resolveRouteStatus('error/' + status), status);
});

test('malformed or unsupported error routes fall back to not-found', () => {
  for (const route of ['error/502', 'error/0500', 'error/500/extra', 'error/nope', '']) {
    assert.equal(resolveRouteStatus(route), 404, route);
  }
});
