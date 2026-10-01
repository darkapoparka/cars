import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareReferenceAssets } from './prepare-reference-assets.mjs';

// Isolated local production preview. Hosted builds keep Next's normal output directory.
const mode = process.argv[2];
if (!['build', 'start'].includes(mode)) throw new Error('Expected build or start');
const root = fileURLToPath(new URL('../', import.meta.url));
const distDir = process.env.NEXT_DIST_DIR || (process.env.VERCEL ? '.next' : '.next-review');
const env = { ...process.env, NEXT_DIST_DIR: distDir };
// Next's relative client entries need the project-facing dependency paths on Windows.
// Preserve junction paths when dependencies live on another drive.
if (
  process.platform === 'win32' &&
  path.parse(fs.realpathSync(path.join(root, 'node_modules'))).root.toLowerCase() !==
    path.parse(root).root.toLowerCase()
) {
  env.NODE_OPTIONS = [
    process.env.NODE_OPTIONS,
    '--preserve-symlinks',
    '--preserve-symlinks-main',
  ].filter(Boolean).join(' ');
}
if (mode === 'build') await prepareReferenceAssets();
const port = Number(process.argv[3] || process.env.PORT || 6474);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid preview port');
const args =
  mode === 'build'
    ? ['build', '--webpack']
    : ['start', '--hostname', '127.0.0.1', '--port', String(port)];
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', ...args], {
  cwd: root,
  env,
  stdio: 'inherit',
  windowsHide: true,
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});
