import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export function create404Html(index, base) {
  if (!/^\/(?:[\w.-]+\/)*$/.test(base)) throw new Error('404 requires an absolute site base path');
  if (!index.includes('<head>') || !index.includes('<div id="app"></div>')) throw new Error('Cannot generate 404.html: expected HTML structure was not found');
  const fallback = '<main class="static-http-error"><strong>404</strong><h1>Esta página no existe.</h1><p>Este enlace no lleva a una página del portfolio.</p><a href="' + base + '#home">Volver al inicio / Back to home ↗</a></main>';
  const fallbackStyle = '<style>.static-http-error{max-width:680px;margin:12vh auto;padding:32px;font:18px/1.6 system-ui,sans-serif;color:#172033}.static-http-error strong{font-size:clamp(96px,20vw,180px);line-height:1}.static-http-error h1{font-size:clamp(28px,6vw,44px);line-height:1.1}.static-http-error a{display:inline-block;padding:12px 18px;background:#d7f43b;color:#172033;border-radius:6px;font-weight:600;text-decoration:none}</style>';
  return index
    .replace('<html lang="es">', '<html lang="es" data-http-status="404">')
    .replace('<head>', '<head>\n<base href="' + base + '">')
    .replace('<title>Pedro Méndez Carabán | Portfolio</title>', '<title>404 | Pedro Méndez Carabán</title>')
    .replace('</head>', '<meta name="robots" content="noindex">' + fallbackStyle + '</head>')
    .replace('<div id="app"></div>', '<div id="app">' + fallback + '</div>');
}

export function custom404Page() {
  let outputDirectory;
  let base;
  return {
    name: 'portfolio-custom-404',
    apply: 'build',
    configResolved(config) {
      outputDirectory = resolve(config.root, config.build.outDir);
      base = config.base;
    },
    async closeBundle() {
      const index = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');
      await writeFile(resolve(outputDirectory, '404.html'), create404Html(index, base));
    },
  };
}
