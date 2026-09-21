import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const sha256 = value => createHash('sha256').update(value).digest('hex');
export const normalizedReturnVectors = Object.freeze([
  '/x/..//invalid.example/path', '/%2e%2e//invalid.example/', '/..//invalid.example/path?x=1'
]);
export function preferenceAuditCases(mount = '') {
  if (!['', '/variant-2', '/variant-3'].includes(mount)) throw new Error('Unsupported design mount');
  const cases = [];
  for (const returnTo of normalizedReturnVectors) for (const action of ['save', 'dismiss']) for (const format of ['json', 'form']) {
    cases.push({ name: `normalized-return ${action} ${format} ${returnTo}`, format, status: 400,
      payload: { action, locale: 'bg', country: 'DE', returnTo }, cookies: [] });
  }
  for (const action of ['save', 'dismiss']) for (const format of ['json', 'form']) {
    const returnTo = `${mount}/en/contact?topic=trade-in&reference=https%3A%2F%2Finvalid.example%2Foffer#form`;
    cases.push({ name: `valid ${action} ${format}`, format, status: format === 'json' ? 200 : 303,
      payload: { action, locale: 'bg', country: 'DE', returnTo },
      destination: action === 'save' ? returnTo.replace('/en/contact', '/bg/contact') : returnTo,
      cookies: action === 'save' ? ['cars_country=DE', 'cars_locale=bg', 'cars_prompt=v1'] : ['cars_prompt=v1'] });
  }
  return cases;
}
export async function auditPreferences({ baseUrl, mount = '', sourceCommit = null, fetchImpl = fetch }) {
  const base = new URL(baseUrl);
  if (base.username || base.password || base.search || base.hash || base.pathname !== '/' ||
      !(base.protocol === 'https:' || (base.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)))) {
    throw new Error('Use an HTTPS origin or a local HTTP fixture without credentials, query or path');
  }
  if (sourceCommit !== null && !/^[a-f0-9]{40}$/.test(sourceCommit)) throw new Error('Source commit must be an exact Git SHA');
  const cases = preferenceAuditCases(mount), results = [], startedAt = new Date().toISOString();
  for (const item of cases) {
    const headers = { origin: base.origin, 'sec-fetch-site': 'same-origin',
      'content-type': item.format === 'json' ? 'application/json' : 'application/x-www-form-urlencoded' };
    const body = item.format === 'json' ? JSON.stringify(item.payload) : new URLSearchParams(item.payload).toString();
    try {
      // Never follow a redirect or contact the inert example hostname. No business endpoint is invoked.
      const response = await fetchImpl(new URL(`${mount}/api/preferences`, base), {
        method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(30000), headers, body
      });
      const text = await response.text(), cookies = response.headers.getSetCookie();
      const location = response.headers.get('location'), failures = [];
      const require = (condition, message) => { if (!condition) failures.push(message); };
      require(response.status === item.status, `Expected HTTP ${item.status}; received ${response.status}`);
      require(/private\s*,\s*no-store|no-store\s*,\s*private/i.test(response.headers.get('cache-control') || ''), 'Missing private/no-store cache policy');
      let destination = null;
      if (item.destination) {
        if (item.format === 'json') { try { destination = JSON.parse(text).destination; } catch { failures.push('Invalid JSON response'); } }
        else destination = location;
        try { require(typeof destination === 'string' && new URL(destination, base).href === new URL(item.destination, base).href, 'Return route, locale, query or anchor changed'); }
        catch { failures.push('Invalid return destination'); }
      } else require(location === null, 'Rejected request must not redirect');
      require(JSON.stringify(cookies.map(cookie => cookie.split(';')[0]).sort()) === JSON.stringify(item.cookies), 'Unexpected preference cookie values or dismissal persisted a choice');
      for (const cookie of cookies) {
        const attributes = new Map(cookie.split(';').slice(1).map(value => {
          const [name, ...rest] = value.trim().split('='); return [name.toLowerCase(), rest.join('=')];
        }));
        require(attributes.get('path') === '/' && !attributes.has('domain'), 'Cookies must be host-only with Path=/');
        require(attributes.has('httponly') && attributes.get('samesite')?.toLowerCase() === 'lax', 'Missing HttpOnly/SameSite=Lax');
        require(base.protocol !== 'https:' || attributes.has('secure'), 'HTTPS cookie is missing Secure');
        const age = Number(attributes.get('max-age'));
        require(Number.isSafeInteger(age) && age > 0 && age <= 31536000, 'Invalid cookie expiry');
      }
      results.push({ name: item.name, passed: failures.length === 0, status: response.status,
        location, destination, cookies, cacheControl: response.headers.get('cache-control'),
        bodySha256: sha256(text), failures });
    } catch (error) { results.push({ name: item.name, passed: false, error: error.message }); }
  }
  return { schemaVersion: 1, startedAt, checkedAt: new Date().toISOString(), baseUrl: base.href, mount, sourceCommit,
    scope: 'Preference-only HTTP regression audit. No redirect following, business writes, whole-UI or browser acceptance.',
    checks: results.length, passed: results.filter(item => item.passed).length,
    failed: results.filter(item => !item.passed).length, results };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2), values = {};
    for (let index = 0; index < args.length; index += 2) {
      if (!['--base-url', '--mount', '--output', '--source-commit'].includes(args[index]) || args[index + 1] === undefined || Object.hasOwn(values, args[index])) throw new Error('Usage: node scripts/localization-preferences-audit.mjs --base-url ORIGIN --output FILE [--mount /variant-2|/variant-3] [--source-commit SHA]');
      values[args[index]] = args[index + 1];
    }
    if (!values['--base-url'] || !values['--output']) throw new Error('--base-url and --output are required');
    const output = path.resolve(values['--output']);
    if (fs.existsSync(output)) throw new Error('Refusing to replace an existing audit receipt');
    const report = await auditPreferences({ baseUrl: values['--base-url'], mount: values['--mount'] || '', sourceCommit: values['--source-commit'] || null });
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
    console.log(JSON.stringify({ output, checks: report.checks, passed: report.passed, failed: report.failed }));
    if (report.failed) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
