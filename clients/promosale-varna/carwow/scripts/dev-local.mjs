import { realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
console.log(`Carwow source: ${root}`);
const child = spawn(
	process.execPath,
	[resolve(root, 'node_modules/vite/bin/vite.js'), 'dev', ...process.argv.slice(2)],
	{
		cwd: root,
		stdio: 'inherit',
		windowsHide: true
	}
);
child.on('error', (error) => {
	console.error(error.message);
	process.exitCode = 1;
});
child.on('exit', (code) => {
	process.exitCode = code ?? 1;
});
