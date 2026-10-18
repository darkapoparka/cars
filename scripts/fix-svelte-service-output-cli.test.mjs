import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

test('exported Svelte output repair executes through a junction without sibling dependencies', t => {
  const temporary = fs.realpathSync(os.tmpdir());
  const area = fs.mkdtempSync(path.join(temporary, 'cars-portable-service-cli-'));
  const exported = path.join(area, 'exported'), alias = path.join(area, 'service alias');
  fs.mkdirSync(exported);
  const file = path.join(exported, 'fix-svelte-service-output.mjs');
  fs.copyFileSync(path.join(import.meta.dirname, 'publishing/fix-svelte-service-output.mjs'), file);
  fs.symlinkSync(exported, alias, process.platform === 'win32' ? 'junction' : 'dir');
  t.after(() => {
    const physical = fs.realpathSync(area), relative = path.relative(temporary, physical);
    assert(relative.startsWith('cars-portable-service-cli-') && path.dirname(relative) === '.' && !path.isAbsolute(relative));
    assert(fs.lstatSync(alias).isSymbolicLink());
    assert.equal(fs.realpathSync(alias), fs.realpathSync(exported));
    fs.unlinkSync(alias);
    fs.rmSync(physical, { recursive: true });
  });
  const run = args => spawnSync(process.execPath, args, {
    cwd: alias, encoding: 'utf8', timeout: 10000, windowsHide: true,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
  });
  const help = run([path.join(alias, path.basename(file)), '--help']);
  assert.ifError(help.error);
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /Usage:/);
  assert.equal(help.stderr, '');

  const invalid = run([path.join(alias, path.basename(file)), '/invalid']);
  assert.ifError(invalid.error);
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Unsupported service base/);

  const output = path.join(exported, '.vercel/output');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'config.json'), JSON.stringify({ routes: [{ src: '^/contact/?$', dest: '/contact' }] }));
  const repaired = run([path.join(alias, path.basename(file)), '/variant-6']);
  assert.ifError(repaired.error);
  assert.equal(repaired.status, 0, repaired.stderr);
  assert.equal(JSON.parse(repaired.stdout).base, '/variant-6');
  assert.equal(JSON.parse(fs.readFileSync(path.join(output, 'config.json'), 'utf8')).routes[0].src, '^/variant-6/contact/?$');

  const imported = run(['--input-type=module', '--eval', 'await import(' + JSON.stringify(pathToFileURL(path.join(alias, path.basename(file))).href) + ')']);
  assert.ifError(imported.error);
  assert.equal(imported.status, 0, imported.stderr);
  assert.equal(imported.stdout, '');
  assert.equal(imported.stderr, '');
});
