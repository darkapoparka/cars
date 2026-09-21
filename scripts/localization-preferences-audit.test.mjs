import assert from 'node:assert/strict';
import test from 'node:test';
import { auditPreferences, preferenceAuditCases, normalizedReturnVectors } from './localization-preferences-audit.mjs';

function server({ mount = '', unsafe = false, cookieSuffix = '', changeDestination = false } = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url: url.href, options });
    assert.equal(url.href, `https://fixture.example${mount}/api/preferences`);
    assert.equal(options.redirect, 'manual'); assert.equal(options.method, 'POST');
    assert.equal(options.headers.origin, 'https://fixture.example');
    const json = options.headers['content-type'] === 'application/json';
    const data = json ? JSON.parse(options.body) : Object.fromEntries(new URLSearchParams(options.body));
    const headers = new Headers({ 'cache-control': 'private, no-store' });
    if (normalizedReturnVectors.includes(data.returnTo) && !unsafe) return new Response('{}', { status: 400, headers });
    let destination = new URL(data.returnTo, 'https://fixture.example').pathname + new URL(data.returnTo, 'https://fixture.example').search + new URL(data.returnTo, 'https://fixture.example').hash;
    if (data.action === 'save') destination = destination.replace('/en/contact', '/bg/contact');
    if (changeDestination) destination = '/bg';
    const cookie = value => headers.append('set-cookie', value + '; Path=/; Max-Age=15552000; HttpOnly; SameSite=Lax; Secure' + cookieSuffix);
    cookie('cars_prompt=v1');
    if (data.action === 'save') { cookie('cars_locale=bg'); cookie('cars_country=DE'); }
    if (!json) headers.set('location', destination);
    return new Response(json ? JSON.stringify({ destination }) : null, { status: json ? 200 : 303, headers });
  };
  return { calls, fetchImpl };
}
for (const mount of ['', '/variant-2', '/variant-3']) test(`preference audit tests safe native mount ${mount || 'root'} without following redirects`, async () => {
  const mock = server({ mount });
  const report = await auditPreferences({ baseUrl: 'https://fixture.example/', mount, fetchImpl: mock.fetchImpl });
  assert.equal(report.checks, 16); assert.equal(report.passed, 16); assert.equal(report.failed, 0);
  assert.equal(mock.calls.length, 16);
  assert.equal(report.sourceCommit, null, 'HTTP success must not invent a reviewed/deployed source');
  assert.ok(report.results.every(item => /^[a-f0-9]{64}$/.test(item.bodySha256)));
});
test('a successful deployment or a successful preference save cannot hide normalized open redirects', async () => {
  const report = await auditPreferences({ baseUrl: 'https://fixture.example/', fetchImpl: server({ unsafe: true }).fetchImpl });
  assert.equal(report.failed, 12); assert.equal(report.passed, 4);
  assert.ok(report.results.slice(0, 12).every(item => item.failures.length));
});
test('shared-domain cookies and a lost return route fail the audit', async () => {
  for (const options of [{ cookieSuffix: '; Domain=.vercel.app' }, { changeDestination: true }]) {
    const report = await auditPreferences({ baseUrl: 'https://fixture.example/', fetchImpl: server(options).fetchImpl });
    assert.equal(report.failed, 4);
  }
});
test('network failures remain failures and do not turn into a skipped or accepted check', async () => {
  const report = await auditPreferences({ baseUrl: 'https://fixture.example/', fetchImpl: async () => { throw new Error('offline fixture'); } });
  assert.equal(report.failed, 16); assert.equal(report.passed, 0);
});
test('invalid audit targets, ambiguous mounts and abbreviated source commits are rejected before any request', async () => {
  const fetchImpl = async () => { throw new Error('must not be called'); };
  for (const baseUrl of ['http://fixture.example/', 'https://user:pass@fixture.example/', 'https://fixture.example/path', 'https://fixture.example/?token=x']) await assert.rejects(auditPreferences({ baseUrl, fetchImpl }), /HTTPS origin/);
  await assert.rejects(auditPreferences({ baseUrl: 'https://fixture.example/', sourceCommit: 'abc123', fetchImpl }), /exact Git SHA/);
  assert.throws(() => preferenceAuditCases('/variant-4'), /Unsupported/);
});
