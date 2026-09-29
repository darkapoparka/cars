import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const base = process.env.DEALER_BASE_URL || process.env.BASE_URL;
const out = process.env.LOCALE_QA_OUT || path.resolve(import.meta.dirname, '../runtime/phase2/http-' + Date.now());
fs.mkdirSync(out, { recursive: true });
const results = [];
const request = (pathname, options = {}) => fetch(new URL(pathname, base), { redirect: 'manual', signal: AbortSignal.timeout(45000), ...options });
const record = async (name, action) => {
  try { results.push({ name, pass: true, ...await action() }); console.log('PASS ' + name); }
  catch (error) { results.push({ name, pass: false, error: error.message }); console.error('FAIL ' + name + ': ' + error.message); }
  fs.writeFileSync(path.join(out, 'RESULTS.json'), JSON.stringify({ checkedAt: new Date().toISOString(), base, scope: 'HTTP language precedence, mounted redirects, cache isolation, unsupported locales, write guards and preference security.', results }, null, 2));
};
for (const mount of (process.env.LOCALE_QA_MOUNTS?.split(',') ?? [''])) {
  await record(`${mount || 'auto-best'} old deep link negotiates once and retains its query`, async () => {
    const route = mount === '/variant-3' ? '/contact?intent=import&probe=keep' : '/contact?topic=trade-in&probe=keep';
    const response = await request(mount + route, { headers: { cookie: 'cars_locale=bg', 'accept-language': 'en' } });
    assert.equal(response.status, 307); assert.equal(new URL(response.headers.get('location'), base).pathname, mount + '/bg/contact');
    assert.equal(new URL(response.headers.get('location'), base).search, new URL(route, base).search);
    assert.match(response.headers.get('cache-control'), /private.*no-store/);
    return { status: response.status, location: response.headers.get('location'), cache: response.headers.get('cache-control') };
  });
  await record(`${mount || 'auto-best'} concurrent visitors cannot leak language or preferences`, async () => {
    const states = await Promise.all(Array.from({ length: 6 }, async (_, index) => {
      const locale = index % 2 ? 'bg' : 'en';
      const response = await request(`${mount}/${locale}/contact?topic=trade-in`, { headers: { cookie: `cars_locale=${locale === 'en' ? 'bg' : 'en'}; cars_country=${index % 2 ? 'BG' : 'DE'}; cars_prompt=v1`, 'accept-language': locale === 'en' ? 'bg' : 'en' } });
      const html = await response.text();
      assert.equal(response.status, 200); assert.match(html, new RegExp(`<html[^>]*lang=["']${locale}["']`));
      assert.match(response.headers.get('cache-control'), /private.*no-store/);
      assert.equal(response.headers.get('content-language'), locale);
      assert.equal(response.headers.has('set-cookie'), false);
      return { locale, status: response.status, contentLanguage: response.headers.get('content-language') };
    }));
    return { states };
  });
  await record(`${mount || 'auto-best'} Arabic is unavailable and writes stay blocked`, async () => {
    const arabic = await request(`${mount}/ar/contact`); assert.equal(arabic.status, 404);
    const write = await request(`${mount}/api/_locale_readonly_probe`, { method: 'POST', headers: { origin: new URL(base).origin, 'content-type': 'application/json' }, body: '{}' });
    assert.equal(write.status, 403); // Existing demo handlers deliberately return Forbidden, not Method Not Allowed.
    return { arabicStatus: arabic.status, publicWriteStatus: write.status };
  });
}
await record('Negotiation handles malformed cookies and quality-weighted language preferences', async () => {
  const response = await request('/contact?topic=trade-in', { headers: { cookie: 'cars_locale=%xx; cars_country=NOT-A-COUNTRY; cars_prompt=old', 'accept-language': 'en;q=0.2,bg-BG;q=0.9' } });
  assert.equal(response.status, 307); assert.equal(new URL(response.headers.get('location'), base).pathname, '/bg/contact');
  return { status: response.status, location: response.headers.get('location') };
});
const valid = { action: 'save', locale: 'bg', country: 'DE', returnTo: '/variant-3/en/contact?intent=import#form' };
const preference = (payload, extra = {}) => request('/api/preferences', { method: 'POST', headers: { origin: new URL(base).origin, 'content-type': 'application/json', ...extra }, body: JSON.stringify(payload) });
await record('Production-safe preference cookie attributes and destination', async () => {
  const response = await preference(valid); assert.equal(response.status, 200);
  assert.equal((await response.json()).destination, '/variant-3/bg/contact?intent=import#form');
  const cookies = response.headers.getSetCookie(); assert.equal(cookies.length, 3);
  for (const cookie of cookies) {
    assert.match(cookie, /Path=\//i); assert.match(cookie, /HttpOnly/i); assert.match(cookie, /SameSite=Lax/i); assert.match(cookie, /Max-Age=15552000/i); assert.doesNotMatch(cookie, /Domain=/i);
    if (base.startsWith('https:')) assert.match(cookie, /Secure/i);
  }
  assert.match(response.headers.get('cache-control'), /private.*no-store/);
  return { cookies, cache: response.headers.get('cache-control') };
});
await record('Preference endpoint rejects cross-origin, unknown locale, malformed and oversized input', async () => {
  const statuses = [];
  for (const [payload, headers, expected] of [
    [valid, { origin: 'https://invalid.example' }, 403],
    [{ ...valid, locale: 'ar' }, {}, 400],
    [{ ...valid, country: 'ZZ' }, {}, 400],
    [{ ...valid, returnTo: '//invalid.example' }, {}, 400],
    [{ ...valid, unexpected: true }, {}, 400],
    [{ ...valid, returnTo: '/' + 'x'.repeat(4100) }, {}, 413]
  ]) {
    const response = await preference(payload, headers); assert.equal(response.status, expected); assert.equal(response.headers.has('set-cookie'), false); statuses.push(response.status);
  }
  return { statuses };
});
const summary = { out, checks: results.length, passed: results.filter(result => result.pass).length, failed: results.filter(result => !result.pass).length };
console.log(JSON.stringify(summary)); if (summary.failed) process.exitCode = 1;
