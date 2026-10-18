import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { isEntrypoint } from './lib/cli-entrypoint.mjs';

const root = fs.realpathSync(path.resolve(import.meta.dirname, '..'));
const guarded = ['new-client', 'template-release', 'package-dealer', 'export-dealer', 'index-deployments', 'verify-dealer-preview', 'workspace-doctor', 'check-workflow'];

test('direct execution compares physical files and safely handles a missing argv entry', () => {
  const url = new URL('./lib/cli-entrypoint.mjs', import.meta.url), file = fileURLToPath(url);
  assert.equal(isEntrypoint(url, file), true);
  assert.equal(isEntrypoint(url, null), false);
  assert.equal(isEntrypoint(url, ''), false);
  assert.equal(isEntrypoint(url, 1), false);
  assert.equal(isEntrypoint(url, file + '/missing.mjs'), false);
  assert.equal(isEntrypoint(url, fileURLToPath(import.meta.url)), false);
});

test('maintained CLIs execute through a directory junction or symlink without copying source', async t => {
  const temp = fs.realpathSync(os.tmpdir());
  const area = fs.mkdtempSync(path.join(temp, 'cars-cli-entrypoint-'));
  const alias = path.join(area, 'checkout alias');
  t.after(() => {
    const physical = fs.realpathSync(area), relative = path.relative(temp, physical);
    assert(relative.startsWith('cars-cli-entrypoint-') && path.dirname(relative) === '.' && !path.isAbsolute(relative));
    // Unlink the verified alias first so recursive fixture cleanup cannot reach
    // maintained source, even if filesystem traversal behavior changes.
    if (fs.existsSync(alias)) {
      assert(fs.lstatSync(alias).isSymbolicLink());
      assert.equal(fs.realpathSync(alias), root);
      fs.unlinkSync(alias);
    }
    fs.rmSync(physical, { recursive: true });
  });
  fs.symlinkSync(root, alias, process.platform === 'win32' ? 'junction' : 'dir');
  const run = args => spawnSync(process.execPath, args, {
    cwd: alias, encoding: 'utf8', timeout: 30_000, windowsHide: true,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_TERMINAL_PROMPT: '0' },
  });

  await t.test('physical and alias filenames identify the same entrypoint', () => {
    const url = pathToFileURL(path.join(root, 'scripts/check-workflow.mjs'));
    const entry = path.join(alias, 'scripts/check-workflow.mjs');
    assert.equal(isEntrypoint(url, entry), true);
    assert.equal(isEntrypoint(pathToFileURL(entry), fileURLToPath(url)), true);
    if (process.platform === 'win32') assert.equal(isEntrypoint(url, entry.toUpperCase()), true);
  });

  for (const command of [...guarded.filter(name => name !== 'check-workflow'), 'check-live-fab']) {
    await t.test(command + ' help actually executes through the alias', () => {
      const result = run(['scripts/' + command + '.mjs', '--help']);
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /Usage:/);
      assert.equal(result.stderr, '');
    });
  }

  await t.test('workflow validation prints its real report through the alias', () => {
    const result = run(['scripts/check-workflow.mjs']);
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.commandHelp, 'passed');
    assert(report.activeDocuments > 0);
    assert.equal(report.workspace.workingBranch, 'main');
  });

  await t.test('argument failures retain the CLI error exit code through the alias', () => {
    const result = run(['scripts/workspace-doctor.mjs', '--invalid-entrypoint-regression-argument']);
    assert.ifError(result.error);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /Unknown argument:/);
  });

  await t.test('importing guarded commands with no argv entry does not run their CLI', () => {
    const urls = guarded.map(name => pathToFileURL(path.join(alias, 'scripts', name + '.mjs')).href);
    const result = run(['--input-type=module', '--eval', 'for (const url of ' + JSON.stringify(urls) + ') await import(url);']);
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, '');
  });
});
