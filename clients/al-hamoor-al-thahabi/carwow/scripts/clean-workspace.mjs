import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { planWorkspaceCleanup } from './lib/workspace-cleanup.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
for (const arg of args) {
	if (!['--apply', '--include-audits'].includes(arg)) throw new Error(`Unknown option: ${arg}`);
}
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
	.split('\0')
	.filter(Boolean);
// Validate the entire plan before deleting anything. Audit evidence is opt-in, never a default target.
const plan = await planWorkspaceCleanup(root, tracked, args.has('--include-audits'));
for (const { target, absolute } of plan) {
	console.log(`${args.has('--apply') ? 'Removing' : 'Would remove'} ${target}`);
	if (args.has('--apply')) await fs.rm(absolute, { recursive: true, force: true, maxRetries: 2 });
}
if (!args.has('--apply'))
	console.log('Dry run only. Stop dev/preview servers before using --apply.');
if (!plan.length) console.log('No generated workspace directories found.');
