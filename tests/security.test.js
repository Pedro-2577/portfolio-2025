import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { staticSecurity } from '../build/security.mjs';

test('the production artifact excludes legacy executables while retaining current assets', async () => {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-artifact-'));
  try {
    const out = join(root, 'dist');
    await mkdir(join(out, 'build'), { recursive: true });
    await mkdir(join(out, 'assets'));
    for (const name of ['index.php', '.htaccess', 'build/old.js', 'assets/current.js', 'index.html']) await writeFile(join(out, name), 'fixture');
    const plugin = staticSecurity();
    plugin.configResolved({ root, build: { outDir: 'dist' } });
    await plugin.closeBundle();
    for (const name of ['index.php', '.htaccess', 'build']) await assert.rejects(access(join(out, name)));
    assert.equal(await readFile(join(out, 'assets/current.js'), 'utf8'), 'fixture');
    assert.equal(await readFile(join(out, 'index.html'), 'utf8'), 'fixture');
  } finally { await rm(root, { recursive: true, force: true }); }
});
