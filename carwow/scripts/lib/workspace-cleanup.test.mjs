import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { resolveCleanupPath, planWorkspaceCleanup } from './workspace-cleanup.mjs';

test('cleanup rejects workspace root, outside paths, and tracked descendants', () => {
	const root = path.resolve('workspace');
	assert.throws(() => resolveCleanupPath(root, '.'), /outside/);
	assert.throws(() => resolveCleanupPath(root, '../private'), /outside/);
	assert.throws(() => resolveCleanupPath(root, '.tmp', ['.tmp/important.txt']), /tracked/);
	assert.equal(resolveCleanupPath(root, '.tmp'), path.join(root, '.tmp'));
});
test('planning preserves audit evidence and arbitrary owner files by default', async () => {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'carwow-cleanup-'));
	try {
		for (const dir of ['.tmp', '.audit', 'docs']) await fs.mkdir(path.join(root, dir));
		await fs.writeFile(path.join(root, 'owner-notes.txt'), 'keep me');
		assert.deepEqual(
			(await planWorkspaceCleanup(root, [])).map((item) => item.target),
			['.tmp']
		);
		assert.deepEqual(
			(await planWorkspaceCleanup(root, [], true)).map((item) => item.target),
			['.tmp', '.audit']
		);
		assert.equal(await fs.readFile(path.join(root, 'owner-notes.txt'), 'utf8'), 'keep me');
		await assert.rejects(planWorkspaceCleanup(root, ['.tmp/tracked-file']), /tracked/);
	} finally {
		await fs.rm(root, { recursive: true, force: true });
	}
});

test('planning rejects an ancestor junction that redirects a generated path outside the workspace', async () => {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'carwow-cleanup-root-'));
	const outside = await fs.mkdtemp(path.join(os.tmpdir(), 'carwow-cleanup-outside-'));
	try {
		await fs.mkdir(path.join(outside, 'output'));
		await fs.writeFile(path.join(outside, 'output', 'owner.txt'), 'keep');
		await fs.symlink(outside, path.join(root, '.vercel'), 'junction');
		await assert.rejects(planWorkspaceCleanup(root, []), /outside/);
		assert.equal(await fs.readFile(path.join(outside, 'output', 'owner.txt'), 'utf8'), 'keep');
	} finally {
		await fs.rm(root, { recursive: true, force: true });
		await fs.rm(outside, { recursive: true, force: true });
	}
});

test('planning refuses an ordinary file in place of an expected generated directory', async () => {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'carwow-cleanup-file-'));
	try {
		await fs.writeFile(path.join(root, '.tmp'), 'owner file');
		await assert.rejects(planWorkspaceCleanup(root, []), /not a file/);
	} finally {
		await fs.rm(root, { recursive: true, force: true });
	}
});
