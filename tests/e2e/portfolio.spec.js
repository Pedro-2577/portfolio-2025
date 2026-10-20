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
    await expect(page.locator('.site-footer .footer-cv')).toHaveCount(1);
    await expect(page.locator('.site-footer')).not.toContainText('Vue · Vite');
    await expect(page.locator('.availability')).toHaveCount(['home', 'projects', 'project/vendoalgo', 'about', 'emprendimientos'].includes(route) ? 1 : 0);
    await expect(page.locator('body')).not.toContainText('Disponible para nuevos desafíos');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    for (const link of await page.locator('a[target="_blank"]').all()) {
      const rel = (await link.getAttribute('rel') || '').split(/\s+/);
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  }
});

test('representative views remain within the viewport across narrow, tablet and wide screens', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The viewport matrix runs once; the mobile project covers Pixel 7.');
  const widths = [320, 360, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1920];
  const projectSlugs = [
    'citarme', 'vendoalgo', 'kalua', 'wecanagro', 'portales-comercio-electronico',
    'portfolio-2025', 'aplicaciones-hibridas', 'aplicaciones-moviles-vue-parcial-1',
    'aplicaciones-moviles-vue-parcial-2', 'final-php', 'pwa-projects', 'wordpress',
    'pwa-parcial-2', 'api-base-de-datos', 'aplicaciones-hibridas-express',
    'clientes-web', 'proyecto-git'
  ];
  const routes = [
    'home', 'projects', 'about', 'contact', 'services', 'precios', 'emprendimientos',
    ...projectSlugs.map(slug => 'project/' + slug)
  ];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto('./#' + route);
      await expect(page.locator('main')).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        offenders: [...document.querySelectorAll('body *')].map(element => {
          const rect = element.getBoundingClientRect();
          return { tag: element.tagName, className: typeof element.className === 'string' ? element.className : '', right: Math.round(rect.right), width: Math.round(rect.width) };
        }).filter(item => item.width > 0 && item.right > document.documentElement.clientWidth + 1).slice(0, 8),
        overflowing: [...document.querySelectorAll('body *')].map(element => ({
          tag: element.tagName,
          className: typeof element.className === 'string' ? element.className : '',
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          left: Math.round(element.getBoundingClientRect().left)
        })).filter(item => item.scrollWidth > item.clientWidth + 1).slice(0, 12)
      }));
      expect(dimensions.document, route + ' overflows at ' + width + 'px: ' + JSON.stringify({offenders: dimensions.offenders, overflowing: dimensions.overflowing})).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.body, route + ' body overflows at ' + width + 'px').toBeLessThanOrEqual(dimensions.viewport);
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

test.describe('optional motion', () => {
  test.use({ reducedMotion: 'no-preference' });
  test('switching to reduced motion during navigation leaves content and controls usable', async ({ page }) => {
    await page.goto('./#home');
    await page.goto('./#projects');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.motion-pending')).toHaveCount(0);
    expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.id === 'portfolio-decoration' && animation.playState === 'running').length)).toBe(0);
    await page.getByRole('searchbox').fill('Widget Horas Insightful');
    await expect(page.locator('.project-card')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
});
