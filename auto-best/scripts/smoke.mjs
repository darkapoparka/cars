import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const suites = [
  'http-security-smoke', 'sveltekit-smoke', 'enquiry-smoke',
  'mobile-filter-smoke', 'home-browse-smoke', 'desktop-discovery-smoke', 'radius-smoke', 'phase4-smoke'
];
const args = process.argv.slice(2);
if (args.some(arg => arg !== '--preview') || args.length > 1) {
  throw new Error('Usage: node scripts/smoke.mjs [--preview]');
}
const ownedPreview = args.includes('--preview');
let server;
let child;
let interrupted = false;
const stop = () => { interrupted = true; child?.kill('SIGTERM'); };
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
try {
  let base = process.env.BASE_URL;
  if (ownedPreview) {
    // Start only after the build, on an OS-assigned loopback port. Never reuse or
    // stop another task's preview, and never rebuild beneath a running server.
    const { preview } = await import('vite');
    server = await preview({ root, preview: { host: '127.0.0.1', port: 0, strictPort: true, open: false } });
    const address = server.httpServer.address();
    if (!address || typeof address === 'string') throw new Error('Preview did not bind a TCP port');
    base = `http://127.0.0.1:${address.port}`;
  }
  if (!base) throw new Error('Set BASE_URL for an existing server, or run npm run smoke:preview after building.');
  const response = await fetch(new URL('/bg', base), { signal: AbortSignal.timeout(15000) });
  await response.body?.cancel();
  if (response.status !== 200) throw new Error(`Preview readiness failed: HTTP ${response.status}`);
  console.log(`Smoke target: ${base}${ownedPreview ? ' (owned fresh preview)' : ''}`);
  for (const suite of suites) {
    if (interrupted) { process.exitCode = 130; break; }
    const code = await new Promise((resolve, reject) => {
      child = spawn(process.execPath, [`scripts/${suite}.mjs`], {
        cwd: root, stdio: 'inherit', env: { ...process.env, BASE_URL: base }
      });
      child.once('error', reject);
      child.once('exit', code => resolve(code ?? 1));
    });
    child = undefined;
    if (code !== 0) { process.exitCode = interrupted ? 130 : code; break; }
  }
} finally {
  child?.kill('SIGTERM');
  process.removeListener('SIGINT', stop);
  process.removeListener('SIGTERM', stop);
  if (server) {
    await new Promise((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve());
      server.httpServer.closeAllConnections();
    });
    console.log('Owned smoke preview closed.');
  }
}
