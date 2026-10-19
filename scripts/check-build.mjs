import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { contentSecurityPolicy } from '../build/security.mjs';

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = directory + '/' + entry.name;
    result.push(...(entry.isDirectory() ? await walk(path) : [path]));
  }
  return result;
}
for (const name of ['index.html', '404.html']) {
  const html = await readFile('dist/' + name, 'utf8');
  const decoded = html.replace(/&#39;|&#x27;|&apos;/gi, "'").replace(/&quot;/g, '\"').replace(/&amp;/g, '&');
  assert.ok(decoded.includes(contentSecurityPolicy), name + ': missing CSP');
  assert.ok(html.includes('strict-origin-when-cross-origin'), name + ': missing referrer policy');
  assert.ok(!/<script\b[^>]*>\s*[^<\s]/i.test(html), name + ': unexpected inline script');
}
const files = await walk('dist');
for (const path of files) {
  assert.ok(!/\.(php|log|map|key|pem|sqlite)$/i.test(path), 'Unexpected public artifact: ' + path);
  assert.ok(!/\/(?:\.env[^/]*|\.htaccess|storage|vendor|node_modules|build)\//.test(path + '/'), 'Unexpected directory or file: ' + path);
}
console.log('Production HTML policies and ' + files.length + ' public artifacts checked.');
