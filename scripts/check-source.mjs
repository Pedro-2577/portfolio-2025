import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
for (const path of tracked) {
  assert.ok(!/(^|\/)\.env(?:\.|$)/.test(path) || path.endsWith('.env.example'), 'Environment file tracked: ' + path);
  assert.ok(!/^(?:storage\/(?:logs|framework\/(?:sessions|views|cache))\/|bootstrap\/cache\/).*[^/]$/.test(path) || path.endsWith('.gitignore'), 'Runtime artifact tracked: ' + path);
}
console.log('Tracked environment and runtime artifact policy checked.');
