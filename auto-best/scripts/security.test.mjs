import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { createRequire } from 'node:module';

const source = await readFile(new URL('../src/lib/server/security.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { withSecurityHeaders } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('security headers cover immutable redirects without changing their destination', () => {
  const original = Response.redirect('https://example.test/bg', 307);
  assert.throws(() => original.headers.set('test', 'value'));
  const response = withSecurityHeaders(original);
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), 'https://example.test/bg');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'self'/);
  assert.equal(original.headers.has('x-content-type-options'), false);
});

test('security wrapping preserves error bodies, locale, private caching and independent cookies', async () => {
  const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store', Vary: 'Cookie, Accept-Language', 'Content-Language': 'bg' });
  headers.append('Set-Cookie', 'cars_locale=bg; Path=/; HttpOnly; SameSite=Lax');
  headers.append('Set-Cookie', 'cars_prompt=v1; Path=/; HttpOnly; SameSite=Lax');
  const original = new Response(JSON.stringify({ error: 'read_only' }), { status: 403, statusText: 'Forbidden', headers });
  const response = withSecurityHeaders(original);
  assert.equal(response.status, 403);
  assert.equal(response.statusText, 'Forbidden');
  for (const name of ['cache-control', 'content-type', 'vary', 'content-language']) assert.equal(response.headers.get(name), headers.get(name));
  assert.deepEqual(response.headers.getSetCookie(), headers.getSetCookie());
  assert.deepEqual(await response.json(), { error: 'read_only' });
});

test('hardening is idempotent and leaves bodyless HTTP responses bodyless', () => {
  for (const status of [204, 304]) {
    const once = withSecurityHeaders(new Response(null, { status }));
    const twice = withSecurityHeaders(once);
    assert.equal(twice.status, status);
    assert.equal(twice.body, null);
    assert.deepEqual([...twice.headers], [...once.headers]);
  }
});

// Exercise the cookie implementation actually resolved by Kit, not an unrelated direct install.
const kitRequire = createRequire(import.meta.resolve('@sveltejs/kit/package.json'));
const cookie = kitRequire('cookie');
test('Kit cookie serialization rejects attribute injection and retains valid locale cookies', () => {
  assert.throws(() => cookie.serialize('locale; injected', 'bg'), /invalid/);
  assert.throws(() => cookie.serialize('cars_locale', 'bg', { path: '/; SameSite=None' }), /invalid/);
  assert.throws(() => cookie.serialize('cars_locale', 'bg', { domain: 'example.test; HttpOnly' }), /invalid/);
  const value = cookie.serialize('cars_locale', 'bg', { path: '/', httpOnly: true, secure: true, sameSite: 'lax' });
  assert.equal(cookie.parse(value).cars_locale, 'bg');
  assert.match(value, /Path=\/; HttpOnly; Secure; SameSite=Lax/);
});
