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
