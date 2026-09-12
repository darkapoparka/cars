import { realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

// Use the physical checkout on Windows, including when npm is run through a junction.
const root = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const extra = process.argv.slice(2);
if (extra.some((arg) => /^--(?:port|host|strictPort)(?:=|$)/.test(arg))) {
	console.error('This project uses http://127.0.0.1:6517. Run npm run dev without port overrides.');
	process.exit(1);
}
console.log(`Day & Night source: ${root}\nPreview: http://127.0.0.1:6517`);
const child = spawn(process.execPath, [
	resolve(root, 'node_modules/vite/bin/vite.js'), 'dev',
	'--host', '127.0.0.1', '--port', '6517', '--strictPort', ...extra
], { cwd: root, stdio: 'inherit', windowsHide: true });
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
