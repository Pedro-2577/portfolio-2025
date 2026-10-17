import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function custom404Page() {
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
            if (!index.includes('<div id="app"></div>')) throw new Error('Cannot generate 404.html: app mount point was not found');
            const fallback = '<main class="static-http-error"><strong>404</strong><h1>Esta página no existe.</h1><p>Este enlace no lleva a una página del portfolio.</p><a href="' + base + '#home">Volver al inicio / Back to home ↗</a></main>';
            const fallbackStyle = '<style>.static-http-error{max-width:680px;margin:12vh auto;padding:32px;font:18px/1.6 system-ui,sans-serif;color:#172033}.static-http-error strong{font-size:clamp(96px,20vw,180px);line-height:1}.static-http-error h1{font-size:clamp(28px,6vw,44px);line-height:1.1}.static-http-error a{display:inline-block;padding:12px 18px;background:#d7f43b;color:#172033;border-radius:6px;font-weight:600;text-decoration:none}</style>';
            const html = index
                .replace('<html lang="es">', '<html lang="es" data-http-status="404">')
                .replace('<title>Pedro Méndez Carabán | Portfolio</title>', '<title>404 | Pedro Méndez Carabán</title>')
                .replace('</head>', '<meta name="robots" content="noindex">' + fallbackStyle + '</head>')
                .replace('href="./favicon.svg"', 'href="' + base + 'favicon.svg"')
                .replace('<div id="app"></div>', '<div id="app">' + fallback + '</div>');
            await writeFile(resolve(outputDirectory, '404.html'), html);
        },
    };
}

export default defineConfig({
    base: process.env.GITHUB_ACTIONS ? '/portfolio-2025/' : '/',
    plugins: [vue(), custom404Page()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
