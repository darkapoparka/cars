import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { previewUrl } from './browser.mjs';

const base = previewUrl();
const cases = [
  ['locale redirect', '/', 'GET', 307],
  ['unsupported locale', '/ar', 'GET', 404],
  ['localized document', '/bg', 'GET', 200],
  ['localized HEAD', '/en', 'HEAD', 200],
  ['unknown route', '/bg/unknown-audit-route', 'GET', 404],
  ['read-only rejection', '/bg', 'POST', 403],
  ['preferences method', '/api/preferences', 'GET', 405],
  ['preferences origin', '/api/preferences', 'POST', 403],
  ['legacy redirect', '/bg/home02?make=BMW', 'GET', 308]
];
const results = [];
await mkdir('artifacts/http-security', { recursive: true });
try {
  for (const [name, path, method, status] of cases) {
    // No valid preference mutation, enquiry delivery or external destination is requested.
    const response = await fetch(base + path, { method, redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'Accept-Language': 'bg' } });
    assert.equal(response.status, status, name);
    for (const [header, value] of [['x-content-type-options', 'nosniff'], ['x-frame-options', 'SAMEORIGIN'], ['referrer-policy', 'strict-origin-when-cross-origin']]) {
      assert.equal(response.headers.get(header), value, `${name}: ${header}`);
    }
    assert.match(response.headers.get('content-security-policy') ?? '', /object-src 'none'/, name);
    assert.match(response.headers.get('permissions-policy') ?? '', /camera=\(\)/, name);
    if (name === 'legacy redirect') assert.equal(response.headers.get('location'), '/bg?make=BMW');
    if (name.startsWith('preferences') || name === 'read-only rejection') assert.match(response.headers.get('cache-control') ?? '', /no-store/, name);
    results.push({ name, status, pass: true });
    await response.body?.cancel();
  }
  console.log(`PASS ${results.length} HTTP response/security contracts`);
} finally {
  await writeFile('artifacts/http-security/report.json', JSON.stringify({ base, results, expectedCases: cases.length }, null, 2) + '\n');
}
