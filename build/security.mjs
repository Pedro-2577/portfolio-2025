import { rm } from 'node:fs/promises';
import { resolve, relative } from 'node:path';

// GitHub Pages cannot set custom response headers. These directives are supported in a meta CSP.
// frame-ancestors, HSTS and X-Frame-Options require server headers and are not claimed here.
export const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.bunny.net",
  "font-src 'self' https://fonts.bunny.net",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "base-uri 'self'",
  "form-action 'none'"
].join('; ');

export function staticSecurity() {
  let outputDirectory;
  return {
    name: 'portfolio-static-security',
    apply: 'build',
    configResolved(config) { outputDirectory = resolve(config.root, config.build.outDir); },
    transformIndexHtml() {
      return [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy }, injectTo: 'head-prepend' },
        { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' }
      ];
    },
    async closeBundle() {
      // Keep the original Laravel source, but do not publish its PHP entry point or old bundles.
      for (const name of ['index.php', '.htaccess', 'build']) {
        const target = resolve(outputDirectory, name);
        const path = relative(outputDirectory, target);
        if (!path || path.startsWith('..') || path.includes(':')) throw new Error('Unsafe artifact cleanup path');
        await rm(target, { recursive: true, force: true });
      }
    }
  };
}
