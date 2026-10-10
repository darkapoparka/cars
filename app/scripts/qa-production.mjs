import {readFile} from 'node:fs/promises';

const base = new URL(process.env.QA_BASE_URL ?? 'http://127.0.0.1:6473/');
if (!['http:', 'https:'].includes(base.protocol)) throw new Error('QA_BASE_URL must be an HTTP(S) URL.');
base.pathname = base.pathname.replace(/\/$/, '') + '/';
base.search = ''; base.hash = '';
// Relative URL construction intentionally preserves a mounted dealer base path.
const urlFor = route => new URL(route.replace(/^\//, ''), base).href;
const dealer = JSON.parse(await readFile('lib/dealer.json', 'utf8'));
const inventory = JSON.parse(await readFile('lib/dealer-inventory.json', 'utf8'));
const slugs = dealer.mode === 'dealer' ? inventory.slice(0, 2).map(vehicle => vehicle.slug) : ['2024-toyota-fortuner-exr', '2023-suzuki-ciaz-glx'];
const journeys = ['', '/cars', '/saved', '/sell', '/sell/details', '/finance', '/service', '/service/details', '/more', '/search', '/stores'];
const routes = [...new Set(dealer.enabledLocales.flatMap(locale => [
  ...['', '/2'].flatMap(variant => journeys.map(route => '/' + locale + variant + route)),
  '/' + locale + '/2/services', ...slugs.map(slug => '/' + locale + '/cars/' + encodeURIComponent(slug)),
]))];

async function checkRoutes() {
  const results = [];
  for (const route of routes) {
    const response = await fetch(urlFor(route), {redirect: 'follow', signal: AbortSignal.timeout(30000)});
    const body = await response.text();
    const ok = response.status === 200 && !/Internal Server Error|Application error/i.test(body);
    results.push({route, status: response.status, ok});
    console.log(`${ok ? 'PASS' : 'FAIL'} ${response.status} ${route}`);
  }
  if (results.some(result => !result.ok)) throw new Error('Production route checks failed.');
  return results;
}
try {
  const results = await checkRoutes();
  console.log('QA complete: ' + results.length + ' routes.');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
