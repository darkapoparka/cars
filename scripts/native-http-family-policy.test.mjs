import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../templates/auto-best/scripts/qa-locale-http.mjs', import.meta.url), 'utf8');
const start = source.indexOf('// BEGIN native HTTP family contract');
const end = source.indexOf('// END native HTTP family contract');
assert.ok(start >= 0 && end > start);
const policy = vm.runInNewContext(source.slice(start, end) + '\n({ readonlyProbeContract, validateQaMounts, assertReadonlyProbe })', { assert });
const response = (status, headers = {}) => new Response(null, { status, headers });

test('native HTTP uses exact Auto Best403, Modern403 and GET-only Import405 contracts', () => {
  for (const mount of ['', '/variant-2']) {
    const result = policy.assertReadonlyProbe(mount, response(403));
    assert.equal(result.publicWriteStatus, 403);
    assert.equal(result.publicWriteFamily, mount ? 'modern' : 'auto-best');
    assert.equal(result.publicWriteAllow, null);
  }
  const result = policy.assertReadonlyProbe('/variant-3', response(405, { Allow: 'GET, HEAD, OPTIONS' }));
  assert.equal(result.publicWriteFamily, 'import');
  assert.equal(result.publicWriteStatus, 405);
  assert.equal(result.publicWriteAllow, 'GET, HEAD, OPTIONS');
});

test('native HTTP refuses opposite family denial statuses and success', () => {
  for (const mount of ['', '/variant-2']) assert.throws(() => policy.assertReadonlyProbe(mount, response(405, { Allow: 'GET' })), /exact family contract/);
  for (const status of [200, 403, 404, 500]) assert.throws(() => policy.assertReadonlyProbe('/variant-3', response(status)), /exact family contract/);
  assert.throws(() => policy.readonlyProbeContract('/variant-4'), /Unknown native HTTP family/);
  assert.throws(() => policy.readonlyProbeContract('__proto__'), /Unknown native HTTP family/);
});

test('native HTTP denies unknown or duplicate mounts before its first request', () => {
  assert.equal(policy.validateQaMounts(['', '/variant-2', '/variant-3']).length, 3);
  assert.equal(policy.validateQaMounts(['']).length, 1);
  for (const mounts of [[], ['', ''], ['/variant-2/'], ['/variant-4'], ['', '/variant-2', '/variant-3', '/variant-4']]) assert.throws(() => policy.validateQaMounts(mounts));
  assert.ok(source.indexOf('const mounts = validateQaMounts(') < source.indexOf('fs.mkdirSync('));
  assert.ok(source.indexOf('const mounts = validateQaMounts(') < source.indexOf('const request ='));
});

test('correct status cannot conceal a redirect or response cookie', () => {
  for (const [mount, status] of [['', 403], ['/variant-2', 403], ['/variant-3', 405]]) {
    const headers = mount === '/variant-3' ? { Allow: 'GET, HEAD' } : {};
    assert.throws(() => policy.assertReadonlyProbe(mount, response(status, { ...headers, Location: '/bg/contact' })), /must not redirect/);
    assert.throws(() => policy.assertReadonlyProbe(mount, response(status, { ...headers, 'Set-Cookie': 'unexpected=value' })), /must not set cookies/);
  }
});

test('GET-only Import405 requires read-only Allow and preserves exact negative proof', () => {
  for (const allow of [undefined, '', 'POST', 'GET, POST', 'GET, DELETE', 'GET, GET', 'GET, UNKNOWN']) {
    assert.throws(() => policy.assertReadonlyProbe('/variant-3', response(405, allow === undefined ? {} : { Allow: allow })), /GET-only Import/);
  }
  assert.equal(policy.assertReadonlyProbe('/variant-3', response(405, { Allow: 'GET, HEAD' })).publicWriteStatus, 405);
});

test('original HTTP case names, inert payload and preference/security guards remain', () => {
  for (const name of ['old deep link negotiates once and retains its query', 'concurrent visitors cannot leak language or preferences', 'Arabic is unavailable and writes stay blocked', 'Negotiation handles malformed cookies and quality-weighted language preferences', 'Production-safe preference cookie attributes and destination', 'Preference endpoint rejects cross-origin, unknown locale, malformed and oversized input']) assert.ok(source.includes(name));
  assert.match(source, /redirect: 'manual'/);
  assert.match(source, /_locale_readonly_probe.*method: 'POST'.*body: '\{\}'/);
  assert.match(source, /const writeDenial = assertReadonlyProbe\(mount, write\)/);
  assert.match(source, /origin: 'https:\/\/invalid\.example' }, 403/);
  assert.match(source, /returnTo: '\/' \+ 'x'\.repeat\(4100\) }, {}, 413/);
  assert.match(source, /assert\.equal\(response\.headers\.has\('set-cookie'\), false\)/);
  assert.doesNotMatch(source, /from ['"][^'"]*scripts\/lib/);
});
