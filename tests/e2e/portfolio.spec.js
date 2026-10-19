import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page, baseURL }) => {
  // Keep smoke tests deterministic and do not contact demos, payment services or people.
  const origin = new URL(baseURL).origin;
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  page.__applicationErrors = [];
  page.on('pageerror', error => page.__applicationErrors.push(error.message));
});
test.afterEach(async ({ page }) => { expect(page.__applicationErrors).toEqual([]); });

test('visitors can navigate to technical evidence and expand it with the keyboard', async ({ page }) => {
  await page.goto('./#home');
  await page.getByRole('link', { name: 'Ver mis casos técnicos' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'VendoAlgo', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Ver mis casos técnicos/ }).click();
  const cases = page.locator('.technical-case-item');
  await expect(cases).toHaveCount(4);
  const first = cases.first();
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('open', '');
  await expect(first.getByRole('heading', { name: 'Qué ocurre si dos personas actúan a la vez' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(first).not.toHaveAttribute('open');
});

test('catalog search, technology filters and empty results remain usable', async ({ page }) => {
  await page.goto('./#projects');
  const search = page.getByRole('searchbox');
  await search.fill('Widget Horas Insightful');
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.getByRole('link', { name: /Ver en Chrome Web Store/ })).toHaveAttribute('href', /chromewebstore\.google\.com/);
  await search.fill('no-results-portfolio-987654');
  await expect(page.locator('.project-card')).toHaveCount(0);
  await expect(page.locator('.empty-state')).toBeVisible();
  await search.fill('');
  await page.getByRole('combobox').selectOption('PHP');
  await expect(page.locator('.project-card')).not.toHaveCount(0);
  for (const card of await page.locator('.project-card').all()) await expect(card.locator('.tag').filter({ hasText: /^PHP$/ })).toHaveCount(1);
});

test('language and theme survive reload and private projects stay private', async ({ page }) => {
  await page.goto('./#project/citarme');
  await expect(page.getByRole('link', { name: /código fuente|source code|abrir demo/i })).toHaveCount(0);
  await page.getByRole('button', { name: 'Cambiar idioma a inglés' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveClass(/dark/);
});

for (const language of ['es', 'en']) test('the actual ' + language + ' CV downloads with its name and professional content', async ({ page }) => {
  await page.goto('./#home');
  if (language === 'en') await page.getByRole('button', { name: 'Cambiar idioma a inglés' }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: language === 'es' ? 'Descargar CV (PDF)' : 'Download CV (PDF)', exact: true }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe('CV-Pedro-Martin-Mendez-Caraban-' + language.toUpperCase() + '.pdf');
  const raw = (await readFile(await download.path())).toString('utf8');
  expect(raw.startsWith('%PDF-')).toBe(true);
  expect((raw.match(/\/Type \/Page\b/g) || []).length).toBe(2);
  const text = [...raw.matchAll(/<([0-9A-F]+)> Tj/g)].map(m => new TextDecoder('windows-1252').decode(Buffer.from(m[1], 'hex'))).join(' ');
  for (const term of ['Rebill', 'ARCA', 'Reverb', 'Playwright']) expect(text).toContain(term);
});

test('bad fragments display a recoverable error instead of executing markup', async ({ page }) => {
  await page.goto('./#project/%3Cscript%3E');
  await expect(page.locator('main')).toContainText('404');
  await expect(page.locator('script:not([src])')).toHaveCount(0);
  await page.goto('./#home');
  await expect(page.getByRole('button', { name: 'Descargar CV (PDF)', exact: true })).toBeVisible();
});

test('corrupted or blocked browser preferences do not prevent rendering', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('language', 'unsupported'));
  await page.goto('./#home');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('button', { name: 'Descargar CV (PDF)', exact: true })).toBeVisible();
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } }));
  await page.reload();
  await expect(page.getByRole('button', { name: 'Cambiar idioma a inglés' })).toBeVisible();
  await page.getByRole('button', { name: 'Cambiar idioma a inglés' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('main routes fit the viewport and outbound tabs isolate their opener', async ({ page }) => {
  for (const route of ['home', 'projects', 'project/vendoalgo', 'about', 'contact', 'services', 'precios', 'emprendimientos']) {
    await page.goto('./#' + route);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    for (const link of await page.locator('a[target="_blank"]').all()) {
      const rel = (await link.getAttribute('rel') || '').split(/\s+/);
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  }
});

test('production CSP allows the application and blocks an injected inline script', async ({ page }) => {
  await page.goto('./#home');
  const policy = page.locator('meta[http-equiv="Content-Security-Policy"]');
  await expect(policy).toHaveAttribute('content', /script-src 'self'/);
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.__unexpectedInlineExecution = true';
    document.head.append(script);
    script.remove();
  });
  expect(await page.evaluate(() => window.__unexpectedInlineExecution)).toBeUndefined();
  await expect(page.getByRole('button', { name: 'Descargar CV (PDF)', exact: true })).toBeVisible();
});

test('a hosted nested 404 loads the application and recovers to the real home', async ({ page, baseURL }) => {
  const html = await readFile('dist/404.html', 'utf8');
  const missingURL = new URL('missing/child/page', baseURL).href;
  await page.route(missingURL, route => route.fulfill({ status: 404, contentType: 'text/html', body: html }));
  const brokenAssets = [];
  page.on('response', response => {
    if (['script', 'stylesheet', 'image'].includes(response.request().resourceType()) && response.status() >= 400) brokenAssets.push(response.url());
  });
  const response = await page.goto(missingURL);
  expect(response.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Esta página se salió del mapa.' })).toBeVisible();
  await page.getByRole('link', { name: /Volver al inicio/ }).click();
  await expect(page).toHaveURL(new URL('#home', baseURL).href);
  await expect(page.getByRole('button', { name: 'Descargar CV (PDF)', exact: true })).toBeVisible();
  expect(brokenAssets).toEqual([]);
});

test.describe('recovery without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the static 404 returns to home from a nested directory', async ({ page, baseURL }) => {
    const html = await readFile('dist/404.html', 'utf8');
    const missingURL = new URL('missing/child/', baseURL).href;
    await page.route(missingURL, route => route.fulfill({ status: 404, contentType: 'text/html', body: html }));
    const response = await page.goto(missingURL);
    expect(response.status()).toBe(404);
    const home = page.getByRole('link', { name: /Volver al inicio/ });
    await expect(home).toHaveAttribute('href', new URL(baseURL).pathname + '#home');
    await home.click();
    await expect(page).toHaveURL(new URL('#home', baseURL).href);
  });
});

test('the three business answers determine the result and editing them changes the guidance', async ({ page }) => {
  await page.goto('./#services');
  const questionnaire = page.locator('.business-questionnaire');
  await expect(questionnaire).toContainText('Pregunta 1 de 3');
  await questionnaire.getByRole('button', { name: 'No, quiero crear una', exact: true }).click();
  await expect(page.locator('#business-question-title')).toBeFocused();
  await questionnaire.getByRole('button', { name: 'Sí, ya vendo por ahí', exact: true }).click();
  await expect(questionnaire).toContainText('Pregunta 3 de 3');
  await questionnaire.getByRole('button', { name: 'Los compro a uno o más proveedores', exact: true }).click();
  await expect(page.locator('#guided-goal-title')).toHaveText('Quiero mi propia tienda online');
  await expect(page.locator('.guided-recommendation')).toContainText('Como ya vendés en Mercado Libre');
  await expect(page.locator('.guided-recommendation')).toContainText('Trabajás con proveedores');
  await expect(questionnaire).toHaveCount(0);

  await page.getByRole('button', { name: 'Editar mis respuestas', exact: true }).click();
  await questionnaire.getByRole('button', { name: 'Sí, ya tengo una', exact: true }).click();
  await questionnaire.getByRole('button', { name: 'No por ahora', exact: true }).click();
  await questionnaire.getByRole('button', { name: 'Los fabrico o preparo yo', exact: true }).click();
  await expect(page.locator('#guided-goal-title')).toHaveText('Ya tengo tienda y necesito ayuda');
  await expect(page.locator('.guided-recommendation')).toContainText('Tus productos son propios');
  await expect(page.locator('.guided-recommendation')).not.toContainText('Mercado Libre');
  await expect(page.getByRole('button', { name: 'Revisar actualización de productos', exact: true })).toHaveCount(0);
});

test('uncertain visitors get guidance without selected paid services', async ({ page }) => {
  await page.goto('./#services');
  const questionnaire = page.locator('.business-questionnaire');
  await questionnaire.getByRole('button', { name: 'No estoy seguro', exact: true }).click();
  await questionnaire.getByRole('button', { name: 'No estoy seguro', exact: true }).click();
  await questionnaire.getByRole('button', { name: 'No estoy seguro o todavía no vendo', exact: true }).click();
  await expect(page.locator('#guided-goal-title')).toHaveText('Quiero orientación para mi negocio');
  await expect(page.locator('.guided-recommendation')).toContainText('sin dar por hecho que hace falta crear una tienda');
  await expect(page.locator('.guided-workspace input[type="checkbox"]:checked')).toHaveCount(0);
});
