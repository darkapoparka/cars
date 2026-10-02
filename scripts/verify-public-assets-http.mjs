import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const [directory, origin, reportFile] = process.argv.slice(2);
if (!directory || !origin || !reportFile) throw new Error('Usage: node scripts/verify-public-assets-http.mjs BUNDLE LOCAL-ORIGIN REPORT');
const url = new URL(origin);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) throw new Error('This exhaustive test is restricted to a local preview');
const receipt = JSON.parse(await fs.readFile(path.join(directory, 'receipt.json'), 'utf8'));
const cases = [...receipt.aliases, ...receipt.objects.filter(o => !o.path.startsWith('_cars/media/')).map(o => ({ source: '/' + o.path, sha256: o.sha256, bytes: o.bytes }))];
let cursor = 0; const failures = []; let checked = 0, transferredBytes = 0;
const startedAt = new Date().toISOString();
async function verify(item) {
  const response = await fetch(new URL(item.source, origin), { signal: AbortSignal.timeout(20000) });
  const body = Buffer.from(await response.arrayBuffer());
  const sha256 = createHash('sha256').update(body).digest('hex');
  if (response.status !== 200 || sha256 !== item.sha256 || body.length !== item.bytes) throw new Error('Status, size or content hash differs at ' + item.source);
  checked++; transferredBytes += body.length;
}
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < cases.length) {
    const item = cases[cursor++];
    try { await verify(item); } catch (e) { failures.push({ path: item.source, error: e.message }); }
  }
}));
const checks = [];
for (const item of receipt.aliases.slice(0, 8)) {
  try {
    await verify({ ...item, source: item.source + '?media-check=1' });
    const head = await fetch(new URL(item.source, origin), { method: 'HEAD' });
    checks.push({ check: 'query-and-head', path: item.source, pass: head.status === 200 && (await head.text()).length === 0 });
    const direct = await fetch(new URL(item.destination, origin));
    checks.push({ check: 'immutable-media-cache', pass: direct.status === 200 && /immutable/.test(direct.headers.get('cache-control') ?? '') });
    await direct.arrayBuffer();
  } catch (e) { failures.push({ path: item.source, error: e.message }); }
}
const missing = await fetch(new URL('/__missing_public_asset__.webp', origin));
checks.push({ check: 'missing-is-not-a-fake-success', pass: missing.status === 404 });
const result = { startedAt, completedAt: new Date().toISOString(), origin, dealer: receipt.dealer,
  checked, transferredBytes, checks, failures, passed: failures.length === 0 && checks.every(c => c.pass),
  scope: 'Local asset-only Cloudflare runtime: exact bytes, aliases, queries, HEAD, immutable caching and 404. Not HTML SSR or a live deployment.' };
await fs.writeFile(reportFile, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
if (!result.passed) process.exitCode = 1;
